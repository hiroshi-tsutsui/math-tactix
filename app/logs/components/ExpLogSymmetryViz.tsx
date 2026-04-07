"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface ExpLogSymmetryVizProps {
  mode?: 'explore';
}

const ExpLogSymmetryViz: React.FC<ExpLogSymmetryVizProps> = () => {
  const [base, setBase] = useState(2);
  const [showExp, setShowExp] = useState(true);
  const [showLog, setShowLog] = useState(true);
  const [showYeqX, setShowYeqX] = useState(true);

  const svgW = 500;
  const svgH = 500;
  const padding = 50;
  const plotSize = svgW - 2 * padding;

  const coordMin = -3;
  const coordMax = 6;
  const coordRange = coordMax - coordMin;

  const toSvgX = (x: number) => padding + ((x - coordMin) / coordRange) * plotSize;
  const toSvgY = (y: number) => svgH - padding - ((y - coordMin) / coordRange) * plotSize;

  // Exponential curve y = a^x
  const expPoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = coordMin + (i / 200) * coordRange;
      const y = Math.pow(base, x);
      if (y > coordMax + 1) break;
      if (y < coordMin - 1) continue;
      pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(' ');
  }, [base]);

  // Log curve y = log_a(x)
  const logPoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 1; i <= 200; i++) {
      const x = (i / 200) * (coordMax - 0.01);
      if (x <= 0) continue;
      const y = Math.log(x) / Math.log(base);
      if (y < coordMin - 1 || y > coordMax + 1) continue;
      pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(' ');
  }, [base]);

  // Sample points to show reflection
  const samplePoints = useMemo(() => {
    return [-1, 0, 1, 2].map((x) => ({
      expX: x,
      expY: Math.pow(base, x),
      logX: Math.pow(base, x),
      logY: x,
    }));
  }, [base]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`y = ${base}^x \\quad \\text{と} \\quad y = \\log_{${base}} x \\quad \\text{は } y = x \\text{ について対称}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto">
          {/* Grid */}
          {Array.from({ length: coordRange + 1 }, (_, i) => {
            const v = coordMin + i;
            return (
              <g key={`grid-${i}`}>
                <line x1={toSvgX(v)} y1={padding} x2={toSvgX(v)} y2={svgH - padding} stroke="#f1f5f9" strokeWidth={1} />
                <line x1={padding} y1={toSvgY(v)} x2={svgW - padding} y2={toSvgY(v)} stroke="#f1f5f9" strokeWidth={1} />
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={svgW - padding} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={svgH - padding} stroke="#94a3b8" strokeWidth={1.5} />

          {/* y = x line */}
          {showYeqX && (
            <line
              x1={toSvgX(coordMin)}
              y1={toSvgY(coordMin)}
              x2={toSvgX(coordMax)}
              y2={toSvgY(coordMax)}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="8,4"
            />
          )}

          {/* Exponential curve */}
          {showExp && (
            <polyline
              points={expPoints}
              fill="none"
              stroke="#ef4444"
              strokeWidth={3}
            />
          )}

          {/* Log curve */}
          {showLog && (
            <polyline
              points={logPoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          )}

          {/* Reflection lines between sample points */}
          {showExp && showLog && showYeqX && samplePoints.map((sp, i) => (
            <g key={`ref-${i}`}>
              <line
                x1={toSvgX(sp.expX)}
                y1={toSvgY(sp.expY)}
                x2={toSvgX(sp.logX)}
                y2={toSvgY(sp.logY)}
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.5}
              />
              <circle cx={toSvgX(sp.expX)} cy={toSvgY(sp.expY)} r={4} fill="#ef4444" stroke="white" strokeWidth={1.5} />
              <circle cx={toSvgX(sp.logX)} cy={toSvgY(sp.logY)} r={4} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
            </g>
          ))}

          {/* Labels */}
          {showExp && (
            <text x={toSvgX(1.5)} y={toSvgY(Math.pow(base, 1.5)) - 10} fontSize={13} fill="#ef4444" fontWeight="bold">
              y = {base}^x
            </text>
          )}
          {showLog && (
            <text x={toSvgX(Math.pow(base, 1.5)) + 10} y={toSvgY(1.5) + 4} fontSize={13} fill="#3b82f6" fontWeight="bold">
              y = log(x)
            </text>
          )}
          {showYeqX && (
            <text x={toSvgX(coordMax - 1)} y={toSvgY(coordMax - 1) - 8} fontSize={12} fill="#94a3b8">
              y = x
            </text>
          )}

          {/* Axis labels */}
          {[-2, 0, 2, 4].map((v) => (
            <g key={`axl-${v}`}>
              <text x={toSvgX(v)} y={toSvgY(0) + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{v}</text>
              {v !== 0 && <text x={toSvgX(0) - 8} y={toSvgY(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>}
            </g>
          ))}
        </svg>
      </div>

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

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showExp} onChange={(e) => setShowExp(e.target.checked)} className="accent-red-500" />
          <span className="text-red-600">指数関数</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showLog} onChange={(e) => setShowLog(e.target.checked)} className="accent-blue-500" />
          <span className="text-blue-600">対数関数</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showYeqX} onChange={(e) => setShowYeqX(e.target.checked)} className="accent-slate-500" />
          <span className="text-slate-500">y = x</span>
        </label>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
        <p className="font-bold mb-1">逆関数の関係</p>
        <MathDisplay
          tex={`y = a^x \\iff x = \\log_a y`}
          displayMode
        />
        <p className="mt-2">
          指数関数と対数関数は互いに逆関数の関係にあり、
          直線 <MathDisplay tex="y = x" /> に関して対称です。
          点 <MathDisplay tex="(p, q)" /> が一方のグラフ上にあれば、
          <MathDisplay tex="(q, p)" /> はもう一方のグラフ上にあります。
        </p>
      </div>
    </div>
  );
};

export default ExpLogSymmetryViz;
