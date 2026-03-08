const fs = require('fs');
let content = fs.readFileSync('app/quadratics/page.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  "import { generateAbsoluteValueMaxMinProblem } from './utils/absolute-value-max-min-generator';",
  "import { generateAbsoluteValueMaxMinProblem } from './utils/absolute-value-max-min-generator';\nimport { generateDiscriminantProblem } from './utils/discriminant-generator';"
);

content = content.replace(
  "import { AbsoluteValueMaxMinViz } from './components/AbsoluteValueMaxMinViz';",
  "import { AbsoluteValueMaxMinViz } from './components/AbsoluteValueMaxMinViz';\nimport DiscriminantViz from './components/DiscriminantViz';"
);

// 2. Add to `const levels`
content = content.replace(
  "{ id: 18, title: '絶対値関数の最大・最小', type: 'absolute_value_max_min' },",
  "{ id: 18, title: '絶対値関数の最大・最小', type: 'absolute_value_max_min' },\n  { id: 19, title: '判別式とグラフの共有点', type: 'discriminant' },"
);

// 3. Add to switch statement in `generateProblem`
content = content.replace(
  "case 'absolute_value_max_min':\n          newProblem = generateAbsoluteValueMaxMinProblem();\n          break;",
  "case 'absolute_value_max_min':\n          newProblem = generateAbsoluteValueMaxMinProblem();\n          break;\n        case 'discriminant':\n          newProblem = generateDiscriminantProblem();\n          break;"
);

// 4. Add the component to render
content = content.replace(
  "{currentLevel === 18 && (\n                  <AbsoluteValueMaxMinViz />\n                )}",
  "{currentLevel === 18 && (\n                  <AbsoluteValueMaxMinViz />\n                )}\n                {currentLevel === 19 && (\n                  <DiscriminantViz />\n                )}"
);

fs.writeFileSync('app/quadratics/page.tsx', content);
console.log('patched');
