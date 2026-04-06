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
  /** 約分前の式 (KaTeX) */
  originalTex: string;
  /** 約分のステップ */
  steps: StepItem[];
  /** 最終結果 (KaTeX) */
  resultTex: string;
  /** 定義域の制限 */
  restrictionTex: string;
}

/* ── Problem data ── */
const PROBLEMS: Problem[] = [
  {
    label: "問題 1",
    originalTex: "\\frac{x^2 - 4}{x - 2}",
    steps: [
      {
        description: "分子を因数分解する",
        tex: "\\frac{x^2 - 4}{x - 2} = \\frac{(x+2)(x-2)}{x - 2}",
      },
      {
        description: "共通因数 (x - 2) で約分する",
        tex: "= \\frac{\\cancel{(x-2)}\\,(x+2)}{\\cancel{(x-2)}} = x + 2",
      },
    ],
    resultTex: "x + 2",
    restrictionTex: "x \\neq 2",
  },
  {
    label: "問題 2",
    originalTex: "\\frac{x^2 - 9}{x^2 + 5x + 6}",
    steps: [
      {
        description: "分子を因数分解: 差の平方公式",
        tex: "x^2 - 9 = (x+3)(x-3)",
      },
      {
        description: "分母を因数分解: たすき掛け",
        tex: "x^2 + 5x + 6 = (x+2)(x+3)",
      },
      {
        description: "共通因数 (x+3) で約分",
        tex: "\\frac{(x+3)(x-3)}{(x+2)(x+3)} = \\frac{x-3}{x+2}",
      },
    ],
    resultTex: "\\frac{x-3}{x+2}",
    restrictionTex: "x \\neq -2,\\; x \\neq -3",
  },
  {
    label: "問題 3",
    originalTex: "\\frac{2x^2 + 4x}{x^2 + 2x}",
    steps: [
      {
        description: "分子を因数分解: 2x でくくる",
        tex: "2x^2 + 4x = 2x(x + 2)",
      },
      {
        description: "分母を因数分解: x でくくる",
        tex: "x^2 + 2x = x(x + 2)",
      },
      {
        description: "共通因数 x(x+2) で約分",
        tex: "\\frac{2x(x+2)}{x(x+2)} = 2",
      },
    ],
    resultTex: "2",
    restrictionTex: "x \\neq 0,\\; x \\neq -2",
  },
  {
    label: "問題 4",
    originalTex: "\\frac{x^2 - 5x + 6}{x^2 - 4x + 4}",
    steps: [
      {
        description: "分子を因数分解",
        tex: "x^2 - 5x + 6 = (x-2)(x-3)",
      },
      {
        description: "分母を因数分解: 完全平方式",
        tex: "x^2 - 4x + 4 = (x-2)^2",
      },
      {
        description: "共通因数 (x-2) で約分",
        tex: "\\frac{(x-2)(x-3)}{(x-2)^2} = \\frac{x-3}{x-2}",
      },
    ],
    resultTex: "\\frac{x-3}{x-2}",
    restrictionTex: "x \\neq 2",
  },
  {
    label: "問題 5",
    originalTex: "\\frac{x^3 - x}{x^2 - 1}",
    steps: [
      {
        description: "分子を因数分解: x でくくってから差の平方",
        tex: "x^3 - x = x(x^2 - 1) = x(x+1)(x-1)",
      },
      {
        description: "分母を因数分解: 差の平方公式",
        tex: "x^2 - 1 = (x+1)(x-1)",
      },
      {
        description: "共通因数 (x+1)(x-1) で約分",
        tex: "\\frac{x(x+1)(x-1)}{(x+1)(x-1)} = x",
      },
    ],
    resultTex: "x",
    restrictionTex: "x \\neq 1,\\; x \\neq -1",
  },
  {
    label: "問題 6",
    originalTex: "\\frac{6x^2 + x - 2}{3x^2 - 5x + 2}",
    steps: [
      {
        description: "分子をたすき掛けで因数分解",
        tex: "6x^2 + x - 2 = (2x - 1)(3x + 2)",
      },
      {
        description: "分母をたすき掛けで因数分解",
        tex: "3x^2 - 5x + 2 = (x - 1)(3x - 2)",
      },
      {
        description: "共通因数がないので約分できない（因数分解した形が最終結果）",
        tex: "\\frac{(2x-1)(3x+2)}{(x-1)(3x-2)}",
      },
    ],
    resultTex: "\\frac{(2x-1)(3x+2)}{(x-1)(3x-2)}",
    restrictionTex: "x \\neq 1,\\; x \\neq \\frac{2}{3}",
  },
];

export default function FractionSimplifyViz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);

  const problem = PROBLEMS[selectedIdx];

  const handleProblemChange = (idx: number) => {
    setSelectedIdx(idx);
    setVisibleStep(0);
  };

  const nextStep = () => {
    setVisibleStep((prev) => Math.min(prev + 1, problem.steps.length));
  };

  const resetSteps = () => {
    setVisibleStep(0);
  };

  const stepColors = [
    "bg-slate-50 border-slate-200",
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-amber-50 border-amber-200",
    "bg-purple-50 border-purple-200",
  ];

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, idx) => (
          <button
            key={p.label}
            onClick={() => handleProblemChange(idx)}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
              selectedIdx === idx
                ? "bg-indigo-100 border-indigo-300 text-indigo-700 border"
                : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Original expression */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-slate-500 mb-3">約分前の式</h3>
        <div className="text-center text-lg">
          <MathDisplay tex={problem.originalTex} displayMode />
        </div>
      </div>

      {/* Step-by-step display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-700">約分のステップ</h3>
          <div className="flex gap-2">
            <button
              onClick={nextStep}
              disabled={visibleStep >= problem.steps.length}
              className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-40"
            >
              次のステップ
            </button>
            <button
              onClick={resetSteps}
              className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {problem.steps.map((step, idx) => {
            if (idx >= visibleStep) return null;
            return (
              <div
                key={idx}
                className={`rounded-xl p-4 border ${stepColors[idx % stepColors.length]} transition-all duration-300`}
              >
                <p className="text-xs text-slate-500 font-bold mb-2">
                  Step {idx + 1}: {step.description}
                </p>
                <div className="text-center text-sm">
                  <MathDisplay tex={step.tex} displayMode />
                </div>
              </div>
            );
          })}

          {/* Final result */}
          {visibleStep >= problem.steps.length && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 space-y-3">
              <p className="text-xs text-indigo-500 font-bold">最終結果</p>
              <div className="text-center text-lg font-bold">
                <MathDisplay tex={problem.resultTex} displayMode />
              </div>
              {/* Domain restriction */}
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-xs text-red-600 font-bold mb-1">
                  定義域の制限 (分母 = 0 となる x を除外)
                </p>
                <div className="text-center text-sm">
                  <MathDisplay tex={`\\text{ただし}\\quad ${problem.restrictionTex}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">分数式の約分のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>分子と分母をそれぞれ因数分解する</li>
          <li>共通因数を見つけて約分（割り算）する</li>
          <li>
            約分で消した因数が 0 になる <MathDisplay tex="x" /> の値は
            <strong>定義域から除外</strong>する
          </li>
          <li>
            <MathDisplay tex="\frac{P(x)}{Q(x)}" /> は{" "}
            <MathDisplay tex="Q(x) \neq 0" /> の範囲でのみ定義される
          </li>
        </ul>
      </div>
    </div>
  );
}
