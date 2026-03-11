const fs = require('fs');

const dateStr = new Date().toISOString().split('T')[0];

const newWisdom = `### v1.3.101: 展開の工夫 (組み合わせ) (Expansion by Grouping) (${dateStr})
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 28 "展開の工夫 (組み合わせ)" (Expansion by Grouping) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`ExpansionGroupingViz\` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the expansion of $(x+1)(x+2)(x+3)(x+4)$ into 5 logical steps.
  - **Visual Highlighting**: Explicitly highlights the pairs $(x+1)(x+4)$ and $(x+2)(x+3)$ and shows that their constant sums are identical ($1+4=5$, $2+3=5$).
  - **Substitution Visualization**: Explains the logic of substituting $A = x^2 + 5x$ to prevent exploding terms, and then cleanly reversing the substitution.
- **Learning Value**: Math I students universally blindly expand 4-term products, resulting in massive arithmetic errors. By visually separating the "pairing phase" from the "expansion phase", students realize that looking ahead for shared components ($x^2 + 5x$) is vastly superior to brute force.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.

`;

let content = fs.readFileSync('logs/system_wisdom.md', 'utf-8');
content = content.replace("## Evolution History\n", "## Evolution History\n\n" + newWisdom);
fs.writeFileSync('logs/system_wisdom.md', content, 'utf-8');
console.log('Appended to system_wisdom.md');
