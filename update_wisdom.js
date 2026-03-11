const fs = require('fs');
const path = './logs/system_wisdom.md';
let content = fs.readFileSync(path, 'utf8');

const newEntry = `
### v1.3.74: Factoring by Lowest Degree Variable (最低次数の文字について整理する因数分解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 12 "最低次数の文字で整理する因数分解" (Factoring by Lowest Degree Variable) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`FactoringLowestDegreeViz\` implementation.
  - **Interactive Step-by-Step**: Breaks down the complex factorization of polynomials with multiple variables (e.g., $x^2 + xy - x + y - 2$) into 5 logical steps.
  - **Visual Highlighting**: Explicitly highlights the lowest degree variable ($y$) and visually separates the terms containing $y$ from the rest.
  - **Guided Flow**: Shows the process of factoring out $y$, then factoring the remaining quadratic $x^2 - x - 2$, and finally pulling out the common binomial factor $(x+1)$.
- **Learning Value**: Math I students universally hit a wall with multi-variable factorization. They try to apply the quadratic formula or tasukigake blindly to the entire expression. By forcing the visual isolation of the lowest degree variable, the abstract algorithm becomes a concrete, color-coded matching game.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., fractional expressions) or move fully to Data Analysis.
`;

content = content.replace(
  "## Evolution History\n",
  "## Evolution History\n" + newEntry
);

fs.writeFileSync(path, content);
console.log("Updated system_wisdom.md");
