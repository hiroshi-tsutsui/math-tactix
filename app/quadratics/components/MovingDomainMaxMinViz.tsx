"use client";

import React, { useState, useMemo, useCallback } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";

/* ── SVG constants ── */
const W = 560;
const H = 380;
const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

/* ── Coefficient presets ── */
interface Preset {
  label: string;
  a: number;
  b: number;
  c: number;
  d: number; // domain width
}

const PRESETS: Preset[] = [
  { label: "y = x² − 4x + 5 (d=3)", a: 1, b: -4, c: 5, d: 3 },
  { label: "y = −x² + 2x + 3 (d=2)", a: -1, b: 2, c: 3, d: 2 },
  { label: "y = 2x² − 8x + 6 (d=2)", a: 2, b: -8, c: 6, d: 2 },
  { label: "y = −x² + 6x − 5 (d=4)", a: -1, b: 6, c: -5, d: 4 },
];

export default function MovingDomainMaxMinViz() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [m, setM] = useState(-2);

  const preset = PRESETS[presetIdx];
  const { a, b, c, d } = preset;

  // vertex x-coordinate
  const vertexX = useMemo(() => (a !== 0 ? -b / (2 * a) : 0), [a, b]);
  const f = useCallback((x: number) => a * x * x + b * x + c, [a, b, c]);

  // domain bounds
  const domLeft = m;
  const domRight = m + d;

  // find min/max on [domLeft, domRight]
  const { minVal, minX, maxVal, maxX, caseLabel } = useMemo(() => {
    const fLeft = f(domLeft);
    const fRight = f(domRight);

    // Check if vertex is inside domain
    const vertexInDomain = vertexX >= domLeft && vertexX <= domRight;
    const fVertex = f(vertexX);

    let minV: number, minXv: number, maxV: number, maxXv: number;
    let label: string;

    if (a > 0) {
      // upward parabola
      if (vertexInDomain) {
        // case 1: vertex inside → min = vertex, max = farther endpoint
        minV = fVertex;
        minXv = vertexX;
        maxV = Math.max(fLeft, fRight);
        maxXv = fLeft >= fRight ? domLeft : domRight;
        label = "頂点が定義域内 → 最小値 = 頂点";
      } else if (vertexX < domLeft) {
        // case 2: vertex left of domain → min = left end, max = right end
        minV = fLeft;
        minXv = domLeft;
        maxV = fRight;
        maxXv = domRight;
        label = "頂点が左外 → 右端で最大、左端で最小";
      } else {
        // case 3: vertex right of domain → min = right end, max = left end
        minV = fRight;
        minXv = domRight;
        maxV = fLeft;
        maxXv = domLeft;
        label = "頂点が右外 → 左端で最大、右端で最小";
      }
    } else {
      // downward parabola (a < 0)
      if (vertexInDomain) {
        maxV = fVertex;
        maxXv = vertexX;
        minV = Math.min(fLeft, fRight);
        minXv = fLeft <= fRight ? domLeft : domRight;
        label = "頂点が定義域内 → 最大値 = 頂点";
      } else if (vertexX < domLeft) {
        maxV = fLeft;
        maxXv = domLeft;
        minV = fRight;
        minXv = domRight;
        label = "頂点が左外 → 左端で最大、右端で最小";
      } else {
        maxV = fRight;
        maxXv = domRight;
        minV = fLeft;
        minXv = domLeft;
        label = "頂点が右外 → 右端で最大、左端で最小";
      }
    }

    return { minVal: minV, minX: minXv, maxVal: maxV, maxX: maxXv, caseLabel: label };
  }, [a, f, vertexX, domLeft, domRight]);

  // dynamic viewport
  const xRange = 12;
  const xCenter = vertexX;
  const xMin = xCenter - xRange / 2;
  const xMax = xCenter + xRange / 2;

  const { yMin, yMax } = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = f(x);
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }
    lo = Math.min(lo, -1);
    hi = Math.max(hi, 1);
    const pad = (hi - lo) * 0.12;
    return { yMin: lo - pad, yMax: hi + pad };
  }, [f, xMin, xMax]);

  const sx = useCallback((x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PW, [xMin, xMax]);
  const sy = useCallback((y: number) => PAD.top + PH - ((y - yMin) / (yMax - yMin)) * PH, [yMin, yMax]);

  // parabola path (full curve in viewport)
  const fullPath = useMemo(() => {
    const pts: string[] = [];
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [f, sx, sy, xMin, xMax]);

  // domain path (portion on the domain)
  const domainPath = useMemo(() => {
    const pts: string[] = [];
    const clampedLeft = Math.max(domLeft, xMin);
    const clampedRight = Math.min(domRight, xMax);
    if (clampedLeft >= clampedRight) return "";
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = clampedLeft + (i / steps) * (clampedRight - clampedLeft);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [f, sx, sy, domLeft, domRight, xMin, xMax]);

  // grid lines
  const gridXLines = useMemo(() => {
    const lines: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) lines.push(x);
    return lines;
  }, [xMin, xMax]);

  const gridYLines = useMemo(() => {
    const lines: number[] = [];
    const step = Math.max(1, Math.round((yMax - yMin) / 8));
    for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) lines.push(y);
    return lines;
  }, [yMin, yMax]);

  // format number
  const fmt = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(2);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          二次関数の最大値・最小値（定義域が動く場合）
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          定義域 [m, m+d] をスライダーで動かし、頂点と定義域の位置関係で最大値・最小値がどう変化するかを観察します。
        </p>

        {/* Preset selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => { setPresetIdx(i); setM(-2); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                presetIdx === i
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* SVG Graph */}
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px] mx-auto" style={{ minWidth: 400 }}>
            {/* grid */}
            {gridXLines.map((x) => (
              <g key={`gx${x}`}>
                <line x1={sx(x)} y1={PAD.top} x2={sx(x)} y2={PAD.top + PH} stroke="#e2e8f0" strokeWidth={x === 0 ? 1.5 : 0.5} />
                <text x={sx(x)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{x}</text>
              </g>
            ))}
            {gridYLines.map((y) => (
              <g key={`gy${y}`}>
                <line x1={PAD.left} y1={sy(y)} x2={PAD.left + PW} y2={sy(y)} stroke="#e2e8f0" strokeWidth={y === 0 ? 1.5 : 0.5} />
                <text x={PAD.left - 8} y={sy(y) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{y}</text>
              </g>
            ))}

            {/* axes */}
            {yMin <= 0 && yMax >= 0 && (
              <line x1={PAD.left} y1={sy(0)} x2={PAD.left + PW} y2={sy(0)} stroke="#64748b" strokeWidth={1} />
            )}
            {xMin <= 0 && xMax >= 0 && (
              <line x1={sx(0)} y1={PAD.top} x2={sx(0)} y2={PAD.top + PH} stroke="#64748b" strokeWidth={1} />
            )}

            {/* domain shading */}
            {domainPath && (
              <>
                <rect
                  x={sx(Math.max(domLeft, xMin))}
                  y={PAD.top}
                  width={sx(Math.min(domRight, xMax)) - sx(Math.max(domLeft, xMin))}
                  height={PH}
                  fill="rgba(99,102,241,0.06)"
                />
                {/* domain boundaries */}
                <line x1={sx(domLeft)} y1={PAD.top} x2={sx(domLeft)} y2={PAD.top + PH} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={sx(domRight)} y1={PAD.top} x2={sx(domRight)} y2={PAD.top + PH} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" />
                {/* domain labels */}
                <text x={sx(domLeft)} y={PAD.top + PH + 30} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight="bold">m={fmt(m)}</text>
                <text x={sx(domRight)} y={PAD.top + PH + 30} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight="bold">m+d={fmt(m + d)}</text>
              </>
            )}

            {/* full parabola (faded) */}
            <path d={fullPath} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />

            {/* domain portion (bold) */}
            {domainPath && (
              <path d={domainPath} fill="none" stroke="#1e293b" strokeWidth={2.5} />
            )}

            {/* vertex dashed line */}
            {vertexX >= xMin && vertexX <= xMax && (
              <line x1={sx(vertexX)} y1={PAD.top} x2={sx(vertexX)} y2={PAD.top + PH} stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" />
            )}

            {/* vertex point */}
            {vertexX >= xMin && vertexX <= xMax && (
              <circle cx={sx(vertexX)} cy={sy(f(vertexX))} r={4} fill="#a855f7" stroke="white" strokeWidth={1.5} />
            )}

            {/* MAX point (red) */}
            {maxX >= xMin && maxX <= xMax && (
              <>
                <circle cx={sx(maxX)} cy={sy(maxVal)} r={7} fill="#ef4444" stroke="white" strokeWidth={2} />
                <text x={sx(maxX) + 10} y={sy(maxVal) - 8} fontSize={11} fill="#ef4444" fontWeight="bold">
                  Max ({fmt(maxX)}, {fmt(maxVal)})
                </text>
              </>
            )}

            {/* MIN point (blue) */}
            {minX >= xMin && minX <= xMax && (
              <>
                <circle cx={sx(minX)} cy={sy(minVal)} r={7} fill="#3b82f6" stroke="white" strokeWidth={2} />
                <text x={sx(minX) + 10} y={sy(minVal) + 16} fontSize={11} fill="#3b82f6" fontWeight="bold">
                  Min ({fmt(minX)}, {fmt(minVal)})
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Slider */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">定義域の左端 m</span>
            <span className="font-mono text-indigo-600 font-bold">{fmt(m)}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={m}
            onChange={(e) => setM(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>-5</span>
            <span>5</span>
          </div>
        </div>

        {/* Case info */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="text-sm font-bold text-amber-800">{caseLabel}</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-blue-500 font-bold mb-1">最小値</div>
              <MathDisplay tex={`f(${fmt(minX)}) = ${fmt(minVal)}`} />
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-100">
              <div className="text-xs text-red-500 font-bold mb-1">最大値</div>
              <MathDisplay tex={`f(${fmt(maxX)}) = ${fmt(maxVal)}`} />
            </div>
          </div>
          <div className="text-xs text-slate-500">
            <MathDisplay tex={`\\text{頂点: } x = ${fmt(vertexX)}, \\quad \\text{定義域: } [${fmt(domLeft)},\\, ${fmt(domRight)}]`} />
          </div>
        </div>

        {/* Formula */}
        <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">場合分けのポイント</div>
          <div className="space-y-2 text-sm text-slate-600">
            {a > 0 ? (
              <>
                <div><MathDisplay tex="a > 0" /> (下に凸) のとき:</div>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>頂点が定義域内 → <span className="text-blue-600 font-bold">最小値 = 頂点</span>、最大値 = 遠い端点</li>
                  <li>頂点が定義域の左外 → 最小値 = 左端、最大値 = 右端</li>
                  <li>頂点が定義域の右外 → 最小値 = 右端、最大値 = 左端</li>
                </ul>
              </>
            ) : (
              <>
                <div><MathDisplay tex="a < 0" /> (上に凸) のとき:</div>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>頂点が定義域内 → <span className="text-red-600 font-bold">最大値 = 頂点</span>、最小値 = 遠い端点</li>
                  <li>頂点が定義域の左外 → 最大値 = 左端、最小値 = 右端</li>
                  <li>頂点が定義域の右外 → 最大値 = 右端、最小値 = 左端</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
