"use client";

import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function DoubleRadicalViz() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);

  // Ensure a is always greater than or equal to b for the subtraction case if needed later
  const displayA = Math.max(a, b);
  const displayB = Math.min(a, b);

  const sum = displayA + displayB;
  const prod = displayA * displayB;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">数 a: {displayA}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={displayA}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= b) setA(val);
                else { setA(val); setB(val); }
              }}
              className="w-full accent-indigo-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">数 b: {displayB}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={displayB}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val <= a) setB(val);
                else { setB(val); setA(val); }
              }}
              className="w-full accent-indigo-500"
            />
          </label>
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-xl font-medium text-slate-800 mb-4">
            <InlineMath math={`\\sqrt{${sum} + 2\\sqrt{${prod}}}`} />
          </div>
          <div className="text-indigo-600 font-bold text-2xl">
            = <InlineMath math={`\\sqrt{${displayA}} + \\sqrt{${displayB}}`} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
        <h4 className="text-sm font-bold text-slate-700 mb-4">なぜそうなるの？（仕組みの可視化）</h4>
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            1. まず、<InlineMath math={`(\\sqrt{${displayA}} + \\sqrt{${displayB}})^2`} /> を展開してみます。
          </p>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <BlockMath math={`(\\sqrt{${displayA}})^2 + 2\\sqrt{${displayA}}\\sqrt{${displayB}} + (\\sqrt{${displayB}})^2`} />
            <BlockMath math={`= ${displayA} + 2\\sqrt{${displayA} \\times ${displayB}} + ${displayB}`} />
            <BlockMath math={`= (${displayA} + ${displayB}) + 2\\sqrt{${prod}}`} />
            <BlockMath math={`= ${sum} + 2\\sqrt{${prod}}`} />
          </div>
          <p>
            2. つまり、二重根号の中身 <InlineMath math={`${sum} + 2\\sqrt{${prod}}`} /> は、<InlineMath math={`(\\sqrt{${displayA}} + \\sqrt{${displayB}})^2`} /> のことなのです。
          </p>
          <p>
            3. だから、全体に大きな <InlineMath math="\\sqrt{\\phantom{x}}" /> がかかると、2乗が外れて <InlineMath math={`\\sqrt{${displayA}} + \\sqrt{${displayB}}`} /> に戻ります。
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="relative w-64 h-64 border-2 border-indigo-200 rounded-lg overflow-hidden bg-white shadow-sm">
           {/* Geometric representation of (sqrt(a) + sqrt(b))^2 */}
           <div className="absolute top-0 left-0 bg-indigo-100 flex items-center justify-center border-r border-b border-indigo-200" style={{ width: `${(displayA/(displayA+displayB))*100}%`, height: `${(displayA/(displayA+displayB))*100}%` }}>
             <span className="text-indigo-800 font-semibold"><InlineMath math={`${displayA}`} /></span>
           </div>
           <div className="absolute top-0 right-0 bg-blue-50 flex items-center justify-center border-b border-indigo-200" style={{ width: `${(displayB/(displayA+displayB))*100}%`, height: `${(displayA/(displayA+displayB))*100}%` }}>
             <span className="text-blue-800 font-semibold"><InlineMath math={`\\sqrt{${prod}}`} /></span>
           </div>
           <div className="absolute bottom-0 left-0 bg-blue-50 flex items-center justify-center border-r border-indigo-200" style={{ width: `${(displayA/(displayA+displayB))*100}%`, height: `${(displayB/(displayA+displayB))*100}%` }}>
             <span className="text-blue-800 font-semibold"><InlineMath math={`\\sqrt{${prod}}`} /></span>
           </div>
           <div className="absolute bottom-0 right-0 bg-teal-100 flex items-center justify-center" style={{ width: `${(displayB/(displayA+displayB))*100}%`, height: `${(displayB/(displayA+displayB))*100}%` }}>
             <span className="text-teal-800 font-semibold"><InlineMath math={`${displayB}`} /></span>
           </div>
        </div>
      </div>
    </div>
  );
}
