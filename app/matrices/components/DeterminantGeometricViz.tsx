"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 400;
const H = 400;
const ORIGIN_X = W / 2;
const ORIGIN_Y = H / 2;
const SCALE = 40;

const DeterminantGeometricViz: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(2);

  const det = a * d - b * c;

  const toSvg = (x: number, y: number): [number, number] => [
    ORIGIN_X + x * SCALE,
    ORIGIN_Y - y * SCALE,
  ];

  // Unit square corners: (0,0), (1,0), (1,1), (0,1)
  const unitSquare = useMemo(() => {
    const pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    return pts.map(([x, y]) => toSvg(x, y));
  }, []);

  // Transformed parallelogram
  const transformed = useMemo(() => {
    const pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    return pts.map(([x, y]) => {
      const tx = a * x + b * y;
      const ty = c * x + d * y;
      return toSvg(tx, ty);
    });
  }, [a, b, c, d]);

  const polygonStr = (pts: number[][]) => pts.map(p => p.join(',')).join(' ');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">行列式の幾何学的意味</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          行列式の絶対値は、単位正方形が変換される平行四辺形の面積に等しい。
        </p>
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
              min={-4}
              max={4}
              step={0.5}
              value={val}
              onChange={e => set(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* SVG */}
      <div className="flex justify-center">
        <svg width={W} height={H} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          {/* Grid lines */}
          {Array.from({ length: 11 }, (_, i) => i - 5).map(i => (
            <g key={`grid-${i}`}>
              <line
                x1={ORIGIN_X + i * SCALE} y1={0}
                x2={ORIGIN_X + i * SCALE} y2={H}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
              />
              <line
                x1={0} y1={ORIGIN_Y - i * SCALE}
                x2={W} y2={ORIGIN_Y - i * SCALE}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
              />
            </g>
          ))}

          {/* Axes */}
          <line x1={0} y1={ORIGIN_Y} x2={W} y2={ORIGIN_Y} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <line x1={ORIGIN_X} y1={0} x2={ORIGIN_X} y2={H} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />

          {/* Unit square */}
          <polygon
            points={polygonStr(unitSquare)}
            fill="rgba(100,116,139,0.15)"
            stroke="rgba(100,116,139,0.5)"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />

          {/* Transformed parallelogram */}
          <polygon
            points={polygonStr(transformed)}
            fill={det >= 0 ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'}
            stroke={det >= 0 ? 'rgba(59,130,246,0.8)' : 'rgba(239,68,68,0.8)'}
            strokeWidth={2}
          />

          {/* Column vectors */}
          <line
            x1={ORIGIN_X} y1={ORIGIN_Y}
            x2={ORIGIN_X + a * SCALE} y2={ORIGIN_Y - c * SCALE}
            stroke="#ef4444" strokeWidth={2.5} markerEnd="url(#arrowRed)"
          />
          <line
            x1={ORIGIN_X} y1={ORIGIN_Y}
            x2={ORIGIN_X + b * SCALE} y2={ORIGIN_Y - d * SCALE}
            stroke="#22c55e" strokeWidth={2.5} markerEnd="url(#arrowGreen)"
          />

          {/* Arrow markers */}
          <defs>
            <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
            </marker>
          </defs>

          {/* Labels */}
          <text x={ORIGIN_X + a * SCALE + 5} y={ORIGIN_Y - c * SCALE - 5} fill="#ef4444" fontSize={12} fontWeight="bold">
            ({a}, {c})
          </text>
          <text x={ORIGIN_X + b * SCALE + 5} y={ORIGIN_Y - d * SCALE - 5} fill="#22c55e" fontSize={12} fontWeight="bold">
            ({b}, {d})
          </text>
        </svg>
      </div>

      {/* Info */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">行列式</div>
          <MathDisplay tex={`\\det A = ${det}`} />
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">面積倍率</div>
          <MathDisplay tex={`|\\det A| = ${Math.abs(det)}`} />
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">向き</div>
          <span className={`text-sm font-bold ${det >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {det > 0 ? '保存' : det < 0 ? '反転' : '退化（面積0）'}
          </span>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '行列式の絶対値 |det A| は、変換後の面積が元の面積の何倍になるかを表します。' },
        { step: 2, text: 'det A > 0 なら向き（回転の方向）が保存され、det A < 0 なら反転します。' },
        { step: 3, text: 'det A = 0 のとき、2次元の領域が1次元（直線）に潰れます（退化）。' },
      ]} />
    </div>
  );
};

export default DeterminantGeometricViz;
