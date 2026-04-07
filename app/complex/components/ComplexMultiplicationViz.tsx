"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 50;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

function formatTex(re: number, im: number): string {
  if (im === 0) return `${re}`;
  if (re === 0) return im === 1 ? 'i' : im === -1 ? '-i' : `${im}i`;
  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  return `${re} ${sign} ${absIm === 1 ? '' : absIm}i`;
}

export default function ComplexMultiplicationViz() {
  const [r1, setR1] = useState(2);
  const [arg1, setArg1] = useState(30);
  const [r2, setR2] = useState(1.5);
  const [arg2, setArg2] = useState(45);

  const theta1 = arg1 * Math.PI / 180;
  const theta2 = arg2 * Math.PI / 180;

  const re1 = Math.round(r1 * Math.cos(theta1) * 100) / 100;
  const im1 = Math.round(r1 * Math.sin(theta1) * 100) / 100;
  const re2 = Math.round(r2 * Math.cos(theta2) * 100) / 100;
  const im2 = Math.round(r2 * Math.sin(theta2) * 100) / 100;

  const prodR = r1 * r2;
  const prodArg = arg1 + arg2;
  const prodTheta = prodArg * Math.PI / 180;
  const prodRe = Math.round(prodR * Math.cos(prodTheta) * 100) / 100;
  const prodIm = Math.round(prodR * Math.sin(prodTheta) * 100) / 100;

  const p1 = toSVG(re1, im1);
  const p2 = toSVG(re2, im2);
  const pProd = toSVG(prodRe, prodIm);

  // Angle arcs
  function arcPath(radius: number, startDeg: number, endDeg: number): string {
    const r = radius;
    const s = startDeg * Math.PI / 180;
    const e = endDeg * Math.PI / 180;
    const sx = OX + r * Math.cos(s);
    const sy = OY - r * Math.sin(s);
    const ex = OX + r * Math.cos(e);
    const ey = OY - r * Math.sin(e);
    const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`;
  }

  const gridLines: React.ReactElement[] = [];
  for (let i = -4; i <= 4; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          複素数の乗法 — 回転とスケーリング
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            <defs>
              <marker id="arrMB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
              <marker id="arrMG" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
              <marker id="arrMR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            </defs>

            {/* Angle arcs */}
            <path d={arcPath(30, 0, arg1)} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.5} />
            <path d={arcPath(25, 0, arg2)} fill="none" stroke="#10b981" strokeWidth={1.5} opacity={0.5} />
            <path d={arcPath(35, 0, prodArg % 360)} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.5} />

            {/* z1 */}
            <line x1={OX} y1={OY} x2={p1.x} y2={p1.y} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrMB)" />
            <circle cx={p1.x} cy={p1.y} r={5} fill="#3b82f6" />
            <text x={p1.x + 8} y={p1.y - 8} fontSize={11} fontWeight="bold" fill="#1e40af">z₁</text>

            {/* z2 */}
            <line x1={OX} y1={OY} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth={2.5} markerEnd="url(#arrMG)" />
            <circle cx={p2.x} cy={p2.y} r={5} fill="#10b981" />
            <text x={p2.x + 8} y={p2.y - 8} fontSize={11} fontWeight="bold" fill="#059669">z₂</text>

            {/* Product */}
            <line x1={OX} y1={OY} x2={pProd.x} y2={pProd.y} stroke="#ef4444" strokeWidth={3} markerEnd="url(#arrMR)" />
            <circle cx={pProd.x} cy={pProd.y} r={6} fill="#ef4444" />
            <text x={pProd.x + 8} y={pProd.y - 8} fontSize={11} fontWeight="bold" fill="#dc2626">z₁z₂</text>

            {/* Modulus circles */}
            <circle cx={OX} cy={OY} r={r1 * S} fill="none" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3,3" opacity={0.2} />
            <circle cx={OX} cy={OY} r={r2 * S} fill="none" stroke="#10b981" strokeWidth={1} strokeDasharray="3,3" opacity={0.2} />
            <circle cx={OX} cy={OY} r={prodR * S} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="3,3" opacity={0.2} />
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">z₁ (極形式)</label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">|z₁|</span>
                  <input type="range" min={0.5} max={3} step={0.25} value={r1} onChange={e => setR1(parseFloat(e.target.value))} className="flex-1 accent-blue-600" />
                  <span className="text-xs font-mono w-8">{r1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">θ₁</span>
                  <input type="range" min={0} max={350} step={5} value={arg1} onChange={e => setArg1(parseInt(e.target.value))} className="flex-1 accent-blue-600" />
                  <span className="text-xs font-mono w-8">{arg1}°</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-1">z₂ (極形式)</label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">|z₂|</span>
                  <input type="range" min={0.5} max={3} step={0.25} value={r2} onChange={e => setR2(parseFloat(e.target.value))} className="flex-1 accent-green-600" />
                  <span className="text-xs font-mono w-8">{r2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">θ₂</span>
                  <input type="range" min={0} max={350} step={5} value={arg2} onChange={e => setArg2(parseInt(e.target.value))} className="flex-1 accent-green-600" />
                  <span className="text-xs font-mono w-8">{arg2}°</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">乗法の性質</div>
              <div className="space-y-1">
                <MathDisplay tex={`|z_1 z_2| = |z_1| \\cdot |z_2| = ${r1} \\times ${r2} = ${prodR.toFixed(2)}`} />
                <MathDisplay tex={`\\arg(z_1 z_2) = \\arg(z_1) + \\arg(z_2) = ${arg1}° + ${arg2}° = ${prodArg}°`} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                乗法は「絶対値の積」と「偏角の和」。z₂を掛けることは回転とスケーリングに対応します。
              </p>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '乗法: (a+bi)(c+di) = (ac-bd) + (ad+bc)i。i² = -1 を使って展開します。' },
        { step: 2, text: '極形式では |z₁z₂| = |z₁|×|z₂|（絶対値は積）、arg(z₁z₂) = arg(z₁)+arg(z₂)（偏角は和）。' },
        { step: 3, text: 'z₂ を掛けることは「|z₂| 倍に拡大し、arg(z₂) だけ回転する」操作に対応します。' },
      ]} />
    </div>
  );
}
