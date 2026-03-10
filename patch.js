const fs = require('fs');
const path = 'app/quadratics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '{currentLevel === 36 && (\n                  <TwoParabolasSizeViz />\n                )}',
  '{currentLevel === 36 && (\n                  <TwoParabolasSizeViz />\n                )}\n                {currentLevel === 37 && (\n                  <DifferenceFunctionViz />\n                )}'
);

fs.writeFileSync(path, content);
console.log('patched rendering');
