const fs = require('fs');

const path = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Add import
if (!content.includes('ExpansionGroupingViz')) {
  content = content.replace(
    /import .+ from '\.\.\/components\/.+';/g,
    match => match + "\nimport ExpansionGroupingViz from '../components/ExpansionGroupingViz';"
  );
}

// 2. Add to levels array
if (!content.includes("type: 'expansion_grouping'")) {
  content = content.replace(
    /\{ id: 27, title: '不等式の性質と式の値の範囲', type: 'inequality_range' \},/g,
    "{ id: 27, title: '不等式の性質と式の値の範囲', type: 'inequality_range' },\n    { id: 28, title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' },"
  );
}

// 3. Add to switch statement
if (!content.includes("case 'expansion_grouping':")) {
  content = content.replace(
    /case 'inequality_range':[\s\S]*?break;/g,
    match => match + "\n        case 'expansion_grouping':\n          newProblem = { id: Date.now(), title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' };\n          break;"
  );
}

// 4. Render component
if (!content.includes("<ExpansionGroupingViz />")) {
  content = content.replace(
    /\{currentProblem\.type === 'inequality_range' && <InequalityRangeViz \/>\}/g,
    "{currentProblem.type === 'inequality_range' && <InequalityRangeViz />}\n        {currentProblem.type === 'expansion_grouping' && <ExpansionGroupingViz />}"
  );
}

fs.writeFileSync(path, content, 'utf-8');
console.log('Added Level 28 (Expansion Grouping)');
