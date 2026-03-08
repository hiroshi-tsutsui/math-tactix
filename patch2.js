const fs = require('fs');
let content = fs.readFileSync('app/quadratics/page.tsx', 'utf-8');

content = content.replace(
  "{currentLevel === 18 && (\n                  <AbsoluteValueMaxMinViz problem={problem} isCorrect={false} />\n                )}",
  "{currentLevel === 18 && (\n                  <AbsoluteValueMaxMinViz problem={problem} isCorrect={false} />\n                )}\n                {currentLevel === 19 && (\n                  <DiscriminantViz />\n                )}"
);

fs.writeFileSync('app/quadratics/page.tsx', content);
