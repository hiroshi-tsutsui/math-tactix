"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import katex from "katex";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

type TrigFunc = "sin" | "cos" | "tan";

interface Solution {
  degrees: number;
  radians: string;
}

function solveTrig(func: TrigFunc, k: number, range360: boolean): Solution[] {
  const solutions: Solution[] = [];
  const maxDeg = range360 ? 359 : 180;

  if (func === "sin") {
    if (k < -1 || k > 1) return [];
    // 0 <= theta <= 180 (or 360)
    const base = Math.asin(k) * (180 / Math.PI);
    // In [0, 180]: sin is non-negative, so solutions exist only for k >= 0
    // Actually sin(theta) for 0<=theta<=180 ranges from 0 to 1 and back to 0
    // sin(theta) = k: theta = arcsin(k) and theta = 180 - arcsin(k)
    if (!range360) {
      // 0 <= theta <= 180
      if (k >= 0) {
        const t1 = Math.round(base * 100) / 100;
        const t2 = Math.round((180 - base) * 100) / 100;
        if (t1 >= 0 && t1 <= 180) solutions.push({ degrees: t1, radians: degToRadStr(t1) });
        if (t2 >= 0 && t2 <= 180 && Math.abs(t2 - t1) > 0.01) solutions.push({ degrees: t2, radians: degToRadStr(t2) });
      }
    } else {
      // 0 <= theta < 360
      const t1 = base < 0 ? base + 360 : base;
      const t2 = 180 - base;
      const t2n = t2 < 0 ? t2 + 360 : t2 >= 360 ? t2 - 360 : t2;
      const t1n = t1 < 0 ? t1 + 360 : t1 >= 360 ? t1 - 360 : t1;
      const candidates = [t1n, t2n].filter((v) => v >= 0 && v < 360);
      const unique = [...new Set(candidates.map((v) => Math.round(v * 100) / 100))];
      unique.sort((a, b) => a - b);
      unique.forEach((d) => solutions.push({ degrees: d, radians: degToRadStr(d) }));
    }
  } else if (func === "cos") {
    if (k < -1 || k > 1) return [];
    const base = Math.acos(k) * (180 / Math.PI);
    if (!range360) {
      // 0 <= theta <= 180: cos is monotone decreasing, so unique solution
      const t1 = Math.round(base * 100) / 100;
      if (t1 >= 0 && t1 <= 180) solutions.push({ degrees: t1, radians: degToRadStr(t1) });
    } else {
      const t1 = Math.round(base * 100) / 100;
      const t2 = Math.round((360 - base) * 100) / 100;
      if (t1 >= 0 && t1 < 360) solutions.push({ degrees: t1, radians: degToRadStr(t1) });
      if (t2 >= 0 && t2 < 360 && Math.abs(t2 - t1) > 0.01 && t2 < 360) solutions.push({ degrees: t2, radians: degToRadStr(t2) });
    }
  } else {
    // tan: defined everywhere except 90, 270
    const base = Math.atan(k) * (180 / Math.PI);
    if (!range360) {
      // 0 <= theta <= 180: tan is defined at 0-89, 91-180
      const t1 = base < 0 ? base + 180 : base;
      const t1r = Math.round(t1 * 100) / 100;
      if (t1r >= 0 && t1r <= 180 && Math.abs(t1r - 90) > 0.01) {
        solutions.push({ degrees: t1r, radians: degToRadStr(t1r) });
      }
    } else {
      const t1 = base < 0 ? base + 180 : base;
      const t2 = t1 + 180;
      [t1, t2].forEach((t) => {
        const tn = Math.round((t < 0 ? t + 360 : t >= 360 ? t - 360 : t) * 100) / 100;
        if (tn >= 0 && tn < 360 && Math.abs(tn - 90) > 0.01 && Math.abs(tn - 270) > 0.01) {
          solutions.push({ degrees: tn, radians: degToRadStr(tn) });
        }
      });
      solutions.sort((a, b) => a.degrees - b.degrees);
    }
  }

  return solutions;
}

function degToRadStr(deg: number): string {
  const rounded = Math.round(deg);
  // Common exact values
  const known: Record<number, string> = {
    0: "0", 30: "\\pi/6", 45: "\\pi/4", 60: "\\pi/3", 90: "\\pi/2",
    120: "2\\pi/3", 135: "3\\pi/4", 150: "5\\pi/6", 180: "\\pi",
    210: "7\\pi/6", 225: "5\\pi/4", 240: "4\\pi/3", 270: "3\\pi/2",
    300: "5\\pi/3", 315: "7\\pi/4", 330: "11\\pi/6", 360: "2\\pi",
  };
  if (known[rounded] !== undefined) return known[rounded];
  return `${(deg * Math.PI / 180).toFixed(3)}`;
}

interface PracticeProblem {
  func: TrigFunc;
  kTex: string;
  kValue: number;
  explanation: string;
}

const PRACTICE: PracticeProblem[] = [
  {
    func: "sin",
    kTex: "\\dfrac{\\sqrt{3}}{2}",
    kValue: Math.sqrt(3) / 2,
    explanation: "sin 60° = sin 120° = sqrt(3)/2 なので、0 <= theta <= 180 の範囲で theta = 60°, 120°",
  },
  {
    func: "cos",
    kTex: "-\\dfrac{1}{2}",
    kValue: -0.5,
    explanation: "cos 120° = -1/2 なので、0 <= theta <= 180 の範囲で theta = 120°（cos は単調減少）",
  },
  {
    func: "tan",
    kTex: "1",
    kValue: 1,
    explanation: "tan 45° = 1 なので、0 <= theta <= 180 の範囲で theta = 45°",
  },
];

export default function TrigEquationViz() {
  const [func, setFunc] = useState<TrigFunc>("sin");
  const [kSlider, setKSlider] = useState(50); // 0-100 mapped to range
  const [range360, setRange360] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);
  const [practiceRevealed, setPracticeRevealed] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  // Map slider to k value
  const k = useMemo(() => {
    if (func === "tan") {
      // tan range: -5 to 5
      return ((kSlider / 100) * 10 - 5);
    }
    // sin, cos range: -1 to 1
    return ((kSlider / 100) * 2 - 1);
  }, [func, kSlider]);

  const kRounded = Math.round(k * 1000) / 1000;

  const solutions = useMemo(() => solveTrig(func, k, range360), [func, k, range360]);

  // SVG unit circle
  const W = 340;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2;
  const R = 130;

  return (
    <div className="space-y-6">
      {/* Function selector */}
      <div className="flex gap-2">
        {(["sin", "cos", "tan"] as TrigFunc[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFunc(f); setKSlider(50); }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              func === f
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {f} θ = k
          </button>
        ))}
      </div>

      {/* Unit circle SVG */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px]">
          {/* Grid */}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />

          {/* Unit circle */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={W - 10} y={cy - 8} fontSize={11} fill="#94a3b8" textAnchor="end">x</text>
          <text x={cx + 8} y={14} fontSize={11} fill="#94a3b8">y</text>
          <text x={cx + R + 4} y={cy + 14} fontSize={10} fill="#94a3b8">1</text>
          <text x={cx - R - 4} y={cy + 14} fontSize={10} fill="#94a3b8" textAnchor="end">-1</text>
          <text x={cx + 8} y={cy - R + 4} fontSize={10} fill="#94a3b8">1</text>
          <text x={cx + 8} y={cy + R + 14} fontSize={10} fill="#94a3b8">-1</text>

          {/* Angle labels */}
          <text x={cx + R + 8} y={cy + 4} fontSize={10} fill="#64748b">0°</text>
          <text x={cx + 4} y={cy - R - 6} fontSize={10} fill="#64748b">90°</text>
          <text x={cx - R - 24} y={cy + 4} fontSize={10} fill="#64748b">180°</text>
          {range360 && <text x={cx + 4} y={cy + R + 22} fontSize={10} fill="#64748b">270°</text>}

          {/* k reference line */}
          {func === "sin" && k >= -1 && k <= 1 && (
            <line x1={cx - R - 10} y1={cy - k * R} x2={cx + R + 10} y2={cy - k * R}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
          )}
          {func === "cos" && k >= -1 && k <= 1 && (
            <line x1={cx + k * R} y1={cy - R - 10} x2={cx + k * R} y2={cy + R + 10}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
          )}
          {func === "tan" && (
            <>
              {/* tan line at x=1 */}
              <line x1={cx + R} y1={cy - R - 20} x2={cx + R} y2={cy + R + 20}
                stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
              {Math.abs(k) <= 5 && (
                <line x1={cx - R - 10} y1={cy} x2={cx + R + 10} y2={cy}
                  stroke="#f59e0b" strokeWidth={0} />
              )}
            </>
          )}

          {/* Solution points */}
          {solutions.map((sol, i) => {
            const rad = (sol.degrees * Math.PI) / 180;
            const px = cx + R * Math.cos(rad);
            const py = cy - R * Math.sin(rad);
            return (
              <g key={i}>
                {/* Line from center to point */}
                <line x1={cx} y1={cy} x2={px} y2={py} stroke="#3b82f6" strokeWidth={2} opacity={0.5} />
                {/* Point on circle */}
                <circle cx={px} cy={py} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
                {/* Label */}
                <text x={px + (px > cx ? 10 : -10)} y={py + (py > cy ? 16 : -10)}
                  fontSize={11} fontWeight="bold" fill="#ef4444"
                  textAnchor={px > cx ? "start" : "end"}>
                  {Math.round(sol.degrees * 10) / 10}°
                </text>
              </g>
            );
          })}

          {/* Range arc indicator */}
          {!range360 && (
            <path
              d={`M ${cx + R} ${cy} A ${R} ${R} 0 1 0 ${cx - R} ${cy}`}
              fill="none" stroke="#3b82f6" strokeWidth={3} opacity={0.2}
            />
          )}
        </svg>
      </div>

      {/* k slider */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-bold">
            <K tex={`\\${func}\\theta = ${kRounded}`} />
          </span>
          <span className="text-slate-400">
            k = {kRounded}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={kSlider}
          onChange={(e) => setKSlider(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{func === "tan" ? "-5" : "-1"}</span>
          <span>{func === "tan" ? "5" : "1"}</span>
        </div>

        {/* Range toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRange360(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              !range360 ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            0° ≤ θ ≤ 180°
          </button>
          <button
            onClick={() => setRange360(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              range360 ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            0° ≤ θ &lt; 360°
          </button>
        </div>
      </div>

      {/* Solutions display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm mb-3">解</h4>
        {solutions.length === 0 ? (
          <p className="text-sm text-slate-400">この範囲に解はありません。{func !== "tan" && Math.abs(k) > 1 ? `（|k| > 1 のため）` : ""}</p>
        ) : (
          <div className="space-y-2">
            {solutions.map((sol, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <span className="text-sm font-bold text-blue-500">θ{solutions.length > 1 ? `₍${i + 1}₎` : ""}</span>
                <span className="text-sm font-mono">{Math.round(sol.degrees * 10) / 10}°</span>
                <span className="text-xs text-slate-400">=</span>
                <K tex={sol.radians} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation: why two solutions */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-2">なぜ複数の解があるのか？</h4>
        <ul className="text-sm text-indigo-600 dark:text-indigo-300 space-y-1 list-disc list-inside">
          <li>sin θ は 0° と 180° で 0、90° で最大値 1 をとるので、0 &lt; k &lt; 1 のとき 0°〜180° に 2 つの解がある</li>
          <li>cos θ は 0°〜180° で単調減少なので、解は常に 1 つ</li>
          <li>tan θ は 0°〜180°（90° を除く）で単調増加なので、解は常に 1 つ</li>
          <li>範囲を 0°〜360° に広げると、各関数の周期性により解の数が増える</li>
        </ul>
      </div>

      {/* Practice problems */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm mb-4">練習問題</h4>
        <div className="space-y-3">
          {PRACTICE.map((p, i) => {
            const isActive = practiceIndex === i;
            const practiceSolutions = solveTrig(p.func, p.kValue, false);
            return (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">
                    <K tex={`\\${p.func}\\theta = ${p.kTex}`} />
                    <span className="text-xs text-slate-400 ml-2">(0° ≤ θ ≤ 180°)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (isActive) {
                        setPracticeIndex(null);
                        setPracticeRevealed(false);
                      } else {
                        setPracticeIndex(i);
                        setPracticeRevealed(false);
                      }
                    }}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600"
                  >
                    {isActive ? "閉じる" : "解答を見る"}
                  </button>
                </div>
                {isActive && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setPracticeRevealed(true)}
                      className={`text-xs font-bold ${practiceRevealed ? "text-green-500" : "text-blue-500 hover:text-blue-600"}`}
                    >
                      {practiceRevealed ? "解答:" : "クリックして解答を表示"}
                    </button>
                    {practiceRevealed && (
                      <div className="mt-2 space-y-1">
                        {practiceSolutions.map((sol, j) => (
                          <div key={j} className="text-sm">
                            <K tex={`\\theta = ${Math.round(sol.degrees)}° = ${sol.radians}`} />
                          </div>
                        ))}
                        <p className="text-xs text-slate-500 mt-2">{p.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
