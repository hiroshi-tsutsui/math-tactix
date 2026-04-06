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
import ShortestPathViz from './components/ShortestPathViz';
import CircularPermutationViz from "./components/CircularPermutationViz";
import NecklacePermutationViz from "./components/NecklacePermutationViz";
import IndistinguishablePermutationViz from "./components/IndistinguishablePermutationViz";

import { CombinationRepetitionViz } from './components/CombinationRepetitionViz';
import GroupingViz from "./components/GroupingViz";
import ComplementaryEventViz from "./components/ComplementaryEventViz";
import IndependentEventViz from "./components/IndependentEventViz";
import AdditionRuleViz from "./components/AdditionRuleViz";

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
    
      // Level 4: Independent Trials
      
      // Level 5: Maximum Value Probability (n=2 dice)
      if (level === 5) {
          const faces = 6;
          const k = r || 4; // use r as the target max value
          const cellSize = 30;
          const startX = ox - (faces * cellSize) / 2;
          const startY = oy - (faces * cellSize) / 2;
          
          ctx.font = "12px Geist Sans";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          for (let i = 1; i <= faces; i++) {
              for (let j = 1; j <= faces; j++) {
                  const x = startX + (i - 1) * cellSize;
                  const y = startY + (faces - j) * cellSize; // y axis goes up
                  
                  ctx.beginPath();
                  ctx.rect(x, y, cellSize, cellSize);
                  
                  // Logic for max value
                  const cellMax = Math.max(i, j);
                  
                  if (cellMax === k) {
                      ctx.fillStyle = 'rgba(0, 122, 255, 0.2)'; // target "exactly k"
                      ctx.fill();
                      ctx.strokeStyle = colors.primary;
                      ctx.lineWidth = 2;
                  } else if (cellMax < k) {
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // inside "less than k"
                      ctx.fill();
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                  } else {
                      ctx.fillStyle = '#ffffff'; // outside
                      ctx.fill();
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                  }
                  
                  ctx.stroke();
                  
                  if (cellMax <= k) {
                      ctx.fillStyle = cellMax === k ? colors.primary : colors.text;
                      ctx.fillText(cellMax.toString(), x + cellSize/2, y + cellSize/2);
                  }
              }
          }
          
          // Labels
          ctx.font = "bold 14px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText("サイコロ 1", ox, startY + faces * cellSize + 20);
          
          ctx.save();
          ctx.translate(startX - 20, oy);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText("サイコロ 2", 0, 0);
          ctx.restore();
          
          // Explain text
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.primary;
          ctx.fillText(`最大値が ${k} になる組み合わせ: ${k*k - (k-1)*(k-1)}通り`, ox, startY - 20);
      }

      if (level === 4) {
          const dy = 30;
          const dx = 40;
          const startY = oy - 120;
          const p = probA;
          
          ctx.font = "12px Geist Sans";
          ctx.textAlign = "center";
          
          for (let i = 0; i <= n; i++) {
              for (let j = 0; j <= i; j++) {
                  const nodeX = ox + (j * dx) - ((i - j) * dx);
                  const nodeY = startY + i * dy;
                  
                  // Draw connections
                  if (i < n) {
                      const leftX = ox + (j * dx) - ((i + 1 - j) * dx);
                      const rightX = ox + ((j + 1) * dx) - ((i - j) * dx);
                      const nextY = startY + (i + 1) * dy;
                      
                      // Left (Failure)
                      ctx.beginPath();
                      ctx.moveTo(nodeX, nodeY);
                      ctx.lineTo(leftX, nextY);
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                      ctx.stroke();
                      
                      // Right (Success)
                      ctx.beginPath();
                      ctx.moveTo(nodeX, nodeY);
                      ctx.lineTo(rightX, nextY);
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.stroke();
                  }
                  
                  // Draw Node
                  ctx.beginPath();
                  ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
                  const isTarget = i === n && j === r;
                  ctx.fillStyle = isTarget ? colors.primary : colors.itemBg;
                  ctx.fill();
                  ctx.strokeStyle = isTarget ? colors.primary : colors.secondary;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  
                  if (isTarget) {
                     ctx.fillStyle = colors.text;
                     ctx.fillText(`${n}C${r}`, nodeX, nodeY + 20);
                  }
              }
          }
          
          // Explain
          ctx.font = "16px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText(`${n}回中 ${r}回 成功する確率`, ox, startY + n * dy + 60);
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.secondary;
          ctx.fillText(`${n}C${r} × p^${r} × (1-p)^${n-r}`, ox, startY + n * dy + 85);
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
             level === 3 ? "条件付き確率 (Conditional Probability)" :
             level === 4 ? "反復試行の確率" :
             level === 5 ? "最大値の確率" :
             level === 6 ? "最短経路の数" :
             level === 7 ? "重複組合せ" :
             level === 8 ? "円順列" :
             level === 9 ? "じゅず順列" :
             level === 10 ? "同じものを含む順列" : 
             level === 11 ? "組分け" :
             level === 12 ? "余事象の確率" :
             level === 13 ? "独立試行の定理" :
             level === 14 ? "確率の加法定理" :
             "Probability"}
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
                      { id: 3, title: "Level 3: 条件付き確率", desc: "事象Bが起こった時の事象Aの確率", icon: Target },
                      { id: 4, title: "Level 4: 反復試行の確率", desc: "同じ試行をn回繰り返す確率", icon: Activity },
                      { id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },
                      { id: 7, title: "Level 7: 重複組合せ (nHr)", desc: "〇と｜の順列と方程式の解", icon: Circle },
                      { id: 8, title: "Level 8: 円順列 (Circular Permutations)", desc: "回転して一致するものは同じとみなす順列", icon: RefreshCw },
                      { id: 9, title: "Level 9: じゅず順列 (Necklace Permutations)", desc: "裏返して一致するものは同じとみなす円順列", icon: RefreshCw },
                      { id: 5, title: "Level 5: 最大値の確率", desc: "さいころの最大値がkになる確率", icon: Trophy },
                      { id: 10, title: "Level 10: 同じものを含む順列", desc: "同じ要素が含まれる場合の順列", icon: RefreshCw },
                      { id: 11, title: "Level 11: 組分け", desc: "区別がある部屋と区別がない組の違い", icon: Circle },
                      { id: 12, title: "Level 12: 余事象の確率", desc: "「少なくとも1つ」を余事象で求める", icon: Compass },
                      { id: 13, title: "Level 13: 独立試行の定理", desc: "P(A∩B) = P(A)×P(B) のシミュレーション", icon: Activity },
                      { id: 14, title: "Level 14: 確率の加法定理", desc: "P(A∪B) = P(A)+P(B)-P(A∩B) のベン図視覚化", icon: Target },
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
      {level > 0 && level !== 6 && level !== 7 && level !== 8 && level !== 12 && level !== 14 && (
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

                    
                    
                    {level === 5 && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>目標の最大値 (k): {r || 4}</span>
                                </div>
                                <input type="range" min="1" max="6" step="1" value={r || 4} 
                                    onChange={e => dispatch({type: 'SET_R', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-500 cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {level === 4 && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>試行回数 (n): {n}</span>
                                </div>
                                <input type="range" min="1" max="8" step="1" value={n} 
                                    onChange={e => dispatch({type: 'SET_N', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>成功回数 (r): {r}</span>
                                </div>
                                <input type="range" min="0" max={n} step="1" value={r} 
                                    onChange={e => dispatch({type: 'SET_R', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>1回の成功確率 (p): {probA.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0.1" max="0.9" step="0.1" value={probA} 
                                    onChange={e => dispatch({type: 'SET_PROBA', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
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

                        
                        {level === 4 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-purple-500" /> 反復試行の確率</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    確率 <MathComponent tex="p" /> の事象が、<MathComponent tex="n" /> 回中ちょうど <MathComponent tex="r" /> 回起こる確率です。
                                    「どのタイミングで成功するか」の選び方が <MathComponent tex="{}_{n}\mathrm{C}_{r}" /> 通りあるため、これを掛け合わせます。
                                </p>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                                    <MathComponent tex="{}_{n}\mathrm{C}_{r} \times p^r \times (1-p)^{n-r}" className="text-xl font-bold text-purple-700 block mb-2" />
                                </div>
                            </div>
                        )}
                        
                        {level === 5 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-blue-500" /> 最大値の確率</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    2個のサイコロを投げて、<strong>最大値がちょうど k</strong> になる確率を求めます。
                                    これは「最大値が k 以下」の正方形の面積から、「最大値が k-1 以下」の正方形の面積を引くことで視覚的に求められます（L字型の部分）。
                                </p>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <MathComponent tex="P(\text{最大値} = k) = \frac{k^2 - (k-1)^2}{6^2}" className="text-lg font-bold text-blue-700 block mb-2" />
                                    <span className="text-xs text-blue-600">kの面積 から (k-1)の面積 を引く</span>
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

      {level === 6 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <ShortestPathViz />
          </main>
      )}
      {level === 7 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <CombinationRepetitionViz />
          </main>
      )}
      {level === 8 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <CircularPermutationViz />
          </main>
      )}
      {level === 9 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <NecklacePermutationViz />
          </main>
      )}
      {level === 10 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <IndistinguishablePermutationViz />
          </main>
      )}
      {level === 11 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
             <GroupingViz />
          </main>
)}
      {level === 12 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <ComplementaryEventViz />
          </main>
      )}
      {level === 13 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <div className="max-w-md mx-auto">
                  <IndependentEventViz />
              </div>
          </main>
      )}
      {level === 14 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <div className="max-w-md mx-auto">
                  <AdditionRuleViz />
              </div>
          </main>
      )}
    </div>
  );
}
