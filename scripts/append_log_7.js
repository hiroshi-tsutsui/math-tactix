const fs = require('fs');
const path = require('path');

const wisdomPath = path.join(__dirname, 'logs', 'system_wisdom.md');
let content = fs.readFileSync(wisdomPath, 'utf8');

const newEntry = `### v1.4.7: 箱ひげ図とヒストグラムの対応 (Box Plot and Histogram Relationship) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "箱ひげ図とヒストグラム" (Box Plot and Histogram) to Data Analysis (データの分析).
- **Visualization**: \`HistogramBoxPlotViz\` implementation.
  - **Interactive Graphic**: Visualizes a histogram with adjustable bin frequencies.
  - **Real-time Linkage**: A box plot sits directly below the histogram on the same x-axis. As students drag the histogram bars up or down to change the data distribution, the box plot dynamically updates its Min, Q1, Median, Q3, and Max.
  - **Visualizing Area = Percentile**: Explicitly links the accumulated area of the histogram to the quartiles using dashed vertical lines.
- **Learning Value**: The relationship between histogram shapes and box plots is a guaranteed topic on the Japanese Common Test (共通テスト). Students universally struggle because they look at the "height" of the box plot instead of understanding that the "width" of the box represents the spread of the middle 50% of the data. By dynamically reshaping the histogram to be right-skewed or left-skewed and watching the box stretch and compress, the student builds an undeniable physical intuition for density vs. spread.
- **Next Step**: Continue focusing on core Math I topics or expand into Data Analysis combined variance calculation.

`;

content = content.replace("## Evolution History\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync(wisdomPath, content);
console.log('Appended to system_wisdom.md');
