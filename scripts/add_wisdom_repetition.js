const fs = require('fs');
let content = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const newEntry = `### v1.3.92: Combinations with Repetition (重複組合せ) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "重複組合せ (nHr)" (Combinations with Repetition) to Probability (場合の数と確率).
- **Visualization**: \`CombinationRepetitionViz\` implementation.
  - **Interactive Bins and Balls**: Students adjust the number of items (balls) $n$ and categories (bins) $r$ using sliders.
  - **Visualizing the Formula**: Explicitly maps the abstract formula $_{n+r-1}C_{n}$ to the physical arrangement of $n$ balls and $r-1$ dividers in a single row.
  - **Real-time Equation Mapping**: Shows how the arrangement of balls and dividers directly maps to the integer solutions of the equation $x_1 + x_2 + \\dots + x_r = n$, displaying the grouped sums visually below the arrangement.
- **Learning Value**: Math A students frequently memorize the $nHr$ formula blindly and forget whether to add or subtract 1. By visually dropping $n$ balls and $r-1$ dividers into slots, the total number of slots $(n+r-1)$ becomes physically obvious, completely eliminating the need to memorize the abstract formula.
- **Next Step**: Continue expanding Math A probability or transition into advanced Math I Data Analysis.

`;

content = content.replace("## Evolution History\n\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync('logs/system_wisdom.md', content);
