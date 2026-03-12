const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'system_wisdom.md');
const entry = `
### v1.4.21: たすき掛けの応用 (2変数の因数分解) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 33 "たすき掛けの応用 (2変数の因数分解)" (Factorization by Repeated Tasukigake) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`TasukigakeTwiceViz\` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the extremely confusing factorization of $x^2 + 3xy + 2y^2 + 2x + 5y - 3$ into 5 distinct logical steps.
  - **Focus on the Lowest Degree Principle**: Visually isolates the variable $x$ and treats the $y$ polynomial purely as a constant term.
  - **Visualizing the Double Tasukigake**: Explains the first tasukigake to factor the $y$ term, and then explicitly maps those new factors $(y+3)(2y-1)$ directly into the second, outer tasukigake to build $(3y+2)$.
- **Learning Value**: Math I students universally hit a wall when presented with complex polynomials involving 2 variables. They blindly expand everything and get lost. By forcing them to organize by a single letter ($x$), the chaos reduces to a simple quadratic equation $x^2 + Bx + C$. This visualization proves that "organizing by one variable" combined with two distinct layers of tasukigake is a systematic, un-tangling method.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.
`;

let content = fs.readFileSync(logPath, 'utf8');
content = content.replace("## Evolution History\n", "## Evolution History\n" + entry);
fs.writeFileSync(logPath, content, 'utf8');
console.log('Appended to system_wisdom.md');
