"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const VectorMagnitudeViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(4);

  const magSq = ax * ax + ay * ay;
  const mag = Math.sqrt(magSq);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`|\\vec{a}| = \\sqrt{${ax}^2 + ${ay}^2} = \\sqrt{${magSq}} \\approx ${mag.toFixed(3)}`}
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

          {/* Right angle mark */}
          <rect x={ax - 0.4 * Math.sign(ax)} y={-0.4 * Math.sign(ay)} width={0.4} height={0.4} fill="none" stroke="#64748b" strokeWidth={0.06} />

          {/* x component */}
          <line x1={0} y1={0} x2={ax} y2={0} stroke="#ef4444" strokeWidth={0.12} />
          {/* y component */}
          <line x1={ax} y1={0} x2={ax} y2={-ay} stroke="#10b981" strokeWidth={0.12} />

          <defs>
            <marker id="arrow-mag" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>
          {/* Vector */}
          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-mag)" />

          {/* Labels */}
          <text x={ax / 2} y={0.6} textAnchor="middle" fontSize={0.4} fill="#ef4444" fontWeight="bold">{Math.abs(ax)}</text>
          <text x={ax + 0.5} y={-ay / 2} textAnchor="start" fontSize={0.4} fill="#10b981" fontWeight="bold">{Math.abs(ay)}</text>
          <text x={ax / 2 - 0.5} y={-ay / 2 - 0.3} textAnchor="middle" fontSize={0.4} fill="#3b82f6" fontWeight="bold">{mag.toFixed(2)}</text>

          {/* Unit circle for reference */}
          <circle cx={0} cy={0} r={mag} fill="none" stroke="#3b82f6" strokeWidth={0.04} strokeDasharray="0.2,0.15" opacity={0.3} />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-red-500 font-bold">x 成分</span>
            <span className="font-bold">{ax}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-bold">y 成分</span>
            <span className="font-bold">{ay}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-green-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">ベクトルの大きさ</p>
        <MathDisplay tex={`|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}`} displayMode />
        <p className="mt-2">三平方の定理（ピタゴラスの定理）から、x 成分と y 成分の二乗和の平方根が大きさになります。</p>
      </div>
    </div>
  );
};

export default VectorMagnitudeViz;
