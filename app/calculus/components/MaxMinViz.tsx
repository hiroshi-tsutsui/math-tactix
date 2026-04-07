"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const MaxMinViz: React.FC = () => {
  const [aCoef, setACoef] = useState(1);
  const [bCoef, setBCoef] = useState(-3);
  const [cCoef, setCCoef] = useState(0);
  const [dCoef, setDCoef] = useState(4);

  const f = (x: number) => aCoef * x ** 3 + bCoef * x ** 2 + cCoef * x + dCoef;
  const df = (x: number) => 3 * aCoef * x ** 2 + 2 * bCoef * x + cCoef;
  const ddf = (x: number) => 6 * aCoef * x + 2 * bCoef;

  const svgW = 600;
  const svgH = 320;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;
  const xMin = -3;
  const xMax = 5;

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
  }, [aCoef, bCoef, cCoef, dCoef]);

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
  }, [aCoef, bCoef, cCoef, dCoef]);

  // Critical points: 3a x^2 + 2b x + c = 0
  const A3 = 3 * aCoef;
  const B2 = 2 * bCoef;
  const disc = B2 * B2 - 4 * A3 * cCoef;

  const extrema: { x: number; y: number; type: string; label: string }[] = [];
  if (A3 !== 0 && disc >= 0) {
    const roots = disc > 0
      ? [(-B2 + Math.sqrt(disc)) / (2 * A3), (-B2 - Math.sqrt(disc)) / (2 * A3)]
      : [(-B2) / (2 * A3)];
    roots.sort((a, b) => a - b);
    roots.forEach(r => {
      if (r >= xMin && r <= xMax) {
        const y = f(r);
        const fpp = ddf(r);
        const type = fpp > 0 ? '極小' : fpp < 0 ? '極大' : '変曲点';
        extrema.push({ x: r, y, type, label: `${type}: (${r.toFixed(2)}, ${y.toFixed(2)})` });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`f(x) = ${aCoef}x^3 ${bCoef >= 0 ? '+' : ''} ${bCoef}x^2 ${cCoef >= 0 ? '+' : ''} ${cCoef}x ${dCoef >= 0 ? '+' : ''} ${dCoef}`}
            displayMode
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />

          <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {extrema.map((e, i) => (
            <g key={i}>
              <line x1={toSvgX(e.x)} y1={toSvgY(e.y)} x2={toSvgX(e.x)} y2={toSvgY(0)}
                stroke={e.type === '極大' ? '#ef4444' : '#10b981'} strokeWidth={1} strokeDasharray="4,4" />
              <circle cx={toSvgX(e.x)} cy={toSvgY(e.y)} r={8}
                fill={e.type === '極大' ? '#ef4444' : '#10b981'} stroke="white" strokeWidth={2} />
              <text x={toSvgX(e.x)} y={toSvgY(e.y) + (e.type === '極大' ? -16 : 22)}
                textAnchor="middle" fontSize={11} fontWeight="bold"
                fill={e.type === '極大' ? '#ef4444' : '#10b981'}>
                {e.type} ({e.x.toFixed(1)}, {e.y.toFixed(1)})
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Info cards */}
      {extrema.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extrema.map((e, i) => (
            <div key={i} className={`rounded-xl p-4 border ${
              e.type === '極大' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="text-xs text-slate-500 mb-1">{e.type}</div>
              <MathDisplay tex={`x = ${e.x.toFixed(2)}, \\quad f(x) = ${e.y.toFixed(2)}`} displayMode />
              <div className="text-xs mt-1 text-slate-500">
                <MathDisplay tex={`f''(${e.x.toFixed(2)}) = ${ddf(e.x).toFixed(2)}`} /> {e.type === '極大' ? '< 0' : '> 0'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">a</span><span className="font-bold">{aCoef}</span></div>
          <input type="range" min={-2} max={2} step={1} value={aCoef} onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">b</span><span className="font-bold">{bCoef}</span></div>
          <input type="range" min={-5} max={5} step={1} value={bCoef} onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">c</span><span className="font-bold">{cCoef}</span></div>
          <input type="range" min={-5} max={5} step={1} value={cCoef} onChange={(e) => setCCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">d</span><span className="font-bold">{dCoef}</span></div>
          <input type="range" min={-5} max={5} step={1} value={dCoef} onChange={(e) => setDCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">極大・極小の判定</p>
        <MathDisplay tex={`f'(x) = 0 \\text{ かつ } f''(x) < 0 \\Rightarrow \\text{極大}`} displayMode />
        <MathDisplay tex={`f'(x) = 0 \\text{ かつ } f''(x) > 0 \\Rightarrow \\text{極小}`} displayMode />
      </div>

      <HintButton hints={[
        { step: 1, text: '極値を求めるにはまず f\'(x) = 0 を解きます。これが極値の候補です。' },
        { step: 2, text: '第二次導関数 f\'\'(x) を使って判定します。f\'\'(a) < 0 なら極大、f\'\'(a) > 0 なら極小です。' },
        { step: 3, text: 'f\'\'(a) = 0 のときは第二次判定法では判定不能です。増減表で確認しましょう。' },
        { step: 4, text: '極値は「局所的な」最大・最小です。関数全体の最大・最小とは限りません。' },
      ]} />
    </div>
  );
};

export default MaxMinViz;
