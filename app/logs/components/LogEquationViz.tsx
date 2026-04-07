"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface LogEquationVizProps {
  mode?: 'explore';
}

const LogEquationViz: React.FC<LogEquationVizProps> = () => {
  const [base, setBase] = useState(2);
  const [k, setK] = useState(3);

  // Solve log_a(x) = k  =>  x = a^k
  const solution = Math.pow(base, k);

  // Plot y = log_a(x) and y = k
  const svgW = 600;
  const svgH = 300;
  const padding = 60;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const xMax = Math.max(solution * 1.5, 10);
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

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\log_{${base}} x = ${k}`}
            displayMode
          />
          <MathDisplay
            tex={`\\Longrightarrow \\quad x = ${base}^{${k}} = ${solution}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Grid */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = yMin + (i / 5) * yRange;
            return (
              <g key={`gy-${i}`}>
                <line
                  x1={padding}
                  y1={toSvgY(y)}
                  x2={svgW - padding}
                  y2={toSvgY(y)}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text x={padding - 8} y={toSvgY(y) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
                  {y.toFixed(0)}
                </text>
              </g>
            );
          })}

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
          <text
            x={svgW - padding + 4}
            y={toSvgY(k) - 4}
            fontSize={12}
            fill="#ef4444"
            fontWeight="bold"
          >
            y = {k}
          </text>

          {/* Intersection point */}
          <circle
            cx={toSvgX(solution)}
            cy={toSvgY(k)}
            r={7}
            fill="#10b981"
            stroke="white"
            strokeWidth={3}
          />

          {/* Vertical dashed line from intersection to x-axis */}
          <line
            x1={toSvgX(solution)}
            y1={toSvgY(k)}
            x2={toSvgX(solution)}
            y2={toSvgY(0)}
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="4,3"
          />

          {/* Label */}
          <text
            x={toSvgX(solution)}
            y={toSvgY(0) + 18}
            textAnchor="middle"
            fontSize={12}
            fill="#10b981"
            fontWeight="bold"
          >
            x = {solution}
          </text>

          {/* Curve label */}
          <text
            x={toSvgX(xMax * 0.7)}
            y={toSvgY(Math.log(xMax * 0.7) / Math.log(base)) - 10}
            fontSize={12}
            fill="#3b82f6"
            fontWeight="bold"
          >
            y = log_{base}(x)
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            min={0}
            max={5}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-1">対数方程式の基本</p>
        <MathDisplay
          tex={`\\log_a f(x) = k \\quad \\Longrightarrow \\quad f(x) = a^k`}
          displayMode
        />
        <p className="mt-2">
          対数方程式は指数形に変換して解きます。グラフでは
          <MathDisplay tex={`y = \\log_a x`} /> と <MathDisplay tex={`y = k`} /> の交点の
          x 座標が解です。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'log_a f(x) = k の形は f(x) = aᵏ に変換して解きます。' },
        { step: 2, text: 'log_a f(x) = log_a g(x) の形は f(x) = g(x) に変換できます。' },
        { step: 3, text: '解を求めた後、真数条件（f(x) > 0）を必ず確認しましょう。' },
      ]} />
    </div>
  );
};

export default LogEquationViz;
