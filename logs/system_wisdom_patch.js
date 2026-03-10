const fs = require('fs');
let content = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const newEntry = `
### v1.3.52: At Least One Positive Root Visualization (少なくとも1つの正の解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 40 "少なくとも1つの正の解をもつ条件" (At least one positive root condition) to Quadratic Functions (二次関数).
- **Visualization**: \`AtLeastOnePositiveRootViz\` implementation (Interactive parameter slider).
  - **Dynamic Equations**: Students adjust parameter $m$ for the equation $x^2 - 2mx + m + 2 = 0$.
  - **Visual Case Splitting**: The UI visually categorizes the scenario into "Two positive roots" vs "One positive and one non-positive root". 
  - **Condition Checking**: Real-time validation checks for $D/4 \\ge 0$, Axis $> 0$, and $f(0)$ conditions, turning green when the requirements are met. The positive x-axis is vividly highlighted when the condition is successfully cleared.
- **Learning Value**: Math I students universally struggle with "解の配置" (Location of roots) problems that require multiple case splits (場合分け). "At least one positive root" is a classic exam trap where students forget the case where one root is positive and the other is negative or zero. By interactively dragging the parabola across the axes and watching the conditions light up, this complex algebraic case-splitting becomes an obvious geometric observation.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.
`;

content = content.replace('## Evolution History\n', '## Evolution History\n' + newEntry);
fs.writeFileSync('logs/system_wisdom.md', content);
console.log('Wisdom updated.');
