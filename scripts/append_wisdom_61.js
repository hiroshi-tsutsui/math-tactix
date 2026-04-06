const fs = require('fs');

const entry = `
### v1.4.90: 2次関数の決定 (3点から決定) (Determining Quadratic Function from 3 Points) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 61 "2次関数の決定 (3点)" (Determining Quadratic Function from 3 Points) to Quadratic Functions (二次関数).
- **Visualization**: \`ThreePointsDeterminationViz\` implementation.
  - **Interactive Graphic**: Visualizes 3 fixed target points on a Cartesian plane alongside a dynamically adjustable parabola.
  - **Parameter Tuning**: Students manually adjust the coefficients $a$, $b$, and $c$ of the standard form $y = ax^2 + bx + c$ using sliders.
  - **Connecting Algebra to Geometry**: Instructs students to directly see the effect of each coefficient (width/direction, shift, y-intercept) on the parabola to make it pass through all 3 target points simultaneously. A success message appears when the perfect fit is achieved.
- **Learning Value**: Math I students universally blindly memorize the procedure of setting up a 3-variable simultaneous equation without understanding how $a$, $b$, and $c$ interact to shape the curve. By visually trying to fit the curve to the points, they develop an intuitive understanding of the role of each term in the standard form polynomial.
- **Next Step**: Continue exploring high-impact test patterns or refine core Math I Sets and Logic.
`;

const file = 'logs/system_wisdom.md';
const content = fs.readFileSync(file, 'utf8');
const [header, ...rest] = content.split('## Evolution History\n');
const newContent = header + '## Evolution History\n' + entry + rest.join('## Evolution History\n');

fs.writeFileSync(file, newContent);
