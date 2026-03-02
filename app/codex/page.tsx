// @ts-nocheck
"use client";

import Link from 'next/link';
import { useProgress, ModuleId } from '../contexts/ProgressContext';
import { useState, useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, Book, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodexPage() {
  const { moduleProgress } = useProgress();
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
      title: 'はじめに：数学という言語',
      moduleId: null,
      content: "数学は、単なる計算の道具ではありません。この世界の仕組みを記述するための唯一の共通言語です。事象の背後にあるルールを理解することで、私たちは初めて現実をコントロールする力を手にします。",
    },
    {
      id: 'quadratics',
      title: '二次関数：放物線と最適化',
      moduleId: 'quadratics',
      content: "二次関数の描く放物線は、自然界の至る所に存在します。ボールの軌道から、衛星アンテナの形状まで。頂点を見出すことは、現実社会における「最適解」を見つけ出すプロセスそのものです。",
    },
    {
      id: 'trig',
      title: '三角関数：リズムと周期性',
      moduleId: 'trig',
      content: "宇宙のあらゆるものは振動しています。音、光、心拍。これらすべての周期性を記述するのがサイン波です。三角関数を学ぶことは、宇宙の鼓動を読み解くことに他なりません。",
    },
    {
      id: 'vectors',
      title: 'ベクトル：方向と力の掌握',
      moduleId: 'vectors',
      content: "位置は相対的なものですが、方向と大きさは絶対的な情報です。ベクトルをマスターすることで、多次元空間における物体の動きや、複雑に絡み合う力の関係を整理し、一意に決定できるようになります。",
    },
    {
      id: 'data',
      title: 'データ解析：混沌の中の秩序',
      moduleId: 'data',
      content: "世界は情報のノイズで溢れています。相関係数は、その混沌の中から意味のある「真実」を抽出するためのコンパスです。データ間の真の繋がりを見抜くことが、予測の第一歩となります。",
    },
    {
      id: 'calculus',
      title: '微分積分：変化と集積の科学',
      moduleId: 'calculus',
      content: "静止した瞬間は存在しません。微分は「今、この瞬間」の変化を捉え、積分は「過去からの積み重ね」を定量化します。動き続ける世界のすべては、微積分というレンズを通して記述されます。",
    },
  ];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <span className="text-sm font-bold">数学の記録 / アーカイブ</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <header className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Mathematical Insights</h1>
            <p className="text-slate-500 font-medium">各単元を修了することで解放される、数学の本質的な解説です。</p>
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
                                                {isRevealing ? '読み込み中...' : '記録を閲覧する'}
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                                                  単元の修了が必要です
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
            Project Omega — Knowledge Repository v2.7.0
        </footer>
      </main>
    </div>
  );
}
