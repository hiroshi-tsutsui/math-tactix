const fs = require('fs');
const path = './app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('FactoringLowestDegreeViz')) {
  // Add import
  content = content.replace(
    "import BenchWordProblemViz from '../components/math/BenchWordProblemViz';",
    "import BenchWordProblemViz from '../components/math/BenchWordProblemViz';\nimport FactoringLowestDegreeViz from './components/FactoringLowestDegreeViz';"
  );

  // Add to type definitions
  content = content.replace(
    "| 'bench_word_problem'",
    "| 'bench_word_problem'\n  | 'factoring_lowest_degree'"
  );

  // Add to MODULE_DATA (Levels)
  content = content.replace(
    "title: '1次不等式の文章題 (過不足)', type: 'bench_word_problem' }",
    "title: '1次不等式の文章題 (過不足)', type: 'bench_word_problem' },\n        { id: 'math-i-numbers-12', title: '最低次数の文字で整理する因数分解', type: 'factoring_lowest_degree' }"
  );

  // Add to renderContent switch
  content = content.replace(
    "case 'bench_word_problem':",
    "case 'factoring_lowest_degree':\n      return <FactoringLowestDegreeViz />;\n    case 'bench_word_problem':"
  );

  fs.writeFileSync(path, content);
  console.log("Updated page.tsx successfully.");
} else {
  console.log("Already updated.");
}
