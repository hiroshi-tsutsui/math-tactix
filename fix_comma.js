const fs = require('fs');
let content = fs.readFileSync('app/math_i_numbers/page.tsx', 'utf-8');
content = content.replace(
  "{ id: 26, title: '平方根と絶対値 (文字式の簡約化)', type: 'root_absolute_simplification' }\n  { id: 27,",
  "{ id: 26, title: '平方根と絶対値 (文字式の簡約化)', type: 'root_absolute_simplification' },\n  { id: 27,"
);
fs.writeFileSync('app/math_i_numbers/page.tsx', content, 'utf-8');
console.log('Fixed comma');
