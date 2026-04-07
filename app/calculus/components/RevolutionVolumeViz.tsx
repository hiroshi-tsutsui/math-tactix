"use client";

import React, { useState, useMemo } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from "../../components/HintButton";

type FuncChoice = "linear" | "quadratic" | "sqrt" | "sin";

interface FuncDef {
  label: string;
  tex: string;
  fn: (x: number) => number;
  integralTex: string;
  defaultA: number;
  defaultB: number;
  maxB: number;
}

const FUNC_DEFS: Record<FuncChoice, FuncDef> = {
  linear: {
    label: "y = x",
    tex: "y = x",
    fn: (x: number) => x,
    integralTex: "x^2",
    defaultA: 0,
    defaultB: 1.5,
    maxB: 3.0,
  },
  quadratic: {
    label: "y = x\u00B2",
    tex: "y = x^2",
    fn: (x: number) => x * x,
    integralTex: "x^4",
    defaultA: 0,
    defaultB: 1.5,
    maxB: 2.0,
  },
  sqrt: {
    label: "y = \u221Ax",
    tex: "y = \\sqrt{x}",
    fn: (x: number) => Math.sqrt(Math.max(0, x)),
    integralTex: "x",
    defaultA: 0,
    defaultB: 2.0,
    maxB: 4.0,
  },
  sin: {
    label: "y = sin(x)",
    tex: "y = \\sin(x)",
    fn: (x: number) => Math.sin(x),
    integralTex: "\\sin^2(x)",
    defaultA: 0,
    defaultB: 3.14,
    maxB: 3.14,
  },
};

function simpsonsRule(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 100
): number {
  if (a >= b) return 0;
  // Ensure n is even
  if (n % 2 !== 0) n += 1;
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (h / 3) * sum;
}

export default function RevolutionVolumeViz() {
  const [funcChoice, setFuncChoice] = useState<FuncChoice>("quadratic");
  const [aVal, setAVal] = useState(0);
  const [bVal, setBVal] = useState(1.5);
  const [crossSection, setCrossSection] = useState(0.75);

  const funcDef = FUNC_DEFS[funcChoice];
  const f = funcDef.fn;

  // Clamp crossSection to [a, b]
  const c = Math.max(aVal, Math.min(bVal, crossSection));
  const fc = f(c);

  // Volume calculation using Simpson's rule
  const volume = useMemo(() => {
    const integrand = (x: number) => f(x) * f(x);
    return Math.PI * simpsonsRule(integrand, aVal, bVal);
  }, [funcChoice, aVal, bVal]);

  const rawIntegral = useMemo(() => {
    const integrand = (x: number) => f(x) * f(x);
    return simpsonsRule(integrand, aVal, bVal);
  }, [funcChoice, aVal, bVal]);

  // ---- SVG parameters ----
  const svgW = 340;
  const svgH = 260;
  const pad = 45;
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;

  // Determine ranges
  const xMin = -0.2;
  const xMax = funcDef.maxB + 0.3;
  const yMaxVal = useMemo(() => {
    let maxY = 1;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = Math.abs(f(x));
      if (y > maxY) maxY = y;
    }
    return maxY * 1.2;
  }, [funcChoice]);
  const yMin = -yMaxVal * 0.15;
  const yMax = yMaxVal;

  const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  // Generate curve path
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = f(x);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`);
    }
    return pts.join(" ");
  }, [funcChoice, yMaxVal]);

  // Generate filled area path [a,b]
  const areaPath = useMemo(() => {
    if (aVal >= bVal) return "";
    const pts: string[] = [];
    const steps = 100;
    pts.push(`M${toSvgX(aVal).toFixed(2)},${toSvgY(0).toFixed(2)}`);
    for (let i = 0; i <= steps; i++) {
      const x = aVal + (i / steps) * (bVal - aVal);
      const y = f(x);
      pts.push(`L${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`);
    }
    pts.push(`L${toSvgX(bVal).toFixed(2)},${toSvgY(0).toFixed(2)}`);
    pts.push("Z");
    return pts.join(" ");
  }, [funcChoice, aVal, bVal, yMaxVal]);

  // ---- Right panel: pseudo-3D revolution ----
  const rv3dW = 340;
  const rv3dH = 260;
  const rv3dPad = 45;
  const rv3dPlotW = rv3dW - 2 * rv3dPad;
  const rv3dPlotH = rv3dH - 2 * rv3dPad;

  // Map x to horizontal position, f(x) to vertical radius for ellipses
  const toRvX = (x: number) => rv3dPad + ((x - xMin) / (xMax - xMin)) * rv3dPlotW;
  const toRvYRadius = (radius: number) => (radius / (yMax - yMin)) * rv3dPlotH * 0.45;
  const rvCenterY = rv3dPad + rv3dPlotH / 2;

  // Generate revolution body outline (top and bottom curves)
  const outlineTop = useMemo(() => {
    if (aVal >= bVal) return "";
    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = aVal + (i / steps) * (bVal - aVal);
      const y = f(x);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${toRvX(x).toFixed(2)},${(rvCenterY - toRvYRadius(y)).toFixed(2)}`);
    }
    return pts.join(" ");
  }, [funcChoice, aVal, bVal, yMaxVal]);

  const outlineBottom = useMemo(() => {
    if (aVal >= bVal) return "";
    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = aVal + (i / steps) * (bVal - aVal);
      const y = f(x);
      const cmd = i === 0 ? "M" : "L";
      pts.push(`${cmd}${toRvX(x).toFixed(2)},${(rvCenterY + toRvYRadius(y)).toFixed(2)}`);
    }
    return pts.join(" ");
  }, [funcChoice, aVal, bVal, yMaxVal]);

  // Disc ellipses
  const discCount = 8;
  const discs = useMemo(() => {
    if (aVal >= bVal) return [];
    const result: { cx: number; ry: number; x: number }[] = [];
    for (let i = 0; i <= discCount; i++) {
      const x = aVal + (i / discCount) * (bVal - aVal);
      const y = f(x);
      result.push({
        cx: toRvX(x),
        ry: toRvYRadius(y),
        x,
      });
    }
    return result;
  }, [funcChoice, aVal, bVal, yMaxVal]);

  return (
    <div className="space-y-6">
      {/* Function selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">関数を選択</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FUNC_DEFS) as FuncChoice[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setFuncChoice(key);
                setAVal(FUNC_DEFS[key].defaultA);
                setBVal(FUNC_DEFS[key].defaultB);
                setCrossSection(
                  (FUNC_DEFS[key].defaultA + FUNC_DEFS[key].defaultB) / 2
                );
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                funcChoice === key
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {FUNC_DEFS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">
            a = <span className="text-blue-600">{aVal.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={funcDef.maxB - 0.1}
            step={0.05}
            value={aVal}
            onChange={(e) => {
              const newA = Number(e.target.value);
              setAVal(newA);
              if (bVal <= newA) setBVal(newA + 0.1);
              if (crossSection < newA) setCrossSection(newA);
            }}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">
            b = <span className="text-blue-600">{bVal.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={aVal + 0.05}
            max={funcDef.maxB}
            step={0.05}
            value={bVal}
            onChange={(e) => {
              const newB = Number(e.target.value);
              setBVal(newB);
              if (crossSection > newB) setCrossSection(newB);
            }}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">
            断面位置 x = <span className="text-orange-600">{c.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={aVal}
            max={bVal}
            step={0.01}
            value={c}
            onChange={(e) => setCrossSection(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      {/* SVG panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: 2D graph */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 px-2">
            2Dグラフ
          </p>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full"
            style={{ maxHeight: 300 }}
          >
            {/* Grid lines */}
            {Array.from({ length: 5 }, (_, i) => {
              const x = xMin + ((i + 1) / 6) * (xMax - xMin);
              return (
                <line
                  key={`gx-${i}`}
                  x1={toSvgX(x)}
                  y1={pad}
                  x2={toSvgX(x)}
                  y2={pad + plotH}
                  stroke="#e2e8f0"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Axes */}
            <line
              x1={pad}
              y1={toSvgY(0)}
              x2={pad + plotW}
              y2={toSvgY(0)}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            <line
              x1={toSvgX(0)}
              y1={pad}
              x2={toSvgX(0)}
              y2={pad + plotH}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />

            {/* Axis labels */}
            <text x={pad + plotW + 5} y={toSvgY(0) + 4} fontSize={11} fill="#64748b">x</text>
            <text x={toSvgX(0) - 12} y={pad - 5} fontSize={11} fill="#64748b">y</text>

            {/* Filled area */}
            {areaPath && (
              <path d={areaPath} fill="rgba(59,130,246,0.15)" stroke="none" />
            )}

            {/* Function curve */}
            <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

            {/* Cross-section line at x=c */}
            <line
              x1={toSvgX(c)}
              y1={toSvgY(0)}
              x2={toSvgX(c)}
              y2={toSvgY(fc)}
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <circle cx={toSvgX(c)} cy={toSvgY(fc)} r={4} fill="#f97316" />
            <circle cx={toSvgX(c)} cy={toSvgY(0)} r={3} fill="#f97316" />

            {/* Label for cross-section */}
            <text
              x={toSvgX(c) + 6}
              y={toSvgY(fc / 2)}
              fontSize={10}
              fill="#f97316"
              fontWeight="bold"
            >
              f({c.toFixed(1)}) = {fc.toFixed(2)}
            </text>

            {/* a, b markers */}
            <text x={toSvgX(aVal) - 3} y={toSvgY(0) + 14} fontSize={10} fill="#3b82f6" fontWeight="bold" textAnchor="middle">a</text>
            <text x={toSvgX(bVal) - 3} y={toSvgY(0) + 14} fontSize={10} fill="#3b82f6" fontWeight="bold" textAnchor="middle">b</text>
          </svg>
        </div>

        {/* Right: pseudo-3D revolution */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 px-2">
            回転体（擬似3D）
          </p>
          <svg
            viewBox={`0 0 ${rv3dW} ${rv3dH}`}
            className="w-full"
            style={{ maxHeight: 300 }}
          >
            {/* Horizontal axis */}
            <line
              x1={rv3dPad}
              y1={rvCenterY}
              x2={rv3dPad + rv3dPlotW}
              y2={rvCenterY}
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <text x={rv3dPad + rv3dPlotW + 5} y={rvCenterY + 4} fontSize={10} fill="#64748b">x</text>

            {/* Revolution body outline - filled */}
            {outlineTop && outlineBottom && (
              <path
                d={`${outlineTop} L${toRvX(bVal).toFixed(2)},${(rvCenterY + toRvYRadius(f(bVal))).toFixed(2)} ${outlineBottom.replace("M", "L").split(" ").reverse().join(" ")} Z`}
                fill="rgba(59,130,246,0.08)"
                stroke="none"
              />
            )}

            {/* Top outline */}
            {outlineTop && (
              <path d={outlineTop} fill="none" stroke="#3b82f6" strokeWidth={2} />
            )}
            {/* Bottom outline (mirror) */}
            {outlineBottom && (
              <path d={outlineBottom} fill="none" stroke="#3b82f6" strokeWidth={2} />
            )}

            {/* Disc ellipses */}
            {discs.map((disc, i) => (
              <ellipse
                key={i}
                cx={disc.cx}
                cy={rvCenterY}
                rx={6}
                ry={Math.max(1, disc.ry)}
                fill="rgba(99,102,241,0.12)"
                stroke="#6366f1"
                strokeWidth={0.8}
              />
            ))}

            {/* Cross-section disc at x=c */}
            <ellipse
              cx={toRvX(c)}
              cy={rvCenterY}
              rx={8}
              ry={Math.max(2, toRvYRadius(fc))}
              fill="rgba(249,115,22,0.25)"
              stroke="#f97316"
              strokeWidth={2}
            />
            <text
              x={toRvX(c)}
              y={rvCenterY - toRvYRadius(fc) - 8}
              fontSize={9}
              fill="#f97316"
              fontWeight="bold"
              textAnchor="middle"
            >
              r = {fc.toFixed(2)}
            </text>

            {/* Left/right end ellipses */}
            {aVal < bVal && (
              <>
                <ellipse
                  cx={toRvX(aVal)}
                  cy={rvCenterY}
                  rx={5}
                  ry={Math.max(1, toRvYRadius(f(aVal)))}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="3,2"
                />
                <ellipse
                  cx={toRvX(bVal)}
                  cy={rvCenterY}
                  rx={5}
                  ry={Math.max(1, toRvYRadius(f(bVal)))}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="3,2"
                />
              </>
            )}

            {/* a, b labels */}
            <text x={toRvX(aVal)} y={rvCenterY + toRvYRadius(f(aVal)) + 14} fontSize={10} fill="#3b82f6" fontWeight="bold" textAnchor="middle">a</text>
            <text x={toRvX(bVal)} y={rvCenterY + toRvYRadius(f(bVal)) + 14} fontSize={10} fill="#3b82f6" fontWeight="bold" textAnchor="middle">b</text>
          </svg>
        </div>
      </div>

      {/* Calculation results */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 space-y-3">
        <h4 className="text-sm font-bold text-blue-800">体積の計算</h4>
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            断面 x = {c.toFixed(2)} での半径:{" "}
            <MathDisplay tex={`f(${c.toFixed(2)}) = ${fc.toFixed(4)}`} />{" "}
            &rarr; 断面積:{" "}
            <MathDisplay tex={`\\pi \\times ${fc.toFixed(4)}^2 = ${(Math.PI * fc * fc).toFixed(4)}`} />
          </p>
          <div className="py-2">
            <MathDisplay
              tex={`V = \\pi \\int_{${aVal.toFixed(2)}}^{${bVal.toFixed(2)}} \\{f(x)\\}^2\\,dx = \\pi \\int_{${aVal.toFixed(2)}}^{${bVal.toFixed(2)}} (${funcDef.integralTex})\\,dx`}
              displayMode
            />
          </div>
          <div className="py-1">
            <MathDisplay
              tex={`\\approx \\pi \\times ${rawIntegral.toFixed(4)} = ${volume.toFixed(4)}`}
              displayMode
            />
          </div>
        </div>
      </div>

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "x=c での断面は半径 f(c) の円（面積 = π × f(c)²）" },
          { step: 2, text: "薄い円盤の体積 = π × f(x)² × dx（厚さ dx の円盤）" },
          { step: 3, text: "全体の体積 = すべての薄い円盤を足し合わせた積分" },
          { step: 4, text: "V = π∫[a,b] {f(x)}² dx（円盤法の公式）" },
        ]}
      />
    </div>
  );
}
