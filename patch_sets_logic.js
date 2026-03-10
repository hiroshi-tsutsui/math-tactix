const fs = require('fs');
const file = 'app/sets_logic/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Level 2 to menu
content = content.replace(
  '{ id: 1, title: "Level 1: ド・モルガンの法則", desc: "集合の演算とベン図の視覚的証明", icon: Compass }',
  '{ id: 1, title: "Level 1: ド・モルガンの法則", desc: "集合の演算とベン図の視覚的証明", icon: Compass },\n                      { id: 2, title: "Level 2: 必要条件と十分条件", desc: "PとQの包含関係を視覚化", icon: Search },\n                      { id: 3, title: "Level 3: 逆・裏・対偶", desc: "命題の真偽と集合の包含関係", icon: SplitSquareHorizontal }'
);

// Add title logic
content = content.replace(
  'level === 1 ? "ド・モルガンの法則" : "必要条件と十分条件"',
  'level === 1 ? "ド・モルガンの法則" : level === 2 ? "必要条件と十分条件" : "逆・裏・対偶"'
);

// Add Level 3 render logic
const level3Code = `
      {level === 3 && (
          <ContrapositiveViz />
      )}
`;

content = content.replace(
  '{level === 2 && (\n          <NecessarySufficientViz />\n      )}',
  '{level === 2 && (\n          <NecessarySufficientViz />\n      )}\n' + level3Code
);

fs.writeFileSync(file, content);
