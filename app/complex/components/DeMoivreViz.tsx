"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
import { motion } from 'framer-motion';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 55;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

export default function DeMoivreViz() {
  const [r, setR] = useState(1.5);
  const [thetaDeg, setThetaDeg] = useState(45);
  const [n, setN] = useState(3);

  const theta = thetaDeg * Math.PI / 180;

  // z^k for k = 1..n
  const powers: Array<{ k: number; re: number; im: number; rk: number; thetaK: number }> = [];
  for (let k = 1; k <= n; k++) {
    const rk = Math.pow(r, k);
    const tk = k * theta;
    powers.push({
      k,
      re: rk * Math.cos(tk),
      im: rk * Math.sin(tk),
      rk,
      thetaK: tk
    });
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
          <span className="w-2 h-2 rounded-full bg-pink-500" />
          ド・モアブルの定理
        </h3>

        <div className="bg-slate-900 rounded-xl p-4 mb-4">
          <MathDisplay tex={`(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta`} displayMode className="text-white" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Modulus circles for each power */}
            {powers.map((p, idx) => (
              <circle key={`circ${idx}`} cx={OX} cy={OY} r={p.rk * S} fill="none" stroke={colors[idx % colors.length]} strokeWidth={1} strokeDasharray="3,3" opacity={0.15} />
            ))}

            {/* Vectors for each power */}
            {powers.map((p, idx) => {
              const pt = toSVG(p.re, p.im);
              const color = colors[idx % colors.length];
              const inBounds = pt.x > 10 && pt.x < W - 10 && pt.y > 10 && pt.y < H - 10;
              if (!inBounds) return null;
              return (
                <g key={`pow${idx}`}>
                  <motion.line
                    x1={OX} y1={OY} x2={pt.x} y2={pt.y}
                    stroke={color} strokeWidth={p.k === n ? 3 : 2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                  />
                  <motion.circle
                    cx={pt.x} cy={pt.y} r={p.k === n ? 7 : 4} fill={color}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.15 + 0.3 }}
                  />
                  <text x={pt.x + 10} y={pt.y - 8} fontSize={10} fontWeight="bold" fill={color}>
                    z{p.k > 1 ? `^${p.k}` : ''}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">絶対値 r</label>
              <input type="range" min={0.5} max={2} step={0.25} value={r} onChange={e => setR(parseFloat(e.target.value))} className="w-full accent-pink-600" />
              <span className="text-sm font-mono text-slate-600">{r}</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">偏角 θ (度)</label>
              <input type="range" min={5} max={180} step={5} value={thetaDeg} onChange={e => setThetaDeg(parseInt(e.target.value))} className="w-full accent-pink-600" />
              <span className="text-sm font-mono text-slate-600">{thetaDeg}°</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">べき指数 n</label>
              <input type="range" min={1} max={6} step={1} value={n} onChange={e => setN(parseInt(e.target.value))} className="w-full accent-pink-600" />
              <span className="text-sm font-mono text-slate-600">{n}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">計算結果</div>
              <div className="space-y-2">
                <MathDisplay tex={`z = ${r}(\\cos ${thetaDeg}° + i\\sin ${thetaDeg}°)`} />
                <MathDisplay tex={`z^{${n}} = ${Math.pow(r, n).toFixed(2)}(\\cos ${n * thetaDeg}° + i\\sin ${n * thetaDeg}°)`} />
                {powers.length > 0 && (
                  <MathDisplay tex={`\\approx ${powers[powers.length - 1].re.toFixed(3)} ${powers[powers.length - 1].im >= 0 ? '+' : '-'} ${Math.abs(powers[powers.length - 1].im).toFixed(3)}i`} />
                )}
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-3 border border-pink-100 text-xs text-pink-700 space-y-1">
              <p><strong>ド・モアブルの定理:</strong></p>
              <p>n乗すると、偏角はn倍、絶対値はn乗になります。</p>
              <p>r=1 のとき単位円上を等間隔に回転する様子が観察できます。</p>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: 'ド・モアブルの定理: [r(cosθ + i sinθ)]ⁿ = rⁿ(cos nθ + i sin nθ) です。' },
        { step: 2, text: 'n乗すると絶対値は rⁿ に、偏角は nθ になります。' },
        { step: 3, text: 'r = 1（単位円上）のとき、n乗しても単位円上に留まり、偏角だけが n 倍されます。' },
      ]} />
    </div>
  );
}
