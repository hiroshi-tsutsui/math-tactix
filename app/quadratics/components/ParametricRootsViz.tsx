"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

export default function ParametricRootsViz() {
  const [aSlider, setASlider] = useState(50); // 0-100, mapped to -3..3
  const b = 2;
  const c = -3;

  const a = ((aSlider / 100) * 6 - 3);
  const aRound = Math.round(a * 100) / 100;

  // Compute discriminant and roots
  const info = useMemo(() => {
    if (Math.abs(aRound) < 0.01) {
      // Linear case: bx + c = 0
      const root = -c / b;
      return {
        type: "linear" as const,
        D: null,
        roots: [root],
        rootCount: 1,
        equation: `${b}x + (${c}) = 0`,
      };
    }
    const D = b * b - 4 * aRound * c;
    if (D > 0.001) {
      const r1 = (-b + Math.sqrt(D)) / (2 * aRound);
      const r2 = (-b - Math.sqrt(D)) / (2 * aRound);
      return {
        type: "quadratic" as const,
        D,
        roots: [Math.min(r1, r2), Math.max(r1, r2)],
        rootCount: 2,
        equation: `${aRound}x^2 + ${b}x + (${c}) = 0`,
      };
    } else if (Math.abs(D) <= 0.001) {
      const r = -b / (2 * aRound);
      return {
        type: "quadratic" as const,
        D: 0,
        roots: [r],
        rootCount: 1,
        equation: `${aRound}x^2 + ${b}x + (${c}) = 0`,
      };
    } else {
      return {
        type: "quadratic" as const,
        D,
        roots: [],
        rootCount: 0,
        equation: `${aRound}x^2 + ${b}x + (${c}) = 0`,
      };
    }
  }, [aRound]);

  // SVG graph
  const W = 340;
  const H = 280;
  const padding = 40;
  const graphW = W - 2 * padding;
  const graphH = H - 2 * padding;

  // Map math coords to SVG
  const xRange = 8; // -4 to 4
  const yRange = 12; // -6 to 6
  const toSvgX = (x: number) => padding + ((x + xRange / 2) / xRange) * graphW;
  const toSvgY = (y: number) => padding + ((yRange / 2 - y) / yRange) * graphH;

  // Generate curve points
  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    for (let px = -xRange / 2; px <= xRange / 2; px += 0.05) {
      const y = aRound * px * px + b * px + c;
      if (Math.abs(y) < yRange) {
        pts.push(`${toSvgX(px)},${toSvgY(y)}`);
      }
    }
    return pts.join(" ");
  }, [aRound]);

  // Case label
  const caseLabel = aRound > 0.01 ? "a > 0: 上に凸でない放物線（下に凸）" :
                    aRound < -0.01 ? "a < 0: 下に凸でない放物線（上に凸）" :
                    "a = 0: 直線（一次方程式）";

  const caseColor = aRound > 0.01 ? "#3b82f6" : aRound < -0.01 ? "#ef4444" : "#22c55e";

  const discriminantColor = info.D === null ? "#22c55e" :
    info.D > 0 ? "#3b82f6" : info.D === 0 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-bold text-center">文字係数の二次方程式の解の配置</h3>

      {/* Equation display */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800 text-center">
        <K tex={`f(x) = ${aRound === 0 ? "" : aRound === 1 ? "" : aRound === -1 ? "-" : aRound.toFixed(2)}${aRound !== 0 ? "x^2 + " : ""}${b}x + (${c})`} display />
        <div className="mt-2 text-xs text-indigo-500">b = {b}, c = {c} は固定、a をスライダーで変化</div>
      </div>

      {/* SVG graph */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px]">
          {/* Grid lines */}
          {Array.from({ length: Math.floor(xRange) + 1 }, (_, i) => i - Math.floor(xRange / 2)).map((x) => (
            <line key={`gx${x}`} x1={toSvgX(x)} y1={padding} x2={toSvgX(x)} y2={H - padding}
              stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {Array.from({ length: Math.floor(yRange) + 1 }, (_, i) => i - Math.floor(yRange / 2)).map((y) => (
            <line key={`gy${y}`} x1={padding} y1={toSvgY(y)} x2={W - padding} y2={toSvgY(y)}
              stroke="#f1f5f9" strokeWidth={1} />
          ))}

          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={W - padding} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={H - padding} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={W - padding + 8} y={toSvgY(0) + 4} fontSize={11} fill="#94a3b8">x</text>
          <text x={toSvgX(0) + 6} y={padding - 4} fontSize={11} fill="#94a3b8">y</text>

          {/* Curve */}
          <polyline points={curvePoints} fill="none" stroke={caseColor} strokeWidth={2.5} />

          {/* Root points */}
          {info.roots.map((r, i) => (
            <g key={i}>
              <circle cx={toSvgX(r)} cy={toSvgY(0)} r={5} fill={caseColor} stroke="white" strokeWidth={2} />
              <text x={toSvgX(r)} y={toSvgY(0) + 18} fontSize={10} fontWeight="bold" fill={caseColor} textAnchor="middle">
                {r.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Origin label */}
          <text x={toSvgX(0) - 10} y={toSvgY(0) + 14} fontSize={10} fill="#94a3b8">O</text>
        </svg>
      </div>

      {/* a slider */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-bold" style={{ color: caseColor }}>a = {aRound.toFixed(2)}</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: caseColor + "20", color: caseColor }}>
            {caseLabel}
          </span>
        </div>
        <input
          type="range" min={0} max={100} step={1} value={aSlider}
          onChange={(e) => setASlider(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>-3</span>
          <span className="font-bold text-green-500">a = 0</span>
          <span>3</span>
        </div>
      </div>

      {/* Discriminant & roots info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h4 className="font-bold text-sm">判別式と解の情報</h4>

        {info.type === "linear" ? (
          <div className="space-y-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-xs font-bold text-green-500 mb-1">a = 0 の場合（一次方程式）</div>
              <K tex={`${b}x + (${c}) = 0 \\implies x = ${info.roots[0].toFixed(2)}`} />
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">二次方程式ではなく一次方程式になり、解は常に1つ</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                <K tex={`D = b^2 - 4ac = ${b}^2 - 4 \\cdot (${aRound.toFixed(2)}) \\cdot (${c}) = ${info.D !== null ? info.D.toFixed(2) : "---"}`} />
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: discriminantColor + "15", color: discriminantColor }}>
              {info.D !== null && info.D > 0 && `D > 0: 異なる2つの実数解 (${info.roots.map(r => r.toFixed(2)).join(", ")})`}
              {info.D !== null && info.D === 0 && `D = 0: 重解 (x = ${info.roots[0]?.toFixed(2)})`}
              {info.D !== null && info.D < 0 && "D < 0: 実数解なし"}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <HintButton hints={[
        { step: 1, text: "判別式 D = b² - 4ac の符号で解の個数が決まります。D > 0 なら2つ、D = 0 なら重解、D < 0 なら実数解なしです。" },
        { step: 2, text: "a = 0 のとき二次方程式ではなく一次方程式になります。この場合は bx + c = 0 を解くだけです。" },
        { step: 3, text: "a が 0 に近づくと放物線が「開いていき」直線に連続的に変化する様子を観察しましょう。" },
      ]} />

      {/* Key observations */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-2">注目ポイント</h4>
        <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1 list-disc list-inside">
          <li>a &gt; 0 のとき: 下に凸の放物線。x 軸との交点が解</li>
          <li>a = 0 のとき: 直線になる（特異点）。二次方程式の場合分けで重要</li>
          <li>a &lt; 0 のとき: 上に凸の放物線。グラフの形が反転</li>
          <li>a が 0 に近づくと放物線が「開いて」直線に連続的に変化する様子を観察しよう</li>
        </ul>
      </div>
    </div>
  );
}
