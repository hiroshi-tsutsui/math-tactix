const fs = require('fs');

const FILE_PATH = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(FILE_PATH, 'utf-8');

// 1. Find and replace the badly formatted object in the array
const badObjRegex = /\{\s*level:\s*37,\s*title:\s*"1次不等式の文章題 \(損益分岐点・料金プラン\)",\s*description:\s*"会員カードなどの割引プランで元が取れる条件を視覚的に理解します。",\s*component:\s*<DiscountInequalityViz \/>\s*\}/;

content = content.replace(badObjRegex, "{ id: 37, title: '1次不等式の文章題 (損益分岐点・料金プラン)', type: 'discount_inequality' }");

// 2. Add to switch statement
const renderContentRegex = /const renderContent = \(\) => \{\s*switch \(currentLevel\) \{/;
if (renderContentRegex.test(content) && !content.includes("case 37:")) {
    const switchIndex = content.indexOf('switch (currentLevel) {');
    const caseStart = content.indexOf('{', switchIndex) + 1;
    content = content.slice(0, caseStart) + 
      "\n      case 37:\n        return <DiscountInequalityViz />;" + 
      content.slice(caseStart);
}

fs.writeFileSync(FILE_PATH, content, 'utf-8');
console.log('Fixed page.tsx.');
