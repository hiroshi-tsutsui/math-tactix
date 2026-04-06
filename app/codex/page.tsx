"use client";

import Link from 'next/link';
import { useProgress, ModuleId } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, Book, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodexPage() {
  const { moduleProgress } = useProgress();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('omega_codex_revealed');
    if (stored) setRevealed(JSON.parse(stored));
  }, []);

  const handleReveal = (id: string) => {
    setRevealing(id);
    setTimeout(() => {
        setRevealing(null);
        setRevealed(prev => {
            const next = { ...prev, [id]: true };
            localStorage.setItem('omega_codex_revealed', JSON.stringify(next));
            return next;
        });
    }, 1000);
  };

  const insights = [
    {
      id: 'genesis',
      title: t('codex.insights.genesis.title'),
      moduleId: null,
      content: t('codex.insights.genesis.content'),
    },
    {
      id: 'quadratics',
      title: t('codex.insights.quadratics.title'),
      moduleId: 'quadratics',
      content: t('codex.insights.quadratics.content'),
    },
    {
      id: 'trig',
      title: t('codex.insights.trig.title'),
      moduleId: 'trig',
      content: t('codex.insights.trig.content'),
    },
    {
      id: 'vectors',
      title: t('codex.insights.vectors.title'),
      moduleId: 'vectors',
      content: t('codex.insights.vectors.content'),
    },
    {
      id: 'data',
      title: t('codex.insights.data.title'),
      moduleId: 'data',
      content: t('codex.insights.data.content'),
    },
    {
      id: 'calculus',
      title: t('codex.insights.calculus.title'),
      moduleId: 'calculus',
      content: t('codex.insights.calculus.content'),
    },
  ];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('codex.back')}
          </Link>
          <span className="text-sm font-bold">{t('codex.title')}</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <header className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{t('codex.header_title')}</h1>
            <p className="text-slate-500 font-medium">{t('codex.header_desc')}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-24">
            {insights.map((item) => {
                const isMastered = item.moduleId === null || (moduleProgress[item.moduleId as ModuleId]?.isMastered);
                const isRevealed = revealed[item.id];
                const isRevealing = revealing === item.id;
                
                return (
                    <div 
                        key={item.id} 
                        className={`relative border p-8 rounded-[32px] transition-all duration-300 bg-white shadow-sm
                            ${isRevealed ? 'border-slate-200' : 'border-slate-100'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                {isRevealed ? (
                                  <Unlock className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-300" />
                                )}
                                <h2 className={`text-xl font-bold tracking-tight ${isRevealed ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {item.title}
                                </h2>
                            </div>
                        </div>
                        
                        <div className="relative">
                            {isRevealed ? (
                                <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-slate-600 leading-relaxed font-medium"
                                >
                                  {item.content}
                                </motion.p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                                    <div className="h-4 bg-slate-50 rounded-full w-2/3"></div>
                                    
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {isMastered ? (
                                            <button 
                                                onClick={() => handleReveal(item.id)}
                                                disabled={isRevealing}
                                                className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all disabled:opacity-50"
                                            >
                                                {isRevealing ? t('codex.revealing_btn') : t('codex.reveal_btn')}
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                                                  {t('codex.locked')}
                                              </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        <footer className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            {t('codex.footer')}
        </footer>
      </main>
    </div>
  );
}
