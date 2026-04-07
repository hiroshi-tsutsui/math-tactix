"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const VectorComponentsViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(4);

  const mag = Math.sqrt(ax * ax + ay * ay);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\vec{a} = (${ax},\\; ${ay}),\\quad |\\vec{a}| = \\sqrt{${ax}^2 + ${ay}^2} = \\sqrt{${ax * ax + ay * ay}} \\approx ${mag.toFixed(2)}`}
            displayMode
          />
        </div>

        <svg viewBox="-6 -6 12 12" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {/* Grid */}
          {Array.from({ length: 11 }, (_, i) => {
            const v = i - 5;
            return (
              <g key={i}>
                <line x1={-5} y1={v} x2={5} y2={v} stroke="#e2e8f0" strokeWidth={0.04} />
                <line x1={v} y1={-5} x2={v} y2={5} stroke="#e2e8f0" strokeWidth={0.04} />
              </g>
            );
          })}
          {/* Axes */}
          <line x1={-5} y1={0} x2={5} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={-5} x2={0} y2={5} stroke="#94a3b8" strokeWidth={0.08} />

          {/* x-component (dashed) */}
          <line x1={0} y1={0} x2={ax} y2={0} stroke="#ef4444" strokeWidth={0.12} strokeDasharray="0.3,0.2" />
          {/* y-component (dashed) */}
          <line x1={ax} y1={0} x2={ax} y2={-ay} stroke="#10b981" strokeWidth={0.12} strokeDasharray="0.3,0.2" />

          {/* Vector arrow */}
          <defs>
            <marker id="arrow-comp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>
          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-comp)" />

          {/* Labels */}
          <text x={ax / 2} y={0.6} textAnchor="middle" fontSize={0.45} fill="#ef4444" fontWeight="bold">{ax}</text>
          <text x={ax + 0.4} y={-ay / 2} textAnchor="start" fontSize={0.45} fill="#10b981" fontWeight="bold">{ay}</text>

          <circle cx={ax} cy={-ay} r={0.15} fill="#3b82f6" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">x 成分</span>
            <span className="font-bold text-red-500">{ax}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">y 成分</span>
            <span className="font-bold text-green-600">{ay}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-green-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">ベクトルの成分表示</p>
        <p>ベクトルを <MathDisplay tex="x" /> 成分（赤）と <MathDisplay tex="y" /> 成分（緑）に分解して表すことを<strong>成分表示</strong>といいます。</p>
        <MathDisplay tex={`\\vec{a} = (a_1,\\; a_2) = (${ax},\\; ${ay})`} displayMode />
      </div>
    </div>
  );
};

export default VectorComponentsViz;
