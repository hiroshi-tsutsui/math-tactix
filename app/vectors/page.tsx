"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { GeistSans } from 'geist/font/sans';
import { MoveUpRight, CheckCircle2, ChevronRight, LineChart } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'vectors';

const VizSkeleton = () => <div className="animate-pulse bg-slate-700 rounded h-48" />;

// Dynamic Viz imports
const VectorBasicsViz = dynamic(() => import('./components/VectorBasicsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorComponentsViz = dynamic(() => import('./components/VectorComponentsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorAdditionViz = dynamic(() => import('./components/VectorAdditionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ScalarMultiplicationViz = dynamic(() => import('./components/ScalarMultiplicationViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorMagnitudeViz = dynamic(() => import('./components/VectorMagnitudeViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DotProductViz = dynamic(() => import('./components/DotProductViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DotProductAngleViz = dynamic(() => import('./components/DotProductAngleViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorPerpendicularViz = dynamic(() => import('./components/VectorPerpendicularViz'), { ssr: false, loading: () => <VizSkeleton /> });
const UnitVectorViz = dynamic(() => import('./components/UnitVectorViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorPositionViz = dynamic(() => import('./components/VectorPositionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const VectorsQuizViz = dynamic(() => import('./components/VectorsQuizViz'), { ssr: false, loading: () => <VizSkeleton /> });

interface Level {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<Record<string, unknown>>;
}

const levels: Level[] = [
  {
    id: 1,
    title: 'ベクトルの基本',
    description: '有向線分としてのベクトルの定義を学ぼう',
    component: VectorBasicsViz,
  },
  {
    id: 2,
    title: 'ベクトルの成分表示',
    description: 'x成分・y成分でベクトルを表現しよう',
    component: VectorComponentsViz,
  },
  {
    id: 3,
    title: 'ベクトルの和と差',
    description: '平行四辺形の法則でベクトルの加法を体感しよう',
    component: VectorAdditionViz,
  },
  {
    id: 4,
    title: 'スカラー倍',
    description: 'ベクトルの拡大・縮小・反転を操作しよう',
    component: ScalarMultiplicationViz,
  },
  {
    id: 5,
    title: 'ベクトルの大きさ',
    description: '|a| = sqrt(x^2 + y^2) を視覚的に確認しよう',
    component: VectorMagnitudeViz,
  },
  {
    id: 6,
    title: '内積の定義',
    description: 'a・b = a1*b1 + a2*b2 を計算し角度との関係を見よう',
    component: DotProductViz,
  },
  {
    id: 7,
    title: '内積と角度',
    description: 'cos θ = a・b / (|a||b|) で角度を求めよう',
    component: DotProductAngleViz,
  },
  {
    id: 8,
    title: '垂直条件',
    description: 'a・b = 0 のとき直交することを確認しよう',
    component: VectorPerpendicularViz,
  },
  {
    id: 9,
    title: '単位ベクトル',
    description: 'ベクトルの正規化（大きさ1にする操作）を学ぼう',
    component: UnitVectorViz,
  },
  {
    id: 10,
    title: '位置ベクトルと内分点',
    description: '位置ベクトルによる内分点の表し方を学ぼう',
    component: VectorPositionViz,
  },
  {
    id: 11,
    title: 'ベクトル総合クイズ',
    description: 'ランダム問題でベクトルの知識を総チェック！',
    component: VectorsQuizViz,
  },
];

export default function VectorsPage() {
  const { t } = useLanguage();
  const { moduleProgress, completeLevel } = useProgress();
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
      unlockBadge('vector_master');
      window.location.href = "/";
    }
  };

  const currentLevelData = levels.find((l) => l.id === currentLevel);
  const VizComponent = currentLevelData?.component;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans ${GeistSans.className} transition-colors duration-200`}>
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 h-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold dark:text-white">{t('modules.vectors.title')}</span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Level {currentLevel} / {levels.length}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm relative transition-colors duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <MoveUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {currentLevelData?.title}
              </h2>
              <div className="text-xs text-slate-400 dark:text-slate-500">{currentLevelData?.description}</div>
            </div>

            <div className="p-8">
              {VizComponent && <VizComponent />}
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={handleComplete}
                disabled={progress.includes(currentLevel)}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {progress.includes(currentLevel) ? '完了済み' : 'このレベルを完了'}
              </button>
            </div>

            <AnimatePresence>
              {showUnlock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md"
                >
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-10 rounded-[40px] shadow-2xl text-center max-w-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2 dark:text-white">レベルクリア！</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">次のレベルに進みましょう。</p>
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-sm transition-colors duration-200">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
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
                        ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-bold'
                        : completed
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
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

          <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white shadow-xl transition-colors duration-200">
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
