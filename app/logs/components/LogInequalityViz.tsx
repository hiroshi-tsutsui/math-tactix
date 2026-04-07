"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface LogInequalityVizProps {
  mode?: 'explore';
}

const LogInequalityViz: React.FC<LogInequalityVizProps> = () => {
  const [base, setBase] = useState(2);
  const [k, setK] = useState(3);
  const [direction, setDirection] = useState<'gt' | 'lt'>('gt');

  const boundary = Math.pow(base, k);
  const isBaseGt1 = base > 1;

  // Solution depends on whether base > 1 or 0 < base < 1
  // For base > 1: log_a(x) > k  <=>  x > a^k
  // For base > 1: log_a(x) < k  <=>  0 < x < a^k
  const solutionTex =
    direction === 'gt'
      ? isBaseGt1
        ? `x > ${boundary}`
        : `0 < x < ${boundary}`
      : isBaseGt1
        ? `0 < x < ${boundary}`
        : `x > ${boundary}`;

  const svgW = 600;
  const svgH = 300;
  const padding = 60;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const xMax = Math.max(boundary * 2, 20);
  const yMin = -2;
  const yMax = Math.max(k + 2, 5);
  const yRange = yMax - yMin;

  const toSvgX = (x: number) => padding + (x / xMax) * plotW;
  const toSvgY = (y: number) => svgH - padding - ((y - yMin) / yRange) * plotH;

  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 1; i <= 200; i++) {
      const x = (i / 200) * xMax;
      if (x <= 0) continue;
      const y = Math.log(x) / Math.log(base);
      if (y < yMin - 1 || y > yMax + 1) continue;
      pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(' ');
  }, [base, xMax, yMin, yMax]);

  // Shade the solution region on x-axis
  const isSolutionRight = (direction === 'gt' && isBaseGt1) || (direction === 'lt' && !isBaseGt1);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\log_{${base}} x ${direction === 'gt' ? '>' : '<'} ${k}`}
            displayMode
          />
          <div className="text-lg">
            解: <MathDisplay tex={solutionTex} className="font-bold text-green-700" />
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Solution region shade */}
          {isSolutionRight ? (
            <rect
              x={toSvgX(boundary)}
              y={padding}
              width={svgW - padding - toSvgX(boundary)}
              height={plotH}
              fill="#10b981"
              opacity={0.08}
            />
          ) : (
            <rect
              x={toSvgX(0.01)}
              y={padding}
              width={toSvgX(boundary) - toSvgX(0.01)}
              height={plotH}
              fill="#10b981"
              opacity={0.08}
            />
          )}

          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={svgW - padding} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={svgH - padding} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Log curve */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
          />

          {/* y = k line */}
          <line
            x1={padding}
            y1={toSvgY(k)}
            x2={svgW - padding}
            y2={toSvgY(k)}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="8,4"
          />
          <text x={svgW - padding + 4} y={toSvgY(k) - 4} fontSize={11} fill="#ef4444" fontWeight="bold">
            y = {k}
          </text>

          {/* Boundary point */}
          <circle
            cx={toSvgX(boundary)}
            cy={toSvgY(k)}
            r={6}
            fill="white"
            stroke="#10b981"
            strokeWidth={3}
          />
          <line
            x1={toSvgX(boundary)}
            y1={toSvgY(k)}
            x2={toSvgX(boundary)}
            y2={toSvgY(0)}
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="4,3"
          />
          <text
            x={toSvgX(boundary)}
            y={toSvgY(0) + 18}
            textAnchor="middle"
            fontSize={11}
            fill="#10b981"
            fontWeight="bold"
          >
            {boundary}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">底 a</span>
            <span className="font-bold text-blue-600">{base}</span>
          </div>
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">定数 k</span>
            <span className="font-bold text-red-500">{k}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => setDirection('gt')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              direction === 'gt' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            &gt; (大)
          </button>
          <button
            onClick={() => setDirection('lt')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              direction === 'lt' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            &lt; (小)
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-bold mb-1">対数不等式のポイント</p>
        <MathDisplay
          tex={`a > 1 \\text{ のとき: } \\log_a x > k \\iff x > a^k`}
          displayMode
        />
        <MathDisplay
          tex={`0 < a < 1 \\text{ のとき: 不等号の向きが逆転}`}
          displayMode
        />
        <p className="mt-2">
          底が 1 より大きい場合、対数関数は単調増加なので不等号の向きは保存されます。
          真数条件（x &gt; 0）も忘れずに！
        </p>
      </div>
    </div>
  );
};

export default LogInequalityViz;
