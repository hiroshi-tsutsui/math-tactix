const fs = require('fs');
const content = fs.readFileSync('../../HEARTBEAT.md', 'utf8');
const entry = '- [x] Math Tactix Update: Level 40 (連立1次不等式の解法) added. Build successful.\n';
fs.writeFileSync('../../HEARTBEAT.md', content + entry);
console.log('Appended to HEARTBEAT.md');
