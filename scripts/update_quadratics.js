const fs = require('fs');
const file = 'app/quadratics/page.tsx';
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes('DifferentSignsViz')) {
  // Add imports
  content = content.replace(
    "import { ExternalTangentViz } from \"./components/ExternalTangentViz\";",
    "import { ExternalTangentViz } from \"./components/ExternalTangentViz\";\nimport DifferentSignsViz from './components/DifferentSignsViz';\nimport { generateDifferentSignsProblem } from './utils/different-signs-generator';"
  );
  
  // Add to levels array
  content = content.replace(
    "{ id: 41, title: '放物線の平行移動の決定', type: 'translation_determination' },",
    "{ id: 41, title: '放物線の平行移動の決定', type: 'translation_determination' },\n  { id: 42, title: '異符号の解', type: 'different_signs' },"
  );
  
  // Add to switch in generateNewProblem
  content = content.replace(
    "case 'translation_determination':",
    "case 'different_signs':\n          newProblem = { id: Date.now(), title: '異符号の解', questionText: '方程式 x² + mx + (m - 2) = 0 が1つの正の解と1つの負の解をもつような定数mの範囲を視覚的に確認せよ。', explanationSteps: ['f(0) < 0 のみチェック'] };\n          break;\n        case 'translation_determination':"
  );
  
  // Add to switch in renderVisualization
  content = content.replace(
    "case 'translation_determination':\n        return <TranslationDeterminationViz />;",
    "case 'translation_determination':\n        return <TranslationDeterminationViz />;\n      case 'different_signs':\n        return <DifferentSignsViz />;"
  );
  
  fs.writeFileSync(file, content);
  console.log('Updated app/quadratics/page.tsx');
}
