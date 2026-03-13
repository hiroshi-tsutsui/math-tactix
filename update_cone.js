const fs = require('fs');

const path = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
if (!content.includes('ConeShortestPathViz')) {
    content = content.replace(
        "import CyclicQuadrilateralViz from '../../components/CyclicQuadrilateralViz';",
        "import CyclicQuadrilateralViz from '../../components/CyclicQuadrilateralViz';\nimport ConeShortestPathViz from '../../components/ConeShortestPathViz';"
    );
}

// Update menu
content = content.replace(
    "{ id: 14, title: \"Level 14: 実践演習\", desc: \"三角比の基礎マスター試験\", icon: Trophy }",
    "{ id: 14, title: \"Level 14: 円錐の最短経路\", desc: \"展開図と余弦定理を用いた応用\", icon: Target },\n                      { id: 15, title: \"Level 15: 実践演習\", desc: \"三角比の基礎マスター試験\", icon: Trophy }"
);

// Update level block for the quiz
content = content.replace(
    "Level 14: Tactics Mode (Quiz)",
    "Level 15: Tactics Mode (Quiz)"
);
content = content.replace(
    "{level === 14 && (",
    "{level === 15 && ("
);

// Add the new level render
const newLevel = `
      {/* Level 14: Cone Shortest Path */}
      {level === 14 && (
          <ConeShortestPathViz />
      )}
`;

content = content.replace(
    "{/* Level 15: Tactics Mode (Quiz) */}",
    newLevel + "\n      {/* Level 15: Tactics Mode (Quiz) */}"
);

fs.writeFileSync(path, content);
console.log("Updated page.tsx with ConeShortestPathViz");
