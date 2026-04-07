"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const DerivativeGraphViz: React.FC = () => {
  const [aCoef, setACoef] = useState(1);
  const [bCoef, setBCoef] = useState(-3);
  const [cCoef, setCCoef] = useState(2);

  const f = (x: number) => aCoef * x * x * x + bCoef * x * x + cCoef * x;
  const df = (x: number) => 3 * aCoef * x * x + 2 * bCoef * x + cCoef;

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -3;
  const xMax = 4;

  const yRange = useMemo(() => {
    const samples: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      samples.push(f(x), df(x));
    }
    const minY = Math.min(...samples, -1);
    const maxY = Math.max(...samples, 1);
    const margin = (maxY - minY) * 0.1 || 1;
    return { min: minY - margin, max: maxY + margin };
  }, [aCoef, bCoef, cCoef]);

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => {
    const clamped = Math.max(yRange.min, Math.min(yRange.max, y));
    return svgH - padding - ((clamped - yRange.min) / (yRange.max - yRange.min)) * plotH;
  };

  const makePath = (fn: (x: number) => number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = fn(x);
      if (isFinite(y)) pts.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.length > 1 ? `M ${pts.join(' L ')}` : '';
  };

  const fPath = useMemo(() => makePath(f), [aCoef, bCoef, cCoef]);
  const dfPath = useMemo(() => makePath(df), [aCoef, bCoef, cCoef]);

  // Find f'(x)=0 roots for marking
  const disc = 4 * bCoef * bCoef - 12 * aCoef * cCoef;
  const criticalPoints: number[] = [];
  if (aCoef !== 0 && disc >= 0) {
    const x1 = (-2 * bCoef + Math.sqrt(disc)) / (6 * aCoef);
    const x2 = (-2 * bCoef - Math.sqrt(disc)) / (6 * aCoef);
    if (x1 >= xMin && x1 <= xMax) criticalPoints.push(x1);
    if (disc > 0 && x2 >= xMin && x2 <= xMax) criticalPoints.push(x2);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`f(x) = ${aCoef}x^3 ${bCoef >= 0 ? '+' : ''} ${bCoef}x^2 ${cCoef >= 0 ? '+' : ''} ${cCoef}x`}
            displayMode
          />
          <MathDisplay
            tex={`f'(x) = ${3 * aCoef}x^2 ${2 * bCoef >= 0 ? '+' : ''} ${2 * bCoef}x ${cCoef >= 0 ? '+' : ''} ${cCoef}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Axes */}
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* f(x) */}
          <path d={fPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* f'(x) */}
          <path d={dfPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3" />

          {/* Critical points */}
          {criticalPoints.map((cp, i) => (
            <g key={i}>
              <line x1={toSvgX(cp)} y1={toSvgY(yRange.min)} x2={toSvgX(cp)} y2={toSvgY(yRange.max)}
                stroke="#a855f7" strokeWidth={1} strokeDasharray="4,4" />
              <circle cx={toSvgX(cp)} cy={toSvgY(f(cp))} r={6} fill="#a855f7" stroke="white" strokeWidth={2} />
              <circle cx={toSvgX(cp)} cy={toSvgY(0)} r={4} fill="#ef4444" stroke="white" strokeWidth={1.5} />
            </g>
          ))}

          {/* Legend */}
          <rect x={svgW - 150} y={10} width={140} height={70} rx={8} fill="white" stroke="#e2e8f0" />
          <line x1={svgW - 140} y1={28} x2={svgW - 120} y2={28} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={svgW - 115} y={32} fontSize={11} fill="#3b82f6">f(x)</text>
          <line x1={svgW - 140} y1={48} x2={svgW - 120} y2={48} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3" />
          <text x={svgW - 115} y={52} fontSize={11} fill="#ef4444">f&apos;(x)</text>
          <circle cx={svgW - 130} cy={68} r={4} fill="#a855f7" />
          <text x={svgW - 115} y={72} fontSize={11} fill="#a855f7">極値点</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">a (x^3)</span>
            <span className="font-bold">{aCoef}</span>
          </div>
          <input type="range" min={-2} max={2} step={1} value={aCoef}
            onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">b (x^2)</span>
            <span className="font-bold">{bCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={bCoef}
            onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">c (x)</span>
            <span className="font-bold">{cCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={cCoef}
            onChange={(e) => setCCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">導関数のグラフ</p>
        <p>
          <MathDisplay tex="f'(x) = 0" /> となる点（紫）で <MathDisplay tex="f(x)" /> は極値をとります。
          <MathDisplay tex="f'(x) > 0" /> の区間で <MathDisplay tex="f(x)" /> は増加、
          <MathDisplay tex="f'(x) < 0" /> の区間で減少します。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'f\'(x) > 0 の区間で f(x) は増加（右上がり）、f\'(x) < 0 の区間で減少（右下がり）です。' },
        { step: 2, text: 'f\'(x) = 0 となる点は極値の候補です。f\'(x) の符号が変わるかどうかを確認します。' },
        { step: 3, text: '導関数 f\'(x) のグラフが x 軸を横切る点が、元の関数 f(x) の極値点に対応します。' },
      ]} />
    </div>
  );
};

export default DerivativeGraphViz;
