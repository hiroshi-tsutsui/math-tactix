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

const levels: Level[] = [
  // --- 微分シリーズ ---
  {
    id: 1,
    title: '微分の定義',
    description: '極限による導関数の定義を h→0 のスライダーで体感しよう',
    component: DerivativeDefinitionViz,
  },
  {
    id: 2,
    title: 'べき乗の微分',
    description: 'x^n の微分法則をスライダーで n を変えながら確認しよう',
    component: PowerRuleViz,
  },
  {
    id: 3,
    title: '接線の方程式',
    description: 'グラフ上の点を動かして接線の変化を観察しよう',
    component: TangentLineViz,
  },
  {
    id: 4,
    title: '導関数のグラフ',
    description: 'f(x) と f\'(x) のグラフを並べて対応関係を確認しよう',
    component: DerivativeGraphViz,
  },
  {
    id: 5,
    title: '増減表',
    description: 'f\'(x) の符号から関数の増加・減少を判定しよう',
    component: IncreaseDecreaseViz,
  },
  // --- 極値シリーズ ---
  {
    id: 6,
    title: '極大・極小',
    description: 'f\'(x)=0 の点と極値を視覚的に理解しよう',
    component: MaxMinViz,
  },
  {
    id: 7,
    title: 'グラフの概形',
    description: '増減表からグラフのスケッチを描く練習をしよう',
    component: GraphSketchViz,
  },
  // --- 積分シリーズ ---
  {
    id: 8,
    title: '積分の定義（リーマン和）',
    description: '区間分割数を変えてリーマン和が面積に近づく様子を観察しよう',
    component: IntegralDefinitionViz,
  },
  {
    id: 9,
    title: '不定積分（原始関数）',
    description: '被積分関数と原始関数の関係を確認しよう',
    component: AntiderivativeViz,
  },
  {
    id: 10,
    title: '定積分',
    description: '定積分の値を面積として視覚化しよう',
    component: DefiniteIntegralViz,
  },
  {
    id: 11,
    title: '2曲線間の面積',
    description: '2つの曲線で囲まれた領域の面積を計算しよう',
    component: AreaBetweenCurvesViz,
  },
  // --- 応用（既存レベルの発展） ---
  {
    id: 12,
    title: '接線の応用',
    description: '二次関数の接線を使った応用問題に挑戦しよう',
    component: TangentLineViz,
  },
  {
    id: 13,
    title: '増減と極値の総合演習',
    description: '三次関数の増減表・極値・グラフの概形を総合的に練習しよう',
    component: GraphSketchViz,
  },
];

export default function CalculusPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);

  const progress = moduleProgress[MODULE_ID]?.completedLevels || [];

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
                {progress.includes(currentLevel) ? '完了済み' : 'このレベルを完了'}
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
                    <h3 className="text-2xl font-bold mb-2">レベルクリア！</h3>
                    <p className="text-sm text-slate-500 mb-8">次のレベルに進みましょう。</p>
                    <button
                      onClick={handleNext}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {currentLevel < levels.length ? '次のレベルへ' : 'モジュール完了'}
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
              レベル一覧
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
              進捗
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
