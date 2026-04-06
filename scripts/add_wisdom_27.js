const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const entry = `
### v1.3.100: 不等式の性質と式の値の範囲 (Properties of Inequalities and Range of Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 27 "不等式の性質と式の値の範囲" (Properties of Inequalities and Range of Values) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`InequalityRangeViz\` implementation.
  - **Interactive Operation Selection**: Students can select addition ($x+y$), subtraction ($x-y$), multiplication ($xy$), or division ($x/y$).
  - **Visualizing the Logic**: Dynamically explains *why* the minimum value of $x-y$ is calculated by subtracting the *maximum* possible $y$ from the *minimum* possible $x$.
  - **Color-Coded Feedback**: Uses red warnings for subtraction and purple warnings for division to explicitly highlight the classic "trap" of subtracting/dividing minimum by minimum.
- **Learning Value**: Math I students universally fall for the trap of calculating $1-2 < x-y < 3-4$ when given $1<x<3$ and $2<y<4$. By explicitly separating the operations and putting big, colored warnings on the logic of "making a number smaller by taking away the biggest chunk", the abstract calculation rule is firmly grounded in physical logic.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.
`;

if (!content.includes("v1.3.100")) {
    content = content.replace('## Evolution History\n', '## Evolution History\n' + entry);
    fs.writeFileSync(logPath, content);
    console.log("Wisdom updated.");
} else {
    console.log("Wisdom already has v1.3.100");
}
