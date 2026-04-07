"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const GraphSketchViz: React.FC = () => {
  const [aCoef, setACoef] = useState(1);
  const [bCoef, setBCoef] = useState(-6);
  const [cCoef, setCCoef] = useState(9);
  const [dCoef, setDCoef] = useState(0);
  const [showGraph, setShowGraph] = useState(false);

  const f = (x: number) => aCoef * x ** 3 + bCoef * x ** 2 + cCoef * x + dCoef;
  const df = (x: number) => 3 * aCoef * x ** 2 + 2 * bCoef * x + cCoef;
  const ddf = (x: number) => 6 * aCoef * x + 2 * bCoef;

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

  // Critical points
  const A3 = 3 * aCoef;
  const B2 = 2 * bCoef;
  const disc = B2 * B2 - 4 * A3 * cCoef;

  const criticals: { x: number; y: number; type: string }[] = [];
  if (A3 !== 0 && disc >= 0) {
    const roots = disc > 0
      ? [(-B2 + Math.sqrt(disc)) / (2 * A3), (-B2 - Math.sqrt(disc)) / (2 * A3)]
      : [(-B2) / (2 * A3)];
    roots.sort((a, b) => a - b);
    roots.forEach(r => {
      if (r >= xMin && r <= xMax) {
        const fpp = ddf(r);
        criticals.push({
          x: r,
          y: f(r),
          type: fpp > 0 ? '極小' : fpp < 0 ? '極大' : '変曲点',
        });
      }
    });
  }

  // Inflection point: f''(x) = 0 => 6a*x + 2b = 0 => x = -b/(3a)
  const inflectionX = aCoef !== 0 ? -bCoef / (3 * aCoef) : null;
  const inflection = inflectionX !== null && inflectionX >= xMin && inflectionX <= xMax
    ? { x: inflectionX, y: f(inflectionX) } : null;

  // Build the table data
  const boundaries = [xMin, ...criticals.map(c => c.x), xMax];
  const tableRows: { interval: string; dfSign: string; behavior: string }[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const mid = (boundaries[i] + boundaries[i + 1]) / 2;
    const sign = df(mid) > 0 ? '+' : '-';
    tableRows.push({
      interval: `${i === 0 ? '-\\infty' : criticals[i - 1].x.toFixed(1)} \\sim ${i === boundaries.length - 2 ? '+\\infty' : criticals[i].x.toFixed(1)}`,
      dfSign: sign,
      behavior: sign === '+' ? '\\nearrow' : '\\searrow',
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

        {/* Increase/decrease table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2">x</th>
                {criticals.map((c, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-slate-200 px-3 py-2">...</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-purple-600">{c.x.toFixed(2)}</th>
                  </React.Fragment>
                ))}
                <th className="border border-slate-200 px-3 py-2">...</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-bold">f&apos;(x)</td>
                {tableRows.map((row, i) => (
                  <React.Fragment key={i}>
                    <td className={`border border-slate-200 px-3 py-2 text-center font-bold ${row.dfSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                      {row.dfSign}
                    </td>
                    {i < criticals.length && (
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold text-purple-600">0</td>
                    )}
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-bold">f(x)</td>
                {tableRows.map((row, i) => (
                  <React.Fragment key={i}>
                    <td className={`border border-slate-200 px-3 py-2 text-center ${row.dfSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                      <MathDisplay tex={row.behavior} />
                    </td>
                    {i < criticals.length && (
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold text-purple-600">
                        {criticals[i].y.toFixed(1)}
                      </td>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mb-4">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
          >
            {showGraph ? 'グラフを隠す' : 'グラフを表示'}
          </button>
        </div>

        {showGraph && (
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
            <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
            <line x1={toSvgX(0)} y1={toSvgY(yRange.min)} x2={toSvgX(0)} y2={toSvgY(yRange.max)} stroke="#94a3b8" strokeWidth={1.5} />
            <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

            {criticals.map((c, i) => (
              <circle key={i} cx={toSvgX(c.x)} cy={toSvgY(c.y)} r={7}
                fill={c.type === '極大' ? '#ef4444' : '#10b981'} stroke="white" strokeWidth={2} />
            ))}

            {inflection && (
              <circle cx={toSvgX(inflection.x)} cy={toSvgY(inflection.y)} r={5}
                fill="#f59e0b" stroke="white" strokeWidth={2} />
            )}

            {/* y-intercept */}
            <circle cx={toSvgX(0)} cy={toSvgY(f(0))} r={4} fill="#8b5cf6" stroke="white" strokeWidth={1.5} />
            <text x={toSvgX(0) + 10} y={toSvgY(f(0)) + 4} fontSize={10} fill="#8b5cf6">
              (0, {f(0).toFixed(1)})
            </text>
          </svg>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">a</span><span className="font-bold">{aCoef}</span></div>
          <input type="range" min={-2} max={2} step={1} value={aCoef} onChange={(e) => setACoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">b</span><span className="font-bold">{bCoef}</span></div>
          <input type="range" min={-6} max={6} step={1} value={bCoef} onChange={(e) => setBCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">c</span><span className="font-bold">{cCoef}</span></div>
          <input type="range" min={-10} max={10} step={1} value={cCoef} onChange={(e) => setCCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">d</span><span className="font-bold">{dCoef}</span></div>
          <input type="range" min={-5} max={5} step={1} value={dCoef} onChange={(e) => setDCoef(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">グラフの概形を描くステップ</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li><MathDisplay tex="f'(x) = 0" /> を解いて極値の x 座標を求める</li>
          <li>増減表を作成する</li>
          <li>極値・y 切片・変曲点をプロットする</li>
          <li>各区間の増減に合わせて曲線を描く</li>
        </ol>
      </div>

      <HintButton hints={[
        { step: 1, text: 'まず f\'(x) = 0 を解いて極値の x 座標を求め、増減表を作ります。' },
        { step: 2, text: '極値の y 座標、y 切片 f(0)、変曲点 f\'\'(x) = 0 の座標を計算してプロットします。' },
        { step: 3, text: '増減表に従って各区間の曲線を描きます。3次関数は最高次の係数の符号で x→±∞ の振る舞いが決まります。' },
      ]} />
    </div>
  );
};

export default GraphSketchViz;
