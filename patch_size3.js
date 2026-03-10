const fs = require('fs');
const file = 'app/quadratics/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('currentLevel === 36')) {
    const vizRender = `{currentLevel === 36 && (\n                  <TwoParabolasSizeViz />\n                )}\n                `;
    content = content.replace("{currentLevel === 35 && (\n                  <ExternalTangentViz />\n                )}", "{currentLevel === 35 && (\n                  <ExternalTangentViz />\n                )}\n                " + vizRender);
    fs.writeFileSync(file, content);
}
console.log("Patched 3");
