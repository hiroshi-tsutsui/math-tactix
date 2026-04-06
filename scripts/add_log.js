const fs = require('fs');

const path = 'logs/system_wisdom.md';
let content = fs.readFileSync(path, 'utf8');

const newLog = `
### v1.4.65: 放物線の弦の長さ (Chord Length of Parabola) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 60 "放物線の弦の長さ" (Chord Length of a Parabola) to Quadratic Functions (二次関数).
- **Visualization**: \`ChordLengthViz\` implementation.
  - **Interactive Graphic**: Visualizes the intersection of $y = x^2$ and $y = mx + n$.
  - **Parameter Tuning**: Students dynamically adjust the slope and intercept of the line.
  - **Connecting to the Formula**: Visually connects the distance formula with the quadratic solutions.
- **Learning Value**: Math I students struggle with finding the distance between intersections purely algebraically. By sliding the line and visualizing the segment, the algebraic process is grounded geometrically.
- **Next Step**: Polish Data Analysis or finalize the remaining edge cases of Math I.
`;

// Insert after "## Evolution History\n"
content = content.replace("## Evolution History\n", "## Evolution History\n" + newLog);

fs.writeFileSync(path, content);
console.log("Updated system_wisdom.md");
