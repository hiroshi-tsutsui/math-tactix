const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/system_wisdom.md');
let content = fs.readFileSync(logPath, 'utf-8');

const newEntry = `
### v1.3.57: Domain-Specific Always Positive/Negative Condition (特定の区間で常に正・負となる条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 45 "特定の区間で常に正・負となる条件" (Conditions for Always Positive/Negative in a Specific Domain) to Quadratic Functions (二次関数). Also successfully bound Level 44 "一方だけが実数解をもつ条件" into the page.tsx UI.
- **Visualization**: \`DomainAlwaysPositiveViz\` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $f(x) = x^2 - 2ax + a + 2$ defined strictly on the interval $[0, 2]$.
  - **Dynamic Case Logic**: As students slide the parameter $a$, the vertex moves. The visualization automatically identifies whether the vertex is to the left of 0, inside the interval, or to the right of 2, and displays the literal value of the minimum on the interval.
  - **Condition Validation**: Highlights the region above the x-axis in green and explicitly checks if the minimum value stays strictly above 0.
- **Learning Value**: Math I students universally struggle with "Absolute Inequalities on a Restricted Domain". They memorize $D < 0$ for "always positive" but forget that on a restricted domain, the graph can dip below the x-axis *outside* the domain and still be perfectly valid. By sliding the parabola and explicitly tracking the lowest point *inside the blue box*, the case-splitting (場合分け) logic becomes an undeniable physical boundary check.
- **Next Step**: The Quadratic Functions (二次関数) module is now essentially complete as a comprehensive visual encyclopedia of all exam patterns. Next cycle should aggressively shift focus to Math I "Numbers and Algebraic Expressions" (数と式) or "Data Analysis" (データの分析).
`;

const insertionPoint = content.indexOf('## Evolution History') + '## Evolution History'.length;
content = content.substring(0, insertionPoint) + '\n' + newEntry + content.substring(insertionPoint);

fs.writeFileSync(logPath, content);
console.log("Wisdom updated.");
