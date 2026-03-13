const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add import
if (!content.includes('import VertexOnLineViz')) {
  // Find the last component import from ../../components/
  const importRegex = /import [A-Za-z0-9_]+ from "\.\.\/\.\.\/components\/[^"]+";/g;
  let lastMatch;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastMatch = match;
  }
  
  if (lastMatch) {
    const insertPos = lastMatch.index + lastMatch[0].length;
    content = content.slice(0, insertPos) + '\nimport VertexOnLineViz from "../../components/VertexOnLineViz";' + content.slice(insertPos);
  } else {
    // fallback
    content = 'import VertexOnLineViz from "../../components/VertexOnLineViz";\n' + content;
  }
}

// 2. Add Level to Sidebar
if (!content.includes('Level 60: 2次関数の決定 (頂点が直線上にある)')) {
  const sidebarSection = `{ level: 59, label: "Level 59: 放物線の弦の長さ" },`;
  content = content.replace(sidebarSection, `${sidebarSection}\n        { level: 60, label: "Level 60: 2次関数の決定 (頂点が直線上にある)" },`);
}

// 3. Add to rendering logic
if (!content.includes('{currentLevel === 60 && <VertexOnLineViz />}')) {
  const renderSection = `{currentLevel === 59 && <ChordLengthViz />}`;
  content = content.replace(renderSection, `${renderSection}\n        {currentLevel === 60 && <VertexOnLineViz />}`);
}

fs.writeFileSync(pagePath, content);
console.log('Patched app/quadratics/page.tsx');
