const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add import
if (!content.includes('ReciprocalSymmetricViz')) {
  content = content.replace(
    /import DiscountInequalityViz from '\.\/components\/DiscountInequalityViz';/,
    "import DiscountInequalityViz from './components/DiscountInequalityViz';\nimport ReciprocalSymmetricViz from './components/ReciprocalSymmetricViz';"
  );
}

// 2. Add to levels array
if (!content.includes('reciprocal_symmetric')) {
  content = content.replace(
    /{ id: 37, title: '1次不等式の文章題 \(損益分岐点・料金プラン\)', type: 'discount_inequality' }/,
    "{ id: 37, title: '1次不等式の文章題 (損益分岐点・料金プラン)', type: 'discount_inequality' },\n    { id: 38, title: '対称式の値 (分数型)', type: 'reciprocal_symmetric' }"
  );
}

// 3. Add to switch statement
if (!content.includes("case 'reciprocal_symmetric':")) {
  content = content.replace(
    /case 'discount_inequality':\s*return <DiscountInequalityViz \/>;/,
    "case 'discount_inequality':\n        return <DiscountInequalityViz />;\n      case 'reciprocal_symmetric':\n        return <ReciprocalSymmetricViz />;"
  );
}

fs.writeFileSync(pagePath, content, 'utf8');
console.log('Successfully updated page.tsx');
