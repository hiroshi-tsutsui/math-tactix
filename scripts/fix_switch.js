const fs = require('fs');
const file = 'app/quadratics/page.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Insert in generateNewProblem block
if (!content.includes("case 'different_signs':")) {
  content = content.replace(
    "case 'at_least_one_positive_root':\n          newProblem = { id: Date.now(), title: '少なくとも1つの正の解', questionText: '方程式 x² - 2mx + m + 2 = 0 が少なくとも1つの正の解をもつような定数mの範囲を視覚的に確認せよ。', explanationSteps: ['D/4 ≥ 0', '軸 > 0', 'f(0) の符号で場合分け'] };\n          break;",
    "case 'at_least_one_positive_root':\n          newProblem = { id: Date.now(), title: '少なくとも1つの正の解', questionText: '方程式 x² - 2mx + m + 2 = 0 が少なくとも1つの正の解をもつような定数mの範囲を視覚的に確認せよ。', explanationSteps: ['D/4 ≥ 0', '軸 > 0', 'f(0) の符号で場合分け'] };\n          break;\n        case 'translation_determination':\n          newProblem = generateTranslationDeterminationProblem();\n          break;\n        case 'different_signs':\n          newProblem = generateDifferentSignsProblem();\n          break;"
  );
}

// Insert in renderVisualization block
if (!content.includes("case 'different_signs':\n        return <DifferentSignsViz")) {
  content = content.replace(
    "case 'at_least_one_positive_root':\n        return <AtLeastOnePositiveRootViz />;",
    "case 'at_least_one_positive_root':\n        return <AtLeastOnePositiveRootViz />;\n      case 'translation_determination':\n        return <TranslationDeterminationViz />;\n      case 'different_signs':\n        return <DifferentSignsViz />;"
  );
}

fs.writeFileSync(file, content);
console.log('Fixed switch statements');
