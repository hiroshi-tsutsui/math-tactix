const fs = require('fs');
let content = fs.readFileSync('app/quadratics/page.tsx', 'utf8');

// 1. Add import
if (!content.includes('AtLeastOnePositiveRootViz')) {
    content = content.replace("import CommonRootsViz from './components/CommonRootsViz';", "import CommonRootsViz from './components/CommonRootsViz';\nimport AtLeastOnePositiveRootViz from './components/AtLeastOnePositiveRootViz';");
}

// 2. Add Level 40
if (!content.includes('at_least_one_positive_root')) {
    content = content.replace("{ id: 39, title: '2変数関数の最大・最小 (独立変数)', type: 'independent_variables' },", "{ id: 39, title: '2変数関数の最大・最小 (独立変数)', type: 'independent_variables' },\n  { id: 40, title: '少なくとも1つの正の解をもつ条件', type: 'at_least_one_positive_root' },");
}

// 3. Add case in switch
if (!content.includes("case 'at_least_one_positive_root':")) {
    content = content.replace("case 'independent_variables':", "case 'at_least_one_positive_root':\n          newProblem = { id: Date.now(), title: '少なくとも1つの正の解', questionText: '方程式 x² - 2mx + m + 2 = 0 が少なくとも1つの正の解をもつような定数mの範囲を視覚的に確認せよ。', explanationSteps: ['D/4 ≥ 0', '軸 > 0', 'f(0) の符号で場合分け'] };\n          break;\n        case 'independent_variables':");
}

// 4. Add render
if (!content.includes("<AtLeastOnePositiveRootViz />")) {
    content = content.replace("</main>", "  {currentLevel === 40 && <AtLeastOnePositiveRootViz />}\n      </main>");
}

fs.writeFileSync('app/quadratics/page.tsx', content);
console.log('Patch applied successfully.');
