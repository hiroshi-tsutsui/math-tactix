"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { GeistSans } from 'geist/font/sans';
import { CheckCircle2, Grid, Lock, ChevronRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MATRIX_LEVELS } from './data/levels';

const MODULE_ID = 'matrices';

// --- Dynamic Viz component imports (code-split for bundle size) ---
const VizSkeleton = () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl h-48" />;

const MatrixBasicsViz = dynamic(() => import('./components/MatrixBasicsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const MatrixArithmeticViz = dynamic(() => import('./components/MatrixArithmeticViz'), { ssr: false, loading: () => <VizSkeleton /> });
const ScalarMultiplicationMatrixViz = dynamic(() => import('./components/ScalarMultiplicationMatrixViz'), { ssr: false, loading: () => <VizSkeleton /> });
const MatrixMultiplicationViz = dynamic(() => import('./components/MatrixMultiplicationViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DeterminantViz = dynamic(() => import('./components/DeterminantViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DeterminantGeometricViz = dynamic(() => import('./components/DeterminantGeometricViz'), { ssr: false, loading: () => <VizSkeleton /> });
const InverseMatrixViz = dynamic(() => import('./components/InverseMatrixViz'), { ssr: false, loading: () => <VizSkeleton /> });
const IdentityMatrixViz = dynamic(() => import('./components/IdentityMatrixViz'), { ssr: false, loading: () => <VizSkeleton /> });
const LinearTransformViz = dynamic(() => import('./components/LinearTransformViz'), { ssr: false, loading: () => <VizSkeleton /> });
const RotationMatrixViz = dynamic(() => import('./components/RotationMatrixViz'), { ssr: false, loading: () => <VizSkeleton /> });
const SystemOfEquationsViz = dynamic(() => import('./components/SystemOfEquationsViz'), { ssr: false, loading: () => <VizSkeleton /> });
const MatricesQuizViz = dynamic(() => import('./components/MatricesQuizViz'), { ssr: false, loading: () => <VizSkeleton /> });

function renderViz(type: string) {
  switch (type) {
    case 'matrix_basics': return <MatrixBasicsViz />;
    case 'matrix_arithmetic': return <MatrixArithmeticViz />;
    case 'scalar_multiplication': return <ScalarMultiplicationMatrixViz />;
    case 'matrix_multiplication': return <MatrixMultiplicationViz />;
    case 'determinant': return <DeterminantViz />;
    case 'determinant_geometric': return <DeterminantGeometricViz />;
    case 'inverse_matrix': return <InverseMatrixViz />;
    case 'identity_matrix': return <IdentityMatrixViz />;
    case 'linear_transform': return <LinearTransformViz />;
    case 'rotation_matrix': return <RotationMatrixViz />;
    case 'system_of_equations': return <SystemOfEquationsViz />;
    case 'matrices_quiz': return <MatricesQuizViz />;
    default: return <div className="text-slate-400 text-center py-8">Coming soon...</div>;
  }
}

export default function MatricesPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const progress = moduleProgress[MODULE_ID] || { completedLevels: [] };
  const completedSet = new Set(progress.completedLevels);

  const handleComplete = () => {
    if (selectedLevel !== null) {
      completeLevel(MODULE_ID, selectedLevel);
    }
  };

  const currentLevelData = selectedLevel !== null
    ? MATRIX_LEVELS.find(l => l.id === selectedLevel)
    : null;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans ${GeistSans.className}`}>
      {/* Nav */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <span className="text-sm font-bold">{t('modules.matrices.title')}</span>
          <span className="text-xs text-slate-400">
            {completedSet.size}/{MATRIX_LEVELS.length} {t('modules.matrices.page_ui.completed_label')}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {selectedLevel === null ? (
            /* ─── Level selection grid ─── */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight">{t('modules.matrices.page_ui.page_title')}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  {t('modules.matrices.page_ui.page_desc')}
                </p>
              </div>

              {/* Sections */}
              {[
                { title: t('modules.matrices.page_ui.section_basics'), range: [1, 4], color: 'blue' },
                { title: t('modules.matrices.page_ui.section_det_inv'), range: [5, 8], color: 'purple' },
                { title: t('modules.matrices.page_ui.section_transform'), range: [9, 10], color: 'indigo' },
                { title: t('modules.matrices.page_ui.section_applied'), range: [11, 12], color: 'green' },
              ].map(section => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {MATRIX_LEVELS
                      .filter(l => l.id >= section.range[0] && l.id <= section.range[1])
                      .map(level => {
                        const completed = completedSet.has(level.id);
                        return (
                          <button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            className={`group relative text-left p-5 rounded-2xl border transition-all hover:shadow-lg ${
                              completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className={`text-xs font-bold uppercase tracking-wider ${
                                completed ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                Level {level.id}
                              </span>
                              {completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
                              {t(`modules.matrices.page_levels.${level.id}.title`)}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {t(`modules.matrices.page_levels.${level.id}.desc`)}
                            </p>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* ─── Level detail view ─── */
            <motion.div
              key={`level-${selectedLevel}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Back to list */}
              <button
                onClick={() => setSelectedLevel(null)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                {t('modules.matrices.page_ui.level_list')}
              </button>

              {/* Level header */}
              {currentLevelData && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <Grid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{t(`modules.matrices.page_levels.${currentLevelData.id}.title`)}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t(`modules.matrices.page_levels.${currentLevelData.id}.desc`)}</p>
                  </div>
                </div>
              )}

              {/* Viz content */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm p-8">
                {currentLevelData && renderViz(currentLevelData.type)}
              </div>

              {/* Complete button */}
              <div className="flex justify-center gap-4">
                {!completedSet.has(selectedLevel) && (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors shadow-md"
                  >
                    {t('modules.matrices.page_ui.complete_btn')}
                  </button>
                )}
                {selectedLevel < MATRIX_LEVELS.length && (
                  <button
                    onClick={() => setSelectedLevel(selectedLevel + 1)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-md"
                  >
                    {t('modules.matrices.page_ui.next_level')}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
