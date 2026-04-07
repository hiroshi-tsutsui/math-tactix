"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const ScalarMultiplicationMatrixViz: React.FC = () => {
  const [scalar, setScalar] = useState(2);
  const [matrix, setMatrix] = useState<number[][]>([[1, 2], [3, 4]]);

  const result = matrix.map(row => row.map(v => scalar * v));

  const handleMatChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    setMatrix(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
  };

  const matToTex = (m: number[][]) =>
    `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">スカラー倍</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">行列のすべての成分をスカラー倍します。</p>
      </div>

      {/* Scalar slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          スカラー k = {scalar}
        </label>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={scalar}
          onChange={e => setScalar(Number(e.target.value))}
          className="w-64 accent-blue-600"
        />
      </div>

      {/* Visual */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{scalar}</span>
        <span className="text-xl text-slate-400">×</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
          <div className="grid grid-cols-2 gap-1.5">
            {matrix.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`${r}-${c}`}
                  type="number"
                  value={val}
                  onChange={e => handleMatChange(r, c, e.target.value)}
                  className="w-12 h-12 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
              ))
            )}
          </div>
          <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
        </div>
        <span className="text-2xl font-bold text-slate-400">=</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
          <div className="grid grid-cols-2 gap-1.5">
            {result.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`res-${r}-${c}`}
                  className="w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                >
                  {val}
                </div>
              ))
            )}
          </div>
          <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center">
        <MathDisplay tex={`${scalar} \\cdot ${matToTex(matrix)} = ${matToTex(result)}`} displayMode />
      </div>

      <HintButton hints={[
        { step: 1, text: 'スカラー倍 kA は行列 A の全成分に k を掛けた行列です。(kA)ᵢⱼ = k × Aᵢⱼ。' },
        { step: 2, text: 'k(A + B) = kA + kB、(k + l)A = kA + lA が成り立ちます（分配法則）。' },
        { step: 3, text: '0A = O（零行列）、1A = A、(-1)A = -A です。' },
      ]} />
    </div>
  );
};

export default ScalarMultiplicationMatrixViz;
