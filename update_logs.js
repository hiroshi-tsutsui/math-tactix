const fs = require('fs');
const file = 'logs/system_wisdom.md';
let content = fs.readFileSync(file, 'utf8');

const newLog = `### v1.4.70: 同じものを含む順列 (Indistinguishable Permutations) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "同じものを含む順列" (Permutations with Indistinguishable Items) to Probability (場合の数と確率).
- **Visualization**: \`IndistinguishablePermutationViz\` implementation.
  - **Interactive Bins**: Students use sliders to dynamically adjust the count of 'A's and 'B's.
  - **Visualizing the Formula**: Dynamically updates the total permutation calculation formula $\\frac{n!}{p!q!}$ in real time.
  - **Connecting to Combinations**: Explains the core intuition that placing identical items into a sequence is mathematically identical to choosing locations (Combinations: $_nC_r$).
- **Learning Value**: Math A students frequently memorize the $\\frac{n!}{p!q!}$ formula blindly and fail to connect it to combinations. By visually displaying the combinatorial selection of "slots" for the 'A's, the abstract formula transforms into a trivial application of Combinations.
- **Next Step**: Continue exploring high-impact test patterns.

`;

content = content.replace(/## Evolution History\n/, '## Evolution History\n\n' + newLog);
fs.writeFileSync(file, content);
