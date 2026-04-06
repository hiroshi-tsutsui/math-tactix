const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(targetFile, 'utf8');

const newEntry = `### v1.3.69: Integer and Fractional Parts of Irrational Numbers (無理数の整数部分と小数部分) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 9 "無理数の整数部分と小数部分" (Integer and Fractional Parts of Irrational Numbers) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`IntegerFractionalPartViz\` implementation.
  - **Interactive Number Line**: Students adjust the value of $n$ for $\\sqrt{n}$.
  - **Visualizing the Gap**: The exact position of $\\sqrt{n}$ is plotted between two perfect squares.
  - **Defining the Fractional Part**: Explicitly visualizes the fractional part $b$ not as a raw decimal, but as the literal geometric "gap" between $\\sqrt{n}$ and its floor integer $a$. It forces the understanding of the algebraic identity $b = \\sqrt{n} - a$.
- **Learning Value**: Math I students universally stumble when asked to compute expressions like $a^2 + ab + b^2$ given the fractional part of an irrational number. They fail to understand that $b$ is simply the remainder after subtracting the integer part. By visualizing this remainder geometrically as a line segment, the formula $b = \\text{original} - \\text{integer}$ becomes completely intuitive.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., Absolute Value equations with external variables) or move to Math I Data Analysis.

`;

content = content.replace('## Evolution History\n', '## Evolution History\n\n' + newEntry);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated system_wisdom.md');
