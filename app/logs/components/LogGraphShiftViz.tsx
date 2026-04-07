"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface LogGraphShiftVizProps {
  mode?: 'explore';
}

const LogGraphShiftViz: React.FC<LogGraphShiftVizProps> = () => {
  const [base, setBase] = useState(2);
  const [hShift, setHShift] = useState(0);
  const [vShift, setVShift] = useState(0);
  const [showBase, setShowBase] = useState(true);

  const svgW = 600;
  const svgH = 350;
  const padding = 60;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const xMin = -3;
  const xMax = 12;
  const yMin = -4;
  const yMax = 5;
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  const toSvgX = (x: number) => padding + ((x - xMin) / xRange) * plotW;
  const toSvgY = (y: number) => svgH - padding - ((y - yMin) / yRange) * plotH;

  const makeCurve = (h: number, v: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 300; i++) {
      const x = xMin + (i / 300) * xRange;
      const arg = x - h;
      if (arg <= 0) continue;
      const y = Math.log(arg) / Math.log(base) + v;
      if (y < yMin - 1 || y > yMax + 1) continue;
      pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(' ');
  };

  const baseCurve = useMemo(() => makeCurve(0, 0), [base]);
  const shiftedCurve = useMemo(() => makeCurve(hShift, vShift), [base, hShift, vShift]);

  const formulaTex = (() => {
    let tex = `y = \\log_{${base}}`;
    if (hShift === 0) {
      tex += ' x';
    } else if (hShift > 0) {
      tex += ` (x - ${hShift})`;
    } else {
      tex += ` (x + ${-hShift})`;
    }
    if (vShift > 0) {
      tex += ` + ${vShift}`;
    } else if (vShift < 0) {
      tex += ` - ${-vShift}`;
    }
    return tex;
  })();

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay tex={formulaTex} displayMode />
          <div className="text-xs text-slate-400 mt-1">
            漸近線: <MathDisplay tex={`x = ${hShift}`} />
            {' '}|{' '}通過点: <MathDisplay tex={`(${hShift + 1}, ${vShift})`} />
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Grid */}
          {Array.from({ length: 16 }, (_, i) => {
            const x = xMin + i;
            return (
              <line key={`gx-${i}`} x1={toSvgX(x)} y1={padding} x2={toSvgX(x)} y2={svgH - padding} stroke="#f1f5f9" strokeWidth={1} />
            );
          })}
          {Array.from({ length: 10 }, (_, i) => {
            const y = yMin + i;
            return (
              <line key={`gy-${i}`} x1={padding} y1={toSvgY(y)} x2={svgW - padding} y2={toSvgY(y)} stroke="#f1f5f9" strokeWidth={1} />
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={svgW - padding} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={svgH - padding} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Asymptote */}
          <line
            x1={toSvgX(hShift)}
            y1={padding}
            x2={toSvgX(hShift)}
            y2={svgH - padding}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />

          {/* Base curve */}
          {showBase && (
            <polyline
              points={baseCurve}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6,3"
            />
          )}

          {/* Shifted curve */}
          <polyline
            points={shiftedCurve}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Key point (hShift+1, vShift) */}
          <circle
            cx={toSvgX(hShift + 1)}
            cy={toSvgY(vShift)}
            r={6}
            fill="#10b981"
            stroke="white"
            strokeWidth={2}
          />

          {/* Axis labels */}
          {[-2, 0, 2, 4, 6, 8, 10].map((x) => (
            <text key={`xl-${x}`} x={toSvgX(x)} y={toSvgY(0) + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">
              {x}
            </text>
          ))}
          {[-3, -2, -1, 1, 2, 3, 4].map((y) => (
            <text key={`yl-${y}`} x={toSvgX(0) - 8} y={toSvgY(y) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {y}
            </text>
          ))}
        </svg>

        <div className="flex justify-center gap-6 mt-2 text-xs">
          {showBase && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-400" style={{ borderTop: '2px dashed #94a3b8' }} />
              <span className="text-slate-400">y = log_{base}(x)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500" />
            <span className="text-slate-500">移動後</span>
          </div>
        </div>
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
            <span className="text-slate-500">x方向の平行移動</span>
            <span className="font-bold text-green-600">{hShift}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={5}
            step={1}
            value={hShift}
            onChange={(e) => setHShift(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">y方向の平行移動</span>
            <span className="font-bold text-purple-600">{vShift}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={vShift}
            onChange={(e) => setVShift(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showBase}
          onChange={(e) => setShowBase(e.target.checked)}
          className="accent-slate-500"
        />
        基本グラフを表示
      </label>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-1">対数関数のグラフの移動</p>
        <MathDisplay
          tex={`y = \\log_a(x - h) + k`}
          displayMode
        />
        <p className="mt-2">
          基本グラフ <MathDisplay tex="y = \\log_a x" /> を
          x 方向に <MathDisplay tex="h" />、y 方向に <MathDisplay tex="k" /> だけ平行移動したグラフです。
          漸近線は <MathDisplay tex="x = h" /> に移動します。
        </p>
      </div>
    </div>
  );
};

export default LogGraphShiftViz;
