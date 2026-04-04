require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const reportRoutes = require('./routes/reports').router || require('./routes/reports');
const authRoutes = require('./routes/auth').router || require('./routes/auth');
const feedRoutes = require('./routes/feed').router || require('./routes/feed');
const volunteerRoutes = require('./routes/volunteers').router || require('./routes/volunteers');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }
});

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'অনেক বেশি রিকোয়েস্ট, কিছুক্ষণ পরে চেষ্টা করুন' }
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Ensure data directory exists for persistent storage
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
['reports.json', 'users.json', 'comments.json'].forEach(f => {
    const fp = path.join(dataDir, f);
    if (!fs.existsSync(fp)) fs.writeFileSync(fp, f === 'comments.json' ? '{}' : '[]', 'utf8');
});
app.use('/uploads', express.static(uploadDir));

const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));

app.get('/api/config', (req, res) => {
    res.json({ googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || '' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), version: '2.0.0' });
});

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/volunteers', volunteerRoutes);

const activeUsers = new Map();

io.on('connection', (socket) => {
    activeUsers.set(socket.id, { time: new Date() });
    io.emit('active_users', activeUsers.size);

    socket.on('report_new', (data) => {
        socket.broadcast.emit('report_update', data);
    });

    socket.on('disconnect', () => {
        activeUsers.delete(socket.id);
        io.emit('active_users', activeUsers.size);
    });
});

app.set('socketio', io);

const serveFile = (file) => (req, res) =>
    res.sendFile(path.join(frontendDir, file));

app.get('/', serveFile('index.html'));
app.get('/dashboard', serveFile('pages/dashboard.html'));
app.get('/feed', serveFile('pages/feed.html'));
app.get('/report', serveFile('pages/report.html'));
app.get('/register', serveFile('pages/register.html'));
app.get('/volunteer', serveFile('pages/volunteer.html'));

app.use((req, res) => res.status(404).json({ success: false, message: 'পেজ পাওয়া যায়নি' }));

app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ success: false, message: 'সার্ভারে সমস্যা হয়েছে' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Road Track BD চালু — http://localhost:${PORT}\n`);
});

module.exports = { app, io };