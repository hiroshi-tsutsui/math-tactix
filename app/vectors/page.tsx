// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, MoveUpRight, CheckCircle2, ChevronRight, Info, Layers } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'vectors';

const LEVELS = [
  { id: 1, name: "ベクトルの合成", desc: "2つの力を合わせて、目標地点（赤い点）に到達させてください。", target: { x: 7, y: 5 } },
  { id: 2, name: "逆方向の力", desc: "マイナスのベクトルを使って、バランスをとってください。", target: { x: -3, y: 4 } }
];

export default function VectorsPage() {
  const { completeLevel } = useProgress();
  const [levelIdx, setLevelIdx] = useState(0);
  const [vecA, setVecA] = useState({ x: 2, y: 1 });
  const [vecB, setVecB] = useState({ x: 1, y: 2 });
  const [showComplete, setShowComplete] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  
  const currentLevel = LEVELS[levelIdx];
  const combined = { x: vecA.x + vecB.x, y: vecA.y + vecB.y };

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    addLog(`${currentLevel.name} を開始`);
  }, [levelIdx]);

  const isComplete = Math.abs(combined.x - currentLevel.target.x) < 0.1 && 
                    Math.abs(combined.y - currentLevel.target.y) < 0.1;

  useEffect(() => {
    if (isComplete && !showComplete) {
      setShowComplete(true);
      addLog("目標地点に到達！ベクトルの合成を理解しました。");
    }
  }, [isComplete]);

  const handleNext = () => {
    completeLevel(MODULE_ID, levelIdx + 1);
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
      setVecA({ x: 0, y: 0 });
      setVecB({ x: 0, y: 0 });
      setShowComplete(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">ベクトル</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">ステージ {levelIdx + 1}</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-slate-800"><MoveUpRight className="w-4 h-4 text-blue-600" /> 空間の可視化</h2>
              <div className="flex gap-4 text-xs font-mono">
                <div className="px-3 py-1 bg-slate-50 rounded-lg">合力: ({combined.x}, {combined.y})</div>
                <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-bold">目標: ({currentLevel.target.x}, {currentLevel.target.y})</div>
              </div>
            </div>

            <div className="p-12">
              <div className="relative aspect-square bg-white border border-slate-100 rounded-2xl mb-8 overflow-hidden shadow-inner">
                 <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                 
                 <svg viewBox="-10 -10 20 20" className="w-full h-full transform scale-y-[-1]">
                    {/* Grid lines */}
                    {Array.from({length: 21}).map((_, i) => (
                      <line key={i} x1={-10} y1={i-10} x2={10} y2={i-10} stroke="#f1f5f9" strokeWidth="0.05" />
                    ))}
                    {Array.from({length: 21}).map((_, i) => (
                      <line key={i} x1={i-10} y1={-10} x2={i-10} y2={10} stroke="#f1f5f9" strokeWidth="0.05" />
                    ))}
                    
                    {/* Axes */}
                    <line x1={-10} y1={0} x2={10} y2={0} stroke="#e2e8f0" strokeWidth="0.1" />
                    <line x1={0} y1={-10} x2={0} y2={10} stroke="#e2e8f0" strokeWidth="0.1" />

                    {/* Target Point */}
                    <circle cx={currentLevel.target.x} cy={currentLevel.target.y} r="0.4" fill="#ef4444" className="animate-pulse" />

                    {/* Vectors */}
                    <line x1={0} y1={0} x2={vecA.x} y2={vecA.y} stroke="#3b82f6" strokeWidth="0.2" strokeLinecap="round" />
                    <line x1={vecA.x} y1={vecA.y} x2={combined.x} y2={combined.y} stroke="#94a3b8" strokeWidth="0.2" strokeLinecap="round" strokeDasharray="0.5, 0.5" />
                    <circle cx={combined.x} cy={combined.y} r="0.3" fill="#3b82f6" />
                 </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">力 A (青)</span>
                    <span className="text-xs font-mono font-bold">x: {vecA.x} / y: {vecA.y}</span>
                  </div>
                  <div className="space-y-2">
                    <input type="range" min="-10" max="10" step="1" value={vecA.x} onChange={(e) => setVecA({...vecA, x: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <input type="range" min="-10" max="10" step="1" value={vecA.y} onChange={(e) => setVecA({...vecA, y: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">力 B (点線)</span>
                    <span className="text-xs font-mono font-bold">x: {vecB.x} / y: {vecB.y}</span>
                  </div>
                  <div className="space-y-2">
                    <input type="range" min="-10" max="10" step="1" value={vecB.x} onChange={(e) => setVecB({...vecB, x: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
                    <input type="range" min="-10" max="10" step="1" value={vecB.y} onChange={(e) => setVecB({...vecB, y: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showComplete && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-green-50 border-t border-green-100 p-6 flex items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-800">ミッション完了！力の合成をマスターしました。</span>
                  </div>
                  <button onClick={handleNext} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">次へ進む</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
             <div className="flex items-center gap-2 mb-6">
               <Layers className="w-4 h-4 text-blue-400" />
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Vector Mission</span>
             </div>
             <h4 className="text-2xl font-bold mb-4">{currentLevel.name}</h4>
             <p className="text-sm text-slate-300 leading-relaxed">{currentLevel.desc}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
             <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">数学的視点</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  ベクトルは「向き」と「大きさ」を同時に扱うための道具です。複数のベクトルを足し合わせる（合成する）ことで、複雑な力の働きや移動の総和をひとつの式で記述できます。
                </p>
             </div>
             <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">活動ログ</h4>
                <div className="space-y-2 font-mono text-[10px]">
                  {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
