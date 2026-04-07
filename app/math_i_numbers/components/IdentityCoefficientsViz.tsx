"use client";

import React, { useState, useMemo, useCallback } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from "../../components/HintButton";

interface Problem {
  /** Display: left-hand side before expansion */
  lhsTex: string;
  /** Display: right-hand side */
  rhsTex: string;
  /** Expanded left-hand side as string (for display) */
  expandedTex: string;
  /** Coefficients of x^2, x, constant on expanded LHS (as functions of a,b,c) */
  lhsCoeffs: { x2: string; x1: string; x0: string };
  /** Numeric coefficients on RHS */
  rhsCoeffs: { x2: number; x1: number; x0: number };
  /** Answers */
  answers: { a: number; b: number; c: number };
  /** Step-by-step expansion explanation */
  expansionSteps: string[];
}

function generateProblem(): Problem {
  // Generate random a, b, c (answers) in small integer range
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 11) - 5;
  const c = Math.floor(Math.random() * 11) - 5;

  // Pick a pattern randomly
  const pattern = Math.floor(Math.random() * 3);

  if (pattern === 0) {
    // a(x+1)^2 + b(x+1) + c = Ax^2 + Bx + C
    // Expand: a(x^2 + 2x + 1) + b(x + 1) + c = ax^2 + (2a+b)x + (a+b+c)
    const A = a;
    const B = 2 * a + b;
    const C = a + b + c;
    return {
      lhsTex: `a(x+1)^2 + b(x+1) + c`,
      rhsTex: `${A}x^2 ${B >= 0 ? "+" : ""} ${B}x ${C >= 0 ? "+" : ""} ${C}`,
      expandedTex: `ax^2 + 2ax + a + bx + b + c = ax^2 + (2a+b)x + (a+b+c)`,
      lhsCoeffs: { x2: "a", x1: "2a + b", x0: "a + b + c" },
      rhsCoeffs: { x2: A, x1: B, x0: C },
      answers: { a, b, c },
      expansionSteps: [
        `a(x+1)^2 = a(x^2 + 2x + 1) = ax^2 + 2ax + a`,
        `b(x+1) = bx + b`,
        `\\text{まとめると: } ax^2 + (2a+b)x + (a+b+c)`,
      ],
    };
  } else if (pattern === 1) {
    // a(x-2)^2 + b(x-2) + c = Ax^2 + Bx + C
    // Expand: a(x^2 - 4x + 4) + b(x - 2) + c = ax^2 + (-4a+b)x + (4a-2b+c)
    const A = a;
    const B = -4 * a + b;
    const C = 4 * a - 2 * b + c;
    return {
      lhsTex: `a(x-2)^2 + b(x-2) + c`,
      rhsTex: `${A}x^2 ${B >= 0 ? "+" : ""} ${B}x ${C >= 0 ? "+" : ""} ${C}`,
      expandedTex: `ax^2 - 4ax + 4a + bx - 2b + c = ax^2 + (-4a+b)x + (4a-2b+c)`,
      lhsCoeffs: { x2: "a", x1: "-4a + b", x0: "4a - 2b + c" },
      rhsCoeffs: { x2: A, x1: B, x0: C },
      answers: { a, b, c },
      expansionSteps: [
        `a(x-2)^2 = a(x^2 - 4x + 4) = ax^2 - 4ax + 4a`,
        `b(x-2) = bx - 2b`,
        `\\text{まとめると: } ax^2 + (-4a+b)x + (4a-2b+c)`,
      ],
    };
  } else {
    // ax^2 + bx + c = A(x-1)^2 + B(x-1) + C form (RHS is in shifted form)
    // Instead, let's do: a(x+2)^2 + b(x+2) + c
    // Expand: a(x^2 + 4x + 4) + b(x+2) + c = ax^2 + (4a+b)x + (4a+2b+c)
    const A = a;
    const B = 4 * a + b;
    const C = 4 * a + 2 * b + c;
    return {
      lhsTex: `a(x+2)^2 + b(x+2) + c`,
      rhsTex: `${A}x^2 ${B >= 0 ? "+" : ""} ${B}x ${C >= 0 ? "+" : ""} ${C}`,
      expandedTex: `ax^2 + 4ax + 4a + bx + 2b + c = ax^2 + (4a+b)x + (4a+2b+c)`,
      lhsCoeffs: { x2: "a", x1: "4a + b", x0: "4a + 2b + c" },
      rhsCoeffs: { x2: A, x1: B, x0: C },
      answers: { a, b, c },
      expansionSteps: [
        `a(x+2)^2 = a(x^2 + 4x + 4) = ax^2 + 4ax + 4a`,
        `b(x+2) = bx + 2b`,
        `\\text{まとめると: } ax^2 + (4a+b)x + (4a+2b+c)`,
      ],
    };
  }
}

export default function IdentityCoefficientsViz() {
  const [problem, setProblem] = useState<Problem>(() => generateProblem());
  const [step, setStep] = useState(0); // 0: question, 1: expand, 2: compare table, 3: answer
  const [userA, setUserA] = useState("");
  const [userB, setUserB] = useState("");
  const [userC, setUserC] = useState("");
  const [checked, setChecked] = useState(false);

  const handleNewProblem = useCallback(() => {
    setProblem(generateProblem());
    setStep(0);
    setUserA("");
    setUserB("");
    setUserC("");
    setChecked(false);
  }, []);

  const isCorrect = useMemo(() => {
    return (
      parseInt(userA) === problem.answers.a &&
      parseInt(userB) === problem.answers.b &&
      parseInt(userC) === problem.answers.c
    );
  }, [userA, userB, userC, problem.answers]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full">
        <h3 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2">
          恒等式の係数決定
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          恒等式（すべてのxについて成り立つ等式）では、
          <strong>両辺の同次項の係数がそれぞれ等しい</strong>
          という性質を使って未知の係数を決定します。
        </p>

        {/* Problem statement */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-center mb-4">
          <div className="text-sm text-indigo-500 font-semibold mb-2">
            次の恒等式を満たす定数 a, b, c を求めよ
          </div>
          <MathDisplay
            tex={`${problem.lhsTex} = ${problem.rhsTex}`}
            displayMode
            className="text-lg"
          />
        </div>

        {/* Step-by-step progression */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["問題", "展開", "係数比較", "解答"].map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                step === i
                  ? "bg-indigo-600 text-white"
                  : step > i
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {/* Step 1: Expansion */}
        {step >= 1 && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="font-bold text-amber-800 text-sm mb-3">
              STEP 1: 左辺を展開する
            </h4>
            <div className="space-y-2">
              {problem.expansionSteps.map((stepTex, i) => (
                <div
                  key={i}
                  className="p-2 bg-white rounded border border-amber-100 text-center"
                >
                  <MathDisplay tex={stepTex} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Coefficient comparison table */}
        {step >= 2 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="font-bold text-green-800 text-sm mb-3">
              STEP 2: 両辺の係数を比較する
            </h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-green-200 px-3 py-2 text-green-700">
                    項
                  </th>
                  <th className="border border-green-200 px-3 py-2 text-green-700">
                    左辺の係数
                  </th>
                  <th className="border border-green-200 px-3 py-2 text-green-700">
                    右辺の係数
                  </th>
                  <th className="border border-green-200 px-3 py-2 text-green-700">
                    等式
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay tex="x^2" />
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay tex={problem.lhsCoeffs.x2} />
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center font-mono">
                    {problem.rhsCoeffs.x2}
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay
                      tex={`${problem.lhsCoeffs.x2} = ${problem.rhsCoeffs.x2}`}
                    />
                  </td>
                </tr>
                <tr className="bg-green-50/50">
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay tex="x" />
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay tex={problem.lhsCoeffs.x1} />
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center font-mono">
                    {problem.rhsCoeffs.x1}
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay
                      tex={`${problem.lhsCoeffs.x1} = ${problem.rhsCoeffs.x1}`}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    定数
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay tex={problem.lhsCoeffs.x0} />
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center font-mono">
                    {problem.rhsCoeffs.x0}
                  </td>
                  <td className="border border-green-200 px-3 py-2 text-center">
                    <MathDisplay
                      tex={`${problem.lhsCoeffs.x0} = ${problem.rhsCoeffs.x0}`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Step 3: Answer input */}
        {step >= 3 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="font-bold text-blue-800 text-sm mb-3">
              STEP 3: 連立方程式を解いて a, b, c を求める
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-slate-500 mb-1">
                  a =
                </label>
                <input
                  type="number"
                  value={userA}
                  onChange={(e) => {
                    setUserA(e.target.value);
                    setChecked(false);
                  }}
                  className="w-20 text-center border rounded px-2 py-1 font-mono text-lg"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-slate-500 mb-1">
                  b =
                </label>
                <input
                  type="number"
                  value={userB}
                  onChange={(e) => {
                    setUserB(e.target.value);
                    setChecked(false);
                  }}
                  className="w-20 text-center border rounded px-2 py-1 font-mono text-lg"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-slate-500 mb-1">
                  c =
                </label>
                <input
                  type="number"
                  value={userC}
                  onChange={(e) => {
                    setUserC(e.target.value);
                    setChecked(false);
                  }}
                  className="w-20 text-center border rounded px-2 py-1 font-mono text-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setChecked(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                答え合わせ
              </button>
              <button
                onClick={() => {
                  setUserA(String(problem.answers.a));
                  setUserB(String(problem.answers.b));
                  setUserC(String(problem.answers.c));
                  setChecked(true);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors"
              >
                正解を見る
              </button>
            </div>

            {checked && (
              <div
                className={`mt-3 p-3 rounded-lg text-center font-bold ${
                  isCorrect
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {isCorrect ? (
                  "正解です!"
                ) : (
                  <span>
                    不正解。正解は{" "}
                    <MathDisplay
                      tex={`a = ${problem.answers.a},\\; b = ${problem.answers.b},\\; c = ${problem.answers.c}`}
                    />
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        <HintButton hints={[
          { step: 1, text: "恒等式では「両辺の同次項の係数がそれぞれ等しい」という性質を使います。まず左辺を展開しましょう。" },
          { step: 2, text: "展開した左辺を x² の項、x の項、定数項に整理し、右辺の各係数と比較する連立方程式を立てます。" },
          { step: 3, text: "x² の係数比較から a が決まり、次に x の係数比較から b、最後に定数項比較から c が求まります。" },
        ]} />

        {/* New problem button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNewProblem}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            新しい問題を生成
          </button>
        </div>

        {/* Key concept box */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2 text-sm">
            恒等式の性質
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            等式{" "}
            <MathDisplay tex="f(x) = g(x)" /> がすべてのxについて成り立つ（恒等式である）とき、
            両辺のxの各次数の係数はそれぞれ等しくなります。
          </p>
          <div className="p-3 bg-white rounded border border-slate-300 text-center">
            <MathDisplay
              tex="a_n x^n + \cdots + a_1 x + a_0 = b_n x^n + \cdots + b_1 x + b_0 \;\Longrightarrow\; a_k = b_k \;\;(\forall k)"
              displayMode
            />
          </div>
        </div>
      </div>
    </div>
  );
}
