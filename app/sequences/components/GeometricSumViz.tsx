"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface GeometricSumVizProps {
  a1?: number;
  r?: number;
}

const GeometricSumViz: React.FC<GeometricSumVizProps> = ({
  a1: initialA1 = 2,
  r: initialR = 2,
}) => {
  const [a1, setA1] = useState(initialA1);
  const [r, setR] = useState(initialR);
  const [n, setN] = useState(6);

  const terms = useMemo(() => {
    return Array.from({ length: n }, (_, i) => a1 * Math.pow(r, i));
  }, [a1, r, n]);

  const partialSums = useMemo(() => {
    const sums: number[] = [];
    let acc = 0;
    for (const t of terms) {
      acc += t;
      sums.push(acc);
    }
    return sums;
  }, [terms]);

  const sn =
    r === 1 ? n * a1 : (a1 * (1 - Math.pow(r, n))) / (1 - r);

  const svgW = 600;
  const svgH = 300;
  const padding = 50;

  const maxS = Math.max(...partialSums.map(Math.abs), 1);
  const maxT = Math.max(...terms.map(Math.abs), 1);
  const plotH = svgH - 2 * padding;

  const barGroupW = (svgW - 2 * padding) / n;
  const barW = Math.min(barGroupW * 0.35, 24);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          {r === 1 ? (
            <MathDisplay tex={`S_{${n}} = ${n} \\cdot ${a1} = ${sn}`} displayMode />
          ) : (
            <MathDisplay
              tex={`S_{${n}} = \\frac{${a1}(1 - ${r}^{${n}})}{1 - ${r}} = ${sn.toFixed(2)}`}
              displayMode
            />
          )}
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

          {terms.map((val, i) => {
            const cx = padding + (i + 0.5) * barGroupW;
            const tH = (Math.abs(val) / maxT) * plotH * 0.9;
            const sH = (Math.abs(partialSums[i]) / maxS) * plotH * 0.9;
            return (
              <g key={i}>
                {/* Term bar */}
                <rect
                  x={cx - barW - 2}
                  y={svgH - padding - tH}
                  width={barW}
                  height={tH}
                  fill="#ec4899"
                  opacity={0.7}
                  rx={3}
                />
                {/* Partial sum bar */}
                <rect
                  x={cx + 2}
                  y={svgH - padding - sH}
                  width={barW}
                  height={sH}
                  fill="#3b82f6"
                  opacity={0.7}
                  rx={3}
                />
                {/* Label */}
                <text
                  x={cx}
                  y={svgH - padding + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  {i + 1}
                </text>
                {/* Value labels */}
                <text
                  x={cx - barW / 2 - 2}
                  y={svgH - padding - tH - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#ec4899"
                  fontWeight="bold"
                >
                  {val.toFixed(val % 1 === 0 ? 0 : 1)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded" />
            <span className="text-slate-500">各項 a_k</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-slate-500">部分和 S_k</span>
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
            step={0.5}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">項数 n</span>
            <span className="font-bold">{n}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-900">
        <p className="font-bold mb-1">等比数列の和の公式</p>
        <MathDisplay
          tex={`S_n = \\frac{a_1(1 - r^n)}{1 - r} \\quad (r \\neq 1)`}
          displayMode
        />
        <p className="mt-2">
          <MathDisplay tex="r = 1" /> のとき <MathDisplay tex="S_n = na_1" /> です。
          ピンクの棒が各項、青い棒が部分和（累積）を表します。
        </p>
      </div>
    </div>
  );
};

export default GeometricSumViz;
