const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Imports
const importStatement = `import OneRealRootConditionViz from '../../components/math-viz-japan/OneRealRootConditionViz';\nimport { generateOneRealRootCondition } from './utils/one-real-root-generator';`;
if (!content.includes('OneRealRootConditionViz')) {
  content = content.replace("import { generateDifferentSignsProblem } from './utils/different-signs-generator';", "import { generateDifferentSignsProblem } from './utils/different-signs-generator';\n" + importStatement);
}

// Add Level 44 definition
const levelDefinition = `{ level: 44, title: "一方だけが実数解をもつ条件" },`;
if (!content.includes('level: 44')) {
  content = content.replace('{ level: 43, title: "利益の最大化 (文章題)" },', '{ level: 43, title: "利益の最大化 (文章題)" },\n    ' + levelDefinition);
}

// Switch case for generator
const generatorCase = `case 44: return generateOneRealRootCondition();`;
if (!content.includes('case 44: return generateOneRealRootCondition()')) {
  content = content.replace('case 43: return generateRootsLocationProblem(); // TODO: generateProfitMaximizationProblem', 'case 43: return generateRootsLocationProblem(); // TODO\n      ' + generatorCase);
}

// Switch case for rendering
const renderingCase = `case 44: return <OneRealRootConditionViz />;`;
if (!content.includes('case 44: return <OneRealRootConditionViz />')) {
  content = content.replace('case 43: return <ProfitMaximizationViz />;', 'case 43: return <ProfitMaximizationViz />;\n      ' + renderingCase);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Done modifying page.tsx');
