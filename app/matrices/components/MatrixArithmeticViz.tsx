"use client";

import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

type Op = 'add' | 'sub';

const MatrixArithmeticViz: React.FC = () => {
  const [matA, setMatA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matB, setMatB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [op, setOp] = useState<Op>('add');
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);

  const result = matA.map((row, r) =>
    row.map((_, c) => (op === 'add' ? matA[r][c] + matB[r][c] : matA[r][c] - matB[r][c]))
  );

  const updateCell = useCallback(
    (mat: 'A' | 'B', r: number, c: number, val: string) => {
      const num = parseFloat(val) || 0;
      const setter = mat === 'A' ? setMatA : setMatB;
      setter(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = num;
        return next;
      });
    },
    []
  );

  const matToTex = (m: number[][]) =>
    `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;

  const opSymbol = op === 'add' ? '+' : '-';

  const renderMatrix = (mat: number[][], label: string, matId: 'A' | 'B') => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
        <div className="grid grid-cols-2 gap-1.5">
          {mat.map((row, r) =>
            row.map((val, c) => (
              <input
                key={`${matId}-${r}-${c}`}
                type="number"
                value={val}
                onChange={e => updateCell(matId, r, c, e.target.value)}
                onFocus={() => setActiveCell({ r, c })}
                onBlur={() => setActiveCell(null)}
                className={`w-12 h-12 text-center text-sm font-bold rounded-lg border outline-none transition-all ${
                  activeCell?.r === r && activeCell?.c === c
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                } text-slate-800 dark:text-slate-200`}
              />
            ))
          )}
        </div>
        <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">行列の加法・減法</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">同じ位置の成分ごとに計算します。</p>
      </div>

      {/* Operation toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setOp('add')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            op === 'add'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          加法 (+)
        </button>
        <button
          onClick={() => setOp('sub')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            op === 'sub'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          減法 (-)
        </button>
      </div>

      {/* Visual comparison */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {renderMatrix(matA, '行列 A', 'A')}
        <span className="text-2xl font-bold text-slate-400">{opSymbol}</span>
        {renderMatrix(matB, '行列 B', 'B')}
        <span className="text-2xl font-bold text-slate-400">=</span>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">結果</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl text-slate-300 dark:text-slate-600">(</span>
            <div className="grid grid-cols-2 gap-1.5">
              {result.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`res-${r}-${c}`}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border transition-all ${
                      activeCell?.r === r && activeCell?.c === c
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
            <span className="text-2xl text-slate-300 dark:text-slate-600">)</span>
          </div>
        </div>
      </div>

      {/* KaTeX formula */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center">
        <MathDisplay tex={`${matToTex(matA)} ${opSymbol} ${matToTex(matB)} = ${matToTex(result)}`} displayMode />
      </div>

      {activeCell && (
        <p className="text-center text-sm text-blue-600 dark:text-blue-400">
          <MathDisplay
            tex={`(${activeCell.r + 1},${activeCell.c + 1}): ${matA[activeCell.r][activeCell.c]} ${opSymbol} ${matB[activeCell.r][activeCell.c]} = ${result[activeCell.r][activeCell.c]}`}
          />
        </p>
      )}

      <HintButton hints={[
        { step: 1, text: '行列の加法・減法は同じ位置の成分同士を足す（引く）だけです。同じサイズの行列でのみ定義されます。' },
        { step: 2, text: '(A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ。各成分ごとに独立に計算します。' },
        { step: 3, text: '交換法則 A + B = B + A と結合法則 (A + B) + C = A + (B + C) が成り立ちます。' },
      ]} />
    </div>
  );
};

export default MatrixArithmeticViz;
