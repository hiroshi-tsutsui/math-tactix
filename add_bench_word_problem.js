const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Add import
const importStatement = "import BenchWordProblemViz from '../components/math/BenchWordProblemViz';\n";
if (!pageContent.includes('BenchWordProblemViz')) {
  pageContent = pageContent.replace(
    /import ThreeTermsSquareViz from '\.\.\/components\/math\/ThreeTermsSquareViz';/,
    "import ThreeTermsSquareViz from '../components/math/ThreeTermsSquareViz';\n" + importStatement
  );
}

// Add level to the modules object
const levelObject = `
      {
        id: "bench-word-problem",
        title: "1次不等式の文章題 (過不足)",
        description: "長椅子の問題における、人数の「過不足」と不等式の関係を視覚化します。",
        component: <BenchWordProblemViz />,
        difficulty: "standard"
      },`;

if (!pageContent.includes('bench-word-problem')) {
  pageContent = pageContent.replace(
    /id: "three-terms-square",([\s\S]*?)difficulty: "standard"\n      },/,
    'id: "three-terms-square",$1difficulty: "standard"\n      },' + levelObject
  );
}

fs.writeFileSync(pagePath, pageContent);
console.log("Successfully added BenchWordProblemViz to page.tsx");
