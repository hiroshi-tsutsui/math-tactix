const fs = require('fs');
let wisdom = fs.readFileSync('logs/system_wisdom.md', 'utf8');

const entry = `### v1.4.20: 2つの集団の結合と分散 (Combined Variance of Two Groups) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "2つの集団の結合と分散" (Combined Variance of Two Groups) to Data Analysis (データの分析).
- **Visualization**: \`CombinedVarianceViz\` implementation.
  - **Interactive Graphic**: Visualizes two distinct groups (A and B) on a number line, allowing students to dynamically adjust the sample size, mean, and variance of each group independently.
  - **Dynamic Total Variance**: Automatically calculates and graphically displays the total mean and the newly combined total variance.
  - **Visualizing the Formula**: Explicitly breaks down the total variance into three distinct components: Group A's internal variance, Group B's internal variance, and crucially, the "Variance of the Means" (the squared distance between each group's mean and the total mean).
- **Learning Value**: Math I students universally memorize the long formula for combined variance but fail to understand *why* the total variance is larger than just the weighted average of the two group variances. By visually seeing that the two group centers are pulled apart from the overall mean, the "$(\\bar{x}_A - \\bar{x}_{total})^2$" component physically represents the distance between the two clusters, transforming an abstract algebra nightmare into a concrete geometric addition.
- **Next Step**: Polish Data Analysis or continue to Math I Trigonometry.

`;

wisdom = wisdom.replace('## Evolution History\n', '## Evolution History\n' + entry);
fs.writeFileSync('logs/system_wisdom.md', wisdom);
