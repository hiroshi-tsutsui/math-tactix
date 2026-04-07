"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface ArithmeticSumVizProps {
  a1?: number;
  d?: number;
}

const ArithmeticSumViz: React.FC<ArithmeticSumVizProps> = ({
  a1: initialA1 = 1,
  d: initialD = 2,
}) => {
  const [a1, setA1] = useState(initialA1);
  const [d, setD] = useState(initialD);
  const [n, setN] = useState(8);

  const terms = useMemo(() => {
    return Array.from({ length: n }, (_, i) => a1 + i * d);
  }, [a1, d, n]);

  const an = a1 + (n - 1) * d;
  const sn = (n * (a1 + an)) / 2;

  const svgW = 600;
  const svgH = 320;
  const padding = 40;
  const barW = Math.min(30, (svgW - 2 * padding) / n - 4);
  const maxVal = Math.max(...terms.map(Math.abs), 1);

  const toBarH = (val: number) => {
    return (Math.abs(val) / maxVal) * (svgH - 2 * padding - 30);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`S_{${n}} = \\frac{${n}(a_1 + a_{${n}})}{2} = \\frac{${n}(${a1} + ${an})}{2} = ${sn}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Baseline */}
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {/* Bars - original */}
          {terms.map((val, i) => {
            const x =
              padding + (i / n) * (svgW - 2 * padding) + (svgW - 2 * padding) / n / 2 - barW / 2;
            const h = toBarH(val);
            return (
              <g key={`bar-${i}`}>
                <rect
                  x={x - barW / 2 - 1}
                  y={svgH - padding - h}
                  width={barW}
                  height={h}
                  fill="#3b82f6"
                  opacity={0.7}
                  rx={3}
                />
                <rect
                  x={x + barW / 2 + 1}
                  y={svgH - padding - toBarH(terms[n - 1 - i])}
                  width={barW}
                  height={toBarH(terms[n - 1 - i])}
                  fill="#f59e0b"
                  opacity={0.5}
                  rx={3}
                />
                <text
                  x={x + barW / 2}
                  y={svgH - padding + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  {i + 1}
                </text>
                <text
                  x={x}
                  y={svgH - padding - h - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#3b82f6"
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-slate-500">a_k（正順）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded" />
            <span className="text-slate-500">a_{'{n+1-k}'}（逆順）</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">初項 a₁</span>
            <span className="font-bold">{a1}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={8}
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
            min={-3}
            max={5}
            step={1}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">項数 n</span>
            <span className="font-bold text-purple-600">{n}</span>
          </div>
          <input
            type="range"
            min={2}
            max={15}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-bold mb-1">等差数列の和の公式</p>
        <MathDisplay
          tex={`S_n = \\frac{n(a_1 + a_n)}{2} = \\frac{n\\{2a_1 + (n-1)d\\}}{2}`}
          displayMode
        />
        <p className="mt-2">
          青い棒（正順）と黄色い棒（逆順）を足すとどのペアも同じ高さ（
          <MathDisplay tex={`a_1 + a_n = ${a1 + an}`} />
          ）になります。これが n 対あるので 2 で割ります。
        </p>
      </div>
    </div>
  );
};

export default ArithmeticSumViz;
