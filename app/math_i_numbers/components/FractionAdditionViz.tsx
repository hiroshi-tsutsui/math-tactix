"use client";

import React, { useState } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from "../../components/HintButton";

/* ── Types ── */
interface StepItem {
  description: string;
  tex: string;
}

interface Problem {
  label: string;
  /** 元の式 (KaTeX) */
  originalTex: string;
  /** 通分のステップ */
  steps: StepItem[];
  /** 最終結果 (KaTeX) */
  resultTex: string;
  /** LCD (最小公倍式) */
  lcdTex: string;
  /** 定義域の制限 */
  restrictionTex: string;
}

/* ── Problem data ── */
const PROBLEMS: Problem[] = [
  {
    label: "問題 1",
    originalTex: "\\frac{1}{x-1} + \\frac{1}{x+1}",
    lcdTex: "(x-1)(x+1) = x^2 - 1",
    steps: [
      {
        description: "LCD（最小公倍式）を求める",
        tex: "\\text{LCD} = (x-1)(x+1)",
      },
      {
        description: "各分数を通分する",
        tex: "\\frac{1 \\cdot (x+1)}{(x-1)(x+1)} + \\frac{1 \\cdot (x-1)}{(x+1)(x-1)}",
      },
      {
        description: "分子を展開して足す",
        tex: "\\frac{(x+1) + (x-1)}{(x-1)(x+1)} = \\frac{2x}{x^2 - 1}",
      },
    ],
    resultTex: "\\frac{2x}{x^2 - 1}",
    restrictionTex: "x \\neq 1,\\; x \\neq -1",
  },
  {
    label: "問題 2",
    originalTex: "\\frac{2}{x+3} - \\frac{1}{x-2}",
    lcdTex: "(x+3)(x-2)",
    steps: [
      {
        description: "LCD を求める",
        tex: "\\text{LCD} = (x+3)(x-2)",
      },
      {
        description: "各分数を通分する",
        tex: "\\frac{2(x-2)}{(x+3)(x-2)} - \\frac{1(x+3)}{(x-2)(x+3)}",
      },
      {
        description: "分子を展開して引く",
        tex: "\\frac{2(x-2) - (x+3)}{(x+3)(x-2)} = \\frac{2x - 4 - x - 3}{(x+3)(x-2)} = \\frac{x - 7}{(x+3)(x-2)}",
      },
    ],
    resultTex: "\\frac{x - 7}{(x+3)(x-2)}",
    restrictionTex: "x \\neq -3,\\; x \\neq 2",
  },
  {
    label: "問題 3",
    originalTex: "\\frac{x}{x+2} + \\frac{3}{x^2 + 2x}",
    lcdTex: "x(x+2)",
    steps: [
      {
        description: "分母を因数分解する",
        tex: "x^2 + 2x = x(x+2)",
      },
      {
        description: "LCD を求める（すでに x(x+2)）",
        tex: "\\text{LCD} = x(x+2)",
      },
      {
        description: "第1項を通分する",
        tex: "\\frac{x \\cdot x}{x(x+2)} + \\frac{3}{x(x+2)} = \\frac{x^2 + 3}{x(x+2)}",
      },
    ],
    resultTex: "\\frac{x^2 + 3}{x(x+2)}",
    restrictionTex: "x \\neq 0,\\; x \\neq -2",
  },
  {
    label: "問題 4",
    originalTex: "\\frac{1}{x^2 - 1} + \\frac{1}{x + 1}",
    lcdTex: "(x+1)(x-1)",
    steps: [
      {
        description: "分母を因数分解する",
        tex: "x^2 - 1 = (x+1)(x-1)",
      },
      {
        description: "LCD を求める",
        tex: "\\text{LCD} = (x+1)(x-1)",
      },
      {
        description: "第2項を通分して足す",
        tex: "\\frac{1}{(x+1)(x-1)} + \\frac{x-1}{(x+1)(x-1)} = \\frac{1 + (x-1)}{(x+1)(x-1)} = \\frac{x}{(x+1)(x-1)}",
      },
    ],
    resultTex: "\\frac{x}{(x+1)(x-1)}",
    restrictionTex: "x \\neq 1,\\; x \\neq -1",
  },
  {
    label: "問題 5",
    originalTex: "\\frac{2}{x-3} + \\frac{x+1}{x^2 - 9}",
    lcdTex: "(x-3)(x+3)",
    steps: [
      {
        description: "分母を因数分解する",
        tex: "x^2 - 9 = (x-3)(x+3)",
      },
      {
        description: "LCD を求める",
        tex: "\\text{LCD} = (x-3)(x+3)",
      },
      {
        description: "第1項を通分して足す",
        tex: "\\frac{2(x+3)}{(x-3)(x+3)} + \\frac{x+1}{(x-3)(x+3)} = \\frac{2x + 6 + x + 1}{(x-3)(x+3)} = \\frac{3x + 7}{(x-3)(x+3)}",
      },
    ],
    resultTex: "\\frac{3x + 7}{(x-3)(x+3)}",
    restrictionTex: "x \\neq 3,\\; x \\neq -3",
  },
];

export default function FractionAdditionViz() {
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
        <h3 className="font-bold text-sm text-slate-500 mb-3">通分前の式</h3>
        <div className="text-center text-lg">
          <MathDisplay tex={problem.originalTex} displayMode />
        </div>
      </div>

      {/* Step-by-step display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-700">通分のステップ</h3>
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
                  定義域の制限（分母 = 0 となる x を除外）
                </p>
                <div className="text-center text-sm">
                  <MathDisplay tex={`\\text{ただし}\\quad ${problem.restrictionTex}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LCD explanation */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
        <h4 className="font-bold text-amber-700 text-sm mb-2">この問題の LCD（最小公倍式）</h4>
        <div className="text-center text-sm">
          <MathDisplay tex={problem.lcdTex} displayMode />
        </div>
      </div>

      {/* Hint */}
      <HintButton hints={[
        { step: 1, text: "各分母を因数分解して、LCD（最小公倍式）を求めましょう。" },
        { step: 2, text: "各分数の分子・分母に足りない因数を掛けて通分します。" },
        { step: 3, text: "通分後、分子どうしを加減して展開・整理します。約分できる場合はさらに簡単にしましょう。" },
        { step: 4, text: "元の各分母が 0 になる x の値は定義域から除外することを忘れずに。" },
      ]} />

      {/* General explanation */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">分数式の通分・加減算のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>各分母を因数分解して、共通因数を見つける</li>
          <li>LCD = 各分母の因数をすべて含む最小の式</li>
          <li>各分数の分子・分母に、足りない因数を掛けて通分する</li>
          <li>通分後、分子どうしを足す（引く）</li>
          <li>
            結果の分子が因数分解できる場合はさらに約分する
          </li>
          <li>
            元の各分母が 0 になる <MathDisplay tex="x" /> の値は
            <strong>定義域から除外</strong>する
          </li>
        </ul>
      </div>
    </div>
  );
}
