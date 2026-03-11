const fs = require('fs');
const path = './logs/system_wisdom.md';
let content = fs.readFileSync(path, 'utf8');

const newEntry = `
### v1.3.86: Absolute Value Inequalities with Case Splitting (絶対値を含む不等式 (場合分け)) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 20 "絶対値を含む不等式 (場合分け)" (Absolute Value Inequalities with Case Splitting) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`AbsoluteInequalityCaseSplitViz\` implementation.
  - **Interactive Graphic**: Visualizes the equation $|x - a| < bx + c$ dynamically.
  - **Case Splitting**: Explicitly maps the two cases ($x \\ge a$ and $x < a$) to the two algebraic equations representing the left and right arms of the V-shape.
- **Learning Value**: Math I students frequently memorize the procedure for case-splitting but forget to check whether their final answer actually satisfies the initial condition (e.g. $x \\ge a$). The visual representation clearly connects the algebraic case splitting to the geometric "arms" of the absolute value function.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g. integer solutions on a restricted domain) or transition to Math I Data Analysis.
`;

content = content.replace('## Evolution History\n', '## Evolution History\n' + newEntry);
fs.writeFileSync(path, content);
console.log('Updated logs/system_wisdom.md with Level 20');
