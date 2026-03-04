// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, MoveUpRight, CheckCircle2, ChevronRight, Info, Layers } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'vectors';

export default function VectorsPage() {
  const { t } = useLanguage();
  const { completeLevel } = useProgress();
  const { unlockBadge } = useGamification();
  const [levelIdx, setLevelIdx] = useState(0);
  const [vecA, setVecA] = useState({ x: 2, y: 1 });
  const [vecB, setVecB] = useState({ x: 1, y: 2 });
  const [showComplete, setShowComplete] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const LEVELS = useMemo(() => [
    { 
      id: 1, 
      name: t('modules.vectors.levels.1.name'), 
      desc: t('modules.vectors.levels.1.desc'), 
      target: { x: 7, y: 5 },
      log_start: t('modules.vectors.levels.1.log_start')
    },
    { 
      id: 2, 
      name: t('modules.vectors.levels.2.name'), 
      desc: t('modules.vectors.levels.2.desc'), 
      target: { x: -3, y: 4 },
      log_start: t('modules.vectors.levels.2.log_start') // Assuming level 2 has log_start key if not I will fallback or use generic
    }
  ], [t]);
  
  const currentLevel = LEVELS[levelIdx];
  const combined = { x: vecA.x + vecB.x, y: vecA.y + vecB.y };

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    // Safety check if level exists
    if (currentLevel) {
       addLog(currentLevel.log_start || `${currentLevel.name} ${t('common.system_log')}`);
    }
  }, [levelIdx, currentLevel, t]);

  const isComplete = Math.abs(combined.x - currentLevel?.target.x) < 0.1 && 
                    Math.abs(combined.y - currentLevel?.target.y) < 0.1;

  useEffect(() => {
    if (isComplete && !showComplete) {
      setShowComplete(true);
      addLog(t('modules.vectors.completion.msg'));
    }
  }, [isComplete, t]);

  const handleNext = () => {
    completeLevel(MODULE_ID, levelIdx + 1);
    unlockBadge('first_step');

    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
      setVecA({ x: 0, y: 0 });
      setVecB({ x: 0, y: 0 });
      setShowComplete(false);
    } else {
      unlockBadge('vector_master');
      window.location.href = "/";
    }
  };

  if (!currentLevel) return null;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans ${GeistSans.className} transition-colors duration-200`}>
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 h-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold dark:text-white">{t('modules.vectors.title')}</span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{t('common.level')} {levelIdx + 1}</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-200">
            <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-200">
              <h2 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><MoveUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {t('modules.vectors.viz.title')}</h2>
              <div className="flex gap-4 text-xs font-mono">
                <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg dark:text-slate-300">{t('modules.vectors.viz.controls.telemetry')}: ({combined.x}, {combined.y})</div>
                <div className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-bold">{t('modules.vectors.viz.viewport')}: ({currentLevel.target.x}, {currentLevel.target.y})</div>
              </div>
            </div>

            <div className="p-12">
              <div className="relative aspect-square bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8 overflow-hidden shadow-inner transition-colors duration-200">
                 <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                 
                 <svg viewBox="-10 -10 20 20" className="w-full h-full transform scale-y-[-1]">
                    {/* Grid lines */}
                    {Array.from({length: 21}).map((_, i) => (
                      <line key={i} x1={-10} y1={i-10} x2={10} y2={i-10} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="0.05" />
                    ))}
                    {Array.from({length: 21}).map((_, i) => (
                      <line key={i} x1={i-10} y1={-10} x2={i-10} y2={10} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="0.05" />
                    ))}
                    
                    {/* Axes */}
                    <line x1={-10} y1={0} x2={10} y2={0} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1" />
                    <line x1={0} y1={-10} x2={0} y2={10} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1" />

                    {/* Target Point */}
                    <circle cx={currentLevel.target.x} cy={currentLevel.target.y} r="0.4" fill="#ef4444" className="animate-pulse" />

                    {/* Vectors */}
                    <line x1={0} y1={0} x2={vecA.x} y2={vecA.y} stroke="#3b82f6" strokeWidth="0.2" strokeLinecap="round" />
                    <line x1={vecA.x} y1={vecA.y} x2={combined.x} y2={combined.y} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="0.2" strokeLinecap="round" strokeDasharray="0.5, 0.5" />
                    <circle cx={combined.x} cy={combined.y} r="0.3" fill="#3b82f6" />
                 </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">{t('modules.vectors.viz.controls.vec_a')}</span>
                    <span className="text-xs font-mono font-bold dark:text-slate-300">x: {vecA.x} / y: {vecA.y}</span>
                  </div>
                  <div className="space-y-2">
                    <input type="range" min="-10" max="10" step="1" value={vecA.x} onChange={(e) => setVecA({...vecA, x: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <input type="range" min="-10" max="10" step="1" value={vecA.y} onChange={(e) => setVecA({...vecA, y: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t('modules.vectors.viz.controls.vec_b')}</span>
                    <span className="text-xs font-mono font-bold dark:text-slate-300">x: {vecB.x} / y: {vecB.y}</span>
                  </div>
                  <div className="space-y-2">
                    <input type="range" min="-10" max="10" step="1" value={vecB.x} onChange={(e) => setVecB({...vecB, x: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400 dark:accent-slate-500" />
                    <input type="range" min="-10" max="10" step="1" value={vecB.y} onChange={(e) => setVecB({...vecB, y: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400 dark:accent-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showComplete && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-900/30 p-6 flex items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-800 dark:text-green-300">{t('modules.vectors.completion.synced')}</span>
                  </div>
                  <button onClick={handleNext} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">{t('common.next')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-xl transition-colors duration-200">
             <div className="flex items-center gap-2 mb-6">
               <Layers className="w-4 h-4 text-blue-400" />
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Vector Mission</span>
             </div>
             <h4 className="text-2xl font-bold mb-4">{currentLevel.name}</h4>
             <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">{currentLevel.desc}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 transition-colors duration-200">
             <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t('modules.vectors.concepts.title')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {t('modules.vectors.concepts.def_body').replace(/<[^>]*>/g, '')}
                </p>
             </div>
             <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t('common.system_log')}</h4>
                <div className="space-y-2 font-mono text-[10px]">
                  {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}>{msg}</div>)}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
