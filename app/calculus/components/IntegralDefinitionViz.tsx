"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const IntegralDefinitionViz: React.FC = () => {
  const [numRects, setNumRects] = useState(10);
  const [upperBound, setUpperBound] = useState(2.0);

  const f = (x: number) => x * x; // f(x) = x^2
  const exactArea = (upperBound ** 3) / 3; // ∫_0^b x^2 dx = b^3/3

  const svgW = 600;
  const svgH = 320;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -0.5;
  const xMax = 3.5;
  const yMin = -0.5;
  const yMax = Math.max(f(upperBound) * 1.3, 5);

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => svgH - padding - ((y - yMin) / (yMax - yMin)) * plotH;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = f(x);
      if (y <= yMax) pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return `M ${pts.join(' L ')}`;
  }, [upperBound]);

  // Riemann sum rectangles
  const dx = upperBound / numRects;
  const rects = useMemo(() => {
    const result: { x: number; w: number; h: number }[] = [];
    for (let i = 0; i < numRects; i++) {
      const xi = i * dx;
      const hi = f(xi + dx); // Right endpoint
      result.push({ x: xi, w: dx, h: hi });
    }
    return result;
  }, [numRects, upperBound]);

  const riemannSum = rects.reduce((sum, r) => sum + r.h * r.w, 0);
  const error = Math.abs(riemannSum - exactArea);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\int_0^{${upperBound.toFixed(1)}} x^2 \\, dx \\approx \\sum_{i=1}^{${numRects}} f(x_i) \\Delta x`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Axes */}
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yMin)} x2={toSvgX(0)} y2={toSvgY(yMax)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Rectangles */}
          {rects.map((r, i) => (
            <rect
              key={i}
              x={toSvgX(r.x)}
              y={toSvgY(r.h)}
              width={toSvgX(r.x + r.w) - toSvgX(r.x)}
              height={toSvgY(0) - toSvgY(r.h)}
              fill="#3b82f6"
              opacity={0.3}
              stroke="#3b82f6"
              strokeWidth={1}
            />
          ))}

          {/* Curve */}
          <path d={curvePath} fill="none" stroke="#ef4444" strokeWidth={2.5} />

          {/* Bound markers */}
          <line x1={toSvgX(0)} y1={toSvgY(-0.3)} x2={toSvgX(0)} y2={toSvgY(0.3)} stroke="#000" strokeWidth={2} />
          <line x1={toSvgX(upperBound)} y1={toSvgY(-0.3)} x2={toSvgX(upperBound)} y2={toSvgY(0.3)} stroke="#000" strokeWidth={2} />
          <text x={toSvgX(upperBound)} y={toSvgY(-0.3) + 16} textAnchor="middle" fontSize={12} fill="#000" fontWeight="bold">
            {upperBound.toFixed(1)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">区間分割数 n</span>
            <span className="font-bold text-blue-600">{numRects}</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={numRects}
            onChange={(e) => setNumRects(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">上端 b</span>
            <span className="font-bold text-red-500">{upperBound.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={upperBound}
            onChange={(e) => setUpperBound(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-400 mb-1">リーマン和</div>
          <div className="text-lg font-bold text-blue-600">{riemannSum.toFixed(4)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="text-xs text-green-400 mb-1">真の値</div>
          <div className="text-lg font-bold text-green-600">{exactArea.toFixed(4)}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="text-xs text-amber-400 mb-1">誤差</div>
          <div className="text-lg font-bold text-amber-600">{error.toFixed(4)}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">リーマン和と定積分</p>
        <MathDisplay
          tex={`\\int_a^b f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\Delta x`}
          displayMode
        />
        <p className="mt-2">
          分割数 n を増やすと、長方形の合計面積が曲線の下の面積に近づきます。
        </p>
      </div>
    </div>
  );
};

export default IntegralDefinitionViz;
