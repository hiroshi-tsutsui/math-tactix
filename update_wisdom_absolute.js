const fs = require('fs');
const path = require('path');

const wisdomPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(wisdomPath, 'utf8');

const newEntry = `
### v1.3.60: Absolute Value Equations and Inequalities (絶対値を含む方程式・不等式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 2 "絶対値を含む方程式・不等式" to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`AbsoluteValueViz\` implementation.
  - **Focus on Distance**: Students interactively adjust the center point $a$ and distance $c$.
  - **Dynamic Highlights**: Toggle between $=, <, >$ visually highlights the valid range on a number line, mapping algebraically abstract inequalities directly to geometric distance.
- **Learning Value**: Math I students frequently confuse $|x-a| < c$ (inside range) and $|x-a| > c$ (outside range). By showing the distance graphically, they intuitively understand why the solutions split into two inequalities or form a single continuous interval.
- **Next Step**: Continue expanding Math I topics or refine test-generation logic.
`;

// Insert the new entry right after the '## 4. History of Refactoring (Migration Log)' section or at the top of the history.
const parts = content.split('## 4. History of Refactoring (Migration Log)');
if (parts.length === 2) {
  content = parts[0] + '## 4. History of Refactoring (Migration Log)\n' + newEntry + parts[1];
  fs.writeFileSync(wisdomPath, content);
  console.log('Added to system_wisdom.md');
} else {
  console.error('Could not find history section in system_wisdom.md');
}
