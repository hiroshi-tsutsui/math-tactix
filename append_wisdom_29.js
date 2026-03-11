const fs = require('fs');
const file = 'logs/system_wisdom.md';
let data = fs.readFileSync(file, 'utf8');

const newEntry = `
### v1.4.2: 平方根の大小比較 (Comparing Square Roots) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 29 "平方根の大小比較" (Comparison of Square Roots) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`RootComparisonViz\` implementation.
  - **Interactive Graphic**: Visualizes the comparison of two sums of square roots (e.g., $\\sqrt{a} + \\sqrt{b}$ vs $\\sqrt{c} + \\sqrt{d}$).
  - **Parameter Tuning**: Students can adjust the values of $a, b, c, d$ dynamically.
  - **Logic Unveiling**: When the integer sum parts ($a+b$ and $c+d$) are equal, the component mathematically and visually demonstrates that comparing the squares directly simplifies to comparing the product terms ($2\\sqrt{ab}$ and $2\\sqrt{cd}$). 
- **Learning Value**: "Which is larger, $\\sqrt{5} + \\sqrt{6}$ or $\\sqrt{3} + \\sqrt{8}$?" is a notoriously common trap problem on Math I tests. Students often try to estimate the decimals (e.g., $\\sqrt{5} \\approx 2.23$) and make arithmetic errors. By clearly juxtaposing the expanded squared forms, the student internalizes the core principle that "squaring positive values preserves their inequality".
- **Next Step**: Polish Math I Data Analysis or expand further into remaining Numbers and Algebraic Expressions test-patterns.
`;

const insertIndex = data.indexOf('## Evolution History\n') + '## Evolution History\n'.length;
const newData = data.slice(0, insertIndex) + newEntry + data.slice(insertIndex);
fs.writeFileSync(file, newData);
console.log('Appended wisdom');
