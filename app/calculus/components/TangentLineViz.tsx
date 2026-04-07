"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const TangentLineViz: React.FC = () => {
  const [aCoef, setACoef] = useState(1);
  const [bCoef, setBCoef] = useState(0);
  const [cCoef, setCCoef] = useState(0);
  const [xPoint, setXPoint] = useState(1.0);

  const f = (x: number) => aCoef * x * x + bCoef * x + cCoef;
  const df = (x: number) => 2 * aCoef * x + bCoef;

  const yAtPoint = f(xPoint);
  const slope = df(xPoint);
  const intercept = yAtPoint - slope * xPoint;

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
      samples.push(f(x));
    }
    const minY = Math.min(...samples, -2);
    const maxY = Math.max(...samples, 2);
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

  // Tangent line endpoints
  const tangentX1 = xMin;
  const tangentX2 = xMax;
  const tangentY1 = slope * tangentX1 + intercept;
  const tangentY2 = slope * tangentX2 + intercept;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`f(x) = ${aCoef}x^2 ${bCoef >= 0 ? '+' : ''} ${bCoef}x ${cCoef >= 0 ? '+' : ''} ${cCoef}`}
            displayMode
          />
          <MathDisplay
            tex={`x = ${xPoint.toFixed(1)} \\text{ での接線: } y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+' : ''} ${intercept.toFixed(2)}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Axes */}
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Curve */}
          <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {/* Tangent line */}
          <line
            x1={toSvgX(tangentX1)}
            y1={toSvgY(tangentY1)}
            x2={toSvgX(tangentX2)}
            y2={toSvgY(tangentY2)}
            stroke="#ef4444"
            strokeWidth={2}
          />

          {/* Point on curve */}
          <circle cx={toSvgX(xPoint)} cy={toSvgY(yAtPoint)} r={7} fill="#ef4444" stroke="white" strokeWidth={2} />
          <text
            x={toSvgX(xPoint) + 12}
            y={toSvgY(yAtPoint) - 10}
            fontSize={11}
            fill="#ef4444"
            fontWeight="bold"
          >
            ({xPoint.toFixed(1)}, {yAtPoint.toFixed(2)})
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">a</span>
            <span className="font-bold">{aCoef}</span>
          </div>
          <input type="range" min={-3} max={3} step={1} value={aCoef}
            onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">b</span>
            <span className="font-bold">{bCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={bCoef}
            onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">c</span>
            <span className="font-bold">{cCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={cCoef}
            onChange={(e) => setCCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">接点 x</span>
            <span className="font-bold text-red-500">{xPoint.toFixed(1)}</span>
          </div>
          <input type="range" min={-3} max={3} step={0.1} value={xPoint}
            onChange={(e) => setXPoint(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="text-xs text-red-400 mb-1">傾き f&apos;(x)</div>
          <div className="text-lg font-bold text-red-600">{slope.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-400 mb-1">f(x) の値</div>
          <div className="text-lg font-bold text-blue-600">{yAtPoint.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">接線の方程式</p>
        <MathDisplay
          tex={`y - f(a) = f'(a)(x - a)`}
          displayMode
        />
        <p className="mt-2">
          接点を動かすと、接線の傾きと位置がリアルタイムに変化します。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '接線の方程式は y - f(a) = f\'(a)(x - a) です。接点 (a, f(a)) と傾き f\'(a) が必要です。' },
        { step: 2, text: 'まず f\'(x) を求め、接点の x 座標を代入して傾き f\'(a) を計算します。' },
        { step: 3, text: '整理すると y = f\'(a)x - af\'(a) + f(a) となります。y = mx + b の形に直しましょう。' },
      ]} />
    </div>
  );
};

export default TangentLineViz;
