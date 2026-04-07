"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface DifferenceSequenceVizProps {
  mode?: 'explore';
}

const DifferenceSequenceViz: React.FC<DifferenceSequenceVizProps> = () => {
  // a_n = n^2 + cn + d gives b_n = 2n + c + 1 (arithmetic difference sequence)
  const [c, setC] = useState(1);
  const [dConst, setDConst] = useState(0);
  const [showDiff, setShowDiff] = useState(true);

  const count = 10;

  const aTerms = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return n * n + c * n + dConst;
    });
  }, [c, dConst]);

  const bTerms = useMemo(() => {
    return aTerms.slice(1).map((val, i) => val - aTerms[i]);
  }, [aTerms]);

  // Verify: b_n should be arithmetic with d=2
  const bDiffs = bTerms.slice(1).map((val, i) => val - bTerms[i]);
  const isArithmeticDiff = bDiffs.every((d) => Math.abs(d - bDiffs[0]) < 0.001);

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const allVals = [...aTerms, ...bTerms];
  const minV = Math.min(0, ...allVals);
  const maxV = Math.max(...allVals, 1);
  const range = maxV - minV || 1;

  const toX = (i: number) => padding + (i / (count - 1)) * plotW;
  const toY = (val: number) => svgH - padding - ((val - minV) / range) * plotH;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-1">
          <MathDisplay
            tex={`a_n = n^2 ${c >= 0 ? '+' : ''} ${c}n ${dConst >= 0 ? '+' : ''} ${dConst}`}
            displayMode
          />
          <div className="text-sm text-slate-500">
            階差数列: <MathDisplay tex={`b_n = a_{n+1} - a_n = 2n + ${c + 1}`} />
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1}
          />

          {/* a_n curve */}
          <polyline
            points={aTerms
              .map((val, i) => `${toX(i)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
          />
          {aTerms.map((val, i) => (
            <circle
              key={`a-${i}`}
              cx={toX(i)}
              cy={toY(val)}
              r={5}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={2}
            />
          ))}

          {/* b_n (difference) */}
          {showDiff && (
            <>
              <polyline
                points={bTerms
                  .map((val, i) => `${toX(i)},${toY(val)}`)
                  .join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6,3"
              />
              {bTerms.map((val, i) => (
                <circle
                  key={`b-${i}`}
                  cx={toX(i)}
                  cy={toY(val)}
                  r={4}
                  fill="#f59e0b"
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </>
          )}

          {/* Difference arrows */}
          {showDiff &&
            aTerms.slice(0, 4).map((val, i) => (
              <g key={`d-${i}`}>
                <line
                  x1={toX(i) + 4}
                  y1={toY(val) - 4}
                  x2={toX(i + 1) - 4}
                  y2={toY(aTerms[i + 1]) - 4}
                  stroke="#ef4444"
                  strokeWidth={1}
                  markerEnd="url(#arrowDiff)"
                  opacity={0.5}
                />
                <text
                  x={(toX(i) + toX(i + 1)) / 2}
                  y={(toY(val) + toY(aTerms[i + 1])) / 2 - 10}
                  fontSize={10}
                  fill="#ef4444"
                  textAnchor="middle"
                >
                  +{bTerms[i]}
                </text>
              </g>
            ))}

          {/* X axis labels */}
          {aTerms.map((_, i) => (
            <text
              key={`l-${i}`}
              x={toX(i)}
              y={svgH - padding + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#64748b"
            >
              {i + 1}
            </text>
          ))}

          <defs>
            <marker id="arrowDiff" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
            </marker>
          </defs>
        </svg>

        <div className="flex justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-slate-500">元の数列 a_n</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-slate-500">階差数列 b_n</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">係数 c</span>
            <span className="font-bold text-blue-600">{c}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={5}
            step={1}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">定数項 d</span>
            <span className="font-bold text-green-600">{dConst}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={dConst}
            onChange={(e) => setDConst(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showDiff}
          onChange={(e) => setShowDiff(e.target.checked)}
          className="accent-amber-500"
        />
        階差数列を表示
      </label>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-bold mb-1">階差数列からの一般項の導出</p>
        <MathDisplay
          tex={`a_n = a_1 + \\sum_{k=1}^{n-1} b_k \\quad (n \\geq 2)`}
          displayMode
        />
        <p className="mt-2">
          階差数列 <MathDisplay tex="b_n" /> が等差数列や等比数列なら、
          <MathDisplay tex="a_n" /> の一般項を求められます。
        </p>
      </div>
    </div>
  );
};

export default DifferenceSequenceViz;
