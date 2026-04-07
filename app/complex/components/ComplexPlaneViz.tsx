"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 440, H = 440;
const ORIGIN = { x: W / 2, y: H / 2 };
const SCALE = 55;

function toSVG(a: number, b: number) {
  return { x: ORIGIN.x + a * SCALE, y: ORIGIN.y - b * SCALE };
}

export default function ComplexPlaneViz() {
  const [re, setRe] = useState(2);
  const [im, setIm] = useState(1);
  const pt = toSVG(re, im);
  const modulus = Math.sqrt(re * re + im * im);
  const argument = Math.atan2(im, re);
  const argDeg = (argument * 180 / Math.PI);

  const gridLines: React.ReactElement[] = [];
  for (let i = -3; i <= 3; i++) {
    const px = ORIGIN.x + i * SCALE;
    const py = ORIGIN.y - i * SCALE;
    gridLines.push(
      <line key={`vg${i}`} x1={px} y1={0} x2={px} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`hg${i}`} x1={0} y1={py} x2={W} y2={py} stroke="#e2e8f0" strokeWidth={1} />
    );
    if (i !== 0) {
      gridLines.push(
        <text key={`xl${i}`} x={px} y={ORIGIN.y + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{i}</text>,
        <text key={`yl${i}`} x={ORIGIN.x - 12} y={py + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{i}i</text>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          複素平面（アルガン図）
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            {/* Axes */}
            <line x1={0} y1={ORIGIN.y} x2={W} y2={ORIGIN.y} stroke="#64748b" strokeWidth={1.5} />
            <line x1={ORIGIN.x} y1={0} x2={ORIGIN.x} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={ORIGIN.y - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={ORIGIN.x + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Dashed projections */}
            <line x1={pt.x} y1={pt.y} x2={pt.x} y2={ORIGIN.y} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,4" />
            <line x1={pt.x} y1={pt.y} x2={ORIGIN.x} y2={pt.y} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,4" />

            {/* Vector from origin to point */}
            <line x1={ORIGIN.x} y1={ORIGIN.y} x2={pt.x} y2={pt.y} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrowBlue)" />
            <defs>
              <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Point */}
            <circle cx={pt.x} cy={pt.y} r={6} fill="#3b82f6" />
            <text x={pt.x + 10} y={pt.y - 10} fontSize={13} fontWeight="bold" fill="#1e40af">
              {re} + {im}i
            </text>

            {/* Modulus arc */}
            {modulus > 0.1 && (
              <circle cx={ORIGIN.x} cy={ORIGIN.y} r={modulus * SCALE} fill="none" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3,3" opacity={0.3} />
            )}
          </svg>

          <div className="space-y-5 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">実部 (Re)</label>
              <input type="range" min={-3} max={3} step={0.5} value={re} onChange={e => setRe(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              <div className="text-sm text-slate-600 mt-1 font-mono">{re}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">虚部 (Im)</label>
              <input type="range" min={-3} max={3} step={0.5} value={im} onChange={e => setIm(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              <div className="text-sm text-slate-600 mt-1 font-mono">{im}i</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">複素数:</span>
                <MathDisplay tex={`z = ${re} ${im >= 0 ? '+' : '-'} ${Math.abs(im)}i`} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">絶対値:</span>
                <MathDisplay tex={`|z| = \\sqrt{${re}^2 + ${im}^2} = ${modulus.toFixed(3)}`} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">偏角:</span>
                <MathDisplay tex={`\\arg(z) \\approx ${argDeg.toFixed(1)}°`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '複素数 a+bi を座標 (a, b) で表した平面が複素平面（ガウス平面）です。' },
        { step: 2, text: '横軸が実部（実軸）、縦軸が虚部（虚軸）を表します。' },
        { step: 3, text: '絶対値 |z| = √(a²+b²) は原点からの距離、偏角 arg(z) は正の実軸からの角度です。' },
      ]} />
    </div>
  );
}
