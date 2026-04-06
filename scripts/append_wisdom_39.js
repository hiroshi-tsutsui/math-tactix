const fs = require('fs');

const wisdom = `
### v1.4.46: 絶対値の不等式 (三角不等式) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 39 "絶対値の不等式 (三角不等式)" (Absolute Value Inequality / Triangle Inequality) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`TriangleInequalityViz\` implementation.
  - **Interactive Graphic**: Visualizes the lengths of |a|, |b|, and |a+b| as overlapping segments on a horizontal bar.
  - **Parameter Tuning**: Students drag sliders for values of \`a\` and \`b\` across positive and negative integers.
  - **Connecting to the Theorem**: Dynamically evaluates the inequality \`|a| + |b| ≧ |a + b|\` and explicitly shows that the strict equality holds only when the two values share the same sign (or are zero). When they have different signs, the "difference" clearly shows that the sum of absolute values is strictly greater.
- **Learning Value**: Math I students universally memorize the triangle inequality formula without understanding *why* it is true or when the equality holds. By sliding values and physically watching the absolute lengths add up versus the combined sum's length, the algebraic rule transforms into an obvious geometric truth (adding lengths in the same direction vs opposite directions).
- **Next Step**: Polish Data Analysis or finalize the remaining edge cases of Math I Numbers and Algebraic Expressions.
`;

const content = fs.readFileSync('logs/system_wisdom.md', 'utf8');
const [head, tail] = content.split('## Evolution History\n');
fs.writeFileSync('logs/system_wisdom.md', head + '## Evolution History\n' + wisdom + tail);
console.log("Appended wisdom 39!");
