"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface ArithmeticGeneralTermVizProps {
  a1?: number;
  d?: number;
}

const ArithmeticGeneralTermViz: React.FC<ArithmeticGeneralTermVizProps> = ({
  a1: initialA1 = 2,
  d: initialD = 3,
}) => {
  const [a1, setA1] = useState(initialA1);
  const [d, setD] = useState(initialD);
  const [highlightN, setHighlightN] = useState(5);

  const terms = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => a1 + i * d);
  }, [a1, d]);

  const maxVal = Math.max(...terms.map(Math.abs), 1);
  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const toX = (n: number) => padding + ((n - 1) / 14) * plotW;
  const toY = (val: number) => {
    const minV = Math.min(0, ...terms);
    const maxV = Math.max(...terms, 1);
    const range = maxV - minV || 1;
    return svgH - padding - ((val - minV) / range) * plotH;
  };

  const highlightVal = a1 + (highlightN - 1) * d;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`a_n = ${a1} + (n-1) \\cdot ${d >= 0 ? d : `(${d})`} = ${d}n + ${a1 - d}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Grid lines */}
          {Array.from({ length: 15 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={toX(i + 1)}
              y1={padding}
              x2={toX(i + 1)}
              y2={svgH - padding}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          ))}

          {/* x axis */}
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {/* Connecting line */}
          <polyline
            points={terms
              .map((val, i) => `${toX(i + 1)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
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
                fill={i + 1 === highlightN ? '#ef4444' : '#3b82f6'}
                stroke="white"
                strokeWidth={2}
              />
              {i % 2 === 0 && (
                <text
                  x={toX(i + 1)}
                  y={svgH - padding + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#64748b"
                >
                  {i + 1}
                </text>
              )}
            </g>
          ))}

          {/* Highlight label */}
          <text
            x={toX(highlightN)}
            y={toY(highlightVal) - 14}
            textAnchor="middle"
            fontSize={13}
            fontWeight="bold"
            fill="#ef4444"
          >
            a_{highlightN} = {highlightVal}
          </text>

          {/* d arrows (show difference) */}
          {highlightN < 15 && (
            <>
              <line
                x1={toX(highlightN)}
                y1={toY(highlightVal)}
                x2={toX(highlightN + 1)}
                y2={toY(highlightVal + d)}
                stroke="#10b981"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(toX(highlightN) + toX(highlightN + 1)) / 2 + 10}
                y={(toY(highlightVal) + toY(highlightVal + d)) / 2 - 6}
                fontSize={12}
                fill="#10b981"
                fontWeight="bold"
              >
                +d = {d}
              </text>
            </>
          )}

          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill="#10b981" />
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
            min={-5}
            max={10}
            step={1}
            value={a1}
            onChange={(e) => setA1(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">公差 d</span>
            <span className="font-bold text-green-600">{d}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="w-full accent-green-600"
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
            max={15}
            step={1}
            value={highlightN}
            onChange={(e) => setHighlightN(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">等差数列の一般項</p>
        <MathDisplay
          tex={`a_n = a_1 + (n-1)d = ${a1} + (n-1) \\cdot ${d >= 0 ? d : `(${d})`}`}
          displayMode
        />
        <p className="mt-2">
          スライダーで初項 <MathDisplay tex="a_1" /> と公差 <MathDisplay tex="d" /> を変えると、
          数列の形がどう変化するか観察できます。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '等差数列の一般項は aₙ = a₁ + (n-1)d です。初項 a₁ と公差 d が分かれば任意の項が求まります。' },
        { step: 2, text: '第n項 = 初項 + (n-1) × 公差。公差 d > 0 なら増加、d < 0 なら減少、d = 0 なら定数列です。' },
        { step: 3, text: 'aₙ = dn + (a₁ - d) と変形すると、n の一次関数（傾き d、切片 a₁ - d）であることが分かります。' },
      ]} />
    </div>
  );
};

export default ArithmeticGeneralTermViz;
