"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const VectorPositionViz: React.FC = () => {
  const [ax, setAx] = useState(1);
  const [ay, setAy] = useState(2);
  const [bx, setBx] = useState(5);
  const [by, setBy] = useState(4);
  const [ratio, setRatio] = useState(0.5); // m:(1-m) for internal division; m > 1 for external

  // Internal division point: P = A + t(B - A) = (1-t)A + tB
  const t = ratio;
  const px = (1 - t) * ax + t * bx;
  const py = (1 - t) * ay + t * by;

  // Express as m:n ratio
  const m = Math.round(t * 10);
  const n = Math.round((1 - t) * 10);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`A(${ax}, ${ay}),\\; B(${bx}, ${by})`}
            displayMode
          />
          <MathDisplay
            tex={`P = (1-t)A + tB = (${px.toFixed(1)},\\; ${py.toFixed(1)}) \\quad (t = ${t.toFixed(1)})`}
            displayMode
          />
        </div>

        <svg viewBox="-1 -1 8 8" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {/* Grid */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <line x1={0} y1={i} x2={7} y2={i} stroke="#e2e8f0" strokeWidth={0.03} />
              <line x1={i} y1={0} x2={i} y2={7} stroke="#e2e8f0" strokeWidth={0.03} />
            </g>
          ))}
          <line x1={0} y1={0} x2={7} y2={0} stroke="#94a3b8" strokeWidth={0.05} />
          <line x1={0} y1={0} x2={0} y2={7} stroke="#94a3b8" strokeWidth={0.05} />

          {/* Line segment A-B */}
          <line x1={ax} y1={6 - ay} x2={bx} y2={6 - by} stroke="#94a3b8" strokeWidth={0.08} />

          {/* Position vectors from origin */}
          <line x1={0} y1={6} x2={ax} y2={6 - ay} stroke="#3b82f6" strokeWidth={0.06} strokeDasharray="0.2,0.15" />
          <line x1={0} y1={6} x2={bx} y2={6 - by} stroke="#f59e0b" strokeWidth={0.06} strokeDasharray="0.2,0.15" />
          <line x1={0} y1={6} x2={px} y2={6 - py} stroke="#10b981" strokeWidth={0.08} strokeDasharray="0.2,0.15" />

          {/* Points */}
          <circle cx={ax} cy={6 - ay} r={0.15} fill="#3b82f6" />
          <circle cx={bx} cy={6 - by} r={0.15} fill="#f59e0b" />
          <circle cx={px} cy={6 - py} r={0.18} fill="#10b981" />
          <circle cx={0} cy={6} r={0.1} fill="#64748b" />

          {/* Labels */}
          <text x={ax - 0.4} y={6 - ay - 0.2} fontSize={0.35} fill="#3b82f6" fontWeight="bold">A</text>
          <text x={bx + 0.2} y={6 - by - 0.2} fontSize={0.35} fill="#f59e0b" fontWeight="bold">B</text>
          <text x={px + 0.2} y={6 - py + 0.4} fontSize={0.35} fill="#10b981" fontWeight="bold">P</text>
          <text x={0.2} y={6 + 0.4} fontSize={0.3} fill="#64748b">O</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-blue-600 font-bold">A_x</span><span className="font-bold">{ax}</span></div>
            <input type="range" min={0} max={6} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-blue-600 font-bold">A_y</span><span className="font-bold">{ay}</span></div>
            <input type="range" min={0} max={6} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-amber-600 font-bold">B_x</span><span className="font-bold">{bx}</span></div>
            <input type="range" min={0} max={6} step={1} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-amber-600 font-bold">B_y</span><span className="font-bold">{by}</span></div>
            <input type="range" min={0} max={6} step={1} value={by} onChange={(e) => setBy(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-bold">分割比 t</span>
            <span className="font-bold text-green-600">{t.toFixed(1)}</span>
          </div>
          <input type="range" min={0} max={1} step={0.1} value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full accent-green-600" />
          <div className="text-xs text-slate-400">t=0: A, t=0.5: 中点, t=1: B</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">位置ベクトルと内分点</p>
        <MathDisplay tex={`\\vec{OP} = (1-t)\\vec{OA} + t\\vec{OB}`} displayMode />
        <p className="mt-2">
          <MathDisplay tex="t = 0" /> で点 A、<MathDisplay tex="t = 1" /> で点 B、<MathDisplay tex={`t = \\frac{1}{2}`} /> で中点 M になります。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '位置ベクトルとは、原点 O から各点への矢印（ベクトル）のことです。' },
        { step: 2, text: '内分点 P は OP = (1-t)OA + tOB で表されます。t は A から B への比率パラメータです。' },
        { step: 3, text: 't = 0 で点 A、t = 1 で点 B、t = 1/2 で中点 M になります。m:n の内分点では t = m/(m+n) です。' },
      ]} />
    </div>
  );
};

export default VectorPositionViz;
