"use client";

import React, { useState } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";

/* ── Types ── */
interface StepItem {
  description: string;
  tex: string;
}

interface Problem {
  label: string;
  originalTex: string;
  steps: StepItem[];
  resultTex: string;
}

/* ── 1st-order rationalization problems (1/√a → √a/a) ── */
const FIRST_ORDER: Problem[] = [
  {
    label: "問題 1",
    originalTex: "\\frac{1}{\\sqrt{3}}",
    steps: [
      { description: "分母と分子に √3 を掛ける", tex: "\\frac{1}{\\sqrt{3}} \\times \\frac{\\sqrt{3}}{\\sqrt{3}}" },
      { description: "分母を計算する", tex: "\\frac{\\sqrt{3}}{(\\sqrt{3})^2} = \\frac{\\sqrt{3}}{3}" },
    ],
    resultTex: "\\frac{\\sqrt{3}}{3}",
  },
  {
    label: "問題 2",
    originalTex: "\\frac{2}{\\sqrt{5}}",
    steps: [
      { description: "分母と分子に √5 を掛ける", tex: "\\frac{2}{\\sqrt{5}} \\times \\frac{\\sqrt{5}}{\\sqrt{5}}" },
      { description: "分母を計算する", tex: "\\frac{2\\sqrt{5}}{(\\sqrt{5})^2} = \\frac{2\\sqrt{5}}{5}" },
    ],
    resultTex: "\\frac{2\\sqrt{5}}{5}",
  },
  {
    label: "問題 3",
    originalTex: "\\frac{6}{\\sqrt{2}}",
    steps: [
      { description: "分母と分子に √2 を掛ける", tex: "\\frac{6}{\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}}" },
      { description: "分母を計算し約分する", tex: "\\frac{6\\sqrt{2}}{2} = 3\\sqrt{2}" },
    ],
    resultTex: "3\\sqrt{2}",
  },
];

/* ── 2nd-order rationalization problems (conjugate) ── */
const SECOND_ORDER: Problem[] = [
  {
    label: "問題 1",
    originalTex: "\\frac{1}{\\sqrt{3} + \\sqrt{2}}",
    steps: [
      { description: "共役式 (√3 − √2) を分母と分子に掛ける", tex: "\\frac{1}{\\sqrt{3}+\\sqrt{2}} \\times \\frac{\\sqrt{3}-\\sqrt{2}}{\\sqrt{3}-\\sqrt{2}}" },
      { description: "分母: (√3+√2)(√3−√2) = 3 − 2 = 1", tex: "\\frac{\\sqrt{3}-\\sqrt{2}}{(\\sqrt{3})^2 - (\\sqrt{2})^2} = \\frac{\\sqrt{3}-\\sqrt{2}}{1}" },
      { description: "結果", tex: "\\sqrt{3} - \\sqrt{2}" },
    ],
    resultTex: "\\sqrt{3} - \\sqrt{2}",
  },
  {
    label: "問題 2",
    originalTex: "\\frac{1}{\\sqrt{5} - \\sqrt{3}}",
    steps: [
      { description: "共役式 (√5 + √3) を分母と分子に掛ける", tex: "\\frac{1}{\\sqrt{5}-\\sqrt{3}} \\times \\frac{\\sqrt{5}+\\sqrt{3}}{\\sqrt{5}+\\sqrt{3}}" },
      { description: "分母: (√5−√3)(√5+√3) = 5 − 3 = 2", tex: "\\frac{\\sqrt{5}+\\sqrt{3}}{5-3} = \\frac{\\sqrt{5}+\\sqrt{3}}{2}" },
    ],
    resultTex: "\\frac{\\sqrt{5}+\\sqrt{3}}{2}",
  },
  {
    label: "問題 3",
    originalTex: "\\frac{3}{2\\sqrt{7} + \\sqrt{5}}",
    steps: [
      { description: "共役式 (2√7 − √5) を分母と分子に掛ける", tex: "\\frac{3}{2\\sqrt{7}+\\sqrt{5}} \\times \\frac{2\\sqrt{7}-\\sqrt{5}}{2\\sqrt{7}-\\sqrt{5}}" },
      { description: "分母: (2√7)² − (√5)² = 28 − 5 = 23", tex: "\\frac{3(2\\sqrt{7}-\\sqrt{5})}{28-5} = \\frac{6\\sqrt{7}-3\\sqrt{5}}{23}" },
    ],
    resultTex: "\\frac{6\\sqrt{7}-3\\sqrt{5}}{23}",
  },
];

type TabId = "first" | "second";

export default function RationalizationAdvancedViz() {
  const [tab, setTab] = useState<TabId>("first");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);

  const problems = tab === "first" ? FIRST_ORDER : SECOND_ORDER;
  const problem = problems[currentIdx];

  const handleTabChange = (t: TabId) => {
    setTab(t);
    setCurrentIdx(0);
    setVisibleStep(0);
  };

  const handleProblemChange = (idx: number) => {
    setCurrentIdx(idx);
    setVisibleStep(0);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange("first")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === "first"
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          1次有理化
        </button>
        <button
          onClick={() => handleTabChange("second")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === "second"
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          2次有理化（共役式）
        </button>
      </div>

      {/* Problem selector */}
      <div className="flex gap-2">
        {problems.map((p, i) => (
          <button
            key={i}
            onClick={() => handleProblemChange(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentIdx === i
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Original expression */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm text-center">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">元の式</div>
        <div className="text-2xl">
          <MathDisplay tex={problem.originalTex} displayMode />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {problem.steps.map((step, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${
              i <= visibleStep ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
          >
            <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium text-slate-700">{step.description}</div>
                <div className="text-lg">
                  <MathDisplay tex={step.tex} displayMode />
                </div>
              </div>
            </div>
            {i < problem.steps.length - 1 && i <= visibleStep && (
              <div className="flex justify-center text-slate-300 text-xl my-1">↓</div>
            )}
          </div>
        ))}
      </div>

      {/* Show next step button */}
      {visibleStep < problem.steps.length - 1 && (
        <button
          onClick={() => setVisibleStep((v) => v + 1)}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
        >
          次のステップを表示 →
        </button>
      )}

      {/* Result */}
      {visibleStep >= problem.steps.length - 1 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
          <div className="text-xs text-green-600 uppercase tracking-widest font-bold">最終結果</div>
          <div className="text-2xl">
            <MathDisplay tex={problem.resultTex} displayMode />
          </div>
        </div>
      )}

      {/* Formula reference */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">公式</div>
        {tab === "first" ? (
          <div className="space-y-2">
            <MathDisplay tex="\\frac{1}{\\sqrt{a}} = \\frac{1}{\\sqrt{a}} \\times \\frac{\\sqrt{a}}{\\sqrt{a}} = \\frac{\\sqrt{a}}{a}" displayMode />
            <p className="text-xs text-slate-500">分母と分子に同じ平方根を掛けて、分母を有理数にする。</p>
          </div>
        ) : (
          <div className="space-y-2">
            <MathDisplay tex="\\frac{1}{\\sqrt{a} + \\sqrt{b}} = \\frac{\\sqrt{a} - \\sqrt{b}}{(\\sqrt{a})^2 - (\\sqrt{b})^2} = \\frac{\\sqrt{a} - \\sqrt{b}}{a - b}" displayMode />
            <p className="text-xs text-slate-500">
              共役式（分母の符号を反転した式）を掛けると、分母は差の二乗の公式により有理数になる。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
