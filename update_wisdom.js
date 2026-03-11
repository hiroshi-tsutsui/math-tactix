const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const newEntry = `### v1.3.73: Necessary and Sufficient Conditions Number Line (必要条件と十分条件の数直線) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "必要条件・十分条件と数直線" (Necessary and Sufficient Conditions with Number Lines) to Sets and Logic (集合と命題). Also permanently fixed the \`math_i_numbers\` \`page.tsx\` file corruption that duplicated tasukigake and swallowed the Bench Word Problem component.
- **Visualization**: \`ConditionNumberLineViz\` implementation.
  - **Interactive Ranges**: Students slide the parameter $a$ which controls the boundaries of Condition P ($|x - a| < 2$).
  - **Dynamic Overlap**: The component visually tracks whether the moving range P is entirely inside the fixed range Q ($0 < x < 5$) or vice versa.
  - **Real-time Truth Value**: The text explicitly links the geometric inclusion (P is completely inside Q) to the logical statement "P is a sufficient condition for Q" (P ⊂ Q).
- **Learning Value**: Math I students universally struggle with necessary/sufficient condition problems that involve inequalities. They try to algebraically solve the inequalities without realizing it's fundamentally a geometric "does this box fit inside that box?" problem. By dragging the range and watching the condition flip from "None" to "Sufficient" to "Necessary", the logical terminology maps perfectly to physical containment.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.

`;

content = content.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);
fs.writeFileSync(logPath, content);
console.log("Updated system_wisdom.md");
