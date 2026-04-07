"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const VectorAdditionViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(3);

  const cx = ax + bx;
  const cy = ay + by;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\vec{a} + \\vec{b} = (${ax} + ${bx >= 0 ? bx : `(${bx})`},\\; ${ay} + ${by >= 0 ? by : `(${by})`}) = (${cx},\\; ${cy})`}
            displayMode
          />
        </div>

        <svg viewBox="-7 -7 14 14" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {/* Grid */}
          {Array.from({ length: 13 }, (_, i) => {
            const v = i - 6;
            return (
              <g key={i}>
                <line x1={-6} y1={v} x2={6} y2={v} stroke="#e2e8f0" strokeWidth={0.04} />
                <line x1={v} y1={-6} x2={v} y2={6} stroke="#e2e8f0" strokeWidth={0.04} />
              </g>
            );
          })}
          <line x1={-6} y1={0} x2={6} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={-6} x2={0} y2={6} stroke="#94a3b8" strokeWidth={0.08} />

          <defs>
            <marker id="arrow-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-c" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#10b981" />
            </marker>
          </defs>

          {/* Parallelogram fill */}
          <polygon
            points={`0,0 ${ax},${-ay} ${cx},${-cy} ${bx},${-by}`}
            fill="#3b82f6"
            opacity={0.08}
          />
          {/* Parallelogram edges (dashed) */}
          <line x1={ax} y1={-ay} x2={cx} y2={-cy} stroke="#f59e0b" strokeWidth={0.08} strokeDasharray="0.3,0.2" />
          <line x1={bx} y1={-by} x2={cx} y2={-cy} stroke="#3b82f6" strokeWidth={0.08} strokeDasharray="0.3,0.2" />

          {/* Vector a */}
          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-a)" />
          {/* Vector b */}
          <line x1={0} y1={0} x2={bx} y2={-by} stroke="#f59e0b" strokeWidth={0.15} markerEnd="url(#arrow-b)" />
          {/* Vector a+b */}
          <line x1={0} y1={0} x2={cx} y2={-cy} stroke="#10b981" strokeWidth={0.18} markerEnd="url(#arrow-c)" />

          {/* Labels */}
          <text x={ax / 2 - 0.3} y={-ay / 2 - 0.3} fontSize={0.5} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={bx / 2 + 0.3} y={-by / 2 + 0.5} fontSize={0.5} fill="#f59e0b" fontWeight="bold">b</text>
          <text x={cx / 2 + 0.3} y={-cy / 2 - 0.3} fontSize={0.5} fill="#10b981" fontWeight="bold">a+b</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 font-bold">a_x</span>
            <span className="font-bold">{ax}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 font-bold">a_y</span>
            <span className="font-bold">{ay}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-amber-600 font-bold">b_x</span>
            <span className="font-bold">{bx}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-amber-600 font-bold">b_y</span>
            <span className="font-bold">{by}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={by} onChange={(e) => setBy(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">ベクトルの和（平行四辺形の法則）</p>
        <MathDisplay tex={`\\vec{a} + \\vec{b} = (a_1 + b_1,\\; a_2 + b_2)`} displayMode />
        <p className="mt-2">2つのベクトルを2辺とする平行四辺形の対角線が和のベクトルになります。</p>
      </div>
    </div>
  );
};

export default VectorAdditionViz;
