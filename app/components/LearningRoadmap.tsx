"use client";

import React from 'react';
import Link from 'next/link';
import { useProgress, ModuleId } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight } from 'lucide-react';

interface RoadmapNode {
  id: string;
  moduleId: ModuleId | null;
  label: string;
  category: string;
}

const ROADMAP_PATH: RoadmapNode[] = [
  { id: 'math_i_numbers', moduleId: 'math_i_numbers', label: 'node_math_i_numbers', category: '数学I' },
  { id: 'quadratics', moduleId: 'quadratics', label: 'node_quadratics', category: '数学I' },
  { id: 'sets_logic', moduleId: 'sets_logic', label: 'node_sets_logic', category: '数学I' },
  { id: 'trig_ratios', moduleId: 'trig_ratios', label: 'node_trig_ratios', category: '数学I' },
  { id: 'data', moduleId: 'data', label: 'node_data', category: '数学I' },
  { id: 'probability', moduleId: 'probability', label: 'node_probability', category: '数学A' },
  { id: 'trig', moduleId: 'trig', label: 'node_trig', category: '数学II' },
  { id: 'logs', moduleId: 'logs', label: 'node_logs', category: '数学II' },
  { id: 'sequences', moduleId: 'sequences', label: 'node_sequences', category: '数学B' },
  { id: 'calculus', moduleId: 'calculus', label: 'node_calculus', category: '数学II' },
  { id: 'vectors', moduleId: 'vectors', label: 'node_vectors', category: '数学C' },
  { id: 'complex', moduleId: 'complex', label: 'node_complex', category: '数学C' },
  { id: 'matrices', moduleId: 'matrices', label: 'node_matrices', category: '数学C' },
  { id: 'functions', moduleId: 'functions', label: 'node_functions', category: '数学III' },
];

const CATEGORY_COLORS: Record<string, string> = {
  '数学I': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  '数学A': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  '数学II': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  '数学B': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  '数学C': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  '数学III': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function getNodeStatus(
  node: RoadmapNode,
  moduleProgress: ReturnType<typeof useProgress>['moduleProgress']
): 'completed' | 'in-progress' | 'locked' {
  const modId = node.moduleId ?? (node.id as ModuleId);
  const prog = moduleProgress[modId];
  if (!prog) return 'locked';
  if (prog.isMastered) return 'completed';
  if (prog.completedLevels.length > 0) return 'in-progress';
  return 'locked';
}

function StatusIcon({ status }: { status: 'completed' | 'in-progress' | 'locked' }) {
  if (status === 'completed') {
    return <span className="text-green-500 text-sm">&#10003;</span>;
  }
  if (status === 'in-progress') {
    return <span className="text-blue-500 text-sm">&#9654;</span>;
  }
  return <span className="text-slate-300 dark:text-slate-600 text-sm">&#128274;</span>;
}

export default function LearningRoadmap() {
  const { moduleProgress } = useProgress();
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm transition-colors duration-200">
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
        {t('roadmap.title')}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('roadmap.subtitle')}</p>

      {/* Desktop: horizontal scrollable */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex items-center gap-1 min-w-max">
          {ROADMAP_PATH.map((node, idx) => {
            const status = getNodeStatus(node, moduleProgress);
            const href = `/${node.id}`;
            const statusBorder =
              status === 'completed'
                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                : status === 'in-progress'
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800';

            return (
              <React.Fragment key={node.id}>
                <Link
                  href={href}
                  className={`flex flex-col items-center px-4 py-3 rounded-2xl border ${statusBorder} hover:shadow-md transition-all min-w-[100px] group`}
                >
                  <StatusIcon status={status} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 text-center leading-tight">
                    {t(`roadmap.${node.label}`)}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${CATEGORY_COLORS[node.category] || ''}`}>
                    {node.category}
                  </span>
                </Link>
                {idx < ROADMAP_PATH.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden space-y-2">
        {ROADMAP_PATH.map((node) => {
          const status = getNodeStatus(node, moduleProgress);
          const href = `/${node.id}`;
          const statusBg =
            status === 'completed'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
              : status === 'in-progress'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';

          return (
            <Link
              key={node.id}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${statusBg} transition-all`}
            >
              <StatusIcon status={status} />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex-1">
                {t(`roadmap.${node.label}`)}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[node.category] || ''}`}>
                {node.category}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
