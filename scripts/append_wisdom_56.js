const fs = require('fs');

const logPath = './logs/system_wisdom.md';
let log = fs.readFileSync(logPath, 'utf8');

const newEntry = `### v1.4.17: 2つの放物線の交点を通る図形群 (Family of Curves through Intersections) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 56 "2つの放物線の交点を通る図形" (Family of Curves passing through the intersections of two parabolas) to Quadratic Functions (二次関数).
- **Visualization**: \`IntersectionParabolasViz\` implementation.
  - **Interactive Parameter Tuning**: Students can adjust the parameter $k$ for the equation $f(x) + k \\cdot g(x) = 0$.
  - **Dynamic Family of Curves**: The visualization plots both original parabolas and their intersections, along with the dynamically changing new curve.
  - **Visualizing the Common Chord**: Explicitly proves that when $k=1$ (i.e., when the $x^2$ terms cancel out), the equation simplifies to a linear function, visually snapping into the "Common Chord" (共通弦) line passing through the two intersection points.
- **Learning Value**: Math I and II students universally struggle with "Curve passing through the intersection of two curves" (束の考え方/Family of curves) because the algebraic trick $f(x) + kg(x) = 0$ is highly abstract. By sliding the $k$ parameter and watching the new parabola pivot perfectly around the two fixed intersection points, and seeing it suddenly snap into a straight line at $k=1$, the algebraic trick transforms into an undeniable geometric constraint.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or expand into Sets and Logic.

`;

const splitText = '## Evolution History\n';
const parts = log.split(splitText);
fs.writeFileSync(logPath, parts[0] + splitText + newEntry + parts[1]);
console.log('Appended to system_wisdom.md');
