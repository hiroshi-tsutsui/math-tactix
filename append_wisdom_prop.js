const fs = require('fs');

const logPath = './logs/system_wisdom.md';
let content = fs.readFileSync(logPath, 'utf8');

const newWisdom = `
### v1.4.75: 比例式の値 (比例定数kの利用) (Value of Proportional Expressions) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 42 "比例式の値 (比例定数kの利用)" (Value of Proportional Expressions) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`ProportionalExpressionViz\` implementation.
  - **Interactive Graphic**: Visualizes $x/2 = y/3 = z/4 = k$ using three separate bar graphs that grow and shrink in unison.
  - **Parameter Tuning**: Students drag a slider to adjust the proportionality constant $k$ from 1 to 10.
  - **Connecting to Algebra**: Dynamically substitutes $x=2k$, $y=3k$, $z=4k$ into the target expression $(x+y+z)/x$ and explicitly highlights that $k$ perfectly cancels out, proving the result is independent of $k$.
- **Learning Value**: Math I students universally stumble when given $x/2 = y/3 = z/4$. They either cross-multiply wildly or freeze. By putting $k$ on a slider and watching the three bars scale proportionally without changing their relative sizes, the abstract "setting to $k$" trick transforms into a self-evident geometric property of similar scaling.
- **Next Step**: Polish Data Analysis or finalize the remaining core Math I edge cases.
`;

content = content.replace('## Evolution History\n', '## Evolution History\n' + newWisdom);
fs.writeFileSync(logPath, content);
console.log('Wisdom appended successfully.');
