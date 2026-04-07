"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const W = 400;
const H = 400;
const OX = W / 2;
const OY = H / 2;
const S = 60;

const RotationMatrixViz: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState(45);
  const theta = (angleDeg * Math.PI) / 180;

  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const toSvg = (x: number, y: number): [number, number] => [OX + x * S, OY - y * S];

  // Points of a shape (triangle) to rotate
  const originalPoints: [number, number][] = [
    [1, 0],
    [2, 0],
    [1.5, 1],
  ];

  const rotatedPoints = useMemo(() => {
    return originalPoints.map(([x, y]) => {
      const rx = cosT * x - sinT * y;
      const ry = sinT * x + cosT * y;
      return [rx, ry] as [number, number];
    });
  }, [angleDeg]);

  const polygonStr = (pts: [number, number][]) =>
    pts.map(([x, y]) => toSvg(x, y).join(',')).join(' ');

  const fmtAngle = (deg: number) => {
    const special: Record<number, string> = {
      0: '0', 30: '\\frac{\\pi}{6}', 45: '\\frac{\\pi}{4}', 60: '\\frac{\\pi}{3}',
      90: '\\frac{\\pi}{2}', 120: '\\frac{2\\pi}{3}', 135: '\\frac{3\\pi}{4}',
      150: '\\frac{5\\pi}{6}', 180: '\\pi', 270: '\\frac{3\\pi}{2}', 360: '2\\pi',
    };
    return special[deg] || `${deg}°`;
  };

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">回転行列</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          角度を変えると、図形が原点まわりに回転します。
        </p>
      </div>

      {/* Angle slider */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
          <MathDisplay tex={`\\theta = ${angleDeg}°`} />
        </label>
        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={angleDeg}
          onChange={e => setAngleDeg(Number(e.target.value))}
          className="w-72 accent-blue-600"
        />
      </div>

      {/* SVG */}
      <div className="flex justify-center">
        <svg width={W} height={H} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          {/* Grid */}
          {[-3, -2, -1, 0, 1, 2, 3].map(i => (
            <g key={`g-${i}`}>
              <line
                x1={OX + i * S} y1={0} x2={OX + i * S} y2={H}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
              />
              <line
                x1={0} y1={OY - i * S} x2={W} y2={OY - i * S}
                stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
              />
            </g>
          ))}

          {/* Axes */}
          <line x1={0} y1={OY} x2={W} y2={OY} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <line x1={OX} y1={0} x2={OX} y2={H} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />

          {/* Unit circle */}
          <circle cx={OX} cy={OY} r={S} fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth={1} strokeDasharray="4 3" />

          {/* Original triangle */}
          <polygon
            points={polygonStr(originalPoints)}
            fill="rgba(148,163,184,0.2)"
            stroke="rgba(148,163,184,0.6)"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />

          {/* Rotated triangle */}
          <polygon
            points={polygonStr(rotatedPoints)}
            fill="rgba(59,130,246,0.25)"
            stroke="rgba(59,130,246,0.8)"
            strokeWidth={2}
          />

          {/* Angle arc */}
          {angleDeg > 0 && angleDeg < 360 && (
            <path
              d={`M ${OX + 25} ${OY} A 25 25 0 ${angleDeg > 180 ? 1 : 0} 0 ${OX + 25 * cosT} ${OY - 25 * sinT}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          )}

          {/* Basis vector rotated */}
          <line
            x1={OX} y1={OY}
            x2={OX + cosT * S} y2={OY - sinT * S}
            stroke="#ef4444" strokeWidth={2}
          />
          <circle cx={OX + cosT * S} cy={OY - sinT * S} r={4} fill="#ef4444" />

          {/* Origin */}
          <circle cx={OX} cy={OY} r={3} fill="#1e293b" className="dark:fill-white" />
        </svg>
      </div>

      {/* Matrix */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center space-y-2">
        <MathDisplay
          tex={`R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}`}
          displayMode
        />
        <MathDisplay
          tex={`= \\begin{pmatrix} ${round2(cosT)} & ${round2(-sinT)} \\\\ ${round2(sinT)} & ${round2(cosT)} \\end{pmatrix}`}
          displayMode
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">
          <MathDisplay tex={`\\det R(\\theta) = \\cos^2\\theta + \\sin^2\\theta = 1`} /> （面積が保存される）
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '回転行列 R(θ) = [[cosθ, -sinθ], [sinθ, cosθ]] は原点中心に角度 θ だけ回転する変換です。' },
        { step: 2, text: 'det R(θ) = cos²θ + sin²θ = 1 なので、面積は保存されます（回転は等長変換）。' },
        { step: 3, text: 'R(α)R(β) = R(α+β) が成り立ちます。回転の合成は角度の和になります。' },
      ]} />
    </div>
  );
};

export default RotationMatrixViz;
