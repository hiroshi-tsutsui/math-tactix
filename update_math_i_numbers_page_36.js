const fs = require('fs');

const path = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('import SpeedTimeInequalityViz')) {
  content = content.replace(
    /(import ExpansionSubstitutionViz from '\.\/components\/ExpansionSubstitutionViz';)/,
    "$1\nimport SpeedTimeInequalityViz from './components/SpeedTimeInequalityViz';"
  );
}

// 2. Add level to the array
if (!content.includes("type: 'speed_time_inequality'")) {
  content = content.replace(
    /(\{ id: 35, title: '無理数の相等', type: 'irrational_equality' \},)/,
    "$1\n        { id: 36, title: '1次不等式の文章題 (道のりと時間)', type: 'speed_time_inequality' },"
  );
}

// 3. Add to switch statement
if (!content.includes("case 'speed_time_inequality':")) {
  content = content.replace(
    /(case 'irrational_equality':\s+return <IrrationalEqualityViz \/>;)/,
    "$1\n      case 'speed_time_inequality':\n        return <SpeedTimeInequalityViz />;"
  );
}

fs.writeFileSync(path, content);
console.log('Updated page.tsx with Level 36.');
