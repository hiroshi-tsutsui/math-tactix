"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const DefiniteIntegralViz: React.FC = () => {
  const [aCoef, setACoef] = useState(-1);
  const [bCoef, setBCoef] = useState(4);
  const [cCoef, setCCoef] = useState(0);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(3);

  const f = (x: number) => aCoef * x * x + bCoef * x + cCoef;
  // F(x) = a/3 x^3 + b/2 x^2 + c x
  const F = (x: number) => (aCoef / 3) * x ** 3 + (bCoef / 2) * x ** 2 + cCoef * x;
  const area = F(hi) - F(lo);

  const svgW = 600;
  const svgH = 320;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -2;
  const xMax = 6;

  const yRange = useMemo(() => {
    const samples: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      samples.push(f(x));
    }
    const minY = Math.min(...samples, -1);
    const maxY = Math.max(...samples, 1);
    const margin = (maxY - minY) * 0.15 || 2;
    return { min: minY - margin, max: maxY + margin };
  }, [aCoef, bCoef, cCoef]);

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => {
    const clamped = Math.max(yRange.min, Math.min(yRange.max, y));
    return svgH - padding - ((clamped - yRange.min) / (yRange.max - yRange.min)) * plotH;
  };

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      pts.push(`${toSvgX(x)},${toSvgY(f(x))}`);
    }
    return `M ${pts.join(' L ')}`;
  }, [aCoef, bCoef, cCoef]);

  // Shaded area path (between curve and x-axis)
  const shadedPath = useMemo(() => {
    const steps = 100;
    const pts: string[] = [];
    pts.push(`${toSvgX(lo)},${toSvgY(0)}`);
    for (let i = 0; i <= steps; i++) {
      const x = lo + (i / steps) * (hi - lo);
      pts.push(`${toSvgX(x)},${toSvgY(f(x))}`);
    }
    pts.push(`${toSvgX(hi)},${toSvgY(0)}`);
    return `M ${pts.join(' L ')} Z`;
  }, [aCoef, bCoef, cCoef, lo, hi]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\int_{${lo}}^{${hi}} (${aCoef}x^2 ${bCoef >= 0 ? '+' : ''} ${bCoef}x ${cCoef >= 0 ? '+' : ''} ${cCoef}) \\, dx = ${area.toFixed(4)}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Shaded area */}
          <path d={shadedPath} fill="#3b82f6" opacity={0.2} />

          {/* Curve */}
          <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {/* Bound lines */}
          <line x1={toSvgX(lo)} y1={toSvgY(yRange.min)} x2={toSvgX(lo)} y2={toSvgY(yRange.max)}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,4" />
          <line x1={toSvgX(hi)} y1={toSvgY(yRange.min)} x2={toSvgX(hi)} y2={toSvgY(yRange.max)}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,4" />

          {/* Labels */}
          <text x={toSvgX(lo)} y={svgH - 10} textAnchor="middle" fontSize={12} fill="#ef4444" fontWeight="bold">
            a = {lo}
          </text>
          <text x={toSvgX(hi)} y={svgH - 10} textAnchor="middle" fontSize={12} fill="#ef4444" fontWeight="bold">
            b = {hi}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">下端 a</span><span className="font-bold text-red-500">{lo}</span></div>
          <input type="range" min={-2} max={4} step={1} value={lo}
            onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 1))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">上端 b</span><span className="font-bold text-red-500">{hi}</span></div>
          <input type="range" min={0} max={5} step={1} value={hi}
            onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 1))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">a (x^2)</span><span className="font-bold">{aCoef}</span></div>
          <input type="range" min={-3} max={3} step={1} value={aCoef}
            onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">b (x)</span><span className="font-bold">{bCoef}</span></div>
          <input type="range" min={-5} max={5} step={1} value={bCoef}
            onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <div className="text-xs text-green-400 mb-1">定積分の値</div>
        <div className="text-2xl font-bold text-green-600">{area.toFixed(4)}</div>
        <div className="text-xs text-green-500 mt-1">
          <MathDisplay tex={`F(${hi}) - F(${lo}) = ${F(hi).toFixed(4)} - ${F(lo).toFixed(4)}`} />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">微積分の基本定理</p>
        <MathDisplay
          tex={`\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad (F'(x) = f(x))`}
          displayMode
        />
        <p className="mt-2">
          青い領域の面積（符号付き）が定積分の値に対応します。
        </p>
      </div>
    </div>
  );
};

export default DefiniteIntegralViz;
