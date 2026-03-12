const fs = require('fs');
const file = 'logs/system_wisdom.md';
let code = fs.readFileSync(file, 'utf8');

const logEntry = `### v1.4.6: 展開の工夫 (置き換え) (Expansion by Substitution) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 31 "展開の工夫 (置き換え)" (Expansion by Substitution) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`ExpansionSubstitutionViz\` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the extremely confusing expansion of $(x + y - z)(x - y + z)$ into 5 distinct logical steps.
  - **Visualizing the Bracket Rule**: Explicitly shows how grouping the latter two terms with a minus sign reveals the hidden common factor $(y-z)$.
  - **Substitution Logic**: Guides the student to replace the common "block" with a single letter $A$, turning a 9-term chaotic expansion into a trivial $(a+b)(a-b) = a^2 - b^2$ formula application.
- **Learning Value**: Math I students universally hit a wall when presented with complex polynomials involving 4 terms that seem to have no direct commonality. They blindly expand everything and get lost in signs. By breaking down the process of "creating a common block by factoring out a minus sign", the student learns pattern recognition over brute force calculation.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.

`;

code = code.replace("## Evolution History\n", "## Evolution History\n\n" + logEntry);
fs.writeFileSync(file, code);
console.log("Updated system_wisdom.md");
