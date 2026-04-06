const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const entry = `### v1.3.90: Shortest Paths Probability Visualization (最短経路の数) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Fully wired and implemented Level 6 "最短経路の数 (Shortest Paths)" in Probability (場合の数と確率). The component \`ShortestPathViz\` was imported but never rendered.
- **Visualization**: \`ShortestPathViz\` implementation.
  - **Interactive Grid**: Visualizes a 2D grid pathfinding problem where students can change the grid size using an interactive slider.
  - **Obstacle Placement**: By clicking on any intersection, students can toggle a roadblock (×), and the dynamic programming table recalculates the number of valid paths instantly.
  - **Real-time Combinatorics**: Explains the pathfinding using both combinatorics (e.g. \`_{w+h}C_w\`) when no obstacles exist, and additive logic (left + bottom) when obstacles break the pure formula.
- **Learning Value**: Math A students frequently memorize the combination formula for shortest paths but freeze when a test question introduces an impassable pond or intersection. By interactively dropping a roadblock and watching the downstream path counts plummet, students geometrically grasp the addition rule that underlines the combinatorics.
- **Next Step**: Continue expanding core Math A topics or transition to Trigonometry (図形と計量) missing modules like Sine Rule.

`;

content = content.replace('## Evolution History\n\n', '## Evolution History\n\n' + entry);
fs.writeFileSync(logPath, content);
console.log('Wisdom updated');
