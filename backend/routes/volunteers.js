const express = require('express');
const { users } = require('./auth');
const { reports } = require('./reports');

const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, (req, res) => {
    const { limit } = req.query;
    const list = users.map(u => {
        const { password: _, nid, phone, address, dob, ...safe } = u;
        if (req.user) {
            safe.phone = phone;
            safe.nid = nid;
            safe.address = address;
            safe.dob = dob;
        } else {
            safe.phone = 'লগইন করুন';
            safe.nid = 'লগইন করুন';
        }
        safe.reportCount = reports.filter(r => r.userId === u.id).length;
        return safe;
    });
    const result = limit ? list.slice(0, parseInt(limit)) : list;
    res.json({ success: true, data: result });
});

router.get('/:id', optionalAuth, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'পাওয়া যায়নি' });
    const { password: _, nid, phone, address, dob, ...safe } = user;
    if (req.user) {
        safe.phone = phone;
        safe.nid = nid;
        safe.address = address;
        safe.dob = dob;
    } else {
        safe.phone = 'লগইন করুন';
        safe.nid = 'লগইন করুন';
    }
    safe.reportCount = reports.filter(r => r.userId === user.id).length;
    res.json({ success: true, data: safe });
});

module.exports = router;