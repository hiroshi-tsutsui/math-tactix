const fs = require('fs');
let file = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const entry = `### v1.3.97: 度数分布表と代表値 (Frequency Distribution Table and Representative Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 6 "度数分布表と代表値" (Frequency Distribution Table and Representative Values) to Data Analysis (データの分析).
- **Visualization**: \`FrequencyTableViz\` implementation.
  - **Interactive Histogram**: Students can drag the height of each frequency bin up and down interactively.
  - **Real-time Table Mapping**: The frequency distribution table updates its values simultaneously.
  - **Visualizing Mean and Median**: A vertical red line dynamically moves to show the exact mean (calculated via class marks), and the median class is vividly highlighted in purple.
- **Learning Value**: Math I students often memorize the formula for the mean from a frequency table without connecting the "class mark $\\times$ frequency" to the physical center of mass of the histogram. By dragging the bars and watching the mean line shift and the median class jump, the abstract calculation is anchored to geometric intuition.
- **Next Step**: Polish Data Analysis or continue to Math I Numbers and Algebraic Expressions (数と式).

`;

file = file.replace(/## Evolution History\n/g, '## Evolution History\n\n' + entry);
fs.writeFileSync('logs/system_wisdom.md', file);
