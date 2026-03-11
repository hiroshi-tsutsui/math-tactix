"use client";

import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';

export default function InequalityRangeViz() {
  const [op, setOp] = useState<'add'|'sub'|'mul'|'div'>('add');

  const xMin = 1;
  const xMax = 3;
  const yMin = 2;
  const yMax = 4;

  let resMin = 0;
  let resMax = 0;
  let calculationSteps = "";

  if (op === 'add') {
    resMin = xMin + yMin;
    resMax = xMax + yMax;
    calculationSteps = `${xMin} + ${yMin} < x+y < ${xMax} + ${yMax}`;
  } else if (op === 'sub') {
    resMin = xMin - yMax;
    resMax = xMax - yMin;
    calculationSteps = `${xMin} - ${yMax} < x-y < ${xMax} - ${yMin}`;
  } else if (op === 'mul') {
    resMin = xMin * yMin;
    resMax = xMax * yMax;
    calculationSteps = `${xMin} \\times ${yMin} < xy < ${xMax} \\times ${yMax}`;
  } else if (op === 'div') {
    resMin = xMin / yMax;
    resMax = xMax / yMin;
    calculationSteps = `${xMin} / ${yMax} < \\frac{x}{y} < ${xMax} / ${yMin}`;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-2">不等式の性質と式の値の範囲</h2>
      <p className="text-gray-600 mb-6 text-sm">
        与えられた条件： <BlockMath math={`1 < x < 3 \\quad \\text{かつ} \\quad 2 < y < 4`} />
      </p>

      <div className="flex space-x-2 mb-6">
        <button onClick={() => setOp('add')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${op === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>x + y</button>
        <button onClick={() => setOp('sub')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${op === 'sub' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>x - y</button>
        <button onClick={() => setOp('mul')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${op === 'mul' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>xy</button>
        <button onClick={() => setOp('div')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${op === 'div' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>x / y</button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-2xl mb-8">
        {/* Logic Explanation Box */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 w-full shadow-inner relative overflow-hidden">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">論理の組み立て</h3>
          {op === 'sub' && (
             <div className="text-sm text-red-600 mb-4 font-bold bg-red-50 p-3 rounded">
               ⚠️ 注意: xの最小値からyの最小値を引いてはいけません！<br/>
               差が最小になるのは、「xが最小」で「yが最大」の時です。
             </div>
          )}
          {op === 'div' && (
             <div className="text-sm text-purple-600 mb-4 font-bold bg-purple-50 p-3 rounded">
               ⚠️ 注意: 分母が大きくなるほど、全体は小さくなります。<br/>
               最小値＝「xが最小」÷「yが最大」です。
             </div>
          )}
          <div className="text-gray-800 font-medium">
            <BlockMath math={calculationSteps} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xl font-bold text-blue-700">
            <BlockMath math={`${resMin} < \\text{Result} < ${resMax}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
