"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 440, H = 340;
const OX = W / 2, OY = H / 2, S = 50;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

export default function QuadraticComplexRootsViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(5);

  const disc = b * b - 4 * a * c;
  const hasComplexRoots = disc < 0;

  const roots = useMemo(() => {
    if (a === 0) return [];
    const realPart = -b / (2 * a);
    if (disc >= 0) {
      const sqrtD = Math.sqrt(disc);
      return [
        { re: ((-b + sqrtD) / (2 * a)), im: 0 },
        { re: ((-b - sqrtD) / (2 * a)), im: 0 }
      ];
    }
    const imPart = Math.sqrt(-disc) / (2 * a);
    return [
      { re: realPart, im: imPart },
      { re: realPart, im: -imPart }
    ];
  }, [a, b, c, disc]);

  // Parabola points for real axis graph
  const parabolaPoints: string = useMemo(() => {
    const pts: string[] = [];
    for (let px = -4; px <= 4; px += 0.1) {
      const y = a * px * px + b * px + c;
      const sx = OX + px * S;
      const sy = OY - y * S / 3; // scale down y for visibility
      if (sy > -50 && sy < H + 50) {
        pts.push(`${sx},${sy}`);
      }
    }
    return pts.join(' ');
  }, [a, b, c]);

  const gridLines: React.ReactElement[] = [];
  for (let i = -4; i <= 4; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S / 3} x2={W} y2={OY - i * S / 3} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          二次方程式の複素数解
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real axis parabola */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">放物線 (実軸)</div>
            <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100">
              {gridLines}
              <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
              <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
              <polyline points={parabolaPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
              {!hasComplexRoots && roots.map((r, i) => {
                const pt = toSVG(r.re, 0);
                return <circle key={i} cx={pt.x} cy={pt.y} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />;
              })}
              {hasComplexRoots && (
                <text x={W / 2} y={H - 20} textAnchor="middle" fontSize={12} fill="#ef4444" fontWeight="bold">
                  x軸と交わらない (D &lt; 0)
                </text>
              )}
            </svg>
          </div>

          {/* Complex plane roots */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">複素平面上の解</div>
            <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100">
              {gridLines}
              <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
              <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
              <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
              <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

              {/* Symmetry line */}
              {hasComplexRoots && roots.length === 2 && (
                <line x1={toSVG(roots[0].re, roots[0].im).x} y1={toSVG(roots[0].re, roots[0].im).y}
                      x2={toSVG(roots[1].re, roots[1].im).x} y2={toSVG(roots[1].re, roots[1].im).y}
                      stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5,5" />
              )}

              {roots.map((r, i) => {
                const pt = toSVG(r.re, r.im);
                return (
                  <g key={i}>
                    <line x1={OX} y1={OY} x2={pt.x} y2={pt.y} stroke={i === 0 ? '#ef4444' : '#3b82f6'} strokeWidth={2} opacity={0.5} />
                    <circle cx={pt.x} cy={pt.y} r={7} fill={i === 0 ? '#ef4444' : '#3b82f6'} stroke="white" strokeWidth={2} />
                    <text x={pt.x + 10} y={pt.y - 5} fontSize={10} fontWeight="bold" fill={i === 0 ? '#ef4444' : '#3b82f6'}>
                      {r.re.toFixed(2)} {r.im >= 0 ? '+' : '-'} {Math.abs(r.im).toFixed(2)}i
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">a</label>
            <input type="range" min={-3} max={3} step={1} value={a} onChange={e => setA(parseInt(e.target.value))} className="w-full accent-cyan-600" />
            <span className="text-sm font-mono text-slate-600">{a}</span>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">b</label>
            <input type="range" min={-6} max={6} step={1} value={b} onChange={e => setB(parseInt(e.target.value))} className="w-full accent-cyan-600" />
            <span className="text-sm font-mono text-slate-600">{b}</span>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">c</label>
            <input type="range" min={-5} max={10} step={1} value={c} onChange={e => setC(parseInt(e.target.value))} className="w-full accent-cyan-600" />
            <span className="text-sm font-mono text-slate-600">{c}</span>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
          <MathDisplay tex={`${a}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`} />
          <MathDisplay tex={`D = b^2 - 4ac = ${b}^2 - 4 \\cdot ${a} \\cdot ${c} = ${disc}`} />
          <div className={`text-sm font-bold ${hasComplexRoots ? 'text-purple-600' : 'text-green-600'}`}>
            {hasComplexRoots ? 'D < 0: 複素数解（共役複素数のペア）' : disc === 0 ? 'D = 0: 重解（実数）' : 'D > 0: 異なる2つの実数解'}
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '判別式 D = b² - 4ac で解の種類が分かります。D > 0: 異なる2実数解、D = 0: 重解、D < 0: 複素数解。' },
        { step: 2, text: 'D < 0 のとき、解は x = (-b ± √D)/(2a) = (-b ± i√|D|)/(2a) の共役複素数ペアです。' },
        { step: 3, text: '複素平面上で複素数解は実軸に関して対称な位置に現れます。' },
      ]} />
    </div>
  );
}
