const fs = require('fs');
const file = 'logs/system_wisdom.md';
let code = fs.readFileSync(file, 'utf8');

const newEntry = `### v1.3.40: Symmetry and Formulas (90° - θ) Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Upgraded Level 8 "対称性と公式 (180° - θ)" in Math I Trigonometry (図形と計量) to include "90° - θ" (Complementary Angles).
- **Visualization**: Enhanced \`TrigPage\` Level 8 implementation.
  - **Interactive Toggle**: Added a clean toggle to switch between "180° - θ" (Supplementary) and "90° - θ" (Complementary).
  - **Visual Proof**: For "90° - θ", draws the $y = x$ reflection line and dynamically mirrors the angle to prove that $x$ and $y$ coordinates swap.
  - **Real-time Formulas**: Automatically updates the overlay to show $\\sin(90^\\circ-\\theta) = \\cos\\theta$ and $\\cos(90^\\circ-\\theta) = \\sin\\theta$.
- **Learning Value**: Math I students frequently confuse the signs and the flipping of sine/cosine in the "90° - θ" formulas. By visualizing the literal $y = x$ reflection, it replaces memorization with geometric certainty ("the triangle just flips on its side").

`;

// Insert after Evolution History header
code = code.replace("## Evolution History\n", "## Evolution History\n\n" + newEntry);
fs.writeFileSync(file, code);
