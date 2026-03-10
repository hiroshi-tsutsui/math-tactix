const fs = require('fs');
const file = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Level 12 to the menu
content = content.replace(
  '{ id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },',
  '{ id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },\n                      { id: 12, title: "Level 12: ヘロンの公式", desc: "三辺から面積を直接求める", icon: Target },'
);
content = content.replace(
  '{ id: 12, title: "Level 12: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }',
  '{ id: 13, title: "Level 13: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }'
);

// 2. Fix the title header
content = content.replace(
  'level === 10 ? "角の二等分線 (Angle Bisector)" :',
  'level === 10 ? "角の二等分線 (Angle Bisector)" :\n             level === 11 ? "空間図形・測量 (Surveying)" :\n             level === 12 ? "ヘロンの公式 (Heron\'s Formula)" :'
);

// 3. Fix the rendering logic at the bottom
const renderBlock = `
      {/* Level 9: Equations & Inequalities */}
      {level === 9 && (
          <TrigEqIneqViz />
      )}

      {/* Level 10: Angle Bisector */}
      {level === 10 && (
          <AngleBisectorViz />
      )}

      {/* Level 11: Surveying */}
      {level === 11 && (
          <SurveyingViz />
      )}

      {/* Level 12: Heron's Formula */}
      {level === 12 && (
          <HeronsFormulaViz />
      )}

      {/* Level 13: Tactics Mode (Quiz) */}
      {level === 13 && (
`;

content = content.replace(
/\{\/\* Level 9: Equations & Inequalities \*\/\}.*?\{\/\* Level 11: Tactics Mode \(Quiz\) \*\/\}\s*\{level === 10 && \(/s,
  renderBlock.trim() + ' ('
);

fs.writeFileSync(file, content);
