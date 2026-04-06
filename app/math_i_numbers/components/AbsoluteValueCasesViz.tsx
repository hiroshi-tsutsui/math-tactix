"use client";

import React, { useState, useEffect, useRef } from "react";
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

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

interface Problem {
  id: string;
  label: string;
  questionTex: string;
  boundaries: number[];
  steps: {
    description: string;
    mathTex: string;
    reason: string;
  }[];
  answerTex: string;
  // number line range & solution highlights
  lineMin: number;
  lineMax: number;
  solutionPoints?: number[];       // specific solutions (equations)
  solutionRange?: [number, number]; // range solutions (inequalities), inclusive endpoints if open=false
  solutionRangeOpen?: [boolean, boolean]; // open endpoints
}

const PROBLEMS: Problem[] = [
  {
    id: "eq1",
    label: "方程式",
    questionTex: "|x - 2| = 3",
    boundaries: [2],
    steps: [
      {
        description: "絶対値の定義を確認する",
        mathTex: "|x - 2| = \\begin{cases} x - 2 & (x \\ge 2) \\\\ -(x - 2) & (x < 2) \\end{cases}",
        reason: "x=2 が場合分けの境界。x-2 の符号が正か負かで式が変わる。",
      },
      {
        description: "場合1: x >= 2 のとき",
        mathTex: "x - 2 = 3 \\quad \\Rightarrow \\quad x = 5",
        reason: "x=5 >= 2 を満たすので、これは有効な解。",
      },
      {
        description: "場合2: x < 2 のとき",
        mathTex: "-(x - 2) = 3 \\quad \\Rightarrow \\quad -x + 2 = 3 \\quad \\Rightarrow \\quad x = -1",
        reason: "x=-1 < 2 を満たすので、これも有効な解。",
      },
      {
        description: "答えをまとめる",
        mathTex: "x = 5 \\quad \\text{または} \\quad x = -1",
        reason: "2つの場合分けから、解は2つ得られた。",
      },
    ],
    answerTex: "x = 5,\\; x = -1",
    lineMin: -3,
    lineMax: 7,
    solutionPoints: [5, -1],
  },
  {
    id: "ineq1",
    label: "不等式",
    questionTex: "|x + 1| < 4",
    boundaries: [-1],
    steps: [
      {
        description: "絶対値の不等式を変形する",
        mathTex: "|x + 1| < 4 \\quad \\Leftrightarrow \\quad -4 < x + 1 < 4",
        reason: "|A| < k は -k < A < k と同値 (k > 0)。",
      },
      {
        description: "各辺から1を引く",
        mathTex: "-4 - 1 < x < 4 - 1 \\quad \\Rightarrow \\quad -5 < x < 3",
        reason: "不等式の各辺を同じ数だけ引いてxを求める。",
      },
      {
        description: "答え",
        mathTex: "-5 < x < 3",
        reason: "数直線上で -5 と 3 の間の開区間が解。",
      },
    ],
    answerTex: "-5 < x < 3",
    lineMin: -7,
    lineMax: 5,
    solutionRange: [-5, 3],
    solutionRangeOpen: [true, true],
  },
  {
    id: "two_abs",
    label: "絶対値2つ",
    questionTex: "|x - 1| + |x - 3|",
    boundaries: [1, 3],
    steps: [
      {
        description: "場合分けの境界を特定する",
        mathTex: "|x - 1| \\to x = 1,\\quad |x - 3| \\to x = 3",
        reason: "2つの絶対値それぞれの中身が0になる点が境界。",
      },
      {
        description: "場合1: x < 1 のとき",
        mathTex: "-(x-1) + (-(x-3)) = -x+1-x+3 = -2x + 4",
        reason: "x < 1 では x-1 < 0 かつ x-3 < 0 なので、両方にマイナスをつける。",
      },
      {
        description: "場合2: 1 <= x < 3 のとき",
        mathTex: "(x-1) + (-(x-3)) = x-1-x+3 = 2",
        reason: "x-1 >= 0 だが x-3 < 0。1と3の間では値は定数2。",
      },
      {
        description: "場合3: x >= 3 のとき",
        mathTex: "(x-1) + (x-3) = 2x - 4",
        reason: "x >= 3 では両方とも0以上なので、そのまま。",
      },
      {
        description: "まとめ",
        mathTex: "|x-1|+|x-3| = \\begin{cases} -2x+4 & (x < 1) \\\\ 2 & (1 \\le x \\le 3) \\\\ 2x-4 & (x > 3) \\end{cases}",
        reason: "最小値は2（1 <= x <= 3 の区間で一定）。「2点間の距離の和」の最小値は2点間の距離に等しい。",
      },
    ],
    answerTex: "\\text{最小値} = 2 \\;(1 \\le x \\le 3)",
    lineMin: -1,
    lineMax: 5,
  },
];

export default function AbsoluteValueCasesViz() {
  const [problemIdx, setProblemIdx] = useState(0);
  const [step, setStep] = useState(0);

  const problem = PROBLEMS[problemIdx];
  const maxStep = problem.steps.length - 1;

  const renderNumberLine = () => {
    const W = 380;
    const H = 80;
    const padL = 30;
    const padR = 30;
    const plotW = W - padL - padR;
    const midY = 40;

    const { lineMin, lineMax, boundaries, solutionPoints, solutionRange, solutionRangeOpen } = problem;
    const range = lineMax - lineMin;
    const toX = (v: number) => padL + ((v - lineMin) / range) * plotW;

    // Integer ticks
    const ticks: number[] = [];
    for (let i = Math.ceil(lineMin); i <= Math.floor(lineMax); i++) {
      ticks.push(i);
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 100 }}>
        {/* Main line */}
        <line x1={padL} y1={midY} x2={W - padR} y2={midY} stroke="#334155" strokeWidth={1.5} />
        <polygon points={`${W - padR},${midY} ${W - padR - 6},${midY - 4} ${W - padR - 6},${midY + 4}`} fill="#334155" />

        {/* Ticks */}
        {ticks.map((v) => (
          <g key={v}>
            <line x1={toX(v)} y1={midY - 5} x2={toX(v)} y2={midY + 5} stroke="#94a3b8" strokeWidth={1} />
            <text x={toX(v)} y={midY + 18} textAnchor="middle" fontSize={9} fill="#64748b">
              {v}
            </text>
          </g>
        ))}

        {/* Boundary lines */}
        {boundaries.map((b, i) => (
          <g key={`b-${i}`}>
            <line x1={toX(b)} y1={midY - 20} x2={toX(b)} y2={midY + 5} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4,2" />
            <text x={toX(b)} y={midY - 23} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold">
              x={b}
            </text>
          </g>
        ))}

        {/* Solution range */}
        {solutionRange && step === maxStep && (
          <>
            <line x1={toX(solutionRange[0])} y1={midY - 3} x2={toX(solutionRange[1])} y2={midY - 3} stroke="#22c55e" strokeWidth={4} />
            <circle cx={toX(solutionRange[0])} cy={midY - 3} r={4}
              fill={solutionRangeOpen?.[0] ? "#ffffff" : "#22c55e"}
              stroke="#22c55e" strokeWidth={2} />
            <circle cx={toX(solutionRange[1])} cy={midY - 3} r={4}
              fill={solutionRangeOpen?.[1] ? "#ffffff" : "#22c55e"}
              stroke="#22c55e" strokeWidth={2} />
          </>
        )}

        {/* Solution points */}
        {solutionPoints && step === maxStep && solutionPoints.map((p, i) => (
          <g key={`sol-${i}`}>
            <circle cx={toX(p)} cy={midY} r={6} fill="#22c55e" />
            <text x={toX(p)} y={midY - 10} textAnchor="middle" fontSize={9} fill="#22c55e" fontWeight="bold">
              x={p}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-lg font-bold mb-1">絶対値の場合分け計算</h2>
        <p className="text-xs text-slate-500">
          境界を見つけて場合分けし、絶対値を外す
        </p>
      </div>

      {/* Problem Selector */}
      <div className="flex justify-center gap-2">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setProblemIdx(i); setStep(0); }}
            className={`px-3 py-2 text-xs font-bold rounded-lg border ${
              problemIdx === i
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-4 text-center">
        <div className="text-[10px] text-indigo-400 font-bold mb-1">問題</div>
        <div className="text-lg font-bold text-indigo-700">
          <K tex={problem.questionTex} />
        </div>
      </div>

      {/* Number Line */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3">
        <p className="text-[10px] text-slate-400 font-bold mb-1 text-center">数直線</p>
        {renderNumberLine()}
        <p className="text-[10px] text-amber-600 text-center mt-1">
          黄色の破線 = 場合分けの境界
        </p>
      </div>

      {/* Why case split */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <h4 className="text-sm font-bold text-slate-700 mb-2">なぜ場合分けするのか？</h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          絶対値 <K tex="|x - a|" /> は「<K tex="x" /> と <K tex="a" /> の距離」を表します。
          <K tex="x \ge a" /> のとき <K tex="|x-a| = x-a" />、
          <K tex="x < a" /> のとき <K tex="|x-a| = -(x-a)" /> となるため、
          境界 <K tex="x = a" /> の前後で式が変わります。
          場合分けすることで絶対値を外し、通常の方程式・不等式として解くことができます。
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {problem.steps.slice(0, step + 1).map((s, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border p-4 ${
              i === step ? "border-indigo-300 shadow-sm" : "border-slate-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800 mb-1">{s.description}</h4>
                <div className="bg-slate-50 p-3 rounded-xl mb-2">
                  <KBlock tex={s.mathTex} />
                </div>
                <p className="text-xs text-slate-500">{s.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
        >
          前のステップ
        </button>
        <span className="px-3 py-2 text-xs text-slate-400 font-bold">
          Step {step + 1} / {maxStep + 1}
        </span>
        <button
          onClick={() => setStep(Math.min(maxStep, step + 1))}
          disabled={step === maxStep}
          className="px-4 py-2 text-xs font-bold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 disabled:opacity-40 hover:bg-indigo-100"
        >
          次のステップ
        </button>
      </div>

      {/* Answer */}
      {step === maxStep && (
        <div className="bg-green-50 rounded-2xl border border-green-200 p-4 text-center">
          <div className="text-[10px] text-green-500 font-bold mb-1">答え</div>
          <div className="text-lg font-bold text-green-700">
            <K tex={problem.answerTex} />
          </div>
        </div>
      )}

      {/* Formula Reference */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          絶対値の基本定義
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <KBlock tex="|x| = \begin{cases} x & (x \ge 0) \\ -x & (x < 0) \end{cases}" />
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">不等式の同値変換 (k &gt; 0)</div>
            <KBlock tex="|A| < k \iff -k < A < k" />
            <KBlock tex="|A| > k \iff A < -k \;\text{or}\; A > k" />
          </div>
        </div>
      </div>
    </div>
  );
}
