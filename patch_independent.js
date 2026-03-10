const fs = require('fs');

const utilsIndexFile = 'app/quadratics/utils/index.ts';
let utilsIndex = fs.readFileSync(utilsIndexFile, 'utf8');
if (!utilsIndex.includes('generateIndependentVariablesProblem')) {
  utilsIndex += `\nexport { generateIndependentVariablesProblem } from './independent-variables-generator';\n`;
  fs.writeFileSync(utilsIndexFile, utilsIndex);
}

const pageFile = 'app/quadratics/page.tsx';
let pageCode = fs.readFileSync(pageFile, 'utf8');

// Add import for viz
if (!pageCode.includes('IndependentVariablesViz')) {
  pageCode = pageCode.replace(
    "import ExternalTangentViz from './components/ExternalTangentViz';",
    "import ExternalTangentViz from './components/ExternalTangentViz';\nimport IndependentVariablesViz from './components/IndependentVariablesViz';"
  );
}

// Add level
if (!pageCode.includes("type: 'independent_variables'")) {
  pageCode = pageCode.replace(
    "type: 'moving_right_edge' },",
    "type: 'moving_right_edge' },\n  { id: 39, title: '2変数関数の最大・最小 (独立変数)', type: 'independent_variables' },"
  );
}

// Add generator
if (!pageCode.includes('generateIndependentVariablesProblem()')) {
  pageCode = pageCode.replace(
    "case 'moving_right_edge':\n          newProblem = {",
    "case 'independent_variables':\n          newProblem = utils.generateIndependentVariablesProblem();\n          break;\n        case 'moving_right_edge':\n          newProblem = {"
  );
}

// Add viz render
if (!pageCode.includes('<IndependentVariablesViz />')) {
  pageCode = pageCode.replace(
    "case 'moving_right_edge':\n          return <MovingRightEdgeViz />;",
    "case 'independent_variables':\n          return <IndependentVariablesViz />;\n        case 'moving_right_edge':\n          return <MovingRightEdgeViz />;"
  );
}

fs.writeFileSync(pageFile, pageCode);
console.log('Patched page.tsx and utils/index.ts');
