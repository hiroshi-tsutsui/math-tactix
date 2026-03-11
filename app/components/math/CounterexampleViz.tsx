"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Search } from 'lucide-react';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function CounterexampleViz() {
  const [scenario, setScenario] = useState(0);

  const scenarios = [
    {
      p: "x > 0",
      q: "x > 2",
      pDesc: "0より大きい実数",
      qDesc: "2より大きい実数",
      isTrue: false,
      counterexample: "x = 1 (Pを満たすが、Qを満たさない)",
      visual: "Q_in_P",
      explanation: "「x > 0 ならば x > 2」という命題です。x=1 は 0 より大きい(Pを満たす)ですが、2 より大きくありません(Qを満たさない)。したがって、この命題は偽であり、x=1 はその反例です。"
    },
    {
      p: "x は 4 の倍数",
      q: "x は 2 の倍数",
      pDesc: "4, 8, 12, ...",
      qDesc: "2, 4, 6, 8, ...",
      isTrue: true,
      counterexample: "なし",
      visual: "P_in_Q",
      explanation: "4の倍数は必ず2の倍数でもあります。集合Pは集合Qに完全に含まれているため、反例は存在せず、命題は真です。"
    },
    {
      p: "x^2 = 4",
      q: "x = 2",
      pDesc: "x = 2, -2",
      qDesc: "x = 2",
      isTrue: false,
      counterexample: "x = -2",
      visual: "Q_in_P",
      explanation: "2乗して4になる数は 2 と -2 があります。x=-2 は Pを満たしますが、Qを満たしません。したがって命題は偽であり、x=-2 が反例です。"
    },
    {
      p: "\\text{素数}",
      q: "\\text{奇数}",
      pDesc: "2, 3, 5, 7, 11...",
      qDesc: "1, 3, 5, 7, 9...",
      isTrue: false,
      counterexample: "2 (素数だが偶数)",
      visual: "intersect",
      explanation: "「素数はすべて奇数である」という命題です。ほとんどの素数は奇数ですが、唯一「2」だけは素数でありながら偶数(奇数ではない)です。このたった1つの例外があるため、命題は偽となります。"
    }
  ];

  const current = scenarios[scenario];

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
        <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex flex-col items-center justify-center">
          
          {current.visual === "Q_in_P" && (
            <div className="relative w-48 h-48 rounded-full border-4 border-red-200 bg-red-50 flex items-start justify-center pt-4">
              <span className="text-red-500 font-bold z-10">P</span>
              <div className="absolute top-12 left-12 w-24 h-24 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-center justify-center">
                <span className="text-blue-500 font-bold">Q</span>
              </div>
              <div className="absolute bottom-8 right-8 bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold border border-amber-300 animate-pulse text-xs">
                反例: {current.counterexample.split(' ')[0]}
              </div>
            </div>
          )}

          {current.visual === "P_in_Q" && (
            <div className="relative w-48 h-48 rounded-full border-4 border-blue-200 bg-blue-50 flex items-start justify-center pt-4">
              <span className="text-blue-500 font-bold z-10">Q</span>
              <div className="absolute bottom-6 w-28 h-28 rounded-full border-4 border-red-200 bg-red-50/50 flex items-center justify-center">
                <span className="text-red-500 font-bold">P</span>
              </div>
            </div>
          )}

          {current.visual === "intersect" && (
            <div className="relative w-64 h-48 flex items-center justify-center">
              <div className="absolute left-8 w-40 h-40 rounded-full border-4 border-red-200 bg-red-50 flex items-center justify-start pl-4">
                <span className="text-red-500 font-bold">P</span>
                <div className="absolute top-16 left-6 bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold border border-amber-300 animate-pulse text-xs">
                  反例: {current.counterexample.split(' ')[0]}
                </div>
              </div>
              <div className="absolute right-8 w-40 h-40 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-center justify-end pr-4">
                <span className="text-blue-500 font-bold">Q</span>
              </div>
            </div>
          )}
          
        </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-center w-5/12">
                  <div className="text-xs text-slate-400 mb-1">条件 P (仮定)</div>
                  <div className="font-bold text-red-500"><MathComponent tex={current.p} /></div>
                  <div className="text-[10px] text-slate-400 mt-1">{current.pDesc}</div>
                </div>
                <div className="text-slate-300 text-xl font-black w-2/12 text-center">⇒</div>
                <div className="text-center w-5/12">
                  <div className="text-xs text-slate-400 mb-1">条件 Q (結論)</div>
                  <div className="font-bold text-blue-500"><MathComponent tex={current.q} /></div>
                  <div className="text-[10px] text-slate-400 mt-1">{current.qDesc}</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-center font-bold ${current.isTrue ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                <div className="text-xs opacity-70 mb-1">命題の真偽</div>
                <div className="text-xl">{current.isTrue ? "真 (True)" : "偽 (False)"}</div>
              </div>

              {!current.isTrue && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800 text-sm font-bold">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="w-4 h-4" /> 反例 (Counterexample)
                  </div>
                  <div>{current.counterexample}</div>
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed mt-4 bg-white p-4 rounded-xl border border-slate-200">
                {current.explanation}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setScenario(i)} className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${scenario === i ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
