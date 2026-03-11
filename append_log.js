const fs = require('fs');
const file = 'logs/system_wisdom.md';
let content = fs.readFileSync(file, 'utf8');

const logEntry = `### v1.3.88: 1次不等式の文章題 (食塩水・濃度) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 22 "1次不等式の文章題 (食塩水・濃度)" (Word Problem of Linear Inequality - Salt Water) to Math I Numbers and Algebraic Expressions (数と式). Also fully bound Levels 20 and 21 into the UI array to ensure visibility.
- **Visualization**: \`SaltWaterInequalityViz\` implementation.
  - **Interactive Graphic**: A visual beaker showing the proportion of salt (fixed) vs water (increasing as water is added).
  - **Dynamic Tracking**: As the user slides the amount of added water, the total weight and the concentration percentage update in real time.
  - **Visual Threshold**: When the concentration drops below the 10% target, the UI gives explicit visual feedback ("条件クリア"), linking the physical addition of water to solving the rational inequality.
- **Learning Value**: Math I students universally struggle with "salt water" problems because the abstract rational expression $\\frac{20}{100+x}$ masks the physical reality that adding water only increases the denominator. By watching the beaker fill up and the concentration dynamically thin out, this classic test word problem turns into an obvious visual relationship.
- **Next Step**: Polish Math I Data Analysis (データの分析) or expand into Sets and Logic (集合と命題).

`;

// insert below the Mission Statement heading
content = content.replace('## Evolution History\n', '## Evolution History\n\n' + logEntry);
fs.writeFileSync(file, content);
