"use client";

import React, { useState, useEffect, useRef } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

interface DivisionProblem {
  label: string;
  dividendTex: string;
  divisorTex: string;
  steps: DivisionStep[];
  quotientTex: string;
  remainderTex: string;
  verificationTex: string;
}

interface DivisionStep {
  description: string;
  resultTex: string;
}

const PROBLEMS: DivisionProblem[] = [
  {
    label: "基本: 2次 ÷ 1次",
    dividendTex: "2x^2 + 5x + 3",
    divisorTex: "x + 1",
    steps: [
      {
        description: "最高次の項どうしを割る: 2x² ÷ x = 2x",
        resultTex: "2x^2 + 5x + 3 = (x+1) \\cdot 2x + (3x + 3)",
      },
      {
        description: "余り 3x+3 の最高次を割る: 3x ÷ x = 3",
        resultTex: "2x^2 + 5x + 3 = (x+1)(2x + 3) + 0",
      },
    ],
    quotientTex: "2x + 3",
    remainderTex: "0",
    verificationTex: "(x+1)(2x+3) + 0 = 2x^2 + 5x + 3 \\quad \\checkmark",
  },
  {
    label: "余りあり: 3次 ÷ 1次",
    dividendTex: "x^3 + 2x^2 - x + 4",
    divisorTex: "x - 1",
    steps: [
      {
        description: "x³ ÷ x = x²。x²(x-1) = x³ - x² を引く",
        resultTex: "x^3 + 2x^2 - x + 4 = (x-1) \\cdot x^2 + (3x^2 - x + 4)",
      },
      {
        description: "3x² ÷ x = 3x。3x(x-1) = 3x² - 3x を引く",
        resultTex: "= (x-1)(x^2 + 3x) + (2x + 4)",
      },
      {
        description: "2x ÷ x = 2。2(x-1) = 2x - 2 を引く",
        resultTex: "= (x-1)(x^2 + 3x + 2) + 6",
      },
    ],
    quotientTex: "x^2 + 3x + 2",
    remainderTex: "6",
    verificationTex: "(x-1)(x^2+3x+2) + 6 = x^3 + 2x^2 - x + 4 \\quad \\checkmark",
  },
  {
    label: "2次 ÷ 2次",
    dividendTex: "3x^3 + x^2 - 4x + 2",
    divisorTex: "x^2 + 2",
    steps: [
      {
        description: "3x³ ÷ x² = 3x。3x(x²+2) = 3x³ + 6x を引く",
        resultTex: "3x^3 + x^2 - 4x + 2 = (x^2+2) \\cdot 3x + (x^2 - 10x + 2)",
      },
      {
        description: "x² ÷ x² = 1。1(x²+2) = x² + 2 を引く",
        resultTex: "= (x^2+2)(3x + 1) + (-10x)",
      },
    ],
    quotientTex: "3x + 1",
    remainderTex: "-10x",
    verificationTex: "(x^2+2)(3x+1) + (-10x) = 3x^3 + x^2 - 4x + 2 \\quad \\checkmark",
  },
];

export default function PolynomialDivisionViz() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const problem = PROBLEMS[problemIndex];
  const totalSteps = problem.steps.length;
  const isLastStep = stepIndex >= totalSteps;

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleNext = () => {
    if (stepIndex <= totalSteps) setStepIndex(stepIndex + 1);
  };

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setProblemIndex(i);
              setStepIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              problemIndex === i
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Division setup */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-center space-y-3">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            整式の除法
          </div>
          <div className="text-lg font-bold">
            <K
              tex={`(${problem.dividendTex}) \\div (${problem.divisorTex})`}
              display
            />
          </div>
          <div className="text-sm text-slate-500">
            <K tex="A = BQ + R" /> の形に表す（A: 被除式、B: 除式、Q: 商、R: 余り）
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-700">
            筆算のステップ
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                stepIndex === 0
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              ←
            </button>
            <span className="text-xs text-slate-400 font-bold">
              {Math.min(stepIndex + 1, totalSteps + 1)} / {totalSteps + 1}
            </span>
            <button
              onClick={handleNext}
              disabled={stepIndex > totalSteps}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                stepIndex > totalSteps
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              →
            </button>
          </div>
        </div>

        {problem.steps.map((step, i) => {
          if (i > stepIndex) return null;
          const isCurrent = i === stepIndex;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border-2 transition-all ${
                isCurrent
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-white opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-300 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    {step.description}
                  </p>
                  <div className="text-sm">
                    <K tex={step.resultTex} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Final result */}
        {isLastStep && (
          <div className="p-4 rounded-xl border-2 border-green-300 bg-green-50">
            <div className="text-center space-y-3">
              <div className="text-xs text-green-600 font-bold uppercase tracking-widest">
                完了
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-slate-400 mb-1">商 Q</div>
                  <div className="font-bold text-green-700">
                    <K tex={problem.quotientTex} />
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-slate-400 mb-1">余り R</div>
                  <div className="font-bold text-green-700">
                    <K tex={problem.remainderTex} />
                  </div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-bold pt-2">
                検算: <K tex={problem.verificationTex} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">
          整式の除法のポイント
        </h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            常に <K tex="A = BQ + R" /> の関係が成り立つ
          </li>
          <li>余り R の次数は、除式 B の次数より低くなる</li>
          <li>最高次の項どうしを割って商の各項を決定する</li>
          <li>割り切れる場合は R = 0 となり、A = BQ と因数分解できる</li>
        </ul>
      </div>
      <HintButton hints={[
        { step: 1, text: "多項式の割り算は、筆算のように最高次の項から順に割っていきます。" },
        { step: 2, text: "被除数 ÷ 除数 = 商 … 余り の関係が成り立ちます（余りの次数 < 除数の次数）。" },
        { step: 3, text: "f(x) = g(x)・Q(x) + R(x) の形に整理しましょう（割り算の等式）。" },
        { step: 4, text: "組立除法を使うと、(x - a) で割る計算が効率的にできます。" }
      ]} />
    </div>
  );
}
