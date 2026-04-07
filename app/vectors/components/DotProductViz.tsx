"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const DotProductViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(3);

  const dot = ax * bx + ay * by;
  const magA = Math.sqrt(ax * ax + ay * ay);
  const magB = Math.sqrt(bx * bx + by * by);
  const cosTheta = magA > 0 && magB > 0 ? dot / (magA * magB) : 0;
  const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
  const thetaDeg = (theta * 180) / Math.PI;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\vec{a} \\cdot \\vec{b} = ${ax} \\times ${bx >= 0 ? bx : `(${bx})`} + ${ay} \\times ${by >= 0 ? by : `(${by})`} = ${dot}`}
            displayMode
          />
          <MathDisplay
            tex={`|\\vec{a}| = ${magA.toFixed(2)},\\quad |\\vec{b}| = ${magB.toFixed(2)},\\quad \\theta \\approx ${thetaDeg.toFixed(1)}°`}
            displayMode
          />
        </div>

        <svg viewBox="-6 -6 12 12" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {Array.from({ length: 11 }, (_, i) => {
            const v = i - 5;
            return (
              <g key={i}>
                <line x1={-5} y1={v} x2={5} y2={v} stroke="#e2e8f0" strokeWidth={0.04} />
                <line x1={v} y1={-5} x2={v} y2={5} stroke="#e2e8f0" strokeWidth={0.04} />
              </g>
            );
          })}
          <line x1={-5} y1={0} x2={5} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={-5} x2={0} y2={5} stroke="#94a3b8" strokeWidth={0.08} />

          {/* Angle arc */}
          {magA > 0 && magB > 0 && (
            <path
              d={(() => {
                const r = 1;
                const angleA = Math.atan2(ay, ax);
                const angleB = Math.atan2(by, bx);
                const startAngle = Math.min(angleA, angleB);
                const endAngle = Math.max(angleA, angleB);
                const sx = r * Math.cos(startAngle);
                const sy = -r * Math.sin(startAngle);
                const ex = r * Math.cos(endAngle);
                const ey = -r * Math.sin(endAngle);
                const sweep = endAngle - startAngle > Math.PI ? 1 : 0;
                return `M ${sx} ${sy} A ${r} ${r} 0 ${sweep} 0 ${ex} ${ey}`;
              })()}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={0.1}
            />
          )}

          <defs>
            <marker id="arrow-dot-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-dot-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>

          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-dot-a)" />
          <line x1={0} y1={0} x2={bx} y2={-by} stroke="#f59e0b" strokeWidth={0.15} markerEnd="url(#arrow-dot-b)" />

          <text x={ax + 0.3} y={-ay - 0.2} fontSize={0.5} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={bx + 0.3} y={-by - 0.2} fontSize={0.5} fill="#f59e0b" fontWeight="bold">b</text>
        </svg>
      </div>

      {/* Color-coded dot product result */}
      <div className={`text-center p-3 rounded-xl text-sm font-bold ${
        dot > 0 ? 'bg-green-50 text-green-800 border border-green-200'
          : dot < 0 ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-purple-50 text-purple-800 border border-purple-200'
      }`}>
        {dot > 0 ? `内積 = ${dot} > 0 (鋭角)` : dot < 0 ? `内積 = ${dot} < 0 (鈍角)` : `内積 = 0 (直交)`}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-blue-600 font-bold">a_x</span><span className="font-bold">{ax}</span></div>
          <input type="range" min={-5} max={5} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-blue-600 font-bold">a_y</span><span className="font-bold">{ay}</span></div>
          <input type="range" min={-5} max={5} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-amber-600 font-bold">b_x</span><span className="font-bold">{bx}</span></div>
          <input type="range" min={-5} max={5} step={1} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-amber-600 font-bold">b_y</span><span className="font-bold">{by}</span></div>
          <input type="range" min={-5} max={5} step={1} value={by} onChange={(e) => setBy(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">内積の定義</p>
        <MathDisplay tex={`\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = |\\vec{a}||\\vec{b}|\\cos\\theta`} displayMode />
      </div>

      <HintButton hints={[
        { step: 1, text: '内積は a . b = a₁b₁ + a₂b₂ と成分で計算できます。結果はスカラー（数値）です。' },
        { step: 2, text: '内積は a . b = |a||b|cosθ とも表せます。ここで θ は2つのベクトルのなす角です。' },
        { step: 3, text: '内積 > 0 なら鋭角、内積 < 0 なら鈍角、内積 = 0 なら直角（垂直）です。' },
      ]} />
    </div>
  );
};

export default DotProductViz;
