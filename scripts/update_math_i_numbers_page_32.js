const fs = require('fs');

const path = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('MaxIntegerSolutionViz')) {
  content = content.replace(
    "import ExpansionSubstitutionViz from '@/components/math_i_numbers/ExpansionSubstitutionViz';",
    "import ExpansionSubstitutionViz from '@/components/math_i_numbers/ExpansionSubstitutionViz';\nimport MaxIntegerSolutionViz from '@/components/math_i_numbers/MaxIntegerSolutionViz';"
  );
}

// 2. Add to topics array
if (!content.includes("type: 'max_integer_solution'")) {
  content = content.replace(
    "{ id: 31, title: '展開の工夫 (置き換え)', type: 'expansion_substitution' },",
    "{ id: 31, title: '展開の工夫 (置き換え)', type: 'expansion_substitution' },\n  { id: 32, title: '最大整数解から定数の範囲を決定', type: 'max_integer_solution' },"
  );
}

// 3. Add to render switch
if (!content.includes("case 'max_integer_solution':")) {
  const switchTarget = "case 'expansion_substitution':\n      return <ExpansionSubstitutionViz />;";
  const newCase = "case 'expansion_substitution':\n      return <ExpansionSubstitutionViz />;\n    case 'max_integer_solution':\n      return <MaxIntegerSolutionViz />;";
  content = content.replace(switchTarget, newCase);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Updated math_i_numbers/page.tsx successfully for level 32.');
