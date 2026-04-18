const fs = require('fs');
const file = 'backend/data/users.json';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/"icon":\s*"🤝"/g, '"icon": "<i class=\\"fa-solid fa-handshake\\"></i>"');
data = data.replace(/"icon":\s*"🏗️"/g, '"icon": "<i class=\\"fa-solid fa-helmet-safety\\"></i>"');
data = data.replace(/"icon":\s*"🏛️"/g, '"icon": "<i class=\\"fa-solid fa-building-columns\\"></i>"');
fs.writeFileSync(file, data);
console.log('Fixed users.json');
