"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GeistSans } from 'geist/font/sans';
import { ChevronLeft, Compass, Search, SplitSquareHorizontal, Calculator } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import BackButton from '../components/BackButton';
import SetMaxMinViz from '../components/math/SetMaxMinViz';
import ConditionNumberLineViz from '../components/math/ConditionNumberLineViz';
import ThreeSetsViz from "@/app/components/math/ThreeSetsViz";
import CounterexampleViz from "../components/math/CounterexampleViz";
import ConditionalPropositionViz from "./components/ConditionalPropositionViz";
import NecessarySufficientAdvancedViz from "./components/NecessarySufficientViz";
import DeMorganViz from "./components/DeMorganViz";


const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};


function NecessarySufficientViz() {
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


function ContrapositiveViz() {
  const [mode, setMode] = useState<"original" | "converse" | "inverse" | "contra">("original");

  const pSetColor = "bg-red-100 border-red-300 text-red-600";
  const qSetColor = "bg-blue-100 border-blue-300 text-blue-600";
  const notPSetColor = "bg-red-900 border-red-700 text-red-100";
  const notQSetColor = "bg-blue-900 border-blue-700 text-blue-100";

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex items-center justify-center">
            
            {/* Base Diagram: P is inside Q */}
            {(mode === "original" || mode === "converse") && (
              <div className="relative w-48 h-48 rounded-full border-4 border-blue-300 bg-blue-100 flex items-start justify-center pt-4">
                <span className="text-blue-600 font-bold">Q</span>
                <div className="absolute bottom-4 w-24 h-24 rounded-full border-4 border-red-300 bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">P</span>
                </div>
              </div>
            )}

            {/* Negation Diagram: not Q is inside not P */}
            {(mode === "inverse" || mode === "contra") && (
              <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 border-[16px] border-slate-200"></div>
                <div className="relative w-64 h-64 rounded-full border-4 border-red-700 bg-red-900 flex items-start justify-center pt-4">
                  <span className="text-red-100 font-bold z-10"><MathComponent tex="\overline{P}" /></span>
                  <div className="absolute bottom-4 w-32 h-32 rounded-full border-4 border-blue-700 bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-100 font-bold"><MathComponent tex="\overline{Q}" /></span>
                  </div>
                </div>
              </div>
            )}

          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setMode("original")} className={`p-4 rounded-xl border-2 font-bold ${mode === "original" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}`}>
                      <div className="text-xs text-slate-400 mb-1">元の命題 (真)</div>
                      <MathComponent tex="P \implies Q" />
                  </button>
                  <button onClick={() => setMode("converse")} className={`p-4 rounded-xl border-2 font-bold ${mode === "converse" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}`}>
                      <div className="text-xs text-slate-400 mb-1">逆 (必ずしも真ではない)</div>
                      <MathComponent tex="Q \implies P" />
                  </button>
                  <button onClick={() => setMode("inverse")} className={`p-4 rounded-xl border-2 font-bold ${mode === "inverse" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}`}>
                      <div className="text-xs text-slate-400 mb-1">裏 (必ずしも真ではない)</div>
                      <MathComponent tex="\overline{P} \implies \overline{Q}" />
                  </button>
                  <button onClick={() => setMode("contra")} className={`p-4 rounded-xl border-2 font-bold ${mode === "contra" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}`}>
                      <div className="text-xs text-slate-400 mb-1">対偶 (必ず真)</div>
                      <MathComponent tex="\overline{Q} \implies \overline{P}" />
                  </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <h3 className="font-bold">命題と集合の包含関係</h3>
                      {mode === "original" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="P \implies Q" />」が真であるとは、集合Pが集合Qに完全に含まれている状態（<MathComponent tex="P \subset Q" />）を指します。
                        </p>
                      )}
                      {mode === "converse" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="Q \implies P" />」は、QがPに含まれている状態ですが、図を見るとQの外側にはみ出る部分があるため、逆は必ずしも真になりません。
                        </p>
                      )}
                      {mode === "inverse" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="\overline{P} \implies \overline{Q}" />」は、Pの外側がQの外側に含まれるかですが、図でPの外側にQの部分が含まれているため、裏も必ずしも真になりません。
                        </p>
                      )}
                      {mode === "contra" && (
                        <p className="text-sm text-slate-600 leading-relaxed text-blue-700 font-bold bg-blue-50 p-4 rounded-lg">
                          「<MathComponent tex="\overline{Q} \implies \overline{P}" />」は、Qの外側が完全にPの外側に含まれる状態です。図のように、「外側」を考えると包含関係が逆転するため、元の命題が真なら対偶も必ず真になります。
                        </p>
                      )}
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
}


function SetElementsViz() {
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


function ContradictionViz() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">
            
            {step === 0 && (
                <div className="text-center animate-fade-in">
                    <div className="text-xl font-bold mb-4">目標: <MathComponent tex="\sqrt{2}" /> は無理数であることを証明せよ</div>
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold">
                        背理法のスタート：<br/>「有理数である（分数で表せる）」と【仮定】する！
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="\sqrt{2} = \frac{p}{q}" className="text-3xl font-bold block mb-4" />
                    <div className="text-sm text-slate-500 mb-2">（pとqは互いに素な自然数）</div>
                    <div className="flex items-center gap-4 text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100 font-bold">
                        両辺を2乗して分母を払うと…<br/>
                        <MathComponent tex="2q^2 = p^2" />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="2 \times q^2 = p^2" className="text-2xl font-bold block mb-4 text-blue-600" />
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 font-bold text-sm text-left">
                        左辺は「2×何か」なので【偶数】。<br/>
                        つまり右辺の <MathComponent tex="p^2" /> も【偶数】。<br/>
                        <MathComponent tex="p^2" /> が偶数なら、<MathComponent tex="p" /> も【偶数】である。
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="p = 2k" className="text-2xl font-bold block mb-4" />
                    <div className="bg-slate-100 p-4 rounded-xl text-sm text-left font-bold text-slate-700">
                        <MathComponent tex="2q^2 = (2k)^2" /> に代入<br/>
                        <MathComponent tex="2q^2 = 4k^2" /> <br/>
                        <MathComponent tex="q^2 = 2k^2" />
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="q^2 = 2 \times k^2" className="text-2xl font-bold block mb-4 text-purple-600" />
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 font-bold text-sm text-left">
                        右辺は「2×何か」なので【偶数】。<br/>
                        つまり左辺の <MathComponent tex="q^2" /> も【偶数】。<br/>
                        <MathComponent tex="q^2" /> が偶数なら、<MathComponent tex="q" /> も【偶数】である。
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="text-center animate-fade-in">
                    <div className="text-4xl mb-4">💥 矛盾 💥</div>
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-200 font-bold text-sm text-left">
                        pも偶数、qも偶数になった！<br/>
                        最初のアサンプション「pとqは互いに素（これ以上約分できない）」に完全に矛盾する！<br/>
                        <span className="block mt-2 text-center text-lg">∴ <MathComponent tex="\sqrt{2}" /> は無理数である。</span>
                    </div>
                </div>
            )}

          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">
              
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 disabled:opacity-50">
                      戻る
                  </button>
                  <div className="font-bold text-slate-500">Step {step + 1} / 6</div>
                  <button disabled={step === 5} onClick={() => setStep(s => s + 1)} className="p-3 bg-blue-500 text-white rounded-xl shadow-sm border border-blue-600 disabled:opacity-50 font-bold">
                      次へ
                  </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><Calculator className="w-4 h-4" /> 背理法（Proof by Contradiction）</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                          直接証明するのが難しいとき、「もしそれが逆だったらどうなるか？」と仮定して、論理を進めます。<br/>
                          論理を進めて「ありえないこと（矛盾）」が起きたら、「やっぱり最初の仮定が間違っていたんだ！」と結論づける強力な証明方法です。
                      </p>
                  </div>
              </div>

          </div>
      </main>
    </div>
  );
}


function QuadraticSetsViz() {
  const [aBounds, setABounds] = useState([-2, 3]);
  const [bBounds, setBBounds] = useState([1, 4]);
  const [bType, setBType] = useState<'inside'|'outside'>('outside');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const ox = w / 2;
    const oy = h / 2;
    const scale = 30;

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, oy); ctx.lineTo(w - 20, oy); ctx.stroke();

    for(let i=-6; i<=6; i++) {
        const x = ox + i * scale;
        ctx.beginPath(); ctx.moveTo(x, oy - 5); ctx.lineTo(x, oy + 5); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x, oy + 20);
    }

    const ax1 = ox + aBounds[0] * scale;
    const ax2 = ox + aBounds[1] * scale;
    const ay = oy - 40;

    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax1, ay); ctx.lineTo(ax2, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax1, oy); ctx.lineTo(ax1, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax2, oy); ctx.lineTo(ax2, ay); ctx.stroke();
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(ax1, ay, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ax2, ay, 4, 0, Math.PI*2); ctx.fill();
    ctx.font = 'bold 14px sans-serif'; ctx.fillText('A', (ax1+ax2)/2, ay - 10);

    const bx1 = ox + bBounds[0] * scale;
    const bx2 = ox + bBounds[1] * scale;
    const by = oy - 20;

    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    if (bType === 'outside') {
        ctx.beginPath(); ctx.moveTo(20, by); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, by); ctx.lineTo(w-20, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx1, oy); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, oy); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx1, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx2, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.fillText('B', bx1 - 20, by - 10);
        ctx.fillText('B', bx2 + 20, by - 10);
    } else {
        ctx.beginPath(); ctx.moveTo(bx1, by); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx1, oy); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, oy); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx1, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx2, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.fillText('B', (bx1+bx2)/2, by - 10);
    }

    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    if (bType === 'outside') {
        if (aBounds[0] < bBounds[0]) {
            const ix1 = ox + aBounds[0] * scale;
            const ix2 = ox + Math.min(aBounds[1], bBounds[0]) * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
        if (aBounds[1] > bBounds[1]) {
            const ix1 = ox + Math.max(aBounds[0], bBounds[1]) * scale;
            const ix2 = ox + aBounds[1] * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
    } else {
        const start = Math.max(aBounds[0], bBounds[0]);
        const end = Math.min(aBounds[1], bBounds[1]);
        if (start < end) {
            const ix1 = ox + start * scale;
            const ix2 = ox + end * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
    }

  }, [aBounds, bBounds, bType]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <canvas ref={canvasRef} width={400} height={200} className="w-full max-w-md border border-slate-100 dark:border-slate-800 rounded-xl" />
        <p className="mt-4 text-sm text-slate-500 font-mono text-center">
          紫色の領域が A と B の共通部分です。<br/>
          整数解がいくつ含まれるか数えてみましょう。
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <div className="font-bold text-blue-700 dark:text-blue-400 mb-2">集合 A (閉区間: ≤, ≥)</div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-mono w-12 text-black dark:text-white">Min: {aBounds[0]}</span>
            <input type="range" min="-6" max="0" value={aBounds[0]} onChange={e => setABounds([parseInt(e.target.value), aBounds[1]])} className="w-full" />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span className="text-sm font-mono w-12 text-black dark:text-white">Max: {aBounds[1]}</span>
            <input type="range" min="1" max="6" value={aBounds[1]} onChange={e => setABounds([aBounds[0], parseInt(e.target.value)])} className="w-full" />
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
          <div className="font-bold text-red-700 dark:text-red-400 mb-2 flex justify-between items-center">
            <span>集合 B (開区間: &lt;, &gt;)</span>
            <button onClick={() => setBType(bType === "outside" ? "inside" : "outside")} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-md">
              Toggle: {bType === "outside" ? "x < b1, b2 < x" : "b1 < x < b2"}
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-mono w-12 text-black dark:text-white">b1: {bBounds[0]}</span>
            <input type="range" min="-4" max="2" value={bBounds[0]} onChange={e => setBBounds([parseInt(e.target.value), bBounds[1]])} className="w-full" />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span className="text-sm font-mono w-12 text-black dark:text-white">b2: {bBounds[1]}</span>
            <input type="range" min="3" max="6" value={bBounds[1]} onChange={e => setBBounds([bBounds[0], parseInt(e.target.value)])} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantifierNegationViz() {
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


export default function SetsLogicPage() {
  const [level, setLevel] = useState<number>(0);
  const [activeSet, setActiveSet] = useState<string>("A_cup_B"); // A U B, A n B, not_A_cup_B, etc.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (level !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    // Universal set U
    const uRect = { x: 20, y: 20, w: w - 40, h: h - 40 };
    
    // Set A and B
    const r = 80;
    const ax = w / 2 - 40, ay = h / 2;
    const bx = w / 2 + 40, by = h / 2;
    
    const fillRegion = (condition: (x: number, y: number) => boolean, color: string) => {
      ctx.fillStyle = color;
      for(let y = uRect.y; y < uRect.y + uRect.h; y+=2) {
        for(let x = uRect.x; x < uRect.x + uRect.w; x+=2) {
          if(condition(x, y)) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
    };
    
    const inA = (x: number, y: number) => (x - ax)**2 + (y - ay)**2 <= r**2;
    const inB = (x: number, y: number) => (x - bx)**2 + (y - by)**2 <= r**2;
    
    const highlightColor = 'rgba(59, 130, 246, 0.4)'; // Blue-500 with opacity
    
    if (activeSet === "A_cup_B") {
      fillRegion((x, y) => inA(x,y) || inB(x,y), highlightColor);
    } else if (activeSet === "A_cap_B") {
      fillRegion((x, y) => inA(x,y) && inB(x,y), highlightColor);
    } else if (activeSet === "not_A_cup_B") {
      fillRegion((x, y) => !(inA(x,y) || inB(x,y)), highlightColor);
    } else if (activeSet === "not_A_cap_not_B") {
      fillRegion((x, y) => !inA(x,y) && !inB(x,y), highlightColor);
    } else if (activeSet === "not_A_cap_B") {
      fillRegion((x, y) => !(inA(x,y) && inB(x,y)), highlightColor);
    } else if (activeSet === "not_A_cup_not_B") {
      fillRegion((x, y) => !inA(x,y) || !inB(x,y), highlightColor);
    }
    
    // Draw U boundary
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(uRect.x, uRect.y, uRect.w, uRect.h);
    
    // Draw A and B circles
    ctx.beginPath(); ctx.arc(ax, ay, r, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Geist Sans';
    ctx.fillText('U', uRect.x + 10, uRect.y + 25);
    ctx.fillText('A', ax - 50, ay - 50);
    ctx.fillText('B', bx + 30, ay - 50);

  }, [level, activeSet]);

  return (
    <div className={`h-screen bg-white text-slate-900 flex flex-col ${GeistSans.className} overflow-hidden`}>
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-100 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
            {level === 0 ? (
                <BackButton href="/" />
            ) : (
                <button onClick={() => setLevel(0)} className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}




            <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {level === 0 ? "MATHEMATICS I" : `LEVEL ${level}`}
            </div>
        </div>
        <div className="font-bold text-sm">
            {level === 0 ? "集合と命題 (Sets & Logic)" : level === 1 ? "ド・モルガンの法則" : level === 2 ? "必要条件と十分条件" : level === 3 ? "逆・裏・対偶" : level === 4 ? "集合の要素の個数" : level === 5 ? "背理法の証明" : level === 6 ? "連立不等式と集合" : level === 7 ? "集合の要素の最大・最小" : level === 8 ? "必要条件・十分条件と数直線" : level === 9 ? "3つの集合の要素の個数" : level === 10 ? "命題の真偽と反例" : level === 11 ? "全称命題と存在命題" : level === 12 ? "条件命題・対偶・裏・逆" : level === 13 ? "必要条件・十分条件（発展）" : level === 14 ? "ド・モルガンの法則（発展）" : "Sets & Logic"}
        </div>
        <div className="w-10" />
      </header>
      {level === 2 && (
          <NecessarySufficientViz />
      )}
      {level === 3 && (
          <ContrapositiveViz />
      )}
      {level === 4 && (
          <SetElementsViz />
      )}
      {level === 5 && (
          <ContradictionViz />
      )}
      {level === 6 && (
          <QuadraticSetsViz />
      )}

      {level === 7 && (
          <SetMaxMinViz />
      )}

      {level === 9 && (
          <ThreeSetsViz />
      )}

      {level === 10 && (
          <CounterexampleViz />
      )}

      {level === 8 && (
          <ConditionNumberLineViz />
      )}

      {level === 11 && (
          <QuantifierNegationViz />
      )}

      {level === 12 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <ConditionalPropositionViz />
              </div>
          </main>
      )}

      {level === 13 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <NecessarySufficientAdvancedViz />
              </div>
          </main>
      )}

      {level === 14 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <DeMorganViz />
              </div>
          </main>
      )}

      {level === 0 && (
          <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-md mx-auto space-y-4">
                  <h1 className="text-2xl font-black mb-8 text-center">Select Module</h1>
                  
                  {[
                      { id: 1, title: "Level 1: ド・モルガンの法則", desc: "集合の演算とベン図の視覚的証明", icon: Compass },
                      { id: 2, title: "Level 2: 必要条件と十分条件", desc: "PとQの包含関係を視覚化", icon: Search },
                      { id: 3, title: "Level 3: 逆・裏・対偶", desc: "命題の真偽と集合の包含関係", icon: SplitSquareHorizontal },
                      { id: 4, title: "Level 4: 集合の要素の個数", desc: "n(A∪B) = n(A) + n(B) - n(A∩B)", icon: Calculator },
                      { id: 5, title: "Level 5: 背理法の証明", desc: "ルート2が無理数であることの証明", icon: SplitSquareHorizontal },
                          { id: 6, title: "Level 6: 連立不等式と集合", desc: "共通範囲と整数解の個数を視覚化", icon: Search },
                      { id: 7, title: "Level 7: 集合の要素の最大・最小", desc: "共通部分の範囲と限界", icon: Calculator },
                      { id: 8, title: "Level 8: 必要条件・十分条件と数直線", desc: "範囲と包含関係", icon: Search }, { id: 9, title: "Level 9: 3つの集合の要素の個数", desc: "3つの集合の和集合と共通部分", icon: Calculator }, { id: 10, title: "Level 10: 命題の真偽と反例", desc: "P ならば Q の真偽と反例の視覚化", icon: Search },
                      { id: 11, title: "Level 11: 全称命題と存在命題", desc: "∀と∃の否定で量化子が入れ替わる", icon: SplitSquareHorizontal },
                      { id: 12, title: "Level 12: 条件命題・対偶・裏・逆", desc: "p→qの真偽表と4つの命題の関係", icon: SplitSquareHorizontal },
                      { id: 13, title: "Level 13: 必要条件・十分条件（発展）", desc: "4パターンの包含関係をベン図で理解", icon: Search },
                      { id: 14, title: "Level 14: ド・モルガンの法則（発展）", desc: "ベン図と真偽表でNOTの分配を理解", icon: Compass }
                  ].map((item) => (
                      <button key={item.id} onClick={() => setLevel(item.id)}
                        className="w-full bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500 transition-all group text-left shadow-sm hover:shadow-md">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                              <div className="font-bold text-lg">{item.title}</div>
                              <div className="text-xs text-slate-500">{item.desc}</div>
                          </div>
                      </button>
                  ))}
              </div>
          </main>
      )}

      {level === 1 && (
          <>
            <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[400px]">
                <div className="w-full max-w-md aspect-square bg-white rounded-[48px] border border-slate-200/60 shadow-inner overflow-hidden relative">
                    <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
                </div>
            </section>

            <main className="flex-1 overflow-y-auto bg-white p-6">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveSet("A_cup_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "A_cup_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="A \cup B" />
                        </button>
                        <button onClick={() => setActiveSet("A_cap_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "A_cap_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="A \cap B" />
                        </button>
                        <button onClick={() => setActiveSet("not_A_cup_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "not_A_cup_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="\overline{A \cup B}" />
                        </button>
                        <button onClick={() => setActiveSet("not_A_cap_not_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "not_A_cap_not_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="\overline{A} \cap \overline{B}" />
                        </button>
                        <button onClick={() => setActiveSet("not_A_cap_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "not_A_cap_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="\overline{A \cap B}" />
                        </button>
                        <button onClick={() => setActiveSet("not_A_cup_not_B")} className={`p-4 rounded-xl border-2 font-bold ${activeSet === "not_A_cup_not_B" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}>
                            <MathComponent tex="\overline{A} \cup \overline{B}" />
                        </button>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2"><SplitSquareHorizontal className="w-4 h-4" /> ド・モルガンの法則</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                上のボタンを切り替えて、ベン図の塗られる領域が全く同じになるペアを見つけましょう。
                            </p>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                <MathComponent tex="\overline{A \cup B} = \overline{A} \cap \overline{B}" className="text-lg font-bold text-blue-700 block mb-2" />
                                <MathComponent tex="\overline{A \cap B} = \overline{A} \cup \overline{B}" className="text-lg font-bold text-blue-700 block" />
                            </div>
                            <p className="text-xs text-slate-400 text-center mt-2">
                                「全体を否定すると、カップ(∪)とキャップ(∩)がひっくり返る」という法則が、ベン図を使えば視覚的に明らかになります。
                            </p>
                        </div>
                    </div>
                </div>
            </main>
          </>
      )}
    </div>
  );
}
