const fs = require('fs');
const wisdomPath = 'logs/system_wisdom.md';
let content = fs.readFileSync(wisdomPath, 'utf8');

const entry = `
### v1.3.60: Condition for Both Roots in a Specific Interval (2解が特定の区間にある条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 46 "2つの解が特定の区間にある条件" (Both roots inside a specific interval) to Quadratic Functions (二次関数). Also fixed missing UI binding for Level 45 "Domain Always Positive" (特定の区間で常に正・負となる条件).
- **Visualization**: \`BothRootsBetweenViz\` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $f(x) = x^2 - 2ax + a + 2$ defined strictly with roots inside the interval $0 < x < 3$.
  - **Dynamic Checks**: Visualizes the 3 critical conditions for "Roots Location" (解の配置) problems: Discriminant ($D \ge 0$), Axis Location ($0 < a < 3$), and Boundary Values ($f(0) > 0, f(3) > 0$).
  - **Learning Value**: Math I students universally struggle with "Location of Roots" (解の配置) problems. This is arguably the most complex standard problem in Quadratics. By interactively moving the parabola and explicitly watching the three physical conditions light up green when satisfied, the abstract case-splitting turns into obvious visual geometry.
- **Next Step**: The Quadratic Functions (二次関数) module is complete up to Level 46. Move to Math I Numbers and Algebraic Expressions (数と式) or finalize edge cases in Probability.
`;

// Insert after Mission Statement / Evolution History
content = content.replace("## Evolution History\n", "## Evolution History\n" + entry);
fs.writeFileSync(wisdomPath, content);
console.log('Updated system_wisdom.md');
