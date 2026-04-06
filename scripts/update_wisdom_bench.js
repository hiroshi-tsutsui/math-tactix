const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf8');

const newEntry = `
### v1.3.71: Linear Inequality Word Problem (1次不等式の文章題 - 長椅子) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 11 "1次不等式の文章題 (過不足)" (Word Problem of Linear Inequality) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`BenchWordProblemViz\` implementation.
  - **Interactive Benches**: Students slide the number of benches.
  - **Visualizing Allocation**: Dynamically fills the benches with 5 students each, showing the leftover students or empty seats visually.
  - **Connecting to Inequalities**: Real-time evaluation of the two boundary conditions (last bench is empty, second to last has 1 to 5 students). It explicitly shows why the inequality $5(x-2) < 4x+5 \\le 5(x-1)$ must hold.
- **Learning Value**: Math I students universally struggle with the "Long Bench Problem". They often blindly memorize the inequality formulation without understanding the physical reality of the "second to last bench". By visually dropping students into the seats and dynamically highlighting which conditions are met, the abstract inequality formulation becomes a concrete counting exercise.
- **Next Step**: Polish existing levels or expand further into Sets and Logic.
`;

content = content.replace('## Evolution History\n', '## Evolution History\n' + newEntry);
fs.writeFileSync(logPath, content);
console.log("Updated system_wisdom.md");
