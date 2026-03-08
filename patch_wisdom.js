const fs = require('fs');

let wisdom = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const newLog = `
### v1.5.9: Absolute Value Functions Max/Min Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 18 "Absolute Value Functions Max/Min" (絶対値関数の最大・最小).
- **Visualization**: \`AbsoluteValueMaxMinViz\` implementation (Canvas-based).
  - **Interactive Domain**: Students can drag sliders to adjust the interval $[a, b]$ dynamically over the absolute value graph $y = |x^2 + bx + c|$.
  - **Visualizing Max/Min**: The domain area is highlighted, the graph within the domain is emphasized in red, and the absolute maximum and minimum values are displayed.
- **Learning Value**: Calculating the max/min of absolute value quadratic functions is a common pain point. By visualizing the "reflection" (折り返し) at the x-axis and sliding the domain over it, students instantly grasp why the vertex or boundary might be the max/min.
- **Next Step**: Expand into Trigonometry (図形と計量) or solidify Data Analysis.
`;

wisdom = wisdom.replace('## Evolution History\n', '## Evolution History\n' + newLog);

fs.writeFileSync('logs/system_wisdom.md', wisdom);
console.log("Updated system_wisdom.md");
