"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const PowerRuleViz: React.FC = () => {
  const [n, setN] = useState(2);
  const [a, setA] = useState(1);

  const f = (x: number) => a * Math.pow(x, n);
  const df = (x: number) => a * n * Math.pow(x, n - 1);

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
      samples.push(f(x), df(x));
    }
    const minY = Math.min(...samples, -1);
    const maxY = Math.max(...samples, 1);
    const margin = (maxY - minY) * 0.1 || 1;
    return { min: minY - margin, max: maxY + margin };
  }, [n, a]);

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => {
    const clamped = Math.max(yRange.min, Math.min(yRange.max, y));
    return svgH - padding - ((clamped - yRange.min) / (yRange.max - yRange.min)) * plotH;
  };

  const makePath = (fn: (x: number) => number): string => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = fn(x);
      if (isFinite(y) && y >= yRange.min - 10 && y <= yRange.max + 10) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`);
      }
    }
    return pts.length > 1 ? `M ${pts.join(' L ')}` : '';
  };

  const fPath = useMemo(() => makePath(f), [n, a]);
  const dfPath = useMemo(() => makePath(df), [n, a]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x^{${n}}`}
            displayMode
          />
          <MathDisplay
            tex={`f'(x) = ${a * n === 1 ? '' : a * n === -1 ? '-' : a * n}x^{${n - 1}}`}
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

          {/* Legend */}
          <rect x={svgW - 140} y={10} width={130} height={50} rx={8} fill="white" stroke="#e2e8f0" />
          <line x1={svgW - 130} y1={28} x2={svgW - 110} y2={28} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={svgW - 105} y={32} fontSize={11} fill="#3b82f6">f(x)</text>
          <line x1={svgW - 130} y1={48} x2={svgW - 110} y2={48} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3" />
          <text x={svgW - 105} y={52} fontSize={11} fill="#ef4444">f&apos;(x)</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">指数 n</span>
            <span className="font-bold text-blue-600">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">係数 a</span>
            <span className="font-bold text-purple-600">{a}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">べき乗の微分法則</p>
        <MathDisplay
          tex={`\\frac{d}{dx}[ax^n] = anx^{n-1}`}
          displayMode
        />
        <p className="mt-2">
          指数 n を変えると、導関数のグラフ（赤い破線）がどう変わるか観察しましょう。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'べき乗の微分公式: (x^n)\' = nx^(n-1) です。指数を前に出し、指数を1つ下げます。' },
        { step: 2, text: '例: (x^3)\' = 3x^2, (x^2)\' = 2x, (x^1)\' = 1, (定数)\' = 0 です。' },
        { step: 3, text: '係数 a がある場合: (ax^n)\' = anx^(n-1) です。係数はそのまま残ります。' },
      ]} />
    </div>
  );
};

export default PowerRuleViz;
