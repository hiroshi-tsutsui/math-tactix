"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const IdentityMatrixViz: React.FC = () => {
  const [matA, setMatA] = useState<number[][]>([[3, 1], [2, 5]]);
  const [showZero, setShowZero] = useState(false);

  const I2 = [[1, 0], [0, 1]];
  const O2 = [[0, 0], [0, 0]];

  // AI = A
  const productAI: number[][] = [
    [matA[0][0] * 1 + matA[0][1] * 0, matA[0][0] * 0 + matA[0][1] * 1],
    [matA[1][0] * 1 + matA[1][1] * 0, matA[1][0] * 0 + matA[1][1] * 1],
  ];

  // A + O = A
  const sumAO: number[][] = [
    [matA[0][0] + 0, matA[0][1] + 0],
    [matA[1][0] + 0, matA[1][1] + 0],
  ];

  const updateCell = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    setMatA(prev => {
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
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">単位行列と零行列</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          単位行列 E は積の単位元、零行列 O は和の単位元です。
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowZero(false)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            !showZero ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          単位行列 E
        </button>
        <button
          onClick={() => setShowZero(true)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            showZero ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          零行列 O
        </button>
      </div>

      {/* Matrix A input */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">行列 A（自由に編集）</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
          <div className="grid grid-cols-2 gap-1.5">
            {matA.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`a-${r}-${c}`}
                  type="number"
                  value={val}
                  onChange={e => updateCell(r, c, e.target.value)}
                  className="w-12 h-12 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
              ))
            )}
          </div>
          <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
        </div>
      </div>

      {!showZero ? (
        <div className="space-y-4">
          {/* Identity definition */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-700 text-center">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">単位行列の定義</p>
            <MathDisplay tex={`E = ${matToTex(I2)} \\quad \\text{対角成分が1、他は0}`} displayMode />
          </div>

          {/* AE = A */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-2">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">性質: AE = A</p>
            <MathDisplay
              tex={`${matToTex(matA)} \\cdot ${matToTex(I2)} = ${matToTex(productAI)}`}
              displayMode
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Zero matrix definition */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700 text-center">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">零行列の定義</p>
            <MathDisplay tex={`O = ${matToTex(O2)} \\quad \\text{すべての成分が0}`} displayMode />
          </div>

          {/* A + O = A */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-2">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">性質: A + O = A</p>
            <MathDisplay
              tex={`${matToTex(matA)} + ${matToTex(O2)} = ${matToTex(sumAO)}`}
              displayMode
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityMatrixViz;
