"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const IncreaseDecreaseViz: React.FC = () => {
  const [aCoef, setACoef] = useState(1);
  const [bCoef, setBCoef] = useState(-2);
  const [cCoef, setCCoef] = useState(-1);
  const [dCoef, setDCoef] = useState(2);

  const f = (x: number) => aCoef * x ** 3 + bCoef * x ** 2 + cCoef * x + dCoef;
  const df = (x: number) => 3 * aCoef * x ** 2 + 2 * bCoef * x + cCoef;

  const svgW = 600;
  const svgH = 300;
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

  // f'(x) = 3a x^2 + 2b x + c = 0
  const A3 = 3 * aCoef;
  const B2 = 2 * bCoef;
  const disc = B2 * B2 - 4 * A3 * cCoef;

  const criticals: { x: number; type: string }[] = [];
  if (A3 !== 0 && disc >= 0) {
    const x1 = (-B2 + Math.sqrt(disc)) / (2 * A3);
    const x2 = (-B2 - Math.sqrt(disc)) / (2 * A3);
    const sorted = disc > 0 ? [Math.min(x1, x2), Math.max(x1, x2)] : [x1];
    sorted.forEach((cx, i) => {
      if (cx >= xMin && cx <= xMax) {
        // Second derivative test
        const fpp = 6 * aCoef * cx + 2 * bCoef;
        const type = fpp > 0 ? '極小' : fpp < 0 ? '極大' : '変曲';
        criticals.push({ x: cx, type });
      }
    });
  }

  // Build increase/decrease table
  const intervals: { from: string; to: string; sign: string; behavior: string }[] = [];
  const boundaries = [xMin, ...criticals.map(c => c.x), xMax];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const mid = (boundaries[i] + boundaries[i + 1]) / 2;
    const sign = df(mid) > 0 ? '+' : '-';
    intervals.push({
      from: i === 0 ? '...' : boundaries[i].toFixed(2),
      to: i === boundaries.length - 2 ? '...' : boundaries[i + 1].toFixed(2),
      sign,
      behavior: sign === '+' ? '増加 ↗' : '減少 ↘',
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

          {/* Color segments by increase/decrease */}
          {intervals.map((intv, idx) => {
            const x1 = idx === 0 ? xMin : criticals[idx - 1].x;
            const x2 = idx === intervals.length - 1 ? xMax : criticals[idx].x;
            const pts: string[] = [];
            for (let i = 0; i <= 50; i++) {
              const x = x1 + (i / 50) * (x2 - x1);
              pts.push(`${toSvgX(x)},${toSvgY(f(x))}`);
            }
            return (
              <polyline
                key={idx}
                points={pts.join(' ')}
                fill="none"
                stroke={intv.sign === '+' ? '#10b981' : '#ef4444'}
                strokeWidth={3}
              />
            );
          })}

          {/* Critical points */}
          {criticals.map((cp, i) => (
            <g key={i}>
              <circle cx={toSvgX(cp.x)} cy={toSvgY(f(cp.x))} r={7}
                fill={cp.type === '極大' ? '#ef4444' : '#3b82f6'} stroke="white" strokeWidth={2} />
              <text x={toSvgX(cp.x)} y={toSvgY(f(cp.x)) - 14} textAnchor="middle"
                fontSize={11} fontWeight="bold" fill={cp.type === '極大' ? '#ef4444' : '#3b82f6'}>
                {cp.type}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 増減表 */}
      {intervals.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2">区間</th>
                <th className="border border-slate-200 px-3 py-2">f&apos;(x) の符号</th>
                <th className="border border-slate-200 px-3 py-2">増減</th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((intv, i) => (
                <tr key={i} className={intv.sign === '+' ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="border border-slate-200 px-3 py-2 text-center">{intv.from} ～ {intv.to}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center font-bold">{intv.sign}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center">{intv.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">a</span><span className="font-bold">{aCoef}</span>
          </div>
          <input type="range" min={-2} max={2} step={1} value={aCoef}
            onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">b</span><span className="font-bold">{bCoef}</span>
          </div>
          <input type="range" min={-4} max={4} step={1} value={bCoef}
            onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">c</span><span className="font-bold">{cCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={cCoef}
            onChange={(e) => setCCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">d</span><span className="font-bold">{dCoef}</span>
          </div>
          <input type="range" min={-5} max={5} step={1} value={dCoef}
            onChange={(e) => setDCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">増減表の読み方</p>
        <p>
          <span className="text-green-600 font-bold">緑の区間</span>は <MathDisplay tex="f'(x) > 0" />（増加）、
          <span className="text-red-600 font-bold">赤の区間</span>は <MathDisplay tex="f'(x) < 0" />（減少）を表します。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '増減表を作るにはまず f\'(x) = 0 を解いて、f\'(x) の符号が変わる x の値を求めます。' },
        { step: 2, text: '各区間で f\'(x) の符号（+/-）を調べ、増加/減少を判定します。' },
        { step: 3, text: 'f\'(x) の符号が + から - に変わる点が極大、- から + に変わる点が極小です。' },
      ]} />
    </div>
  );
};

export default IncreaseDecreaseViz;
