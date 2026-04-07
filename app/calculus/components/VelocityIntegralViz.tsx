"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

type VelocityFunc = "linear" | "quadratic" | "sin";

interface FuncDef {
  label: string;
  tex: string;
  fn: (t: number) => number;
  positionTex: string;
  tMax: number;
}

const FUNC_DEFS: Record<VelocityFunc, FuncDef> = {
  linear: {
    label: "v(t) = 2 - t",
    tex: "v(t) = 2 - t",
    fn: (t: number) => 2 - t,
    positionTex: "x(t) = 2t - \\frac{t^2}{2}",
    tMax: 4,
  },
  quadratic: {
    label: "v(t) = t\u00B2 - 2t",
    tex: "v(t) = t^2 - 2t",
    fn: (t: number) => t * t - 2 * t,
    positionTex: "x(t) = \\frac{t^3}{3} - t^2",
    tMax: 4,
  },
  sin: {
    label: "v(t) = sin(t)",
    tex: "v(t) = \\sin(t)",
    fn: (t: number) => Math.sin(t),
    positionTex: "x(t) = 1 - \\cos(t)",
    tMax: 2 * Math.PI,
  },
};

/** Simpson's rule numerical integration */
function simpsonIntegrate(
  f: (t: number) => number,
  a: number,
  b: number,
  n: number = 200
): number {
  if (a >= b) return 0;
  // n must be even
  const steps = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / steps;
  let sum = f(a) + f(b);
  for (let i = 1; i < steps; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  return (h / 3) * sum;
}

/** Compute position x(t) = integral of v from 0 to t */
function computePosition(
  v: (t: number) => number,
  tEnd: number,
  numPoints: number
): Array<{ t: number; x: number }> {
  const result: Array<{ t: number; x: number }> = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (tEnd * i) / numPoints;
    const x = simpsonIntegrate(v, 0, t);
    result.push({ t, x });
  }
  return result;
}

const SVG_W = 500;
const SVG_H = 220;
const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };
const PLOT_W = SVG_W - MARGIN.left - MARGIN.right;
const PLOT_H = SVG_H - MARGIN.top - MARGIN.bottom;

export default function VelocityIntegralViz() {
  const [funcChoice, setFuncChoice] = useState<VelocityFunc>("linear");
  const [tSlider, setTSlider] = useState(3);

  const def = FUNC_DEFS[funcChoice];
  const tMax = def.tMax;
  const T = Math.min(tSlider, tMax);

  // Velocity graph samples
  const vSamples = useMemo(() => {
    const pts: Array<{ t: number; v: number }> = [];
    const n = 300;
    for (let i = 0; i <= n; i++) {
      const t = (tMax * i) / n;
      pts.push({ t, v: def.fn(t) });
    }
    return pts;
  }, [def, tMax]);

  // Y range for velocity
  const vRange = useMemo(() => {
    let min = 0, max = 0;
    for (const s of vSamples) {
      if (s.v < min) min = s.v;
      if (s.v > max) max = s.v;
    }
    const pad = (max - min) * 0.15 || 1;
    return { min: min - pad, max: max + pad };
  }, [vSamples]);

  // Displacement & distance
  const displacement = useMemo(
    () => simpsonIntegrate(def.fn, 0, T),
    [def, T]
  );

  const distance = useMemo(
    () => simpsonIntegrate((t) => Math.abs(def.fn(t)), 0, T),
    [def, T]
  );

  // Position curve
  const positionCurve = useMemo(
    () => computePosition(def.fn, tMax, 200),
    [def, tMax]
  );

  const posRange = useMemo(() => {
    let min = 0, max = 0;
    for (const p of positionCurve) {
      if (p.x < min) min = p.x;
      if (p.x > max) max = p.x;
    }
    const pad = (max - min) * 0.15 || 1;
    return { min: min - pad, max: max + pad };
  }, [positionCurve]);

  // Scale functions for velocity graph
  const scaleT = useCallback(
    (t: number) => MARGIN.left + (t / tMax) * PLOT_W,
    [tMax]
  );
  const scaleV = useCallback(
    (v: number) =>
      MARGIN.top + PLOT_H - ((v - vRange.min) / (vRange.max - vRange.min)) * PLOT_H,
    [vRange]
  );
  const scaleX = useCallback(
    (x: number) =>
      MARGIN.top + PLOT_H - ((x - posRange.min) / (posRange.max - posRange.min)) * PLOT_H,
    [posRange]
  );

  // Build fill paths for positive/negative regions
  const fillPaths = useMemo(() => {
    const step = tMax / 300;
    const positivePts: string[] = [];
    const negativePts: string[] = [];
    const zeroY = scaleV(0);

    for (let i = 0; i <= 300; i++) {
      const t = Math.min((tMax * i) / 300, T);
      if (t > T) break;
      const v = def.fn(t);
      const sx = scaleT(t);
      const sy = scaleV(v);

      if (v >= 0) {
        if (positivePts.length === 0) {
          positivePts.push(`M${sx},${zeroY}`);
        }
        positivePts.push(`L${sx},${sy}`);
      } else {
        if (negativePts.length === 0) {
          negativePts.push(`M${sx},${zeroY}`);
        }
        negativePts.push(`L${sx},${sy}`);
      }
    }

    // Close paths
    const closePos = positivePts.length > 1
      ? positivePts.join("") + `L${scaleT(T)},${zeroY}Z`
      : "";
    const closeNeg = negativePts.length > 1
      ? negativePts.join("") + `L${scaleT(T)},${zeroY}Z`
      : "";

    return { positive: closePos, negative: closeNeg };
  }, [def, T, tMax, scaleT, scaleV]);

  // Build more accurate filled region using fine segments
  const filledRegions = useMemo(() => {
    const n = 300;
    const posSegs: string[] = [];
    const negSegs: string[] = [];
    const zeroY = scaleV(0);

    let inPositive = false;
    let inNegative = false;

    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      const v = def.fn(t);
      const sx = scaleT(t);
      const sy = scaleV(v);

      if (v >= 0) {
        if (!inPositive) {
          posSegs.push(`M${sx},${zeroY} L${sx},${sy}`);
          inPositive = true;
        } else {
          posSegs.push(`L${sx},${sy}`);
        }
        if (inNegative) {
          negSegs.push(`L${sx},${zeroY}`);
          inNegative = false;
        }
      } else {
        if (!inNegative) {
          negSegs.push(`M${sx},${zeroY} L${sx},${sy}`);
          inNegative = true;
        } else {
          negSegs.push(`L${sx},${sy}`);
        }
        if (inPositive) {
          posSegs.push(`L${sx},${zeroY}`);
          inPositive = false;
        }
      }
    }

    // Close
    const lastSx = scaleT(T);
    if (inPositive) posSegs.push(`L${lastSx},${zeroY}`);
    if (inNegative) negSegs.push(`L${lastSx},${zeroY}`);

    return {
      positive: posSegs.join(" "),
      negative: negSegs.join(" "),
    };
  }, [def, T, scaleT, scaleV]);

  // Velocity curve path
  const vCurvePath = useMemo(() => {
    return vSamples
      .map((s, i) => `${i === 0 ? "M" : "L"}${scaleT(s.t)},${scaleV(s.v)}`)
      .join(" ");
  }, [vSamples, scaleT, scaleV]);

  // Position curve path
  const posCurvePath = useMemo(() => {
    return positionCurve
      .map((p, i) => `${i === 0 ? "M" : "L"}${scaleT(p.t)},${scaleX(p.x)}`)
      .join(" ");
  }, [positionCurve, scaleT, scaleX]);

  // Current position at t=T
  const currentPos = useMemo(() => {
    return simpsonIntegrate(def.fn, 0, T);
  }, [def, T]);

  return (
    <div className="space-y-6">
      {/* Function selector */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-600">速度関数を選択:</p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(FUNC_DEFS) as VelocityFunc[]).map((key) => (
            <label
              key={key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                funcChoice === key
                  ? "bg-blue-100 text-blue-700 border border-blue-200 font-semibold"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <input
                type="radio"
                name="velFunc"
                value={key}
                checked={funcChoice === key}
                onChange={() => {
                  setFuncChoice(key);
                  setTSlider(Math.min(tSlider, FUNC_DEFS[key].tMax));
                }}
                className="sr-only"
              />
              <K tex={FUNC_DEFS[key].tex} />
            </label>
          ))}
        </div>
      </div>

      {/* T slider */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">
          時刻 T: <span className="text-blue-600 font-bold">{T.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={tMax}
          step={0.01}
          value={T}
          onChange={(e) => setTSlider(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Main display grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Velocity graph (left, 2 cols) */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            速度グラフ <K tex={def.tex} />
          </h3>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
            {/* Grid */}
            <line
              x1={MARGIN.left} y1={scaleV(0)}
              x2={SVG_W - MARGIN.right} y2={scaleV(0)}
              stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4"
            />
            {/* Axes */}
            <line
              x1={MARGIN.left} y1={MARGIN.top}
              x2={MARGIN.left} y2={SVG_H - MARGIN.bottom}
              stroke="#475569" strokeWidth={1.5}
            />
            <line
              x1={MARGIN.left} y1={SVG_H - MARGIN.bottom}
              x2={SVG_W - MARGIN.right} y2={SVG_H - MARGIN.bottom}
              stroke="#475569" strokeWidth={1.5}
            />

            {/* Filled regions */}
            <path d={filledRegions.positive} fill="rgba(59,130,246,0.25)" />
            <path d={filledRegions.negative} fill="rgba(239,68,68,0.25)" />

            {/* Velocity curve */}
            <path d={vCurvePath} fill="none" stroke="#1e40af" strokeWidth={2} />

            {/* T marker line */}
            <line
              x1={scaleT(T)} y1={MARGIN.top}
              x2={scaleT(T)} y2={SVG_H - MARGIN.bottom}
              stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,4"
            />

            {/* T label */}
            <text x={scaleT(T)} y={SVG_H - 8} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight="bold">
              T={T.toFixed(1)}
            </text>

            {/* Axis labels */}
            <text x={SVG_W - MARGIN.right + 5} y={SVG_H - MARGIN.bottom + 4} fontSize={10} fill="#64748b">t</text>
            <text x={MARGIN.left - 5} y={MARGIN.top - 5} fontSize={10} fill="#64748b" textAnchor="end">v(t)</text>

            {/* Y-axis ticks */}
            {[vRange.min, 0, vRange.max].map((val, i) => (
              <text key={i} x={MARGIN.left - 8} y={scaleV(val) + 4} fontSize={9} fill="#94a3b8" textAnchor="end">
                {val.toFixed(1)}
              </text>
            ))}

            {/* Legend */}
            <rect x={SVG_W - 130} y={MARGIN.top} width={10} height={10} fill="rgba(59,130,246,0.4)" />
            <text x={SVG_W - 116} y={MARGIN.top + 9} fontSize={9} fill="#3b82f6">前進（正）</text>
            <rect x={SVG_W - 130} y={MARGIN.top + 16} width={10} height={10} fill="rgba(239,68,68,0.4)" />
            <text x={SVG_W - 116} y={MARGIN.top + 25} fontSize={9} fill="#ef4444">後退（負）</text>
          </svg>
        </div>

        {/* Calculation panel (right, 1 col) */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">変位（符号付き）</h4>
            <KBlock tex={`\\int_0^{${T.toFixed(1)}} v(t)\\,dt = ${displacement.toFixed(3)}`} />
            <p className="text-xs text-blue-600 mt-1">
              {displacement >= 0 ? "原点より前方" : "原点より後方"} に{" "}
              {Math.abs(displacement).toFixed(3)} 移動
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">移動距離（絶対値）</h4>
            <KBlock tex={`\\int_0^{${T.toFixed(1)}} |v(t)|\\,dt = ${distance.toFixed(3)}`} />
            <p className="text-xs text-red-600 mt-1">
              実際に動いた総距離
            </p>
          </div>

          {Math.abs(displacement - distance) > 0.001 && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="text-xs text-amber-700 font-semibold">
                変位 ≠ 移動距離!
              </p>
              <p className="text-xs text-amber-600 mt-1">
                差: {(distance - Math.abs(displacement)).toFixed(3)}
                （折り返し分）
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Position graph (lower panel) */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          位置グラフ <K tex={def.positionTex} />（初期位置 x(0)=0）
        </h3>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
          {/* Zero line */}
          <line
            x1={MARGIN.left} y1={scaleX(0)}
            x2={SVG_W - MARGIN.right} y2={scaleX(0)}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4"
          />
          {/* Axes */}
          <line
            x1={MARGIN.left} y1={MARGIN.top}
            x2={MARGIN.left} y2={SVG_H - MARGIN.bottom}
            stroke="#475569" strokeWidth={1.5}
          />
          <line
            x1={MARGIN.left} y1={SVG_H - MARGIN.bottom}
            x2={SVG_W - MARGIN.right} y2={SVG_H - MARGIN.bottom}
            stroke="#475569" strokeWidth={1.5}
          />

          {/* Position curve */}
          <path d={posCurvePath} fill="none" stroke="#10b981" strokeWidth={2} />

          {/* T marker */}
          <line
            x1={scaleT(T)} y1={MARGIN.top}
            x2={scaleT(T)} y2={SVG_H - MARGIN.bottom}
            stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,4"
          />

          {/* Current position dot */}
          <circle
            cx={scaleT(T)}
            cy={scaleX(currentPos)}
            r={6}
            fill="#10b981"
            stroke="white"
            strokeWidth={2}
          />

          {/* Position value label */}
          <text
            x={scaleT(T) + 10}
            y={scaleX(currentPos) - 8}
            fontSize={10}
            fill="#10b981"
            fontWeight="bold"
          >
            x={currentPos.toFixed(2)}
          </text>

          {/* Axis labels */}
          <text x={SVG_W - MARGIN.right + 5} y={SVG_H - MARGIN.bottom + 4} fontSize={10} fill="#64748b">t</text>
          <text x={MARGIN.left - 5} y={MARGIN.top - 5} fontSize={10} fill="#64748b" textAnchor="end">x(t)</text>

          {/* Y-axis ticks */}
          {[posRange.min, 0, posRange.max].map((val, i) => (
            <text key={i} x={MARGIN.left - 8} y={scaleX(val) + 4} fontSize={9} fill="#94a3b8" textAnchor="end">
              {val.toFixed(1)}
            </text>
          ))}
        </svg>
      </div>

      {/* Formula summary */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-3">公式まとめ</h4>
        <div className="space-y-3">
          <div>
            <KBlock tex={`\\text{変位} = \\int_0^T v(t)\\,dt \\quad (\\text{符号付き})`} />
          </div>
          <div>
            <KBlock tex={`\\text{移動距離} = \\int_0^T |v(t)|\\,dt \\quad (\\text{常に} \\geq 0)`} />
          </div>
          <div>
            <KBlock tex={`x(t) = x(0) + \\int_0^t v(s)\\,ds, \\quad v(t) = v(0) + \\int_0^t a(s)\\,ds`} />
          </div>
        </div>
      </div>

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "速度グラフの面積 = 変位（正の面積 = 前進、負の面積 = 後退）" },
          { step: 2, text: "変位 = ∫v(t)dt（符号付き積分）" },
          { step: 3, text: "移動距離 = ∫|v(t)|dt（v(t)が負の区間は絶対値に注意）" },
          { step: 4, text: "v(t)=0 になる時刻で積分を分割して符号を変える" },
        ]}
      />
    </div>
  );
}
