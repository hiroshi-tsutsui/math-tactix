const fs = require('fs');
const FILE = 'logs/system_wisdom.md';
let content = fs.readFileSync(FILE, 'utf8');

const entry = `
### v1.4.50: 絶対値を含む式の値 (Value of Expression with Absolute Value) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 41 "絶対値を含む式の値" (Value of Expression with Absolute Value) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`ValueAbsoluteViz\` implementation.
  - **Interactive Parameter Tuning**: Students adjust the value of \`a\` from 0 to 10 for the absolute value expression \`|a - 5|\`.
  - **Dynamic Case Logic**: Shows explicit real-time text explaining whether the inside of the absolute value is positive or negative.
  - **Visualizing the Bracket Rule**: Explicitly shows the application of negative brackets \`-(a-5)\` when the inside is negative, preventing the classic sign error.
- **Learning Value**: Math I students universally struggle with "Case Splitting" (場合分け) when absolute values are involved. By interactively moving the slider and seeing the negative sign snap on when the boundary is crossed, students visually understand the core mechanic of the absolute value sign.
- **Next Step**: Polish existing core Math I topics or expand further into test-style generation.
`;

content = content.replace(/(## Evolution History\n)/, `$1${entry}`);
fs.writeFileSync(FILE, content);
console.log("Updated system_wisdom.md");
