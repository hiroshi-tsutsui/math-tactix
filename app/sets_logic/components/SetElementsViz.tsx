"use client";

import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import MathComponent from './MathComponent';

export default function SetElementsViz() {
  const [nA, setNA] = useState(30);
  const [nB, setNB] = useState(40);
  const [nIntersection, setNIntersection] = useState(15);
  const [nU, setNU] = useState(100);

  // Auto-correct values to make mathematical sense
  useEffect(() => {
    if (nIntersection > Math.min(nA, nB)) {
      setNIntersection(Math.min(nA, nB));
    }
    const union = nA + nB - nIntersection;
    if (union > nU) {
      setNU(union + 10);
    }
  }, [nA, nB, nIntersection, nU]);

  const nUnion = nA + nB - nIntersection;
  const nOnlyA = nA - nIntersection;
  const nOnlyB = nB - nIntersection;
  const nNeither = nU - nUnion;

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex flex-col items-center justify-center">

            <div className="absolute top-4 left-4 font-bold text-slate-400">U ({nU})</div>
            <div className="absolute bottom-4 right-4 font-bold text-slate-400">Neither ({nNeither})</div>

            <div className="relative w-64 h-48 flex items-center justify-center">
                <div className="absolute left-4 w-40 h-40 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-center justify-start pl-6">
                    <span className="text-blue-500 font-bold flex flex-col items-center">
                        <span>Aのみ</span>
                        <span className="text-2xl">{nOnlyA}</span>
                    </span>
                </div>
                <div className="absolute right-4 w-40 h-40 rounded-full border-4 border-red-200 bg-red-50/50 flex items-center justify-end pr-6">
                    <span className="text-red-500 font-bold flex flex-col items-center">
                        <span>Bのみ</span>
                        <span className="text-2xl">{nOnlyB}</span>
                    </span>
                </div>
                <div className="absolute w-24 h-40 flex items-center justify-center z-10">
                    <span className="text-purple-600 font-black flex flex-col items-center bg-white/80 px-2 rounded-xl backdrop-blur-sm">
                        <span>A∩B</span>
                        <span className="text-2xl">{nIntersection}</span>
                    </span>
                </div>
            </div>

          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">

              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-blue-600 mb-2">
                        <span>n(A) : {nA}</span>
                    </div>
                    <input type="range" min={0} max={100} value={nA} onChange={e => setNA(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-red-600 mb-2">
                        <span>n(B) : {nB}</span>
                    </div>
                    <input type="range" min={0} max={100} value={nB} onChange={e => setNB(Number(e.target.value))} className="w-full accent-red-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-purple-600 mb-2">
                        <span>n(A ∩ B) : {nIntersection}</span>
                    </div>
                    <input type="range" min={0} max={Math.min(nA, nB)} value={nIntersection} onChange={e => setNIntersection(Number(e.target.value))} className="w-full accent-purple-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                        <span>n(U) 全体 : {nU}</span>
                    </div>
                    <input type="range" min={nUnion} max={200} value={nU} onChange={e => setNU(Number(e.target.value))} className="w-full accent-slate-500" />
                  </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><Calculator className="w-4 h-4" /> 集合の要素の個数</h3>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-center font-bold text-lg">
                        <MathComponent tex="n(A \cup B) = n(A) + n(B) - n(A \cap B)" />
                        <div className="mt-4 text-2xl text-slate-800">
                            {nUnion} = <span className="text-blue-500">{nA}</span> + <span className="text-red-500">{nB}</span> - <span className="text-purple-600">{nIntersection}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 leading-relaxed mt-4">
                          AとBを足すと、真ん中の重なった部分（A∩B）が2回足されてしまいます。
                          だから最後に1回分引くことで、全体の個数（A∪B）が出ます。
                      </p>
                  </div>
              </div>

          </div>
      </main>
    </div>
  );
}
