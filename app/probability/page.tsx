// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart3, HelpCircle, Activity, Info, Target } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'probability';

// --- Monty Hall Component ---
function MontyHallGame({ onWin }) {
    const { t } = useLanguage();
    const [carPos, setCarPos] = useState(Math.floor(Math.random() * 3));
    const [selected, setSelected] = useState(null);
    const [opened, setOpened] = useState(null);
    const [status, setStatus] = useState('pick'); // pick, reveal, result
    const [stats, setStats] = useState({ switchWins: 0, switchTotal: 0, stayWins: 0, stayTotal: 0 });

    const handlePick = (i) => {
        if (status !== 'pick') return;
        setSelected(i);
        const canOpen = [0, 1, 2].filter(d => d !== i && d !== carPos);
        setOpened(canOpen[Math.floor(Math.random() * canOpen.length)]);
        setStatus('reveal');
    };

    const handleFinal = (isSwitch) => {
        const final = isSwitch ? [0, 1, 2].find(d => d !== selected && d !== opened) : selected;
        const win = final === carPos;
        if (win) onWin?.();
        setStatus('result');
        if (isSwitch) setStats(s => ({ ...s, switchTotal: s.switchTotal+1, switchWins: s.switchWins + (win?1:0) }));
        else setStats(s => ({ ...s, stayTotal: s.stayTotal+1, stayWins: s.stayWins + (win?1:0) }));
    };

    const reset = () => {
        setCarPos(Math.floor(Math.random() * 3));
        setSelected(null);
        setOpened(null);
        setStatus('pick');
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-600" /> {t('modules.probability.monty_hall.title')}</h3>
                <button onClick={reset} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">{t('modules.probability.monty_hall.reset')}</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[0, 1, 2].map(i => (
                    <button 
                        key={i} 
                        onClick={() => handlePick(i)}
                        className={`h-24 rounded-2xl border-2 transition-all flex items-center justify-center text-2xl
                            ${opened === i ? 'bg-slate-100 border-slate-200 opacity-50' : 'hover:border-blue-400 bg-white border-slate-100 shadow-sm'}
                            ${selected === i ? 'border-blue-600 bg-blue-50' : ''}
                            ${status === 'result' && i === carPos ? 'bg-green-50 border-green-500' : ''}
                        `}
                    >
                        {opened === i ? (i === carPos ? '💎' : '💨') : (status === 'result' && i === carPos ? '💎' : '🚪')}
                    </button>
                ))}
            </div>
            {status === 'reveal' && (
                <div className="text-center space-y-4">
                    <p className="text-sm font-medium text-slate-600">
                        {t('modules.probability.monty_hall.door_reveal', { opened: opened + 1 })}
                    </p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => handleFinal(false)} className="px-6 py-2 bg-slate-100 rounded-xl text-xs font-bold">{t('modules.probability.monty_hall.keep')}</button>
                        <button onClick={() => handleFinal(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20">{t('modules.probability.monty_hall.switch')}</button>
                    </div>
                </div>
            )}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t('modules.probability.monty_hall.win_rate_stay')}</div>
                    <div className="text-xl font-bold">{stats.stayTotal ? ((stats.stayWins/stats.stayTotal)*100).toFixed(1) : 0}%</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t('modules.probability.monty_hall.win_rate_switch')}</div>
                    <div className="text-xl font-bold text-blue-600">{stats.switchTotal ? ((stats.switchWins/stats.switchTotal)*100).toFixed(1) : 0}%</div>
                </div>
            </div>
        </div>
    );
}

export default function ProbabilityPage() {
  const { t } = useLanguage();
  const { completeLevel } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const normal = (x, m, s) => (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h-40;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let x=0; x<=w; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = -5; x <= 5; x += 0.1) {
        const px = cx + x * 50;
        const py = cy - normal(x, mean, stdDev) * 200;
        if (x === -5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [mean, stdDev]);

  const checkLevel = () => {
      if (currentLevel === 1 && Math.abs(mean - 2) < 0.2) setShowUnlock(true);
      if (currentLevel === 2 && stdDev < 0.6) setShowUnlock(true);
  };

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setShowUnlock(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <span className="text-sm font-bold">{t('modules.probability.title')}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> {t('modules.probability.normal_dist.title')}</h2>
              </div>
              <div className="p-10 space-y-8">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">{t('modules.probability.normal_dist.mean')}</div>
                        <input type="range" min="-3" max="3" step="0.1" value={mean} onChange={e=>setMean(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">{t('modules.probability.normal_dist.std_dev')}</div>
                        <input type="range" min="0.3" max="2" step="0.1" value={stdDev} onChange={e=>setStdDev(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                 </div>
                 <button onClick={checkLevel} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">{t('modules.probability.normal_dist.check')}</button>
              </div>
           </div>
           <MontyHallGame onWin={() => currentLevel === 3 && setShowUnlock(true)} />
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">MISSION</h3>
              <p className="text-sm">
                  {t(`modules.probability.levels.${currentLevel}.mission`)}
              </p>
           </div>
           <AnimatePresence>
            {showUnlock && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-[32px] text-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-4">{t('modules.probability.completion.title')}</h3>
                    <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">{t('modules.probability.completion.next')}</button>
                </motion.div>
            )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
