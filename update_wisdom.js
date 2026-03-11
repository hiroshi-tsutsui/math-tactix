const fs = require('fs');

const path = 'logs/system_wisdom.md';
let data = fs.readFileSync(path, 'utf8');

const newWisdom = `
### v1.3.76: Parametric Linear Inequalities (文字係数の1次不等式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 14 "文字係数の1次不等式" (Parametric Linear Inequalities) to Math I Numbers and Algebraic Expressions (数と式). Also fixed the rendering pipeline for Levels 12 and 13.
- **Visualization**: \`ParametricLinearInequalityViz\` implementation.
  - **Interactive Sliders**: Students adjust the parameters $a$ and $b$ for the inequality $ax > b$.
  - **Visual Case Splitting**: Explicitly checks the sign of $a$. When $a < 0$, it explicitly shows the inequality sign flipping. When $a = 0$, it visually highlights the evaluation of $0 > b$ to decide between "All Real Numbers" (すべての実数) or "No Solution" (解なし).
- **Learning Value**: Math I students universally fall for the trap of carelessly dividing by $a$ without splitting cases into $a>0$, $a=0$, and $a<0$. By sliding $a$ across the number line and watching the solution dynamically snap to different formats (and watching the inequality sign physically flip), the abstract requirement of "場合分け" (case splitting) becomes an undeniable physical boundary check.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., Fractional Absolute Values) or move to Data Analysis.
`;

data = data.replace(
  "## Evolution History\n",
  "## Evolution History\n" + newWisdom
);

fs.writeFileSync(path, data);
console.log("Wisdom updated.");
