const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
// Persistent Storage
const DATA_FILE = path.join(__dirname, '../data/users.json');

function readUsers() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (e) {
        console.error('❌ ব্যবহারকারী সংরক্ষণ ব্যর্থ:', e.message);
    }
}

let users = readUsers();

// ─── Avatar Upload ─────────────────────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
});
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('শুধুমাত্র ছবি আপলোড করা যাবে'));
    }
});

const validateRegister = [
    body('name').trim().notEmpty().withMessage('নাম দিতে হবে').isLength({ max: 100 }),
    body('phone').matches(/^01[3-9]\d{8}$/).withMessage('সঠিক বাংলাদেশি ফোন নম্বর দিন'),
    body('password').isLength({ min: 6 }).withMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
    body('role').isIn(['স্বেচ্ছাসেবক', 'ঠিকাদার', 'সরকারিকর্মকর্তা']).withMessage('ভূমিকা সঠিক নয়'),
    body('nid').isLength({ min: 10, max: 10 }).withMessage('আপনার ১০ সংখ্যার সঠিক এনআইডি নাম্বার দিন'),
    body('dob').notEmpty().withMessage('জন্ম তারিখ দিতে হবে')
];

function makeToken(user) {
    const JWT_SECRET = process.env.JWT_SECRET || 'rtbd-secret-key-change-in-production';
    return jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function safeUser(user) {
    const { password: _, ...safe } = user;
    return safe;
}

router.post('/register', validateRegister, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { name, phone, password, role, nid, dob, job, address } = req.body;
    if (users.find(u => u.phone === phone)) {
        return res.status(409).json({ success: false, message: 'এই ফোন নম্বর ইতিমধ্যে নিবন্ধিত' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = {
        id: uuidv4(), name: name.trim(), phone, password: hashed,
        role, nid: nid.trim(), dob, job: job || '', address: address || '',
        points: 0, reportCount: 0,
        avatar: null,
        icon: role === 'ঠিকাদার' ? '🏗️' : role === 'সরকারিকর্মকর্তা' ? '🏛️' : '🤝',
        isFirstLogin: true,
        createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    res.json({ success: true, token: makeToken(user), user: safeUser(user) });
});

router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ success: false, message: 'ফোন ও পাসওয়ার্ড দিতে হবে' });
    }
    const user = users.find(u => u.phone === phone);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'ফোন নম্বর বা পাসওয়ার্ড ভুল' });
    }
    const token = makeToken(user);
    res.json({ success: true, message: 'লগইন সফল হয়েছে', token, user: safeUser(user) });
});

// GET /api/auth/me — get current user
router.get('/me', requireAuth, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
    res.json({ success: true, user: safeUser(user) });
});

// POST /api/auth/avatar — upload profile picture
router.post('/avatar', requireAuth, uploadAvatar.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'ছবি আপলোড করুন' });
    const idx = users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
    users[idx].avatar = `/uploads/${req.file.filename}`;
    saveUsers(users);
    res.json({ success: true, avatar: users[idx].avatar });
});

// PUT /api/auth/profile — update profile data
router.put('/profile', requireAuth, (req, res) => {
    const idx = users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });

    const { name, nid, job, address, dob } = req.body;
    if (name && name.trim()) users[idx].name = name.trim();
    if (nid !== undefined) users[idx].nid = nid.trim();
    if (job !== undefined) users[idx].job = job.trim();
    if (address !== undefined) users[idx].address = address.trim();
    if (dob !== undefined) users[idx].dob = dob.trim();

    // Mark first login as done
    users[idx].isFirstLogin = false;
    saveUsers(users);
    
    // Re-issue token with updated info
    const token = makeToken(users[idx]);
    res.json({ success: true, message: 'প্রোফাইল আপডেট হয়েছে', token, user: safeUser(users[idx]) });
});

// DELETE /api/auth/profile — delete user account
router.delete('/profile', requireAuth, (req, res) => {
    const idx = users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
    
    // Anonymize their legacy points/activity but wipe their account from DB
    users.splice(idx, 1);
    saveUsers(users);
    res.json({ success: true, message: 'প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে' });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { phone, nid, newPassword } = req.body;
    if (!phone || !nid || !newPassword) {
        return res.status(400).json({ success: false, message: 'সবগুলো তথ্য সঠিকভাবে দিন' });
    }
    const userIdx = users.findIndex(u => u.phone === phone && u.nid === nid);
    if (userIdx === -1) {
        return res.status(401).json({ success: false, message: 'ফোন নম্বর বা এনআইডি নম্বর মিলেনি' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে' });
    }
    users[userIdx].password = await bcrypt.hash(newPassword, 12);
    saveUsers(users);
    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' });
});

module.exports = { router, users };