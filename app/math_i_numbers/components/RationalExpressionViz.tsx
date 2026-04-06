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

interface StepItem {
  description: string;
  tex: string;
}

interface Problem {
  label: string;
  category: "simplify" | "common_denom" | "rationalize";
  steps: StepItem[];
  resultTex: string;
}

const PROBLEMS: Problem[] = [
  // --- Simplify (約分) ---
  {
    label: "約分 (1)",
    category: "simplify",
    steps: [
      { description: "分子・分母を因数分解する", tex: "\\frac{x^2 - 4}{x^2 + 2x} = \\frac{(x+2)(x-2)}{x(x+2)}" },
      { description: "共通因数 (x+2) で約分", tex: "= \\frac{x-2}{x}" },
    ],
    resultTex: "\\frac{x-2}{x} \\quad (x \\neq 0,\\, x \\neq -2)",
  },
  {
    label: "約分 (2)",
    category: "simplify",
    steps: [
      { description: "分子・分母を因数分解する", tex: "\\frac{x^2 - 5x + 6}{x^2 - 9} = \\frac{(x-2)(x-3)}{(x+3)(x-3)}" },
      { description: "共通因数 (x-3) で約分", tex: "= \\frac{x-2}{x+3}" },
    ],
    resultTex: "\\frac{x-2}{x+3} \\quad (x \\neq 3,\\, x \\neq -3)",
  },
  {
    label: "約分 (3)",
    category: "simplify",
    steps: [
      { description: "分子・分母を因数分解する", tex: "\\frac{2x^2 + 6x}{4x^2 - 12x} = \\frac{2x(x+3)}{4x(x-3)}" },
      { description: "共通因数 2x で約分", tex: "= \\frac{x+3}{2(x-3)}" },
    ],
    resultTex: "\\frac{x+3}{2(x-3)} \\quad (x \\neq 0,\\, x \\neq 3)",
  },
  // --- Common denominator (通分) ---
  {
    label: "通分 (1)",
    category: "common_denom",
    steps: [
      { description: "各分母を確認", tex: "\\frac{1}{x} + \\frac{2}{x+1}" },
      { description: "最小公倍数: x(x+1)。分子をそれぞれ調整", tex: "= \\frac{1 \\cdot (x+1)}{x(x+1)} + \\frac{2 \\cdot x}{x(x+1)}" },
      { description: "分子をまとめる", tex: "= \\frac{x + 1 + 2x}{x(x+1)} = \\frac{3x + 1}{x(x+1)}" },
    ],
    resultTex: "\\frac{3x+1}{x(x+1)}",
  },
  {
    label: "通分 (2)",
    category: "common_denom",
    steps: [
      { description: "各分母を確認", tex: "\\frac{2}{x-1} - \\frac{1}{x+2}" },
      { description: "最小公倍数: (x-1)(x+2)", tex: "= \\frac{2(x+2)}{(x-1)(x+2)} - \\frac{1(x-1)}{(x-1)(x+2)}" },
      { description: "分子を展開・整理", tex: "= \\frac{2x+4 - (x-1)}{(x-1)(x+2)} = \\frac{x + 5}{(x-1)(x+2)}" },
    ],
    resultTex: "\\frac{x+5}{(x-1)(x+2)}",
  },
  {
    label: "通分 (3)",
    category: "common_denom",
    steps: [
      { description: "各分母を確認", tex: "\\frac{3}{x^2} + \\frac{1}{x}" },
      { description: "最小公倍数: x²", tex: "= \\frac{3}{x^2} + \\frac{x}{x^2}" },
      { description: "分子をまとめる", tex: "= \\frac{3 + x}{x^2}" },
    ],
    resultTex: "\\frac{x+3}{x^2}",
  },
  // --- Rationalize (有理化) ---
  {
    label: "有理化 (1)",
    category: "rationalize",
    steps: [
      { description: "分母に √ がある", tex: "\\frac{1}{\\sqrt{3}}" },
      { description: "分母・分子に √3 をかける", tex: "= \\frac{1 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{\\sqrt{3}}{3}" },
    ],
    resultTex: "\\frac{\\sqrt{3}}{3}",
  },
  {
    label: "有理化 (2)",
    category: "rationalize",
    steps: [
      { description: "分母が a - √b の形", tex: "\\frac{1}{\\sqrt{5} - \\sqrt{2}}" },
      { description: "共役 (√5 + √2) を分母・分子にかける", tex: "= \\frac{\\sqrt{5} + \\sqrt{2}}{(\\sqrt{5})^2 - (\\sqrt{2})^2}" },
      { description: "分母を計算", tex: "= \\frac{\\sqrt{5} + \\sqrt{2}}{5 - 2} = \\frac{\\sqrt{5} + \\sqrt{2}}{3}" },
    ],
    resultTex: "\\frac{\\sqrt{5} + \\sqrt{2}}{3}",
  },
  {
    label: "有理化 (3)",
    category: "rationalize",
    steps: [
      { description: "分母が a + √b の形", tex: "\\frac{2}{3 + \\sqrt{7}}" },
      { description: "共役 (3 - √7) を分母・分子にかける", tex: "= \\frac{2(3 - \\sqrt{7})}{(3)^2 - (\\sqrt{7})^2}" },
      { description: "分母を計算", tex: "= \\frac{2(3 - \\sqrt{7})}{9 - 7} = \\frac{2(3 - \\sqrt{7})}{2}" },
      { description: "約分", tex: "= 3 - \\sqrt{7}" },
    ],
    resultTex: "3 - \\sqrt{7}",
  },
];

export default function RationalExpressionViz() {
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState<"simplify" | "common_denom" | "rationalize">("simplify");

  const filteredProblems = PROBLEMS.filter((p) => p.category === activeCategory);
  const problem = filteredProblems[selectedProblemIdx] ?? filteredProblems[0];

  const handleCategoryChange = (cat: "simplify" | "common_denom" | "rationalize") => {
    setActiveCategory(cat);
    setSelectedProblemIdx(0);
    setVisibleStep(0);
  };

  const handleProblemChange = (idx: number) => {
    setSelectedProblemIdx(idx);
    setVisibleStep(0);
  };

  const nextStep = () => {
    setVisibleStep((prev) => Math.min(prev + 1, problem.steps.length));
  };

  const resetSteps = () => {
    setVisibleStep(0);
  };

  const categoryLabel: Record<string, string> = {
    simplify: "約分",
    common_denom: "通分",
    rationalize: "有理化",
  };

  const categoryColors: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
    simplify: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", activeBg: "bg-blue-500" },
    common_denom: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", activeBg: "bg-green-500" },
    rationalize: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", activeBg: "bg-amber-500" },
  };

  const currentColors = categoryColors[activeCategory];

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2">
        {(["simplify", "common_denom", "rationalize"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-colors ${
              activeCategory === cat
                ? `${categoryColors[cat].activeBg} text-white`
                : `bg-slate-100 text-slate-500 hover:bg-slate-200`
            }`}
          >
            {categoryLabel[cat]}
          </button>
        ))}
      </div>

      {/* Problem selector */}
      <div className="flex gap-2">
        {filteredProblems.map((p, idx) => (
          <button
            key={p.label}
            onClick={() => handleProblemChange(idx)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-colors ${
              selectedProblemIdx === idx
                ? `${currentColors.bg} ${currentColors.border} ${currentColors.text} border`
                : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Steps display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-700">{problem.label} のステップ</h3>
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
            const stepColors = [
              "bg-slate-50 border-slate-100",
              "bg-blue-50 border-blue-100",
              "bg-green-50 border-green-100",
              "bg-amber-50 border-amber-100",
            ];
            return (
              <div
                key={idx}
                className={`rounded-xl p-4 border ${stepColors[idx % stepColors.length]}`}
              >
                <p className="text-xs text-slate-500 font-bold mb-2">
                  Step {idx + 1}: {step.description}
                </p>
                <div className="text-center text-sm">
                  <K tex={step.tex} />
                </div>
              </div>
            );
          })}

          {visibleStep >= problem.steps.length && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-xs text-indigo-500 font-bold mb-2">最終結果</p>
              <div className="text-center text-lg font-bold">
                <K tex={problem.resultTex} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation panels per category */}
      {activeCategory === "simplify" && (
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h4 className="font-bold text-blue-700 text-sm mb-2">約分のポイント</h4>
          <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
            <li>分子と分母をそれぞれ因数分解する</li>
            <li>共通因数を見つけて約分する</li>
            <li>約分で消した因数の値（分母が0になる値）を除外条件として書く</li>
          </ul>
        </div>
      )}

      {activeCategory === "common_denom" && (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <h4 className="font-bold text-green-700 text-sm mb-2">通分のポイント</h4>
          <ul className="text-sm text-green-600 space-y-1 list-disc list-inside">
            <li>各分母の最小公倍数（LCM）を求める</li>
            <li>各分数の分子・分母にそれぞれ必要な因数をかける</li>
            <li>分母が揃ったら分子を加減する</li>
            <li>結果を因数分解して約分できるか確認する</li>
          </ul>
        </div>
      )}

      {activeCategory === "rationalize" && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <h4 className="font-bold text-amber-700 text-sm mb-2">有理化のポイント</h4>
          <ul className="text-sm text-amber-600 space-y-1 list-disc list-inside">
            <li>
              <K tex="\frac{1}{\sqrt{a}}" /> の場合: 分母・分子に <K tex="\sqrt{a}" /> をかける
            </li>
            <li>
              <K tex="\frac{1}{a + \sqrt{b}}" /> の場合: 共役 <K tex="a - \sqrt{b}" /> をかける
            </li>
            <li>
              <K tex="(a+\sqrt{b})(a-\sqrt{b}) = a^2 - b" /> で分母の √ が消える
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
