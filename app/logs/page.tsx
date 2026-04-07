"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { CheckCircle2, ChevronRight, Activity, Zap, Maximize2, Info } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'logs';

const VizSkeleton = () => <div className="animate-pulse bg-slate-700 rounded h-48" />;

// Dynamic Viz imports
const LogDefinitionViz = dynamic(() => import('./components/LogDefinitionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LogPropertiesViz = dynamic(() => import('./components/LogPropertiesViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ChangeOfBaseViz = dynamic(() => import('./components/ChangeOfBaseViz'), { ssr: false, loading: () => <VizSkeleton /> });
const CommonLogDigitsViz = dynamic(() => import('./components/CommonLogDigitsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LogEquationViz = dynamic(() => import('./components/LogEquationViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LogInequalityViz = dynamic(() => import('./components/LogInequalityViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LogGraphShiftViz = dynamic(() => import('./components/LogGraphShiftViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ExpLogSymmetryViz = dynamic(() => import('./components/ExpLogSymmetryViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LogComparisonViz = dynamic(() => import('./components/LogComparisonViz'), { ssr: false, loading: () => <VizSkeleton /> });

interface Level {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<Record<string, unknown>>;
}

const levels: Level[] = [
  // Original 3 levels reimplemented with dedicated Viz
  {
    id: 1,
    title: '指数成長の観察',
    description: '指数関数の急激な成長を体感しよう',
    component: ExpLogSymmetryViz,
  },
  {
    id: 2,
    title: '対数の定義',
    description: 'log_a M = p と a^p = M の対応関係を理解しよう',
    component: LogDefinitionViz,
  },
  {
    id: 3,
    title: '対数スケールの圧縮',
    description: '対数を使って巨大な数を扱いやすくする体験',
    component: CommonLogDigitsViz,
  },
  // New levels
  {
    id: 4,
    title: '対数の基本性質',
    description: '積・商・累乗の対数法則を視覚的に学ぼう',
    component: LogPropertiesViz,
  },
  {
    id: 5,
    title: '底の変換公式',
    description: 'log_a b = log_c b / log_c a を理解しよう',
    component: ChangeOfBaseViz,
  },
  {
    id: 6,
    title: '常用対数と桁数',
    description: 'log₁₀を使った桁数計算をマスターしよう',
    component: CommonLogDigitsViz,
  },
  {
    id: 7,
    title: '対数方程式',
    description: 'log_a f(x) = k の解法をグラフで確認しよう',
    component: LogEquationViz,
  },
  {
    id: 8,
    title: '対数不等式',
    description: '対数不等式の解と領域を視覚化しよう',
    component: LogInequalityViz,
  },
  {
    id: 9,
    title: '対数関数のグラフ移動',
    description: 'y = log_a(x-h) + k のシフトを操作しよう',
    component: LogGraphShiftViz,
  },
  {
    id: 10,
    title: '指数と対数の対称性',
    description: 'y = a^x と y = log_a x が y=x で対称であることを確認しよう',
    component: ExpLogSymmetryViz,
  },
  {
    id: 11,
    title: '対数の大小比較',
    description: '対数を使った大小比較のテクニックを学ぼう',
    component: LogComparisonViz,
  },
  {
    id: 12,
    title: '対数の総合演習',
    description: '全ての対数法則を使って問題を解こう',
    component: LogPropertiesViz,
  },
];

export default function LogsPage() {
  const { moduleProgress, completeLevel } = useProgress();
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
      window.location.href = "/";
    }
  };

  const currentLevelData = levels.find((l) => l.id === currentLevel);
  const VizComponent = currentLevelData?.component;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">対数（ログ）</span>
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
                <Maximize2 className="w-5 h-5 text-blue-600" />
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
