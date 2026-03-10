const fs = require('fs');
const logPath = 'logs/system_wisdom.md';
let logContent = fs.readFileSync(logPath, 'utf8');

const newEntry = `### v1.3.39: Difference Function Visualization (2つのグラフの差の関数) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 37 "2つのグラフの差の関数" (Difference Function of Two Graphs) to Quadratics.
- **Visualization**: \`DifferenceFunctionViz\` implementation (Canvas-based dual graphs).
  - **Interactive Dual Graphs**: Visualizes $f(x)$ (Parabola) and $g(x)$ (Line) on the top canvas, and their difference function $h(x) = f(x) - g(x)$ on the bottom canvas simultaneously.
  - **Real-time Linkage**: As students slide the parameters $a$ (parabola width), $m$ (line slope), and $k$ (line intercept), the intersections of $f(x)$ and $g(x)$ dynamically track exactly to the x-intercepts of $h(x)$.
  - **Visualizing the Intersection**: Draws vertical dashed tracking lines that explicitly connect the top intersections to the bottom roots, proving geometrically that $f(x) = g(x) \\iff f(x) - g(x) = 0$.
- **Learning Value**: "Difference functions" are the conceptual backbone for solving quadratic inequalities, intersection problems, and ultimately Math II integration. Students often manipulate $f(x) - g(x)$ purely algebraically without realizing they are creating a new "flat" world where the intersection line becomes the new x-axis. By splitting the screen and showing both worlds reacting perfectly in sync, this abstract algebraic trick becomes an undeniable geometric reality.
- **Next Step**: Polish existing data analysis levels or focus strictly on Math I Trigonometry.

`;

logContent = logContent.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);
fs.writeFileSync(logPath, logContent);
console.log('Wisdom updated');
