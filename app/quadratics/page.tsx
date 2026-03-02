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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuadraticIntroPage() {
  const [step, setStep] = useState(0); // 0: Start, 1: a-positive, 2: a-negative, 3: Completed
  const [a, setA] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Visual Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const scale = 60, ox = w / 2, oy = h / 2 + 50;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      // X-Axis
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();

      // Parabola
      ctx.strokeStyle = '#007AFF'; // Apple Blue
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let px = 0; px <= w; px++) {
        const x = (px - ox) / scale;
        const y = a * x * x;
        const py = oy - y * scale;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Point at origin
      ctx.fillStyle = '#007AFF';
      ctx.beginPath(); ctx.arc(ox, oy, 6, 0, Math.PI*2); ctx.fill();
    };

    render();
  }, [a]);

  // Handle Step Logic
  const nextStep = () => {
    if (step === 1 && a > 0.5) setStep(2);
    else if (step === 2 && a < -0.5) setStep(3);
    else if (step === 0) setStep(1);
  };

  return (
    <div className={`min-h-[100dvh] bg-white text-black selection:bg-blue-100 flex flex-col ${GeistSans.className}`}>
      
      {/* Minimal Header */}
      <header className="h-16 flex items-center justify-between px-6 shrink-0">
        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-[13px] font-semibold tracking-tight text-slate-400">
          LESSON 01: THE SHAPE
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col">
        
        {/* Visual Focus Area */}
        <section className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="w-full max-w-sm aspect-[4/5] relative">
            <canvas ref={canvasRef} width={400} height={500} className="w-full h-full" />
            
            {/* HUD Style Label */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <motion.div 
                key={a > 0 ? 'pos' : 'neg'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm"
              >
                <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase tracking-widest">Coefficient</span>
                <span className="text-lg font-mono font-bold text-blue-600">a = {a.toFixed(1)}</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Apple-style Interactive Sheet */}
        <section className="bg-slate-50/50 backdrop-blur-xl border-t border-slate-100 px-8 pt-10 pb-12 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          <div className="max-w-md mx-auto space-y-8">
            
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                  <h1 className="text-3xl font-bold tracking-tight">2次関数を支配する</h1>
                  <p className="text-slate-500 text-[15px] leading-relaxed">
                    数学は計算ではありません。形の変化を操る「戦術」です。<br/>
                    まずは一番シンプルな $y = ax^2$ から始めましょう。
                  </p>
                  <button onClick={nextStep} className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-[15px] active:scale-95 transition-transform">
                    開始する <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">プラスのとき</h2>
                    <p className="text-slate-500 text-sm">
                      $a$ がプラスのとき、グラフは「器（うつわ）」になります。
                    </p>
                  </div>
                  <div className="pt-4">
                    <input 
                      type="range" min="0.1" max="3" step="0.1" value={a > 0 ? a : 1} 
                      onChange={e => {setA(Number(e.target.value)); if(Number(e.target.value) > 2.5) nextStep();}} 
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">スライダーを右に振って勢いをつけてください</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">マイナスのとき</h2>
                    <p className="text-slate-500 text-sm">
                      $a$ がマイナスになると、グラフは「山」に変わります。
                    </p>
                  </div>
                  <div className="pt-4">
                    <input 
                      type="range" min="-3" max="-0.1" step="0.1" value={a < 0 ? a : -1} 
                      onChange={e => {setA(Number(e.target.value)); if(Number(e.target.value) < -2.5) nextStep();}} 
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">左に振ってグラフをひっくり返しましょう</p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">習得：形の支配</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      これであなたは2次関数の「向き」を支配しました。<br/>
                      次はこの器を好きな場所へ動かす「移動」を学びましょう。
                    </p>
                  </div>
                  <button onClick={() => window.location.reload()} className="w-full bg-black text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                    次のレッスンへ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>
      </main>

      {/* iOS Style Bottom Tab Bar (Placeholder) */}
      <footer className="h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-6 shrink-0">
        <div className="flex flex-col items-center gap-1 opacity-100">
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
