const fs = require('fs');
const path = require('path');

const componentCode = `"use client";
import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function ThreeTermsSquareViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);

  const total = a + b + c;
  const scale = 240 / total;

  const aSize = a * scale;
  const bSize = b * scale;
  const cSize = c * scale;

  const renderRect = (x, y, w, h, label, bg, isSquare) => (
    <div
      className={\`absolute flex items-center justify-center text-xs font-bold \${bg}\`}
      style={{
        left: \`\${x}px\`,
        top: \`\${y}px\`,
        width: \`\${w}px\`,
        height: \`\${h}px\`,
        border: '1px solid white',
        transition: 'all 0.3s ease'
      }}
    >
      <InlineMath math={label} />
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
          <InlineMath math="(a+b+c)^2" /> の図形的意味
        </h3>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">a = {a}</label>
            <input type="range" min="1" max="5" step="0.5" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="accent-indigo-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">b = {b}</label>
            <input type="range" min="1" max="5" step="0.5" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="accent-rose-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">c = {c}</label>
            <input type="range" min="1" max="5" step="0.5" value={c} onChange={(e) => setC(parseFloat(e.target.value))} className="accent-emerald-500" />
          </div>
        </div>

        <div className="flex justify-center my-6">
          <div className="relative" style={{ width: '240px', height: '240px' }}>
            {/* Row 1 */}
            {renderRect(0, 0, aSize, aSize, "a^2", "bg-indigo-200 text-indigo-800", true)}
            {renderRect(aSize, 0, bSize, aSize, "ab", "bg-purple-100 text-purple-700", false)}
            {renderRect(aSize + bSize, 0, cSize, aSize, "ca", "bg-indigo-100 text-indigo-600", false)}
            
            {/* Row 2 */}
            {renderRect(0, aSize, aSize, bSize, "ab", "bg-purple-100 text-purple-700", false)}
            {renderRect(aSize, aSize, bSize, bSize, "b^2", "bg-rose-200 text-rose-800", true)}
            {renderRect(aSize + bSize, aSize, cSize, bSize, "bc", "bg-orange-100 text-orange-700", false)}
            
            {/* Row 3 */}
            {renderRect(0, aSize + bSize, aSize, cSize, "ca", "bg-indigo-100 text-indigo-600", false)}
            {renderRect(aSize, aSize + bSize, bSize, cSize, "bc", "bg-orange-100 text-orange-700", false)}
            {renderRect(aSize + bSize, aSize + bSize, cSize, cSize, "c^2", "bg-emerald-200 text-emerald-800", true)}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">公式の確認:</p>
          <div className="overflow-x-auto">
            <BlockMath math="(a+b+c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca" />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            正方形全体の面積 <InlineMath math="(a+b+c)^2" /> は、3つの正方形 (<InlineMath math="a^2, b^2, c^2" />) と、
            3種類の長方形2つずつ (<InlineMath math="2ab, 2bc, 2ca" />) で構成されていることが視覚的に分かります。
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'app/components/math/ThreeTermsSquareViz.tsx'), componentCode);
console.log("Created ThreeTermsSquareViz.tsx");

// Now update app/math_i_numbers/page.tsx
const pagePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

// Insert import
pageCode = pageCode.replace(
  "import IntegerFractionalPartViz from '../components/math/IntegerFractionalPartViz';",
  "import IntegerFractionalPartViz from '../components/math/IntegerFractionalPartViz';\nimport ThreeTermsSquareViz from '../components/math/ThreeTermsSquareViz';"
);

// Add to levels
pageCode = pageCode.replace(
  "{ id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' }",
  "{ id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' },\n    { id: 10, title: '3項の平方の展開公式', type: 'three_terms_square' }"
);

// Add conditional render
pageCode = pageCode.replace(
  "{currentLevel === 9 && (",
  "{currentLevel === 10 && (\n              <div className=\"space-y-6 animate-fade-in\">\n                <ThreeTermsSquareViz />\n              </div>\n            )}\n            {currentLevel === 9 && ("
);

fs.writeFileSync(pagePath, pageCode);
console.log("Updated page.tsx");
