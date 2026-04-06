const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'app/quadratics/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

if (!page.includes('MovingPointAreaViz')) {
  // Add import
  if (page.includes('import RightTriangleRectangleViz')) {
    page = page.replace(
      'import RightTriangleRectangleViz from "../../components/RightTriangleRectangleViz";',
      'import RightTriangleRectangleViz from "../../components/RightTriangleRectangleViz";\nimport MovingPointAreaViz from "../../components/MovingPointAreaViz";'
    );
  } else {
    // Fallback if import is different
    page = page.replace(
      'import QuadraticInequalityGraphViz',
      'import MovingPointAreaViz from "../../components/MovingPointAreaViz";\nimport QuadraticInequalityGraphViz'
    );
  }
  
  // Add the section below level 50
  const sectionStr = `
          {activeSection === "level50" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 50: 直角三角形に内接する長方形の面積の最大値</h2>
              <RightTriangleRectangleViz />
            </div>
          )}
`;
  
  const newSectionStr = `
          {activeSection === "level50" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 50: 直角三角形に内接する長方形の面積の最大値</h2>
              <RightTriangleRectangleViz />
            </div>
          )}

          {activeSection === "level51" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 51: 2次関数の最大・最小の応用 (動点と面積)</h2>
              <MovingPointAreaViz />
            </div>
          )}
`;
  
  if (page.includes('activeSection === "level50"')) {
    page = page.replace(
      /\{\s*activeSection === "level50"[\s\S]*?<\/div>\s*\)\s*\}/,
      newSectionStr.trim()
    );
  } else {
    console.log("Could not find level50 section to replace.");
  }
  
  // Add to menu
  page = page.replace(
    '{ id: "level50", title: "Level 50: 2次関数の最大・最小の応用 (図形)" }',
    '{ id: "level50", title: "Level 50: 2次関数の最大・最小の応用 (図形)" },\n    { id: "level51", title: "Level 51: 2次関数の最大・最小の応用 (動点と面積)" }'
  );
  
  fs.writeFileSync(pagePath, page);
  console.log('Updated app/quadratics/page.tsx with Level 51');
} else {
  console.log('Level 51 already exists.');
}
