const fs = require('fs');
const file = 'logs/system_wisdom.md';
let content = fs.readFileSync(file, 'utf-8');

const newEntry = `### v1.3.54: Roots with Different Signs Visualization (異符号の解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 42 "異符号の解" (Roots with Different Signs) to Quadratic Functions (二次関数). Fixed missing switch case issues for Level 41.
- **Visualization**: \`DifferentSignsViz\` implementation.
  - **Focus on y-intercept**: Students adjust parameter $m$ and see that as long as $f(0) < 0$, the parabola naturally opens upwards and crosses the x-axis on both positive and negative sides.
  - **Redundant Conditions**: Visually demonstrates why checking the discriminant ($D>0$) or the axis is unnecessary when $f(0) < 0$ and $a > 0$.
- **Learning Value**: Math I students often over-complicate "different signs" problems by calculating $D>0$, sum of roots, and product of roots. By visually proving that pulling the y-intercept below 0 forces the parabola to cross the x-axis twice with different signs, the required calculation simplifies to just one condition.
- **Next Step**: Continue expanding Math I topics (Trigonometry or Numbers & Algebraic Expressions).

`;

content = content.replace("## Evolution History\n\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync(file, content);
console.log('Updated system_wisdom.md');
