"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const DeterminantViz: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);

  const det = a * d - b * c;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">2×2 行列式</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          行列式は ad - bc で計算します。スライダーで値を変えてみましょう。
        </p>
      </div>

      {/* Matrix input with sliders */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {[
          { label: 'a', val: a, set: setA, color: 'text-red-500' },
          { label: 'b', val: b, set: setB, color: 'text-blue-500' },
          { label: 'c', val: c, set: setC, color: 'text-blue-500' },
          { label: 'd', val: d, set: setD, color: 'text-red-500' },
        ].map(({ label, val, set, color }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className={`text-sm font-bold ${color}`}>{label} = {val}</span>
            <input
              type="range"
              min={-5}
              max={5}
              step={1}
              value={val}
              onChange={e => set(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Visual: cross multiplication */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center space-y-4">
        <MathDisplay
          tex={`\\det \\begin{pmatrix} \\textcolor{red}{${a}} & \\textcolor{blue}{${b}} \\\\ \\textcolor{blue}{${c}} & \\textcolor{red}{${d}} \\end{pmatrix}`}
          displayMode
        />
        <MathDisplay
          tex={`= \\textcolor{red}{${a} \\times ${d}} - \\textcolor{blue}{${b} \\times ${c}}`}
          displayMode
        />
        <MathDisplay
          tex={`= \\textcolor{red}{${a * d}} - \\textcolor{blue}{${b * c}} = ${det}`}
          displayMode
        />
      </div>

      {/* Det value indicator */}
      <div className={`rounded-2xl p-4 text-center font-bold ${
        det > 0
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
          : det < 0
          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
      }`}>
        <MathDisplay tex={`\\det A = ${det}`} />
        <span className="ml-3 text-sm">
          {det > 0 ? '（正: 向きを保存）' : det < 0 ? '（負: 向きを反転）' : '（零: 逆行列なし！）'}
        </span>
      </div>
    </div>
  );
};

export default DeterminantViz;
