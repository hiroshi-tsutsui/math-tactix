const fs = require('fs');
const file = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{\/\* Level 13: Tactics Mode \(Quiz\) \*\/\}.*?\<main className=/s,
  '{/* Level 13: Tactics Mode (Quiz) */}\n      {level === 13 && (\n          <main className='
);

fs.writeFileSync(file, content);
