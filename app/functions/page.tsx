"use client";

import { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { Play, CheckCircle2, AlertCircle, ChevronRight, Activity, Cpu, Info, BookOpen, Gamepad2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const VizSkeleton = () => <div className="animate-pulse bg-slate-100 rounded-2xl h-64" />;

const LinearFunctionViz = dynamic(() => import('./components/LinearFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const RationalFunctionViz = dynamic(() => import('./components/RationalFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const RadicalFunctionViz = dynamic(() => import('./components/RadicalFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const AbsoluteValueFunctionViz = dynamic(() => import('./components/AbsoluteValueFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const FunctionTransformViz = dynamic(() => import('./components/FunctionTransformViz'), { ssr: false, loading: () => <VizSkeleton /> });
const FunctionSymmetryViz = dynamic(() => import('./components/FunctionSymmetryViz'), { ssr: false, loading: () => <VizSkeleton /> });
const CompositeFunctionViz = dynamic(() => import('./components/CompositeFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const InverseFunctionViz = dynamic(() => import('./components/InverseFunctionViz'), { ssr: false, loading: () => <VizSkeleton /> });
const DomainRangeViz = dynamic(() => import('./components/DomainRangeViz'), { ssr: false, loading: () => <VizSkeleton /> });
const FunctionQuizViz = dynamic(() => import('./components/FunctionQuizViz'), { ssr: false, loading: () => <VizSkeleton /> });

interface VizLevel {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType;
}

const VIZ_LEVELS: VizLevel[] = [
  { id: 6, title: "1次関数", description: "y = ax + b の傾きと切片をスライダーで操作", component: LinearFunctionViz },
  { id: 7, title: "分数関数", description: "y = k/(x-h) + v の漸近線と形状を探る", component: RationalFunctionViz },
  { id: 8, title: "無理関数", description: "y = a\u221A(x-h) + v の定義域の可視化", component: RadicalFunctionViz },
  { id: 9, title: "絶対値関数", description: "y = a|x-h| + v の折れ線グラフを探る", component: AbsoluteValueFunctionViz },
  { id: 10, title: "グラフ変換", description: "平行移動・反転による関数のグラフ変換", component: FunctionTransformViz },
  { id: 11, title: "偶関数と奇関数", description: "y軸対称・原点対称の対称性を調べる", component: FunctionSymmetryViz },
  { id: 12, title: "合成関数", description: "f(g(x)) のステップを可視化する", component: CompositeFunctionViz },
  { id: 13, title: "逆関数", description: "f\u207B\u00B9(x) と y = x に関する対称性", component: InverseFunctionViz },
  { id: 14, title: "定義域と値域", description: "さまざまな関数の定義域・値域を確認", component: DomainRangeViz },
  { id: 15, title: "関数クイズ", description: "ランダム問題で関数の理解をテスト", component: FunctionQuizViz },
];

const LEVELS = [
  { id: 1, func: "x + 2", name: "基本的な加法", hint: "入力された値に、常に一定の数が足されています。" },
  { id: 2, func: "2*x - 1", name: "線形変化", hint: "入力が2倍になり、そこから1引かれています。" },
  { id: 3, func: "x^2", name: "二次の広がり", hint: "入力が自分自身と掛け合わされています（2乗）。" },
  { id: 4, func: "abs(x)", name: "絶対値の論理", hint: "マイナスの値がプラスに変換されています。" },
  { id: 5, func: "2^x", name: "指数関数的な増殖", hint: "2を「入力された数」の分だけ掛け合わせています。" },
];

const MODULE_ID = 'functions';

type PageTab = 'blackbox' | 'explore';

export default function FunctionsPage() {
  const { completeLevel } = useProgress();
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [pageTab, setPageTab] = useState<PageTab>('blackbox');
  const [vizLevelIdx, setVizLevelIdx] = useState(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [userFunc, setUserFunc] = useState("");
  const [testInput, setTestInput] = useState(1);
  const [history, setHistory] = useState<{in: number, out: number}[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'COMPUTING' | 'SYNCED' | 'ERROR'>('IDLE');
  const [log, setLog] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  // Using t() to get level data dynamically based on current language
  const getCurrentLevelData = (idx: number) => {
    // We use the index (1-based for locale keys) to fetch the localized name/hint
    const levelKey = (idx + 1).toString();
    // Fallback or type safety could be improved, but assuming structure matches
    return {
      id: LEVELS[idx].id,
      func: LEVELS[idx].func,
      name: t(`modules.functions.levels.${levelKey}.name`),
      hint: t(`modules.functions.levels.${levelKey}.hint`)
    };
  };

  const currentTarget = getCurrentLevelData(levelIdx);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    addLog(`${currentTarget.name} ${t('modules.functions.status.idle')}`); 
  }, [levelIdx, t]); // Added t dependency to refresh on language change

  const injectSignal = () => {
    setStatus('COMPUTING');
    setTimeout(() => {
      try {
        const out = math.evaluate(currentTarget.func, { x: testInput });
        setHistory(prev => [...prev, { in: testInput, out }]);
        setStatus('IDLE');
        addLog(`${t('modules.functions.ui.input_signal')}: ${testInput} → ${t('modules.functions.ui.output_signal')}: ${out}`);
      } catch (e) {
        setStatus('ERROR');
        addLog(t('modules.functions.status.error'));
      }
    }, 400);
  };

  const verifyFunction = () => {
    try {
      addLog(t('modules.functions.ui.computing'));
      const testValues = [-5, -2, 0, 1, 2, 5, 10];
      let correct = true;
      for (const x of testValues) {
        const targetY = math.evaluate(currentTarget.func, { x });
        const userY = math.evaluate(userFunc, { x });
        if (Math.abs(targetY - userY) > 0.01) {
            correct = false;
            break;
        }
      }
      
      if (correct) {
        setStatus('SYNCED');
        addLog(t('modules.functions.status.synced'));
        completeLevel(MODULE_ID, levelIdx + 1);
        
        if (levelIdx === 0) {
            unlockBadge('function_novice');
        }
        if (levelIdx === LEVELS.length - 1) {
            unlockBadge('causality_master');
        }

        setShowComplete(true);
      } else {
        setStatus('ERROR');
        addLog(t('modules.functions.status.error'));
      }
    } catch (e) {
      setStatus('ERROR');
      addLog(t('modules.functions.status.error'));
    }
  };

  const handleNextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
      setHistory([]);
      setUserFunc("");
      setStatus('IDLE');
      setShowComplete(false);
    } else {
      window.location.href = "/";
    }
  };

  const currentVizLevel = VIZ_LEVELS[vizLevelIdx];
  const VizComponent = currentVizLevel?.component;

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${GeistSans.className}`}>

      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <BackButton href="/" label={t('common.back_root')} />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('common.protocol')}</span>
              <span className="text-sm font-bold text-slate-900">{t('modules.functions.title')}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            {/* Tab Buttons */}
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setPageTab('blackbox')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${pageTab === 'blackbox' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                Black Box
              </button>
              <button
                onClick={() => setPageTab('explore')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${pageTab === 'explore' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Explore
              </button>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {pageTab === 'blackbox'
                ? `${t('common.level')} ${levelIdx + 1} / ${LEVELS.length}`
                : `${t('common.level')} ${currentVizLevel.id} / ${LEVELS.length + VIZ_LEVELS.length}`
              }
            </div>
          </div>
        </div>
      </nav>

      {/* === BLACK BOX MODE === */}
      {pageTab === 'blackbox' && (
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: The Logic Machine */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="font-bold flex items-center gap-2 text-slate-800">
                <Cpu className="w-4 h-4 text-blue-600" />
                {t('modules.functions.ui.black_box')}
              </h2>
              {status === 'COMPUTING' && (
                <span className="text-[10px] font-bold text-blue-600 animate-pulse uppercase tracking-widest">{t('modules.functions.status.computing')}...</span>
              )}
            </div>

            <div className="p-12 flex flex-col items-center gap-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 z-10">
                    {/* Input */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('modules.functions.ui.input_signal')}</span>
                        <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center relative group">
                            <input
                                type="number"
                                className="w-full text-center text-3xl font-bold bg-transparent focus:outline-none"
                                value={testInput}
                                onChange={(e) => setTestInput(Number(e.target.value))}
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded whitespace-nowrap">{t('modules.functions.ui.inject_signal')}</span>
                            </div>
                        </div>
                        <button
                            onClick={injectSignal}
                            disabled={status === 'COMPUTING'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 disabled:opacity-50"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            {t('common.op')}
                        </button>
                    </div>

                    {/* The Box */}
                    <div className="relative">
                        <motion.div
                            animate={status === 'COMPUTING' ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
                            className="w-40 h-40 bg-slate-900 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative z-20"
                        >
                            <span className="text-4xl font-bold text-white italic">f(x)</span>
                            <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/20 animate-pulse"></div>
                        </motion.div>
                        {/* Connection Lines (Visual only) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-20 h-px bg-slate-200 -translate-x-full -translate-y-1/2"></div>
                        <div className="hidden md:block absolute top-1/2 right-0 w-20 h-px bg-slate-200 translate-x-full -translate-y-1/2"></div>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('modules.functions.ui.output_signal')}</span>
                        <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                           <span className={`text-3xl font-bold ${status === 'COMPUTING' ? 'text-blue-200 animate-pulse' : 'text-blue-600'}`}>
                             {status === 'COMPUTING' ? '...' : history.length > 0 ? history[history.length-1].out : '-'}
                           </span>
                        </div>
                        <div className="h-8"></div>
                    </div>
                </div>

                {/* Hint Bar */}
                <div className="w-full max-w-md bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4 items-start">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{t('modules.functions.ui.system_advisory')}</p>
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">{currentTarget.hint}</p>
                    </div>
                </div>
            </div>

            {/* Achievement Overlay */}
            <AnimatePresence>
                {showComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('modules.functions.status.synced')}!</h3>
                            <p className="text-sm text-slate-500 mb-6">{t('modules.functions.ui.system_stabilized')}</p>
                            <button
                                onClick={handleNextLevel}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {levelIdx < LEVELS.length - 1 ? t('common.next') : t('common.root')} <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('modules.functions.ui.kernel_log')}</span>
              <button onClick={() => setHistory([])} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest">Clear</button>
            </div>
            <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-100">
                            <th className="px-6 py-2 font-bold text-center">{t('modules.functions.ui.input_signal')}</th>
                            <th className="px-6 py-2 font-bold text-center">{t('modules.functions.ui.output_signal')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-mono">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-slate-300 italic text-xs">{t('modules.functions.status.idle')}</td>
                            </tr>
                        ) : (
                            history.map((h, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-2 text-center text-slate-500">{h.in}</td>
                                    <td className="px-6 py-2 text-center text-blue-600 font-bold">{h.out}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Terminal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
             <div className="flex items-center gap-2 mb-6">
               <Activity className="w-4 h-4 text-blue-400" />
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Logic Terminal</span>
             </div>

             <div className="space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t('modules.functions.ui.define_logic')}</h3>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl focus-within:border-blue-500 transition-colors">
                        <span className="text-2xl font-serif italic text-slate-400">f(x) =</span>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-2xl font-bold text-white focus:outline-none placeholder-white/10"
                            placeholder="x + 1"
                            value={userFunc}
                            onChange={(e) => setUserFunc(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && verifyFunction()}
                        />
                    </div>
                </div>

                <button
                    onClick={verifyFunction}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold tracking-tight transition-all active:scale-[0.98]"
                >
                    {t('modules.functions.ui.execute_patch')}
                </button>

                <div className="pt-6 border-t border-white/5">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{t('common.system_log')}</h3>
                    <div className="space-y-2 font-mono text-[11px]">
                        {log.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                                <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                                <span>{msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
             <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">MATH TACTIX // CORE</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {t('modules.functions.title')} - {t('modules.functions.levels.1.hint')}
                </p>
             </div>
          </div>
        </div>

      </main>
      )}

      {/* === EXPLORE MODE === */}
      {pageTab === 'explore' && (
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Level Selector */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Interactive Visualization</h2>
          <div className="space-y-2">
            {VIZ_LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                onClick={() => setVizLevelIdx(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${vizLevelIdx === idx
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${vizLevelIdx === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {lvl.id}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${vizLevelIdx === idx ? 'text-blue-900' : 'text-slate-800'}`}>{lvl.title}</p>
                    <p className="text-xs text-slate-500">{lvl.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Viz Component */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">{currentVizLevel.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{currentVizLevel.description}</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Level {currentVizLevel.id}
              </span>
            </div>
            <div className="p-6">
              {VizComponent && <VizComponent />}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setVizLevelIdx(Math.max(0, vizLevelIdx - 1))}
              disabled={vizLevelIdx === 0}
              className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => {
                completeLevel(MODULE_ID, currentVizLevel.id);
                setVizLevelIdx(Math.min(VIZ_LEVELS.length - 1, vizLevelIdx + 1));
              }}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              {vizLevelIdx < VIZ_LEVELS.length - 1 ? 'Next' : 'Complete'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      )}
    </div>
  );
}
