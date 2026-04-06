const fs = require('fs');

const date = new Date().toISOString().split('T')[0];
const entry = `
### v1.4.61: 円錐の展開図と最短距離 (Shortest Path on a Cone) (${date})
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 14 "円錐の最短経路" (Shortest Path on a Cone) to Math I Trigonometry (図形と計量).
- **Visualization**: \`ConeShortestPathViz\` implementation.
  - **Interactive Graphic**: Visualizes the unfolded sector (展開図) of a cone.
  - **Parameter Tuning**: Students can independently adjust the base radius $r$ and slant height $l$.
  - **Dynamic Sector Angle**: Automatically calculates the central angle $\\theta = 360^\\circ \\times (r/l)$ and updates the drawing dynamically.
  - **Shortest Path Modes**: Students can toggle between finding the shortest path returning to the same point (A to A') or to the midpoint of the opposite generator line.
  - **Connecting to Cosine Rule**: Explicitly shows how the straight-line shortest path on the 2D sector maps to a triangle where the Cosine Rule perfectly calculates the length.
- **Learning Value**: Math I students universally struggle with "Shortest path on a cone" because they fail to visualize how wrapping around a 3D cone maps to a straight line on a 2D sector. By interactively adjusting the cone's dimensions and watching the sector's angle widen or shrink, and seeing the exact straight line path drawn with the Cosine Rule applied step-by-step, the abstract 3D visualization problem becomes a simple 2D geometry problem.
- **Next Step**: Continue exploring high-impact Math I exam topics, such as Number Theory or further Data Analysis.
`;

const lines = fs.readFileSync('logs/system_wisdom.md', 'utf8').split('\n');
const insertIndex = lines.findIndex(l => l.includes('## Evolution History')) + 1;
lines.splice(insertIndex, 0, entry);
fs.writeFileSync('logs/system_wisdom.md', lines.join('\n'));
console.log("Updated system_wisdom.md");
