"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const ScalarMultiplicationViz: React.FC = () => {
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(3);
  const [k, setK] = useState(2);

  const kx = k * ax;
  const ky = k * ay;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`${k}\\vec{a} = ${k}(${ax},\\; ${ay}) = (${kx},\\; ${ky})`}
            displayMode
          />
        </div>

        <svg viewBox="-8 -8 16 16" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {Array.from({ length: 15 }, (_, i) => {
            const v = i - 7;
            return (
              <g key={i}>
                <line x1={-7} y1={v} x2={7} y2={v} stroke="#e2e8f0" strokeWidth={0.04} />
                <line x1={v} y1={-7} x2={v} y2={7} stroke="#e2e8f0" strokeWidth={0.04} />
              </g>
            );
          })}
          <line x1={-7} y1={0} x2={7} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={-7} x2={0} y2={7} stroke="#94a3b8" strokeWidth={0.08} />

          <defs>
            <marker id="arrow-orig" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-scaled" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Original vector */}
          <line x1={0} y1={0} x2={ax} y2={-ay} stroke="#94a3b8" strokeWidth={0.12} markerEnd="url(#arrow-orig)" strokeDasharray="0.3,0.2" />
          {/* Scaled vector */}
          <line x1={0} y1={0} x2={kx} y2={-ky} stroke="#3b82f6" strokeWidth={0.15} markerEnd="url(#arrow-scaled)" />

          <text x={ax + 0.3} y={-ay - 0.3} fontSize={0.5} fill="#94a3b8" fontWeight="bold">a</text>
          <text x={kx + 0.3} y={-ky - 0.3} fontSize={0.5} fill="#3b82f6" fontWeight="bold">ka</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">x 成分</span>
            <span className="font-bold">{ax}</span>
          </div>
          <input type="range" min={-3} max={3} step={1} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="w-full accent-slate-400" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">y 成分</span>
            <span className="font-bold">{ay}</span>
          </div>
          <input type="range" min={-3} max={3} step={1} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="w-full accent-slate-400" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 font-bold">スカラー k</span>
            <span className="font-bold text-blue-600">{k}</span>
          </div>
          <input type="range" min={-3} max={3} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">スカラー倍</p>
        <MathDisplay tex={`k\\vec{a} = (ka_1,\\; ka_2)`} displayMode />
        <p className="mt-2">
          <MathDisplay tex="k > 0" /> なら同じ向き、<MathDisplay tex="k < 0" /> なら逆向き。
          <MathDisplay tex="|k\\vec{a}| = |k| \\cdot |\\vec{a}|" /> です。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'スカラー倍は各成分に同じ数 k を掛けます。ka = (ka₁, ka₂) です。' },
        { step: 2, text: 'k > 0 なら元のベクトルと同じ向き、k < 0 なら逆向きになります。' },
        { step: 3, text: '大きさは |ka| = |k| * |a| です。k = 0 のとき零ベクトルになります。' },
      ]} />
    </div>
  );
};

export default ScalarMultiplicationViz;
