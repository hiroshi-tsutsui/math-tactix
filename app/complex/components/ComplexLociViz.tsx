"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const W = 440, H = 440;
const OX = W / 2, OY = H / 2, S = 55;

function toSVG(a: number, b: number) {
  return { x: OX + a * S, y: OY - b * S };
}

interface LocusType {
  name: string;
  tex: string;
  description: string;
  params: Array<{ name: string; min: number; max: number; step: number; defaultVal: number }>;
  render: (params: number[], ctx: { W: number; H: number; OX: number; OY: number; S: number; toSVG: (a: number, b: number) => { x: number; y: number } }) => React.ReactElement;
}

export default function ComplexLociViz() {
  const [locusIdx, setLocusIdx] = useState(0);
  const [params, setParams] = useState<number[]>([1, 0, 2]);

  const loci: LocusType[] = useMemo(() => [
    {
      name: '|z - a| = r (円)',
      tex: '|z - a| = r',
      description: '中心 a, 半径 r の円。|z - a| は z から a までの距離を表します。',
      params: [
        { name: 'a (Re)', min: -2, max: 2, step: 0.5, defaultVal: 1 },
        { name: 'a (Im)', min: -2, max: 2, step: 0.5, defaultVal: 0 },
        { name: 'r', min: 0.5, max: 3, step: 0.25, defaultVal: 2 }
      ],
      render: (p) => {
        const center = toSVG(p[0], p[1]);
        return (
          <g>
            <circle cx={center.x} cy={center.y} r={p[2] * S} fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth={2.5} />
            <circle cx={center.x} cy={center.y} r={4} fill="#ef4444" />
            <text x={center.x + 8} y={center.y - 8} fontSize={11} fontWeight="bold" fill="#ef4444">a</text>
          </g>
        );
      }
    },
    {
      name: '|z - a| = |z - b| (垂直二等分線)',
      tex: '|z - a| = |z - b|',
      description: 'a と b からの距離が等しい点の軌跡は、線分 ab の垂直二等分線です。',
      params: [
        { name: 'a (Re)', min: -2, max: 2, step: 0.5, defaultVal: -1 },
        { name: 'a (Im)', min: -2, max: 2, step: 0.5, defaultVal: 0 },
        { name: 'b (Re)', min: -2, max: 2, step: 0.5, defaultVal: 2 }
      ],
      render: (p) => {
        const pA = toSVG(p[0], p[1]);
        const bIm = 0;
        const pB = toSVG(p[2], bIm);
        // Perpendicular bisector: midpoint and perpendicular direction
        const midX = (p[0] + p[2]) / 2;
        const midY = (p[1] + bIm) / 2;
        const dx = p[2] - p[0];
        const dy = bIm - p[1];
        // Perpendicular direction: (-dy, dx)
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.01) return <g />;
        const nx = -dy / len;
        const ny = dx / len;
        const ext = 5;
        const l1 = toSVG(midX - nx * ext, midY - ny * ext);
        const l2 = toSVG(midX + nx * ext, midY + ny * ext);
        return (
          <g>
            <line x1={l1.x} y1={l1.y} x2={l2.x} y2={l2.y} stroke="#3b82f6" strokeWidth={2.5} />
            <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
            <circle cx={pA.x} cy={pA.y} r={5} fill="#ef4444" />
            <text x={pA.x + 8} y={pA.y - 8} fontSize={11} fontWeight="bold" fill="#ef4444">a</text>
            <circle cx={pB.x} cy={pB.y} r={5} fill="#10b981" />
            <text x={pB.x + 8} y={pB.y - 8} fontSize={11} fontWeight="bold" fill="#10b981">b</text>
          </g>
        );
      }
    },
    {
      name: 'arg(z) = θ (半直線)',
      tex: '\\arg(z) = \\theta',
      description: '偏角が一定の点の軌跡は、原点から出る半直線です。',
      params: [
        { name: 'θ (度)', min: 0, max: 350, step: 10, defaultVal: 45 },
        { name: '(unused)', min: 0, max: 1, step: 1, defaultVal: 0 },
        { name: '(unused)', min: 0, max: 1, step: 1, defaultVal: 0 }
      ],
      render: (p) => {
        const thetaRad = p[0] * Math.PI / 180;
        const endX = OX + 4 * S * Math.cos(thetaRad);
        const endY = OY - 4 * S * Math.sin(thetaRad);
        return (
          <g>
            <line x1={OX} y1={OY} x2={endX} y2={endY} stroke="#3b82f6" strokeWidth={2.5} />
            <text x={endX + 5} y={endY - 5} fontSize={11} fontWeight="bold" fill="#3b82f6">θ = {p[0]}°</text>
          </g>
        );
      }
    }
  ], []);

  const locus = loci[locusIdx];

  // Reset params when switching loci
  const handleSwitch = (idx: number) => {
    setLocusIdx(idx);
    setParams(loci[idx].params.map(p => p.defaultVal));
  };

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
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          複素数の軌跡
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {loci.map((l, i) => (
            <button key={i} onClick={() => handleSwitch(i)} className={`px-3 py-2 rounded-lg text-sm font-bold transition ${locusIdx === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {l.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <svg width={W} height={H} className="bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
            {gridLines}
            <line x1={0} y1={OY} x2={W} y2={OY} stroke="#64748b" strokeWidth={1.5} />
            <line x1={OX} y1={0} x2={OX} y2={H} stroke="#64748b" strokeWidth={1.5} />
            <text x={W - 16} y={OY - 6} fontSize={12} fill="#64748b" fontWeight="bold">Re</text>
            <text x={OX + 8} y={16} fontSize={12} fill="#64748b" fontWeight="bold">Im</text>

            {locus.render(params, { W, H, OX, OY, S, toSVG })}
          </svg>

          <div className="space-y-4 flex-1 min-w-[200px]">
            <div className="bg-slate-900 rounded-xl p-4 text-center">
              <MathDisplay tex={locus.tex} displayMode className="text-white" />
            </div>

            {locus.params.filter(p => !p.name.startsWith('(unused')).map((p, i) => (
              <div key={i}>
                <label className="text-xs font-bold text-slate-400 block mb-1">{p.name}</label>
                <input type="range" min={p.min} max={p.max} step={p.step} value={params[i]} onChange={e => {
                  const newP = [...params];
                  newP[i] = parseFloat(e.target.value);
                  setParams(newP);
                }} className="w-full accent-emerald-600" />
                <span className="text-sm font-mono text-slate-600">{params[i]}</span>
              </div>
            ))}

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-xs text-emerald-700">
              <p>{locus.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
