const fs = require('fs');
const date = new Date().toISOString().split('T')[0];
const entry = `
## [${date}] Math A - Probability (場合の数)
- **Topic**: 組分け (Grouping into Unlabeled vs Labeled Sets)
- **Implementation**: Added \`GroupingViz.tsx\` as Level 11 in Probability module.
- **Value**: Visualizes the difference between labeled rooms and unlabeled groups, addressing a common trap where students forget to divide by \`k!\` when groups are indistinguishable.
`;
fs.appendFileSync('logs/system_wisdom.md', entry);
