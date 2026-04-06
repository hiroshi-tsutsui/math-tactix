const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let data = fs.readFileSync(file, 'utf8');

if (!data.includes('import RootComparisonViz')) {
  data = data.replace(
    "import ExpansionGroupingViz from './components/ExpansionGroupingViz';",
    "import ExpansionGroupingViz from './components/ExpansionGroupingViz';\nimport RootComparisonViz from './components/RootComparisonViz';"
  );
}

if (!data.includes("{ id: 29, title: '平方根の大小比較', type: 'root_comparison' }")) {
  data = data.replace(
    "{ id: 28, title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' },",
    "{ id: 28, title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' },\n  { id: 29, title: '平方根の大小比較', type: 'root_comparison' },"
  );
}

if (!data.includes("case 'root_comparison':\n        return <RootComparisonViz />")) {
  data = data.replace(
    "case 'expansion_grouping':\n        return <ExpansionGroupingViz />;",
    "case 'expansion_grouping':\n        return <ExpansionGroupingViz />;\n      case 'root_comparison':\n        return <RootComparisonViz />;"
  );
}

if (!data.includes("case 'root_comparison':\n          newProblem = {")) {
  data = data.replace(
    "case 'expansion_grouping':\n          newProblem = { id: Date.now(), title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' };\n          break;",
    "case 'expansion_grouping':\n          newProblem = { id: Date.now(), title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' };\n          break;\n        case 'root_comparison':\n          newProblem = { id: Date.now(), title: '平方根の大小比較', type: 'root_comparison' };\n          break;"
  );
}

fs.writeFileSync(file, data);
console.log('Level 29 integration complete.');
