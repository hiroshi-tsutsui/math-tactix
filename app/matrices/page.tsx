// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, ChevronRight, Grid, Maximize, RotateCw, Activity, Info } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'matrices';
type Matrix2x2 = [[number, number], [number, number]];

export default function MatricesPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [matrix, setMatrix] = useState<Matrix2x2>([[1, 0], [0, 1]]);
  const [showUnlock, setShowUnlock] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const LEVELS = [
    { id: 1, name: "90度回転", desc: "行列の値を操作して、空間を反時計回りに90度回転させてください。", target: [[0, -1], [1, 0]] },
    { id: 2, name: "2倍に拡大", desc: "空間全体を2倍の大きさに均等に拡大させてください。", target: [[2, 0], [0, 2]] },
    { id: 3, name: "剪断（せんだん）", desc: "横方向（x軸方向）に歪ませる変換を行ってください。", target: [[1, 1], [0, 1]] }
  ];

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    const next = progress.length + 1 > 3 ? 3 : progress.length + 1;
    setCurrentLevel(next);
    addLog(`ステージ ${next} を開始しました`);
  }, [moduleProgress]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const isMatch = (m1, m2) => {
      return Math.abs(m1[0][0] - m2[0][0]) < 0.1 && Math.abs(m1[0][1] - m2[0][1]) < 0.1 &&
             Math.abs(m1[1][0] - m2[1][0]) < 0.1 && Math.abs(m1[1][1] - m2[1][1]) < 0.1;
  };

  useEffect(() => {
    if (isMatch(matrix, LEVELS[currentLevel - 1].target) && !showUnlock) {
      setShowUnlock(true);
      addLog("行列の変換に成功しました！");
    }
  }, [matrix]);

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setMatrix([[1, 0], [0, 1]]);
      setShowUnlock(false);
    } else {
      window.location.href = "/";
    }
  };

  const handleInputChange = (r, c, val) => {
      const num = parseFloat(val) || 0;
      const newM = [...matrix];
      newM[r] = [...newM[r]];
      newM[r][c] = num;
      setMatrix(newM);
  };

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2, unit = 40;

    const transform = (x, y, m) => {
        const nx = m[0][0] * x + m[0][1] * y;
        const ny = m[1][0] * x + m[1][1] * y;
        return { x: cx + nx * unit, y: cy - ny * unit };
    };

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;

    // Transformed Grid
    ctx.strokeStyle = '#e2e8f0';
    for(let i=-5; i<=5; i++) {
        const p1 = transform(i, -5, matrix), p2 = transform(i, 5, matrix);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        const p3 = transform(-5, i, matrix), p4 = transform(5, i, matrix);
        ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    // Basis Vectors
    const origin = transform(0, 0, matrix);
    const iHat = transform(1, 0, matrix);
    const jHat = transform(0, 1, matrix);

    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(iHat.x, iHat.y); ctx.stroke();
    ctx.strokeStyle = '#22c55e';
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(jHat.x, jHat.y); ctx.stroke();

  }, [matrix]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <span className="text-sm font-bold">行列と線形変換</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><Grid className="w-5 h-5 text-blue-600" /> 空間変形の解析</h2>
              </div>
              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="max-w-full h-auto" />
                 </div>

                 <div className="flex flex-col items-center gap-8">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">変換行列 T</div>
                    <div className="flex items-center gap-4 text-4xl text-slate-200">
                        [
                        <div className="grid grid-cols-2 gap-4">
                           <input type="number" step="0.5" value={matrix[0][0]} onChange={e=>handleInputChange(0,0,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-red-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[0][1]} onChange={e=>handleInputChange(0,1,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-green-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[1][0]} onChange={e=>handleInputChange(1,0,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-red-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                           <input type="number" step="0.5" value={matrix[1][1]} onChange={e=>handleInputChange(1,1,e.target.value)} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-green-500 focus:border-blue-500 focus:bg-white outline-none transition-all" />
                        </div>
                        ]
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">ミッション</h3>
              <h4 className="text-xl font-bold mb-4">{LEVELS[currentLevel-1].name}</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{LEVELS[currentLevel-1].desc}</p>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                 <div className="flex items-center gap-2 text-xs text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> 赤の矢印: 基底ベクトル i (1,0) の行き先</div>
                 <div className="flex items-center gap-2 text-xs text-green-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> 緑の矢印: 基底ベクトル j (0,1) の行き先</div>
              </div>
           </div>
           <AnimatePresence>
            {showUnlock && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-[32px] text-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">次へ進む</button>
                </motion.div>
            )}
           </AnimatePresence>
           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">活動ログ</h4>
              <div className="space-y-2 font-mono text-[11px]">
                {log.map((msg, i) => <div key={i} className={i===0 ? 'text-blue-600' : 'text-slate-400'}>{msg}</div>)}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
