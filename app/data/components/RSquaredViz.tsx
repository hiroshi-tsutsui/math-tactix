"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

/* ── KaTeX helpers ── */
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
    sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x;
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

function computeTSS(pts: DataPoint[]): number {
  const n = pts.length;
  if (n === 0) return 0;
  const yMean = pts.reduce((s, p) => s + p.y, 0) / n;
  return pts.reduce((sum, p) => sum + (p.y - yMean) * (p.y - yMean), 0);
}

function computeRSquared(pts: DataPoint[], slope: number, intercept: number): number {
  const tss = computeTSS(pts);
  if (tss === 0) return 1;
  const rss = computeRSS(pts, slope, intercept);
  return 1 - rss / tss;
}

/* ── datasets ── */
interface DataSet {
  label: string;
  desc: string;
  points: DataPoint[];
}

const DATA_SETS: DataSet[] = [
  {
    label: "強い相関",
    desc: "データ点が回帰直線の近くに集まっています",
    points: [
      { x: 1, y: 2.1 }, { x: 2, y: 3.9 }, { x: 3, y: 5.8 },
      { x: 4, y: 8.1 }, { x: 5, y: 9.9 }, { x: 6, y: 12.2 },
      { x: 7, y: 13.8 }, { x: 8, y: 16.1 },
    ],
  },
  {
    label: "弱い相関",
    desc: "データ点が回帰直線からばらついています",
    points: [
      { x: 1, y: 3.0 }, { x: 2, y: 5.5 }, { x: 3, y: 4.0 },
      { x: 4, y: 9.0 }, { x: 5, y: 7.0 }, { x: 6, y: 11.5 },
      { x: 7, y: 8.5 }, { x: 8, y: 14.0 },
    ],
  },
  {
    label: "無相関",
    desc: "データ点がランダムに散らばっています",
    points: [
      { x: 1, y: 8.0 }, { x: 2, y: 3.0 }, { x: 3, y: 12.0 },
      { x: 4, y: 5.0 }, { x: 5, y: 10.0 }, { x: 6, y: 4.0 },
      { x: 7, y: 11.0 }, { x: 8, y: 6.0 },
    ],
  },
];

/* ── SVG constants ── */
const W = 520;
const H = 360;
const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

/* ── Component ── */
export default function RSquaredViz({ onComplete }: { onComplete?: () => void }) {
  const [dataIdx, setDataIdx] = useState(0);
  const points = DATA_SETS[dataIdx].points;

  const { slope, intercept } = useMemo(() => leastSquares(points), [points]);
  const rss = useMemo(() => computeRSS(points, slope, intercept), [points, slope, intercept]);
  const tss = useMemo(() => computeTSS(points), [points]);
  const rSquared = useMemo(() => computeRSquared(points, slope, intercept), [points, slope, intercept]);
  const yMean = useMemo(() => points.reduce((s, p) => s + p.y, 0) / points.length, [points]);

  // scale helpers
  const xMin = 0, xMax = 9;
  const allY = points.map((p) => p.y);
  const yMin = Math.floor(Math.min(...allY, 0));
  const yMax = Math.ceil(Math.max(...allY) + 2);

  const sx = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PW;
  const sy = (y: number) => PAD.top + PH - ((y - yMin) / (yMax - yMin)) * PH;

  // R^2 gauge color
  const gaugeColor = rSquared >= 0.8 ? "#22c55e" : rSquared >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-6">
      {/* Dataset switcher */}
      <div className="flex gap-2 flex-wrap">
        {DATA_SETS.map((ds, i) => (
          <button
            key={i}
            onClick={() => setDataIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              dataIdx === i
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {ds.label}
          </button>
        ))}
      </div>

      {/* SVG scatter + regression */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-slate-100 rounded-xl bg-white">
        {/* Grid lines */}
        {Array.from({ length: 10 }, (_, i) => i).map((i) => (
          <line key={`gx-${i}`} x1={sx(i)} y1={PAD.top} x2={sx(i)} y2={PAD.top + PH} stroke="#f1f5f9" strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(yMax - yMin) + 1 }, (_, i) => yMin + i).map((v) => (
          <line key={`gy-${v}`} x1={PAD.left} y1={sy(v)} x2={PAD.left + PW} y2={sy(v)} stroke="#f1f5f9" strokeWidth={1} />
        ))}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top + PH} x2={PAD.left + PW} y2={PAD.top + PH} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + PH} stroke="#94a3b8" strokeWidth={1.5} />

        {/* Axis labels */}
        {Array.from({ length: 9 }, (_, i) => i + 1).map((v) => (
          <text key={`xl-${v}`} x={sx(v)} y={PAD.top + PH + 20} textAnchor="middle" fill="#94a3b8" fontSize={11}>
            {v}
          </text>
        ))}
        {Array.from({ length: Math.ceil((yMax - yMin) / 2) + 1 }, (_, i) => yMin + i * 2).map((v) => (
          <text key={`yl-${v}`} x={PAD.left - 10} y={sy(v) + 4} textAnchor="end" fill="#94a3b8" fontSize={11}>
            {v}
          </text>
        ))}

        {/* y-mean line */}
        <line x1={PAD.left} y1={sy(yMean)} x2={PAD.left + PW} y2={sy(yMean)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4" />
        <text x={PAD.left + PW + 2} y={sy(yMean) + 4} fill="#94a3b8" fontSize={10}>
          y&#x0304;
        </text>

        {/* TSS: vertical lines from each point to y-mean (light) */}
        {points.map((p, i) => (
          <line
            key={`tss-${i}`}
            x1={sx(p.x)}
            y1={sy(p.y)}
            x2={sx(p.x)}
            y2={sy(yMean)}
            stroke="#fbbf24"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            opacity={0.5}
          />
        ))}

        {/* RSS: vertical lines from each point to regression line */}
        {points.map((p, i) => {
          const yHat = slope * p.x + intercept;
          return (
            <line
              key={`rss-${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(p.x)}
              y2={sy(yHat)}
              stroke="#ef4444"
              strokeWidth={2}
              opacity={0.6}
            />
          );
        })}

        {/* Regression line */}
        <line
          x1={sx(xMin)}
          y1={sy(slope * xMin + intercept)}
          x2={sx(xMax)}
          y2={sy(slope * xMax + intercept)}
          stroke="#3b82f6"
          strokeWidth={2.5}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={`p-${i}`} cx={sx(p.x)} cy={sy(p.y)} r={5} fill="#3b82f6" stroke="#fff" strokeWidth={1.5} />
        ))}

        {/* Legend */}
        <line x1={PAD.left + 10} y1={PAD.top + 10} x2={PAD.left + 30} y2={PAD.top + 10} stroke="#ef4444" strokeWidth={2} />
        <text x={PAD.left + 34} y={PAD.top + 14} fill="#ef4444" fontSize={10}>RSS (残差)</text>
        <line x1={PAD.left + 10} y1={PAD.top + 26} x2={PAD.left + 30} y2={PAD.top + 26} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={PAD.left + 34} y={PAD.top + 30} fill="#fbbf24" fontSize={10}>TSS (全変動)</text>
      </svg>

      {/* R^2 gauge */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-700">
            <K tex="R^2" /> = {rSquared.toFixed(4)}
          </span>
          <span className="text-xs text-slate-400">0 (説明力なし) ~ 1 (完全説明)</span>
        </div>
        <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, rSquared * 100))}%`,
              backgroundColor: gaugeColor,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0</span>
          <span>0.5</span>
          <span>1</span>
        </div>
      </div>

      {/* Calculation details */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
        <div className="text-xs font-bold text-slate-400 mb-2">計算の内訳</div>
        <div className="text-center">
          <KBlock tex={`R^2 = 1 - \\frac{\\text{RSS}}{\\text{TSS}} = 1 - \\frac{${rss.toFixed(2)}}{${tss.toFixed(2)}} = ${rSquared.toFixed(4)}`} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-red-500 font-bold mb-1">RSS (残差の二乗和)</div>
            <div className="font-mono">{rss.toFixed(2)}</div>
            <div className="text-slate-400 mt-1">
              <K tex="\sum(y_i - \hat{y}_i)^2" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-amber-500 font-bold mb-1">TSS (全変動の二乗和)</div>
            <div className="font-mono">{tss.toFixed(2)}</div>
            <div className="text-slate-400 mt-1">
              <K tex="\sum(y_i - \bar{y})^2" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed">
        <span className="font-bold">
          <K tex={`R^2 = ${rSquared.toFixed(2)}`} />
        </span>
        {" "}ということは、データの変動のうち{" "}
        <span className="font-bold">{(rSquared * 100).toFixed(1)}%</span>{" "}
        が回帰直線で説明でき、残りの{" "}
        <span className="font-bold">{((1 - rSquared) * 100).toFixed(1)}%</span>{" "}
        は説明できない変動（誤差）です。
      </div>

      {/* Current dataset info */}
      <div className="text-xs text-slate-400 text-center">
        データセット: <span className="font-bold text-slate-600">{DATA_SETS[dataIdx].label}</span> - {DATA_SETS[dataIdx].desc}
      </div>

      <HintButton hints={[
        { step: 1, text: "R² = 1 - (残差平方和/全変動) で、0〜1の値を取ります" },
        { step: 2, text: "R² が 1 に近いほど回帰直線がデータをよく説明しています" },
        { step: 3, text: "R² = r²（相関係数の2乗）という関係が成り立ちます" },
      ]} />
    </div>
  );
}
