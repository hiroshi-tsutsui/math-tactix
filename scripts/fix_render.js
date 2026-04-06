const fs = require('fs');
const path = './app/quadratics/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// Fix render
if (!content.includes('currentLevel === 53')) {
  content = content.replace(
    /\{currentLevel === 52 && <VerticalSegmentMaxViz \/>\}/g,
    `{currentLevel === 52 && <VerticalSegmentMaxViz />}\n        {currentLevel === 53 && <FenceEnclosureViz />}`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed render.');
