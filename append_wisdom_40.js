const fs = require('fs');
const path = require('path');

const logEntry = `
### v1.4.40: 絶対値の不等式 (三角不等式) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 40 "絶対値の不等式 (三角不等式)" (Absolute Value Inequality / Triangle Inequality) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`TriangleInequalityViz\` implementation.
  - **Interactive Graphic**: Visualizes the lengths of |a|, |b|, and |a+b| as overlapping segments on a horizontal bar.
  - **Parameter Tuning**: Students drag sliders for values of a and b across positive and negative integers.
  - **Connecting to the Theorem**: Dynamically evaluates the inequality |a| + |b| ≧ |a + b| and explicitly shows that the strict equality holds only when the two values share the same sign.
- **Learning Value**: Math I students universally memorize the triangle inequality formula without understanding why it is true or when the equality holds. By sliding values and physically watching the absolute lengths add up versus the combined sum's length, the algebraic rule transforms into an obvious geometric truth.
- **Next Step**: Polish Data Analysis or finalize the remaining edge cases of Math I Numbers and Algebraic Expressions.
`;

const wisdomFile = path.join(__dirname, 'logs', 'system_wisdom.md');
const currentWisdom = fs.readFileSync(wisdomFile, 'utf8');

if (!currentWisdom.includes('v1.4.40: 絶対値の不等式')) {
  fs.writeFileSync(wisdomFile, logEntry + currentWisdom);
  console.log('Appended wisdom for Level 40.');
} else {
  console.log('Wisdom for Level 40 already exists.');
}
