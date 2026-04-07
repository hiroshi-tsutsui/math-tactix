"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, User, Shield, Activity, Award, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { useProgress, ModuleId } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BADGES = [
  { id: 'first_step', icon: '🎯' },
  { id: 'vector_master', icon: '📐' },
  { id: 'flux_pioneer', icon: '∫' },
  { id: 'function_novice', icon: '📦' },
  { id: 'causality_master', icon: '⚡' }
];

// Module total level counts for progress rate calculation
const MODULE_TOTAL_LEVELS: Partial<Record<ModuleId, number>> = {
  quadratics: 74,
  trig: 20,
  data: 19,
  probability: 20,
  functions: 10,
  vectors: 5,
  sequences: 5,
  calculus: 5,
  complex: 5,
  logs: 5,
  matrices: 5,
};

const MODULE_COLORS: Record<string, string> = {
  quadratics: '#3b82f6',
  trig: '#f59e0b',
  data: '#10b981',
  probability: '#8b5cf6',
  functions: '#ec4899',
  vectors: '#06b6d4',
  sequences: '#84cc16',
  calculus: '#ef4444',
  complex: '#6366f1',
  logs: '#14b8a6',
  matrices: '#f97316',
};

interface ChartDataItem {
  name: string;
  moduleId: string;
  completed: number;
  total: number;
  rate: number;
  fill: string;
}

function ModuleProgressChart({
  moduleProgress,
  t,
}: {
  moduleProgress: Record<ModuleId, { id: ModuleId; completedLevels: number[]; isMastered: boolean; xpEarned: number }>;
  t: (key: string) => string;
}) {
  const chartData: ChartDataItem[] = Object.values(moduleProgress).map((mod) => {
    const total = MODULE_TOTAL_LEVELS[mod.id] ?? 5;
    const completed = mod.completedLevels.length;
    const rate = Math.min(Math.round((completed / total) * 100), 100);
    const translatedName = t(`dashboard.modules.${mod.id}.title`);
    const name = translatedName !== `dashboard.modules.${mod.id}.title` ? translatedName : mod.id;
    return {
      name: name.length > 6 ? name.slice(0, 6) + '...' : name,
      moduleId: mod.id,
      completed,
      total,
      rate,
      fill: MODULE_COLORS[mod.id] || '#94a3b8',
    };
  });

  // Sort by rate descending
  chartData.sort((a, b) => b.rate - a.rate);

  const maxRate = Math.max(...chartData.map((d) => d.rate), 0);
  const minRate = Math.min(...chartData.map((d) => d.rate), 100);
  const bestModule = chartData[0];
  const worstModule = chartData[chartData.length - 1];

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              unit="%"
            />
            <Tooltip
              formatter={(value, _name, props) => {
                const item = props.payload as unknown as ChartDataItem;
                return [`${value}% (${item.completed}/${item.total} levels)`, '進捗率'];
              }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3">
        {bestModule && bestModule.rate > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">
              {t('profile.progress.most_advanced') !== 'profile.progress.most_advanced' ? t('profile.progress.most_advanced') : '最も進んでいる'}
            </div>
            <div className="text-sm font-bold text-green-800">{bestModule.name}</div>
            <div className="text-xs text-green-600 font-mono">{bestModule.rate}%</div>
          </div>
        )}
        {worstModule && chartData.length > 1 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
              {t('profile.progress.needs_work') !== 'profile.progress.needs_work' ? t('profile.progress.needs_work') : '伸びしろあり'}
            </div>
            <div className="text-sm font-bold text-amber-800">{worstModule.name}</div>
            <div className="text-xs text-amber-600 font-mono">{worstModule.rate}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { xp, level, title, moduleProgress, calibration } = useProgress();
  const { t } = useLanguage();
  const { unlockedBadges } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalModules = Object.keys(moduleProgress).length;
  const masteredCount = Object.values(moduleProgress).filter(m => m.isMastered).length;
  const syncRate = Math.round((masteredCount / totalModules) * 100);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('profile.back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('profile.label')}</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-sm font-bold">{title}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Stats Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{title}</h2>
                <div className="flex items-center gap-2 mb-8">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 tracking-wider">
                      {t('profile.stats.level', { level })}
                  </span>
                </div>

                <div className="w-full space-y-4">
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>{t('profile.stats.xp_progress')}</span>
                     <span>{xp % 1000} / 1000</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(xp % 1000) / 10}%` }}
                        className="h-full bg-blue-600"
                      />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    {t('profile.calibration.title')}
                </span>
              </div>
              {calibration.status === 'COMPLETED' ? (
                <div>
                   <div className="text-4xl font-bold mb-2">{calibration.rate}%</div>
                   <p className="text-xs text-slate-400 font-medium">
                       {t('profile.calibration.prev_score')}
                   </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 leading-relaxed">
                      {t('profile.calibration.not_taken')}
                  </p>
                  <Link href="/quiz" className="inline-block text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors">
                    {t('profile.calibration.start_test')}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Achievements Section */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    {t('badges.title')}
                </h3>
                <div className="space-y-4">
                    {BADGES.map(badge => {
                        const isUnlocked = unlockedBadges.includes(badge.id);
                        return (
                            <div key={badge.id} className={`flex items-center gap-4 p-4 rounded-xl border ${isUnlocked ? 'bg-yellow-50 border-yellow-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isUnlocked ? 'bg-white shadow-sm' : 'bg-slate-200 grayscale'}`}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <div className={`text-sm font-bold ${isUnlocked ? 'text-yellow-900' : 'text-slate-500'}`}>
                                        {t(`badges.${badge.id}.name`)}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium">
                                        {isUnlocked ? t(`badges.${badge.id}.desc`) : 'Locked'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Right Column: Module Progress */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
               <div className="space-y-1">
                 <h3 className="text-2xl font-bold tracking-tight">{t('profile.progress.title')}</h3>
                 <p className="text-sm text-slate-500 font-medium">{t('profile.progress.subtitle')}</p>
               </div>
               <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">{syncRate}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('profile.progress.total_mastery')}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(moduleProgress).map((mod) => (
                <div 
                  key={mod.id}
                  className={`p-6 rounded-2xl border transition-all duration-200 bg-white
                    ${mod.isMastered ? 'border-green-100 shadow-sm' : 'border-slate-200 hover:border-blue-300 shadow-sm'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-sm text-slate-700 capitalize">
                        {/* We use module IDs as keys, so we check if a translation exists, else fallback to ID */}
                        {t(`dashboard.modules.${mod.id}.title`) !== `dashboard.modules.${mod.id}.title` 
                            ? t(`dashboard.modules.${mod.id}.title`) 
                            : mod.id}
                    </span>
                    {mod.isMastered && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {t('profile.card.mastered')}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(mod.completedLevels.length / 3) * 100}%` }}
                      className={`h-full ${mod.isMastered ? 'bg-green-500' : 'bg-blue-600'}`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">{t('profile.card.progress')}</span>
                    <span className="text-slate-600 font-mono">
                        {t('profile.card.stages', { count: mod.completedLevels.length })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Module Progress Chart */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold">{t('profile.progress.chart_title') !== 'profile.progress.chart_title' ? t('profile.progress.chart_title') : 'モジュール別進捗'}</h3>
              </div>
              <ModuleProgressChart moduleProgress={moduleProgress} t={t} />
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100">
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{totalModules}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('profile.progress.module_count')}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{masteredCount}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('profile.progress.mastered_count')}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{xp}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('profile.stats.xp_total')}
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
