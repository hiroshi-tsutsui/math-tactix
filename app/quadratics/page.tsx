// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, Play, CheckCircle2, ChevronRight, Activity, LineChart, Info, Zap } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_ID = 'quadratics';

export default function QuadraticPage() {
  const { moduleProgress, completeLevel } = useProgress();
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [exerciseFeedback, setExerciseFeedback] = useState<{status: 'idle' | 'correct' | 'wrong', msg: string}>({status: 'idle', msg: ""});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Mathematical Logic ---
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const discriminant = b * b - 4 * a * c;

  const EXERCISES = [
    {
      id: 1,
      name: "頂点座標の特定",
      question: "関数 y = x² - 4x + 3 を平方完成し、頂点座標 (p, q) を入力してください。",
      target: "(2,-1)",
      hint: "y = (x-2)² - 1 に変形し、シミュレーターで a=1, b=-4, c=3 に設定して頂点を確認してください。"
    },
    {
      id: 2,
      name: "判別式とグラフの位置関係",
      question: "関数 y = x² + 2x + 3 において、判別式 D の値を計算してください。また、このグラフはx軸と交わりますか？（例: -8,No）",
      target: "-8,No",
      hint: "D = b² - 4ac を計算し、D < 0 の場合は実数解を持たない（x軸と交わらない）ことをシミュレーターで確認してください。"
    },
    {
      id: 3,
      name: "実戦：最大利益の設計",
      question: "利益 P = -2x² + 20x - 30 で表されるとき、利益を最大化する価格 x を特定してください。",
      target: "5",
      hint: "軸の方程式 x = -b/2a を使い、放物線の頂点を特定してください。"
    }
  ];

  const checkExercise = () => {
    const current = EXERCISES[exerciseStep];
    const normalizedUser = userAnswer.replace(/\s+/g, '');
    const isCorrect = normalizedUser === current.target;

    if (isCorrect) {
      setExerciseFeedback({status: 'correct', msg: "正解です。数式から導き出されたロジックとグラフの挙動が同期しました。"});
      completeLevel(MODULE_ID, exerciseStep + 1);
    } else {
      setExerciseFeedback({status: 'wrong', msg: "解析エラー。計算結果がグラフの論理と一致しません。"});
    }
  };

  const nextExercise = () => {
    if (exerciseStep < EXERCISES.length - 1) {
      setExerciseStep(exerciseStep + 1);
      setUserAnswer("");
      setExerciseFeedback({status: 'idle', msg: ""});
    } else {
      window.location.href = "/";
    }
  };

  // 平方完成の数値を計算
  const p = vertexX.toFixed(2);
  const q = vertexY.toFixed(2);

  useEffect(() => {
    const progress = moduleProgress[MODULE_ID]?.completedLevels || [];
    let nextLvl = progress.length + 1;
    if (nextLvl > 3) nextLvl = 3;
    setExerciseStep(nextLvl - 1);
  }, [moduleProgress]);

  // 旧来のステージ完了条件を削除し、シミュレーターを自由操作モードに固定
  const isComplete = false; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width, h = canvas.height;
    const scale = 40, ox = w / 2, oy = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    for(let x=0; x<=w; x+=scale) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for(let y=0; y<=h; y+=scale) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = a * x * x + b * x + c;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [a, b, c]);

  const handleNext = () => {
    completeLevel(MODULE_ID, currentLevel);
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setShowUnlock(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">二次関数</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">ステージ {currentLevel} / 3</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2 text-slate-800"><Activity className="w-5 h-5 text-blue-600" /> 放物線の動理解析</h2>
                 <div className="flex gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-500">
                        頂点 Vertex: ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-500">
                        判別式 D: {discriminant.toFixed(2)}
                    </div>
                    <div className="bg-slate-900 px-4 py-2 rounded-xl text-white font-mono text-sm">
                        y = {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)}
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400">係数 a (開き方)</span><span className="font-bold">{a.toFixed(1)}</span></div>
                       <input type="range" min="-3" max="3" step="0.1" value={a} onChange={e=>setA(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400">係数 b (横移動)</span><span className="font-bold">{b.toFixed(1)}</span></div>
                       <input type="range" min="-5" max="5" step="0.1" value={b} onChange={e=>setB(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-400">係数 c (縦移動)</span><span className="font-bold">{c.toFixed(1)}</span></div>
                       <input type="range" min="-5" max="5" step="0.1" value={c} onChange={e=>setC(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                    </div>
                 </div>
              </div>

              <AnimatePresence>
                {showUnlock && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-white/90 backdrop-blur-md">
                    <div className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-2xl text-center max-w-sm">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">条件クリア！</h3>
                      <p className="text-sm text-slate-500 mb-8">放物線のパラメータ特性を正しく操作しました。</p>
                      <button onClick={handleNext} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        {currentLevel < 3 ? '次のレベルへ' : '完了して戻る'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap className="w-24 h-24 text-blue-500" />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Tactical Exercise</div>
                    <span className="text-slate-500 text-xs font-bold">Step {exerciseStep + 1} / {EXERCISES.length}</span>
                 </div>

                 <h3 className="text-xl font-bold text-white leading-relaxed max-w-2xl">
                    {EXERCISES[exerciseStep].question}
                 </h3>

                 <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <input 
                      type="text" 
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={EXERCISES[exerciseStep].type === "vertex" ? "(p, q)" : "数値を入力"}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      onClick={checkExercise}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                       回答を検証
                    </button>
                 </div>

                 <AnimatePresence mode="wait">
                    {exerciseFeedback.status !== 'idle' && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }}
                         className={`p-6 rounded-2xl border flex items-start gap-4 ${exerciseFeedback.status === 'correct' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                       >
                          {exerciseFeedback.status === 'correct' ? (
                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                             <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-2">
                             <p className={`text-sm font-bold ${exerciseFeedback.status === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                {exerciseFeedback.msg}
                             </p>
                             {exerciseFeedback.status === 'wrong' && (
                                <p className="text-xs text-slate-400 leading-relaxed">
                                   <span className="font-black text-slate-300">Hint:</span> {EXERCISES[exerciseStep].hint}
                                </p>
                             )}
                             {exerciseFeedback.status === 'correct' && (
                                <button 
                                  onClick={nextExercise}
                                  className="text-xs font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-2"
                                >
                                   {exerciseStep < EXERCISES.length - 1 ? '次の演習へ' : '完了して戻る'} <ChevronRight className="w-3 h-3" />
                                </button>
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">学習リファレンス</h3>
              <h4 className="text-2xl font-bold mb-4">二次関数の定義</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">シミュレーターを自由に操作し、数式とグラフの対応関係を確認してください。右側の「戦術演習」をクリアすることで、次のフェーズへ進みます。</p>
           </div>
           
          <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-6">数理コア・ロジック</h3>
              <div className="space-y-6">
                 <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black mb-2 opacity-70 uppercase tracking-tighter">一般形：現在の全体像</p>
                    <p className="text-lg font-mono italic">y = {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)}</p>
                 </div>
                 
                 <div className="relative py-2 flex justify-center">
                    <div className="h-8 w-px bg-white/20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 px-2 text-[10px] font-bold opacity-60">平方完成</div>
                 </div>

                 <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black mb-2 opacity-70 uppercase tracking-tighter">標準形：頂点座標の特定</p>
                    <p className="text-lg font-mono italic">y = {a.toFixed(1)}(x - {vertexX.toFixed(2)})² + {vertexY.toFixed(2)}</p>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">a</div>
                       <p className="text-[11px] leading-relaxed opacity-80">
                          <span className="font-bold text-white">加速度・開き方</span>：正なら下に凸、負なら上に凸。絶対値が大きいほど「急」な変化になります。
                       </p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">b</div>
                       <p className="text-[11px] leading-relaxed opacity-80">
                          <span className="font-bold text-white">対称軸の左右移動</span>：a と b の符号が同じなら軸は左へ、異なれば右へ移動します（軸 $x = -b/2a$）。
                       </p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">c</div>
                       <p className="text-[11px] leading-relaxed opacity-80">
                          <span className="font-bold text-white">初期値・y切片</span>：グラフが y軸と交わる「初期の高さ」を定義します。
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">実社会での応用</h4>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <LineChart className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold mb-1">弾道計算・物理学</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">放物線は重力下での物体の動きを記述します。スポーツやエンジニアリングにおける軌道予測の基礎です。</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
