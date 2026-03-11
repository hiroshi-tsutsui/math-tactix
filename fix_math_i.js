const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove duplicate import TasukigakeViz
const tasukiImport = "import TasukigakeViz from '../components/math/TasukigakeViz';\\n";
content = content.replace(new RegExp(tasukiImport + tasukiImport, 'g'), tasukiImport);
// Also literally if they are there
content = content.replace(/import TasukigakeViz from '\.\.\/components\/math\/TasukigakeViz';\nimport TasukigakeViz from '\.\.\/components\/math\/TasukigakeViz';\n/g, "import TasukigakeViz from '../components/math/TasukigakeViz';\n");

// Remove duplicate level id: 4
content = content.replace(/{ id: 4, title: 'たすき掛け \\(因数分解\\)', type: 'tasukigake' },\n\s*{ id: 4, title: 'たすき掛け \\(因数分解\\)', type: 'tasukigake' },/g, "{ id: 4, title: 'たすき掛け (因数分解)', type: 'tasukigake' },");

// Remove duplicate render logic for currentLevel === 4
content = content.replace(/\{currentLevel === 4 && \(\s*<div.*?たすき掛け.*?<\/div>\s*\)\}\s*\{currentLevel === 4 && \(\s*<div.*?たすき掛け.*?<\/div>\s*\)\}/gs, match => match.substring(0, match.length / 2));

fs.writeFileSync(file, content);
console.log("Fixed page.tsx");
