const fs = require('fs');
const pageFile = 'app/quadratics/page.tsx';
let pageCode = fs.readFileSync(pageFile, 'utf8');

// Imports
if (!pageCode.includes('IndependentVariablesViz')) {
  const insertIndex = pageCode.indexOf('import ShapeOptimizationViz');
  pageCode = pageCode.slice(0, insertIndex) +
    "import { generateIndependentVariablesProblem } from './utils/independent-variables-generator';\n" +
    "import IndependentVariablesViz from './components/IndependentVariablesViz';\n" +
    pageCode.slice(insertIndex);
}

// Level menu
if (!pageCode.includes("type: 'independent_variables'")) {
  pageCode = pageCode.replace(
    "{ id: 38, title: '定義域の右端が動く最大・最小', type: 'moving_right_edge' },",
    "{ id: 38, title: '定義域の右端が動く最大・最小', type: 'moving_right_edge' },\n  { id: 39, title: '2変数関数の最大・最小 (独立変数)', type: 'independent_variables' },"
  );
}

// Generator case
if (!pageCode.includes("case 'independent_variables':")) {
  pageCode = pageCode.replace(
    "case 'moving_right_edge':\n          newProblem = generateMovingRightEdgeProblem();",
    "case 'independent_variables':\n          newProblem = generateIndependentVariablesProblem();\n          break;\n        case 'moving_right_edge':\n          newProblem = generateMovingRightEdgeProblem();"
  );
}

// Viz render case
if (!pageCode.includes("<IndependentVariablesViz />")) {
  pageCode = pageCode.replace(
    "case 'moving_right_edge':\n          return <MovingRightEdgeViz />;",
    "case 'independent_variables':\n          return <IndependentVariablesViz />;\n        case 'moving_right_edge':\n          return <MovingRightEdgeViz />;"
  );
}

fs.writeFileSync(pageFile, pageCode);
console.log('Patched page.tsx successfully.');
