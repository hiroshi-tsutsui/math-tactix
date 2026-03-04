// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, Grid, Maximize, RotateCw, Activity, Info, Trophy, Star } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'matrices';

export default function MatricesPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [matrix, setMatrix] = useState<[[number, number], [number, number]]>([[1, 0], [0, 1]]);
  const [showUnlock, setShowUnlock] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const LEVEL_TARGETS = {
      1: { name: t('modules.matrices.level_1_name'), desc: t('modules.matrices.level_1_desc'), target: [[2, 0], [0, 1]] }, // Scale X
      2: { name: t('modules.matrices.level_2_name'), desc: t('modules.matrices.level_2_desc'), target: [[0, -1], [1, 0]] }, // Rotation 90
      3: { name: t('modules.matrices.level_3_name'), desc: t('modules.matrices.level_3_desc'), target: [[1, 1], [0, 1]] }  // Shear X
  };

  const levelData = LEVEL_TARGETS[currentLevel as keyof typeof LEVEL_TARGETS];

  useEffect(() => {
    // Check Victory
    const isClose = (a, b) => Math.abs(a - b) < 0.1;
    const t = levelData.target;
    if (
        isClose(matrix[0][0], t[0][0]) && isClose(matrix[0][1], t[0][1]) &&
        isClose(matrix[1][0], t[1][0]) && isClose(matrix[1][1], t[1][1])
    ) {
        if (!showUnlock) {
            setShowUnlock(true);
            setLog(prev => [t('modules.matrices.log_match'), ...prev.slice(0, 4)]);
        }
    }
  }, [matrix, currentLevel, showUnlock, levelData, t]);

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setMatrix([[1, 0], [0, 1]]);
      setShowUnlock(false);
    } else {
      unlockBadge('matrix_architect');
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
        <div className={`min-h-screen bg-white text-black flex flex-col items-center justify-center p-8 ${GeistSans.className}`}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center space-y-8 max-w-md">
                <div className="w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-200">
                    <Grid className="w-16 h-16 text-white" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-slate-900">ARCHITECT STATUS CONFIRMED</h2>
                    <p className="text-slate-500">You have demonstrated the ability to reshape space itself.</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-3xl flex items-center gap-4 w-full">
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Badge Unlocked</div>
                        <div className="text-lg font-bold text-slate-900">Matrix Architect</div>
                    </div>
                </div>
                <Link href="/" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl">
                    Return to Dashboard
                </Link>
            </motion.div>
        </div>
    );
  }

  const handleInputChange = (r, c, val) => {
      const num = parseFloat(val) || 0;
      const newM = [...matrix];
      newM[r] = [...newM[r]];
      newM[r][c] = num;
      setMatrix(newM);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <span className="text-sm font-bold">{t('modules.matrices.title')}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><Grid className="w-5 h-5 text-blue-600" /> {t('modules.matrices.ui.analysis_title')}</h2>
              </div>
              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="max-w-full h-auto" />
                 </div>

                 <div className="flex flex-col items-center gap-8">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('modules.matrices.ui.matrix_label')}</div>
                    <div className="flex items-center gap-4 text-4xl text-slate-200">
                        [
                        <div className="grid grid-cols-2 gap-4">
                           <input type="number" step="0.5" value={matrix[0][0]} onChange={e=>handleInputChange(0,0,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-red-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[0][1]} onChange={e=>handleInputChange(0,1,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-green-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[1][0]} onChange={e=>handleInputChange(1,0,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-red-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[1][1]} onChange={e=>handleInputChange(1,1,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-green-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                        </div>
                        ]
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">{t('modules.matrices.ui.mission_title')}</h3>
              <h4 className="text-xl font-bold mb-4">{levelData?.name}</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{levelData?.desc}</p>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                 <div className="flex items-center gap-2 text-xs text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> {t('modules.matrices.ui.red_arrow')}</div>
                 <div className="flex items-center gap-2 text-xs text-green-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> {t('modules.matrices.ui.green_arrow')}</div>
              </div>
           </div>
           <AnimatePresence>
            {showUnlock && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-[32px] text-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{t('modules.matrices.ui.next_btn')}</button>
                </motion.div>
            )}
           </AnimatePresence>
           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('modules.matrices.ui.activity_log')}</h4>
              <div className="space-y-2 font-mono text-[11px]">
                {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}