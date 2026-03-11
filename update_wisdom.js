const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(targetPath, 'utf8');

const newEntry = `### v1.3.93: 次数下げによる高次式の値 (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 23 "次数下げによる高次式の値" (Higher Degree Value by Degree Reduction) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`HigherDegreeValueViz\` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the complex algebraic manipulation of substituting an irrational number like $x = (1 + \\sqrt{5})/2$ into a 3rd or 4th-degree polynomial.
  - **Visualizing the Degree Reduction**: Shows how creating a quadratic equation ($x^2 - x - 1 = 0$) allows the student to use polynomial long division. The remainder becomes the simplified expression, dropping the degree massively.
- **Learning Value**: Math I students universally struggle with "value of higher degree expressions" because they try to brute-force plug the irrational number into $x^3$ and $x^4$. By visually separating the "divisor = 0" part, they intuitively grasp that the quotient is annihilated, leaving only a simple linear remainder to evaluate.
- **Next Step**: Polish existing levels or finalize Math I Sets and Logic (集合と命題).

`;

content = content.replace(
    "## Evolution History\n",
    "## Evolution History\n\n" + newEntry
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Wisdom updated.');
