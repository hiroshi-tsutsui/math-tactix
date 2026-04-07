"use client";

import React, { useState, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

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

interface NestedRadical2Problem {
  label: string;
  /** The expression under the outer radical */
  expressionTex: string;
  /** "+" for √a + √b form, "-" for √a - √b form */
  sign: "+" | "-";
  /** The two values inside (√p and √q where p > q) */
  p: number;
  q: number;
  /** Final answer */
  answerTex: string;
  /** Step-by-step derivation */
  steps: {
    description: string;
    mathTex: string;
    reason: string;
  }[];
}

const PROBLEMS: NestedRadical2Problem[] = [
  // Addition form problems
  {
    label: "加法1",
    expressionTex: "\\sqrt{3 + 2\\sqrt{2}}",
    sign: "+",
    p: 2,
    q: 1,
    answerTex: "\\sqrt{2} + 1",
    steps: [
      {
        description: "二重根号の形を確認",
        mathTex: "\\sqrt{3 + 2\\sqrt{2}}",
        reason: "√(a + 2√b) の形。a = 3, b = 2 と読み取る",
      },
      {
        description: "p + q = a, pq = b となる p, q を探す",
        mathTex: "p + q = 3, \\quad pq = 2",
        reason: "t² − 3t + 2 = 0 を解くと t = 2, 1",
      },
      {
        description: "中身を完全平方に変形",
        mathTex: "3 + 2\\sqrt{2} = (\\sqrt{2})^2 + 2 \\cdot \\sqrt{2} \\cdot \\sqrt{1} + (\\sqrt{1})^2 = (\\sqrt{2} + 1)^2",
        reason: "(√p + √q)² = p + q + 2√(pq) = a + 2√b",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(\\sqrt{2} + 1)^2} = \\sqrt{2} + 1",
        reason: "√2 + 1 > 0 なので絶対値なしでOK",
      },
    ],
  },
  {
    label: "加法2",
    expressionTex: "\\sqrt{5 + 2\\sqrt{6}}",
    sign: "+",
    p: 3,
    q: 2,
    answerTex: "\\sqrt{3} + \\sqrt{2}",
    steps: [
      {
        description: "二重根号の形を確認",
        mathTex: "\\sqrt{5 + 2\\sqrt{6}}",
        reason: "a = 5, b = 6",
      },
      {
        description: "p + q = 5, pq = 6 を解く",
        mathTex: "t^2 - 5t + 6 = 0 \\quad \\Rightarrow \\quad (t-3)(t-2) = 0",
        reason: "p = 3, q = 2",
      },
      {
        description: "完全平方に変形",
        mathTex: "5 + 2\\sqrt{6} = (\\sqrt{3})^2 + 2\\sqrt{3}\\cdot\\sqrt{2} + (\\sqrt{2})^2 = (\\sqrt{3} + \\sqrt{2})^2",
        reason: "(√3 + √2)² を展開すると 3 + 2√6 + 2 = 5 + 2√6 ✓",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(\\sqrt{3} + \\sqrt{2})^2} = \\sqrt{3} + \\sqrt{2}",
        reason: "√3 + √2 > 0",
      },
    ],
  },
  {
    label: "加法3",
    expressionTex: "\\sqrt{6 + 2\\sqrt{5}}",
    sign: "+",
    p: 5,
    q: 1,
    answerTex: "\\sqrt{5} + 1",
    steps: [
      {
        description: "二重根号の形を確認",
        mathTex: "\\sqrt{6 + 2\\sqrt{5}}",
        reason: "a = 6, b = 5",
      },
      {
        description: "p + q = 6, pq = 5 を解く",
        mathTex: "t^2 - 6t + 5 = 0 \\quad \\Rightarrow \\quad (t-5)(t-1) = 0",
        reason: "p = 5, q = 1",
      },
      {
        description: "完全平方に変形",
        mathTex: "6 + 2\\sqrt{5} = (\\sqrt{5})^2 + 2\\sqrt{5}\\cdot 1 + 1^2 = (\\sqrt{5} + 1)^2",
        reason: "(√5 + 1)² = 5 + 2√5 + 1 = 6 + 2√5 ✓",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(\\sqrt{5} + 1)^2} = \\sqrt{5} + 1",
        reason: "√5 + 1 > 0",
      },
    ],
  },
  // Subtraction form problems
  {
    label: "減法1",
    expressionTex: "\\sqrt{3 - 2\\sqrt{2}}",
    sign: "-",
    p: 2,
    q: 1,
    answerTex: "\\sqrt{2} - 1",
    steps: [
      {
        description: "二重根号（減法形）を確認",
        mathTex: "\\sqrt{3 - 2\\sqrt{2}}",
        reason: "√(a − 2√b) の形。a = 3, b = 2",
      },
      {
        description: "p + q = 3, pq = 2 を解く",
        mathTex: "t^2 - 3t + 2 = 0 \\quad \\Rightarrow \\quad p = 2,\\; q = 1",
        reason: "加法形と同じ p, q を使う",
      },
      {
        description: "完全平方に変形（差の形）",
        mathTex: "3 - 2\\sqrt{2} = (\\sqrt{2})^2 - 2\\sqrt{2}\\cdot 1 + 1^2 = (\\sqrt{2} - 1)^2",
        reason: "(√p − √q)² = p + q − 2√(pq) = a − 2√b",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(\\sqrt{2} - 1)^2} = \\sqrt{2} - 1",
        reason: "√2 − 1 ≈ 0.414 > 0 なので絶対値なしでOK",
      },
    ],
  },
  {
    label: "減法2",
    expressionTex: "\\sqrt{7 - 4\\sqrt{3}}",
    sign: "-",
    p: 4,
    q: 3,
    answerTex: "2 - \\sqrt{3}",
    steps: [
      {
        description: "2√b の形に変形",
        mathTex: "\\sqrt{7 - 4\\sqrt{3}} = \\sqrt{7 - 2\\sqrt{12}}",
        reason: "4√3 = 2·2√3 = 2√(4·3) = 2√12 と変形する",
      },
      {
        description: "p + q = 7, pq = 12 を解く",
        mathTex: "t^2 - 7t + 12 = 0 \\quad \\Rightarrow \\quad (t-4)(t-3) = 0",
        reason: "p = 4, q = 3",
      },
      {
        description: "完全平方に変形",
        mathTex: "7 - 2\\sqrt{12} = (\\sqrt{4})^2 - 2\\sqrt{4}\\cdot\\sqrt{3} + (\\sqrt{3})^2 = (2 - \\sqrt{3})^2",
        reason: "(2 − √3)² = 4 − 4√3 + 3 = 7 − 4√3 ✓",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(2 - \\sqrt{3})^2} = 2 - \\sqrt{3}",
        reason: "2 − √3 ≈ 0.268 > 0",
      },
    ],
  },
  {
    label: "減法3",
    expressionTex: "\\sqrt{8 - 2\\sqrt{15}}",
    sign: "-",
    p: 5,
    q: 3,
    answerTex: "\\sqrt{5} - \\sqrt{3}",
    steps: [
      {
        description: "二重根号（減法形）を確認",
        mathTex: "\\sqrt{8 - 2\\sqrt{15}}",
        reason: "a = 8, b = 15",
      },
      {
        description: "p + q = 8, pq = 15 を解く",
        mathTex: "t^2 - 8t + 15 = 0 \\quad \\Rightarrow \\quad (t-5)(t-3) = 0",
        reason: "p = 5, q = 3",
      },
      {
        description: "完全平方に変形",
        mathTex: "8 - 2\\sqrt{15} = (\\sqrt{5})^2 - 2\\sqrt{5}\\cdot\\sqrt{3} + (\\sqrt{3})^2 = (\\sqrt{5} - \\sqrt{3})^2",
        reason: "(√5 − √3)² = 5 − 2√15 + 3 = 8 − 2√15 ✓",
      },
      {
        description: "外側の√を外す",
        mathTex: "\\sqrt{(\\sqrt{5} - \\sqrt{3})^2} = \\sqrt{5} - \\sqrt{3}",
        reason: "√5 − √3 > 0 (∵ 5 > 3)",
      },
    ],
  },
];

export default function NestedRadical2Viz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const problem = PROBLEMS[selectedIdx];

  const handleChange = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleChange(idx)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
              selectedIdx === idx
                ? "bg-indigo-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.label}: <K tex={p.expressionTex} />
          </button>
        ))}
      </div>

      {/* Problem statement */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h4 className="font-bold text-sm mb-3 text-slate-800">問題：二重根号を外せ</h4>
        <div className="text-center text-lg">
          <KBlock tex={problem.expressionTex} />
        </div>
      </div>

      {/* Step controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-bold">
          ステップ {currentStep} / {problem.steps.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 disabled:opacity-30"
          >
            ← 戻る
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(problem.steps.length, currentStep + 1))}
            disabled={currentStep >= problem.steps.length}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500 text-white disabled:opacity-30"
          >
            次へ →
          </button>
          <button
            onClick={() => setCurrentStep(problem.steps.length)}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-green-500 text-white"
          >
            全表示
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {problem.steps.map((step, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              i < currentStep
                ? "bg-green-50 border-green-200"
                : "bg-slate-50 border-slate-200 opacity-30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                  i < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-slate-300 text-white"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700 mb-2">
                  {step.description}
                </div>
                <div className="mb-2">
                  <KBlock tex={step.mathTex} />
                </div>
                <div className="text-xs text-slate-500 bg-white rounded-lg px-3 py-2 border border-slate-100">
                  {step.reason}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer */}
      {currentStep >= problem.steps.length && (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
          <h4 className="font-bold text-green-700 text-sm mb-3">答え</h4>
          <div className="text-center">
            <KBlock tex={`${problem.expressionTex} = ${problem.answerTex}`} />
          </div>
        </div>
      )}

      {/* Hint */}
      <HintButton hints={[
        { step: 1, text: "√(a ± 2√b) の形を確認しましょう。係数が 2 でない場合（例: 4√3）は先に 2√(b') の形に変形します。" },
        { step: 2, text: "p + q = a, pq = b を満たす正の数 p, q を求めます。t² - at + b = 0 を解けばOKです。" },
        { step: 3, text: "中身が (√p ± √q)² の完全平方であることを確認し、外側の√を外します。減法形では √p > √q (p > q) に注意。" },
      ]} />

      {/* Key formulas */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
        <h4 className="font-bold text-indigo-700 text-sm mb-3">二重根号の変換公式</h4>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-indigo-500 font-bold mb-1">加法形（p &gt; 0, q &gt; 0）</div>
            <KBlock tex="\\sqrt{(p+q) + 2\\sqrt{pq}} = \\sqrt{p} + \\sqrt{q}" />
          </div>
          <div>
            <div className="text-xs text-indigo-500 font-bold mb-1">減法形（p &gt; q &gt; 0）</div>
            <KBlock tex="\\sqrt{(p+q) - 2\\sqrt{pq}} = \\sqrt{p} - \\sqrt{q}" />
          </div>
        </div>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside mt-3">
          <li>p + q = a, pq = b となる正の数 p, q を見つける</li>
          <li>t&sup2; - at + b = 0 を解くと p, q が求まる</li>
          <li>減法形では √p - √q &gt; 0 （つまり p &gt; q）であることを確認</li>
          <li>係数が 2 でない場合（4√3 など）は先に 2√b の形に変形する</li>
        </ul>
      </div>
    </div>
  );
}
