// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, TrendingUp, CheckCircle2, ChevronRight, Activity, LineChart, Info } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'sequences';

export default function SequencesPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t, language } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  // State
  const [n, setN] = useState(20); 
  const [a, setA] = useState(1);  
  const [d, setD] = useState(1);  
  const [r, setR] = useState(1.1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    let nextLvl = 1;
    if (progress.includes(1)) nextLvl = 2;
    if (progress.includes(2)) nextLvl = 3;
    setCurrentLevel(nextLvl);
    addLog(t('modules.sequences.log.start', { level: nextLvl }));
  }, [moduleProgress, language]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const handleComplete = () => {
      completeLevel(MODULE_ID, currentLevel);
      setShowUnlock(true);
  };

  const handleNext = () => {
    if (currentLevel < 3) {
        setCurrentLevel(currentLevel + 1);
        setShowUnlock(false);
    } else {
        window.location.href = "/";
    }
  };

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let i=0; i<=10; i++) {
        ctx.beginPath(); ctx.moveTo((i/10)*w, 0); ctx.lineTo((i/10)*w, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (i/10)*h); ctx.lineTo(w, (i/10)*h); ctx.stroke();
    }

    const arithmeticData = [], geometricData = [];
    for (let i = 0; i < n; i++) {
        arithmeticData.push(a + i * d);
        geometricData.push(a * Math.pow(r, i));
    }

    const maxVal = Math.max(...arithmeticData, ...geometricData, 10);
    const range = maxVal || 1;

    const draw = (data, color) => {
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (n-1)) * w;
            const y = h - (val / range) * h;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        data.forEach((val, i) => {
            const x = (i / (n-1)) * w;
            const y = h - (val / range) * h;
            ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
        });
    };

    draw(arithmeticData, '#3b82f6'); // Blue for Arithmetic
    draw(geometricData, '#ec4899');   // Pink for Geometric
  }, [n, a, d, r]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{t('dashboard.modules.sequences.title')}</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {t('modules.sequences.stage_label', { current: currentLevel, total: 3 })}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><LineChart className="w-5 h-5 text-blue-600" /> {t('modules.sequences.simulation_title')}</h2>
                 <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('modules.sequences.legend.arithmetic')}</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div> {t('modules.sequences.legend.geometric')}</div>
                 </div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{t('modules.sequences.controls.first_term')}</span>
                            <span className="text-xs font-bold">{a}</span>
                          </div>
                          <input type="range" min="1" max="10" step="1" value={a} onChange={e => setA(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                       </div>
                       <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{t('modules.sequences.controls.diff')}</span>
                            <span className="text-xs font-bold text-blue-600">+{d}</span>
                          </div>
                          <input type="range" min="0" max="5" step="0.5" value={d} onChange={e => setD(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                       </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{t('modules.sequences.controls.ratio')}</span>
                            <span className="text-xs font-bold text-pink-600">x{r}</span>
                          </div>
                          <input type="range" min="0.5" max="2" step="0.1" value={r} onChange={e => setR(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                       </div>
                       <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{t('modules.sequences.controls.count')}</span>
                            <span className="text-xs font-bold">{n}</span>
                          </div>
                          <input type="range" min="5" max="40" step="1" value={n} onChange={e => setN(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-400" />
                       </div>
                    </div>
                 </div>

                 <button onClick={handleComplete} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                    {t('modules.sequences.controls.confirm_btn')}
                 </button>
              </div>

              <AnimatePresence>
                {showUnlock && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/90 backdrop-blur-md">
                    <div className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-2xl text-center max-w-sm">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">{t('modules.sequences.modal.success_title')}</h3>
                      <p className="text-sm text-slate-500 mb-8 leading-relaxed">{t('modules.sequences.modal.success_desc')}</p>
                      <button onClick={handleNext} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        {currentLevel < 3 ? t('modules.sequences.modal.next_btn') : t('modules.sequences.modal.finish_btn')} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">{t('modules.sequences.explanation.title')}</h3>
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-bold mb-2">{t('modules.sequences.explanation.arithmetic_title')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('modules.sequences.explanation.arithmetic_desc')}</p>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold mb-2">{t('modules.sequences.explanation.geometric_title')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('modules.sequences.explanation.geometric_desc')}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('modules.sequences.log.title')}</h4>
              <div className="space-y-2 font-mono text-[11px]">
                {log.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                        <span>{msg}</span>
                    </div>
                ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
