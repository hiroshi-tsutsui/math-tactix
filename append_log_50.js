const fs = require('fs');

const entry = `
### v1.4.1: 直角三角形に内接する長方形の面積の最大値 (図形問題の応用) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 50 "直角三角形に内接する長方形の面積の最大値" (Maximum area of an inscribed rectangle) to Quadratic Functions (二次関数).
- **Visualization**: \`RightTriangleRectangleViz\` implementation.
  - **Interactive Graphic**: Visualizes a right triangle and a dynamic inscribed rectangle.
  - **Parameter Tuning**: Students can drag a slider to adjust the width of the rectangle.
  - **Geometric Intuition**: Instantly shows how widening the rectangle simultaneously reduces its height, enforcing the trade-off inherent in the objective function $S = x(4-x)$.
- **Learning Value**: Math I students universally struggle with converting geometric text problems into an algebraic equation. By dynamically stretching the shape and watching the calculated Area peak and decline, the necessity of creating a quadratic equation and finding its vertex becomes physically obvious.
- **Next Step**: Polish Data Analysis or finalize remaining Math I chapters.
`;

const lines = fs.readFileSync('logs/system_wisdom.md', 'utf8').split('\n');
const insertIndex = lines.findIndex(line => line.includes('### v1.4.0: 2次不等式の解とグラフの関係'));
lines.splice(insertIndex, 0, entry);

fs.writeFileSync('logs/system_wisdom.md', lines.join('\n'));
console.log('Updated system_wisdom.md');
