const fs = require('fs');
const path = require('path');

const wisdomPath = path.join(process.cwd(), 'logs/system_wisdom.md');
let wisdom = fs.readFileSync(wisdomPath, 'utf8');

const newEntry = `
### v1.4.4: 2次関数の最大・最小の応用 (動点問題) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 51 "2次関数の最大・最小の応用 (動点と面積)" (Max/Min Application: Moving Points and Area) to Quadratic Functions (二次関数).
- **Visualization**: \`MovingPointAreaViz\` implementation.
  - **Interactive Graphic**: Visualizes a right triangle ABC where two points P and Q move simultaneously along the edges.
  - **Parameter Tuning**: Students can drag a slider to advance time $t$ and watch points P and Q move.
  - **Geometric Intuition**: Shows the resulting triangle $\\triangle PCQ$, calculates its side lengths dynamically, and connects the physical area to the quadratic function $S = -t^2 + 6t$.
- **Learning Value**: Math I students universally struggle with "Moving Point" problems (動点問題) because visualizing the shapes changing over time while simultaneously formulating the algebraic expression is overwhelming. By linking the time slider to the physical area and the quadratic equation, students can see the peak (vertex) of the area function coincide with the geometric maximum.
- **Next Step**: Polish Data Analysis or finalize Math I chapters.
`;

wisdom = wisdom.replace('## Evolution History\n', '## Evolution History\n' + newEntry);
fs.writeFileSync(wisdomPath, wisdom);
console.log('Appended to system_wisdom.md');
