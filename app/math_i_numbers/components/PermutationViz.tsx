"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function permutation(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

const BALL_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
  "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4",
];

export default function PermutationViz() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [mode, setMode] = useState<"permutation" | "combination">("permutation");

  const nPr = useMemo(() => permutation(n, r), [n, r]);
  const nCr = useMemo(() => combination(n, r), [n, r]);
  const rFact = useMemo(() => factorial(r), [r]);

  // Balls grid layout
  const balls = useMemo(() => {
    const items: { id: number; selected: boolean; label: string }[] = [];
    for (let i = 0; i < n; i++) {
      items.push({
        id: i,
        selected: i < r,
        label: String.fromCharCode(65 + i), // A, B, C, ...
      });
    }
    return items;
  }, [n, r]);

  // Grid dimensions for ball layout
  const cols = Math.min(n, 5);
  const ballSize = 48;
  const gap = 12;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">
            n（全体の個数）: <span className="text-indigo-600 font-bold">{n}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={n}
            onChange={(e) => {
              const newN = Number(e.target.value);
              setN(newN);
              if (r > newN) setR(newN);
            }}
            className="w-full accent-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">
            r（取り出す個数）: <span className="text-indigo-600 font-bold">{r}</span>
          </label>
          <input
            type="range"
            min={0}
            max={n}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("permutation")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "permutation"
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          順列 (Permutation)
        </button>
        <button
          onClick={() => setMode("combination")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "combination"
              ? "bg-pink-100 text-pink-700 border border-pink-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          組み合わせ (Combination)
        </button>
      </div>

      {/* Ball Visualization */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          {mode === "permutation" ? "順列: 順序あり" : "組み合わせ: 順序なし"}
        </h3>

        {/* All n balls */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">全体（{n}個）</p>
          <div className="flex flex-wrap gap-3">
            {balls.map((ball) => (
              <div
                key={ball.id}
                className={`relative flex items-center justify-center rounded-full font-bold text-white text-sm transition-all duration-300 ${
                  ball.selected ? "scale-110 shadow-lg" : "opacity-40"
                }`}
                style={{
                  width: ballSize,
                  height: ballSize,
                  backgroundColor: BALL_COLORS[ball.id % BALL_COLORS.length],
                }}
              >
                {ball.label}
                {ball.selected && mode === "permutation" && (
                  <span
                    className="absolute -top-2 -right-2 bg-white text-indigo-600 border border-indigo-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm"
                  >
                    {ball.id + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected r balls */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-2">
            選ばれた{r}個{mode === "permutation" ? "（順序あり）" : "（順序なし）"}
          </p>
          <div className="flex flex-wrap gap-3">
            {balls.filter((b) => b.selected).map((ball, idx) => (
              <div key={ball.id} className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center justify-center rounded-full font-bold text-white text-sm shadow-lg"
                  style={{
                    width: ballSize,
                    height: ballSize,
                    backgroundColor: BALL_COLORS[ball.id % BALL_COLORS.length],
                  }}
                >
                  {ball.label}
                </div>
                {mode === "permutation" && (
                  <span className="text-[10px] font-bold text-indigo-500">
                    {idx + 1}位
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculation Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Permutation */}
        <div className={`rounded-xl p-5 border transition-all ${
          mode === "permutation"
            ? "bg-indigo-50 border-indigo-200 shadow-sm"
            : "bg-slate-50 border-slate-100"
        }`}>
          <h4 className="text-sm font-bold text-slate-700 mb-3">順列 (Permutation)</h4>
          <div className="space-y-2">
            <KBlock
              tex={`{}_{${n}}\\mathrm{P}_{${r}} = \\frac{${n}!}{(${n}-${r})!} = \\frac{${factorial(n)}}{${factorial(n - r)}} = ${nPr}`}
            />
            <p className="text-xs text-slate-500 mt-2">
              {n}個から{r}個を取り出して<strong>並べる</strong>場合の数 = <strong>{nPr}通り</strong>
            </p>
          </div>
        </div>

        {/* Combination */}
        <div className={`rounded-xl p-5 border transition-all ${
          mode === "combination"
            ? "bg-pink-50 border-pink-200 shadow-sm"
            : "bg-slate-50 border-slate-100"
        }`}>
          <h4 className="text-sm font-bold text-slate-700 mb-3">組み合わせ (Combination)</h4>
          <div className="space-y-2">
            <KBlock
              tex={`{}_{${n}}\\mathrm{C}_{${r}} = \\frac{${n}!}{${r}!\\cdot(${n}-${r})!} = \\frac{${factorial(n)}}{${factorial(r)} \\times ${factorial(n - r)}} = ${nCr}`}
            />
            <p className="text-xs text-slate-500 mt-2">
              {n}個から{r}個を<strong>選ぶ</strong>場合の数 = <strong>{nCr}通り</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Relationship */}
      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
        <h4 className="text-sm font-bold text-amber-800 mb-3">順列と組み合わせの関係</h4>
        <KBlock
          tex={`{}_{${n}}\\mathrm{P}_{${r}} = {}_{${n}}\\mathrm{C}_{${r}} \\times ${r}! \\quad \\Rightarrow \\quad ${nPr} = ${nCr} \\times ${rFact}`}
        />
        <p className="text-xs text-amber-700 mt-3">
          順列は組み合わせの <K tex={`${r}! = ${rFact}`} /> 倍。
          組み合わせで選んだ{r}個を並べる方法が <K tex={`${r}!`} /> 通りあるから。
        </p>
      </div>

      {/* Concrete example */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-2">具体例</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          {n}人から{r}人を選んで<strong>並べる</strong>場合の数は{" "}
          <K tex={`{}_{${n}}\\mathrm{P}_{${r}} = ${nPr}`} /> 通り。
          {n}人から{r}人を<strong>選ぶだけ</strong>なら{" "}
          <K tex={`{}_{${n}}\\mathrm{C}_{${r}} = ${nCr}`} /> 通り。
        </p>
      </div>

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "順列は並べる順序が重要（A→B→C と C→B→A は別の並べ方）" },
          { step: 2, text: "nPr = n × (n-1) × ... × (n-r+1) = n! / (n-r)!" },
          { step: 3, text: "組み合わせは順序を無視（{A,B,C} と {C,B,A} は同じ選び方）" },
          { step: 4, text: "nCr = nPr / r!（r個の並べ方 r! で割ることで順序を無視する）" },
        ]}
      />
    </div>
  );
}
