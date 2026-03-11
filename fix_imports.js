const fs = require('fs');
let content = fs.readFileSync('app/math_i_numbers/page.tsx', 'utf-8');

// remove all imports of ExpansionGroupingViz
content = content.replace(/import ExpansionGroupingViz from '\.\.\/components\/ExpansionGroupingViz';\n?/g, '');
// add exactly one
content = content.replace("import AbsoluteValueViz from '../components/math/AbsoluteValueViz';", "import AbsoluteValueViz from '../components/math/AbsoluteValueViz';\nimport ExpansionGroupingViz from '../components/ExpansionGroupingViz';");

fs.writeFileSync('app/math_i_numbers/page.tsx', content, 'utf-8');
console.log('Fixed imports');
