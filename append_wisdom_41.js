const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const entry = `### v1.4.42: 2つの絶対値を含む方程式・不等式 (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 41 "2つの絶対値を含む方程式・不等式" (Equations and Inequalities with Two Absolute Values) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`TwoAbsoluteValuesInequalityViz\` implementation.
  - **Interactive Graphic**: Visualizes the graph of $y = |x - 2| + |x + 3|$ alongside a dynamic horizontal threshold line.
  - **Case Splitting**: Explains geometrically why the expression splits into three distinct linear parts ($x < -3$, $-3 \\le x < 2$, and $x \\ge 2$) due to the individual absolute value "V" shapes combining.
- **Learning Value**: Math I students universally struggle with algebraic case-splitting (場合分け) when dealing with two absolute values, frequently messing up the signs. By showing the resulting "bucket" shape of the graph, students realize that the three algebraic cases just represent the left arm, the flat bottom, and the right arm of the combined graph. This turns a tedious 3-case algebraic check into an obvious visual intersection problem.
- **Next Step**: Polish existing Number and Expression levels or move onto Data Analysis.

`;

content = content.replace("## Evolution History\n", "## Evolution History\n\n" + entry);
fs.writeFileSync(logPath, content, 'utf8');
console.log('Appended to system_wisdom.md');
