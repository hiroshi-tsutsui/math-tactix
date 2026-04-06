"use client";

import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Compass, Award, Terminal, HelpCircle, Map, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function ManualPage() {
  const { t } = useLanguage();
  const [section, setSection] = useState<'BASIC' | 'GUIDE' | 'MODULES' | 'GLOSSARY' | 'RANKS' | 'PATH' | 'DIFFICULTY'>('BASIC');

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
    GUIDE: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
            {t('manual.sections.guide.title')}
        </h2>

        <div className="grid gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.guide.what.title')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {t('manual.sections.guide.what.desc')}
                </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.guide.modules_overview.title')}
                </h3>
                <ul className="space-y-2 text-sm text-slate-500 leading-relaxed">
                    <li>{t('manual.sections.guide.modules_overview.quadratics')}</li>
                    <li>{t('manual.sections.guide.modules_overview.data')}</li>
                    <li>{t('manual.sections.guide.modules_overview.probability')}</li>
                    <li>{t('manual.sections.guide.modules_overview.sets_logic')}</li>
                    <li>{t('manual.sections.guide.modules_overview.math_i_numbers')}</li>
                    <li>{t('manual.sections.guide.modules_overview.trig')}</li>
                    <li>{t('manual.sections.guide.modules_overview.calculus')}</li>
                    <li>{t('manual.sections.guide.modules_overview.others')}</li>
                </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.guide.gamification.title')}
                </h3>
                <ul className="space-y-2 text-sm text-slate-500 leading-relaxed">
                    <li>{t('manual.sections.guide.gamification.rank')}</li>
                    <li>{t('manual.sections.guide.gamification.xp')}</li>
                    <li>{t('manual.sections.guide.gamification.omega')}</li>
                </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">
                    {t('manual.sections.guide.recommended.title')}
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                    {t('manual.sections.guide.recommended.desc')}
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
    ),
    PATH: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
          推奨学習パス（数学I 標準コース）
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          以下の順序で学習を進めることを推奨します。各モジュールの基礎レベルをクリアしてから次のモジュールへ進むと、効率的に理解が深まります。
        </p>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: '数と式',
              module: 'math_i_numbers',
              levels: 'Level 1-51',
              desc: '展開・因数分解・方程式・不等式・分数式・有理化・二重根号・余りの定理',
              color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
              iconColor: 'bg-indigo-500',
            },
            {
              step: 2,
              title: '集合と論理',
              module: 'sets_logic',
              levels: 'Level 1-16',
              desc: '集合の演算・命題・条件・背理法',
              color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
              iconColor: 'bg-emerald-500',
            },
            {
              step: 3,
              title: '二次関数',
              module: 'quadratics',
              levels: 'Level 1-71',
              desc: 'グラフ・最大最小・解の配置・不等式',
              color: 'bg-blue-50 border-blue-200 text-blue-700',
              iconColor: 'bg-blue-500',
            },
            {
              step: 4,
              title: '図形と計量',
              module: 'trig + trig_ratios',
              levels: 'Level 1-18',
              desc: '三角比・正弦定理・余弦定理・三角不等式',
              color: 'bg-amber-50 border-amber-200 text-amber-700',
              iconColor: 'bg-amber-500',
            },
            {
              step: 5,
              title: 'データの分析',
              module: 'data',
              levels: 'Level 1-17',
              desc: '平均・分散・相関係数・回帰',
              color: 'bg-rose-50 border-rose-200 text-rose-700',
              iconColor: 'bg-rose-500',
            },
            {
              step: 6,
              title: '確率',
              module: 'probability',
              levels: 'Level 1-18',
              desc: '場合の数・確率・条件付き確率・ベイズ',
              color: 'bg-violet-50 border-violet-200 text-violet-700',
              iconColor: 'bg-violet-500',
            },
          ].map((item) => (
            <div key={item.step} className={`flex items-start gap-4 p-5 rounded-2xl border ${item.color}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black ${item.iconColor}`}>
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <span className="text-xs font-medium opacity-70">({item.module})</span>
                </div>
                <p className="text-xs opacity-80 mb-1">{item.levels}</p>
                <p className="text-xs opacity-70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-700 leading-relaxed">
            <strong>Tip:</strong> 各モジュールの「入門」レベルだけを先に全モジュール通してから、「基礎」「標準」と段階を上げていく方法も有効です。
          </p>
        </div>
      </div>
    ),
    DIFFICULTY: (
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
          各モジュールの難易度目安
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          各モジュールのレベル帯ごとの難易度区分です。自分の理解度に合わせて適切なレベルから始めましょう。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 bg-slate-100 rounded-tl-xl text-xs font-bold text-slate-600 uppercase tracking-wider">モジュール</th>
                <th className="text-center px-4 py-3 bg-green-50 text-xs font-bold text-green-700 uppercase tracking-wider">入門</th>
                <th className="text-center px-4 py-3 bg-blue-50 text-xs font-bold text-blue-700 uppercase tracking-wider">基礎</th>
                <th className="text-center px-4 py-3 bg-amber-50 text-xs font-bold text-amber-700 uppercase tracking-wider">標準</th>
                <th className="text-center px-4 py-3 bg-red-50 rounded-tr-xl text-xs font-bold text-red-700 uppercase tracking-wider">応用</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '数と式', levels: ['1-10', '11-30', '31-45', '46-51+'] },
                { name: '集合と論理', levels: ['1-5', '6-10', '11-14', '15-16+'] },
                { name: '二次関数', levels: ['1-20', '21-50', '51-65', '66-71+'] },
                { name: '図形と計量', levels: ['1-5', '6-11', '12-15', '16-18+'] },
                { name: 'データの分析', levels: ['1-5', '6-10', '11-14', '15-17+'] },
                { name: '確率', levels: ['1-5', '6-11', '12-15', '16-18+'] },
              ].map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{row.levels[0]}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{row.levels[1]}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{row.levels[2]}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{row.levels[3]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
            <div className="text-xs font-bold text-green-700 mb-1">入門</div>
            <p className="text-[10px] text-green-600">基本概念の理解</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            <div className="text-xs font-bold text-blue-700 mb-1">基礎</div>
            <p className="text-[10px] text-blue-600">定番パターンの演習</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
            <div className="text-xs font-bold text-amber-700 mb-1">標準</div>
            <p className="text-[10px] text-amber-600">入試基礎レベル</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
            <div className="text-xs font-bold text-red-700 mb-1">応用</div>
            <p className="text-[10px] text-red-600">入試標準〜発展</p>
          </div>
        </div>
      </div>
    )
  };

  const navItems = [
    { id: 'BASIC', label: t('manual.nav.basic'), icon: BookOpen },
    { id: 'GUIDE', label: t('manual.nav.guide'), icon: HelpCircle },
    { id: 'MODULES', label: t('manual.nav.modules'), icon: Compass },
    { id: 'GLOSSARY', label: t('manual.nav.glossary'), icon: Terminal },
    { id: 'RANKS', label: t('manual.nav.ranks'), icon: Award },
    { id: 'PATH', label: '学習パス', icon: Map },
    { id: 'DIFFICULTY', label: '難易度表', icon: BarChart3 },
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
                            onClick={() => setSection(item.id as typeof section)}
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
