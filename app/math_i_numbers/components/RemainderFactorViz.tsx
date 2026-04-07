"use client";

import React, { useState, useEffect, useRef } from "react";
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

interface PolynomialCoeffs {
  /** coefficients in descending degree order, e.g. [1, 2, -1, -2] for x^3+2x^2-x-2 */
  coeffs: number[];
}

interface Problem {
  label: string;
  polyTex: string;
  coeffs: number[];
  degree: number;
  divisorA: number; // divisor is (x - a)
  divisorTex: string;
  explanation: string;
}

const PROBLEMS: Problem[] = [
  {
    label: "3次式 (x-1)",
    polyTex: "P(x) = x^3 + 2x^2 - x - 2",
    coeffs: [1, 2, -1, -2],
    degree: 3,
    divisorA: 1,
    divisorTex: "(x - 1)",
    explanation:
      "P(1) = 1 + 2 - 1 - 2 = 0 なので、余りは 0。つまり (x-1) は P(x) の因数です。",
  },
  {
    label: "3次式 (x+2)",
    polyTex: "P(x) = 2x^3 - 3x^2 + x + 6",
    coeffs: [2, -3, 1, 6],
    degree: 3,
    divisorA: -2,
    divisorTex: "(x + 2)",
    explanation:
      "P(-2) = 2(-8) - 3(4) + (-2) + 6 = -16 - 12 - 2 + 6 = -24。余りは -24 で、(x+2) は因数ではありません。",
  },
  {
    label: "3次式 (x-2)",
    polyTex: "P(x) = x^3 - 6x^2 + 11x - 6",
    coeffs: [1, -6, 11, -6],
    degree: 3,
    divisorA: 2,
    divisorTex: "(x - 2)",
    explanation:
      "P(2) = 8 - 24 + 22 - 6 = 0 なので、(x-2) は P(x) の因数です。完全に因数分解すると (x-1)(x-2)(x-3)。",
  },
  {
    label: "2次式 (x+1)",
    polyTex: "P(x) = 3x^2 + 5x + 2",
    coeffs: [3, 5, 2],
    degree: 2,
    divisorA: -1,
    divisorTex: "(x + 1)",
    explanation:
      "P(-1) = 3(1) + 5(-1) + 2 = 3 - 5 + 2 = 0 なので、(x+1) は因数。因数分解: (x+1)(3x+2)。",
  },
  {
    label: "3次式 (x+3)",
    polyTex: "P(x) = x^3 + 27",
    coeffs: [1, 0, 0, 27],
    degree: 3,
    divisorA: -3,
    divisorTex: "(x + 3)",
    explanation:
      "P(-3) = (-27) + 27 = 0 なので、(x+3) は因数。因数分解: (x+3)(x^2 - 3x + 9)。",
  },
];

function evaluatePolynomial(coeffs: number[], x: number): number {
  let result = 0;
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * Math.pow(x, coeffs.length - 1 - i);
  }
  return result;
}

function formatCoeffTerm(coeff: number, degree: number, isFirst: boolean): string {
  if (coeff === 0) return "";
  const sign = coeff > 0 ? (isFirst ? "" : "+ ") : "- ";
  const absCoeff = Math.abs(coeff);
  if (degree === 0) return `${sign}${absCoeff}`;
  const coeffStr = absCoeff === 1 ? "" : `${absCoeff}`;
  const xPart = degree === 1 ? "x" : `x^{${degree}}`;
  return `${sign}${coeffStr}${xPart}`;
}

function buildEvaluationSteps(coeffs: number[], a: number): string[] {
  const steps: string[] = [];
  const degree = coeffs.length - 1;

  // Build P(a) substitution
  const terms: string[] = [];
  for (let i = 0; i < coeffs.length; i++) {
    const deg = degree - i;
    const c = coeffs[i];
    if (c === 0) continue;
    const sign = c > 0 && terms.length > 0 ? "+" : "";
    if (deg === 0) {
      terms.push(`${sign}${c}`);
    } else if (deg === 1) {
      const cStr = Math.abs(c) === 1 ? (c < 0 ? "-" : "") : `${c} \\cdot `;
      terms.push(`${sign}${cStr}(${a})`);
    } else {
      const cStr = Math.abs(c) === 1 ? (c < 0 ? "-" : "") : `${c} \\cdot `;
      terms.push(`${sign}${cStr}(${a})^{${deg}}`);
    }
  }
  steps.push(`P(${a}) = ${terms.join(" ")}`);

  // Compute intermediate values
  const values: string[] = [];
  for (let i = 0; i < coeffs.length; i++) {
    const deg = degree - i;
    const c = coeffs[i];
    if (c === 0) continue;
    const val = c * Math.pow(a, deg);
    if (values.length > 0 && val >= 0) {
      values.push(`+ ${val}`);
    } else {
      values.push(`${val}`);
    }
  }
  steps.push(`= ${values.join(" ")}`);

  const result = evaluatePolynomial(coeffs, a);
  steps.push(`= ${result}`);

  return steps;
}

export default function RemainderFactorViz() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(1);
  const [showSteps, setShowSteps] = useState(false);

  const problem = PROBLEMS[problemIndex];

  // Reset slider to the problem's default divisorA when switching problems
  useEffect(() => {
    setSliderValue(problem.divisorA);
    setShowSteps(false);
  }, [problemIndex, problem.divisorA]);

  const remainder = evaluatePolynomial(problem.coeffs, sliderValue);
  const isFactor = remainder === 0;
  const steps = buildEvaluationSteps(problem.coeffs, sliderValue);

  const divisorDisplayTex =
    sliderValue >= 0
      ? `(x - ${sliderValue})`
      : `(x + ${Math.abs(sliderValue)})`;

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, i) => (
          <button
            key={i}
            onClick={() => setProblemIndex(i)}
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

      {/* Theorem display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-center space-y-3">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            余りの定理・因数定理
          </div>
          <div className="text-lg font-bold">
            <K tex={problem.polyTex} display />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-500 font-bold mb-1">余りの定理</div>
              <div className="text-sm">
                <K tex={`P(x) \\text{ を } ${divisorDisplayTex} \\text{ で割った余り} = P(${sliderValue})`} />
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="text-xs text-amber-600 font-bold mb-1">因数定理</div>
              <div className="text-sm">
                <K tex={`P(a) = 0 \\iff ${`P(x)`} \\text{ は } (x - a) \\text{ を因数に持つ}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider for a */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-700">
            <K tex="a" /> の値を変えて余りを確認
          </h3>
          <span className="text-sm font-bold text-indigo-600">
            <K tex={`a = ${sliderValue}`} />
          </span>
        </div>

        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={sliderValue}
          onChange={(e) => {
            setSliderValue(Number(e.target.value));
            setShowSteps(false);
          }}
          className="w-full accent-indigo-500"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>-5</span>
          <span>-4</span>
          <span>-3</span>
          <span>-2</span>
          <span>-1</span>
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>

        {/* Remainder result */}
        <div
          className={`p-4 rounded-xl border-2 text-center transition-all ${
            isFactor
              ? "border-green-300 bg-green-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="text-sm text-slate-500 mb-1">
            <K tex={`P(x) \\text{ を } ${divisorDisplayTex} \\text{ で割った余り}`} />
          </div>
          <div className={`text-2xl font-black ${isFactor ? "text-green-600" : "text-slate-800"}`}>
            <K tex={`P(${sliderValue}) = ${remainder}`} display />
          </div>
          {isFactor && (
            <div className="mt-2 text-sm font-bold text-green-600 bg-green-100 inline-block px-4 py-1 rounded-full">
              {divisorDisplayTex} は P(x) の因数です
            </div>
          )}
        </div>

        {/* Show steps toggle */}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          {showSteps ? "計算過程を隠す" : "計算過程を表示"}
        </button>

        {showSteps && (
          <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
              計算過程
            </div>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`text-sm ${
                  i === steps.length - 1 ? "font-bold text-indigo-700" : "text-slate-600"
                }`}
              >
                <K tex={step} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default problem explanation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
          この問題の解説（a = {problem.divisorA} の場合）
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {problem.explanation}
        </p>
      </div>

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "余りの定理: P(x) を (x - a) で割った余りは P(a) です。まず x = a を代入してみましょう。" },
          { step: 2, text: "P(a) = 0 なら (x - a) は P(x) の因数です。これが因数定理です。" },
          { step: 3, text: "因数を見つけたら、組み立て除法で商の多項式を求めましょう。さらに因数分解が続けられるかもしれません。" },
          { step: 4, text: "整数の因数候補は、定数項の約数 ÷ 最高次係数の約数 で探すと効率的です。" },
        ]}
      />

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">
          余りの定理・因数定理のポイント
        </h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            <K tex="P(x)" /> を <K tex="(x - a)" /> で割った余りは <K tex="P(a)" /> に等しい（余りの定理）
          </li>
          <li>
            <K tex="P(a) = 0" /> のとき <K tex="(x - a)" /> は <K tex="P(x)" /> の因数（因数定理）
          </li>
          <li>
            因数を見つけたら組み立て除法（または整式の除法）で商を求め、完全に因数分解できる
          </li>
          <li>
            整数の因数候補は、最高次の係数と定数項の約数の組み合わせから探す
          </li>
        </ul>
      </div>
    </div>
  );
}
