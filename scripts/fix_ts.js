const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app/components/math/ThreeTermsSquareViz.tsx');
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  "const renderRect = (x, y, w, h, label, bg, isSquare) => (",
  "const renderRect = (x: number, y: number, w: number, h: number, label: string, bg: string, isSquare: boolean) => ("
);
fs.writeFileSync(file, code);
