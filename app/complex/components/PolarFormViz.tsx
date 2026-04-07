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

export default function PolarFormViz() {
  const [r, setR] = useState(2);
  const [thetaDeg, setThetaDeg] = useState(60);

  const theta = thetaDeg * Math.PI / 180;
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);
  const pt = toSVG(re, im);

  // Angle arc
  function anglePath(endRad: number, radius: number): string {
    if (Math.abs(endRad) < 0.01) return '';
    const sx = OX + radius;
    const sy = OY;
    const ex = OX + radius * Math.cos(endRad);
    const ey = OY - radius * Math.sin(endRad);
    const large = Math.abs(endRad) > Math.PI ? 1 : 0;
    const sweep = endRad > 0 ? 0 : 1;
    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} ${sweep} ${ex} ${ey}`;
  }

  // Common angles
  const commonAngles = [
    { deg: 0, label: '0' }, { deg: 30, label: 'π/6' }, { deg: 45, label: 'π/4' },
    { deg: 60, label: 'π/3' }, { deg: 90, label: 'π/2' }, { deg: 120, label: '2π/3' },
    { deg: 135, label: '3π/4' }, { deg: 150, label: '5π/6' }, { deg: 180, label: 'π' },
    { deg: 210, label: '7π/6' }, { deg: 225, label: '5π/4' }, { deg: 240, label: '4π/3' },
    { deg: 270, label: '3π/2' }, { deg: 300, label: '5π/3' }, { deg: 315, label: '7π/4' },
    { deg: 330, label: '11π/6' }
  ];

  // Fraction representation of angle
  const thetaFrac = (() => {
    const match = commonAngles.find(a => a.deg === thetaDeg);
    return match ? match.label : `${thetaDeg}°`;
  })();

  const gridLines: React.ReactElement[] = [];
  for (let i = -3; i <= 3; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * S} y1={0} x2={OX + i * S} y2={H} stroke="#e2e8f0" strokeWidth={1} />,
      <line key={`h${i}`} x1={0} y1={OY - i * S} x2={W} y2={OY - i * S} stroke="#e2e8f0" strokeWidth={1} />
    );
  }

  // Unit circle angle markers
  const unitMarkers = commonAngles.map(a => {
    const rad = a.deg * Math.PI / 180;
    const mx = OX + (3.5 * S) * Math.cos(rad);
    const my = OY - (3.5 * S) * Math.sin(rad);
    return (
      <text key={a.deg} x={mx} y={my} fontSize={8} fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">
        {a.label}
      </text>
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          極形式
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            {unitMarkers}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {/* Modulus circle */}
            <circle cx={OX} cy={OY} r={r * S} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="5,5" opacity={0.3} />

            {/* Angle arc */}
            {Math.abs(theta) > 0.01 && (
              <path d={anglePath(theta, 35)} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
            )}

            {/* Projection lines */}
            <line x1={pt.x} y1={pt.y} x2={pt.x} y2={OY} stroke="#6366f1" strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />
            <line x1={OX} y1={pt.y} x2={pt.x} y2={pt.y} stroke="#6366f1" strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />

            {/* Labels */}
            <text x={pt.x} y={OY + 16} textAnchor="middle" fontSize={10} fill="#6366f1">r cos θ</text>
            <text x={OX - 8} y={pt.y + 4} textAnchor="end" fontSize={10} fill="#6366f1">r sin θ</text>

            {/* Vector */}
            <defs>
              <marker id="arrPF" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" /></marker>
            </defs>
            <line x1={OX} y1={OY} x2={pt.x} y2={pt.y} stroke="#6366f1" strokeWidth={3} markerEnd="url(#arrPF)" />
            <circle cx={pt.x} cy={pt.y} r={6} fill="#6366f1" />
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">絶対値 r</label>
              <input type="range" min={0.5} max={3} step={0.25} value={r} onChange={e => setR(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
              <span className="text-sm font-mono text-slate-600">{r}</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">偏角 θ (度)</label>
              <input type="range" min={0} max={350} step={5} value={thetaDeg} onChange={e => setThetaDeg(parseInt(e.target.value))} className="w-full accent-indigo-600" />
              <span className="text-sm font-mono text-slate-600">{thetaDeg}° ({thetaFrac})</span>
            </div>

            {/* Quick angle buttons */}
            <div className="flex flex-wrap gap-1">
              {[0, 30, 45, 60, 90, 120, 150, 180, 270].map(d => (
                <button key={d} onClick={() => setThetaDeg(d)} className={`px-2 py-1 rounded text-[10px] font-bold ${thetaDeg === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {d}°
                </button>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="text-sm font-bold text-slate-700">極形式</div>
              <MathDisplay tex={`z = ${r}(\\cos ${thetaDeg}° + i\\sin ${thetaDeg}°)`} displayMode />
              <div className="border-t border-slate-200 pt-2 space-y-1">
                <MathDisplay tex={`\\text{Re}(z) = r\\cos\\theta = ${re.toFixed(3)}`} />
                <MathDisplay tex={`\\text{Im}(z) = r\\sin\\theta = ${im.toFixed(3)}`} />
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-xs text-indigo-700">
              極形式は r と θ で複素数を表す方法です。乗法では「絶対値は積、偏角は和」になるため、回転の計算に便利です。
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '極形式: z = r(cosθ + i sinθ)。r は絶対値、θ は偏角です。' },
        { step: 2, text: '乗法では「絶対値は積、偏角は和」になるため、回転の計算に極形式が便利です。' },
        { step: 3, text: 'オイラーの公式 e^(iθ) = cosθ + i sinθ を使うと z = re^(iθ) とも書けます。' },
      ]} />
    </div>
  );
}
