"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const AreaBetweenCurvesViz: React.FC = () => {
  const [aCoef, setACoef] = useState(-1);
  const [cConst, setCConst] = useState(4);
  const [mSlope, setMSlope] = useState(0);
  const [dInt, setDInt] = useState(0);

  // f(x) = a*x^2 + c,  g(x) = m*x + d
  const f = (x: number) => aCoef * x * x + cConst;
  const g = (x: number) => mSlope * x + dInt;
  const diff = (x: number) => f(x) - g(x); // a*x^2 - m*x + (c - d)

  // Find intersections: a*x^2 - m*x + (c-d) = 0
  const A = aCoef;
  const B = -mSlope;
  const C = cConst - dInt;
  const disc = B * B - 4 * A * C;

  let x1 = 0;
  let x2 = 0;
  let area = 0;
  let hasIntersection = false;

  if (A !== 0 && disc > 0) {
    x1 = (-B - Math.sqrt(disc)) / (2 * A);
    x2 = (-B + Math.sqrt(disc)) / (2 * A);
    if (x1 > x2) [x1, x2] = [x2, x1];
    hasIntersection = true;

    // ∫_{x1}^{x2} |f(x) - g(x)| dx
    const Fdiff = (x: number) => (A / 3) * x ** 3 + (B / 2) * x ** 2 + C * x;
    area = Math.abs(Fdiff(x2) - Fdiff(x1));
  }

  const svgW = 600;
  const svgH = 320;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -4;
  const xMax = 4;

  const yRange = useMemo(() => {
    const samples: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      samples.push(f(x), g(x));
    }
    const minY = Math.min(...samples, -1);
    const maxY = Math.max(...samples, 1);
    const margin = (maxY - minY) * 0.15 || 2;
    return { min: minY - margin, max: maxY + margin };
  }, [aCoef, cConst, mSlope, dInt]);

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => {
    const clamped = Math.max(yRange.min, Math.min(yRange.max, y));
    return svgH - padding - ((clamped - yRange.min) / (yRange.max - yRange.min)) * plotH;
  };

  const makePath = (fn: (x: number) => number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      pts.push(`${toSvgX(x)},${toSvgY(fn(x))}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  const fPath = useMemo(() => makePath(f), [aCoef, cConst]);
  const gPath = useMemo(() => makePath(g), [mSlope, dInt]);

  // Shaded region between curves
  const shadedPath = useMemo(() => {
    if (!hasIntersection) return '';
    const steps = 100;
    const pts: string[] = [];
    // Upper curve from x1 to x2
    for (let i = 0; i <= steps; i++) {
      const x = x1 + (i / steps) * (x2 - x1);
      const upper = diff(x) >= 0 ? f(x) : g(x);
      pts.push(`${toSvgX(x)},${toSvgY(upper)}`);
    }
    // Lower curve from x2 back to x1
    for (let i = steps; i >= 0; i--) {
      const x = x1 + (i / steps) * (x2 - x1);
      const lower = diff(x) >= 0 ? g(x) : f(x);
      pts.push(`${toSvgX(x)},${toSvgY(lower)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  }, [aCoef, cConst, mSlope, dInt]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`f(x) = ${aCoef}x^2 ${cConst >= 0 ? '+' : ''} ${cConst}`}
            displayMode
          />
          <MathDisplay
            tex={`g(x) = ${mSlope}x ${dInt >= 0 ? '+' : ''} ${dInt}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Shaded area */}
          {shadedPath && <path d={shadedPath} fill="#a855f7" opacity={0.2} />}

          {/* f(x) */}
          <path d={fPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* g(x) */}
          <path d={gPath} fill="none" stroke="#ef4444" strokeWidth={2} />

          {/* Intersection points */}
          {hasIntersection && (
            <>
              <circle cx={toSvgX(x1)} cy={toSvgY(f(x1))} r={6} fill="#a855f7" stroke="white" strokeWidth={2} />
              <circle cx={toSvgX(x2)} cy={toSvgY(f(x2))} r={6} fill="#a855f7" stroke="white" strokeWidth={2} />
            </>
          )}

          {/* Legend */}
          <rect x={svgW - 130} y={10} width={120} height={50} rx={8} fill="white" stroke="#e2e8f0" />
          <line x1={svgW - 120} y1={28} x2={svgW - 100} y2={28} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={svgW - 95} y={32} fontSize={11} fill="#3b82f6">f(x)</text>
          <line x1={svgW - 120} y1={48} x2={svgW - 100} y2={48} stroke="#ef4444" strokeWidth={2} />
          <text x={svgW - 95} y={52} fontSize={11} fill="#ef4444">g(x)</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">a (x^2)</span><span className="font-bold">{aCoef}</span></div>
          <input type="range" min={-3} max={-1} step={1} value={aCoef}
            onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">c (定数)</span><span className="font-bold">{cConst}</span></div>
          <input type="range" min={0} max={8} step={1} value={cConst}
            onChange={(e) => setCConst(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">m (傾き)</span><span className="font-bold">{mSlope}</span></div>
          <input type="range" min={-3} max={3} step={1} value={mSlope}
            onChange={(e) => setMSlope(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">d (切片)</span><span className="font-bold">{dInt}</span></div>
          <input type="range" min={-4} max={4} step={1} value={dInt}
            onChange={(e) => setDInt(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-xs text-purple-400 mb-1">2曲線間の面積</div>
          <div className="text-2xl font-bold text-purple-600">{hasIntersection ? area.toFixed(4) : '---'}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">交点</div>
          <div className="text-sm font-bold text-slate-600">
            {hasIntersection
              ? `x = ${x1.toFixed(2)}, ${x2.toFixed(2)}`
              : '交点なし'
            }
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">2曲線間の面積</p>
        <MathDisplay
          tex={`S = \\int_{\\alpha}^{\\beta} |f(x) - g(x)| \\, dx`}
          displayMode
        />
        <p className="mt-2">
          2つの曲線の交点 <MathDisplay tex="\\alpha, \\beta" /> を求めてから面積を計算します。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'まず f(x) = g(x) を解いて2曲線の交点（積分区間の端）を求めます。' },
        { step: 2, text: '面積は S = ∫[α,β] |f(x) - g(x)| dx です。上側の関数から下側の関数を引きます。' },
        { step: 3, text: '区間内で上下が入れ替わる場合は、区間を分けて計算する必要があります。' },
        { step: 4, text: '放物線と直線の場合、公式 S = |a|/6 * (β - α)^3 が使えることがあります（1/6公式）。' },
      ]} />
    </div>
  );
};

export default AreaBetweenCurvesViz;
