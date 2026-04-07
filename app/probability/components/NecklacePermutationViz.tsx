import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Diamond, RefreshCw, Layers } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import HintButton from '../../components/HintButton';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function NecklacePermutationViz() {
  const [n, setN] = useState(5);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState(0);

  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);
  const circularWays = factorial(n - 1);
  const necklaceWays = circularWays / 2;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 1) % n);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <Diamond className="w-5 h-5 text-pink-500" />
          じゅず順列 (Necklace Permutations)
        </h2>
        <p className="text-sm text-slate-500">
          円順列において、裏返して一致するものも同じとみなす
        </p>
      </div>

      {/* Main Visualization Area */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden" style={{ perspective: '800px' }}>
        
        {/* Toggle Mode */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleRotate}
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> 回転 (Rotate)
          </button>
          <button 
            onClick={handleFlip}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${isFlipped ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50'}`}
          >
            <Layers className="w-4 h-4" /> 裏返す (Flip)
          </button>
        </div>

        <div className="relative w-full h-full flex items-center justify-center mt-12 mb-8">
          <motion.div 
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="relative w-48 h-48 rounded-full border-4 border-slate-300 flex items-center justify-center shadow-inner"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {Array.from({ length: n }).map((_, i) => {
              // Base angle
              let angleDeg = (i * 360) / n - 90;
              // Add rotation offset
              angleDeg += (rotation * 360) / n;
              
              const rad = (angleDeg * Math.PI) / 180;
              const radius = 96;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              
              return (
                <motion.div 
                  key={i}
                  animate={{ x, y }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                  className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20"
                  style={{ 
                    backgroundColor: colors[i % colors.length],
                    // Counter-rotate the numbers so they stay readable during the flip
                    transform: `translate(${x}px, ${y}px) rotateY(${isFlipped ? 180 : 0}deg)`
                  }}
                >
                  <span style={{ display: 'inline-block', transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}>
                    {i + 1}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">要素の数 (n)</label>
            <span className="text-lg font-black text-pink-600">{n} 個</span>
          </div>
          <input 
            type="range" min="3" max="8" step="1" 
            value={n} onChange={(e) => { setN(Number(e.target.value)); setRotation(0); setIsFlipped(false); }}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-pink-500 cursor-pointer"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Diamond className="w-4 h-4 text-pink-500" /> じゅず順列の計算
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            円順列では回転して一致するものを同じとみなしますが、じゅず（ネックレス）の場合は、さらに「裏返して一致するもの」も同じとみなします。
          </p>
          <div className="flex flex-col gap-2">
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">円順列の総数</span>
              <MathComponent tex={`(${n}-1)! = ${circularWays}`} className="text-slate-700 font-bold" />
            </div>
            <div className="flex justify-center">
              <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-pink-200">
                ÷ 2 (裏返しの重複)
              </span>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 text-center">
              <span className="text-xs text-pink-600/70 font-bold block mb-1">じゅず順列の総数</span>
              <MathComponent tex={`\\frac{(${n}-1)!}{2} = ${necklaceWays}`} className="text-xl font-bold text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <HintButton
        hints={[
          { step: 1, text: "じゅず順列は円順列にさらに「裏返しの重複」を除いたものです" },
          { step: 2, text: "円順列の総数は (n-1)! 通りです" },
          { step: 3, text: "ネックレスは裏返すと同じ並びが2つずつ重複するため、(n-1)!/2 通りになります" },
          { step: 4, text: "回転ボタンと裏返しボタンを使って、同じ並びになることを確認してみましょう" },
        ]}
      />
    </div>
  );
}