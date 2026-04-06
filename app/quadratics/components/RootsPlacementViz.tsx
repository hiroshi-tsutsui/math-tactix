"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import katex from "katex";

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

/* ── Pattern definitions ── */
type PatternId = "both_positive" | "both_geq_k" | "straddle_k" | "both_in_range";

interface PatternDef {
  id: PatternId;
  label: string;
  desc: string;
}

const PATTERNS: PatternDef[] = [
  { id: "both_positive", label: "両解が正", desc: "f(x)=0 の2解がともに正となる条件" },
  { id: "both_geq_k", label: "両解がk以上", desc: "f(x)=0 の2解がともにk以上となる条件" },
  { id: "straddle_k", label: "kをまたぐ", desc: "f(x)=0 の2解がkの両側にある条件" },
  { id: "both_in_range", label: "α<x<β内", desc: "f(x)=0 の2解がともにα<x<βの範囲内にある条件" },
];

/* ── SVG constants ── */
const W = 520;
const H = 360;
const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

/* ── condition badge ── */
const Badge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
    {label}
  </span>
);

export default function RootsPlacementViz() {
  const [pattern, setPattern] = useState<PatternId>("both_positive");
  const [a, setA] = useState(1);
  const [b, setB] = useState(-4);
  const [c, setC] = useState(3);
  const [k, setK] = useState(1);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(5);

  /* ── derived values ── */
  const D = useMemo(() => b * b - 4 * a * c, [a, b, c]);
  const axis = useMemo(() => (a !== 0 ? -b / (2 * a) : 0), [a, b]);
  const f = useCallback((x: number) => a * x * x + b * x + c, [a, b, c]);

  /* ── scale helpers (dynamic range) ── */
  const xCenter = axis;
  const xRange = 8;
  const xMin = xCenter - xRange / 2;
  const xMax = xCenter + xRange / 2;

  // compute yMin/yMax from sampled values
  const { yMin, yMax } = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      const y = f(x);
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }
    // include 0 in range
    lo = Math.min(lo, -1);
    hi = Math.max(hi, 1);
    const pad = (hi - lo) * 0.15;
    return { yMin: lo - pad, yMax: hi + pad };
  }, [f, xMin, xMax]);

  const sx = useCallback((x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PW, [xMin, xMax]);
  const sy = useCallback((y: number) => PAD.top + PH - ((y - yMin) / (yMax - yMin)) * PH, [yMin, yMax]);

  /* ── parabola path ── */
  const pathD = useMemo(() => {
    const pts: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = f(x);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [f, sx, sy, xMin, xMax]);

  /* ── condition evaluation ── */
  const conditions = useMemo(() => {
    const condList: { label: string; tex: string; ok: boolean }[] = [];
    switch (pattern) {
      case "both_positive":
        condList.push({ label: "D >= 0", tex: `D = ${D.toFixed(1)} \\ge 0`, ok: D >= 0 });
        condList.push({ label: "軸 > 0", tex: `\\text{axis} = ${axis.toFixed(2)} > 0`, ok: axis > 0 });
        condList.push({ label: "f(0) > 0", tex: `f(0) = ${f(0).toFixed(2)} > 0`, ok: f(0) > 0 });
        break;
      case "both_geq_k":
        condList.push({ label: "D >= 0", tex: `D = ${D.toFixed(1)} \\ge 0`, ok: D >= 0 });
        condList.push({ label: `軸 > ${k}`, tex: `\\text{axis} = ${axis.toFixed(2)} > ${k}`, ok: axis > k });
        condList.push({ label: `f(${k}) > 0`, tex: `f(${k}) = ${f(k).toFixed(2)} > 0`, ok: f(k) > 0 });
        break;
      case "straddle_k":
        condList.push({ label: `f(${k}) < 0`, tex: `f(${k}) = ${f(k).toFixed(2)} < 0`, ok: a > 0 ? f(k) < 0 : f(k) > 0 });
        break;
      case "both_in_range": {
        const fAlpha = f(alpha);
        const fBeta = f(beta);
        condList.push({ label: "D >= 0", tex: `D = ${D.toFixed(1)} \\ge 0`, ok: D >= 0 });
        condList.push({
          label: `${alpha} < 軸 < ${beta}`,
          tex: `${alpha} < ${axis.toFixed(2)} < ${beta}`,
          ok: alpha < axis && axis < beta,
        });
        condList.push({ label: `f(${alpha}) > 0`, tex: `f(${alpha}) = ${fAlpha.toFixed(2)} > 0`, ok: a > 0 ? fAlpha > 0 : fAlpha < 0 });
        condList.push({ label: `f(${beta}) > 0`, tex: `f(${beta}) = ${fBeta.toFixed(2)} > 0`, ok: a > 0 ? fBeta > 0 : fBeta < 0 });
        break;
      }
    }
    return condList;
  }, [pattern, D, axis, f, k, alpha, beta, a]);

  const allOk = conditions.every((c) => c.ok);

  /* ── x-axis ticks ── */
  const xTicks: number[] = [];
  for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) xTicks.push(v);
  const yTicks: number[] = [];
  {
    const step = Math.max(1, Math.round((yMax - yMin) / 6));
    for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) yTicks.push(v);
  }

  return (
    <div className="p-4 space-y-4">
      {/* pattern tabs */}
      <div className="flex gap-1 flex-wrap">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPattern(p.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              pattern === p.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500">{PATTERNS.find((p) => p.id === pattern)?.desc}</p>

      {/* SVG graph */}
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

        {/* x-axis (y=0) */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD.left} y1={sy(0)} x2={W - PAD.right} y2={sy(0)} stroke="#64748b" strokeWidth={1} />
        )}
        {/* y-axis (x=0) */}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={sx(0)} y1={PAD.top} x2={sx(0)} y2={H - PAD.bottom} stroke="#64748b" strokeWidth={1} />
        )}

        {/* boundary markers for patterns */}
        {pattern === "both_positive" && xMin <= 0 && xMax >= 0 && (
          <line x1={sx(0)} y1={PAD.top} x2={sx(0)} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
        )}
        {pattern === "both_geq_k" && (
          <line x1={sx(k)} y1={PAD.top} x2={sx(k)} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
        )}
        {pattern === "straddle_k" && (
          <line x1={sx(k)} y1={PAD.top} x2={sx(k)} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
        )}
        {pattern === "both_in_range" && (
          <>
            <line x1={sx(alpha)} y1={PAD.top} x2={sx(alpha)} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
            <line x1={sx(beta)} y1={PAD.top} x2={sx(beta)} y2={H - PAD.bottom} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" />
            <rect x={sx(alpha)} y={PAD.top} width={sx(beta) - sx(alpha)} height={PH} fill="#fef3c7" opacity={0.3} />
          </>
        )}

        {/* axis of symmetry */}
        {a !== 0 && (
          <line x1={sx(axis)} y1={PAD.top} x2={sx(axis)} y2={H - PAD.bottom} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 4" />
        )}

        {/* parabola */}
        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2.5} />

        {/* vertex point */}
        {a !== 0 && (
          <circle cx={sx(axis)} cy={sy(f(axis))} r={4} fill="#8b5cf6" stroke="#fff" strokeWidth={1.5} />
        )}

        {/* roots if D>=0 */}
        {D >= 0 && a !== 0 && (
          <>
            <circle cx={sx((-b + Math.sqrt(D)) / (2 * a))} cy={sy(0)} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
            <circle cx={sx((-b - Math.sqrt(D)) / (2 * a))} cy={sy(0)} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
          </>
        )}
      </svg>

      {/* sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>a</span><span className="font-mono text-blue-600">{a.toFixed(1)}</span>
          </label>
          <input type="range" min={0.1} max={3} step={0.1} value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>b</span><span className="font-mono text-blue-600">{b.toFixed(1)}</span>
          </label>
          <input type="range" min={-10} max={10} step={0.1} value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>c</span><span className="font-mono text-blue-600">{c.toFixed(1)}</span>
          </label>
          <input type="range" min={-10} max={10} step={0.1} value={c}
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* pattern-specific sliders */}
      {pattern === "both_geq_k" && (
        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
          <label className="flex justify-between text-xs font-bold text-amber-700 mb-1">
            <span>k</span><span className="font-mono">{k.toFixed(1)}</span>
          </label>
          <input type="range" min={-5} max={5} step={0.1} value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
      )}
      {pattern === "straddle_k" && (
        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
          <label className="flex justify-between text-xs font-bold text-amber-700 mb-1">
            <span>k</span><span className="font-mono">{k.toFixed(1)}</span>
          </label>
          <input type="range" min={-5} max={5} step={0.1} value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
      )}
      {pattern === "both_in_range" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
            <label className="flex justify-between text-xs font-bold text-amber-700 mb-1">
              <K tex="\alpha" /><span className="font-mono">{alpha.toFixed(1)}</span>
            </label>
            <input type="range" min={-5} max={beta - 0.5} step={0.1} value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
          <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
            <label className="flex justify-between text-xs font-bold text-amber-700 mb-1">
              <K tex="\beta" /><span className="font-mono">{beta.toFixed(1)}</span>
            </label>
            <input type="range" min={alpha + 0.5} max={10} step={0.1} value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>
      )}

      {/* conditions */}
      <div className={`border rounded-lg p-4 space-y-2 ${allOk ? "bg-green-50 border-green-300" : "bg-slate-50 border-slate-200"}`}>
        <h4 className="text-sm font-bold text-slate-700 mb-2">条件チェック</h4>
        <div className="flex flex-wrap gap-2">
          {conditions.map((cond, i) => (
            <Badge key={i} ok={cond.ok} label={cond.label} />
          ))}
        </div>
        <div className="space-y-1 pt-2">
          {conditions.map((cond, i) => (
            <div key={i} className="text-xs">
              <K tex={cond.tex} />
            </div>
          ))}
        </div>
        {allOk && (
          <p className="text-sm font-bold text-green-700 pt-1">全ての条件が成立しています。</p>
        )}
      </div>

      {/* formula summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
        <KBlock tex={`f(x) = ${a === 1 ? "" : a.toFixed(1)}x^2 ${b >= 0 ? "+" : ""} ${b.toFixed(1)}x ${c >= 0 ? "+" : ""} ${c.toFixed(1)}`} />
        <div className="text-xs text-slate-500 mt-1">
          <K tex={`D = b^2 - 4ac = ${D.toFixed(1)}`} />
          {" | "}
          <K tex={`\\text{axis}: x = ${axis.toFixed(2)}`} />
        </div>
      </div>
    </div>
  );
}
