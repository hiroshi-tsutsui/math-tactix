"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { GeistSans } from 'geist/font/sans';
import { Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'calculus';

const VizSkeleton = () => <div className="animate-pulse bg-slate-100 rounded-2xl h-48" />;

// Dynamic Viz imports
const DerivativeDefinitionViz = dynamic(() => import('./components/DerivativeDefinitionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const PowerRuleViz = dynamic(() => import('./components/PowerRuleViz'), { ssr: false, loading: () => <VizSkeleton /> });
const TangentLineViz = dynamic(() => import('./components/TangentLineViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DerivativeGraphViz = dynamic(() => import('./components/DerivativeGraphViz'), { ssr: false, loading: () => <VizSkeleton /> });
const IncreaseDecreaseViz = dynamic(() => import('./components/IncreaseDecreaseViz'), { ssr: false, loading: () => <VizSkeleton /> });
const MaxMinViz = dynamic(() => import('./components/MaxMinViz'), { ssr: false, loading: () => <VizSkeleton /> });
const GraphSketchViz = dynamic(() => import('./components/GraphSketchViz'), { ssr: false, loading: () => <VizSkeleton /> });
const IntegralDefinitionViz = dynamic(() => import('./components/IntegralDefinitionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const AntiderivativeViz = dynamic(() => import('./components/AntiderivativeViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DefiniteIntegralViz = dynamic(() => import('./components/DefiniteIntegralViz'), { ssr: false, loading: () => <VizSkeleton /> });
const AreaBetweenCurvesViz = dynamic(() => import('./components/AreaBetweenCurvesViz'), { ssr: false, loading: () => <VizSkeleton /> });

interface Level {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<Record<string, unknown>>;
}

const LEVEL_COUNT = 13;

const levelComponents: Record<number, React.ComponentType<Record<string, unknown>>> = {
  1: DerivativeDefinitionViz,
  2: PowerRuleViz,
  3: TangentLineViz,
  4: DerivativeGraphViz,
  5: IncreaseDecreaseViz,
  6: MaxMinViz,
  7: GraphSketchViz,
  8: IntegralDefinitionViz,
  9: AntiderivativeViz,
  10: DefiniteIntegralViz,
  11: AreaBetweenCurvesViz,
  12: TangentLineViz,
  13: GraphSketchViz,
};

export default function CalculusPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);

  const progress = moduleProgress[MODULE_ID]?.completedLevels || [];

  const levels: Level[] = Array.from({ length: LEVEL_COUNT }, (_, i) => {
    const id = i + 1;
    return {
      id,
      title: t(`modules.calculus.page_levels.${id}.title`),
      description: t(`modules.calculus.page_levels.${id}.desc`),
      component: levelComponents[id],
    };
  });

  const handleComplete = () => {
    completeLevel(MODULE_ID, currentLevel);
    setShowUnlock(true);
  };

  const handleNext = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setShowUnlock(false);
    } else {
      unlockBadge('flux_master');
      window.location.href = "/";
    }
  };

  const currentLevelData = levels.find((l) => l.id === currentLevel);
  const VizComponent = currentLevelData?.component;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{t('modules.calculus.title')}</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Level {currentLevel} / {levels.length}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm relative">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-blue-600" />
                {currentLevelData?.title}
              </h2>
              <div className="text-xs text-slate-400">{currentLevelData?.description}</div>
            </div>

            <div className="p-8">
              {VizComponent && <VizComponent />}
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={handleComplete}
                disabled={progress.includes(currentLevel)}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {progress.includes(currentLevel) ? t('modules.calculus.page_ui.completed_btn') : t('modules.calculus.page_ui.complete_btn')}
              </button>
            </div>

            <AnimatePresence>
              {showUnlock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/90 backdrop-blur-md"
                >
                  <div className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-2xl text-center max-w-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{t('modules.calculus.page_ui.level_clear')}</h3>
                    <p className="text-sm text-slate-500 mb-8">{t('modules.calculus.page_ui.level_clear_desc')}</p>
                    <button
                      onClick={handleNext}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {currentLevel < levels.length ? t('modules.calculus.page_ui.next_level') : t('modules.calculus.page_ui.module_complete')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: level list */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {t('modules.calculus.page_ui.level_list')}
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {levels.map((level) => {
                const completed = progress.includes(level.id);
                const isCurrent = level.id === currentLevel;
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      setCurrentLevel(level.id);
                      setShowUnlock(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-blue-50 border border-blue-200 text-blue-800 font-bold'
                        : completed
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold w-6 text-center">{level.id}</span>
                    {completed && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    <span className="flex-1 truncate">{level.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">
              {t('modules.calculus.page_ui.progress')}
            </h3>
            <div className="text-3xl font-bold mb-2">
              {progress.length} / {levels.length}
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(progress.length / levels.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
