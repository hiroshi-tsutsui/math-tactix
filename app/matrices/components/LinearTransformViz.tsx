"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

const W = 420;
const H = 420;
const OX = W / 2;
const OY = H / 2;
const S = 40; // scale pixels per unit

const LinearTransformViz: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);

  const det = a * d - b * c;

  const toSvg = (x: number, y: number): [number, number] => [OX + x * S, OY - y * S];

  const transformPoint = (x: number, y: number) => ({
    x: a * x + b * y,
    y: c * x + d * y,
  });

  // Grid range
  const range = [-3, -2, -1, 0, 1, 2, 3];

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; original: boolean }[] = [];
    // Vertical lines (constant x)
    for (const x of range) {
      // Original
      lines.push({ x1: x, y1: -3, x2: x, y2: 3, original: true });
      // Transformed
      const p1 = transformPoint(x, -3);
      const p2 = transformPoint(x, 3);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, original: false });
    }
    // Horizontal lines (constant y)
    for (const y of range) {
      lines.push({ x1: -3, y1: y, x2: 3, y2: y, original: true });
      const p1 = transformPoint(-3, y);
      const p2 = transformPoint(3, y);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, original: false });
    }
    return lines;
  }, [a, b, c, d]);

  // Grid points
  const gridPoints = useMemo(() => {
    const pts: { ox: number; oy: number; tx: number; ty: number }[] = [];
    for (const x of range) {
      for (const y of range) {
        const t = transformPoint(x, y);
        pts.push({ ox: x, oy: y, tx: t.x, ty: t.y });
      }
    }
    return pts;
  }, [a, b, c, d]);

  // Basis vectors
  const e1 = transformPoint(1, 0);
  const e2 = transformPoint(0, 1);

  // Preset buttons
  const presets: { name: string; mat: [number, number, number, number] }[] = [
    { name: '単位', mat: [1, 0, 0, 1] },
    { name: '90° 回転', mat: [0, -1, 1, 0] },
    { name: 'X拡大', mat: [2, 0, 0, 1] },
    { name: '剪断', mat: [1, 1, 0, 1] },
    { name: '反射(y=x)', mat: [0, 1, 1, 0] },
    { name: '反射(x軸)', mat: [1, 0, 0, -1] },
  ];

  const applyPreset = (mat: [number, number, number, number]) => {
    setA(mat[0]); setB(mat[1]); setC(mat[2]); setD(mat[3]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">線形変換の可視化</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          行列でグリッドがどう変形するか観察しましょう。スライダーで要素を変更できます。
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map(p => (
          <button
            key={p.name}
            onClick={() => applyPreset(p.mat)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {[
          { label: 'a', val: a, set: setA },
          { label: 'b', val: b, set: setB },
          { label: 'c', val: c, set: setC },
          { label: 'd', val: d, set: setD },
        ].map(({ label, val, set }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-slate-500">{label} = {val}</span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.25}
              value={val}
              onChange={e => set(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="flex justify-center">
        <svg width={W} height={H} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {/* Original grid (grey, dashed) */}
          {gridLines
            .filter(l => l.original)
            .map((l, i) => {
              const [sx, sy] = toSvg(l.x1, l.y1);
              const [ex, ey] = toSvg(l.x2, l.y2);
              return (
                <line
                  key={`og-${i}`}
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke="rgba(148,163,184,0.3)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              );
            })}

          {/* Transformed grid (blue) */}
          {gridLines
            .filter(l => !l.original)
            .map((l, i) => {
              const [sx, sy] = toSvg(l.x1, l.y1);
              const [ex, ey] = toSvg(l.x2, l.y2);
              return (
                <line
                  key={`tg-${i}`}
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke="rgba(59,130,246,0.35)"
                  strokeWidth={1}
                />
              );
            })}

          {/* Original grid points (grey) */}
          {gridPoints.map((p, i) => {
            const [sx, sy] = toSvg(p.ox, p.oy);
            return (
              <circle key={`op-${i}`} cx={sx} cy={sy} r={2} fill="rgba(148,163,184,0.4)" />
            );
          })}

          {/* Transformed grid points (blue) */}
          {gridPoints.map((p, i) => {
            const [sx, sy] = toSvg(p.tx, p.ty);
            return (
              <circle key={`tp-${i}`} cx={sx} cy={sy} r={3} fill="rgba(59,130,246,0.7)" />
            );
          })}

          {/* Basis vector e1 transformed */}
          {(() => {
            const [ex1, ey1] = toSvg(e1.x, e1.y);
            return (
              <>
                <line x1={OX} y1={OY} x2={ex1} y2={ey1} stroke="#ef4444" strokeWidth={3} />
                <circle cx={ex1} cy={ey1} r={5} fill="#ef4444" />
              </>
            );
          })()}

          {/* Basis vector e2 transformed */}
          {(() => {
            const [ex2, ey2] = toSvg(e2.x, e2.y);
            return (
              <>
                <line x1={OX} y1={OY} x2={ex2} y2={ey2} stroke="#22c55e" strokeWidth={3} />
                <circle cx={ex2} cy={ey2} r={5} fill="#22c55e" />
              </>
            );
          })()}

          {/* Origin */}
          <circle cx={OX} cy={OY} r={4} fill="#1e293b" className="dark:fill-white" />
        </svg>
      </div>

      {/* Matrix display */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-2">
        <MathDisplay
          tex={`T = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\quad \\det T = ${det}`}
          displayMode
        />
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-red-500 font-bold">
            <MathDisplay tex={`T\\mathbf{e}_1 = (${e1.x},\\, ${e1.y})`} />
          </span>
          <span className="text-green-500 font-bold">
            <MathDisplay tex={`T\\mathbf{e}_2 = (${e2.x},\\, ${e2.y})`} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinearTransformViz;
