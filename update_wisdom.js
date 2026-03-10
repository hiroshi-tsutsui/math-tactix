const fs = require('fs');

const date = new Date().toISOString().split('T')[0];
const entry = `
### v1.3.45: Independent Trials Probability Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 4 "反復試行の確率" (Independent Trials Probability) to Probability (場合の数と確率). Note: A previous uncommitted broken build for Heron's Formula was reverted to stabilize the main branch.
- **Visualization**: \`IndependentTrialsViz\` implementation (Canvas-based Grid).
  - **Interactive Simulation**: Students can adjust the total number of trials $n$, the target number of successes $r$, and the probability of success $p$.
  - **Grid Navigation**: Visualizes the $2^n$ possible paths as a geometric grid where the x-axis represents successes and the y-axis represents failures.
  - **Path Highlighting**: Explicitly highlights the node $(r, n-r)$ and displays the combinatorial count $_nC_r$ alongside the probability formula $_nC_r \\times p^r \\times (1-p)^{n-r}$.
- **Learning Value**: Math A students frequently memorize the formula blindly without understanding the combinatorial $_nC_r$ component. By physically mapping the sequence of successes and failures onto a grid, the formula's origin (number of paths $\\times$ probability of one path) becomes a self-evident geometric property.
- **Next Step**: Polish Data Analysis or restore Trigonometry's Heron Formula with proper types.
`;

let file = fs.readFileSync('logs/system_wisdom.md', 'utf8');
// Insert right after the header Evolution History
file = file.replace('## Evolution History\n', '## Evolution History\n' + entry);
fs.writeFileSync('logs/system_wisdom.md', file);
