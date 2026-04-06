const fs = require('fs');

const path = 'logs/system_wisdom.md';
let content = fs.readFileSync(path, 'utf8');

const newEntry = `### v1.4.15: 最大整数解から定数の範囲を決定 (Maximum Integer Solution Range) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 32 "最大整数解から定数の範囲を決定" (Determining Constant Range from Maximum Integer Solution) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`MaxIntegerSolutionViz\` implementation.
  - **Interactive Number Line**: Students dynamically drag the parameter $a$ which slides the boundary $\\frac{a+5}{2}$ along a number line containing integers.
  - **Visualizing the Boundary Trap**: Explains physically why the boundary must be $3 < \\text{boundary} \\le 4$ if the target maximum integer is 3.
  - **Color-Coded Feedback**: Uses red warnings and green success markers to explicitly highlight the classic "trap" of whether the inequality includes the equal sign (i.e. why it is $\\le 4$ but not $\\le 3$).
- **Learning Value**: Math I students universally fall for the trap of incorrectly setting the boundary inequalities when solving maximum integer problems. By turning the algebraic range into a physical "slider" that scoops up integers, and explicitly highlighting the moment a new integer is caught on the boundary, the case-splitting logic becomes an undeniable physical fact rather than an abstract rule.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Trigonometry.

`;

if (!content.includes('最大整数解から定数の範囲を決定')) {
  // Insert right after "## Evolution History\n"
  content = content.replace("## Evolution History\n", "## Evolution History\n" + newEntry);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Appended to system_wisdom.md');
}
