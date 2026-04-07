"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 55;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

export default function ConjugateViz() {
  const [re, setRe] = useState(2);
  const [im, setIm] = useState(3);

  const pZ = toSVG(re, im);
  const pConj = toSVG(re, -im);
  const modSq = re * re + im * im;
  const mod = Math.sqrt(modSq);

  const gridLines: React.ReactElement[] = [];
  for (let i = -3; i <= 3; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          共役複素数
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={2} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Symmetry line highlight (real axis) */}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#f59e0b" strokeWidth={2} opacity={0.3} />

            {/* Dashed line connecting z and conjugate */}
            <line x1={pZ.x} y1={pZ.y} x2={pConj.x} y2={pConj.y} stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5,5" />

            <defs>
              <marker id="arrCB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
              <marker id="arrCR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            </defs>

            {/* z vector */}
            <line x1={OX} y1={OY} x2={pZ.x} y2={pZ.y} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrCB)" />
            <circle cx={pZ.x} cy={pZ.y} r={5} fill="#3b82f6" />
            <text x={pZ.x + 10} y={pZ.y - 8} fontSize={12} fontWeight="bold" fill="#1e40af">z</text>

            {/* conjugate vector */}
            <line x1={OX} y1={OY} x2={pConj.x} y2={pConj.y} stroke="#ef4444" strokeWidth={2.5} markerEnd="url(#arrCR)" />
            <circle cx={pConj.x} cy={pConj.y} r={5} fill="#ef4444" />
            <text x={pConj.x + 10} y={pConj.y + 16} fontSize={12} fontWeight="bold" fill="#dc2626">z̄</text>

            {/* Modulus circles */}
            <circle cx={OX} cy={OY} r={mod * S} fill="none" stroke="#a855f7" strokeWidth={1} strokeDasharray="3,3" opacity={0.3} />
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">実部 (Re)</label>
              <input type="range" min={-3} max={3} step={0.5} value={re} onChange={e => setRe(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              <span className="text-sm font-mono text-slate-600">{re}</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">虚部 (Im)</label>
              <input type="range" min={-3} max={3} step={0.5} value={im} onChange={e => setIm(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              <span className="text-sm font-mono text-slate-600">{im}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">共役複素数の性質</div>
              <div className="space-y-2">
                <MathDisplay tex={`z = ${re} ${im >= 0 ? '+' : '-'} ${Math.abs(im)}i`} />
                <MathDisplay tex={`\\bar{z} = ${re} ${-im >= 0 ? '+' : '-'} ${Math.abs(im)}i`} />
                <MathDisplay tex={`z \\cdot \\bar{z} = ${re}^2 + ${im}^2 = ${modSq}`} />
                <MathDisplay tex={`|z| = |\\bar{z}| = \\sqrt{${modSq}} \\approx ${mod.toFixed(3)}`} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                共役複素数は実軸に関して対称な点です。z と z̄ の積は常に実数（|z|²）になります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
