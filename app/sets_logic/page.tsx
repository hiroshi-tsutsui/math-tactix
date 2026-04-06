"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GeistSans } from 'geist/font/sans';
import { ChevronLeft, Compass, Search, SplitSquareHorizontal, Calculator } from 'lucide-react';
import 'katex/dist/katex.min.css';
import BackButton from '../components/BackButton';
import SetMaxMinViz from '../components/math/SetMaxMinViz';
import ConditionNumberLineViz from '../components/math/ConditionNumberLineViz';
import ThreeSetsViz from "@/app/components/math/ThreeSetsViz";
import CounterexampleViz from "../components/math/CounterexampleViz";
import ConditionalPropositionViz from "./components/ConditionalPropositionViz";
import NecessarySufficientAdvancedViz from "./components/NecessarySufficientViz";
import DeMorganViz from "./components/DeMorganViz";
import ProofMethodViz from "./components/ProofMethodViz";
import MathComponent from "./components/MathComponent";
import NecessarySufficientBasicViz from "./components/NecessarySufficientBasicViz";
import ContrapositiveViz from "./components/ContrapositiveViz";
import SetElementsViz from "./components/SetElementsViz";
import ContradictionViz from "./components/ContradictionViz";
import QuadraticSetsViz from "./components/QuadraticSetsViz";
import QuantifierNegationViz from "./components/QuantifierNegationViz";
import CompoundConditionViz from "./components/CompoundConditionViz";
import InclusionExclusionViz from "./components/InclusionExclusionViz";
import NecessarySufficientConditionViz from "./components/NecessarySufficientConditionViz";
import ConditionalPatternViz from "./components/ConditionalPatternViz";


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
            {level === 0 ? "集合と命題 (Sets & Logic)" : level === 1 ? "ド・モルガンの法則" : level === 2 ? "必要条件と十分条件" : level === 3 ? "逆・裏・対偶" : level === 4 ? "集合の要素の個数" : level === 5 ? "背理法の証明" : level === 6 ? "連立不等式と集合" : level === 7 ? "集合の要素の最大・最小" : level === 8 ? "必要条件・十分条件と数直線" : level === 9 ? "3つの集合の要素の個数" : level === 10 ? "命題の真偽と反例" : level === 11 ? "全称命題と存在命題" : level === 12 ? "条件命題・対偶・裏・逆" : level === 13 ? "必要条件・十分条件（発展）" : level === 14 ? "ド・モルガンの法則（発展）" : level === 15 ? "背理法・対偶証明の練習" : level === 16 ? "複合条件の否定と対偶" : level === 17 ? "集合の要素の個数（包除原理）" : level === 18 ? "必要十分条件の判定（二次方程式）" : level === 19 ? "条件命題パターン集" : "Sets & Logic"}
        </div>
        <div className="w-10" />
      </header>
      {level === 2 && (
          <NecessarySufficientBasicViz />
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

      {level === 15 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <ProofMethodViz />
              </div>
          </main>
      )}

      {level === 16 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <CompoundConditionViz />
              </div>
          </main>
      )}

      {level === 17 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <InclusionExclusionViz />
              </div>
          </main>
      )}

      {level === 18 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <NecessarySufficientConditionViz />
              </div>
          </main>
      )}

      {level === 19 && (
          <main className="flex-1 overflow-y-auto bg-white p-6">
              <div className="max-w-md mx-auto">
                  <ConditionalPatternViz />
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
                      { id: 14, title: "Level 14: ド・モルガンの法則（発展）", desc: "ベン図と真偽表でNOTの分配を理解", icon: Compass },
                      { id: 15, title: "Level 15: 背理法・対偶証明の練習", desc: "間接証明法の2つの柱を視覚的に理解", icon: SplitSquareHorizontal },
                      { id: 16, title: "Level 16: 複合条件の否定と対偶", desc: "ド・モルガン則で複合条件を否定する", icon: Compass },
                      { id: 17, title: "Level 17: 集合の要素の個数（包除原理）", desc: "|A∪B| = |A|+|B|-|A∩B| のベン図視覚化", icon: Calculator },
                      { id: 18, title: "Level 18: 必要十分条件の判定（二次方程式）", desc: "二次方程式との組み合わせで必要・十分条件を判定", icon: Search },
                      { id: 19, title: "Level 19: 条件命題パターン集", desc: "逆・裏・対偶の真偽パターンをベン図で視覚化", icon: SplitSquareHorizontal }
                  ].map((item) => (
                      <button key={item.id} onClick={() => setLevel(item.id)}
                        className="w-full bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500 transition-all group text-left shadow-sm hover:shadow-md">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <item.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                              <div className="font-bold text-lg">{item.title}</div>
                              <div className="text-xs text-slate-500">{item.desc}</div>
                              {/* TODO: 将来的に解説動画URLを差し込む */}
                              <span className="text-[10px] text-slate-300 mt-1 inline-block">📺 解説動画 準備中</span>
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
