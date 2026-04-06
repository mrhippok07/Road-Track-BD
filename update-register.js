const fs = require("fs");
const path = require("path");
const filePath = path.join(process.cwd(), "frontend", "pages", "register.html");

const newNavHTML = `<img src="/assets/logo.png" alt="Road Track BD Logo" class="brand-logo" />`;
const oldNavRegex = /<div\s+class="flag-icon">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
const cssRemoveRegex = /\.flag-icon\s*{[^}]*}\s*\.flag-bg\s*{[^}]*}\s*\.flag-circle\s*{[^}]*}/g;
const newCSS = `.brand-logo { height: 36px; width: auto; object-fit: contain; }`;

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.match(oldNavRegex)) {
        content = content.replace(oldNavRegex, newNavHTML);
        if (content.match(cssRemoveRegex)) {
            content = content.replace(cssRemoveRegex, newCSS);
        } else {
             content = content.replace("</style>", newCSS + "\n</style>");
        }
        
        // Also mobile fix
        content = content.replace(
            /\.nav-brand span\.brand-title \{ display: none !important; \}/g,
            `.nav-brand span.brand-title { display: none !important; }\n    .brand-logo { height: 28px !important; }`
        );
        fs.writeFileSync(filePath, content);
        console.log("Updated register.html");
    }
}