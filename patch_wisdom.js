const fs = require('fs');
const path = require('path');
const file = path.join(process.env.HOME, 'Documents/github/hiroshi-tsutsui/math-tactix/logs/system_wisdom.md');
let content = fs.readFileSync(file, 'utf8');

const newEntry = `
### v1.3.11: Common Roots Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 18 "共通解問題" (Common Roots) to Quadratics.
- **Visualization**: \`CommonRootsViz\` implementation (Canvas-based).
  - **Interactive Dual Graphs**: Visualizes two parabolas ($y = x^2 + mx + 1$ and $y = x^2 + x + m$) simultaneously.
  - **Parameter Tuning**: Interactive slider for parameter $m$ allows students to see how the two graphs shift and intersect.
  - **Visualizing the Common Root**: Clearly highlights the exact moment ($m = -2$) when both graphs intersect at the exact same point on the x-axis ($x = 1$).
- **Learning Value**: "Common roots" is notoriously abstract for students because they get lost in algebraic subtraction. By visualizing *why* substituting the common root $\\alpha$ works geometrically, it demystifies the procedure.
- **Next Step**: Polish existing levels, ensure robustness, or move on to Trigonometry (図形と計量).
`;

content = content.replace('## Evolution History\n', '## Evolution History\n' + newEntry);
fs.writeFileSync(file, content, 'utf8');
console.log('Updated system_wisdom.md');
