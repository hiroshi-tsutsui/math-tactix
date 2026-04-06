"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

interface ProblemEntry {
  values: number[];
  probs: number[];
  /** Display-friendly fraction strings for each probability */
  probLabels: string[];
}

interface ProblemData {
  id: number;
  title: string;
  description: string;
  entries: ProblemEntry;
  explanation: string[];
}

const PROBLEMS: ProblemData[] = [
  {
    id: 1,
    title: "サイコロの目の期待値",
    description: "サイコロを1回投げたとき、出る目の期待値を求めよ。",
    entries: {
      values: [1, 2, 3, 4, 5, 6],
      probs: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
      probLabels: ["\\frac{1}{6}", "\\frac{1}{6}", "\\frac{1}{6}", "\\frac{1}{6}", "\\frac{1}{6}", "\\frac{1}{6}"],
    },
    explanation: [
      "E(X) = \\sum_{i=1}^{6} x_i \\cdot P(X=x_i)",
      "= 1 \\times \\frac{1}{6} + 2 \\times \\frac{1}{6} + 3 \\times \\frac{1}{6} + 4 \\times \\frac{1}{6} + 5 \\times \\frac{1}{6} + 6 \\times \\frac{1}{6}",
      "= \\frac{1+2+3+4+5+6}{6} = \\frac{21}{6} = 3.5",
    ],
  },
  {
    id: 2,
    title: "くじ引きの賞金の期待値",
    description: "10本中、1等(3000円)が1本、2等(500円)が2本、ハズレ(0円)が7本のくじがある。1本引くときの賞金の期待値を求めよ。参加費400円と比較して損か得か判断せよ。",
    entries: {
      values: [3000, 500, 0],
      probs: [1 / 10, 2 / 10, 7 / 10],
      probLabels: ["\\frac{1}{10}", "\\frac{2}{10}", "\\frac{7}{10}"],
    },
    explanation: [
      "E(X) = 3000 \\times \\frac{1}{10} + 500 \\times \\frac{2}{10} + 0 \\times \\frac{7}{10}",
      "= 300 + 100 + 0 = 400 \\text{ (円)}",
      "期待値 400円 = 参加費 400円 なので、\\textbf{損も得もない（公正なゲーム）}",
    ],
  },
  {
    id: 3,
    title: "コイン2枚の表の数の期待値",
    description: "コイン2枚を同時に投げたとき、表が出る枚数の期待値を求めよ。",
    entries: {
      values: [0, 1, 2],
      probs: [1 / 4, 2 / 4, 1 / 4],
      probLabels: ["\\frac{1}{4}", "\\frac{2}{4}", "\\frac{1}{4}"],
    },
    explanation: [
      "2枚のコインの表裏の組合せ: HH, HT, TH, TT の4通り",
      "表の数 X: P(X=0)=\\frac{1}{4},\\; P(X=1)=\\frac{2}{4},\\; P(X=2)=\\frac{1}{4}",
      "E(X) = 0 \\times \\frac{1}{4} + 1 \\times \\frac{2}{4} + 2 \\times \\frac{1}{4} = 0 + \\frac{2}{4} + \\frac{2}{4} = 1",
      "コイン1枚で表の期待値は 0.5 なので、2枚なら 0.5 \\times 2 = 1 と一致する",
    ],
  },
  {
    id: 4,
    title: "報酬の期待値と意思決定",
    description: "ゲームA: 確率1/2で200円、確率1/2で0円。ゲームB: 確率1/5で600円、確率4/5で0円。どちらのゲームの期待値が高いか。",
    entries: {
      values: [200, 0],
      probs: [1 / 2, 1 / 2],
      probLabels: ["\\frac{1}{2}", "\\frac{1}{2}"],
    },
    explanation: [
      "\\text{ゲームA}: E(X_A) = 200 \\times \\frac{1}{2} + 0 \\times \\frac{1}{2} = 100 \\text{ 円}",
      "\\text{ゲームB}: E(X_B) = 600 \\times \\frac{1}{5} + 0 \\times \\frac{4}{5} = 120 \\text{ 円}",
      "E(X_B) = 120 > E(X_A) = 100 なので、\\textbf{ゲームBの方が期待値は高い}",
    ],
  },
];

// Game B data for problem 4 display
const GAME_B: ProblemEntry = {
  values: [600, 0],
  probs: [1 / 5, 4 / 5],
  probLabels: ["\\frac{1}{5}", "\\frac{4}{5}"],
};

export default function ExpectedValueViz() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const problem = PROBLEMS[currentProblem];
  const entries = problem.entries;

  // Calculate expected value
  const expectedValue = useMemo(() => {
    return entries.values.reduce((acc, v, i) => acc + v * entries.probs[i], 0);
  }, [entries]);

  // Product terms for step-by-step display
  const terms = useMemo(() => {
    return entries.values.map((v, i) => ({
      value: v,
      prob: entries.probs[i],
      probLabel: entries.probLabels[i],
      product: v * entries.probs[i],
    }));
  }, [entries]);

  // For problem 4, also compute Game B EV
  const gameBExpectedValue = useMemo(() => {
    if (currentProblem !== 3) return 0;
    return GAME_B.values.reduce((acc, v, i) => acc + v * GAME_B.probs[i], 0);
  }, [currentProblem]);

  // Bar chart data
  const barData = useMemo(() => {
    const maxVal = Math.max(...entries.values, 1);
    return entries.values.map((v, i) => ({
      value: v,
      prob: entries.probs[i],
      height: (v / maxVal) * 120,
      contribution: v * entries.probs[i],
    }));
  }, [entries]);

  const W = 360;
  const H = 200;
  const barPad = 40;
  const barAreaW = W - 2 * barPad;
  const barAreaH = H - 60;
  const barWidth = Math.min(40, barAreaW / entries.values.length - 8);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setCurrentProblem(i); setRevealStep(0); setShowAnswer(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              i === currentProblem ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Q{p.id}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="font-bold text-blue-900 mb-1 text-sm">{problem.title}</div>
        <p className="text-sm text-slate-700">{problem.description}</p>
      </div>

      {/* Probability distribution table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2 px-2 text-xs text-slate-500 font-bold"><K tex="X" /></th>
              {entries.values.map((v, i) => (
                <th key={i} className="py-2 px-2 font-bold text-slate-700">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2 px-2 text-xs text-slate-500 font-bold"><K tex="P(X)" /></td>
              {entries.probLabels.map((label, i) => (
                <td key={i} className="py-2 px-2">
                  <K tex={label} />
                </td>
              ))}
            </tr>
            <tr className="bg-green-50">
              <td className="py-2 px-2 text-xs text-green-600 font-bold">
                <K tex="x_i \cdot P" />
              </td>
              {terms.map((t, i) => (
                <td key={i} className={`py-2 px-2 font-bold ${revealStep > i ? "text-green-700" : "text-slate-300"}`}>
                  {revealStep > i ? t.product.toFixed(2) : "?"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Game B table (for problem 4 only) */}
      {currentProblem === 3 && (
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
          <div className="bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border-b border-orange-200">ゲームB</div>
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2 px-2 text-xs text-slate-500 font-bold"><K tex="X" /></th>
                {GAME_B.values.map((v, i) => (
                  <th key={i} className="py-2 px-2 font-bold text-slate-700">{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-2 text-xs text-slate-500 font-bold"><K tex="P(X)" /></td>
                {GAME_B.probLabels.map((label, i) => (
                  <td key={i} className="py-2 px-2"><K tex={label} /></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Step-by-step reveal button */}
      <div className="flex gap-2">
        {revealStep < terms.length && (
          <button
            onClick={() => setRevealStep(revealStep + 1)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            次のステップを表示 ({revealStep + 1}/{terms.length})
          </button>
        )}
        {revealStep >= terms.length && (
          <div className="flex-1 bg-green-100 border border-green-300 rounded-lg p-3 text-center">
            <div className="text-xs text-green-600 font-bold mb-1">期待値</div>
            <K tex={`E(X) = ${terms.map(t => t.product.toFixed(2)).join(" + ")} = ${expectedValue.toFixed(2)}`} />
          </div>
        )}
      </div>

      {/* Visual bar chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">確率分布の視覚化</div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Axis */}
          <line x1={barPad} y1={H - 30} x2={W - barPad} y2={H - 30} stroke="#cbd5e1" strokeWidth={1} />

          {barData.map((d, i) => {
            const x = barPad + (i / entries.values.length) * barAreaW + barWidth / 2;
            const probBarH = d.prob * barAreaH * 3;
            const contribBarH = d.contribution > 0 ? (d.contribution / Math.max(expectedValue, 1)) * barAreaH * 0.6 : 0;
            return (
              <g key={i}>
                {/* Probability bar */}
                <rect
                  x={x - barWidth / 2}
                  y={H - 30 - probBarH}
                  width={barWidth * 0.45}
                  height={probBarH}
                  fill="#93c5fd"
                  rx={2}
                />
                {/* Contribution bar */}
                <rect
                  x={x}
                  y={H - 30 - contribBarH}
                  width={barWidth * 0.45}
                  height={contribBarH}
                  fill={revealStep > i ? "#22c55e" : "#e2e8f0"}
                  rx={2}
                />
                {/* Label */}
                <text x={x} y={H - 16} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#475569">
                  {d.value}
                </text>
              </g>
            );
          })}

          {/* Expected value line */}
          {revealStep >= terms.length && expectedValue > 0 && (
            <>
              <line
                x1={barPad + (expectedValue / Math.max(...entries.values, 1)) * barAreaW * (entries.values.length - 1) / entries.values.length + barWidth / 2}
                y1={10}
                x2={barPad + (expectedValue / Math.max(...entries.values, 1)) * barAreaW * (entries.values.length - 1) / entries.values.length + barWidth / 2}
                y2={H - 30}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              <text
                x={barPad + (expectedValue / Math.max(...entries.values, 1)) * barAreaW * (entries.values.length - 1) / entries.values.length + barWidth / 2}
                y={8}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill="#ef4444"
              >
                E(X)={expectedValue.toFixed(2)}
              </text>
            </>
          )}

          {/* Legend */}
          <rect x={W - 100} y={10} width={10} height={10} fill="#93c5fd" rx={2} />
          <text x={W - 85} y={19} fontSize={9} fill="#64748b">確率 P</text>
          <rect x={W - 100} y={25} width={10} height={10} fill="#22c55e" rx={2} />
          <text x={W - 85} y={34} fontSize={9} fill="#64748b">寄与 x*P</text>
        </svg>
      </div>

      {/* Formula */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
        <div className="text-xs font-bold text-slate-400 mb-2">期待値の公式</div>
        <K tex="E(X) = \sum_{i} x_i \cdot P(X = x_i)" display />
      </div>

      {/* Answer / Explanation */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {showAnswer ? "解説を隠す" : "解説を見る"}
      </button>

      {showAnswer && (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-2">
          <div className="font-bold text-yellow-800 text-sm mb-2">解説</div>
          {problem.explanation.map((step, i) => (
            <div key={i} className="text-sm">
              <K tex={step} />
            </div>
          ))}
          {currentProblem === 3 && (
            <div className="mt-2 bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
              <K tex={`E(X_A) = ${expectedValue.toFixed(0)} \\text{ 円},\\quad E(X_B) = ${gameBExpectedValue.toFixed(0)} \\text{ 円}`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
