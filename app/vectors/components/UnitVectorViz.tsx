"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const UnitVectorViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(4);

  const mag = Math.sqrt(ax * ax + ay * ay);
  const ux = mag > 0 ? ax / mag : 0;
  const uy = mag > 0 ? ay / mag : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|} = \\frac{1}{${mag.toFixed(2)}}(${ax},\\; ${ay}) = (${ux.toFixed(3)},\\; ${uy.toFixed(3)})`}
            displayMode
          />
          <MathDisplay tex={`|\\hat{a}| = 1`} displayMode />
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

          {/* Unit circle */}
          <circle cx={0} cy={0} r={1} fill="none" stroke="#10b981" strokeWidth={0.06} strokeDasharray="0.2,0.15" opacity={0.5} />

          <defs>
            <marker id="arrow-unit-orig" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-unit" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#10b981" />
            </marker>
          </defs>

          {/* Original vector */}
          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#94a3b8" strokeWidth={0.1} markerEnd="url(#arrow-unit-orig)" strokeDasharray="0.3,0.2" />
          {/* Unit vector (scaled up for visibility) */}
          <line x1={0} y1={0} x2={ux * 3} y2={-uy * 3} stroke="#10b981" strokeWidth={0.15} markerEnd="url(#arrow-unit)" />
          {/* Actual unit vector endpoint on circle */}
          <circle cx={ux} cy={-uy} r={0.15} fill="#10b981" />

          <text x={ax + 0.3} y={-ay - 0.2} fontSize={0.45} fill="#94a3b8" fontWeight="bold">a</text>
          <text x={ux * 3 + 0.3} y={-uy * 3 - 0.2} fontSize={0.45} fill="#10b981" fontWeight="bold">e</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">x 成分</span>
            <span className="font-bold">{ax}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-slate-400" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">y 成分</span>
            <span className="font-bold">{ay}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-slate-400" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">単位ベクトル（正規化）</p>
        <MathDisplay tex={`\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}\\quad (|\\vec{a}| \\neq 0)`} displayMode />
        <p className="mt-2">大きさ1のベクトルを<strong>単位ベクトル</strong>といいます。元のベクトルの向きを保ったまま大きさを1にする操作を<strong>正規化</strong>（ノルマライズ）と呼びます。</p>
      </div>
    </div>
  );
};

export default UnitVectorViz;
