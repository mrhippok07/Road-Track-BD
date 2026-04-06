const fs = require("fs");
const path = require("path");

const basePath = process.cwd();
const assetsDir = path.join(basePath, "frontend", "assets");

// Rename logo
const oldLogoName = "road Track BD app logo.png";
const newLogoName = "logo.png";
if (fs.existsSync(path.join(assetsDir, oldLogoName))) {
    fs.renameSync(path.join(assetsDir, oldLogoName), path.join(assetsDir, newLogoName));
    console.log("Renamed logo to logo.png");
}

// Remove old icons
["icon-192.png", "icon-512.png"].forEach(file => {
    let filePath = path.join(assetsDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Deleted old icon: " + file);
    }
});

// Update manifest.json
const manifestPath = path.join(basePath, "frontend", "manifest.json");
if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, "utf8");
    manifest = manifest.replace(/icon-192\.png/g, "logo.png").replace(/icon-512\.png/g, "logo.png");
    fs.writeFileSync(manifestPath, manifest);
    console.log("Updated manifest.json");
}

// Update HTML & CSS
const htmlFiles = [
    "frontend/index.html",
    "frontend/pages/dashboard.html",
    "frontend/pages/report.html",
    "frontend/pages/feed.html",
    "frontend/pages/volunteer.html"
];

const oldNavRegex = /<div\s+class="flag-icon">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
const newNavHTML = `<img src="/assets/logo.png" alt="Road Track BD Logo" class="brand-logo" />`;

const cssRemoveRegex = /\.flag-icon\s*{[^}]*}\s*\.flag-bg\s*{[^}]*}\s*\.flag-circle\s*{[^}]*}/g;
const newCSS = `.brand-logo { height: 36px; width: auto; object-fit: contain; }`;

htmlFiles.forEach(file => {
    let filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");
        
        let changed = false;
        if (content.match(oldNavRegex)) {
            content = content.replace(oldNavRegex, newNavHTML);
            changed = true;
        }
        
        if (content.match(cssRemoveRegex)) {
            content = content.replace(cssRemoveRegex, newCSS);
            changed = true;
        } else if (!content.includes(".brand-logo")) {
             // fallback insert CSS if regex misses
             content = content.replace("</style>", newCSS + "\n</style>");
             changed = true;
        }

        // Update mobile css fix for the nav-brand
        content = content.replace(
            /\.nav-brand span\.brand-title \{ display: none !important; \}/g,
            `.nav-brand span.brand-title { display: none !important; }\n    .brand-logo { height: 28px !important; }`
        );
        
        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log("Updated HTML/CSS in: " + file);
        }
    }
});