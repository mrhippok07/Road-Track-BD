const fs = require("fs");
const content = fs.readFileSync("frontend/assets/js/main.js", "utf8");
const start = content.search(/function openAuthModal/);
const end = content.search(/function handleAuthSubmit/);
if (start > -1 && end > -1) {
    console.log(content.substring(start, end));
} else {
    console.log("NOT FOUND ", start, end);
}