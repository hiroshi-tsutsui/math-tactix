const fs = require('fs');
const content = fs.readFileSync('logs/system_wisdom.md', 'utf8');
const entry = `### v1.4.63: 正四面体の計量 (Regular Tetrahedron) (2026-03-13)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 15 "正四面体の計量" (Measurement of Regular Tetrahedron) to Math I Trigonometry (図形と計量).
- **Visualization**: \`TetrahedronViz\` implementation.
  - **Interactive Graphic**: Visualizes a 3D isometric projection of a regular tetrahedron.
  - **Parameter Tuning**: Students can adjust the side length $a$ dynamically.
  - **Step-by-step Calculation Modes**: Toggles explicitly between finding the Height (高さ), Inscribed Sphere Radius (内接球の半径), and Circumscribed Sphere Radius (外接球の半径).
  - **Visualizing the Radius Logic**: Visually isolates the center $O$ and proves that the inscribed sphere's radius $r$ comes from dividing the tetrahedron into 4 equal pyramids, naturally arriving at $r = h/4$. It then geometrically proves that the remaining height must be the circumscribed radius $R = 3/4 h$.
- **Learning Value**: Math I students universally blindly memorize the formulas for the height $h = \\frac{\\sqrt{6}}{3}a$, volume $V = \\frac{\\sqrt{2}}{12}a^3$, and the radii $r$ and $R$ of a regular tetrahedron. By providing a 3D visual projection and explicitly walking through the geometric decomposition (triangle centroid -> 4 inner pyramids), rote memorization transforms into an intuitive, derivable geometric process.
- **Next Step**: Continue exploring high-impact Math I exam topics, such as Sets and Logic or Data Analysis.

`;

const targetIndex = content.indexOf('## Evolution History\n\n') + '## Evolution History\n\n'.length;
const newContent = content.substring(0, targetIndex) + entry + content.substring(targetIndex);

fs.writeFileSync('logs/system_wisdom.md', newContent);
console.log('Wisdom updated');
