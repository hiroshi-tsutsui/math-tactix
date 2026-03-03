// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, RotateCw, Activity, Info, Zap } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'complex';

export default function ComplexPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t, locale } = useLanguage();
  const language = locale; // Alias for compatibility with effect hook
  const [currentLevel, setCurrentLevel] = useState(1);
  const [re1, setRe1] = useState(1);
  const [im1, setIm1] = useState(0);
  const [re2, setRe2] = useState(0);
  const [im2, setIm2] = useState(1); // i
  
  const [showUnlock, setShowUnlock] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const LEVELS = [
    { id: 1, name: t('modules.complex.levels.1.name'), desc: t('modules.complex.levels.1.desc'), condition: (r, i) => Math.abs(r) < 0.1 && Math.abs(i - 1) < 0.1 },
    { id: 2, name: t('modules.complex.levels.2.name'), desc: t('modules.complex.levels.2.desc'), condition: (r, i) => Math.abs(r - i) < 0.2 && Math.sqrt(r*r + i*i) > 1.2 },
    { id: 3, name: t('modules.complex.levels.3.name'), desc: t('modules.complex.levels.3.desc'), condition: (r, i) => Math.abs(i) < 0.1 && Math.abs(r) > 0.5 }
  ];

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    const next = progress.length + 1 > 3 ? 3 : progress.length + 1;
    setCurrentLevel(next);
    addLog(t('modules.complex.stage_start', { level: next }));
  }, [moduleProgress, language]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  // Complex mult: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
  const resRe = re1 * re2 - im1 * im2;
  const resIm = re1 * im2 + im1 * re2;

  useEffect(() => {
    if (LEVELS[currentLevel - 1].condition(resRe, resIm) && !showUnlock) {
      setShowUnlock(true);
      addLog(t('modules.complex.stage_clear'));
    }
  }, [resRe, resIm]);

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
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2, unit = 50;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let x=0; x<w; x+=unit) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for(let y=0; y<h; y+=unit) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    const drawVec = (r, i, color, label, bold = false) => {
        const tx = cx + r * unit, ty = cy - i * unit;
        ctx.strokeStyle = color; ctx.lineWidth = bold ? 4 : 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(tx, ty, bold?6:4, 0, Math.PI*2); ctx.fill();
        ctx.font = bold ? "bold 12px sans-serif" : "10px sans-serif";
        ctx.fillText(label, tx + 10, ty);
    };

    drawVec(re1, im1, '#3b82f6', t('modules.complex.original_num'));
    drawVec(re2, im2, '#10b981', t('modules.complex.multiplier'));
    drawVec(resRe, resIm, '#ef4444', t('modules.complex.result'), true);

  }, [re1, im1, re2, im2, resRe, resIm, language]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <span className="text-sm font-bold">{t('modules.complex.title')}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><RotateCw className="w-5 h-5 text-blue-600" /> {t('modules.complex.rotation_vis')}</h2>
                 <div className="bg-slate-900 px-4 py-2 rounded-xl text-white font-mono text-sm">
                    {resRe.toFixed(1)} {resIm >= 0 ? '+' : ''} {resIm.toFixed(1)}i
                 </div>
              </div>
              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('modules.complex.real_part')}</h3>
                       <input type="range" min="-3" max="3" step="0.5" value={re1} onChange={e=>setRe1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                       <input type="range" min="-3" max="3" step="0.5" value={im1} onChange={e=>setIm1(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('modules.complex.multiplier')}</h3>
                       <input type="range" min="-2" max="2" step="0.5" value={re2} onChange={e=>setRe2(parseFloat(e.target.value))} className="w-full accent-green-600" />
                       <input type="range" min="-2" max="2" step="0.5" value={im2} onChange={e=>setIm2(parseFloat(e.target.value))} className="w-full accent-green-600" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">{t('modules.complex.mission_title')}</h3>
              <h4 className="text-xl font-bold mb-4">{LEVELS[currentLevel-1].name}</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{LEVELS[currentLevel-1].desc}</p>
           </div>
           <AnimatePresence>
            {showUnlock && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-[32px] text-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{t('modules.complex.controls.next_btn')}</button>
                </motion.div>
            )}
           </AnimatePresence>
           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('modules.complex.log_title')}</h4>
              <div className="space-y-2 font-mono text-[11px]">
                {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
