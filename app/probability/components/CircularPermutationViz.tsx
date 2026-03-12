import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, RotateCw, AlignJustify, Circle as CircleIcon } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export function CircularPermutationViz() {
  const [n, setN] = useState(4);
  const [mode, setMode] = useState<'linear' | 'circular'>('circular');
  const [rotation, setRotation] = useState(0);

  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          円順列 (Circular Permutations)
        </h2>
        <p className="text-sm text-slate-500">
          回転して一致するものは同じとみなす順列
        </p>
      </div>

      {/* Main Visualization Area */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        
        {/* Toggle Mode */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button 
            onClick={() => { setMode('linear'); setRotation(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'linear' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            <AlignJustify className="w-4 h-4" /> 一列 (Linear)
          </button>
          <button 
            onClick={() => setMode('circular')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${mode === 'circular' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            <CircleIcon className="w-4 h-4" /> 円 (Circular)
          </button>
        </div>

        <div className="relative w-full h-full flex items-center justify-center mt-8">
          <AnimatePresence mode="popLayout">
            {mode === 'linear' ? (
              <motion.div 
                key="linear"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-2"
              >
                {Array.from({ length: n }).map((_, i) => (
                  <motion.div 
                    key={i}
                    layoutId={`node-${(i - rotation + n) % n}`}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: colors[(i - rotation + n) % n] }}
                  >
                    {((i - rotation + n) % n) + 1}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="circular"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-48 h-48 rounded-full border-4 border-slate-200/50 flex items-center justify-center"
              >
                {Array.from({ length: n }).map((_, i) => {
                  const angle = (i * 360) / n - 90;
                  const rad = (angle * Math.PI) / 180;
                  const radius = 96;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  
                  return (
                    <motion.div 
                      key={i}
                      layoutId={`node-${(i - rotation + n) % n}`}
                      animate={{ x, y }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ 
                        backgroundColor: colors[(i - rotation + n) % n],
                        marginLeft: '-24px',
                        marginTop: '-24px'
                      }}
                    >
                      {((i - rotation + n) % n) + 1}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {mode === 'circular' && (
          <button 
            onClick={() => setRotation(r => (r + 1) % n)}
            className="absolute bottom-4 right-4 bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-2 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
            <span>要素の数 (n): {n}</span>
          </div>
          <input 
            type="range" 
            min="3" 
            max="8" 
            value={n} 
            onChange={(e) => { setN(parseInt(e.target.value)); setRotation(0); }}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-500 cursor-pointer" 
          />
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2">
          なぜ (n-1)! になるのか？
        </h3>
        <p className="text-sm text-indigo-800/80 leading-relaxed">
          {n}個のものを一列に並べる方法は <MathComponent tex={`${n}!`} /> 通りです。<br/>
          しかし、これを円形に並べると、<strong>回転して同じになるものが {n} パターンずつ存在します。</strong>
          （右下の回転ボタンを押してみてください）
        </p>
        <div className="bg-white p-4 rounded-xl border border-indigo-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-600">計算式</span>
            <MathComponent tex={`\\frac{n!}{n} = (n-1)!`} className="text-lg font-bold text-indigo-600" />
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-slate-400">
              <MathComponent tex={`(${n}-1)! = ${factorial(n-1)} \\text{ 通り}`} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircularPermutationViz;
