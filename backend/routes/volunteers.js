const express = require('express');
const { users } = require('./auth');
const { reports } = require('./reports');

const router = express.Router();

router.get('/', (req, res) => {
    const { limit } = req.query;
    const list = users.map(u => {
        const { password: _, ...safe } = u;
        safe.reportCount = reports.filter(r => r.userId === u.id).length;
        return safe;
    });
    const result = limit ? list.slice(0, parseInt(limit)) : list;
    res.json({ success: true, data: result });
});

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'পাওয়া যায়নি' });
    const { password: _, ...safe } = user;
    safe.reportCount = reports.filter(r => r.userId === user.id).length;
    res.json({ success: true, data: safe });
});

module.exports = router;