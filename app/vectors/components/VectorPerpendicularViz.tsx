"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const VectorPerpendicularViz: React.FC = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(-1);
  const [by, setBy] = useState(3);

  const dot = ax * bx + ay * by;
  const isPerpendicular = Math.abs(dot) < 0.01;

  // Calculate the perpendicular b vector for reference
  const perpBx = -ay;
  const perpBy = ax;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\vec{a} \\cdot \\vec{b} = ${ax} \\times ${bx >= 0 ? bx : `(${bx})`} + ${ay} \\times ${by >= 0 ? by : `(${by})`} = ${dot}`}
            displayMode
          />
          <div className={`text-sm font-bold ${isPerpendicular ? 'text-green-600' : 'text-red-600'}`}>
            {isPerpendicular ? '直交しています (a . b = 0)' : `直交していません (a . b = ${dot} ≠ 0)`}
          </div>
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

          {/* Right angle mark when perpendicular */}
          {isPerpendicular && ax !== 0 && ay !== 0 && (
            (() => {
              const s = 0.4;
              const magAval = Math.sqrt(ax * ax + ay * ay);
              const magBval = Math.sqrt(bx * bx + by * by);
              const ux = ax / magAval * s;
              const uy = ay / magAval * s;
              const vx = bx / magBval * s;
              const vy = by / magBval * s;
              return (
                <path
                  d={`M ${ux} ${-uy} L ${ux + vx} ${-(uy + vy)} L ${vx} ${-vy}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={0.08}
                />
              );
            })()
          )}

          <defs>
            <marker id="arrow-perp-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-perp-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill={isPerpendicular ? '#10b981' : '#f59e0b'} />
            </marker>
          </defs>

          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-perp-a)" />
          <line x1={0} y1={0} x2={bx} y2={-by} stroke={isPerpendicular ? '#10b981' : '#f59e0b'} strokeWidth={0.15} markerEnd="url(#arrow-perp-b)" />

          <text x={ax + 0.3} y={-ay - 0.2} fontSize={0.5} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={bx + 0.3} y={-by - 0.2} fontSize={0.5} fill={isPerpendicular ? '#10b981' : '#f59e0b'} fontWeight="bold">b</text>
        </svg>
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

      {/* Hint for making perpendicular */}
      {!isPerpendicular && (
        <div className="text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
          a に垂直な b の一例: <MathDisplay tex={`\\vec{b} = (${perpBx},\\; ${perpBy})`} />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">垂直条件</p>
        <MathDisplay tex={`\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = 0`} displayMode />
        <p className="mt-2">
          <MathDisplay tex={`\\vec{a} = (p, q)`} /> に垂直なベクトルは <MathDisplay tex={`(-q, p)`} /> や <MathDisplay tex={`(q, -p)`} /> です。
        </p>
      </div>
    </div>
  );
};

export default VectorPerpendicularViz;
