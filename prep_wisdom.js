const fs = require('fs');
let code = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const logEntry = `### v1.4.22: 分散の計算公式 (Variance Shortcut Formula) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 11 "分散の計算公式 (2乗の平均 - 平均の2乗)" (Variance Shortcut Formula) to Data Analysis (データの分析). Fixed missing implementation and progression bug limiting advancement past level 8.
- **Visualization**: \`VarianceShortcutViz\` implementation.
  - **Interactive Graphic**: Visualizes 5 data points that can be adjusted via sliders.
  - **Dynamic Calculation**: Instantly shows the Mean of Squares and the Square of the Mean, visually subtracting them to yield the Variance.
- **Learning Value**: Math I students universally memorize the formula $s^2 = \\overline{x^2} - (\\overline{x})^2$ but often forget which part is squared. By visualizing the two competing terms and their difference as the variance, it solidifies the algebraic shortcut into a concrete subtraction.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.

`;

code = code.replace("## Evolution History", "## Evolution History\n\n" + logEntry);
fs.writeFileSync('logs/system_wisdom.md', code, 'utf8');
console.log("Wisdom updated.");
