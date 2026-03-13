const fs = require('fs');
let content = fs.readFileSync('app/quadratics/page.tsx', 'utf8');

// 1. Add import
if (!content.includes('VertexAxisDeterminationViz')) {
  content = content.replace(
    'import TangentCoefficientDeterminationViz from "./components/TangentCoefficientDeterminationViz";',
    'import TangentCoefficientDeterminationViz from "./components/TangentCoefficientDeterminationViz";\nimport VertexAxisDeterminationViz from "../../components/VertexAxisDeterminationViz";'
  );

  // 2. Add to array
  content = content.replace(
    "{ id: 63, title: '接する条件から係数を決定', type: 'tangent_coefficient_determination' },",
    "{ id: 63, title: '接する条件から係数を決定', type: 'tangent_coefficient_determination' },\n  { id: 64, title: '頂点と軸から2次関数を決定', type: 'vertex_axis_determination' },"
  );

  // 3. Add to switch/if
  content = content.replace(
    "{currentLevel === 63 && <TangentCoefficientDeterminationViz />}",
    "{currentLevel === 63 && <TangentCoefficientDeterminationViz />}\n        {currentLevel === 64 && <VertexAxisDeterminationViz />}"
  );

  fs.writeFileSync('app/quadratics/page.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("Already patched");
}
