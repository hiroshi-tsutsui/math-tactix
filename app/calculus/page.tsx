"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { Activity, CheckCircle2, ChevronRight, Play, Info } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'calculus';

export default function CalculusPage() {
  const { completeLevel } = useProgress();
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [levelIdx, setLevelIdx] = useState(0);
  const [tParam, setTParam] = useState(0.5); // Renamed to avoid collision with t()
  const [showComplete, setShowComplete] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  // Define levels dynamically based on current language
  const levels = useMemo<{ id: number; name: string; desc: string; targetSlope?: number; targetArea?: number; type: string; logStart: string }[]>(() => [
    { 
      id: 1, 
      name: t('modules.calculus.levels.1.name'), 
      desc: t('modules.calculus.levels.1.desc'), 
      targetSlope: 2.0, 
      type: 'diff',
      logStart: t('modules.calculus.levels.1.log_start')
    },
    { 
      id: 2, 
      name: t('modules.calculus.levels.2.name'), 
      desc: t('modules.calculus.levels.2.desc'), 
      targetSlope: 0.1, 
      type: 'zero',
      logStart: t('modules.calculus.levels.2.log_start')
    },
    { 
      id: 3, 
      name: t('modules.calculus.levels.3.name'), 
      desc: t('modules.calculus.levels.3.desc'), 
      targetArea: 10.0, 
      type: 'int',
      logStart: t('modules.calculus.levels.3.log_start')
    }
  ], [t]);

  const currentLevel = levels[levelIdx];

  // Logic values
  const f = (x: number) => 4 * x * (1 - x); // Parabolic arc
  const df = (x: number) => 4 - 8 * x;      // Derivative
  const integral = (x: number) => (4 * x**2 / 2) - (4 * x**3 / 3); // Integral from 0 to x

  const currentVal = f(tParam);
  const currentSlope = df(tParam);
  const currentArea = integral(tParam);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    if (currentLevel) {
      addLog(currentLevel.logStart);
    }
  }, [levelIdx, currentLevel]);

  let isComplete = false;
  if (currentLevel) {
    if (currentLevel.type === 'diff' && currentLevel.targetSlope !== undefined) isComplete = Math.abs(currentSlope) >= currentLevel.targetSlope;
    if (currentLevel.type === 'zero' && currentLevel.targetSlope !== undefined) isComplete = Math.abs(currentSlope) <= currentLevel.targetSlope;
    if (currentLevel.type === 'int' && currentLevel.targetArea !== undefined) isComplete = currentArea >= currentLevel.targetArea;
  }

  useEffect(() => {
    if (isComplete && !showComplete) {
      setShowComplete(true);
      addLog(t('modules.calculus.completion.synced'));
    }
  }, [isComplete]);

  const handleNext = () => {
    completeLevel(MODULE_ID, levelIdx + 1);
    if (levelIdx < levels.length - 1) {
      setLevelIdx(levelIdx + 1);
      setShowComplete(false);
    } else {
      unlockBadge('flux_master');
      window.location.href = "/";
    }
  };

  if (!currentLevel) return null;

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{t('modules.calculus.title')}</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {t('common.level')} {levelIdx + 1}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> 
                {t('modules.calculus.viz.title')}
              </h2>
              <div className="flex gap-6 text-xs font-mono">
                <div>
                  <span className="text-slate-400">{t('modules.calculus.viz.controls.slope')}:</span> 
                  <span className="text-blue-600 font-bold ml-2">{currentSlope.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t('modules.calculus.viz.controls.area')}:</span> 
                  <span className="text-blue-600 font-bold ml-2">{currentArea.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-12">
               <div className="relative h-64 bg-white border border-slate-100 rounded-xl mb-8 flex items-end px-12">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  {/* Simple Parabola Visualization */}
                  <svg className="w-full h-full overflow-visible">
                    <path 
                      d={`M 0 200 Q 200 -100 400 200`} 
                      fill="none" stroke="#e2e8f0" strokeWidth="2"
                    />
                    <circle cx={tParam * 400} cy={200 - (f(tParam) * 200)} r="6" fill="#3b82f6" />
                    {/* Tangent Line */}
                    <line 
                      x1={(tParam-0.1)*400} y1={200 - (f(tParam) * 200) + (currentSlope * 40)}
                      x2={(tParam+0.1)*400} y2={200 - (f(tParam) * 200) - (currentSlope * 40)}
                      stroke="#3b82f6" strokeWidth="2"
                    />
                  </svg>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                   <span>{t('modules.calculus.viz.controls.time_label')}</span>
                   <span>{tParam.toFixed(2)}</span>
                 </div>
                 <input 
                   type="range" min="0" max="1" step="0.01" value={tParam} 
                   onChange={(e) => setTParam(parseFloat(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
               </div>
            </div>

            <AnimatePresence>
              {showComplete && (
                <div className="p-6 bg-green-50 border-t border-green-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-800">{t('modules.calculus.completion.msg')}</span>
                  </div>
                  <button onClick={handleNext} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm">
                    {t('common.next')}
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-2">
              {t('modules.matrices.ui.mission_title')} {/* Reusing mission_title from matrices or creating generic */}
            </h3>
            <h4 className="text-2xl font-bold mb-4">{currentLevel.name}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{currentLevel.desc}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">{t('modules.matrices.ui.activity_log')}</h4>
            <div className="space-y-2 font-mono text-[10px]">
              {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}