"use client";

import React, { useState, useEffect, useRef, useReducer } from 'react';
import { GeistSans } from 'geist/font/sans';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Trophy,
  Sparkles,
  Move,
  Target,
  AlertTriangle,
  Lightbulb,
  Binary,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// --- Types ---
type Mode = 'LEARN' | 'TACTICS';
type Status = 'idle' | 'correct' | 'wrong';

interface State {
  mode: Mode;
  level: number;
  step: number;
}

type Action = 
  | { type: 'SWITCH_MODE'; payload: Mode }
  | { type: 'NEXT_STEP' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET' };

interface TacticsQuestion {
  generalForm: string;
  standardForm: string;
  answer: string;
  vertex: [number, number];
  instruction: string;
  options: string[];
}

// --- Components ---
const MathComponent = ({ tex, className = "", display = false }: { tex: string; className?: string; display?: boolean }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={containerRef} className={className} />;
};

// --- Reducer ---
function curriculumReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SWITCH_MODE': return { mode: action.payload, level: 0, step: 0 };
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'NEXT_LEVEL': return { ...state, level: state.level + 1, step: 0 };
    case 'RESET': return { mode: 'LEARN', level: 0, step: 0 };
    default: return state;
  }
}

export default function MathTactixUltimateSolution() {
  const [state, dispatch] = useReducer(curriculumReducer, { mode: 'LEARN', level: 0, step: 0 });
  const { mode, level, step } = state;
  
  const [a, setA] = useState(1);
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  
  // Tactics Engine
  const [tacticsIdx, setTacticsIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{status: Status, msg: string}>({status: 'idle', msg: ''});

  const QUESTIONS: TacticsQuestion[] = [
    {
      generalForm: "y = 2x^2 - 20x + 44",
      standardForm: "y = 2(x - 5)^2 - 6",
      answer: "(5, -6)",
      options: ["(5, -6)", "(-5, 6)", "(10, 44)", "(5, 6)"],
      vertex: [5, -6],
      instruction: "係数 2 を括り出し、頂点を特定せよ。"
    },
    {
      generalForm: "y = -x^2 - 4x + 1",
      standardForm: "y = -(x + 2)^2 + 5",
      answer: "(-2, 5)",
      options: ["(-2, 5)", "(2, 1)", "(-2, 1)", "(2, -5)"],
      vertex: [-2, 5],
      instruction: "マイナスで括る際の符号ミスに注意。"
    }
  ];

  const currentQ = QUESTIONS[tacticsIdx % QUESTIONS.length];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const scale = 40, ox = w / 2, oy = h / 2 + 50;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(0,0,0,0.03)'; ctx.lineWidth = 1;
      for(let x=-10; x<=10; x++) { ctx.beginPath(); ctx.moveTo(ox + x*scale, 0); ctx.lineTo(ox + x*scale, h); ctx.stroke(); }
      for(let y=-10; y<=10; y++) { ctx.beginPath(); ctx.moveTo(0, oy - y*scale); ctx.lineTo(w, oy - y*scale); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
      ctx.strokeStyle = mode === 'TACTICS' ? '#1D1D1F' : (level >= 2 ? '#FF3B30' : '#007AFF');
      ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let px = 0; px <= w; px++) {
        const x = (px - ox) / scale;
        let cA = 1, cP = 0, cQ = 0;
        if (mode === 'LEARN') {
          cA = level === 0 ? a : 1;
          cP = level === 1 ? p : (level >= 2 ? 2 : 0);
          cQ = level === 1 ? q : (level >= 2 ? -1 : 0);
        } else {
          cA = currentQ.vertex[0] > 0 ? 1 : -1;
          cP = currentQ.vertex[0]; cQ = currentQ.vertex[1];
        }
        const y = cA * (x - cP) * (x - cP) + cQ;
        const py = oy - y * scale;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };
    render();
  }, [a, p, q, level, mode, tacticsIdx, currentQ]);

  // Handlers
  const handleCheckTactics = (opt: string) => {
    setSelectedOption(opt);
    if (opt === currentQ.answer) {
      setFeedback({status: 'correct', msg: '正解'});
    } else {
      setFeedback({status: 'wrong', msg: '不正解'});
    }
  };

  const handleNextTactics = () => {
    setTacticsIdx(i => i + 1);
    setSelectedOption(null);
    setFeedback({status: 'idle', msg: ''});
  };

  return (
    <div className={`h-screen bg-white text-black flex flex-col ${GeistSans.className} selection:bg-blue-100 overflow-hidden`}>
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-50 bg-white/90 backdrop-blur-md z-50">
        <button onClick={() => dispatch({type: 'RESET'})} className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{mode === 'LEARN' ? `Step 0${level + 1}` : 'Exam Mission'}</div>
        <div className="w-10" />
      </header>

      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative">
          <canvas ref={canvasRef} width={400} height={220} className="w-full h-full" />
          <div className="absolute top-3 left-0 right-0 flex justify-center">
            <motion.div key={mode + level + currentQ.generalForm} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 text-blue-600 font-bold text-xs">
              {mode === 'LEARN' ? (
                level === 0 ? <MathComponent tex={`y = ${a.toFixed(1)}x^2`} /> : 
                level === 1 ? <MathComponent tex={`y = (x - ${p.toFixed(1)})^2 + ${q.toFixed(1)}`} /> :
                <MathComponent tex="y = x^2 - 4x + 3" />
              ) : <MathComponent tex={currentQ.generalForm} />}
            </motion.div>
          </div>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-lg mx-auto px-8 py-8 pb-32">
          <AnimatePresence mode="wait">
            {mode === 'LEARN' && level === 0 && (
              <motion.div key="lvl0" className="space-y-8 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">2次関数の極意</h1>
                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center px-1"><span className="text-[10px] font-bold text-slate-400 uppercase">開き方の係数 (a)</span><span className="font-mono font-bold text-blue-600">{a.toFixed(1)}</span></div>
                   <input type="range" min="-3" max="3" step="0.1" value={a} onChange={e => setA(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                </div>
                {Math.abs(a) > 2.5 && <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg">Lesson 02へ</button>}
              </motion.div>
            )}

            {mode === 'LEARN' && level === 1 && (
              <motion.div key="lvl1" className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                  <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2"><HelpCircle className="w-4 h-4" /> 頂点の暗号を解く</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">カッコ内をゼロにする横位置と、外に残った数字の高さを合わせます。</p>
                </div>
                <div className="space-y-5">
                   <input type="range" min="-4" max="4" step="0.1" value={p} onChange={e => setP(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   <input type="range" min="-4" max="4" step="0.1" value={q} onChange={e => setQ(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                </div>
                {Math.abs(p - 2) < 0.2 && Math.abs(q - (-1)) < 0.2 && <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold">Lesson 03へ</button>}
              </motion.div>
            )}

            {mode === 'LEARN' && level === 2 && (
              <motion.div key="lvl2" className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-8 flex flex-col items-center">
                   <MathComponent tex="y = x^2 - 4x + 3" className="text-white text-2xl font-mono opacity-50" />
                   {step >= 1 && (
                     <div className="w-full flex flex-col items-center gap-4 text-center">
                        <div className="flex flex-col items-center"><MathComponent tex="x^2 - 4x" className="text-slate-400 text-xl" /><ArrowDown className="w-4 h-4 text-blue-500" /><MathComponent tex="(x - 2)^2" className="text-blue-400 text-2xl font-bold" /></div>
                        {step >= 2 && <><ArrowDown className="w-4 h-4 text-amber-500" /><MathComponent tex="(x - 2)^2 - 4 + 3" className="text-amber-400 text-xl font-bold" /></>}
                        {step === 3 && <><ArrowDown className="w-4 h-4 text-emerald-500" /><MathComponent tex="y = (x - 2)^2 - 1" className="text-emerald-400 text-3xl font-bold" /></>}
                     </div>
                   )}
                   <button onClick={() => step < 3 ? dispatch({type: 'NEXT_STEP'}) : dispatch({type: 'NEXT_LEVEL'})} className="w-full py-4 rounded-2xl font-bold bg-white text-black">{step === 0 ? "手術（翻訳）開始" : "次の手順へ"}</button>
                </div>
              </motion.div>
            )}

            {mode === 'LEARN' && level === 3 && (
              <motion.div key="lvl3" className="space-y-6 text-center">
                <h2 className="text-2xl font-extrabold">Lesson 04：a ≠ 1 の攻略</h2>
                <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-6">
                   <MathComponent tex="y = 2x^2 - 20x + 44" className="text-white text-xl" />
                   {step === 0 && <><div className="p-4 bg-white/5 rounded-xl border border-white/10 text-blue-400 text-lg"><MathComponent tex="y = 2(x^2 - 10x) + 44" /></div><p className="text-slate-400 text-xs">まず 2 で括り出します。</p></>}
                   {step === 1 && <><div className="p-4 bg-white/5 rounded-xl border border-white/10 text-amber-400 text-lg"><MathComponent tex="y = 2\{(x - 5)^2 - 25\} + 44" /></div><p className="text-slate-400 text-xs">カッコ内で平方完成。</p></>}
                   {step === 2 && <><div className="p-4 bg-white/5 rounded-xl border border-white/10 text-emerald-400 text-xl"><MathComponent tex="y = 2(x - 5)^2 - 6" /></div><p className="text-slate-400 text-xs">分配して整理。頂点は (5, -6) です。</p></>}
                   <button onClick={() => step < 2 ? dispatch({type: 'NEXT_STEP'}) : dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-white text-black py-4 rounded-2xl font-bold">進む</button>
                </div>
              </motion.div>
            )}

            {mode === 'LEARN' && level === 4 && (
               <div className="text-center space-y-8 py-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200"><TrendingUp className="w-12 h-12 text-white" /></div>
                  <button onClick={() => dispatch({type: 'SWITCH_MODE', payload: 'TACTICS'})} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3"><Target className="w-6 h-6 text-red-500" /> 試験ミッション開始</button>
               </div>
            )}

            {mode === 'TACTICS' && (
              <motion.div key={currentQ.generalForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <div className="bg-red-50 p-6 rounded-[28px] border border-red-100 space-y-3">
                    <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest"><FileText className="w-3 h-3" /> Exam Mission</div>
                    <h3 className="text-[15px] font-bold leading-relaxed text-slate-800"><MathComponent tex={currentQ.instruction} /></h3>
                    <div className="bg-white/50 p-3 rounded-xl border border-red-100 text-center"><MathComponent tex={currentQ.generalForm} className="text-2xl font-bold text-slate-900" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {currentQ.options.map((opt) => (
                       <button key={opt} onClick={() => handleCheckTactics(opt)} disabled={feedback.status === 'correct'} className={`py-4 rounded-2xl font-mono font-bold border-2 transition-all ${selectedOption === opt ? (opt === currentQ.answer ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700') : 'bg-white border-slate-100 text-slate-400'}`}>
                          {opt}
                       </button>
                    ))}
                 </div>
                 <AnimatePresence>
                    {feedback.status === 'correct' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                          <button onClick={handleNextTactics} className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">次の問題へ <ChevronRight className="w-4 h-4" /></button>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="h-20 bg-white/90 backdrop-blur-md border-t border-slate-50 flex items-center justify-around px-6 shrink-0 z-50">
        <button onClick={() => dispatch({type: 'SWITCH_MODE', payload: 'LEARN'})} className={`flex flex-col items-center gap-1 transition-opacity ${mode === 'LEARN' ? 'opacity-100' : 'opacity-20'}`}>
          <div className="w-5 h-5 rounded-md bg-blue-600" /><span className="text-[10px] font-bold text-blue-600">Learn</span>
        </button>
        <button onClick={() => dispatch({type: 'SWITCH_MODE', payload: 'TACTICS'})} className={`flex flex-col items-center gap-1 transition-opacity ${mode === 'TACTICS' ? 'opacity-100' : 'opacity-20'}`}>
          <div className="w-5 h-5 rounded-md bg-red-500" /><span className="text-[10px] font-bold text-red-500">Tactics</span>
        </button>
      </footer>
    </div>
  );
}
