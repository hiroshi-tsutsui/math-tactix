const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Import
if (!pageContent.includes('import TasukigakeTwiceViz from')) {
    pageContent = pageContent.replace(
        "import AlternatingPolynomialViz from '@/components/AlternatingPolynomialViz';",
        "import AlternatingPolynomialViz from '@/components/AlternatingPolynomialViz';\nimport TasukigakeTwiceViz from '@/components/TasukigakeTwiceViz';"
    );
}

// 2. Add to level data
if (!pageContent.includes("{ id: 33, title: 'たすき掛けの応用 (2変数の因数分解)', type: 'tasukigake_twice' }")) {
    pageContent = pageContent.replace(
        "{ id: 32, title: '最大整数解から定数の範囲を決定', type: 'max_integer_solution' }",
        "{ id: 32, title: '最大整数解から定数の範囲を決定', type: 'max_integer_solution' },\n        { id: 33, title: 'たすき掛けの応用 (2変数の因数分解)', type: 'tasukigake_twice' }"
    );
}

// 3. Add to switch statement
if (!pageContent.includes("case 'tasukigake_twice':")) {
    pageContent = pageContent.replace(
        "case 'max_integer_solution':\n        return <MaxIntegerSolutionViz />;",
        "case 'max_integer_solution':\n        return <MaxIntegerSolutionViz />;\n      case 'tasukigake_twice':\n        return <TasukigakeTwiceViz />;"
    );
}

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log('Level 33 added successfully.');
