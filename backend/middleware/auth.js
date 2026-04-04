const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET || 'rtbd-secret-key-change-in-production';
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'অননুমোদিত অ্যাক্সেস' });
    }
    const token = header.slice(7);
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ success: false, message: 'টোকেন পাওয়া যায়নি' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch(e) {
        console.error('JWT Verify Error:', e.message);
        return res.status(401).json({ success: false, message: 'টোকেন অবৈধ বা মেয়াদ উত্তীর্ণ' });
    }
}

function optionalAuth(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET || 'rtbd-secret-key-change-in-production';
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
        try {
            req.user = jwt.verify(header.slice(7), JWT_SECRET);
        } catch { }
    }
    next();
}

module.exports = { requireAuth, optionalAuth };