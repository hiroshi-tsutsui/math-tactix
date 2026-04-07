"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const InverseMatrixViz: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(3);

  const det = a * d - b * c;
  const isInvertible = det !== 0;

  const inverse = useMemo(() => {
    if (!isInvertible) return null;
    return [
      [d / det, -b / det],
      [-c / det, a / det],
    ];
  }, [a, b, c, d, det, isInvertible]);

  // Verify AA^-1 = I
  const product = useMemo(() => {
    if (!inverse) return null;
    const A = [[a, b], [c, d]];
    return [
      [
        A[0][0] * inverse[0][0] + A[0][1] * inverse[1][0],
        A[0][0] * inverse[0][1] + A[0][1] * inverse[1][1],
      ],
      [
        A[1][0] * inverse[0][0] + A[1][1] * inverse[1][0],
        A[1][0] * inverse[0][1] + A[1][1] * inverse[1][1],
      ],
    ];
  }, [a, b, c, d, inverse]);

  const fmtNum = (n: number) => {
    if (Number.isInteger(n)) return String(n);
    // show as fraction
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    // Try common denominators
    for (let denom = 2; denom <= 100; denom++) {
      const numer = abs * denom;
      if (Math.abs(numer - Math.round(numer)) < 1e-9) {
        return `${sign}\\frac{${Math.round(numer)}}{${denom}}`;
      }
    }
    return String(Math.round(n * 100) / 100);
  };

  const matToTex = (m: number[][]) =>
    `\\begin{pmatrix} ${fmtNum(m[0][0])} & ${fmtNum(m[0][1])} \\\\ ${fmtNum(m[1][0])} & ${fmtNum(m[1][1])} \\end{pmatrix}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">逆行列</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <MathDisplay tex="AA^{-1} = I" /> が成り立つ行列を求めます。
        </p>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {[
          { label: 'a', val: a, set: setA },
          { label: 'b', val: b, set: setB },
          { label: 'c', val: c, set: setC },
          { label: 'd', val: d, set: setD },
        ].map(({ label, val, set }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-slate-500">{label} = {val}</span>
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

      {/* Det */}
      <div className={`rounded-xl p-3 text-center text-sm font-bold ${
        isInvertible
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
      }`}>
        <MathDisplay tex={`\\det A = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${det}`} />
        {!isInvertible && <span className="ml-2">（逆行列は存在しません）</span>}
      </div>

      {isInvertible && inverse && (
        <>
          {/* Formula */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-3">
            <MathDisplay
              tex={`A^{-1} = \\frac{1}{${det}} ${matToTex([[d, -b], [-c, a]])}`}
              displayMode
            />
            <MathDisplay tex={`= ${matToTex(inverse)}`} displayMode />
          </div>

          {/* Verification */}
          {product && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 text-center space-y-2">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">検証</p>
              <MathDisplay
                tex={`A \\cdot A^{-1} = ${matToTex([[a, b], [c, d]])} \\cdot ${matToTex(inverse)} = ${matToTex(product.map(row => row.map(v => Math.round(v * 1000) / 1000)))}`}
                displayMode
              />
            </div>
          )}
        </>
      )}

      <HintButton hints={[
        { step: 1, text: '逆行列が存在する条件: det A ≠ 0（行列式がゼロでない）。' },
        { step: 2, text: '2×2 行列 [[a,b],[c,d]] の逆行列は A⁻¹ = (1/det A) × [[d,-b],[-c,a]] です。' },
        { step: 3, text: '検証: AA⁻¹ = A⁻¹A = E（単位行列）が成り立つことを確認しましょう。' },
      ]} />
    </div>
  );
};

export default InverseMatrixViz;
