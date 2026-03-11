const fs = require('fs');

const date = new Date().toISOString().split('T')[0];
const entry = `
### v1.3.63: Number of Integer Solutions to Linear Inequalities (1次不等式の整数解の個数) (${date})
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 3 "1次不等式の整数解の個数" (Number of Integer Solutions) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`IntegerSolutionsViz\` implementation.
  - **Focus on Boundaries**: Students visually drag the boundary $a$ across a number line.
  - **Dynamic Highlights**: Explicitly toggles between "include" ($\\le$) and "exclude" ($<$) and shows how that affects boundary counting.
- **Learning Value**: Math I students frequently confuse the boundary conditions (whether $a = 4$ means 3 integers or 4 integers) depending on the inequality sign. By dragging the boundary and seeing the dots turn blue or red, the logical deduction is replaced by visual certainty.
- **Next Step**: Polish Math I Numbers and Algebraic Expressions further.
`;

const path = 'logs/system_wisdom.md';
let content = fs.readFileSync(path, 'utf8');

const anchor = "## Evolution History\n";
if (content.includes(anchor)) {
  content = content.replace(anchor, anchor + entry);
  fs.writeFileSync(path, content);
  console.log("system_wisdom.md updated.");
} else {
  console.error("Could not find anchor in system_wisdom.md");
}
