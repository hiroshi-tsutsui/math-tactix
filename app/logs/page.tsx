"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, Activity, Zap, Maximize2, Info } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'logs';

export default function LogsPage() {
  const { completeLevel } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [val, setVal] = useState(5);
  const [isLogMode, setIsLogMode] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    addLog(`ステージ ${currentLevel} を開始`);
  }, [currentLevel]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  // Game Logic
  useEffect(() => {
    if (currentLevel === 1 && val >= 12 && !isLogMode) setShowUnlock(true);
    if (currentLevel === 2 && val >= 16 && !isLogMode) setShowUnlock(true);
    if (currentLevel === 3 && val >= 50 && isLogMode) setShowUnlock(true);
  }, [val, isLogMode, currentLevel]);

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setShowUnlock(false);
    } else {
      window.location.href = "/";
    }
  };

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height, padding = 60;
    const gw = w - padding*2, gh = h - padding*2;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let i=0; i<=10; i++) {
        ctx.beginPath(); ctx.moveTo(padding + (i/10)*gw, padding); ctx.lineTo(padding + (i/10)*gw, h-padding); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padding, padding + (i/10)*gh); ctx.lineTo(w-padding, padding + (i/10)*gh); ctx.stroke();
    }

    const maxValY = isLogMode ? 16 : 32768; 
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.beginPath();
    
    for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * val;
        let y = Math.pow(2, x);
        if (isLogMode) y = Math.log10(y);

        const px = padding + (i/100) * gw;
        const py = (h - padding) - (y / maxValY) * gh;

        if (py < padding) break;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

  }, [val, isLogMode]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <span className="text-sm font-bold">対数（ログ）</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><Maximize2 className="w-5 h-5 text-blue-600" /> 指数成長の圧縮解析</h2>
                 <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isLogMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {isLogMode ? '対数スケール (LOG)' : '線形スケール (LIN)'}
                 </div>
              </div>
              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">入力値 (x)</span><span className="font-bold">{val}</span></div>
                       <input type="range" min="1" max={isLogMode ? 60 : 20} step="1" value={val} onChange={e=>setVal(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>

                    <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${currentLevel < 3 ? 'opacity-30' : 'bg-slate-50 border-slate-200'}`}>
                       <div>
                          <h4 className="font-bold text-sm">対数モードを起動</h4>
                          <p className="text-xs text-slate-400">膨大な数値を扱いやすいスケールに圧縮します。</p>
                       </div>
                       <button 
                        onClick={() => currentLevel >= 3 && setIsLogMode(!isLogMode)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${isLogMode ? 'bg-blue-600' : 'bg-slate-200'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLogMode ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">ミッション</h3>
              {currentLevel === 1 && <p className="text-sm">数値を 12 まで上げて、グラフの急激な立ち上がりを確認してください。</p>}
              {currentLevel === 2 && <p className="text-sm">数値をさらに上げてください。通常のスケールでは表示限界を超えてしまいます。</p>}
              {currentLevel === 3 && <p className="text-sm">対数モードをONにし、数値を 50 まで上げてください。巨大な数値が「圧縮」される様子を体験しましょう。</p>}
           </div>
           <AnimatePresence>
            {showUnlock && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-[32px] text-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">次へ進む</button>
                </motion.div>
            )}
           </AnimatePresence>
           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">活動ログ</h4>
              <div className="space-y-2 font-mono text-[11px]">
                {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
