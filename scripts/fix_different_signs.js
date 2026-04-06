const fs = require('fs');
const file = 'app/quadratics/components/DifferentSignsViz.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/ctx\.moveTo\(\.\.\.toScreen\(([^,]+),\s*([^)]+)\)\);/g, "const [tx1_$1, ty1_$2] = toScreen($1, $2); ctx.moveTo(tx1_$1, ty1_$2);".replace(/\-/g, "m"));
content = content.replace(/ctx\.lineTo\(\.\.\.toScreen\(([^,]+),\s*([^)]+)\)\);/g, "const [tx2_$1, ty2_$2] = toScreen($1, $2); ctx.lineTo(tx2_$1, ty2_$2);".replace(/\-/g, "m"));

// the previous regex is too complex to deal with minus signs easily, let's just do simple replace
content = content.replace(
  "      ctx.moveTo(...toScreen(x, -10));\n      ctx.lineTo(...toScreen(x, 10));",
  "      const [tx1, ty1] = toScreen(x, -10);\n      ctx.moveTo(tx1, ty1);\n      const [tx2, ty2] = toScreen(x, 10);\n      ctx.lineTo(tx2, ty2);"
);
content = content.replace(
  "      ctx.moveTo(...toScreen(-10, y));\n      ctx.lineTo(...toScreen(10, y));",
  "      const [tx1, ty1] = toScreen(-10, y);\n      ctx.moveTo(tx1, ty1);\n      const [tx2, ty2] = toScreen(10, y);\n      ctx.lineTo(tx2, ty2);"
);

fs.writeFileSync(file, content);
