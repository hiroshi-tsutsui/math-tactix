const fs = require('fs');
const file = 'logs/system_wisdom.md';
let code = fs.readFileSync(file, 'utf8');

const newEntry = `### v1.3.41: Moving Axis Max/Min Visualization (軸が動く最大・最小) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Created \`MovingAxisViz\` component in Quadratics (二次関数) for the classic "Fixed Domain, Moving Axis" problem.
- **Visualization**: \`MovingAxisViz\` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = (x - a)^2 - 1$ passing through a fixed domain $0 \\le x \\le 2$.
  - **Parameter Tuning**: Students slide the axis parameter $a$.
  - **Real-time Case Splitting**: The UI dynamically updates the text and highlights to track the Minimum (3 cases) and Maximum (3 cases) relative to the domain center ($x=1$).
- **Learning Value**: This is arguably the most notorious "wall" in Math I Quadratics. Students struggle to simultaneously visualize the parabola moving and the boundaries standing still. By sliding $a$ interactively, the case-splits ("Is the axis left of 0?", "Is it right of 1?") become blindingly obvious geometric facts rather than memorized algebra.

`;

// Insert after Evolution History header
code = code.replace("## Evolution History\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync(file, code);
