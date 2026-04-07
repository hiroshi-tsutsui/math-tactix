"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface PartialFractionSumVizProps {
  mode?: 'explore';
}

const PartialFractionSumViz: React.FC<PartialFractionSumVizProps> = () => {
  const [n, setN] = useState(6);
  const [showTelescoping, setShowTelescoping] = useState(false);

  // 1/(k(k+1)) = 1/k - 1/(k+1) : telescoping sum
  const terms = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const k = i + 1;
      return 1 / (k * (k + 1));
    });
  }, [n]);

  const partialSums = useMemo(() => {
    const sums: number[] = [];
    let acc = 0;
    for (const t of terms) {
      acc += t;
      sums.push(acc);
    }
    return sums;
  }, [terms]);

  const exactSum = n / (n + 1); // telescoping: 1 - 1/(n+1) = n/(n+1)
  const limit = 1; // as n -> infinity

  const svgW = 600;
  const svgH = 260;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const toX = (i: number) => padding + (i / Math.max(n - 1, 1)) * plotW;
  const toY = (val: number) => svgH - padding - (val / 1.1) * plotH;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\sum_{k=1}^{${n}} \\frac{1}{k(k+1)} = \\sum_{k=1}^{${n}} \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = 1 - \\frac{1}{${n + 1}} = \\frac{${n}}{${n + 1}}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Limit line */}
          <line
            x1={padding}
            y1={toY(limit)}
            x2={svgW - padding}
            y2={toY(limit)}
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="6,3"
          />
          <text
            x={svgW - padding + 4}
            y={toY(limit) + 4}
            fontSize={10}
            fill="#ef4444"
          >
            1
          </text>

          {/* Partial sum curve */}
          <polyline
            points={partialSums
              .map((val, i) => `${toX(i)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
          />
          {partialSums.map((val, i) => (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(val)}
              r={4}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={2}
            />
          ))}

          {/* X axis */}
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          {terms.map((_, i) => (
            <text
              key={i}
              x={toX(i)}
              y={svgH - padding + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#64748b"
            >
              {i + 1}
            </text>
          ))}
        </svg>
      </div>

      {/* Telescoping visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <button
          onClick={() => setShowTelescoping(!showTelescoping)}
          className="text-sm font-bold text-blue-600 mb-2"
        >
          {showTelescoping ? '消去の様子を閉じる' : '消去の様子を表示'}
        </button>

        {showTelescoping && (
          <div className="space-y-1 font-mono text-sm mt-2">
            {Array.from({ length: Math.min(n, 8) }, (_, i) => {
              const k = i + 1;
              return (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-slate-400 w-16 text-right">k={k}:</span>
                  <span className={i > 0 ? 'text-red-400 line-through' : 'text-blue-600 font-bold'}>
                    1/{k}
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className={i < n - 1 ? 'text-red-400 line-through' : 'text-blue-600 font-bold'}>
                    1/{k + 1}
                  </span>
                </div>
              );
            })}
            <div className="border-t border-slate-200 pt-2 mt-2 text-blue-700 font-bold">
              残る項: 1/1 - 1/{n + 1} = {n}/{n + 1}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">項数 n</span>
          <span className="font-bold text-blue-600">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-900">
        <p className="font-bold mb-1">部分分数分解とテレスコーピング和</p>
        <MathDisplay
          tex={`\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}`}
          displayMode
        />
        <p className="mt-2">
          隣り合う項が打ち消し合い（テレスコーピング）、最初と最後の項だけが残ります。
          <MathDisplay tex={`n \\to \\infty`} /> で <MathDisplay tex="1" /> に収束します。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '1/k(k+1) = 1/k - 1/(k+1) と部分分数分解できます。' },
        { step: 2, text: '和を取ると隣り合う項が打ち消し合い（テレスコーピング）、最初と最後の項だけが残ります。' },
        { step: 3, text: 'Σ(k=1→n) 1/k(k+1) = 1 - 1/(n+1) = n/(n+1)。n→∞ で 1 に収束します。' },
      ]} />
    </div>
  );
};

export default PartialFractionSumViz;
