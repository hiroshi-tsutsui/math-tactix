const fs = require('fs');

const path = 'app/quadratics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('ChordLengthViz')) {
  content = content.replace('import VertexOnLineViz from "../../components/VertexOnLineViz";', 'import VertexOnLineViz from "../../components/VertexOnLineViz";\nimport ChordLengthViz from "../../components/ChordLengthViz";');
}

// 2. Add LEVEL
if (!content.includes('id: 60')) {
  content = content.replace("{ id: 59, title: '2次関数の決定 (頂点が直線上にある)', type: 'vertex_on_line' },", "{ id: 59, title: '2次関数の決定 (頂点が直線上にある)', type: 'vertex_on_line' },\n  { id: 60, title: '放物線の弦の長さ', type: 'chord_length' },");
}

// 3. Add to Switch or Render
if (!content.includes('{currentLevel === 60 && <ChordLengthViz />}')) {
  content = content.replace('{currentLevel === 59 && <VertexOnLineViz />}', '{currentLevel === 59 && <VertexOnLineViz />}\n        {currentLevel === 60 && <ChordLengthViz />}');
}

fs.writeFileSync(path, content);
console.log("Updated page.tsx");
