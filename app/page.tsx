"use client";

import Link from 'next/link';
import { useProgress, ModuleId } from './contexts/ProgressContext';
import { useLanguage } from './contexts/LanguageContext';
import { GeistSans } from 'geist/font/sans';
import { ArrowRight, Lock } from 'lucide-react';
import SystemMessages from './components/SystemMessages';
import DashboardSkeleton from './components/DashboardSkeleton';
import LearningRoadmap from './components/LearningRoadmap';

const MODULE_TOTAL_LEVELS: Record<string, number> = {
  math_i_numbers: 55,
  quadratics: 74,
  trig: 29,
  data: 21,
  sets_logic: 19,
  probability: 20,
  calculus: 13,
  sequences: 13,
  logs: 12,
  vectors: 13,
  complex: 12,
  matrices: 12,
  functions: 10,
  trig_ratios: 20,
  quiz: 1,
};

export default function Home() {
  const { moduleProgress, calibration, isLoaded } = useProgress();
  const { t } = useLanguage();

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  const modules = [
    // --- Junior High ---
    {
      id: 'algebraic-logic',
      title: t('dashboard.modules.algebraic_logic.title'),
      subtitle: t('dashboard.modules.algebraic_logic.subtitle'),
      desc: t('dashboard.modules.algebraic_logic.desc'),
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'functional-dynamics-jh',
      title: t('dashboard.modules.functional_dynamics_jh.title'),
      subtitle: t('dashboard.modules.functional_dynamics_jh.subtitle'),
      desc: t('dashboard.modules.functional_dynamics_jh.desc'),
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'geometric-space',
      title: t('dashboard.modules.geometric_space.title'),
      subtitle: t('dashboard.modules.geometric_space.subtitle'),
      desc: t('dashboard.modules.geometric_space.desc'),
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'data-chance-jh',
      title: t('dashboard.modules.data_chance_jh.title'),
      subtitle: t('dashboard.modules.data_chance_jh.subtitle'),
      desc: t('dashboard.modules.data_chance_jh.desc'),
      status: 'LOCKED',
      color: 'text-slate-400',
    },

    // --- High School ---
    {
      id: 'math_i_numbers',
      title: '数と式 (数学I)',
      subtitle: 'Numbers and Algebraic Expressions',
      desc: '展開、因数分解から絶対値や二重根号まで。',
      status: 'READY',
      color: 'text-indigo-400',
    },

    {
      id: 'quadratics',
      title: t('dashboard.modules.quadratics.title'),
      subtitle: t('dashboard.modules.quadratics.subtitle'),
      desc: t('dashboard.modules.quadratics.desc'),
      status: 'READY',
      color: 'text-blue-500',
    },
    {
      id: 'data',
      title: t('dashboard.modules.data.title'),
      subtitle: t('dashboard.modules.data.subtitle'),
      desc: t('dashboard.modules.data.desc'),
      status: 'READY',
      color: 'text-teal-400',
    },
    {
      id: 'probability',
      title: t('dashboard.modules.probability.title'),
      subtitle: t('dashboard.modules.probability.subtitle'),
      desc: t('dashboard.modules.probability.desc'),
      status: 'READY',
      color: 'text-orange-400',
    },
    {
      id: 'calculus',
      title: t('dashboard.modules.calculus.title'),
      subtitle: t('dashboard.modules.calculus.subtitle'),
      desc: t('dashboard.modules.calculus.desc'),
      status: 'READY',
      color: 'text-red-500',
    },
    {
      id: 'sequences',
      title: t('dashboard.modules.sequences.title'),
      subtitle: t('dashboard.modules.sequences.subtitle'),
      desc: t('dashboard.modules.sequences.desc'),
      status: 'READY',
      color: 'text-cyan-400',
    },
    {
      id: 'logs',
      title: t('dashboard.modules.logs.title'),
      subtitle: t('dashboard.modules.logs.subtitle'),
      desc: t('dashboard.modules.logs.desc'),
      status: 'READY',
      color: 'text-rose-400',
    },
    {
      id: 'sets_logic',
      title: t('dashboard.modules.sets_logic.title'),
      subtitle: t('dashboard.modules.sets_logic.subtitle'),
      desc: t('dashboard.modules.sets_logic.desc'),
      status: 'READY',
      color: 'text-violet-400',
    },
    {
      id: 'trig_ratios',
      title: t('dashboard.modules.trig_ratios.title'),
      subtitle: t('dashboard.modules.trig_ratios.subtitle'),
      desc: t('dashboard.modules.trig_ratios.desc'),
      status: 'READY',
      color: 'text-sky-400',
    },
    {
      id: 'trig',
      title: t('dashboard.modules.trig.title'),
      subtitle: t('dashboard.modules.trig.subtitle'),
      desc: t('dashboard.modules.trig.desc'),
      status: 'READY',
      color: 'text-indigo-400',
    },
    {
      id: 'vectors',
      title: t('dashboard.modules.vectors.title'),
      subtitle: t('dashboard.modules.vectors.subtitle'),
      desc: t('dashboard.modules.vectors.desc'),
      status: 'READY',
      color: 'text-purple-400',
    },
    {
      id: 'complex',
      title: t('dashboard.modules.complex.title'),
      subtitle: t('dashboard.modules.complex.subtitle'),
      desc: t('dashboard.modules.complex.desc'),
      status: 'READY',
      color: 'text-pink-400',
    },
    {
      id: 'matrices',
      title: t('dashboard.modules.matrices.title'),
      subtitle: t('dashboard.modules.matrices.subtitle'),
      desc: t('dashboard.modules.matrices.desc'),
      status: 'READY',
      color: 'text-emerald-400',
    },
    {
      id: 'functions',
      title: t('dashboard.modules.functions.title'),
      subtitle: t('dashboard.modules.functions.subtitle'),
      desc: t('dashboard.modules.functions.desc'),
      status: 'READY',
      color: 'text-amber-400',
    },
    {
      id: 'quiz',
      title: t('dashboard.modules.quiz.title'),
      subtitle: t('dashboard.modules.quiz.subtitle'),
      desc: t('dashboard.modules.quiz.desc'),
      status: 'READY',
      color: 'text-red-500',
    }
  ];

  const sections = [
    {
      name: t('dashboard.sections.prep.name'),
      desc: t('dashboard.sections.prep.desc'),
      ids: ['quiz']
    },
    {
      name: t('dashboard.sections.jh.name'),
      desc: t('dashboard.sections.jh.desc'),
      ids: ['algebraic-logic', 'functional-dynamics-jh', 'geometric-space', 'data-chance-jh']
    },
    {
      name: t('dashboard.sections.hs_1a.name'),
      desc: t('dashboard.sections.hs_1a.desc'),
      ids: ['math_i_numbers', 'quadratics', 'sets_logic', 'trig_ratios', 'data', 'probability']
    },
    {
      name: t('dashboard.sections.hs_2b.name'),
      desc: t('dashboard.sections.hs_2b.desc'),
      ids: ['trig', 'calculus', 'sequences', 'logs']
    },
    {
      name: t('dashboard.sections.hs_3c.name'),
      desc: t('dashboard.sections.hs_3c.desc'),
      ids: ['vectors', 'complex', 'matrices', 'functions']
    }
  ];

  const masteredCount = modules.filter(m => moduleProgress[m.id as ModuleId]?.isMastered).length;
  const syncRate = Math.round((masteredCount / modules.length) * 100);

  let rank = "CANDIDATE";
  if (syncRate > 20) rank = "INITIATE";
  if (syncRate > 50) rank = "OPERATOR";
  if (syncRate > 80) rank = "ARCHITECT";
  if (syncRate === 100) rank = "OMEGA";

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 ${GeistSans.className}`}>
      <div className="fixed inset-0 pointer-events-none opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative pt-20 px-6 max-w-7xl mx-auto space-y-16 pb-32">
          
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-12 gap-8">
            <div className="space-y-3">
               <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 italic">
                  {t('dashboard.title_main')}
               </h1>
               <p className="text-lg text-slate-500 font-bold">{t('dashboard.title_sub')}</p>
            </div>

            <div className="w-full md:w-80 bg-white border border-slate-200 p-8 shadow-2xl rounded-[32px]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">{t('dashboard.rank_label')}</div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{rank}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">{syncRate}%</div>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${syncRate}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <Link href="/profile" className="text-[11px] font-black py-3 px-4 bg-slate-900 text-white rounded-2xl text-center hover:bg-blue-600 transition-all">
                        {t('dashboard.profile_btn')}
                    </Link>
                    <Link href="/settings" className="text-[11px] font-black py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl text-center hover:bg-slate-200 transition-all">
                        {t('dashboard.settings_btn')}
                    </Link>
                </div>
                <Link href="/manual" className="block text-[11px] font-black py-3 px-4 border-2 border-slate-100 text-slate-400 rounded-2xl text-center hover:border-slate-300 hover:text-slate-600 transition-all">
                    {t('dashboard.manual_btn')}
                </Link>
            </div>
          </div>

          <LearningRoadmap />

          <div className="space-y-24">
            {sections.map((section) => (
              <section key={section.name}>
                 <div className="mb-10 max-w-2xl">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                        {section.name}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{section.desc}</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.ids.map(id => {
                       const m = modules.find(mod => mod.id === id);
                       if (!m) return null;
                       
                       const isMastered = moduleProgress[m.id as ModuleId]?.isMastered;
                       const isLocked = m.status === 'LOCKED';
                       const completedLevels = moduleProgress[m.id as ModuleId]?.completedLevels || [];
                       const totalLevels = MODULE_TOTAL_LEVELS[m.id] || 0;
                       const progressPct = totalLevels > 0 ? Math.round((completedLevels.length / totalLevels) * 100) : 0;

                       return (
                          <div key={m.id} className="relative">
                            <Link
                                href={isLocked ? '#' : `/${m.id}`}
                                className={`group block relative p-10 bg-white border border-slate-200 rounded-[40px] transition-all duration-300 shadow-sm
                                    ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1'}
                                `}
                            >
                                {isMastered && (
                                    <div className="absolute top-6 right-6 bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                    {t('dashboard.status_completed')}
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute top-6 right-6 bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> {t('dashboard.status_dev')}
                                    </div>
                                )}
                                {!isLocked && !isMastered && completedLevels.length > 0 && (
                                    <div className="absolute top-6 right-6 bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                    {t('dashboard.status_in_progress')}
                                    </div>
                                )}

                                <div className={`text-[11px] font-black tracking-widest mb-4 uppercase ${isLocked ? 'text-slate-300' : 'text-blue-600'}`}>
                                    {m.subtitle}
                                </div>

                                <h2 className={`text-2xl font-black mb-4 tracking-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                    {m.title}
                                </h2>

                                <p className={`text-sm leading-relaxed mb-6 font-medium ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {m.desc}
                                </p>

                                {/* Progress section */}
                                {!isLocked && totalLevels > 0 && (
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-500">
                                                Lv {completedLevels.length} / {totalLevels}
                                            </span>
                                            <span className="font-black text-slate-400">{progressPct}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${progressPct}%`,
                                                    backgroundColor: progressPct === 100 ? '#22c55e' : '#3b82f6',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isLocked && (
                                    <div className="flex items-center text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <span>{t('dashboard.launch_btn')}</span>
                                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Link>
                          </div>
                       );
                    })}
                 </div>
              </section>
            ))}
          </div>

          <footer className="pt-20 border-t border-slate-200 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">
              {t('dashboard.footer', { year: new Date().getFullYear() })}
          </footer>

      </div>
      <SystemMessages />
    </div>
  );
}