"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface GeometricGeneralTermVizProps {
  a1?: number;
  r?: number;
}

const GeometricGeneralTermViz: React.FC<GeometricGeneralTermVizProps> = ({
  a1: initialA1 = 2,
  r: initialR = 2,
}) => {
  const [a1, setA1] = useState(initialA1);
  const [r, setR] = useState(initialR);
  const [highlightN, setHighlightN] = useState(5);

  const count = 10;
  const terms = useMemo(() => {
    return Array.from({ length: count }, (_, i) => a1 * Math.pow(r, i));
  }, [a1, r]);

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const minV = Math.min(0, ...terms);
  const maxV = Math.max(...terms, 1);
  const range = maxV - minV || 1;

  const toX = (n: number) => padding + ((n - 1) / (count - 1)) * plotW;
  const toY = (val: number) => svgH - padding - ((val - minV) / range) * plotH;

  const highlightVal = a1 * Math.pow(r, highlightN - 1);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`a_n = ${a1} \\cdot ${r}^{n-1}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Grid */}
          {Array.from({ length: count }, (_, i) => (
            <line
              key={`g-${i}`}
              x1={toX(i + 1)}
              y1={padding}
              x2={toX(i + 1)}
              y2={svgH - padding}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          ))}

          {/* Connecting curve */}
          <polyline
            points={terms
              .map((val, i) => `${toX(i + 1)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#ec4899"
            strokeWidth={2}
            strokeDasharray="6,3"
            opacity={0.5}
          />

          {/* Points */}
          {terms.map((val, i) => (
            <g key={i}>
              <circle
                cx={toX(i + 1)}
                cy={toY(val)}
                r={i + 1 === highlightN ? 8 : 5}
                fill={i + 1 === highlightN ? '#ef4444' : '#ec4899'}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={toX(i + 1)}
                y={svgH - padding + 18}
                textAnchor="middle"
                fontSize={11}
                fill="#64748b"
              >
                {i + 1}
              </text>
            </g>
          ))}

          {/* Highlight */}
          <text
            x={toX(highlightN)}
            y={Math.max(toY(highlightVal) - 14, padding + 10)}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill="#ef4444"
          >
            a_{highlightN} = {highlightVal.toFixed(highlightVal % 1 === 0 ? 0 : 2)}
          </text>

          {/* Ratio arrow */}
          {highlightN < count && highlightN > 0 && (
            <>
              <line
                x1={toX(highlightN)}
                y1={toY(terms[highlightN - 1])}
                x2={toX(highlightN + 1)}
                y2={toY(terms[highlightN])}
                stroke="#8b5cf6"
                strokeWidth={2}
                markerEnd="url(#arrowGeo)"
              />
              <text
                x={(toX(highlightN) + toX(highlightN + 1)) / 2 + 14}
                y={(toY(terms[highlightN - 1]) + toY(terms[highlightN])) / 2}
                fontSize={12}
                fill="#8b5cf6"
                fontWeight="bold"
              >
                ×{r}
              </text>
            </>
          )}

          <defs>
            <marker id="arrowGeo" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#8b5cf6" />
            </marker>
          </defs>
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
            max={5}
            step={1}
            value={a1}
            onChange={(e) => setA1(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">公比 r</span>
            <span className="font-bold text-purple-600">{r}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">注目する項 n</span>
            <span className="font-bold text-red-500">{highlightN}</span>
          </div>
          <input
            type="range"
            min={1}
            max={count}
            step={1}
            value={highlightN}
            onChange={(e) => setHighlightN(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm text-pink-900">
        <p className="font-bold mb-1">等比数列の一般項</p>
        <MathDisplay
          tex={`a_n = a_1 \\cdot r^{n-1}`}
          displayMode
        />
        <p className="mt-2">
          <MathDisplay tex={`r > 1`} /> のとき指数的に増加し、
          <MathDisplay tex={`0 < r < 1`} /> のとき 0 に収束します。
          <MathDisplay tex={`r < 0`} /> のときは符号が交互に変わります。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '等比数列の一般項は aₙ = a₁ × rⁿ⁻¹ です。初項 a₁ と公比 r が分かれば任意の項が求まります。' },
        { step: 2, text: 'r > 1 なら指数的に増加、0 < r < 1 なら 0 に収束、r < 0 なら符号が交互に変わります。' },
        { step: 3, text: '公比 r = aₙ₊₁ / aₙ（隣り合う項の比）で求められます。r ≠ 0 であることに注意しましょう。' },
      ]} />
    </div>
  );
};

export default GeometricGeneralTermViz;
