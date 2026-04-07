"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import { GeistSans } from 'geist/font/sans';

const MODULE_ID = 'complex';

// --- Dynamic Viz component imports (code-split for bundle size) ---
const VizSkeleton = () => <div className="animate-pulse bg-slate-100 rounded-2xl h-48" />;

const ComplexPlaneViz = dynamic(() => import('./components/ComplexPlaneViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexArithmeticViz = dynamic(() => import('./components/ComplexArithmeticViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexMultiplicationViz = dynamic(() => import('./components/ComplexMultiplicationViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ConjugateViz = dynamic(() => import('./components/ConjugateViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexDivisionViz = dynamic(() => import('./components/ComplexDivisionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ModulusArgumentViz = dynamic(() => import('./components/ModulusArgumentViz'), { ssr: false, loading: () => <VizSkeleton /> });
const PolarFormViz = dynamic(() => import('./components/PolarFormViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DeMoivreViz = dynamic(() => import('./components/DeMoivreViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexEquationViz = dynamic(() => import('./components/ComplexEquationViz'), { ssr: false, loading: () => <VizSkeleton /> });
const QuadraticComplexRootsViz = dynamic(() => import('./components/QuadraticComplexRootsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexLociViz = dynamic(() => import('./components/ComplexLociViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ComplexQuizViz = dynamic(() => import('./components/ComplexQuizViz'), { ssr: false, loading: () => <VizSkeleton /> });

// --- Level definitions ---
interface LevelDef {
  id: number;
  title: string;
  subtitle: string;
  component: React.ComponentType;
}

const levels: LevelDef[] = [
  { id: 1, title: '複素平面', subtitle: 'アルガン図の基本、a+bi を平面上の点として表示', component: ComplexPlaneViz },
  { id: 2, title: '加法・減法', subtitle: 'ベクトルの和と差、平行四辺形の法則', component: ComplexArithmeticViz },
  { id: 3, title: '乗法', subtitle: '回転とスケーリング、|z₁z₂| = |z₁||z₂|', component: ComplexMultiplicationViz },
  { id: 4, title: '共役複素数', subtitle: '実軸対称、z·z̄ = |z|²', component: ConjugateViz },
  { id: 5, title: '除法', subtitle: '共役を使った実数化のステップ', component: ComplexDivisionViz },
  { id: 6, title: '絶対値と偏角', subtitle: '|z| と arg(z) の定義、極座標との対応', component: ModulusArgumentViz },
  { id: 7, title: '極形式', subtitle: 'r(cosθ + i sinθ)、スライダーで r と θ を変化', component: PolarFormViz },
  { id: 8, title: 'ド・モアブルの定理', subtitle: '(cosθ + i sinθ)^n = cos(nθ) + i sin(nθ)', component: DeMoivreViz },
  { id: 9, title: '複素数の方程式', subtitle: 'z² = -1, z³ = 1 など', component: ComplexEquationViz },
  { id: 10, title: '二次方程式の複素数解', subtitle: '判別式 D < 0 の場合の複素根', component: QuadraticComplexRootsViz },
  { id: 11, title: '点の軌跡', subtitle: '|z - a| = r, |z - a| = |z - b| などの図形', component: ComplexLociViz },
  { id: 12, title: '総合クイズ', subtitle: 'ランダム問題で理解度チェック', component: ComplexQuizViz },
];

export default function ComplexPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const { addXP } = useGamification();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const completedLevels = moduleProgress[MODULE_ID]?.completedLevels || [];

  const handleComplete = (levelId: number) => {
    completeLevel(MODULE_ID, levelId);
    addXP(15);
  };

  const isLevelAccessible = (levelId: number): boolean => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const ActiveViz = selectedLevel !== null ? levels.find(l => l.id === selectedLevel)?.component : null;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <span className="text-sm font-bold">{t('modules.complex.title')}</span>
          <span className="text-xs text-slate-400">{completedLevels.length}/{levels.length}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {selectedLevel === null ? (
          /* Level selection grid */
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('modules.complex.title')}</h1>
              <p className="text-slate-500 text-sm">{t('modules.complex.desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map(level => {
                const isCompleted = completedLevels.includes(level.id);
                const isAccessible = isLevelAccessible(level.id);

                return (
                  <button
                    key={level.id}
                    onClick={() => isAccessible && setSelectedLevel(level.id)}
                    disabled={!isAccessible}
                    className={`text-left p-6 rounded-2xl border transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-50 border-green-200 hover:border-green-300'
                        : isAccessible
                          ? 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                          : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        isCompleted ? 'bg-green-100 text-green-700' : isAccessible ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-400'
                      }`}>
                        Level {level.id}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : !isAccessible ? (
                        <Lock className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{level.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{level.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active level view */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setSelectedLevel(null)} className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
                <ChevronRight className="w-4 h-4 rotate-180" />
                レベル一覧に戻る
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">
                  Level {selectedLevel}
                </span>
                <h2 className="font-bold text-slate-800">
                  {levels.find(l => l.id === selectedLevel)?.title}
                </h2>
              </div>
              {!completedLevels.includes(selectedLevel) && (
                <button
                  onClick={() => handleComplete(selectedLevel)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition"
                >
                  完了にする
                </button>
              )}
              {completedLevels.includes(selectedLevel) && (
                <span className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 完了済み
                </span>
              )}
            </div>

            {ActiveViz && <ActiveViz />}
          </div>
        )}
      </main>
    </div>
  );
}
