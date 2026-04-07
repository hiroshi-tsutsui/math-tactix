"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

/* ── tiny KaTeX helpers ── */
const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
  }, [tex]);
  return <span ref={ref} />;
};
const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
  }, [tex]);
  return <div ref={ref} />;
};

/* ── types ── */
interface DataPoint {
  x: number;
  y: number;
}

/* ── helpers ── */
function leastSquares(pts: DataPoint[]): { slope: number; intercept: number } {
  const n = pts.length;
  if (n < 2) return { slope: 0, intercept: 0 };
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
    sxy += p.x * p.y;
    sx2 += p.x * p.x;
  }
  const denom = n * sx2 - sx * sx;
  if (denom === 0) return { slope: 0, intercept: sy / n };
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

function computeRSS(pts: DataPoint[], slope: number, intercept: number): number {
  return pts.reduce((sum, p) => {
    const residual = p.y - (slope * p.x + intercept);
    return sum + residual * residual;
  }, 0);
}

/* ── sample data sets ── */
const DATA_SETS: { label: string; points: DataPoint[] }[] = [
  {
    label: "基本（正の相関）",
    points: [
      { x: 1, y: 2.2 }, { x: 2, y: 3.8 }, { x: 3, y: 4.5 },
      { x: 4, y: 5.1 }, { x: 5, y: 7.0 }, { x: 6, y: 7.8 },
      { x: 7, y: 9.2 }, { x: 8, y: 8.5 },
    ],
  },
  {
    label: "ばらつき大",
    points: [
      { x: 1, y: 5.0 }, { x: 2, y: 2.5 }, { x: 3, y: 6.0 },
      { x: 4, y: 3.5 }, { x: 5, y: 7.5 }, { x: 6, y: 4.0 },
      { x: 7, y: 8.0 }, { x: 8, y: 5.5 },
    ],
  },
  {
    label: "負の相関",
    points: [
      { x: 1, y: 9.0 }, { x: 2, y: 7.5 }, { x: 3, y: 7.0 },
      { x: 4, y: 5.8 }, { x: 5, y: 5.0 }, { x: 6, y: 3.5 },
      { x: 7, y: 2.8 }, { x: 8, y: 1.5 },
    ],
  },
];

/* ── SVG constants ── */
const W = 520;
const H = 360;
const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

export default function ResidualViz({ onComplete }: { onComplete?: () => void }) {
  const [dataIdx, setDataIdx] = useState(0);
  const points = DATA_SETS[dataIdx].points;
  const optimal = useMemo(() => leastSquares(points), [points]);

  const [slope, setSlope] = useState(optimal.slope);
  const [intercept, setIntercept] = useState(optimal.intercept);
  const [completed, setCompleted] = useState(false);

  // reset when dataset changes
  const prevIdx = useRef(dataIdx);
  useEffect(() => {
    if (prevIdx.current !== dataIdx) {
      prevIdx.current = dataIdx;
      setSlope(optimal.slope);
      setIntercept(optimal.intercept);
      setCompleted(false);
    }
  }, [dataIdx, optimal]);

  const rss = useMemo(() => computeRSS(points, slope, intercept), [points, slope, intercept]);
  const optimalRSS = useMemo(() => computeRSS(points, optimal.slope, optimal.intercept), [points, optimal]);

  // scale helpers
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs) - 1;
  const xMax = Math.max(...xs) + 1;
  const yMin = Math.min(...ys, 0) - 1;
  const yMax = Math.max(...ys) + 2;
  const sx = useCallback((x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PW, [xMin, xMax]);
  const sy = useCallback((y: number) => PAD.top + PH - ((y - yMin) / (yMax - yMin)) * PH, [yMin, yMax]);

  const resetToOptimal = () => {
    setSlope(optimal.slope);
    setIntercept(optimal.intercept);
    if (!completed) {
      setCompleted(true);
      onComplete?.();
    }
  };

  // grid lines
  const xTicks: number[] = [];
  for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) xTicks.push(v);
  const yTicks: number[] = [];
  for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v++) yTicks.push(v);

  // regression line endpoints in data coords
  const lineX0 = xMin;
  const lineX1 = xMax;
  const lineY0 = slope * lineX0 + intercept;
  const lineY1 = slope * lineX1 + intercept;

  const isNearOptimal = Math.abs(rss - optimalRSS) < 0.05;

  return (
    <div className="p-4 space-y-4">
      {/* dataset selector */}
      <div className="flex gap-2 flex-wrap">
        {DATA_SETS.map((ds, i) => (
          <button
            key={i}
            onClick={() => setDataIdx(i)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
              dataIdx === i
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {ds.label}
          </button>
        ))}
      </div>

      {/* SVG scatter + regression + residuals */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-slate-200 rounded-lg bg-white">
        {/* grid */}
        {xTicks.map((v) => (
          <g key={`gx${v}`}>
            <line x1={sx(v)} y1={PAD.top} x2={sx(v)} y2={H - PAD.bottom} stroke="#f1f5f9" strokeWidth={1} />
            <text x={sx(v)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{v}</text>
          </g>
        ))}
        {yTicks.map((v) => (
          <g key={`gy${v}`}>
            <line x1={PAD.left} y1={sy(v)} x2={W - PAD.right} y2={sy(v)} stroke="#f1f5f9" strokeWidth={1} />
            <text x={PAD.left - 8} y={sy(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>
          </g>
        ))}

        {/* regression line */}
        <line
          x1={sx(lineX0)} y1={sy(lineY0)}
          x2={sx(lineX1)} y2={sy(lineY1)}
          stroke="#3b82f6" strokeWidth={2}
        />

        {/* residual lines */}
        {points.map((p, i) => {
          const predicted = slope * p.x + intercept;
          const residual = p.y - predicted;
          const color = residual >= 0 ? "#ef4444" : "#3b82f6";
          return (
            <line
              key={`r${i}`}
              x1={sx(p.x)} y1={sy(p.y)}
              x2={sx(p.x)} y2={sy(predicted)}
              stroke={color} strokeWidth={2} strokeDasharray="4 2" opacity={0.7}
            />
          );
        })}

        {/* data points */}
        {points.map((p, i) => (
          <circle key={`p${i}`} cx={sx(p.x)} cy={sy(p.y)} r={5} fill="#1e40af" stroke="#fff" strokeWidth={1.5} />
        ))}

        {/* axis labels */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#64748b">x</text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90, 12, ${H / 2})`}>y</text>
      </svg>

      {/* sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>傾き (slope)</span>
            <span className="font-mono text-blue-600">{slope.toFixed(3)}</span>
          </label>
          <input
            type="range" min={-3} max={3} step={0.01} value={slope}
            onChange={(e) => setSlope(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>切片 (intercept)</span>
            <span className="font-mono text-blue-600">{intercept.toFixed(3)}</span>
          </label>
          <input
            type="range" min={-5} max={15} step={0.01} value={intercept}
            onChange={(e) => setIntercept(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* RSS display */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">残差の二乗和 (RSS)</span>
          <span className={`font-mono text-lg font-bold ${isNearOptimal ? "text-green-600" : "text-orange-600"}`}>
            {rss.toFixed(3)}
          </span>
        </div>
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>最小二乗法のRSS (最適値)</span>
            <span className="font-mono text-green-600">{optimalRSS.toFixed(3)}</span>
          </div>
        </div>
        <div className="pt-2">
          <KBlock tex={`\\text{RSS} = \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2 = \\sum_{i=1}^{n}(y_i - (${slope.toFixed(2)}x_i + ${intercept.toFixed(2)}))^2 = ${rss.toFixed(3)}`} />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-block w-3 h-3 bg-red-400 rounded-sm" /> 正の残差 (実測 &gt; 予測)
          <span className="inline-block w-3 h-3 bg-blue-400 rounded-sm ml-3" /> 負の残差 (実測 &lt; 予測)
        </div>
      </div>

      {/* optimal button */}
      <button
        onClick={resetToOptimal}
        className="w-full py-2 rounded-lg font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors"
      >
        最適な回帰直線に戻す（最小二乗法）
      </button>

      {/* formula */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
        <KBlock tex={`\\hat{y} = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`} />
      </div>

      <HintButton hints={[
        { step: 1, text: "残差 = 実測値 - 予測値（回帰直線上の値）です" },
        { step: 2, text: "最小二乗法は残差の2乗和を最小にする直線を求める方法です" },
        { step: 3, text: "残差が正なら実測値が予測より大きく、負なら予測より小さいことを示します" },
      ]} />
    </div>
  );
}
