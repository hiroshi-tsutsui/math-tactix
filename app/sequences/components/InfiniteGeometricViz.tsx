"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface InfiniteGeometricVizProps {
  a1?: number;
  r?: number;
}

const InfiniteGeometricViz: React.FC<InfiniteGeometricVizProps> = ({
  a1: initialA1 = 4,
  r: initialR = 0.5,
}) => {
  const [a1, setA1] = useState(initialA1);
  const [r, setR] = useState(initialR);
  const [showN, setShowN] = useState(20);

  const converges = Math.abs(r) < 1;
  const limitSum = converges ? a1 / (1 - r) : null;

  const terms = useMemo(() => {
    return Array.from({ length: showN }, (_, i) => a1 * Math.pow(r, i));
  }, [a1, r, showN]);

  const partialSums = useMemo(() => {
    const sums: number[] = [];
    let acc = 0;
    for (const t of terms) {
      acc += t;
      sums.push(acc);
    }
    return sums;
  }, [terms]);

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const allVals = [...partialSums];
  if (limitSum !== null) allVals.push(limitSum);
  const minV = Math.min(0, ...allVals);
  const maxV = Math.max(...allVals, 1);
  const range = maxV - minV || 1;

  const toX = (i: number) => padding + (i / (showN - 1)) * plotW;
  const toY = (val: number) => svgH - padding - ((val - minV) / range) * plotH;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          {converges ? (
            <MathDisplay
              tex={`\\sum_{n=1}^{\\infty} ${a1} \\cdot (${r})^{n-1} = \\frac{${a1}}{1 - (${r})} = ${limitSum!.toFixed(4)}`}
              displayMode
            />
          ) : (
            <div className="text-red-600 font-bold">
              <MathDisplay tex={`|r| = ${Math.abs(r).toFixed(1)} \\geq 1`} /> のため発散します
            </div>
          )}
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Limit line */}
          {limitSum !== null && (
            <>
              <line
                x1={padding}
                y1={toY(limitSum)}
                x2={svgW - padding}
                y2={toY(limitSum)}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="8,4"
              />
              <text
                x={svgW - padding + 4}
                y={toY(limitSum) + 4}
                fontSize={11}
                fill="#ef4444"
                fontWeight="bold"
              >
                S={limitSum.toFixed(2)}
              </text>
            </>
          )}

          {/* Partial sum curve */}
          <polyline
            points={partialSums
              .map((val, i) => `${toX(i)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
          />

          {/* Points */}
          {partialSums.map((val, i) => (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(val)}
              r={i < 10 ? 4 : 2.5}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={1.5}
            />
          ))}

          {/* X axis labels */}
          {[1, 5, 10, 15, 20].filter(k => k <= showN).map((k) => (
            <text
              key={k}
              x={toX(k - 1)}
              y={svgH - padding + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#64748b"
            >
              {k}
            </text>
          ))}

          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1}
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">初項 a₁</span>
            <span className="font-bold">{a1}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={a1}
            onChange={(e) => setA1(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">公比 r</span>
            <span className={`font-bold ${converges ? 'text-green-600' : 'text-red-600'}`}>{r}</span>
          </div>
          <input
            type="range"
            min={-0.9}
            max={1.5}
            step={0.1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">表示項数</span>
            <span className="font-bold">{showN}</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={showN}
            onChange={(e) => setShowN(Number(e.target.value))}
            className="w-full accent-slate-500"
          />
        </div>
      </div>

      <div className={`rounded-xl p-4 text-sm border ${
        converges
          ? 'bg-green-50 border-green-200 text-green-900'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}>
        <p className="font-bold mb-1">無限等比級数の収束条件</p>
        <MathDisplay
          tex={`|r| < 1 \\text{ のとき収束: } \\sum_{n=1}^{\\infty} a_1 r^{n-1} = \\frac{a_1}{1-r}`}
          displayMode
        />
        <p className="mt-2">
          {converges
            ? `|r| = ${Math.abs(r).toFixed(1)} < 1 なので収束し、極限値は ${limitSum!.toFixed(4)} です。赤い点線が極限値を示しています。`
            : `|r| = ${Math.abs(r).toFixed(1)} >= 1 なので発散します。部分和が際限なく大きくなります。`
          }
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '無限等比級数 Σa₁rⁿ⁻¹ が収束する条件は |r| < 1 です。' },
        { step: 2, text: '|r| < 1 のとき、n→∞ で rⁿ→0 なので Sₙ = a₁(1-rⁿ)/(1-r) → a₁/(1-r) に収束します。' },
        { step: 3, text: '|r| ≥ 1 のとき rⁿ が 0 に収束しないため、部分和は発散します。' },
      ]} />
    </div>
  );
};

export default InfiniteGeometricViz;
