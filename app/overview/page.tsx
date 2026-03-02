// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Binary, Globe, GraduationCap } from 'lucide-react';

export default function OverviewPage() {
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
                  <span className="text-sm font-black tracking-widest uppercase">Project Omega Vision</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]">
                  数学は、「お勉強」<br/>ではない。
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                  世界を記述する唯一の言語であり、<br/>未来をハックするための最強の武器だ。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { icon: Binary, title: "論理の構築", desc: "単なる計算ではなく、事象の背後にあるルールを見つけ出し、論理を組み立てる力を養います。" },
                   { icon: Globe, title: "現実との接続", desc: "教科書の中だけで完結せず、AI開発や金融、物理シミュレーションなど、実社会での数学の使い道を提示します。" },
                   { icon: GraduationCap, title: "プロツールの視点", desc: "「正解」を出すだけの学習から卒業し、数学を自らのアイデアを形にするための「道具」として扱います。" }
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
                   メインメニューへ <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link href="/quiz" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                   実力判定テストを受ける
                 </Link>
              </div>
            </div>

            <footer className="pt-24 text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">
              Project Omega // Mathematical OS v2.7.0
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

    </div>
  );
}
