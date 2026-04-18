const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { optionalAuth, requireAuth } = require('../middleware/auth');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/reports.json');

function readReports() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

function saveReports(reports) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf8');
    } catch (e) {
        console.error('Save failed:', e.message);
    }
}

let reports = readReports();

const VALID_TYPES = [
    'broken', 'pothole', 'waterlogged', 'dangerous', 'unpaved', 'narrow',
    'nolight', 'erosion', 'bridge_repair', 'bridge_new', 'road_bridge_new',
    'culvert_new', 'culvert_repair', 'embankment_new', 'embankment_repair',
    'canal_small', 'canal_large', 'under_repair',
    'tube_well_needed', 'tube_well_repair', 'chor_development', 'opinion',
    'railway_repair', 'railway_new', 'railway_station_new',
    'bus_station_repair', 'bus_station_new'
];
const VALID_STATUSES = ['pending', 'under_repair', 'repaired', 'rejected'];
const AUTO_DELETE_DAYS = 30;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images allowed'));
    }
});

function isExpired(report) {
    const lastUpdate = report.updatedAt || report.createdAt;
    if (!lastUpdate) return false;
    return Date.now() - new Date(lastUpdate).getTime() > AUTO_DELETE_DAYS * 86400000;
}

function cleanExpired() {
    const before = reports.length;
    for (let i = reports.length - 1; i >= 0; i--) {
        if (isExpired(reports[i])) reports.splice(i, 1);
    }
    if (reports.length < before) saveReports(reports);
}

setInterval(cleanExpired, 3600000);





router.get('/', optionalAuth, (req, res) => {
    cleanExpired();
    const { page = 1, limit = 20, type, status } = req.query;
    let filtered = [...reports];
    if (type && type !== 'all') filtered = filtered.filter(r => r.problemType === type);
    if (status && status !== 'all') filtered = filtered.filter(r => r.status === status && r.problemType !== 'opinion');
    filtered.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
    const start = (parseInt(page) - 1) * parseInt(limit);
    const { users } = require('./auth');
    let slice = filtered.slice(start, start + parseInt(limit)).map(r => {
        const u = users.find(u => u.id === r.userId);
        return { ...r, avatar: u?.avatar || null, icon: u?.icon || null, role: u?.role || null };
    });
    if (!req.user) {
        slice = slice.map(r => ({ ...r, reporterPhone: 'লগইন করুন' }));
    }
    res.json({ success: true, total: filtered.length, page: parseInt(page), data: slice });
});

router.get('/markers', optionalAuth, (req, res) => {
    cleanExpired();
    const { type } = req.query;
    let list = reports.filter(r => r.lat && r.lng && r.problemType !== 'opinion');
    if (type && type !== 'all') list = list.filter(r => r.problemType === type);
    const markers = list.map(r => ({
        _id: r._id, roadName: r.roadName, district: r.district, area: r.area,
        problemType: r.problemType, status: r.status, description: r.description,
        lat: r.lat, lng: r.lng, createdAt: r.createdAt, updatedAt: r.updatedAt
    }));
    if (!req.user) {
        markers.forEach(m => m.reporterPhone = 'লগইন করুন');
    }
    res.json({ success: true, data: markers });
});

router.get('/stats', (req, res) => {
    cleanExpired();
    const today = new Date().toDateString();
    const allReports = reports.filter(r => r.problemType !== 'opinion');
    const allOpinions = reports.filter(r => r.problemType === 'opinion');
    const total = allReports.length;
    const totalOpinions = allOpinions.length;
    const pending = allReports.filter(r => r.status === 'pending').length;
    const underRepair = allReports.filter(r => r.status === 'under_repair').length;
    const resolved = allReports.filter(r => r.status === 'repaired').length;
    const todayCount = allReports.filter(r => new Date(r.createdAt).toDateString() === today).length;
    const todayOpinions = allOpinions.filter(r => new Date(r.createdAt).toDateString() === today).length;
    const byType = {};
    const byDistrict = {};
    allReports.forEach(r => {
        byType[r.problemType] = (byType[r.problemType] || 0) + 1;
        if (r.district && r.district !== '-') byDistrict[r.district] = (byDistrict[r.district] || 0) + 1;
    });
    const now = new Date();
    const trend7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return allReports.filter(r => new Date(r.createdAt).toDateString() === d.toDateString()).length;
    });
    const mlabels = ['\u099c\u09be\u09a8\u09c1','\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1','\u09ae\u09be\u09b0\u09cd\u099a','\u098f\u09aa\u09cd\u09b0\u09bf\u09b2','\u09ae\u09c7','\u099c\u09c1\u09a8','\u099c\u09c1\u09b2\u09be\u0987','\u0986\u0997\u09b8\u09cd\u099f','\u09b8\u09c7\u09aa\u09cd\u099f\u09c7','\u0985\u0995\u09cd\u099f\u09cb','\u09a8\u09ad\u09c7','\u09a1\u09bf\u09b8\u09c7'];
    const cm = now.getMonth();
    const monthly = {
        labels: Array.from({ length: 6 }, (_, i) => mlabels[(cm - 5 + i + 12) % 12]),
        new: Array(6).fill(0), resolved: Array(6).fill(0)
    };
    allReports.forEach(r => {
        const idx = (new Date(r.createdAt).getMonth() - (cm - 5) + 12) % 12;
        if (idx >= 0 && idx < 6) { monthly.new[idx]++; if (r.status === 'repaired') monthly.resolved[idx]++; }
    });
    res.json({ success: true, data: { total, totalOpinions, pending, underRepair, resolved, today: todayCount, todayOpinions, byType, byDistrict, trend7, monthly } });
});


router.get('/me/list', requireAuth, (req, res) => {
    const list = reports.filter(r => r.userId === req.user.id);
    res.json({ success: true, data: list });
});

router.get('/:id', optionalAuth, (req, res) => {
    const r = reports.find(r => r._id === req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Report not found' });
    const safeReport = { ...r };
    if (!req.user) safeReport.reporterPhone = 'লগইন করুন';
    res.json({ success: true, data: safeReport });
});

router.post('/', requireAuth, upload.array('photos', 3), [
    body('problemType').isIn(VALID_TYPES).withMessage('Invalid problem type'),
    body('roadName').trim().notEmpty().withMessage('Road name required'),
    body('district').trim().notEmpty().withMessage('District required'),
    body('area').trim().notEmpty().withMessage('Area required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    if (req.body.lat && (lat < 20 || lat > 27 || lng < 88 || lng > 93)) {
        return res.status(400).json({ success: false, message: 'Location outside Bangladesh' });
    }
    const photos = (req.files || []).map(f => `/uploads/${f.filename}`);
    const now = new Date().toISOString();
    const report = {
        _id: uuidv4(),
        problemType: req.body.problemType,
        status: VALID_STATUSES.includes(req.body.status) ? req.body.status : 'pending',
        roadName: req.body.roadName.trim(),
        roadNumber: req.body.roadNumber || '',
        district: req.body.district.trim(),
        area: req.body.area.trim(),
        description: (req.body.description || '').trim(),
        reporterName: (req.body.reporterName || '').trim(),
        reporterPhone: (req.body.reporterPhone || '').trim(),
        lat: req.body.lat ? lat : null,
        lng: req.body.lng ? lng : null,
        photos,
        userId: req.user ? req.user.id : null,
        likes: 0, reactions: 0, commentCount: 0,
        likedBy: [], reactedBy: [],
        createdAt: now, updatedAt: now, resolvedAt: null
    };
    reports.unshift(report);
    saveReports(reports);
    const io = req.app.get('socketio');
    if (io) io.emit('report_update', report);
    res.status(201).json({ success: true, message: 'Report submitted successfully', data: report });
});

router.put('/:id/status', optionalAuth, (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const idx = reports.findIndex(r => r._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Report not found' });
    const now = new Date().toISOString();
    reports[idx].status = status;
    reports[idx].updatedAt = now;
    reports[idx].resolvedAt = (status === 'repaired' || status === 'rejected') ? now : null;
    saveReports(reports);
    const io = req.app.get('socketio');
    if (io) io.emit('report_update', reports[idx]);
    res.json({ success: true, data: reports[idx] });
});

router.delete('/:id', requireAuth, (req, res) => {
    const idx = reports.findIndex(r => r._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Report not found' });
    if (reports[idx].userId !== req.user.id && req.user.role !== '\u09b8\u09b0\u0995\u09be\u09b0\u09bf\u0995\u09b0\u09cd\u09ae\u0995\u09b0\u09cd\u09a4\u09be') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const io = req.app.get('socketio');
    if (io) io.emit('report_deleted', req.params.id);
    reports.splice(idx, 1);
    saveReports(reports);
    res.json({ success: true, message: 'Report deleted' });
});

module.exports = { router, reports, saveReports };