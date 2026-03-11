const fs = require('fs');
let content = fs.readFileSync('logs/system_wisdom.md', 'utf-8');

const newEntry = `### v1.3.98: 平方根と絶対値の文字式簡約化 (Simplification of Square Roots and Absolute Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 26 "平方根と絶対値 (文字式の簡約化)" (Simplification of Square Roots and Absolute Values) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`RootAbsoluteSimplificationViz\` implementation.
  - **Interactive Number Line**: Students dynamically drag the value of $x$ across the number line.
  - **Visualizing the Domain**: The number line explicitly splits into 3 colored zones ($x < 2$, $2 \\le x < 5$, $x \\ge 5$).
  - **Case Splitting Logic**: As $x$ moves across the boundaries, the absolute values $|x-2|$ and $|x-5|$ dynamically "flip" their signs, visually proving why the final simplified expression changes from $-2x+7$ to $3$ to $2x-7$.
- **Learning Value**: Math I students universally fall for the trap of simplifying $\\sqrt{(x-2)^2} + \\sqrt{(x-5)^2}$ blindly into $2x-7$. By forcing them to slide $x$ and watch the terms react to being positive or negative, the abstract necessity of case splitting becomes an undeniable physical boundary check.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.

`;

content = content.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);
fs.writeFileSync('logs/system_wisdom.md', content);
