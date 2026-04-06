"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, Plus, Trash2, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import VarianceViz from './components/VarianceViz';
import BoxPlotViz from './components/BoxPlotViz';
import HypothesisTestingViz from './components/HypothesisTestingViz';
import FrequencyTableViz from "./components/FrequencyTableViz";
import DataTransformViz from './components/DataTransformViz';
import HistogramBoxPlotViz from './components/HistogramBoxPlotViz';
import CovarianceViz from './components/CovarianceViz';
import OutlierViz from './components/OutlierViz';
import CombinedVarianceViz from './components/CombinedVarianceViz';
import VarianceShortcutViz from './components/VarianceShortcutViz';

// --- Types ---
type Point = { id: number; x: number; y: number };

const MODULE_ID = 'data';

export default function DataPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t, language } = useLanguage();
  const { unlockBadge } = useGamification();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [points, setPoints] = useState<Point[]>([]);
  const [showResiduals, setShowResiduals] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [showUnlock, setShowUnlock] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextId = useRef(0);

  // Dynamic Levels based on Language
  const getLevels = () => [
    { 
      id: 1, 
      targetR: 0.90, 
      name: t('modules.data.levels.1.name'), 
      desc: t('modules.data.levels.1.desc'),
      logStart: t('modules.data.levels.1.log_start'),
      logGuide: t('modules.data.levels.1.log_guide')
    },
    { 
      id: 2, 
      targetR: 0.95, 
      name: t('modules.data.levels.2.name'), 
      desc: t('modules.data.levels.2.desc'),
      logStart: t('modules.data.levels.2.log_start'),
      logGuide: t('modules.data.levels.2.log_guide')
    },
    { 
      id: 3, 
      targetR: 0.99, 
      name: t('modules.data.levels.3.name'), 
      desc: t('modules.data.levels.3.desc'),
      logStart: t('modules.data.levels.3.log_start'),
      logGuide: t('modules.data.levels.3.log_guide')
    },
    {
      id: 4,
      targetR: 0,
      name: '仮説検定の考え方',
      desc: '偶然か意味ある差かを有意水準5%で検定します。',
      logStart: 'シミュレーション開始',
      logGuide: 'コイントスを実行してください。'
    },
    {
      id: 5,
      targetR: 0,
      name: 'データの変換',
      desc: '変量xを y=ax+b で変換したときの平均・分散・標準偏差の変化',
      logStart: '変換シミュレータ起動',
      logGuide: 'aとbを操作してください。'
    },
    {
      id: 6,
      targetR: 0,
      name: '度数分布表と代表値',
      desc: 'ヒストグラムから平均値・中央値の階級・最頻値を読み取る',
      logStart: 'ヒストグラムシミュレータ起動',
      logGuide: '度数をドラッグして代表値の変化を確認してください。'
    },
    {
      id: 7,
      targetR: 0,
      name: '箱ひげ図とヒストグラム',
      desc: 'ヒストグラムの形状と箱ひげ図の対応関係を視覚的に理解する',
      logStart: '分布シミュレータ起動',
      logGuide: '面積と四分位数の関係を確認してください。'
    },
    {
      id: 8,
      targetR: 0,
      name: '共分散と散布図の象限',
      desc: '平均からの偏差の積が作る「符号付き面積」の総和として共分散を視覚的に理解する',
      logStart: '共分散シミュレータ起動',
      logGuide: '点を動かして面積の色（符号）と共分散の値の変化を確認してください。'
    },
    {
      id: 9,
      targetR: 0,
      name: '外れ値と代表値',
      desc: '極端な値（外れ値）が平均値と中央値に与える影響のロバスト性を視覚化する',
      logStart: '代表値シミュレータ起動',
      logGuide: '外れ値を動かして、平均と中央値の変化量の違いを確認してください。'
    },
    {
      id: 10,
      targetR: 0,
      name: '2つの集団の結合と分散',
      desc: '2つの集団を合わせた全体の分散がどのように計算されるか視覚的に理解する',
      logStart: '結合分散シミュレータ起動',
      logGuide: '各集団の人数・平均・分散を調整し、全体分散への影響を確認してください。'
    },
    {
      id: 11,
      targetR: 0,
      name: '分散の計算公式',
      desc: '分散の計算公式 (2乗の平均 - 平均の2乗) を視覚的に理解する',
      logStart: '分散公式シミュレータ起動',
      logGuide: 'データを操作して公式の等式を確認してください。'
    }
  ];

  const levels = getLevels();

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    let nextLvl = 1;
    if (progress.includes(1)) nextLvl = 2;
    if (progress.includes(2)) nextLvl = 3;
    if (progress.includes(3)) nextLvl = 4;
    if (progress.includes(4)) nextLvl = 5;
    if (progress.includes(5)) nextLvl = 6;
    if (progress.includes(6)) nextLvl = 7;
    if (progress.includes(7)) nextLvl = 8;
    if (progress.includes(8)) nextLvl = 9;
    if (progress.includes(9)) nextLvl = 10;
    if (progress.includes(10)) nextLvl = 11;
    setCurrentLevel(nextLvl);
    initLevel(nextLvl);
  }, [moduleProgress, language]); // Re-run on language change

  const initLevel = (lvl: number) => {
    setPoints([]);
    const currentLvlData = getLevels()[lvl-1];
    setLog([currentLvlData.logStart]);
    nextId.current = 0;
    setShowUnlock(false);

    if (lvl === 2) {
       const noisy: Point[] = [];
       for(let i=1; i<=7; i++) {
         noisy.push({ id: nextId.current++, x: i, y: i + (Math.random() * 0.4 - 0.2) });
       }
       noisy.push({ id: nextId.current++, x: 2, y: 8.5 }); // Anomaly
       noisy.push({ id: nextId.current++, x: 8, y: 1.5 }); // Anomaly
       setPoints(noisy);
    }
  };

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const calculateStats = (pts: Point[]) => {
    const n = pts.length;
    if (n < 2) return { r: 0, slope: 0, intercept: 0 };
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    pts.forEach(p => {
      sumX += p.x; sumY += p.y; sumXY += p.x * p.y;
      sumX2 += p.x * p.x; sumY2 += p.y * p.y;
    });
    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r = den === 0 ? 0 : num / den;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { r, slope, intercept };
  };

  const stats = calculateStats(points);
  const isComplete = Math.abs(stats.r) >= levels[currentLevel - 1].targetR && points.length >= 5;

  useEffect(() => {
    if (isComplete && !showUnlock) {
      setShowUnlock(true);
      addLog(t('modules.data.completion.synced'));
    }
  }, [isComplete]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || showUnlock) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 10;
    const y = 10 - ((e.clientY - rect.top) / rect.height) * 10;

    const clickedIdx = points.findIndex(p => Math.hypot(p.x - x, p.y - y) < 0.4);
    if (clickedIdx !== -1) {
      setPoints(points.filter((_, i) => i !== clickedIdx));
      addLog(t('modules.data.actions.node_deleted'));
    } else {
      setPoints([...points, { id: nextId.current++, x, y }]);
      addLog(`${t('modules.data.actions.node_injected')}: (${x.toFixed(1)}, ${y.toFixed(1)})`);
    }
  };

  const handleNextLevel = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 11) {
      setCurrentLevel(currentLevel + 1);
      initLevel(currentLevel + 1);
    } else {
      unlockBadge('data_analyst');
      window.location.href = "/";
    }
  };

  // Drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const w = canvasRef.current.width, h = canvasRef.current.height;
    ctx.clearRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let i=0; i<=10; i++) {
      ctx.beginPath(); ctx.moveTo((i/10)*w, 0); ctx.lineTo((i/10)*w, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i/10)*h); ctx.lineTo(w, (i/10)*h); ctx.stroke();
    }
    
    // Regression Line
    if (points.length >= 2) {
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.beginPath();
      const y0 = stats.slope * 0 + stats.intercept, y10 = stats.slope * 10 + stats.intercept;
      ctx.moveTo(0, (1 - y0/10) * h); ctx.lineTo(w, (1 - y10/10) * h); ctx.stroke();
    }
    
    // Points & Residuals
    points.forEach(p => {
      ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc((p.x/10)*w, (1 - p.y/10)*h, 6, 0, Math.PI*2); ctx.fill();
      if (showResiduals && points.length >= 2) {
         const py = stats.slope * p.x + stats.intercept;
         ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4, 4]); ctx.beginPath();
         ctx.moveTo((p.x/10)*w, (1 - p.y/10)*h); ctx.lineTo((p.x/10)*w, (1 - py/10)*h); ctx.stroke(); ctx.setLineDash([]);
      }
    });
  }, [points, stats, showResiduals]);

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back_root')}
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('common.protocol')}</span>
              <span className="text-sm font-bold text-slate-900">{t('dashboard.modules.data.title')}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {t('common.level')} {currentLevel} / 11
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="font-bold flex items-center gap-2 text-slate-800">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                {t('modules.data.viz.title')}
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{t('modules.data.viz.data_count')}</span>
                  <span>{points.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{t('modules.data.viz.integrity')}</span>
                  <span className="text-blue-600 font-mono">{stats.r.toFixed(3)}</span>
                </div>
              </div>
            </div>
            
            {currentLevel === 11 ? (<VarianceShortcutViz />) : currentLevel === 10 ? (<CombinedVarianceViz />) : currentLevel === 9 ? (<OutlierViz />) : currentLevel === 8 ? (<CovarianceViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('共分散の性質を確認しました。'); } }} />) : currentLevel === 7 ? (<HistogramBoxPlotViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('ヒストグラムとの対応を確認しました。'); } }} />) : currentLevel === 6 ? (<FrequencyTableViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('代表値の確認を完了しました。'); } }} />) : currentLevel === 5 ? (<DataTransformViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('変量変換完了'); } }} />) : currentLevel === 4 ? (<HypothesisTestingViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('検定完了'); } }} />) : currentLevel === 2 ? (<VarianceViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog(t('modules.data.completion.synced')); } }} />) : currentLevel === 3 ? (<BoxPlotViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog(t('modules.data.completion.synced')); } }} />) : (<div className="relative aspect-video bg-white m-6 border border-slate-100 rounded-lg shadow-inner cursor-crosshair group">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={800} height={450} onClick={handleCanvasClick} />
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-2">
                <Plus className="w-3 h-3" /> {t('modules.data.viz.viewport')}
              </div>
            </div>)}
            <AnimatePresence>
              {showUnlock && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm">
                  <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{t('modules.data.completion.synced')}</h3>
                    <p className="text-sm text-slate-500 mb-6">{t('modules.data.completion.msg')}</p>
                    <button onClick={handleNextLevel} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 flex items-center justify-center gap-2">
                      {currentLevel < 11 ? t('common.next') : t('common.root')} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
              <button onClick={() => setPoints([])} className="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> {t('modules.balls_in_bins.reset') || 'RESET'}
              </button>
              <button onClick={() => setShowResiduals(!showResiduals)} className={`text-xs font-bold px-4 py-2 rounded-lg border ${showResiduals ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>
                {t('modules.data.viz.residuals')}: {showResiduals ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">{t('modules.data.viz.target')}</h3>
            <h4 className="text-2xl font-bold mb-4">{levels[currentLevel-1].name}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{levels[currentLevel-1].desc}</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('common.system_log')}</h4>
            <div className="space-y-2 font-mono text-[11px]">
              {log.map((msg, i) => ( 
                <div key={i} className={`flex gap-3 ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                   <span>{msg}</span>
                </div> 
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
