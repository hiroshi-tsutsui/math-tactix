const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(targetPath, 'utf-8');

const newEntry = `
### v1.3.78: Bi-quadratic Factoring (Difference of Squares) (複二次式の因数分解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 15 "複二次式の因数分解 (平方の差)" (Bi-quadratic Factoring: Difference of Squares) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`BiQuadraticFactoringViz\` implementation.
  - **Step-by-Step Logic**: Breaks down the infamous $x^4+x^2+1$ factoring into 7 interactive steps.
  - **Visual Highlighting**: Explicitly highlights the substitution failure ($X^2+X+1$) and the pivot to "focusing on the ends" to force $(x^2+1)^2$.
  - **Creating the Difference**: Visually proves why adding $+x^2$ and subtracting $-x^2$ perfectly transforms the expression into $A^2 - B^2$.
- **Learning Value**: Math I students hit a massive wall with this specific problem type because they cannot see *why* someone would think to add and subtract $x^2$ out of thin air. By walking them through the "ideal shape vs reality" comparison, the addition of $x^2$ becomes a logical necessity rather than a memorized magic trick.
- **Next Step**: Continue exploring complex factorization techniques or refine 1D linear inequalities.
`;

if (!content.includes('v1.3.78: Bi-quadratic Factoring')) {
  // Insert right after "## Evolution History\n"
  content = content.replace(/## Evolution History\n/, `## Evolution History\n${newEntry}`);
  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log('Wisdom updated.');
}
