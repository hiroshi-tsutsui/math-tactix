const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes("InequalityRangeViz")) {
    const importStr = `import InequalityRangeViz from './components/InequalityRangeViz';\n`;
    content = content.replace(/import RootAbsoluteSimplificationViz[^\n]+/, match => match + '\n' + importStr);

    const levelStr = `  { id: 27, title: '不等式の性質と式の値の範囲', type: 'inequality_range' },\n`;
    content = content.replace(/\{ id: 26[^\n]+/, match => match + '\n' + levelStr);

    const switchStr = `      case 'inequality_range':\n        return <InequalityRangeViz />;\n`;
    content = content.replace(/case 'root_absolute_simplification':\n\s*return <RootAbsoluteSimplificationViz \/>;/, match => match + '\n' + switchStr);

    fs.writeFileSync(pagePath, content);
    console.log("Added Level 27 to math_i_numbers/page.tsx");
} else {
    console.log("Already added");
}
