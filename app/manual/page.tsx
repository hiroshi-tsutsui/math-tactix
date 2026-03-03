// @ts-nocheck
"use client";

import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Compass, Award, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function ManualPage() {
  const { t } = useLanguage();
  const [section, setSection] = useState<'BASIC' | 'MODULES' | 'GLOSSARY' | 'RANKS'>('BASIC');

  const CONTENT = {
    BASIC: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            {t('manual.sections.basic.title')}
        </h2>
        
        <div className="grid gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.basic.mastery.title')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {t('manual.sections.basic.mastery.desc')}
                </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.basic.score.title')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {t('manual.sections.basic.score.desc')}
                </p>
            </div>
        </div>
      </div>
    ),
    MODULES: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            {t('manual.sections.modules.title')}
        </h2>
        
        <div className="space-y-6">
            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Compass className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {t('manual.sections.modules.vis.title')}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {t('manual.sections.modules.vis.desc')}
                    </p>
                </div>
            </div>

            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Terminal className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {t('manual.sections.modules.logic.title')}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {t('manual.sections.modules.logic.desc')}
                    </p>
                </div>
            </div>
        </div>
      </div>
    ),
    GLOSSARY: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            {t('manual.sections.glossary.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                ['correlation', 'manual.sections.glossary.terms.correlation'],
                ['diff', 'manual.sections.glossary.terms.diff'],
                ['int', 'manual.sections.glossary.terms.int'],
                ['vec', 'manual.sections.glossary.terms.vec'],
                ['exp', 'manual.sections.glossary.terms.exp'],
                ['complex', 'manual.sections.glossary.terms.complex'],
            ].map(([key, prefix]) => (
                <div key={key} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-widest">
                        {t(`${prefix}.term`)}
                    </h4>
                    <p className="text-xs text-slate-500 leading-snug">
                        {t(`${prefix}.def`)}
                    </p>
                </div>
            ))}
        </div>
      </div>
    ),
    RANKS: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            {t('manual.sections.ranks.title')}
        </h2>
        
        <div className="space-y-4">
            {[
                ['omega', 'bg-slate-900 text-white'],
                ['architect', 'bg-blue-600 text-white'],
                ['operator', 'bg-slate-200 text-slate-700'],
                ['learner', 'bg-slate-100 text-slate-400'],
            ].map(([rankKey, style]) => (
                <div key={rankKey} className="flex items-center gap-6 p-4 border border-slate-100 rounded-2xl">
                    <div className={`w-24 text-center py-2 rounded-lg text-[10px] font-black tracking-widest ${style}`}>
                        {t(`manual.sections.ranks.list.${rankKey}.name`)}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        {t(`manual.sections.ranks.list.${rankKey}.desc`)}
                    </p>
                </div>
            ))}
        </div>
      </div>
    )
  };

  const navItems = [
    { id: 'BASIC', label: t('manual.nav.basic'), icon: BookOpen },
    { id: 'MODULES', label: t('manual.nav.modules'), icon: Compass },
    { id: 'GLOSSARY', label: t('manual.nav.glossary'), icon: Terminal },
    { id: 'RANKS', label: t('manual.nav.ranks'), icon: Award },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('manual.back')}
          </Link>
          <span className="text-sm font-bold">{t('manual.title')}</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Nav */}
            <aside className="lg:col-span-3">
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                ${section === item.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                                }
                            `}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <div className="lg:col-span-9 bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {CONTENT[section]}
                  </motion.div>
                </AnimatePresence>
            </div>

        </div>
      </main>
    </div>
  );
}
