const fs = require('fs');

const FILE_PATH = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(FILE_PATH, 'utf-8');

if (!content.includes('DiscountInequalityViz')) {
    // 1. Add import
    const importRegex = /import .* from '.*';\n/;
    const lastImportIndex = content.lastIndexOf("import", content.indexOf("export default"));
    const lastImportLineEnd = content.indexOf('\n', lastImportIndex) + 1;
    
    content = content.slice(0, lastImportLineEnd) + 
              "import DiscountInequalityViz from './components/DiscountInequalityViz';\n" + 
              content.slice(lastImportLineEnd);

    // 2. Add to array
    const levelObj = `  {
    level: 37,
    title: "1次不等式の文章題 (損益分岐点・料金プラン)",
    description: "会員カードなどの割引プランで元が取れる条件を視覚的に理解します。",
    component: <DiscountInequalityViz />
  }`;

    const arrayEndIndex = content.lastIndexOf('];');
    if (arrayEndIndex !== -1) {
        // Need to add comma to previous element if not present
        const beforeArrayEnd = content.slice(0, arrayEndIndex);
        if (!beforeArrayEnd.trim().endsWith(',')) {
            content = beforeArrayEnd + ',\n' + levelObj + '\n' + content.slice(arrayEndIndex);
        } else {
            content = beforeArrayEnd + '\n' + levelObj + '\n' + content.slice(arrayEndIndex);
        }
    }
    
    fs.writeFileSync(FILE_PATH, content, 'utf-8');
    console.log('Added Level 37.');
} else {
    console.log('Already exists.');
}
