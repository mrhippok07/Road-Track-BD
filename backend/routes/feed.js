const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { requireAuth } = require("../middleware/auth");
const reportsModule = require("./reports");
const authModule = require("./auth");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "../data/comments.json");

function readComments() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf8");
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
    } catch { return {}; }
}

function saveComments(comments) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2), "utf8"); }
    catch (e) { console.error("Save comments failed:", e.message); }
}

let comments = readComments();


router.get("/:id/comments", (req, res) => {
    res.json({ success: true, data: comments[req.params.id] || [] });
});


router.post("/:id/comments", requireAuth, (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const reports = reportsModule.reports;
    const report = reports.find(r => r._id === req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    const users = authModule.users;
    const fullUser = users.find(u => u.id === req.user.id);
    const authorName = fullUser ? fullUser.name : (req.user.name || "User");
    const authorAvatar = fullUser ? (fullUser.avatar || null) : null;

    const comment = {
        _id: uuidv4(), reportId: req.params.id,
        authorId: req.user.id, authorName, authorAvatar,
        text: text.trim(), createdAt: new Date().toISOString()
    };

    if (!comments[req.params.id]) comments[req.params.id] = [];
    comments[req.params.id].push(comment);
    report.commentCount = (report.commentCount || 0) + 1;
    saveComments(comments);
    if (typeof reportsModule.saveReports === "function") reportsModule.saveReports(reports);

    const io = req.app.get("socketio");
    if (io) {
        io.emit("comment_new", { reportId: req.params.id, comment });
        io.emit("report_update", report);
    }
    res.status(201).json({ success: true, data: comment });
});


router.post("/:id/like", requireAuth, (req, res) => {
    const reports = reportsModule.reports;
    const report = reports.find(r => r._id === req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    const uid = req.user.id;
    if (!report.likedBy) report.likedBy = [];
    const idx = report.likedBy.indexOf(uid);
    let liked;
    if (idx === -1) { report.likedBy.push(uid); report.likes = (report.likes || 0) + 1; liked = true; }
    else { report.likedBy.splice(idx, 1); report.likes = Math.max(0, (report.likes || 1) - 1); liked = false; }
    res.json({ success: true, likes: report.likes, liked });
});


router.post("/:id/react", requireAuth, (req, res) => {
    const reports = reportsModule.reports;
    const report = reports.find(r => r._id === req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    const uid = req.user.id;
    if (!report.reactedBy) report.reactedBy = [];
    const idx = report.reactedBy.indexOf(uid);
    let reacted;
    if (idx === -1) { report.reactedBy.push(uid); report.reactions = (report.reactions || 0) + 1; reacted = true; }
    else { report.reactedBy.splice(idx, 1); report.reactions = Math.max(0, (report.reactions || 1) - 1); reacted = false; }
    res.json({ success: true, reactions: report.reactions, reacted });
});

module.exports = router;