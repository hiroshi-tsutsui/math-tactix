"use client";

import React, { useState, useEffect, useRef, useReducer } from 'react';
import { GeistSans } from 'geist/font/sans';
import { 
  ChevronLeft, ChevronRight, Zap, Target, 
  RefreshCw, CheckCircle2, HelpCircle, 
  TrendingUp, Circle, Compass, Activity,
  Trophy, Star, Play, Dices
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import Link from 'next/link';

// --- Components ---
const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

// --- Logic Helpers ---
const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
const nPr = (n: number, r: number): number => factorial(n) / factorial(n - r);
const nCr = (n: number, r: number): number => nPr(n, r) / factorial(r);

type State = {
  level: number; 
  n: number;
  r: number;
  probA: number;
  probB: number;
};

type Action = 
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_N'; payload: number }
  | { type: 'SET_R'; payload: number }
  | { type: 'SET_PROBA'; payload: number }
  | { type: 'SET_PROBB'; payload: number }
  | { type: 'RESET_ALL' };

function probReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LEVEL': return { ...state, level: action.payload, n: 5, r: 3, probA: 0.5, probB: 0.5 };
    case 'SET_N': return { ...state, n: action.payload, r: Math.min(state.r, action.payload) };
    case 'SET_R': return { ...state, r: action.payload };
    case 'SET_PROBA': return { ...state, probA: action.payload };
    case 'SET_PROBB': return { ...state, probB: action.payload };
    case 'RESET_ALL': return { level: 0, n: 5, r: 3, probA: 0.5, probB: 0.5 };
    default: return state;
  }
}

export default function ProbabilityPage() {
  const [state, dispatch] = useReducer(probReducer, { 
    level: 0, n: 5, r: 3, probA: 0.5, probB: 0.5 
  });
  const { level, n, r, probA, probB } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Visual Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width, h = canvas.height;
    const ox = w / 2, oy = h / 2;
    
    const colors = {
      grid: 'rgba(0,0,0,0.03)',
      primary: '#007AFF',
      secondary: '#FF3B30', 
      text: '#1D1D1F',
      itemBg: '#f1f5f9',
      itemBorder: '#cbd5e1'
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Level 1: Permutations vs Combinations
      if (level === 1 || level === 2) {
          const itemsPerRow = 5;
          const startX = ox - (Math.min(n, itemsPerRow) * 30) / 2 + 15;
          const startY = oy - 40;
          
          ctx.font = "bold 16px Geist Sans";
          ctx.textAlign = "center";
          
          // Draw N items pool
          for (let i = 0; i < n; i++) {
              const x = startX + (i % itemsPerRow) * 30;
              const y = startY + Math.floor(i / itemsPerRow) * 40;
              
              ctx.beginPath();
              ctx.arc(x, y, 12, 0, Math.PI * 2);
              ctx.fillStyle = i < r ? colors.primary : colors.itemBg;
              ctx.fill();
              ctx.strokeStyle = i < r ? colors.primary : colors.itemBorder;
              ctx.lineWidth = 2;
              ctx.stroke();
              
              ctx.fillStyle = i < r ? '#ffffff' : colors.text;
              ctx.fillText((i + 1).toString(), x, y + 5);
          }
          
          // Draw selection slots
          const slotStartX = ox - (r * 35) / 2 + 17.5;
          const slotY = oy + 60;
          
          for (let i = 0; i < r; i++) {
              const x = slotStartX + i * 35;
              
              ctx.beginPath();
              ctx.roundRect(x - 15, slotY - 15, 30, 30, 6);
              if (level === 1) {
                  // Permutations: order matters
                  ctx.strokeStyle = colors.primary;
                  ctx.fillStyle = 'rgba(0, 122, 255, 0.1)';
              } else {
                  // Combinations: order doesn't matter (grouping)
                  ctx.strokeStyle = colors.secondary;
                  ctx.fillStyle = 'rgba(255, 59, 48, 0.1)';
              }
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.fill();
              
              ctx.fillStyle = colors.text;
              ctx.fillText((i + 1).toString(), x, slotY + 5);
              
              if (level === 1) {
                  ctx.font = "10px Geist Sans";
                  ctx.fillStyle = colors.primary;
                  ctx.fillText(`Slot ${i+1}`, x, slotY + 25);
                  ctx.font = "bold 16px Geist Sans";
              }
          }
          
          // If Combinations, draw a big grouping box around slots
          if (level === 2 && r > 0) {
              ctx.beginPath();
              ctx.roundRect(slotStartX - 25, slotY - 25, r * 35 + 15, 50, 12);
              ctx.strokeStyle = colors.secondary;
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.stroke();
              ctx.setLineDash([]);
              
              ctx.font = "12px Geist Sans";
              ctx.fillStyle = colors.secondary;
              ctx.fillText("順序は区別しない (1 Group)", ox, slotY + 40);
          }
      }

      // Level 3: Conditional Probability P(A|B)
      if (level === 3) {
          // A and B Venn Diagram
          const rA = 80;
          const rB = 80;
          const d = 60; // distance between centers
          const xA = ox - d/2;
          const xB = ox + d/2;
          
          // Draw Universe
          ctx.beginPath();
          ctx.rect(ox - 150, oy - 120, 300, 240);
          ctx.strokeStyle = colors.itemBorder;
          ctx.stroke();
          
          // A Area
          ctx.beginPath();
          ctx.arc(xA, oy, rA, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 122, 255, ${probA})`;
          ctx.fill();
          ctx.strokeStyle = colors.primary;
          ctx.stroke();
          
          // B Area
          ctx.beginPath();
          ctx.arc(xB, oy, rB, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 59, 48, ${probB})`;
          ctx.fill();
          ctx.strokeStyle = colors.secondary;
          ctx.stroke();
          
          // Labels
          ctx.font = "bold 18px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText("A", xA - 40, oy - 40);
          ctx.fillText("B", xB + 40, oy - 40);
          
          // Focus on B for Conditional P(A|B)
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.secondary;
          ctx.fillText("事象Bが起こったという条件の下で...", ox, oy + 100);
          
          // Highlight Intersection relative to B
          ctx.beginPath();
          ctx.arc(xB, oy, rB + 10, 0, Math.PI * 2);
          ctx.strokeStyle = colors.secondary;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
      }
    };
    render();
  }, [level, n, r, probA, probB]);

  const pValue = nPr(n, r);
  const cValue = nCr(n, r);

  return (
    <div className={`h-screen bg-white text-slate-900 flex flex-col ${GeistSans.className} overflow-hidden`}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-100 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
            {level > 0 && (
                <button onClick={() => dispatch({type: 'RESET_ALL'})} className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {level === 0 ? "MATHEMATICS A" : `LEVEL ${level}`}
            </div>
        </div>
        <div className="font-bold text-sm">
            {level === 0 ? "場合の数と確率 (Probability)" : 
             level === 1 ? "順列 (Permutations)" : 
             level === 2 ? "組合せ (Combinations)" : 
             "条件付き確率 (Conditional Probability)"}
        </div>
        <div className="w-10" />
      </header>

      {/* Level Selection Menu */}
      {level === 0 && (
          <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-md mx-auto space-y-4">
                  <h1 className="text-2xl font-black mb-8 text-center">Select Module</h1>
                  
                  {[
                      { id: 1, title: "Level 1: 順列 (Permutations)", desc: "n個からr個を選んで一列に並べる", icon: Dices },
                      { id: 2, title: "Level 2: 組合せ (Combinations)", desc: "n個からr個を順序を気にせず選ぶ", icon: Circle },
                      { id: 3, title: "Level 3: 条件付き確率", desc: "事象Bが起こった時の事象Aの確率", icon: Target }
                  ].map((item) => (
                      <button key={item.id} onClick={() => dispatch({type: 'SET_LEVEL', payload: item.id})}
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

      {/* Visualization Mode */}
      {level > 0 && (
          <>
            <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[400px]">
                <div className="w-full max-w-md aspect-square bg-white rounded-[48px] border border-slate-200/60 shadow-inner overflow-hidden relative">
                    <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
                    
                    {/* Overlay: Formulas */}
                    {(level === 1 || level === 2) && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                                {level === 1 ? "Permutations (順列)" : "Combinations (組合せ)"}
                            </div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500 font-bold">n = {n}</span>
                                    <span className="text-red-500 font-bold">r = {r}</span>
                                </div>
                                <div className="text-lg font-bold mt-2">
                                    {level === 1 ? (
                                        <MathComponent tex={`{}_{${n}}\\mathrm{P}_{${r}} = ${pValue}`} />
                                    ) : (
                                        <MathComponent tex={`{}_{${n}}\\mathrm{C}_{${r}} = ${cValue}`} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {level === 3 && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Conditional Probability</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="text-lg font-bold">
                                    <MathComponent tex={`P(A|B) = \\frac{P(A \\cap B)}{P(B)}`} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <main className="flex-1 overflow-y-auto bg-white p-6">
                <div className="max-w-md mx-auto space-y-6">
                    {/* Controls */}
                    {(level === 1 || level === 2) && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Total Items (n): {n}</span>
                                </div>
                                <input type="range" min="1" max="8" step="1" value={n} 
                                    onChange={e => dispatch({type: 'SET_N', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Select Items (r): {r}</span>
                                </div>
                                <input type="range" min="0" max={n} step="1" value={r} 
                                    onChange={e => dispatch({type: 'SET_R', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {level === 3 && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>P(A): {probA.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0.1" max="0.9" step="0.1" value={probA} 
                                    onChange={e => dispatch({type: 'SET_PROBA', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-500 cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>P(B): {probB.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0.1" max="0.9" step="0.1" value={probB} 
                                    onChange={e => dispatch({type: 'SET_PROBB', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-red-500 cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {/* Explanations */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        {level === 1 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Dices className="w-4 h-4 text-blue-500" /> 順列 (Permutations)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    異なる <MathComponent tex="n" /> 個のものから <MathComponent tex="r" /> 個を選んで<strong>「一列に並べる」</strong>場合の数です。<br/>
                                    <strong>順番が違うものは別々に数えられます。</strong> (例: 1-2 と 2-1 は別)
                                </p>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <MathComponent tex="{}_{n}\mathrm{P}_{r} = \frac{n!}{(n-r)!}" className="text-xl font-bold text-blue-700 block mb-2" />
                                    <span className="text-xs text-blue-600">階乗 (Factorial) を使って計算します。</span>
                                </div>
                            </div>
                        )}

                        {level === 2 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Circle className="w-4 h-4 text-red-500" /> 組合せ (Combinations)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    異なる <MathComponent tex="n" /> 個のものから <MathComponent tex="r" /> 個を<strong>「選ぶだけ」</strong>の場合の数です。<br/>
                                    <strong>順番は区別しません。</strong> (例: 1-2 と 2-1 は同じ1つの組)
                                </p>
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                    <MathComponent tex="{}_{n}\mathrm{C}_{r} = \frac{{}_{n}\mathrm{P}_{r}}{r!} = \frac{n!}{r!(n-r)!}" className="text-xl font-bold text-red-700 block mb-2" />
                                    <span className="text-xs text-red-600">順列を r! で割って重複をなくします。</span>
                                </div>
                            </div>
                        )}

                        {level === 3 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4" /> 条件付き確率</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    ある事象Bが起こったという条件の下で、事象Aが起こる確率 <MathComponent tex="P(A|B)" /> を考えます。<br/>
                                    全体の世界が「Bの円の中だけ」に縮小されるイメージです。
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                                    <MathComponent tex="P(A|B) = \frac{P(A \cap B)}{P(B)}" className="text-xl font-bold block mb-2" />
                                    <span className="text-xs text-slate-500">Bの面積に対する、AとBの重なりの面積の割合。</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
          </>
      )}
    </div>
  );
}
