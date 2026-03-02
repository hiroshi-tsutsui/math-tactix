// @ts-nocheck
"use client";

import Link from 'next/link';
import { useProgress, ModuleId } from './contexts/ProgressContext';
import { useLanguage } from './contexts/LanguageContext';
import { GeistSans } from 'geist/font/sans';
import { ArrowRight, Lock } from 'lucide-react';
import SystemMessages from './components/SystemMessages';

export default function Home() {
  const { moduleProgress, calibration } = useProgress();
  const { t } = useLanguage();

  const modules = [
    // --- Junior High ---
    {
      id: 'algebraic-logic',
      title: '数と式の論理',
      subtitle: 'Algebraic Logic',
      desc: '正負の数から方程式、因数分解まで。論理の「読み書き」を習得します。',
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'functional-dynamics-jh',
      title: '関数と変化の法則',
      subtitle: 'Functional Dynamics',
      desc: '比例・反比例、一次関数。事象の変化を数式で記述する基礎を学びます。',
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'geometric-space',
      title: '図形と空間の構造',
      subtitle: 'Geometric Space',
      desc: '相似、円周角、三平方の定理。空間を論理的に把握する力を養います。',
      status: 'LOCKED',
      color: 'text-slate-400',
    },
    {
      id: 'data-chance-jh',
      title: '確率とデータの分析',
      subtitle: 'Data & Chance',
      desc: 'データの分布と確率の基礎。不確実な世界を数値で捉える第一歩。',
      status: 'LOCKED',
      color: 'text-slate-400',
    },

    // --- High School ---
    {
      id: 'quadratics',
      title: '二次関数',
      subtitle: 'Mathematics I',
      desc: '放物線を設計し、パラメータの最適解を導く。',
      status: 'READY',
      color: 'text-blue-500',
    },
    {
      id: 'data',
      title: 'データの分析',
      subtitle: 'Mathematics I',
      desc: '相関係数(r)を用いて、データの背後にある真実を特定する。',
      status: 'READY',
      color: 'text-teal-400',
    },
    {
      id: 'probability',
      title: '確率',
      subtitle: 'Mathematics A',
      desc: '不確実な事象を計算し、未来の期待値を算出する。',
      status: 'READY',
      color: 'text-orange-400',
    },
    {
      id: 'calculus',
      title: '微分・積分',
      subtitle: 'Mathematics II',
      desc: '瞬間の変化と蓄積の法則を使い、動く世界を掌握する。',
      status: 'READY',
      color: 'text-red-500',
    },
    {
      id: 'sequences',
      title: '数列',
      subtitle: 'Mathematics B',
      desc: 'パターンの連続性を見出し、未来の推移を予測する。',
      status: 'READY',
      color: 'text-cyan-400',
    },
    {
      id: 'logs',
      title: '対数関数',
      subtitle: 'Mathematics II',
      desc: '指数関数的な増殖を、扱いやすいスケールに圧縮する。',
      status: 'READY',
      color: 'text-rose-400',
    },
    {
      id: 'trig',
      title: '三角関数',
      subtitle: 'Mathematics II',
      desc: '円運動と波の性質を同期させ、周期性を解析する。',
      status: 'READY',
      color: 'text-indigo-400',
    },
    {
      id: 'vectors',
      title: 'ベクトル',
      subtitle: 'Mathematics C',
      desc: '多次元空間を定義する「向き」と「大きさ」を操る。',
      status: 'READY',
      color: 'text-purple-400',
    },
    {
      id: 'complex',
      title: '複素数平面',
      subtitle: 'Mathematics C',
      desc: '虚数の回転を用いて、新たな次元を可視化する。',
      status: 'READY',
      color: 'text-pink-400',
    },
    {
      id: 'matrices',
      title: '行列',
      subtitle: 'Mathematics C',
      desc: '空間を自在に変形させる線形変換の仕組みを学ぶ。',
      status: 'READY',
      color: 'text-emerald-400',
    },
    {
      id: 'functions',
      title: '関数と極限',
      subtitle: 'Mathematics III',
      desc: '入出力の論理を極め、ブラックボックスを完全に解明する。',
      status: 'READY',
      color: 'text-amber-400',
    },
    {
      id: 'quiz',
      title: '実力判定テスト',
      subtitle: 'Assessment',
      desc: '現在の理解度を測定し、学習プランを最適化します。',
      status: 'READY',
      color: 'text-red-500',
    }
  ];

  const sections = [
    {
      name: "準備: 実力判定",
      desc: "現在のあなたの数学的OSのバージョンを確認します。",
      ids: ['quiz']
    },
    {
      name: "中学数学：思考の土台 (Junior High)",
      desc: "高校数学へと繋がる、論理的思考と空間把握の基礎を固めます。",
      ids: ['algebraic-logic', 'functional-dynamics-jh', 'geometric-space', 'data-chance-jh']
    },
    {
      name: "高校数学：数学 I・A",
      desc: "現代社会のデータサイエンスや設計に直結する基本ツール。",
      ids: ['quadratics', 'data', 'probability']
    },
    {
      name: "高校数学：数学 II・B",
      desc: "現象の推移やエネルギーの集積を扱う、高度な解析ツール。",
      ids: ['calculus', 'sequences', 'logs', 'trig']
    },
    {
      name: "高校数学：数学 III・C",
      desc: "空間・次元・極限を操り、世界の真理に迫る究極のOS。",
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
                  Math-Tactix
               </h1>
               <p className="text-lg text-slate-500 font-bold">次世代の数学学習 OS</p>
            </div>

            <div className="w-full md:w-80 bg-white border border-slate-200 p-8 shadow-2xl rounded-[32px]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Current Rank</div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{rank}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">{syncRate}%</div>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${syncRate}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/profile" className="text-[11px] font-black py-3 px-4 bg-slate-900 text-white rounded-2xl text-center hover:bg-blue-600 transition-all">
                        プロフ
                    </Link>
                    <Link href="/settings" className="text-[11px] font-black py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl text-center hover:bg-slate-200 transition-all">
                        設定
                    </Link>
                </div>
            </div>
          </div>

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
                                    完了
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute top-6 right-6 bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> 開発中
                                    </div>
                                )}

                                <div className={`text-[11px] font-black tracking-widest mb-4 uppercase ${isLocked ? 'text-slate-300' : 'text-blue-600'}`}>
                                    {m.subtitle}
                                </div>
                                
                                <h2 className={`text-2xl font-black mb-4 tracking-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                    {m.title}
                                </h2>
                                
                                <p className={`text-sm leading-relaxed mb-10 font-medium ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {m.desc}
                                </p>

                                {!isLocked && (
                                    <div className="flex items-center text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <span>モジュールを起動</span>
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
              Math-Tactix — {new Date().getFullYear()} — Mathematical OS
          </footer>

      </div>
      <SystemMessages />
    </div>
  );
}
