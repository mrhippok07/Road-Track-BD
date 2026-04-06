const fs = require("fs");
const path = require("path");

const htmlFiles = [
    "frontend/index.html",
    "frontend/pages/dashboard.html",
    "frontend/pages/report.html",
    "frontend/pages/feed.html",
    "frontend/pages/volunteer.html"
];

htmlFiles.forEach(file => {
    let filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");
        
        // Remove rogue global hide
        content = content.replace(/\.nav-links\s*\{\s*display:\s*none;?\s*\}/g, "");
        
        // Remove rogue mobile strict hide
        content = content.replace(/\.nav-links\s*\{\s*display:\s*none\s*!important;?\s*\}/g, "");
        
        // Ensure nav-links displays on desktop
        content = content.replace(/(\.nav-links\s*\{[^}]*display:)([^;\}]+)/g, "$1 flex");
        
        // If it still doesn't have display: flex in the main declaration
        if (content.includes(".nav-links {") && !content.match(/\.nav-links\s*\{[^}]*display:\s*flex/)) {
            content = content.replace(/\.nav-links\s*\{/, ".nav-links { display: flex; ");
        }

        fs.writeFileSync(filePath, content);
        console.log("Cleaned nav-links in: " + file);
    }
});