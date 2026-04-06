const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'system_wisdom.md');
let logContent = fs.readFileSync(logPath, 'utf-8');

const newEntry = `### v1.3.95: 1次方程式 ax = b の解の分類 (Solution of Linear Equation ax = b) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 24 "1次方程式 ax = b の解の分類" (Classification of Solutions for Linear Equation ax = b) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`LinearEquationCasesViz\` implementation.
  - **Interactive Graphic**: Visualizes $y = ax$ (a line passing through the origin) and $y = b$ (a horizontal line) on a 2D plane.
  - **Parameter Tuning**: Students can adjust the slope $a$ and the height $b$ using sliders.
  - **Dynamic Case Logic**:
    - When $a \neq 0$: Visually confirms the two lines intersect at exactly one point ($x = b/a$).
    - When $a = 0, b = 0$: The lines perfectly overlap on the x-axis, visually proving "Infinite solutions" (すべての実数).
    - When $a = 0, b \neq 0$: The lines are strictly parallel, visually proving "No solution" (解なし/不能).
- **Learning Value**: Math I students universally blindly divide by $a$ when solving $ax = b$, completely forgetting to check if $a = 0$. By splitting the equation into two linear graphs, the algebraic trap of dividing by zero is transformed into an obvious geometric observation about parallel vs overlapping lines.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or Trigonometry.

`;

// Insert after Evolution History heading
const insertIndex = logContent.indexOf('## Evolution History') + 20;
const firstHalf = logContent.slice(0, insertIndex);
const secondHalf = logContent.slice(insertIndex);

fs.writeFileSync(logPath, firstHalf + '\n\n' + newEntry + secondHalf);
console.log('Successfully updated system_wisdom.md');
