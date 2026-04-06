const fs = require('fs');
const path = './logs/system_wisdom.md';

const logEntry = `
### v1.4.10: 壁を利用した長方形の面積の最大化 (Maximizing Rectangular Enclosure Area) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 53 "壁を利用した長方形の面積の最大化" (Maximizing Area of a Rectangular Enclosure) to Quadratic Functions (二次関数).
- **Visualization**: \`FenceEnclosureViz\` implementation.
  - **Interactive Graphic**: Visualizes a 20m fence enclosing a rectangular area against a wall.
  - **Parameter Tuning**: Students can drag a slider to adjust the perpendicular side length $x$, watching the parallel side $20-2x$ dynamically update.
  - **Geometric Intuition**: Instantly shows how widening the enclosure simultaneously reduces its depth, enforcing the trade-off inherent in the objective function $S = x(20-2x)$. The quadratic graph syncs with the physical area, proving the vertex max.
- **Learning Value**: Math I students universally struggle with converting geometric word problems into algebraic equations. By dynamically stretching the shape and watching the calculated Area peak, the necessity of creating a quadratic equation and finding its vertex becomes physically obvious.
- **Next Step**: Polish existing chapters and refine remaining core Math I edge cases.
`;

let content = fs.readFileSync(path, 'utf8');

// Insert after "## Evolution History"
content = content.replace("## Evolution History\n", "## Evolution History\n" + logEntry);

fs.writeFileSync(path, content, 'utf8');
console.log('Appended to system_wisdom.md');
