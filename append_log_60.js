const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const newEntry = `### v1.4.60: 2次関数の決定 (頂点が直線上にある) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 60 "2次関数の決定 (頂点が直線上にある)" (Determining Quadratic Function: Vertex on a Line) to Quadratic Functions (二次関数).
- **Visualization**: \`VertexOnLineViz\` implementation.
  - **Interactive Graphic**: Visualizes the constraint line $y = 2x - 1$ and a dynamically moving parabola.
  - **Parameter Tuning**: Students slide the parameter $p$, physically moving the vertex precisely along the constraint line.
  - **Target Matching**: The target point $(2, 2)$ acts as a visual goal. When the parabola hits it, it validates the substitution mathematically.
- **Learning Value**: Math I students always forget to substitute the $y$-coordinate of the vertex ($q$) with the line equation ($2p-1$). By locking the vertex's movement strictly to the line while sliding $p$, it physically proves that the substitution forces the vertex to "ride" the line, turning a confusing algebraic constraint into an obvious geometric rule.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Trigonometry (図形と計量).

`;

const splitText = "## Evolution History\n\n";
const parts = content.split(splitText);
if (parts.length === 2) {
  content = parts[0] + splitText + newEntry + parts[1];
  fs.writeFileSync(logPath, content);
  console.log("Log appended!");
} else {
  console.log("Could not find split text");
}
