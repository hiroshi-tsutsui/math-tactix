"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 55;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

export default function ModulusArgumentViz() {
  const [re, setRe] = useState(2);
  const [im, setIm] = useState(2);

  const mod = Math.sqrt(re * re + im * im);
  const arg = Math.atan2(im, re);
  const argDeg = arg * 180 / Math.PI;
  const pt = toSVG(re, im);

  // Arc for angle
  function anglePath(endRad: number, radius: number): string {
    if (Math.abs(endRad) < 0.01) return '';
    const startX = OX + radius;
    const startY = OY;
    const endX = OX + radius * Math.cos(endRad);
    const endY = OY - radius * Math.sin(endRad);
    const large = Math.abs(endRad) > Math.PI ? 1 : 0;
    const sweep = endRad > 0 ? 0 : 1;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${large} ${sweep} ${endX} ${endY}`;
  }

  const gridLines: React.ReactElement[] = [];
  for (let i = -3; i <= 3; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          絶対値と偏角
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Modulus circle */}
            {mod > 0.1 && (
              <circle cx={OX} cy={OY} r={mod * S} fill="none" stroke="#14b8a6" strokeWidth={1.5} strokeDasharray="5,5" opacity={0.4} />
            )}

            {/* Angle arc */}
            {Math.abs(arg) > 0.01 && (
              <path d={anglePath(arg, 40)} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
            )}
            {/* Angle label */}
            {Math.abs(arg) > 0.1 && (
              <text x={OX + 48 * Math.cos(arg / 2)} y={OY - 48 * Math.sin(arg / 2)} fontSize={11} fontWeight="bold" fill="#d97706" textAnchor="middle">
                θ
              </text>
            )}

            {/* Projection lines */}
            <line x1={pt.x} y1={pt.y} x2={pt.x} y2={OY} stroke="#64748b" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
            <line x1={OX} y1={pt.y} x2={pt.x} y2={pt.y} stroke="#64748b" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />

            {/* Labels on axes */}
            <text x={pt.x} y={OY + 16} textAnchor="middle" fontSize={10} fill="#14b8a6" fontWeight="bold">a={re}</text>
            <text x={OX - 8} y={pt.y + 4} textAnchor="end" fontSize={10} fill="#14b8a6" fontWeight="bold">b={im}</text>

            {/* Vector = modulus */}
            <defs>
              <marker id="arrMA" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#14b8a6" /></marker>
            </defs>
            <line x1={OX} y1={OY} x2={pt.x} y2={pt.y} stroke="#14b8a6" strokeWidth={3} markerEnd="url(#arrMA)" />
            <circle cx={pt.x} cy={pt.y} r={6} fill="#14b8a6" />

            {/* Modulus label along vector */}
            <text x={(OX + pt.x) / 2 - 10} y={(OY + pt.y) / 2 - 10} fontSize={12} fontWeight="bold" fill="#0d9488" transform={`rotate(${-argDeg}, ${(OX + pt.x) / 2 - 10}, ${(OY + pt.y) / 2 - 10})`}>
              r
            </text>
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">実部 a</label>
              <input type="range" min={-3} max={3} step={0.5} value={re} onChange={e => setRe(parseFloat(e.target.value))} className="w-full accent-teal-600" />
              <span className="text-sm font-mono text-slate-600">{re}</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">虚部 b</label>
              <input type="range" min={-3} max={3} step={0.5} value={im} onChange={e => setIm(parseFloat(e.target.value))} className="w-full accent-teal-600" />
              <span className="text-sm font-mono text-slate-600">{im}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">定義</div>
              <div className="space-y-2">
                <MathDisplay tex={`z = ${re} ${im >= 0 ? '+' : '-'} ${Math.abs(im)}i`} />
                <MathDisplay tex={`|z| = \\sqrt{a^2 + b^2} = \\sqrt{${re}^2 + ${im}^2} = \\sqrt{${re * re + im * im}} \\approx ${mod.toFixed(3)}`} />
                <MathDisplay tex={`\\arg(z) = \\arctan\\frac{b}{a} \\approx ${argDeg.toFixed(1)}°`} />
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="text-xs text-amber-700">
                <strong>r</strong> = 原点からの距離（絶対値）<br />
                <strong>θ</strong> = 正の実軸からの角度（偏角）<br />
                <MathDisplay tex="a = r\\cos\\theta,\\quad b = r\\sin\\theta" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '絶対値 |z| = √(a²+b²) は原点からの距離です。r と書くこともあります。' },
        { step: 2, text: '偏角 arg(z) = arctan(b/a) は正の実軸から反時計回りに測った角度です。θ と書きます。' },
        { step: 3, text: 'a = r cosθ、b = r sinθ で、成分表示と極座標表示を相互に変換できます。' },
      ]} />
    </div>
  );
}
