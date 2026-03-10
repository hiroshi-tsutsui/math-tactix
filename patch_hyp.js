const fs = require('fs');
const file = require('path').join(__dirname, 'app/data/components/HypothesisTestingViz.tsx');
let data = fs.readFileSync(file, 'utf8');
data = data.replace('確率 $>\\frac{1}{2}$', '確率 ${">"}\\frac{1}{2}$');
fs.writeFileSync(file, data);
console.log('Fixed JSX tag error');
