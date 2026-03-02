// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Trophy,
  MousePointer2,
  Sparkles,
  Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuadraticCurriculumPage() {
  const [level, setLevel] = useState(0); // 0: Shape (a), 1: Move (p, q), 2: Complete
  const [step, setStep] = useState(0); // Step within level
  
  // Level 0 (Shape) State
  const [a, setA] = useState(1);
  
  // Level 1 (Move) State
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Visual Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const scale = 50, ox = w / 2, oy = h / 2 + 50;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      // X & Y Axis (Subtle)
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

      // Target Spot for Level 1 (Move)
      if (level === 1 && step === 1) {
        ctx.setLineDash([5, 5]); ctx.strokeStyle = '#E2E8F0';
        ctx.beginPath(); ctx.arc(ox + 2 * scale, oy - 1 * scale, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Parabola
      ctx.strokeStyle = '#007AFF'; // Apple Blue
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let px = 0; px <= w; px++) {
        const x = (px - ox) / scale;
        // y = a(x - p)^2 + q
        const y = a * Math.pow(x - p, 2) + q;
        const py = oy - y * scale;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Vertex Point
      ctx.fillStyle = '#007AFF';
      ctx.beginPath(); ctx.arc(ox + p * scale, oy - q * scale, 6, 0, Math.PI * 2); ctx.fill();
    };

    render();
  }, [a, p, q, level, step]);

  const handleNextLevel = () => {
    console.log("handleNextLevel called. Current level:", level);
    if (level === 0) {
      setLevel(1);
      setStep(0);
      setA(1); // Reset to standard shape
    } else {
      setLevel(2);
    }
  };

  const nextStep = () => {
    console.log("nextStep called. Current step:", step);
    setStep(prev => prev + 1);
  };

  return (
    <div className={`min-h-[100dvh] bg-white text-black selection:bg-blue-100 flex flex-col ${GeistSans.className}`}>
      
      {/* Minimal Header */}
      <header className="h-16 flex items-center justify-between px-6 shrink-0">
        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          {level === 0 ? 'Lesson 01: The Shape' : level === 1 ? 'Lesson 02: The Move' : 'Curriculum Complete'}
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col">
        
        {/* Visual Focus Area */}
        <section className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="w-full max-w-sm aspect-[4/5] relative">
            <canvas ref={canvasRef} width={400} height={500} className="w-full h-full" />
            
            {/* HUD Style Label */}
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">Eq</span>
                <span className="text-sm font-mono font-bold text-blue-600">
                  y = {a.toFixed(1)}(x - {p.toFixed(1)})² + {q.toFixed(1)}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Apple-style Interactive Sheet */}
        <section className="bg-slate-50/50 backdrop-blur-xl border-t border-slate-100 px-8 pt-10 pb-12 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          <div className="max-w-md mx-auto">
            
            <AnimatePresence mode="wait">
              {/* --- Level 0: SHAPE --- */}
              {level === 0 && (
                <motion.div key="lvl0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                  {step === 0 ? (
                    <div className="space-y-6">
                      <h1 className="text-3xl font-bold tracking-tight">2次関数を支配する</h1>
                      <p className="text-slate-500 text-[15px] leading-relaxed">
                        数学は「計算」ではありません。形の変化を操る「戦術」です。<br/>
                        まずはグラフの「向き」から始めましょう。
                      </p>
                      <button onClick={nextStep} className="bg-black text-white px-10 py-4 rounded-full font-bold text-[15px] active:scale-95 transition-transform">
                        開始する
                      </button>
                    </div>
                  ) : step === 1 ? (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">プラスのとき：器（うつわ）</h2>
                      <input type="range" min="0.1" max="3" step="0.1" value={a} onChange={e => {setA(Number(e.target.value)); if(Number(e.target.value) > 2.5) nextStep();}} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">右に振って勢いをつけてください</p>
                    </div>
                  ) : step === 2 ? (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">マイナスのとき：山</h2>
                      <input type="range" min="-3" max="-0.1" step="0.1" value={a} onChange={e => {setA(Number(e.target.value)); if(Number(e.target.value) < -2.5) nextStep();}} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">左に振ってグラフをひっくり返しましょう</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">習得：形の支配</h2>
                      <p className="text-slate-500 text-sm">次は、この器を好きな場所へ動かす「移動」を学びます。</p>
                      <button onClick={handleNextLevel} className="w-full bg-black text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                        Lesson 02 へ進む
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- Level 1: MOVE --- */}
              {level === 1 && (
                <motion.div key="lvl1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                  {step === 0 ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold tracking-tight">器を移動させる</h2>
                      <p className="text-slate-500 text-[15px] leading-relaxed">
                        次は頂点を動かしましょう。<br/>
                        $(x - p)^2 + q$ の $p$ と $q$ が、地図の座標になります。
                      </p>
                      <button onClick={nextStep} className="bg-black text-white px-10 py-4 rounded-full font-bold text-[15px] active:scale-95 transition-transform">
                        トレーニング開始
                      </button>
                    </div>
                  ) : step === 1 ? (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">横に移動 (p)</span>
                          <span className="font-mono font-bold text-blue-600">{p.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-4" max="4" step="0.1" value={p} onChange={e => setP(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">縦に移動 (q)</span>
                          <span className="font-mono font-bold text-blue-600">{q.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-4" max="4" step="0.1" value={q} onChange={e => setQ(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                      </div>
                      <div className="pt-2">
                        {Math.abs(p - 2) < 0.2 && Math.abs(q - 1) < 0.2 ? (
                          <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={nextStep} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">
                            ターゲット補足：次へ
                          </motion.button>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">点線で囲まれた (2, 1) に頂点を重ねてください</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                        <Move className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">習得：位置の支配</h2>
                      <p className="text-slate-500 text-sm">これであなたはグラフを自由自在に動かせるようになりました。</p>
                      <button onClick={handleNextLevel} className="w-full bg-black text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                        修了証を受け取る
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- Level 2: COMPLETE --- */}
              {level === 2 && (
                <motion.div key="lvl2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                   <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200">
                      <Trophy className="w-10 h-10 text-white" />
                   </div>
                   <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight">Mission Accomplished</h1>
                      <p className="text-slate-500 text-sm leading-relaxed px-4">
                        2次関数の「形」と「移動」の基礎を完璧にマスターしました。<br/>
                        次は、試験本番で「最大・最小」を秒殺する戦術（Tactics）を解禁します。
                      </p>
                   </div>
                   <button onClick={() => window.location.href = "/"} className="w-full bg-black text-white py-4 rounded-2xl font-bold">
                      メニューへ戻る
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>
      </main>

      {/* iOS Style Bottom Tab Bar */}
      <footer className="h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-6 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-md bg-blue-600" />
          <span className="text-[10px] font-bold text-blue-600">Learn</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-20">
          <div className="w-5 h-5 rounded-md bg-slate-400" />
          <span className="text-[10px] font-bold text-slate-400">Tactics</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-20">
          <div className="w-5 h-5 rounded-md bg-slate-400" />
          <span className="text-[10px] font-bold text-slate-400">Profile</span>
        </div>
      </footer>
    </div>
  );
}
