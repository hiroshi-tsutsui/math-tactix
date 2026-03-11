const fs = require('fs');

const logFile = 'logs/system_wisdom.md';
let logContent = fs.readFileSync(logFile, 'utf8');

const newEntry = `
### v1.3.67: Absolute Value of Square Root Visualization (平方根と絶対値) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "平方根と絶対値 (√a² = |a|)" to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`RootAbsoluteViz\` implementation.
  - **Interactive Check**: Students slide the value of $a$ between negative and positive values.
  - **Dynamic Step-by-Step**: Explicitly shows the intermediate calculation $\\sqrt{(-5)^2} = \\sqrt{25} = 5$.
  - **Feedback Matching**: When $a$ drops below 0, it dynamically explains why it is mathematically invalid to just pull it out as $-5$ and justifies placing the minus sign in front to make it positive.
- **Learning Value**: Math I students universally fall for the trap of writing $\\sqrt{a^2} = a$, completely ignoring that the $\\sqrt{\\quad}$ symbol strictly denotes the principal (non-negative) root. By manually dragging the value below zero and watching the computation explicitly enforce positivity via absolute value, the abstract rule $\\sqrt{a^2} = |a|$ becomes a physically obvious necessity.
- **Next Step**: Polish existing levels or expand further into test-style generation.
`;

const insertPoint = logContent.indexOf('## Evolution History') + '## Evolution History'.length;
logContent = logContent.slice(0, insertPoint) + '\n' + newEntry + logContent.slice(insertPoint);

fs.writeFileSync(logFile, logContent);
