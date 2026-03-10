const fs = require('fs');
const wisdomPath = 'logs/system_wisdom.md';
let wisdom = fs.readFileSync(wisdomPath, 'utf8');

const newEntry = `
### v1.3.55: Profit Maximization Word Problem (利益の最大化の応用) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 43 "利益の最大化 (文章題)" (Profit Maximization) to Quadratic Functions (二次関数).
- **Visualization**: \`ProfitMaximizationViz\` implementation.
  - **Focus on Word Problem**: Students dynamically adjust the number of price increases (x) using a slider.
  - **Real-time Equations**: Visually displays the dynamically calculated Price ($100 + 10x$), Sales ($1000 - 50x$), and Total Profit.
  - **Parabolic Insight**: Displays the profit parabola on a canvas, matching the student's current position to the vertex (maximum profit).
- **Learning Value**: Math I students often struggle with word problems because translating text into equations ($y = (100+10x)(1000-50x)$) is abstract. By interactively linking the price slider to the visual geometry of a parabola and seeing the profit literally peak, it grounds the algebraic model in a concrete real-world scenario.
- **Next Step**: Continue expanding Math I topics or refine word problem variations.
`;

wisdom = wisdom.replace('## Evolution History\n', `## Evolution History\n${newEntry}`);
fs.writeFileSync(wisdomPath, wisdom);
console.log('Updated system_wisdom.md');
