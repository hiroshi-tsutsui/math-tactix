"use client";

import React, { useState } from 'react';
import MathComponent from './MathComponent';

export default function NecessarySufficientBasicViz() {
  const [scenario, setScenario] = useState(0);
  const scenarios = [
    { p: "x = 2", q: "x^2 = 4", pSet: "x=2", qSet: "x=2, x=-2", relation: "P_in_Q", pName: "十分条件", qName: "必要条件", desc: "x=2ならば必ずx²=4になるが、逆は必ずしも言えない。PはQの中にすっぽり入る。" },
    { p: "x > 0", q: "x > 1", pSet: "x>0", qSet: "x>1", relation: "Q_in_P", pName: "必要条件", qName: "十分条件", desc: "x>1ならば必ずx>0になる。QはPの中にすっぽり入る。" },
    { p: "\\triangle ABCは正三角形", q: "\\triangle ABCは二等辺三角形", pSet: "正三角形", qSet: "二等辺三角形", relation: "P_in_Q", pName: "十分条件", qName: "必要条件", desc: "正三角形は必ず二等辺三角形である。PはQの中に含まれる。" },
    { p: "x^2 = 1", q: "|x| = 1", pSet: "x=1, x=-1", qSet: "x=1, x=-1", relation: "P_eq_Q", pName: "必要十分条件", qName: "必要十分条件", desc: "PとQの集合は完全に一致する。" }
  ];

  const current = scenarios[scenario];

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex items-center justify-center">
            {current.relation === "P_in_Q" && (
              <div className="relative w-48 h-48 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-start justify-center pt-4">
                <span className="text-blue-500 font-bold">Q ({current.qSet})</span>
                <div className="absolute bottom-4 w-24 h-24 rounded-full border-4 border-red-200 bg-red-50 flex items-center justify-center">
                  <span className="text-red-500 font-bold">P ({current.pSet})</span>
                </div>
              </div>
            )}
            {current.relation === "Q_in_P" && (
              <div className="relative w-48 h-48 rounded-full border-4 border-red-200 bg-red-50/50 flex items-start justify-center pt-4">
                <span className="text-red-500 font-bold">P ({current.pSet})</span>
                <div className="absolute bottom-4 w-24 h-24 rounded-full border-4 border-blue-200 bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-500 font-bold">Q ({current.qSet})</span>
                </div>
              </div>
            )}
            {current.relation === "P_eq_Q" && (
              <div className="relative w-40 h-40 rounded-full border-4 border-purple-300 bg-purple-100/50 flex items-center justify-center text-center">
                <span className="text-purple-700 font-bold">P = Q<br/>({current.pSet})</span>
              </div>
            )}
          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">条件 P</div>
                          <div className="font-bold text-red-500"><MathComponent tex={current.p} /></div>
                        </div>
                        <div className="text-slate-300 text-xl font-black">?</div>
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">条件 Q</div>
                          <div className="font-bold text-blue-500"><MathComponent tex={current.q} /></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                          <div className="text-xs text-red-400 font-bold mb-1">P は Q であるための</div>
                          <div className="font-black text-red-600 text-lg">{current.pName}</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                          <div className="text-xs text-blue-400 font-bold mb-1">Q は P であるための</div>
                          <div className="font-black text-blue-600 text-lg">{current.qName}</div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mt-4 bg-white p-4 rounded-xl border border-slate-200">
                          {current.desc}
                      </p>
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
