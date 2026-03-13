const fs = require('fs');
const componentCode = `"use client";
import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function SimultaneousLinearInequalitiesViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(5);

  const overlap = a < b;
  const overlapText = overlap ? \`\${a} < x < \${b}\` : '解なし (No Solution)';

  return (
    <div className="w-full shadow-lg border-blue-100 bg-white rounded-lg">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-6 p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
            <span>連立1次不等式の解法 (数直線)</span>
          </h2>
          <span className={\`text-sm px-3 py-1 bg-white border rounded-full \${overlap ? 'text-blue-600 border-blue-600' : 'text-red-600 border-red-600'}\`}>
            {overlap ? '解あり' : '解なし'}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">パラメータ設定</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>不等式1の境界 (x &gt; a)</span>
                <span className="text-blue-600 font-bold">a = {a}</span>
              </div>
              <input
                type="range"
                min={-5}
                max={10}
                step={1}
                value={a}
                onChange={(e) => setA(parseInt(e.target.value))}
                className="w-full py-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>不等式2の境界 (x &lt; b)</span>
                <span className="text-red-600 font-bold">b = {b}</span>
              </div>
              <input
                type="range"
                min={-5}
                max={10}
                step={1}
                value={b}
                onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full py-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner overflow-hidden relative" style={{ height: '200px' }}>
           <svg viewBox="-60 -10 220 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
             {/* X-axis */}
             <line x1="-50" y1="40" x2="150" y2="40" stroke="#94a3b8" strokeWidth="2" />
             {/* Ticks */}
             {[-5, 0, 5, 10].map(tick => (
               <g key={tick} transform={\`translate(\${tick * 10}, 40)\`}>
                 <line x1="0" y1="-3" x2="0" y2="3" stroke="#94a3b8" strokeWidth="1" />
                 <text y="15" textAnchor="middle" fontSize="6" fill="#64748b">{tick}</text>
               </g>
             ))}
             
             {/* a region (x > a) */}
             <g transform={\`translate(\${a * 10}, 0)\`}>
               <line x1="0" y1="20" x2="150" y2="20" stroke="#3b82f6" strokeWidth="2" />
               <line x1="0" y1="40" x2="0" y2="20" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />
               <circle cx="0" cy="20" r="3" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
               <text x="0" y="10" textAnchor="middle" fontSize="6" fill="#3b82f6">x &gt; {a}</text>
             </g>

             {/* b region (x < b) */}
             <g transform={\`translate(\${b * 10}, 0)\`}>
               <line x1="0" y1="30" x2="-150" y2="30" stroke="#ef4444" strokeWidth="2" />
               <line x1="0" y1="40" x2="0" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
               <circle cx="0" cy="30" r="3" fill="white" stroke="#ef4444" strokeWidth="1.5" />
               <text x="0" y="20" textAnchor="middle" fontSize="6" fill="#ef4444">x &lt; {b}</text>
             </g>

             {/* Overlap */}
             {overlap && (
               <rect x={a * 10} y="40" width={(b - a) * 10} height="5" fill="#a855f7" opacity="0.4" />
             )}
           </svg>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
          <div className="text-center">
            <h4 className="text-slate-400 text-sm font-semibold mb-2 tracking-wider">連立不等式の解</h4>
            <div className="text-2xl font-bold font-mono text-purple-300">
              {overlapText}
            </div>
            {!overlap && (
              <p className="mt-2 text-sm text-red-300 bg-red-900/30 py-1 px-3 rounded-md inline-block">
                重なる範囲が存在しないため、解はありません。
              </p>
            )}
            {overlap && (
              <p className="mt-2 text-sm text-blue-300 bg-blue-900/30 py-1 px-3 rounded-md inline-block">
                紫色の帯の部分が、2つの条件を同時に満たす範囲です。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('app/components/math/SimultaneousLinearInequalitiesViz.tsx', componentCode);
console.log('Rewritten component');
