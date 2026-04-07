"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 50;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

function formatTex(re: number, im: number): string {
  if (im === 0) return `${re}`;
  if (re === 0) return im === 1 ? 'i' : im === -1 ? '-i' : `${im}i`;
  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  return `${re} ${sign} ${absIm === 1 ? '' : absIm}i`;
}

export default function ComplexArithmeticViz() {
  const [re1, setRe1] = useState(2);
  const [im1, setIm1] = useState(1);
  const [re2, setRe2] = useState(1);
  const [im2, setIm2] = useState(2);
  const [op, setOp] = useState<'add' | 'sub'>('add');

  const ansRe = op === 'add' ? re1 + re2 : re1 - re2;
  const ansIm = op === 'add' ? im1 + im2 : im1 - im2;

  const p1 = toSVG(re1, im1);
  const p2 = toSVG(re2, im2);
  const pAns = toSVG(ansRe, ansIm);

  // Parallelogram for addition
  const p4 = op === 'add' ? toSVG(re1, im1) : toSVG(re1, im1);

  const gridLines: React.ReactElement[] = [];
  for (let i = -4; i <= 4; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          複素数の加法・減法
        </h3>

        <div className="flex gap-3 mb-4">
          <button onClick={() => setOp('add')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${op === 'add' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            加法 (+)
          </button>
          <button onClick={() => setOp('sub')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${op === 'sub' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            減法 (-)
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            <defs>
              <marker id="arrB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
              <marker id="arrG" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
              <marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            </defs>

            {/* z1 vector */}
            <line x1={OX} y1={OY} x2={p1.x} y2={p1.y} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrB)" />
            <circle cx={p1.x} cy={p1.y} r={5} fill="#3b82f6" />
            <text x={p1.x + 8} y={p1.y - 8} fontSize={12} fontWeight="bold" fill="#1e40af">z₁</text>

            {/* z2 vector */}
            <line x1={OX} y1={OY} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth={2.5} markerEnd="url(#arrG)" />
            <circle cx={p2.x} cy={p2.y} r={5} fill="#10b981" />
            <text x={p2.x + 8} y={p2.y - 8} fontSize={12} fontWeight="bold" fill="#059669">z₂</text>

            {/* Parallelogram for addition */}
            {op === 'add' && (
              <>
                <line x1={p1.x} y1={p1.y} x2={pAns.x} y2={pAns.y} stroke="#10b981" strokeWidth={1.5} strokeDasharray="5,5" opacity={0.5} />
                <line x1={p2.x} y1={p2.y} x2={pAns.x} y2={pAns.y} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5,5" opacity={0.5} />
              </>
            )}

            {/* Result vector */}
            <line x1={OX} y1={OY} x2={pAns.x} y2={pAns.y} stroke="#ef4444" strokeWidth={3} markerEnd="url(#arrR)" />
            <circle cx={pAns.x} cy={pAns.y} r={6} fill="#ef4444" />
            <text x={pAns.x + 8} y={pAns.y - 8} fontSize={12} fontWeight="bold" fill="#dc2626">
              {op === 'add' ? 'z₁+z₂' : 'z₁-z₂'}
            </text>
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">z₁</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Re</span>
                  <input type="range" min={-3} max={3} step={0.5} value={re1} onChange={e => setRe1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Im</span>
                  <input type="range" min={-3} max={3} step={0.5} value={im1} onChange={e => setIm1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
              <div className="text-sm text-slate-600 font-mono mt-1"><MathDisplay tex={`z_1 = ${formatTex(re1, im1)}`} /></div>
            </div>

            <div>
              <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-1">z₂</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Re</span>
                  <input type="range" min={-3} max={3} step={0.5} value={re2} onChange={e => setRe2(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Im</span>
                  <input type="range" min={-3} max={3} step={0.5} value={im2} onChange={e => setIm2(parseFloat(e.target.value))} className="w-full accent-green-600" />
                </div>
              </div>
              <div className="text-sm text-slate-600 font-mono mt-1"><MathDisplay tex={`z_2 = ${formatTex(re2, im2)}`} /></div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">結果</div>
              <MathDisplay tex={`z_1 ${op === 'add' ? '+' : '-'} z_2 = ${formatTex(ansRe, ansIm)}`} />
              <p className="text-xs text-slate-500 mt-2">
                {op === 'add'
                  ? '加法はベクトルの和。平行四辺形の対角線が結果を示します。'
                  : '減法は z₂ を反転して加えること。z₁ の先端から z₂ の先端へ向かうベクトルです。'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
