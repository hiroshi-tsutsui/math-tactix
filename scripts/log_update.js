const fs = require('fs');
const file = 'logs/system_wisdom.md';
let content = fs.readFileSync(file, 'utf8');

const newLog = `### v1.3.50: Space Geometry Surveying Fix & Heron's Formula (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Restored the rendering logic for Level 11 "空間図形・測量" (Surveying) which was accidentally hidden, and added Level 12 "ヘロンの公式" (Heron's Formula) to Math I Trigonometry (図形と計量). Bumped Quiz to Level 13.
- **Visualization**: \`HeronsFormulaViz\` implementation.
  - **Interactive Triangle**: Students can dynamically adjust all three sides (\`a, b, c\`) using sliders.
  - **Real-time Geometric Check**: Visually enforces the triangle inequality (\`a+b>c\`, etc.) and displays a "Triangle not possible" error when violated.
  - **Visual Calculation**: Explicitly shows the "half-perimeter" \`s\` and directly links it to the calculation steps of the formula \`S = √[s(s-a)(s-b)(s-c)]\`.
- **Learning Value**: Math I students often memorize Heron's formula but fail to recognize when it is invalid (e.g. side lengths that don't close a triangle). By visually reconstructing the triangle from the 3 sides dynamically, it forces the understanding that the formula only works when the geometry actually exists.
- **Next Step**: Polish Data Analysis or continue expanding core Math I and Math A topics.

`;

content = content.replace('## Evolution History\n\n', '## Evolution History\n\n' + newLog);
fs.writeFileSync(file, content);
