"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 400, H = 400;
const OX = W / 2, OY = H / 2, S = 50;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

interface EquationType {
  name: string;
  tex: string;
  description: string;
  solve: () => Array<{ re: number; im: number }>;
  solutionTex: string;
}

export default function ComplexEquationViz() {
  const [eqIdx, setEqIdx] = useState(0);

  const equations: EquationType[] = [
    {
      name: 'z² = -1',
      tex: 'z^2 = -1',
      description: 'z² = -1 の解は虚数単位 i と -i です。',
      solve: () => [{ re: 0, im: 1 }, { re: 0, im: -1 }],
      solutionTex: 'z = \\pm i'
    },
    {
      name: 'z² = -4',
      tex: 'z^2 = -4',
      description: 'z² = -4 の解は 2i と -2i です。',
      solve: () => [{ re: 0, im: 2 }, { re: 0, im: -2 }],
      solutionTex: 'z = \\pm 2i'
    },
    {
      name: 'z² + 2z + 2 = 0',
      tex: 'z^2 + 2z + 2 = 0',
      description: '判別式 D = 4 - 8 = -4 < 0 なので複素数解を持ちます。',
      solve: () => [{ re: -1, im: 1 }, { re: -1, im: -1 }],
      solutionTex: 'z = -1 \\pm i'
    },
    {
      name: 'z² - 2z + 5 = 0',
      tex: 'z^2 - 2z + 5 = 0',
      description: '判別式 D = 4 - 20 = -16 < 0。解は共役複素数のペアです。',
      solve: () => [{ re: 1, im: 2 }, { re: 1, im: -2 }],
      solutionTex: 'z = 1 \\pm 2i'
    },
    {
      name: 'z³ = 1',
      tex: 'z^3 = 1',
      description: '1の3乗根は3つ。単位円上に等間隔に並びます。',
      solve: () => [
        { re: 1, im: 0 },
        { re: -0.5, im: Math.sqrt(3) / 2 },
        { re: -0.5, im: -Math.sqrt(3) / 2 }
      ],
      solutionTex: 'z = 1,\\; -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i,\\; -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i'
    }
  ];

  const eq = equations[eqIdx];
  const solutions = eq.solve();

  const gridLines: React.ReactElement[] = [];
  for (let i = -3; i <= 3; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  const solColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          複素数の方程式
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {equations.map((e, i) => (
            <button key={i} onClick={() => setEqIdx(i)} className={`px-3 py-2 rounded-lg text-sm font-bold transition ${eqIdx === i ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {e.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Unit circle for z^3=1 */}
            {eqIdx === 4 && (
              <circle cx={OX} cy={OY} r={S} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
            )}

            {/* Solutions */}
            {solutions.map((sol, i) => {
              const pt = toSVG(sol.re, sol.im);
              const color = solColors[i % solColors.length];
              return (
                <g key={i}>
                  <line x1={OX} y1={OY} x2={pt.x} y2={pt.y} stroke={color} strokeWidth={2} opacity={0.5} />
                  <circle cx={pt.x} cy={pt.y} r={7} fill={color} stroke="white" strokeWidth={2} />
                  <text x={pt.x + 10} y={pt.y - 5} fontSize={11} fontWeight="bold" fill={color}>
                    ({sol.re.toFixed(2)}, {sol.im.toFixed(2)}i)
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div className="bg-slate-900 rounded-xl p-4 text-center">
              <MathDisplay tex={eq.tex} displayMode className="text-white" />
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">解</div>
              <MathDisplay tex={eq.solutionTex} displayMode />
              <p className="text-xs text-slate-500 mt-2">{eq.description}</p>
            </div>

            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 text-xs text-rose-700">
              <p>複素数の方程式では、実数の範囲では解けない方程式も解を持ちます。</p>
              <p className="mt-1">n次方程式は複素数の範囲で必ずn個の解を持ちます（代数学の基本定理）。</p>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '複素数の方程式は実部と虚部を別々に比較して解きます。a+bi = c+di ⇔ a=c かつ b=d。' },
        { step: 2, text: 'n次方程式は複素数の範囲で必ず n 個の解を持ちます（代数学の基本定理）。' },
        { step: 3, text: '実数係数の方程式の複素数解は必ず共役のペアで現れます。' },
      ]} />
    </div>
  );
}
