const fs = require('fs');
const wisdomFile = 'logs/system_wisdom.md';
let wisdom = fs.readFileSync(wisdomFile, 'utf8');

const newEntry = `### v1.3.51: Two Variable Max/Min (Independent Variables) Visualization (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 39 "2変数関数の最大・最小 (独立変数)" (Max/Min of Two Independent Variables) to Quadratic Functions (二次関数).
- **Visualization**: \`IndependentVariablesViz\` implementation (Dual-slider 1D variables).
  - **Interactive Independence**: Students can adjust the value of $x$ and $y$ completely independently using two separate sliders.
  - **Visualizing the Sum**: Shows how the total value $z$ is simply the sum of the two independent parabolas ($f(x) + g(y)$).
  - **Geometric Proof**: By seeing the independent "displacements" visually, students intuitively grasp why $z$ hits its minimum *only* when $x$ and $y$ simultaneously hit their respective vertex minimums.
- **Learning Value**: Math I students are often confused by "2変数関数" (functions of two variables). They try to substitute one variable for the other, even when there is no constraint equation (like $x+y=4$). This visualization physically enforces the idea that "no constraint = completely independent movement", making the strategy of "completing the square twice" an obvious visual necessity rather than a memorized trick.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or Trigonometry.

`;

wisdom = wisdom.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);
fs.writeFileSync(wisdomFile, wisdom);
console.log('Updated system_wisdom.md');
