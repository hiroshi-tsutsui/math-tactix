"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const DotProductAngleViz: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState(60);
  const [magA, setMagA] = useState(3);
  const [magB, setMagB] = useState(4);

  const rad = (angleDeg * Math.PI) / 180;
  const ax = magA;
  const ay = 0;
  const bx = parseFloat((magB * Math.cos(rad)).toFixed(4));
  const by = parseFloat((magB * Math.sin(rad)).toFixed(4));
  const dot = parseFloat((magA * magB * Math.cos(rad)).toFixed(4));
  const cosTheta = parseFloat(Math.cos(rad).toFixed(4));

  // Arc path for angle display
  const arcPath = useMemo(() => {
    const r = 1.2;
    const steps = 30;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * rad;
      pts.push(`${r * Math.cos(a)},${-r * Math.sin(a)}`);
    }
    return `M ${pts[0]} L ${pts.join(' L ')}`;
  }, [rad]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{${dot.toFixed(2)}}{${magA} \\times ${magB}} = ${cosTheta}`}
            displayMode
          />
          <MathDisplay tex={`\\theta = ${angleDeg}°`} displayMode />
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
          <path d={arcPath} fill="none" stroke="#8b5cf6" strokeWidth={0.1} />
          <text
            x={1.5 * Math.cos(rad / 2)}
            y={-1.5 * Math.sin(rad / 2)}
            fontSize={0.4}
            fill="#8b5cf6"
            fontWeight="bold"
            textAnchor="middle"
          >
            {angleDeg}
          </text>

          <defs>
            <marker id="arrow-angle-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-angle-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>

          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-angle-a)" />
          <line x1={0} y1={0} x2={bx} y2={-by} stroke="#f59e0b" strokeWidth={0.15} markerEnd="url(#arrow-angle-b)" />

          <text x={ax + 0.3} y={0.5} fontSize={0.5} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={bx + 0.3} y={-by - 0.3} fontSize={0.5} fill="#f59e0b" fontWeight="bold">b</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-purple-600 font-bold">角度 (度)</span>
            <span className="font-bold text-purple-600">{angleDeg}</span>
          </div>
          <input type="range" min={0} max={180} step={1} value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))} className="w-full accent-purple-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 font-bold">|a|</span>
            <span className="font-bold">{magA}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={magA} onChange={(e) => setMagA(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-amber-600 font-bold">|b|</span>
            <span className="font-bold">{magB}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={magB} onChange={(e) => setMagB(Number(e.target.value))} className="w-full accent-amber-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">内積から角度を求める</p>
        <MathDisplay tex={`\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}`} displayMode />
        <p className="mt-2">内積の値が正なら鋭角、負なら鈍角、0なら直角です。</p>
      </div>
    </div>
  );
};

export default DotProductAngleViz;
