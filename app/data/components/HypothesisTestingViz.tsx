import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// --- Math Rendering ---
const BlockMath = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { displayMode: true, throwOnError: false });
    }
  }, [tex]);
  return <div ref={ref} className="my-2" />;
};

export default function HypothesisTestingViz({ onComplete }: { onComplete?: () => void }) {
  const [tosses, setTosses] = useState<number[]>([]);
  const [isTossing, setIsTossing] = useState(false);
  const totalSimulations = 10000;
  
  // To avoid heavy computation on main thread, we'll precompute a binomial distribution for N=10, p=0.5
  const n = 10;
  const p = 0.5;
  const getBinomialProb = (k: number) => {
    // 10Ck * (0.5)^10
    const coeff = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1];
    return coeff[k] / 1024;
  };

  const probabilities = Array.from({length: 11}, (_, k) => getBinomialProb(k));

  const headsCount = tosses.filter(t => t === 1).length;
  const isFinished = tosses.length === n;
  
  const pValue = isFinished ? probabilities.slice(headsCount).reduce((a, b) => a + b, 0) : null;
  const isSignificant = pValue !== null && pValue < 0.05;

  useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished]);

  const tossCoin = async () => {
    if (isTossing || isFinished) return;
    setIsTossing(true);
    
    // Simulate getting exactly 9 heads to make the point about 5% significance
    // For educational purposes, we force the outcome sequence: 1, 1, 1, 0, 1, 1, 1, 1, 1, 1
    const forcedSequence = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1];
    const currentIndex = tosses.length;
    
    setTosses(prev => [...prev, forcedSequence[currentIndex]]);
    setTimeout(() => setIsTossing(false), 300);
  };

  const reset = () => {
    setTosses([]);
  };

  const autoTossAll = () => {
    if (isTossing || isFinished) return;
    setTosses([1, 1, 1, 0, 1, 1, 1, 1, 1, 1]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">仮説検定の考え方 (Hypothesis Testing)</h3>
        <p className="text-sm text-slate-600">
          「10回コイントスして9回表が出た」という結果が得られました。<br/>
          このコインは「表が出やすい（歪んでいる）」と判断してよいでしょうか？<br/>
          <strong>帰無仮説 ($H_0$):</strong> コインは公平である（表が出る確率は $\frac{1}{2}$）<br/>
          <strong>対立仮説 ($H_1$):</strong> コインは表が出やすい（確率 ${">"}\frac{1}{2}$）
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Simulation */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">コイントス実験</h4>
            <div className="space-x-2">
              <button 
                onClick={tossCoin} 
                disabled={isTossing || isFinished}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"
              >
                1回投げる
              </button>
              <button 
                onClick={autoTossAll} 
                disabled={isTossing || isFinished}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-sm font-bold disabled:opacity-50"
              >
                10回投げる
              </button>
              <button 
                onClick={reset}
                className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 min-h-[64px]">
            <AnimatePresence>
              {tosses.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ rotateY: 90, scale: 0 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-2 ${
                    t === 1 
                      ? "bg-amber-100 border-amber-400 text-amber-700" 
                      : "bg-slate-100 border-slate-300 text-slate-500"
                  }`}
                >
                  {t === 1 ? "表" : "裏"}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 text-sm bg-white p-4 rounded-xl border border-slate-200">
            <div>試行回数: <span className="font-bold text-lg">{tosses.length}</span> / 10</div>
            <div>表の回数: <span className="font-bold text-lg text-amber-600">{headsCount}</span></div>
          </div>
        </div>

        {/* Right: Analysis & P-Value */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
          <h4 className="font-bold text-slate-800 mb-4">公平なコインの確率分布 (二項分布)</h4>
          
          <div className="flex items-end gap-1 h-32 border-b border-slate-200 pb-2">
            {probabilities.map((prob, k) => {
              const heightPct = prob * 100 * 3.5; // Scale for visualization
              const isObservedOrMore = isFinished && k >= headsCount;
              
              return (
                <div key={k} className="flex-1 flex flex-col items-center justify-end relative group">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {k}回: {(prob * 100).toFixed(1)}%
                  </div>
                  
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-colors duration-500 ${
                      isObservedOrMore 
                        ? "bg-red-500" 
                        : (isFinished && k === headsCount ? "bg-amber-500" : "bg-blue-100")
                    }`}
                  />
                  <div className="text-[10px] mt-1 text-slate-500">{k}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            {isFinished ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="text-sm font-bold text-red-800 mb-2">判定 (有意水準 5% = 0.05)</div>
                  <div className="text-sm text-red-700">
                    9回以上表が出る確率（p値）は：<br/>
                    $P(X \ge 9) = P(X=9) + P(X=10)$<br/>
                    <BlockMath tex="P(X \ge 9) \approx 0.0107" />
                  </div>
                  <div className="mt-2 text-sm text-red-800 font-bold border-t border-red-200 pt-2">
                    0.0107 &lt; 0.05 (5%)<br/>
                    確率が5%未満なので「偶然とは考えにくい」。<br/>
                    よって帰無仮説を棄却し、「コインは表が出やすい」と判断する。
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                10回トスを完了して検定を行います
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
