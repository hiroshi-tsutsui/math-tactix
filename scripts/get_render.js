const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
const code = fs.readFileSync(file, 'utf8');
const renderStart = code.indexOf('const renderLevel = () =>');
console.log(code.substring(renderStart, renderStart + 1000));
