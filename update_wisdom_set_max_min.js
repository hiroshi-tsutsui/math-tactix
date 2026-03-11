const fs = require('fs');
const path = require('path');

const wisdomFile = path.join(__dirname, 'logs', 'system_wisdom.md');
let content = fs.readFileSync(wisdomFile, 'utf8');

const date = new Date().toISOString().split('T')[0];
const entry = `
### v1.3.72: Max/Min Number of Elements in a Set (集合の要素の最大・最小) (${date})
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "集合の要素の最大・最小" (Max/Min Number of Elements in a Set) to Sets and Logic (集合と命題).
- **Visualization**: \`SetMaxMinViz\` implementation.
  - **Interactive Bars**: Visualizes the Universal set $U$, Set $A$, and Set $B$ as lengths.
  - **Visualizing Overlap limits**: The student can physically slide Set $B$ across the universe $U$. If they slide it entirely inside $A$, the overlap hits the theoretical maximum $\\min(n(A), n(B))$. If they try to pull it as far away from $A$ as possible, the physical boundary of $U$ forces an overlap, visually proving the theoretical minimum $\\max(0, n(A) + n(B) - n(U))$.
- **Learning Value**: Math I students universally fail these "max/min element" problems because they memorize the abstract formulas without seeing that it's literally just "sliding two blocks inside a box until they hit the edges." By visually preventing the blocks from leaving the universe, the minimal forced overlap calculation becomes a trivial geometric deduction.
- **Next Step**: Continue exploring Sets and Logic or expand into Data Analysis.
`;

// Insert the entry after the history header
const insertTarget = "## Evolution History\n";
if (content.includes(insertTarget)) {
    content = content.replace(insertTarget, insertTarget + entry);
    fs.writeFileSync(wisdomFile, content);
    console.log("Updated system_wisdom.md");
} else {
    console.log("Could not find the insertion target in system_wisdom.md");
}
