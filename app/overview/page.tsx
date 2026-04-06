"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Binary, Globe, GraduationCap } from 'lucide-react';

export default function OverviewPage() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'LOADING' | 'CONTENT'>('LOADING');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('CONTENT'), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${GeistSans.className} overflow-hidden`}>
      
      <AnimatePresence mode="wait">
        {phase === 'LOADING' ? (
          <motion.div 
            key="loader"
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-[100]"
          >
             <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-blue-600 w-full"
                />
             </div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-24 min-h-screen flex flex-col"
          >
            <div className="flex-1 space-y-16">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-black tracking-widest uppercase">{t('overview.vision')}</span>
                </div>
                <h1 
                  className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]"
                  dangerouslySetInnerHTML={{ __html: t('overview.headline') }}
                />
                <p 
                  className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: t('overview.subheadline') }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { icon: Binary, title: t('overview.features.logic.title'), desc: t('overview.features.logic.desc') },
                   { icon: Globe, title: t('overview.features.reality.title'), desc: t('overview.features.reality.desc') },
                   { icon: GraduationCap, title: t('overview.features.tool.title'), desc: t('overview.features.tool.desc') }
                 ].map((item, i) => (
                   <div key={i} className="space-y-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 ))}
              </div>

              <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                 <Link href="/" className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 group">
                   {t('overview.main_menu')} <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link href="/quiz" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                   {t('overview.take_test')}
                 </Link>
              </div>
            </div>

            <footer className="pt-24 text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">
              {t('overview.footer')}
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

    </div>
  );
}
