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

interface NestedRadicalProblem {
  label: string;
  expressionTex: string;
  a: number;
  b: number;
  sign: "+" | "-";
  p: number;
  q: number;
  answerTex: string;
  steps: {
    description: string;
    mathTex: string;
    reason: string;
  }[];
}

const PROBLEMS: NestedRadicalProblem[] = [
  {
    label: "基本1",
    expressionTex: "\\sqrt{3 + 2\\sqrt{2}}",
    a: 3,
    b: 2,
    sign: "+",
    p: 2,
    q: 1,
    answerTex: "\\sqrt{2} + 1",
    steps: [
      {
        description: "二重根号の形を確認する",
        mathTex: "\\sqrt{3 + 2\\sqrt{2}}",
        reason: "√(a + 2√b) の形なので a=3, b=2 と読み取る",
      },
      {
        description: "p + q = a, pq = b となる p, q を探す",
        mathTex: "p + q = 3,\\quad pq = 2",
        reason: "t² - 3t + 2 = 0 の解が p, q となる（ヴィエタの公式の逆利用）",
      },
      {
        description: "連立方程式を解く",
        mathTex: "(t-2)(t-1) = 0 \\quad \\Rightarrow \\quad p = 2,\\; q = 1",
        reason: "因数分解すると t=2, t=1 が解",
      },
      {
        description: "答えを書く",
        mathTex: "\\sqrt{3 + 2\\sqrt{2}} = \\sqrt{2} + \\sqrt{1} = \\sqrt{2} + 1",
        reason: "√(p) + √(q) に代入する",
      },
      {
        description: "検算：2乗して元に戻ることを確認",
        mathTex: "(\\sqrt{2} + 1)^2 = 2 + 2\\sqrt{2} + 1 = 3 + 2\\sqrt{2} \\quad \\checkmark",
        reason: "展開して元の式と一致することを確認",
      },
    ],
  },
  {
    label: "マイナスの場合",
    expressionTex: "\\sqrt{7 - 4\\sqrt{3}}",
    a: 7,
    b: 12,
    sign: "-",
    p: 4,
    q: 3,
    answerTex: "2 - \\sqrt{3}",
    steps: [
      {
        description: "2√b の形に直す",
        mathTex: "\\sqrt{7 - 4\\sqrt{3}} = \\sqrt{7 - 2\\sqrt{12}}",
        reason: "4√3 = 2·2√3 = 2√(4·3) = 2√12 と変形する",
      },
      {
        description: "p + q = a, pq = b となる p, q を探す",
        mathTex: "p + q = 7,\\quad pq = 12",
        reason: "a=7, b=12 として連立方程式を立てる",
      },
      {
        description: "連立方程式を解く",
        mathTex: "t^2 - 7t + 12 = 0 \\quad \\Rightarrow \\quad (t-4)(t-3) = 0 \\quad \\Rightarrow \\quad p = 4,\\; q = 3",
        reason: "t² - at + b = 0 を因数分解する",
      },
      {
        description: "符号が「−」なので大きい方 − 小さい方",
        mathTex: "\\sqrt{7 - 2\\sqrt{12}} = \\sqrt{4} - \\sqrt{3} = 2 - \\sqrt{3}",
        reason: "√(a - 2√b) = √p - √q（p > q のとき）",
      },
      {
        description: "検算",
        mathTex: "(2 - \\sqrt{3})^2 = 4 - 4\\sqrt{3} + 3 = 7 - 4\\sqrt{3} \\quad \\checkmark",
        reason: "展開して元の式と一致することを確認",
      },
    ],
  },
  {
    label: "基本2",
    expressionTex: "\\sqrt{6 + 2\\sqrt{5}}",
    a: 6,
    b: 5,
    sign: "+",
    p: 5,
    q: 1,
    answerTex: "\\sqrt{5} + 1",
    steps: [
      {
        description: "二重根号の形を確認する",
        mathTex: "\\sqrt{6 + 2\\sqrt{5}}",
        reason: "√(a + 2√b) の形で a=6, b=5",
      },
      {
        description: "p + q = a, pq = b となる p, q を探す",
        mathTex: "p + q = 6,\\quad pq = 5",
        reason: "t² - 6t + 5 = 0 の解を求める",
      },
      {
        description: "連立方程式を解く",
        mathTex: "(t-5)(t-1) = 0 \\quad \\Rightarrow \\quad p = 5,\\; q = 1",
        reason: "因数分解により p=5, q=1",
      },
      {
        description: "答えを書く",
        mathTex: "\\sqrt{6 + 2\\sqrt{5}} = \\sqrt{5} + \\sqrt{1} = \\sqrt{5} + 1",
        reason: "√p + √q に代入",
      },
      {
        description: "検算",
        mathTex: "(\\sqrt{5} + 1)^2 = 5 + 2\\sqrt{5} + 1 = 6 + 2\\sqrt{5} \\quad \\checkmark",
        reason: "展開して確認",
      },
    ],
  },
];

export default function NestedRadicalViz() {
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const problem = PROBLEMS[selectedProblem];
  const totalSteps = problem.steps.length;

  const handleProblemChange = (idx: number) => {
    setSelectedProblem(idx);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleProblemChange(idx)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              selectedProblem === idx
                ? "bg-indigo-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Problem display */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
        <div className="text-lg">
          <K tex={problem.expressionTex} display /> を簡約化せよ
        </div>
      </div>

      {/* Formula reference */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <div className="text-sm text-amber-700 text-center">
          <K tex="\sqrt{a + 2\sqrt{b}} = \sqrt{p} + \sqrt{q}" />
          {" "}ただし{" "}
          <K tex="p + q = a,\; pq = b" />
        </div>
        <div className="text-sm text-amber-700 text-center mt-1">
          <K tex="\sqrt{a - 2\sqrt{b}} = \sqrt{p} - \sqrt{q}" />
          {" "}（<K tex="p > q" />）
        </div>
      </div>

      {/* Step-by-step solution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-700">
            ステップ {currentStep + 1} / {totalSteps}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
            >
              前へ
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
              disabled={currentStep === totalSteps - 1}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-30 transition-colors"
            >
              次へ
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {problem.steps.map((step, idx) => (
          idx <= currentStep && (
            <div
              key={idx}
              className={`border rounded-xl p-4 transition-all duration-300 ${
                idx === currentStep
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-slate-100 bg-slate-50 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  idx === currentStep
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {idx + 1}
                </span>
                <div className="space-y-2 min-w-0">
                  <div className="font-bold text-sm text-slate-700">
                    {step.description}
                  </div>
                  <div className="text-sm overflow-x-auto">
                    <K tex={step.mathTex} />
                  </div>
                  <div className="text-xs text-slate-500 bg-white/60 rounded-lg px-3 py-2 border border-slate-100">
                    {step.reason}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Final answer (shown when all steps viewed) */}
      {currentStep === totalSteps - 1 && (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100 text-center">
          <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">答え</div>
          <div className="text-xl font-black text-green-700">
            <K tex={`${problem.expressionTex} = ${problem.answerTex}`} />
          </div>
        </div>
      )}

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">二重根号のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-2 list-disc list-inside">
          <li>
            <K tex="\sqrt{a \pm 2\sqrt{b}}" /> の形にする（係数が2でない場合は変形する）
          </li>
          <li>
            <K tex="p + q = a,\; pq = b" /> を満たす p, q を求める（2次方程式 <K tex="t^2 - at + b = 0" /> の解）
          </li>
          <li>
            「+」のときは <K tex="\sqrt{p} + \sqrt{q}" />、「-」のときは <K tex="\sqrt{p} - \sqrt{q}" />（大きい方から引く）
          </li>
          <li>
            最後に2乗して検算する習慣をつけよう
          </li>
        </ul>
      </div>
      <HintButton hints={[
        { step: 1, text: "二重根号 √(a ± 2√b) は、√c ± √d の形に変換できることがあります。" },
        { step: 2, text: "√(a + 2√b) = √c + √d とおくと、c + d = a、cd = b が成り立ちます。" },
        { step: 3, text: "c と d は、和が a で積が b の2数なので、二次方程式 t² - at + b = 0 の解です。" },
        { step: 4, text: "二次方程式の判別式 a² - 4b ≥ 0 のとき、二重根号を外すことができます。" }
      ]} />
    </div>
  );
}
