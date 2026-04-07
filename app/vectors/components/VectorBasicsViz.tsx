"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const VectorBasicsViz: React.FC = () => {
  const [startX, setStartX] = useState(1);
  const [startY, setStartY] = useState(1);
  const [endX, setEndX] = useState(4);
  const [endY, setEndY] = useState(3);

  const dx = endX - startX;
  const dy = endY - startY;
  const mag = Math.sqrt(dx * dx + dy * dy);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\vec{AB} = (${dx},\\; ${dy}),\\quad |\\vec{AB}| = \\sqrt{${dx}^2 + ${dy}^2} \\approx ${mag.toFixed(2)}`}
            displayMode
          />
        </div>

        <svg viewBox="-1 -1 12 12" className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-100" style={{ aspectRatio: '1' }}>
          {/* Grid */}
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={0} y1={i} x2={10} y2={i} stroke="#e2e8f0" strokeWidth={0.05} />
              <line x1={i} y1={0} x2={i} y2={10} stroke="#e2e8f0" strokeWidth={0.05} />
            </g>
          ))}
          {/* Axes */}
          <line x1={0} y1={0} x2={10} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={0} x2={0} y2={10} stroke="#94a3b8" strokeWidth={0.08} />

          {/* Vector arrow */}
          <defs>
            <marker id="arrow-basic" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>
          <line
            x1={startX}
            y1={10 - startY}
            x2={endX}
            y2={10 - endY}
            stroke="#3b82f6"
            strokeWidth={0.15}
            markerEnd="url(#arrow-basic)"
          />

          {/* Points */}
          <circle cx={startX} cy={10 - startY} r={0.2} fill="#ef4444" />
          <circle cx={endX} cy={10 - endY} r={0.2} fill="#10b981" />

          {/* Labels */}
          <text x={startX - 0.4} y={10 - startY + 0.5} fontSize={0.5} fill="#ef4444" fontWeight="bold">A</text>
          <text x={endX + 0.2} y={10 - endY - 0.2} fontSize={0.5} fill="#10b981" fontWeight="bold">B</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">始点 x</span>
            <span className="font-bold">{startX}</span>
          </div>
          <input type="range" min={0} max={8} step={1} value={startX} onChange={(e) => setStartX(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">始点 y</span>
            <span className="font-bold">{startY}</span>
          </div>
          <input type="range" min={0} max={8} step={1} value={startY} onChange={(e) => setStartY(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">終点 x</span>
            <span className="font-bold">{endX}</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={endX} onChange={(e) => setEndX(Number(e.target.value))} className="w-full accent-green-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">終点 y</span>
            <span className="font-bold">{endY}</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={endY} onChange={(e) => setEndY(Number(e.target.value))} className="w-full accent-green-500" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">ベクトルとは</p>
        <p>大きさと向きを持つ量を<strong>ベクトル</strong>と呼びます。始点 A から終点 B への有向線分で表し、成分は終点の座標から始点の座標を引いて求めます。</p>
        <MathDisplay tex={`\\vec{AB} = (B_x - A_x,\\; B_y - A_y) = (${endX} - ${startX},\\; ${endY} - ${startY}) = (${dx},\\; ${dy})`} displayMode />
      </div>

      <HintButton hints={[
        { step: 1, text: 'ベクトルは「大きさ」と「向き」を持つ量です。矢印の長さが大きさ、矢印の方向が向きを表します。' },
        { step: 2, text: '2点 A(x₁, y₁), B(x₂, y₂) を結ぶベクトル AB の成分は (x₂ - x₁, y₂ - y₁) で求めます。' },
        { step: 3, text: 'ベクトルの大きさ |AB| は √((x₂-x₁)² + (y₂-y₁)²) で計算できます（三平方の定理）。' },
      ]} />
    </div>
  );
};

export default VectorBasicsViz;
