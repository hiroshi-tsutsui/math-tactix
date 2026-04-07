"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const AntiderivativeViz: React.FC = () => {
  const [n, setN] = useState(2);
  const [a, setA] = useState(1);
  const [cConst, setCConst] = useState(0);

  // f(x) = a * x^n, F(x) = a/(n+1) * x^(n+1) + C
  const f = (x: number) => a * Math.pow(x, n);
  const F = (x: number) => (a / (n + 1)) * Math.pow(x, n + 1) + cConst;

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -3;
  const xMax = 3;

  const yRange = useMemo(() => {
    const samples: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      const yf = f(x);
      const yF = F(x);
      if (isFinite(yf)) samples.push(yf);
      if (isFinite(yF)) samples.push(yF);
    }
    const minY = Math.min(...samples, -1);
    const maxY = Math.max(...samples, 1);
    const margin = (maxY - minY) * 0.1 || 1;
    return { min: minY - margin, max: maxY + margin };
  }, [n, a, cConst]);

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

  const fPath = useMemo(() => makePath(f), [n, a]);
  const FPath = useMemo(() => makePath(F), [n, a, cConst]);

  // Also show F with different C values for family of curves
  const cValues = [-3, -1, 0, 1, 3].filter(c => c !== cConst);
  const familyPaths = useMemo(() => {
    return cValues.map(c => {
      const Fc = (x: number) => (a / (n + 1)) * Math.pow(x, n + 1) + c;
      return makePath(Fc);
    });
  }, [n, a, cConst]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x^{${n}}`}
            displayMode
          />
          <MathDisplay
            tex={`F(x) = \\int f(x) \\, dx = \\frac{${a}}{${n + 1}}x^{${n + 1}} + C`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Family of antiderivatives (light) */}
          {familyPaths.map((p, i) => (
            <path key={i} d={p} fill="none" stroke="#10b981" strokeWidth={1} opacity={0.25} />
          ))}

          {/* F(x) highlighted */}
          <path d={FPath} fill="none" stroke="#10b981" strokeWidth={2.5} />
          {/* f(x) */}
          <path d={fPath} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,3" />

          {/* Legend */}
          <rect x={svgW - 150} y={10} width={140} height={50} rx={8} fill="white" stroke="#e2e8f0" />
          <line x1={svgW - 140} y1={28} x2={svgW - 120} y2={28} stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,3" />
          <text x={svgW - 115} y={32} fontSize={11} fill="#3b82f6">f(x) 被積分関数</text>
          <line x1={svgW - 140} y1={48} x2={svgW - 120} y2={48} stroke="#10b981" strokeWidth={2.5} />
          <text x={svgW - 115} y={52} fontSize={11} fill="#10b981">F(x) 原始関数</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">指数 n</span>
            <span className="font-bold text-blue-600">{n}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={n}
            onChange={(e) => setN(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">係数 a</span>
            <span className="font-bold text-purple-600">{a}</span>
          </div>
          <input type="range" min={-3} max={3} step={1} value={a}
            onChange={(e) => setA(Number(e.target.value))} className="w-full accent-purple-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">積分定数 C</span>
            <span className="font-bold text-green-600">{cConst}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={cConst}
            onChange={(e) => setCConst(Number(e.target.value))} className="w-full accent-green-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">不定積分（原始関数）</p>
        <MathDisplay
          tex={`\\int ax^n \\, dx = \\frac{a}{n+1} x^{n+1} + C`}
          displayMode
        />
        <p className="mt-2">
          積分定数 C を変えると原始関数が上下にシフトします。
          薄い緑の曲線は異なる C の値に対応する原始関数の族です。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '不定積分は微分の逆操作です。F\'(x) = f(x) となる F(x) を求めます。' },
        { step: 2, text: 'べき乗の積分公式: ∫x^n dx = x^(n+1)/(n+1) + C です。指数を1つ上げて、新しい指数で割ります。' },
        { step: 3, text: '積分定数 C を忘れないようにしましょう。C が異なると原始関数のグラフが上下にシフトします。' },
      ]} />
    </div>
  );
};

export default AntiderivativeViz;
