// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, Activity, Waves, Volume2, Info } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'trig';

export default function TrigPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Params
  const [amplitude, setAmplitude] = useState(1.0);
  const [frequency, setFrequency] = useState(1.0);
  const [phase, setPhase] = useState(0);
  
  // Targets
  const [targetAmp, setTargetAmp] = useState(1.5);
  const [targetFreq, setTargetFreq] = useState(1.0);
  const [targetPhase, setTargetPhase] = useState(45);

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    setCurrentLevel(progress.length + 1 > 3 ? 3 : progress.length + 1);
    addLog(`ステージ ${progress.length + 1} を開始しました`);
  }, [moduleProgress]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  // Match logic
  const ampDiff = Math.abs(amplitude - targetAmp);
  const freqDiff = Math.abs(frequency - targetFreq);
  const phaseDiff = Math.abs(phase - targetPhase) % 360;
  const matchRate = Math.max(0, 100 - (ampDiff * 30 + freqDiff * 30 + phaseDiff / 2));

  useEffect(() => {
    if (matchRate > 95 && !showUnlock) {
      setShowUnlock(true);
      addLog("波形が同期しました！ターゲットを捕捉。");
    }
  }, [matchRate]);

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setTargetAmp(0.5 + Math.random() * 2);
      setTargetFreq(0.5 + Math.random() * 2);
      setTargetPhase(Math.random() * 180);
      setShowUnlock(false);
    } else {
      window.location.href = "/";
    }
  };

  // Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height, cy = h/2, unit = 40;

    let frame = 0;
    const render = () => {
        frame++;
        ctx.clearRect(0, 0, w, h);
        
        // Grid
        ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
        for(let x=0; x<w; x+=unit) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for(let y=0; y<h; y+=unit) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

        // Target (Ghost)
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const rad = (x / unit);
            const ty = cy - (targetAmp * unit) * Math.sin((targetFreq * rad) + (targetPhase * Math.PI / 180));
            if (x===0) ctx.moveTo(x,ty); else ctx.lineTo(x,ty);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Player
        ctx.strokeStyle = matchRate > 90 ? '#22c55e' : '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const rad = (x / unit);
            const py = cy - (amplitude * unit) * Math.sin((frequency * rad) + (phase * Math.PI / 180));
            if (x===0) ctx.moveTo(x,py); else ctx.lineTo(x,py);
        }
        ctx.stroke();

        requestAnimationFrame(render);
    };
    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [amplitude, frequency, phase, targetAmp, targetFreq, targetPhase, matchRate]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">三角関数</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">ステージ {currentLevel} / 3</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><Waves className="w-5 h-5 text-blue-600" /> 波形の同調</h2>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">一致率</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all ${matchRate > 90 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${matchRate}%` }}></div>
                    </div>
                    <span className="text-sm font-mono font-bold">{matchRate.toFixed(0)}%</span>
                 </div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">振幅 (A) - 高さ</span><span className="font-bold">{amplitude.toFixed(2)}</span></div>
                       <input type="range" min="0.1" max="3" step="0.1" value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">周波数 (f) - 速さ</span><span className="font-bold">{frequency.toFixed(2)}</span></div>
                       <input type="range" min="0.1" max="3" step="0.1" value={frequency} onChange={e=>setFrequency(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400 uppercase">位相 (φ) - ズレ</span><span className="font-bold">{phase.toFixed(0)}°</span></div>
                       <input type="range" min="0" max="360" step="5" value={phase} onChange={e=>setPhase(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                 </div>
              </div>

              <AnimatePresence>
                {showUnlock && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/90 backdrop-blur-md">
                    <div className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-2xl text-center max-w-sm">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">同期成功</h3>
                      <p className="text-sm text-slate-500 mb-8 leading-relaxed">ターゲット波形との一致を確認しました。周期性の概念をクリアしました。</p>
                      <button onClick={handleNext} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        {currentLevel < 3 ? '次のレベルへ' : '完了して戻る'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">波の三要素</h3>
              <div className="space-y-4 text-xs leading-relaxed text-slate-400 font-medium">
                 <p><strong className="text-white">振幅:</strong> 波の上下の幅です。音の大きさや光の強さに対応します。</p>
                 <p><strong className="text-white">周波数:</strong> 波の繰り返しの細かさです。音の高さや電波のチャンネルに対応します。</p>
                 <p><strong className="text-white">位相:</strong> 波の開始タイミングのズレです。複数の波を重ね合わせる際に重要になります。</p>
              </div>
           </div>
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
