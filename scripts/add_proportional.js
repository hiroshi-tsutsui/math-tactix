const fs = require('fs');
const path = require('path');

const compPath = path.join(__dirname, 'app/math_i_numbers/components/ProportionalExpressionViz.tsx');
const pagePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');

const compCode = `"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function ProportionalExpressionViz() {
  const [k, setK] = useState(2);
  const a = 2, b = 3, c = 4;
  const x = a * k, y = b * k, z = c * k;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">比例式の値 (比例定数 k の利用)</h2>
        <p className="text-gray-600">
          <InlineMath math="\\frac{x}{2} = \\frac{y}{3} = \\frac{z}{4}" /> のとき、<InlineMath math="\\frac{x+y+z}{x}" /> の値を求めよ。
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            比例定数 <InlineMath math="k" /> を動かす (k = {k})
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-48 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="text-right text-gray-700">
          <p>すべての比の値が <InlineMath math="k" /> に等しいとする。</p>
          <BlockMath math={'\\frac{x}{2} = \\frac{y}{3} = \\frac{z}{4} = k'} />
        </div>
      </div>

      <div className="relative h-64 bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-end justify-center gap-8">
        {/* x bar */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 bg-blue-500 rounded-t-lg flex items-center justify-center text-white font-bold"
            initial={false}
            animate={{ height: x * 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            x
          </motion.div>
          <p className="mt-2 text-gray-600"><InlineMath math={\`x = 2k = \${x.toFixed(1)}\`} /></p>
        </div>

        {/* y bar */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 bg-green-500 rounded-t-lg flex items-center justify-center text-white font-bold"
            initial={false}
            animate={{ height: y * 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            y
          </motion.div>
          <p className="mt-2 text-gray-600"><InlineMath math={\`y = 3k = \${y.toFixed(1)}\`} /></p>
        </div>

        {/* z bar */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 bg-purple-500 rounded-t-lg flex items-center justify-center text-white font-bold"
            initial={false}
            animate={{ height: z * 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            z
          </motion.div>
          <p className="mt-2 text-gray-600"><InlineMath math={\`z = 4k = \${z.toFixed(1)}\`} /></p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">値を代入して計算</h3>
        <p className="text-gray-700 mb-4">
          <InlineMath math="k" /> の値が変化しても、各文字は常に <InlineMath math="2 : 3 : 4" /> の割合で拡大・縮小するため、分数式の中の <InlineMath math="k" /> は完全に約分されて消滅します。
        </p>
        <div className="flex items-center justify-center text-xl bg-white p-4 rounded-lg shadow-inner">
          <BlockMath math={'\\frac{x+y+z}{x} = \\frac{2k + 3k + 4k}{2k} = \\frac{9k}{2k} = \\frac{9}{2}'} />
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(compPath, compCode);

let pageCode = fs.readFileSync(pagePath, 'utf8');

// Ensure import
if (!pageCode.includes('import ProportionalExpressionViz')) {
  pageCode = pageCode.replace(
    'import ValueAbsoluteViz from "./components/ValueAbsoluteViz";',
    'import ValueAbsoluteViz from "./components/ValueAbsoluteViz";\nimport ProportionalExpressionViz from "./components/ProportionalExpressionViz";'
  );
}

// Ensure level is added to LEVELS array
if (!pageCode.includes('id: "level_42"')) {
  pageCode = pageCode.replace(
    /id: "level_41".*?\} \},/s,
    match => match + `
  { id: "level_42", title: "比例式の値 (比例定数kの利用)", type: "interactive", component: ProportionalExpressionViz, meta: { concept: "比例式", difficulty: "Standard" } },`
  );
}

// Ensure condition is added to the render array
if (!pageCode.includes('currentLevel === 42 && (')) {
  pageCode = pageCode.replace(
    /\{currentLevel === 41 && \(\s*<ValueAbsoluteViz \/>\s*\)\}/s,
    match => match + `\n            {currentLevel === 42 && (\n              <ProportionalExpressionViz />\n            )}`
  );
}

fs.writeFileSync(pagePath, pageCode);
console.log("ProportionalExpressionViz added to level 42.");
