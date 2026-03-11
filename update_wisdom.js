const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(filePath, 'utf8');

const newEntry = `### v1.3.64: Symmetric Polynomials Value Visualization (対称式の値) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 5 "対称式の値 (基本定理)" (Symmetric Polynomials) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`SymmetricPolynomialsViz\` implementation.
  - **Area Model**: Students can dynamically adjust the values of $x$ and $y$ using sliders.
  - **Visual Proof**: Shows the target expression $x^2 + y^2$ physically embedded as two smaller squares within a larger square of size $(x+y)^2$.
  - **Interactive Subtraction**: Students click a button to "pull away" the two $xy$ rectangles from the larger $(x+y)^2$ square, revealing the geometric proof of $x^2 + y^2 = (x+y)^2 - 2xy$.
- **Learning Value**: Math I students memorize $x^2 + y^2 = (x+y)^2 - 2xy$ algebraically, which leads to confusion with $x^3+y^3$ or dropping the minus sign. Visualizing the areas makes it undeniable that the whole $(x+y)^2$ box contains extra rectangles that must be removed.
- **Next Step**: Continue expanding Math I topics or refine Data Analysis.

`;

content = content.replace("## Evolution History\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated logs/system_wisdom.md');
