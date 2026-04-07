"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 50;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

export default function ComplexDivisionViz() {
  const [re1, setRe1] = useState(3);
  const [im1, setIm1] = useState(1);
  const [re2, setRe2] = useState(1);
  const [im2, setIm2] = useState(1);
  const [step, setStep] = useState(0);

  // (a+bi)/(c+di) = [(a+bi)(c-di)] / (c²+d²)
  const denom = re2 * re2 + im2 * im2;
  const numRe = re1 * re2 + im1 * im2;
  const numIm = im1 * re2 - re1 * im2;
  const ansRe = denom !== 0 ? numRe / denom : 0;
  const ansIm = denom !== 0 ? numIm / denom : 0;

  const p1 = toSVG(re1, im1);
  const p2 = toSVG(re2, im2);
  const pConj = toSVG(re2, -im2);
  const pAns = toSVG(ansRe, ansIm);

  const gridLines: React.ReactElement[] = [];
  for (let i = -4; i <= 4; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  const steps = [
    {
      title: '問題の確認',
      tex: `\\frac{${re1} ${im1 >= 0 ? '+' : '-'} ${Math.abs(im1)}i}{${re2} ${im2 >= 0 ? '+' : '-'} ${Math.abs(im2)}i}`,
      desc: '分母を実数化するために、分母の共役を掛けます。'
    },
    {
      title: '共役を掛ける',
      tex: `\\frac{(${re1} ${im1 >= 0 ? '+' : '-'} ${Math.abs(im1)}i)(${re2} ${-im2 >= 0 ? '+' : '-'} ${Math.abs(im2)}i)}{(${re2} ${im2 >= 0 ? '+' : '-'} ${Math.abs(im2)}i)(${re2} ${-im2 >= 0 ? '+' : '-'} ${Math.abs(im2)}i)}`,
      desc: `分母の共役 ${re2} ${-im2 >= 0 ? '+' : '-'} ${Math.abs(im2)}i を分子・分母に掛けます。`
    },
    {
      title: '分母を計算',
      tex: `\\text{分母} = ${re2}^2 + ${im2}^2 = ${denom}`,
      desc: '分母は z₂ · z̄₂ = |z₂|² となり、必ず実数です。'
    },
    {
      title: '結果',
      tex: `= \\frac{${numRe} ${numIm >= 0 ? '+' : '-'} ${Math.abs(numIm)}i}{${denom}} = ${ansRe.toFixed(2)} ${ansIm >= 0 ? '+' : '-'} ${Math.abs(ansIm).toFixed(2)}i`,
      desc: '分子を展開し、実部と虚部をそれぞれ分母で割ります。'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          複素数の除法
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />

            <defs>
              <marker id="arrDB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
              <marker id="arrDG" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
              <marker id="arrDR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
              <marker id="arrDP" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" /></marker>
            </defs>

            {/* z1 */}
            <line x1={OX} y1={OY} x2={p1.x} y2={p1.y} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrDB)" />
            <circle cx={p1.x} cy={p1.y} r={5} fill="#3b82f6" />
            <text x={p1.x + 8} y={p1.y - 8} fontSize={11} fontWeight="bold" fill="#1e40af">z₁</text>

            {/* z2 */}
            <line x1={OX} y1={OY} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth={2.5} markerEnd="url(#arrDG)" />
            <circle cx={p2.x} cy={p2.y} r={5} fill="#10b981" />
            <text x={p2.x + 8} y={p2.y - 8} fontSize={11} fontWeight="bold" fill="#059669">z₂</text>

            {/* Conjugate of z2 (shown at step >= 1) */}
            {step >= 1 && (
              <>
                <line x1={OX} y1={OY} x2={pConj.x} y2={pConj.y} stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5,5" markerEnd="url(#arrDP)" />
                <circle cx={pConj.x} cy={pConj.y} r={4} fill="#a855f7" />
                <text x={pConj.x + 8} y={pConj.y + 14} fontSize={11} fill="#7c3aed">z̄₂</text>
              </>
            )}

            {/* Result */}
            {denom !== 0 && (
              <>
                <line x1={OX} y1={OY} x2={pAns.x} y2={pAns.y} stroke="#ef4444" strokeWidth={3} markerEnd="url(#arrDR)" />
                <circle cx={pAns.x} cy={pAns.y} r={6} fill="#ef4444" />
                <text x={pAns.x + 8} y={pAns.y - 8} fontSize={11} fontWeight="bold" fill="#dc2626">z₁/z₂</text>
              </>
            )}
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-blue-600 block mb-1">z₁ Re</label>
                <input type="range" min={-3} max={3} step={0.5} value={re1} onChange={e => setRe1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                <label className="text-xs font-bold text-blue-600 block mb-1 mt-1">z₁ Im</label>
                <input type="range" min={-3} max={3} step={0.5} value={im1} onChange={e => setIm1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-green-600 block mb-1">z₂ Re</label>
                <input type="range" min={-3} max={3} step={0.5} value={re2} onChange={e => setRe2(parseFloat(e.target.value))} className="w-full accent-green-600" />
                <label className="text-xs font-bold text-green-600 block mb-1 mt-1">z₂ Im</label>
                <input type="range" min={-3} max={3} step={0.5} value={im2} onChange={e => setIm2(parseFloat(e.target.value))} className="w-full accent-green-600" />
              </div>
            </div>

            {denom === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                z₂ = 0 では除法は定義されません。
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-700">解法ステップ {step + 1}/{steps.length}</span>
                <div className="flex gap-2">
                  <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-600 disabled:opacity-30">前</button>
                  <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white disabled:opacity-30">次</button>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-500 mb-2">{steps[step].title}</div>
              <div className="mb-2"><MathDisplay tex={steps[step].tex} displayMode /></div>
              <p className="text-xs text-slate-500">{steps[step].desc}</p>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '除法は分母の共役複素数を掛けて実数化します: (a+bi)/(c+di) = (a+bi)(c-di)/(c²+d²)。' },
        { step: 2, text: '極形式では |z₁/z₂| = |z₁|/|z₂|（絶対値は商）、arg(z₁/z₂) = arg(z₁)-arg(z₂)（偏角は差）。' },
        { step: 3, text: '分母を実数にするために z̄₂/z̄₂ = z̄₂/|z₂|² を利用するのがポイントです。' },
      ]} />
    </div>
  );
}
