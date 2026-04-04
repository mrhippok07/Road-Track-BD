const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { optionalAuth, requireAuth } = require('../middleware/auth');

const router = express.Router();
// Persistent Storage
const DATA_FILE = path.join(__dirname, '../data/reports.json');

function readReports() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveReports(reports) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf8');
    } catch (e) {
        console.error('❌ রিপোর্ট সংরক্ষণ ব্যর্থ:', e.message);
    }
}

// Load reports into memory on startup; keep in-sync with file
let reports = readReports();

// Constants
const VALID_TYPES = [
    'broken', 'pothole', 'waterlogged', 'dangerous', 'unpaved', 'narrow',
    'nolight', 'erosion', 'bridge_repair', 'bridge_new', 'road_bridge_new',
    'culvert_new', 'culvert_repair', 'embankment_new', 'embankment_repair',
    'canal_small', 'canal_large', 'under_repair',
    'tube_well_needed', 'tube_well_repair', 'chor_development'
];
const VALID_STATUSES = ['pending', 'under_repair', 'repaired', 'rejected'];
const AUTO_DELETE_DAYS = 30;

// File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('শুধুমাত্র ছবি আপলোড করা যাবে'));
    }
});

// Auto-Delete: Remove dots older than 30 days from last update
function isExpired(report) {
    const lastUpdate = report.updatedAt || report.createdAt;
    if (!lastUpdate) return false;
    const diff = Date.now() - new Date(lastUpdate).getTime();
    return diff > AUTO_DELETE_DAYS * 24 * 60 * 60 * 1000;
}

function cleanExpired() {
    const before = reports.length;
    for (let i = reports.length - 1; i >= 0; i--) {
        if (isExpired(reports[i])) reports.splice(i, 1);
    }
    if (reports.length < before) {
        console.log(`🗑️ ${before - reports.length} টি মেয়াদোত্তীর্ণ রিপোর্ট মুছে গেছে`);
        saveReports(reports);
    }
}
// Run cleanup every hour
setInterval(cleanExpired, 60 * 60 * 1000);

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/reports — paginated list
router.get('/', optionalAuth, (req, res) => {
    cleanExpired();
    const { page = 1, limit = 20, type, status } = req.query;
    let filtered = [...reports];
    if (type) filtered = filtered.filter(r => r.problemType === type);
    if (status) filtered = filtered.filter(r => r.status === status);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (parseInt(page) - 1) * parseInt(limit);
    const slice = filtered.slice(start, start + parseInt(limit));
    res.json({ success: true, total: filtered.length, page: parseInt(page), data: slice });
});

// GET /api/reports/markers — map dots
router.get('/markers', (req, res) => {
    cleanExpired();
    const { type } = req.query;
    let list = reports.filter(r => r.lat && r.lng);
    if (type && type !== 'all') list = list.filter(r => r.problemType === type);
    const markers = list.map(r => ({
        _id: r._id, roadName: r.roadName, district: r.district, area: r.area,
        problemType: r.problemType, status: r.status, description: r.description,
        lat: r.lat, lng: r.lng, createdAt: r.createdAt, updatedAt: r.updatedAt
    }));
    res.json({ success: true, data: markers });
});

// GET /api/reports/stats — analytics
router.get('/stats', (req, res) => {
    cleanExpired();
    const today = new Date().toDateString();
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const underRepair = reports.filter(r => r.status === 'under_repair').length;
    const resolved = reports.filter(r => r.status === 'repaired').length;
    const todayCount = reports.filter(r => new Date(r.createdAt).toDateString() === today).length;

    const byType = {};
    const byDistrict = {};
    reports.forEach(r => {
        byType[r.problemType] = (byType[r.problemType] || 0) + 1;
        if (r.district) byDistrict[r.district] = (byDistrict[r.district] || 0) + 1;
    });

    const now = new Date();
    const trend7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return reports.filter(r => new Date(r.createdAt).toDateString() === d.toDateString()).length;
    });

    const monthLabels = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
    const currentMonth = now.getMonth();
    const monthly = {
        labels: Array.from({ length: 6 }, (_, i) => monthLabels[(currentMonth - 5 + i + 12) % 12]),
        new: Array(6).fill(0),
        resolved: Array(6).fill(0)
    };
    reports.forEach(r => {
        const rMonth = new Date(r.createdAt).getMonth();
        const idx = (rMonth - (currentMonth - 5) + 12) % 12;
        if (idx >= 0 && idx < 6) {
            monthly.new[idx]++;
            if (r.status === 'repaired') monthly.resolved[idx]++;
        }
    });

    res.json({ success: true, data: { total, pending, underRepair, resolved, today: todayCount, byType, byDistrict, trend7, monthly } });
});

// GET /api/reports/:id — single report
router.get('/:id', (req, res) => {
    const r = reports.find(r => r._id === req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' });
    res.json({ success: true, data: r });
});

// POST /api/reports — create report
router.post('/', requireAuth, upload.array('photos', 3), [
    body('problemType').isIn(VALID_TYPES).withMessage('সমস্যার ধরন সঠিক নয়'),
    body('roadName').trim().notEmpty().withMessage('রাস্তার নাম দিতে হবে'),
    body('district').trim().notEmpty().withMessage('জেলা দিতে হবে'),
    body('area').trim().notEmpty().withMessage('এলাকা দিতে হবে')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    if (req.body.lat && (lat < 20 || lat > 27 || lng < 88 || lng > 93)) {
        return res.status(400).json({ success: false, message: 'লোকেশন বাংলাদেশের বাইরে' });
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
        createdAt: now,
        updatedAt: now,
        resolvedAt: null
    };
    reports.unshift(report);
    saveReports(reports);

    const io = req.app.get('socketio');
    if (io) io.emit('report_update', report);

    res.status(201).json({ success: true, message: 'রিপোর্ট সফলভাবে জমা হয়েছে', data: report });
});

// PUT /api/reports/:id/status — update status
router.put('/:id/status', optionalAuth, (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'অবস্থা সঠিক নয়' });
    }
    const idx = reports.findIndex(r => r._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' });

    const now = new Date().toISOString();
    reports[idx].status = status;
    reports[idx].updatedAt = now;
    if (status === 'repaired' || status === 'rejected') {
        reports[idx].resolvedAt = now;
    } else {
        reports[idx].resolvedAt = null;
    }
    saveReports(reports);

    const io = req.app.get('socketio');
    if (io) io.emit('report_update', reports[idx]);
    res.json({ success: true, data: reports[idx] });
});

// GET /api/reports/me/list — get current user's reports
router.get('/me/list', requireAuth, (req, res) => {
    const list = reports.filter(r => r.userId === req.user.id);
    res.json({ success: true, data: list });
});

// DELETE /api/reports/:id — delete a specific report
router.delete('/:id', requireAuth, (req, res) => {
    const idx = reports.findIndex(r => r._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' });

    if (reports[idx].userId !== req.user.id && req.user.role !== 'সরকারিকর্মকর্তা') {
        return res.status(403).json({ success: false, message: 'অনুমতি নেই' });
    }
    const io = req.app.get('socketio');
    if (io) io.emit('report_deleted', req.params.id);

    reports.splice(idx, 1);
    saveReports(reports);
    res.json({ success: true, message: 'রিপোর্ট মুছে ফেলা হয়েছে' });
});

module.exports = { router, reports };