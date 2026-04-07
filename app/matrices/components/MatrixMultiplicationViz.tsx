"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const MatrixMultiplicationViz: React.FC = () => {
  const [matA, setMatA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matB, setMatB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [focusCell, setFocusCell] = useState<{ r: number; c: number } | null>(null);

  const result: number[][] = [
    [
      matA[0][0] * matB[0][0] + matA[0][1] * matB[1][0],
      matA[0][0] * matB[0][1] + matA[0][1] * matB[1][1],
    ],
    [
      matA[1][0] * matB[0][0] + matA[1][1] * matB[1][0],
      matA[1][0] * matB[0][1] + matA[1][1] * matB[1][1],
    ],
  ];

  const updateCell = (mat: 'A' | 'B', r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const setter = mat === 'A' ? setMatA : setMatB;
    setter(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
  };

  const matToTex = (m: number[][]) =>
    `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;

  const renderInputMatrix = (mat: number[][], label: string, matId: 'A' | 'B') => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
        <div className="grid grid-cols-2 gap-1.5">
          {mat.map((row, r) =>
            row.map((val, c) => {
              const isHighlightRow = matId === 'A' && focusCell?.r === r;
              const isHighlightCol = matId === 'B' && focusCell?.c === c;
              return (
                <input
                  key={`${matId}-${r}-${c}`}
                  type="number"
                  value={val}
                  onChange={e => updateCell(matId, r, c, e.target.value)}
                  className={`w-12 h-12 text-center text-sm font-bold rounded-lg border outline-none transition-all ${
                    isHighlightRow
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : isHighlightCol
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                />
              );
            })
          )}
        </div>
        <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">行列の積</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          結果の各セルをクリックすると、対応する行と列の内積が表示されます。
        </p>
      </div>

      {/* Matrices */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {renderInputMatrix(matA, '行列 A', 'A')}
        <span className="text-xl text-slate-400">×</span>
        {renderInputMatrix(matB, '行列 B', 'B')}
        <span className="text-2xl font-bold text-slate-400">=</span>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">AB</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
            <div className="grid grid-cols-2 gap-1.5">
              {result.map((row, r) =>
                row.map((val, c) => (
                  <button
                    key={`res-${r}-${c}`}
                    onClick={() => setFocusCell(focusCell?.r === r && focusCell?.c === c ? null : { r, c })}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border transition-all cursor-pointer ${
                      focusCell?.r === r && focusCell?.c === c
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ring-2 ring-purple-200 dark:ring-purple-800'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {val}
                  </button>
                ))
              )}
            </div>
            <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
          </div>
        </div>
      </div>

      {/* Calculation detail */}
      {focusCell && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">
            成分 ({focusCell.r + 1}, {focusCell.c + 1}) の計算
          </p>
          <MathDisplay
            tex={`(AB)_{${focusCell.r + 1}${focusCell.c + 1}} = \\textcolor{red}{${matA[focusCell.r][0]}} \\cdot \\textcolor{blue}{${matB[0][focusCell.c]}} + \\textcolor{red}{${matA[focusCell.r][1]}} \\cdot \\textcolor{blue}{${matB[1][focusCell.c]}} = ${result[focusCell.r][focusCell.c]}`}
            displayMode
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="text-red-500">A の第{focusCell.r + 1}行</span> と{' '}
            <span className="text-blue-500">B の第{focusCell.c + 1}列</span> の内積
          </p>
        </div>
      )}

      {/* Formula */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center">
        <MathDisplay tex={`${matToTex(matA)} \\cdot ${matToTex(matB)} = ${matToTex(result)}`} displayMode />
      </div>
    </div>
  );
};

export default MatrixMultiplicationViz;
