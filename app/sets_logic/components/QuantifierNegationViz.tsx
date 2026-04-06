"use client";

import React, { useState } from 'react';
import MathComponent from './MathComponent';

export default function QuantifierNegationViz() {
  const [scenario, setScenario] = useState(0);
  const scenarios: {
    proposition: string;
    quantifier: "forall" | "exists";
    isTrue: boolean;
    domain: string;
    predicate: string;
    negation: string;
    negQuantifier: "forall" | "exists";
    counterOrWitness: string;
    explanation: string;
  }[] = [
    {
      proposition: "\\forall n \\in \\mathbb{N},\\; n^2 \\geq n",
      quantifier: "forall",
      isTrue: true,
      domain: "自然数 n",
      predicate: "n^2 \\geq n",
      negation: "\\exists n \\in \\mathbb{N},\\; n^2 < n",
      negQuantifier: "exists",
      counterOrWitness: "否定は偽。n >= 1 のとき n^2 >= n は常に成り立つ（n=1: 1>=1, n=2: 4>=2, ...）。",
      explanation: "「すべてのnでn^2 >= n」は真。否定「あるnでn^2 < n」は偽。"
    },
    {
      proposition: "\\forall x \\in \\mathbb{R},\\; x^2 > 0",
      quantifier: "forall",
      isTrue: false,
      domain: "実数 x",
      predicate: "x^2 > 0",
      negation: "\\exists x \\in \\mathbb{R},\\; x^2 \\leq 0",
      negQuantifier: "exists",
      counterOrWitness: "反例: x = 0 のとき x^2 = 0 (> 0 ではない)。",
      explanation: "「すべてのxでx^2 > 0」は偽。否定「あるxでx^2 <= 0」は真（x=0が存在）。"
    },
    {
      proposition: "\\exists x \\in \\mathbb{R},\\; x^2 = 2",
      quantifier: "exists",
      isTrue: true,
      domain: "実数 x",
      predicate: "x^2 = 2",
      negation: "\\forall x \\in \\mathbb{R},\\; x^2 \\neq 2",
      negQuantifier: "forall",
      counterOrWitness: "証人: x = \\sqrt{2} のとき x^2 = 2 が成り立つ。",
      explanation: "「あるxでx^2 = 2」は真（x = sqrt(2)が存在）。否定「すべてのxでx^2 != 2」は偽。"
    },
    {
      proposition: "\\exists n \\in \\mathbb{N},\\; n + 1 < n",
      quantifier: "exists",
      isTrue: false,
      domain: "自然数 n",
      predicate: "n + 1 < n",
      negation: "\\forall n \\in \\mathbb{N},\\; n + 1 \\geq n",
      negQuantifier: "forall",
      counterOrWitness: "n + 1 は常に n 以上なので、そのようなnは存在しない。",
      explanation: "「あるnでn+1 < n」は偽。否定「すべてのnでn+1 >= n」は真。"
    }
  ];

  const current = scenarios[scenario];

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
        <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex flex-col items-center justify-center p-6">
          {/* Visual: number line with dots showing "all" vs "exists" */}
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className={current.quantifier === "forall" ? "text-blue-600 bg-blue-100 px-3 py-1 rounded-full border border-blue-200" : "text-slate-400"}>
                ∀ すべて
              </span>
              <span className="text-slate-300">/</span>
              <span className={current.quantifier === "exists" ? "text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200" : "text-slate-400"}>
                ∃ ある
              </span>
            </div>

            {/* Number line with dots */}
            <div className="relative w-full h-16">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-300"></div>
              {[0, 1, 2, 3, 4, 5].map(i => {
                const left = 4 + (i / 5) * 88;
                const satisfies = current.quantifier === "forall"
                  ? current.isTrue
                  : (current.isTrue ? i === 2 : false);
                const allSatisfy = current.quantifier === "forall" && current.isTrue;
                const noneSatisfy = current.quantifier === "exists" && !current.isTrue;
                const dotColor = allSatisfy
                  ? "bg-blue-500"
                  : noneSatisfy
                    ? "bg-red-400"
                    : (satisfies ? "bg-green-500" : "bg-slate-300");
                return (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${left}%` }}>
                    <div className={`w-5 h-5 rounded-full ${dotColor} border-2 border-white shadow`}></div>
                    <span className="text-[10px] text-slate-400 mt-1">{i}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${current.isTrue ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                命題は {current.isTrue ? "真" : "偽"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-400 mb-2 font-bold">元の命題</div>
                <div className="font-bold text-center text-lg">
                  <MathComponent tex={current.proposition} />
                </div>
                <div className={`text-center mt-2 text-sm font-bold ${current.isTrue ? "text-blue-600" : "text-red-600"}`}>
                  → {current.isTrue ? "真" : "偽"}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-black border border-amber-200">
                  否定すると ∀ ↔ ∃ が入れ替わる！
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-400 mb-2 font-bold">否定</div>
                <div className="font-bold text-center text-lg">
                  <MathComponent tex={current.negation} />
                </div>
                <div className={`text-center mt-2 text-sm font-bold ${!current.isTrue ? "text-blue-600" : "text-red-600"}`}>
                  → {!current.isTrue ? "真" : "偽"}
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-100 p-4 rounded-xl">
                {current.counterOrWitness}
              </p>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-700 text-sm mb-2">否定のルール</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div><MathComponent tex="\neg(\forall x,\; P(x)) \iff \exists x,\; \neg P(x)" /></div>
                  <div><MathComponent tex="\neg(\exists x,\; P(x)) \iff \forall x,\; \neg P(x)" /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setScenario(i)} className={`w-10 h-10 rounded-full font-bold flex items-center justify-center ${scenario === i ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
