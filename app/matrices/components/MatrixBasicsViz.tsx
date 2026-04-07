"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface MatrixBasicsVizProps {
  rows?: number;
  cols?: number;
}

const MatrixBasicsViz: React.FC<MatrixBasicsVizProps> = ({ rows = 2, cols = 2 }) => {
  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))
  );
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);

  const handleChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    setMatrix(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
  };

  const matTex = `\\begin{pmatrix} ${matrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">行列の基本</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          行列は数を長方形に並べたものです。下のセルを編集してみましょう。
        </p>
      </div>

      {/* Interactive matrix input */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-slate-300 dark:text-slate-600 font-light">(</span>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {matrix.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`${r}-${c}`}
                  type="number"
                  value={val}
                  onChange={e => handleChange(r, c, e.target.value)}
                  onFocus={() => { setHighlightRow(r); setHighlightCol(c); }}
                  onBlur={() => { setHighlightRow(null); setHighlightCol(null); }}
                  className={`w-14 h-14 text-center text-lg font-bold rounded-xl border outline-none transition-all ${
                    highlightRow === r && highlightCol === c
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : highlightRow === r || highlightCol === c
                      ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                />
              ))
            )}
          </div>
          <span className="text-3xl text-slate-300 dark:text-slate-600 font-light">)</span>
        </div>

        {/* KaTeX rendering */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <MathDisplay tex={`A = ${matTex}`} displayMode />
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">サイズ</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">
              <MathDisplay tex={`${rows} \\times ${cols}`} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">行数</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">{rows}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">列数</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">{cols}</div>
          </div>
        </div>

        {highlightRow !== null && highlightCol !== null && (
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            <MathDisplay tex={`a_{${highlightRow + 1}${highlightCol + 1}} = ${matrix[highlightRow][highlightCol]}`} />
            <span className="ml-2 text-slate-400">（第{highlightRow + 1}行 第{highlightCol + 1}列）</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MatrixBasicsViz;
