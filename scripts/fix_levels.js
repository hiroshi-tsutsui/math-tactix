const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'app/quadratics/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Imports
if (!page.includes('import RightTriangleRectangleViz')) {
  page = page.replace(
    'import InscribedPerimeterViz from "./components/InscribedPerimeterViz";',
    'import InscribedPerimeterViz from "./components/InscribedPerimeterViz";\nimport QuadraticInequalityGraphViz from "./components/QuadraticInequalityGraphViz";\nimport RightTriangleRectangleViz from "../components/RightTriangleRectangleViz";\nimport MovingPointAreaViz from "../components/MovingPointAreaViz";'
  );
}

// Sidebar or menu list? How are levels defined?
// They might be in a levels array in page.tsx
if (!page.includes('{ id: 51,')) {
  page = page.replace(
    '{ id: 48, title: "放物線に内接する長方形の周の長さの最大化", path: "/quadratics?level=48", generator: null }',
    '{ id: 48, title: "放物線に内接する長方形の周の長さの最大化", path: "/quadratics?level=48", generator: null },\n          { id: 49, title: "2次不等式の解とグラフの関係", path: "/quadratics?level=49", generator: null },\n          { id: 50, title: "直角三角形に内接する長方形の面積の最大値", path: "/quadratics?level=50", generator: null },\n          { id: 51, title: "2次関数の最大・最小の応用 (動点と面積)", path: "/quadratics?level=51", generator: null }'
  );
}

// Render components
if (!page.includes('currentLevel === 51')) {
  page = page.replace(
    '{currentLevel === 48 && <InscribedPerimeterViz />}',
    '{currentLevel === 48 && <InscribedPerimeterViz />}\n        {currentLevel === 49 && <QuadraticInequalityGraphViz />}\n        {currentLevel === 50 && <RightTriangleRectangleViz />}\n        {currentLevel === 51 && <MovingPointAreaViz />}'
  );
}

fs.writeFileSync(pagePath, page);
console.log('Fixed levels in app/quadratics/page.tsx');
