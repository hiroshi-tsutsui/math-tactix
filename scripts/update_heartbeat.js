const fs = require('fs');
let content = fs.readFileSync('/Users/tsutsuihiroshi/.openclaw/workspace/HEARTBEAT.md', 'utf8');

// replace last math tactix entry or just append to System Issues
if (content.includes('- [ ] System Issues:')) {
  content = content.replace('- [ ] System Issues:', '- [x] Math Tactix Update: Level 42 (比例式の値) added. Build successful.\n- [ ] System Issues:');
} else {
  content += '\n- [x] Math Tactix Update: Level 42 (比例式の値) added. Build successful.';
}

fs.writeFileSync('/Users/tsutsuihiroshi/.openclaw/workspace/HEARTBEAT.md', content);
