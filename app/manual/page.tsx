// @ts-nocheck
"use client";

import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Compass, Award, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManualPage() {
  const [section, setSection] = useState<'BASIC' | 'MODULES' | 'GLOSSARY' | 'RANKS'>('BASIC');

  const CONTENT = {
    BASIC: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">基本操作</h2>
        
        <div className="grid gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">習得率 (Mastery)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    全単元のクリア状況をパーセンテージで表示します。すべての単元で3つのステージをクリアすることで、習得率100%（OMEGAランク）を目指しましょう。
                </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">実力判定スコア</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    初期テストの結果に基づいた数学的なベースラインです。各単元を学習することで、この精度をさらに高めていくことができます。
                </p>
            </div>
        </div>
      </div>
    ),
    MODULES: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">学習の形式</h2>
        
        <div className="space-y-6">
            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Compass className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">可視化ミッション</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        ベクトルやデータ解析など、グラフや図形を直接操作して目標を達成する形式です。「感覚」と「理論」の結びつきを重視します。
                    </p>
                </div>
            </div>

            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Terminal className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">論理特定ミッション</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        ブラックボックスに入力を与え、出力の変化から背後にある「関数（ルール）」を推測する形式です。プログラミングやAI学習に近い思考を養います。
                    </p>
                </div>
            </div>
        </div>
      </div>
    ),
    GLOSSARY: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">用語集</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                ['相関', '2つの数値データの間の関係性。'],
                ['微分', 'ある瞬間の変化の勢いやグラフの傾き。'],
                ['積分', '細かい変化を積み重ねた合計量や面積。'],
                ['ベクトル', '向きと大きさを持つ量。'],
                ['指数', '雪だるま式に増えていく計算の仕組み。'],
                ['複素数', '平面上の回転を記述できる高度な数。'],
            ].map(([term, def]) => (
                <div key={term} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-widest">{term}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{def}</p>
                </div>
            ))}
        </div>
      </div>
    ),
    RANKS: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">階級システム</h2>
        
        <div className="space-y-4">
            {[
                ['OMEGA', '習得率100%。すべての概念を掌握した者。', 'bg-slate-900 text-white'],
                ['ARCHITECT', '習得率80%以上。高度な設計が可能なレベル。', 'bg-blue-600 text-white'],
                ['OPERATOR', '習得率50%以上。数学を道具として扱えるレベル。', 'bg-slate-200 text-slate-700'],
                ['LEARNER', '習得率0%〜。基礎を構築中の学習者。', 'bg-slate-100 text-slate-400'],
            ].map(([rank, desc, style], i) => (
                <div key={rank} className="flex items-center gap-6 p-4 border border-slate-100 rounded-2xl">
                    <div className={`w-24 text-center py-2 rounded-lg text-[10px] font-black tracking-widest ${style}`}>
                        {rank}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{desc}</p>
                </div>
            ))}
        </div>
      </div>
    )
  };

  const navItems = [
    { id: 'BASIC', label: '基本操作', icon: BookOpen },
    { id: 'MODULES', label: '学習形式', icon: Compass },
    { id: 'GLOSSARY', label: '用語集', icon: Terminal },
    { id: 'RANKS', label: '階級', icon: Award },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <span className="text-sm font-bold">説明書 / マニュアル</span>
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
