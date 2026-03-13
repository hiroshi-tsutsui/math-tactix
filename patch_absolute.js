const fs = require('fs');

const path = 'app/quadratics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('AbsoluteInequalityAllRealsViz')) {
  content = content.replace("import XInterceptsDeterminationViz from \"../../components/XInterceptsDeterminationViz\";", "import XInterceptsDeterminationViz from \"../../components/XInterceptsDeterminationViz\";\nimport AbsoluteInequalityAllRealsViz from \"../../components/AbsoluteInequalityAllRealsViz\";");
}

let newId = 67;

const newLevelStr = `
  {
    id: 67,
    title: "すべての実数で成り立つ2次不等式 (絶対不等式)",
    desc: "ax² + bx + c > 0 がすべての実数xで成り立つ条件を視覚的に確認します。",
    type: "viz",
    component: AbsoluteInequalityAllRealsViz
  },
  {
    id: 68,
    title: "最終確認",
    type: "quiz"
  }
];`;

content = content.replace(/\{\s*id:\s*67,\s*title:\s*"最終確認",\s*type:\s*"quiz"\s*\}\s*\];/, newLevelStr);

fs.writeFileSync(path, content);
console.log('Replaced');
