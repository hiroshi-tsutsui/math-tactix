"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface RecurrenceRelationVizProps {
  p?: number;
  q?: number;
  a1?: number;
}

const RecurrenceRelationViz: React.FC<RecurrenceRelationVizProps> = ({
  p: initialP = 2,
  q: initialQ = 1,
  a1: initialA1 = 1,
}) => {
  const [p, setP] = useState(initialP);
  const [q, setQ] = useState(initialQ);
  const [a1, setA1] = useState(initialA1);

  const count = 12;
  const terms = useMemo(() => {
    const arr = [a1];
    for (let i = 1; i < count; i++) {
      arr.push(p * arr[i - 1] + q);
    }
    return arr;
  }, [p, q, a1]);

  // Fixed point alpha = q / (1 - p) when p != 1
  const alpha = p !== 1 ? q / (1 - p) : null;

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const minV = Math.min(0, ...terms);
  const maxV = Math.max(...terms, 1);
  const range = maxV - minV || 1;

  const toX = (i: number) => padding + (i / (count - 1)) * plotW;
  const toY = (val: number) => svgH - padding - ((val - minV) / range) * plotH;

  // Detect overflow
  const overflow = terms.some((t) => Math.abs(t) > 1e8);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`a_{n+1} = ${p}a_n ${q >= 0 ? '+' : ''} ${q}, \\quad a_1 = ${a1}`}
            displayMode
          />
          {alpha !== null && (
            <div className="mt-2">
              <MathDisplay
                tex={`\\text{特性方程式の解 } \\alpha = \\frac{${q}}{1 - ${p}} = ${alpha.toFixed(2)}`}
              />
            </div>
          )}
        </div>

        {overflow ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            値が大きすぎてグラフ描画不可。パラメータを調整してください。
          </div>
        ) : (
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
            {/* Grid */}
            {Array.from({ length: count }, (_, i) => (
              <line
                key={`g-${i}`}
                x1={toX(i)}
                y1={padding}
                x2={toX(i)}
                y2={svgH - padding}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            ))}

            {/* Alpha line */}
            {alpha !== null && alpha >= minV && alpha <= maxV && (
              <>
                <line
                  x1={padding}
                  y1={toY(alpha)}
                  x2={svgW - padding}
                  y2={toY(alpha)}
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="6,3"
                />
                <text
                  x={svgW - padding + 4}
                  y={toY(alpha) + 4}
                  fontSize={10}
                  fill="#f59e0b"
                  fontWeight="bold"
                >
                  alpha={alpha.toFixed(1)}
                </text>
              </>
            )}

            {/* Connecting line */}
            <polyline
              points={terms
                .map((val, i) => `${toX(i)},${toY(val)}`)
                .join(' ')}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={2}
              opacity={0.6}
            />

            {/* Points */}
            {terms.map((val, i) => (
              <g key={i}>
                <circle
                  cx={toX(i)}
                  cy={toY(val)}
                  r={5}
                  fill="#8b5cf6"
                  stroke="white"
                  strokeWidth={2}
                />
                <text
                  x={toX(i)}
                  y={svgH - padding + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  {i + 1}
                </text>
              </g>
            ))}

            {/* Arrows showing recurrence */}
            {terms.slice(0, 3).map((val, i) => (
              <g key={`arrow-${i}`}>
                <line
                  x1={toX(i) + 6}
                  y1={toY(val)}
                  x2={toX(i + 1) - 6}
                  y2={toY(terms[i + 1])}
                  stroke="#10b981"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowRec)"
                  opacity={0.6}
                />
              </g>
            ))}

            <defs>
              <marker id="arrowRec" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">係数 p</span>
            <span className="font-bold text-purple-600">{p}</span>
          </div>
          <input
            type="range"
            min={-2}
            max={3}
            step={0.5}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">定数 q</span>
            <span className="font-bold text-green-600">{q}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">初項 a₁</span>
            <span className="font-bold">{a1}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={5}
            step={1}
            value={a1}
            onChange={(e) => setA1(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-900">
        <p className="font-bold mb-1">漸化式の解法</p>
        <MathDisplay
          tex={`a_{n+1} = pa_n + q \\quad \\Rightarrow \\quad a_{n+1} - \\alpha = p(a_n - \\alpha)`}
          displayMode
        />
        <p className="mt-2">
          特性方程式 <MathDisplay tex={`\\alpha = p\\alpha + q`} /> を解くと
          <MathDisplay tex={`\\alpha = \\frac{q}{1-p}`} />。
          黄色の点線がこの収束先を表します。
        </p>
      </div>
    </div>
  );
};

export default RecurrenceRelationViz;
