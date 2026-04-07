"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 380;
const H = 380;
const OX = W / 2;
const OY = H / 2;
const S = 30;

const SystemOfEquationsViz: React.FC = () => {
  const [a11, setA11] = useState(2);
  const [a12, setA12] = useState(1);
  const [a21, setA21] = useState(1);
  const [a22, setA22] = useState(3);
  const [b1, setB1] = useState(5);
  const [b2, setB2] = useState(7);

  const det = a11 * a22 - a12 * a21;

  const solution = useMemo(() => {
    if (det === 0) return null;
    const x = (a22 * b1 - a12 * b2) / det;
    const y = (-a21 * b1 + a11 * b2) / det;
    return { x, y };
  }, [a11, a12, a21, a22, b1, b2, det]);

  const toSvg = (x: number, y: number): [number, number] => [OX + x * S, OY - y * S];

  const fmtNum = (n: number) => {
    if (Number.isInteger(n)) return String(n);
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    for (let denom = 2; denom <= 20; denom++) {
      const numer = abs * denom;
      if (Math.abs(numer - Math.round(numer)) < 1e-9) {
        return `${sign}\\frac{${Math.round(numer)}}{${denom}}`;
      }
    }
    return String(Math.round(n * 100) / 100);
  };

  // Compute y for line 1: a11*x + a12*y = b1 => y = (b1 - a11*x) / a12
  const line1Y = (x: number) => a12 !== 0 ? (b1 - a11 * x) / a12 : null;
  const line2Y = (x: number) => a22 !== 0 ? (b2 - a21 * x) / a22 : null;

  // x range for lines
  const xRange = [-6, 6];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">連立方程式と行列</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          連立方程式を行列で表し、逆行列で解きます。
        </p>
      </div>

      {/* Equation inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="space-y-2">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">式 1</p>
          <div className="flex items-center gap-1 text-sm">
            <input type="number" value={a11} onChange={e => setA11(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
            <span className="text-slate-500">x +</span>
            <input type="number" value={a12} onChange={e => setA12(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
            <span className="text-slate-500">y =</span>
            <input type="number" value={b1} onChange={e => setB1(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">式 2</p>
          <div className="flex items-center gap-1 text-sm">
            <input type="number" value={a21} onChange={e => setA21(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
            <span className="text-slate-500">x +</span>
            <input type="number" value={a22} onChange={e => setA22(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
            <span className="text-slate-500">y =</span>
            <input type="number" value={b2} onChange={e => setB2(Number(e.target.value) || 0)}
              className="w-12 h-10 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none" />
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="flex justify-center">
        <svg width={W} height={H} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {/* Grid */}
          {Array.from({ length: 13 }, (_, i) => i - 6).map(i => (
            <g key={`g-${i}`}>
              <line x1={OX + i * S} y1={0} x2={OX + i * S} y2={H}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1} />
              <line x1={0} y1={OY - i * S} x2={W} y2={OY - i * S}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1} />
            </g>
          ))}

          {/* Axes */}
          <line x1={0} y1={OY} x2={W} y2={OY} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <line x1={OX} y1={0} x2={OX} y2={H} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />

          {/* Line 1 */}
          {a12 !== 0 && (() => {
            const y1 = line1Y(xRange[0]);
            const y2 = line1Y(xRange[1]);
            if (y1 === null || y2 === null) return null;
            const [sx, sy] = toSvg(xRange[0], y1);
            const [ex, ey] = toSvg(xRange[1], y2);
            return <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#ef4444" strokeWidth={2} />;
          })()}
          {a12 === 0 && a11 !== 0 && (() => {
            const xVal = b1 / a11;
            const [sx, sy] = toSvg(xVal, -6);
            const [ex, ey] = toSvg(xVal, 6);
            return <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#ef4444" strokeWidth={2} />;
          })()}

          {/* Line 2 */}
          {a22 !== 0 && (() => {
            const y1 = line2Y(xRange[0]);
            const y2 = line2Y(xRange[1]);
            if (y1 === null || y2 === null) return null;
            const [sx, sy] = toSvg(xRange[0], y1);
            const [ex, ey] = toSvg(xRange[1], y2);
            return <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#3b82f6" strokeWidth={2} />;
          })()}
          {a22 === 0 && a21 !== 0 && (() => {
            const xVal = b2 / a21;
            const [sx, sy] = toSvg(xVal, -6);
            const [ex, ey] = toSvg(xVal, 6);
            return <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#3b82f6" strokeWidth={2} />;
          })()}

          {/* Intersection point */}
          {solution && (
            <>
              <circle cx={toSvg(solution.x, solution.y)[0]} cy={toSvg(solution.x, solution.y)[1]} r={6} fill="#8b5cf6" stroke="white" strokeWidth={2} />
            </>
          )}
        </svg>
      </div>

      {/* Matrix representation */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">行列表現 Ax = b</p>
        <MathDisplay
          tex={`\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`}
          displayMode
        />
      </div>

      {/* Solution */}
      <div className={`rounded-2xl p-4 text-center font-bold ${
        solution
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
      }`}>
        {solution ? (
          <MathDisplay tex={`x = ${fmtNum(solution.x)}, \\quad y = ${fmtNum(solution.y)}`} displayMode />
        ) : (
          <span>det A = 0 のため、一意な解は存在しません。</span>
        )}
      </div>

      <HintButton hints={[
        { step: 1, text: '連立方程式 Ax = b は逆行列を使って x = A⁻¹b で解けます（det A ≠ 0 のとき）。' },
        { step: 2, text: 'det A = 0 のとき、解は存在しないか無数に存在します（直線が平行または一致）。' },
        { step: 3, text: 'クラメルの公式: x = det(Ab₁)/det(A)、y = det(Ab₂)/det(A) でも求められます。' },
      ]} />
    </div>
  );
};

export default SystemOfEquationsViz;
