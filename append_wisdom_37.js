const fs = require('fs');

const logPath = 'logs/system_wisdom.md';
let logData = fs.readFileSync(logPath, 'utf8');

const newWisdom = `### v1.4.37: 1次不等式の文章題 (損益分岐点・料金プラン) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 37 "1次不等式の文章題 (損益分岐点・料金プラン)" (Word Problem of Linear Inequality - Discount Break-even Point) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: \`DiscountInequalityViz\` implementation.
  - **Interactive Graphic**: Visualizes the cost of purchasing items normally versus purchasing with a paid membership card.
  - **Parameter Tuning**: Students drag a slider to dynamically adjust the number of items purchased.
  - **Real-time Evaluation**: Automatically calculates and graphically compares the total costs.
  - **Color-Coded Feedback**: Vividly highlights the break-even point where the membership card becomes cheaper, translating the abstract inequality ($100x > 500 + 80x$) into an obvious financial reality.
- **Learning Value**: Math I students universally stumble with discount/plan comparison inequalities because the initial fixed cost (500 yen) makes the algebraic comparison unintuitive. By explicitly watching the two total price bars race against each other as the item count increases, the algebraic "greater than" is grounded in a literal race for the cheaper total.
- **Next Step**: Continue focusing on core Math I topics or expand further into Sets and Logic.

`;

const marker = '## Evolution History\n';
if (logData.includes(marker)) {
    logData = logData.replace(marker, marker + '\n' + newWisdom);
    fs.writeFileSync(logPath, logData);
    console.log('Appended to system_wisdom.md');
} else {
    console.log('Marker not found.');
}
