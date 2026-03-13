const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes("id: 59")) {
  const level58Str = "{ id: 58, title: '2次関数の決定 (最大・最小から係数決定)', type: 'max_min_coefficient_determination' },";
  content = content.replace(level58Str, `${level58Str}\n  { id: 59, title: '2次関数の決定 (頂点が直線上にある)', type: 'vertex_on_line' },`);
}

if (!content.includes("{currentLevel === 59")) {
  const render58Str = "{currentLevel === 58 && <MaxMinCoefficientDeterminationViz />}";
  content = content.replace(render58Str, `${render58Str}\n        {currentLevel === 59 && <VertexOnLineViz />}`);
}

fs.writeFileSync(pagePath, content);
console.log("Patched 59!");
