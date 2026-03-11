const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/system_wisdom.md');
let logContent = fs.readFileSync(logPath, 'utf8');

const newEntry = `### v1.3.70: Geometric Meaning of 3-Term Square Expansion (3項の平方の展開公式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "3項の平方の展開公式" (Expansion Formula of 3 Terms Squared) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`ThreeTermsSquareViz\` implementation.
  - **Interactive Area Model**: Students adjust the side lengths $a$, $b$, and $c$ of a large square divided into a $3 \\times 3$ grid.
  - **Visualizing the Terms**: Dynamically scales the 9 resulting rectangles. The 3 squares ($a^2, b^2, c^2$) are color-coded along the diagonal.
  - **Connecting to the Formula**: The 6 remaining rectangles visually group into 3 pairs of identical rectangles ($2ab, 2bc, 2ca$), geometrically proving the algebraic expansion formula $(a+b+c)^2 = a^2+b^2+c^2+2ab+2bc+2ca$.
- **Learning Value**: Math I students frequently memorize this long expansion formula mechanically and drop terms (usually writing just $a^2+b^2+c^2$). By visualizing the literal $3 \\times 3$ area grid, it becomes obvious that there are exactly 9 pieces in total, and that the cross-terms naturally form pairs.
- **Next Step**: Continue exploring core Math I topics such as 1D Inequalities or expand into Sets and Logic.

`;

logContent = logContent.replace(
  '## Evolution History\n',
  '## Evolution History\n\n' + newEntry
);

fs.writeFileSync(logPath, logContent);
console.log("Updated system_wisdom.md");
