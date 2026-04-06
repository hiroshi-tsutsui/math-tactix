const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(targetPath, 'utf8');

const newEntry = `### v1.3.56: One Real Root Condition Visualization (一方だけが実数解をもつ条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 44 "一方だけが実数解をもつ条件" (Condition for Exactly One Real Root) to Quadratic Functions (二次関数).
- **Visualization**: \`OneRealRootConditionViz\` implementation (Canvas-based).
  - **Focus on Discriminants**: Students adjust the parameter $p$ and visually see how the two equations $x^2 + px + 1 = 0$ and $x^2 + x + p = 0$ independently change.
  - **Visualizing Roots**: The canvas clearly shows when one parabola crosses the x-axis while the other "floats" above it.
  - **Dynamic Checks**: Calculates and displays the signs of both discriminants $D_1$ and $D_2$ in real-time.
- **Learning Value**: "Exactly one equation has real roots" problems notoriously trip up Math I students because the logical condition $(D_1 \\ge 0 \\text{ AND } D_2 < 0) \\text{ OR } (D_1 < 0 \\text{ AND } D_2 \\ge 0)$ is long and prone to careless interval calculation errors. Seeing the two parabolas simultaneously forces the student to connect the algebraic interval of $p$ to the physical reality of the graphs intersecting the axis.
- **Next Step**: Polish existing Quadratics levels and move fully into Math I Numbers and Algebraic Expressions (数と式) or Data Analysis refinement.\n\n`;

content = content.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Added wisdom');
