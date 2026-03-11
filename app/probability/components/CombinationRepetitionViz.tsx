"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export const CombinationRepetitionViz = () => {
  const [n, setN] = useState(5); // Number of items (balls)
  const [r, setR] = useState(3); // Number of categories (bins)
  
  // Dividers = r - 1
  const dividers = r - 1;
  const totalSlots = n + dividers;
  
  // Calculate nHr = (n+r-1) C n
  const factorial = (num: number): number => {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
  };
  
  const combination = (total: number, choose: number): number => {
    if (choose < 0 || choose > total) return 0;
    return factorial(total) / (factorial(choose) * factorial(total - choose));
  };
  
  const combinations = combination(totalSlots, n);
  
  // Generate a random valid arrangement of balls and dividers
  const [arrangement, setArrangement] = useState<string[]>([]);
  
  const generateRandomArrangement = () => {
    let arr = new Array(totalSlots).fill('ball');
    let dividerPositions = new Set<number>();
    while (dividerPositions.size < dividers) {
      dividerPositions.add(Math.floor(Math.random() * totalSlots));
    }
    
    dividerPositions.forEach(pos => {
      arr[pos] = 'divider';
    });
    setArrangement(arr);
  };
  
  // Generate initial arrangement
  useMemo(() => {
    let arr = new Array(totalSlots).fill('ball');
    for (let i = 0; i < dividers; i++) {
      arr[i * 2 + 1] = 'divider'; // Just spread them out simply initially
    }
    setArrangement(arr);
  }, [n, r, totalSlots, dividers]);

  // Count balls in each bin
  const binCounts = useMemo(() => {
    let counts = new Array(r).fill(0);
    let currentBin = 0;
    arrangement.forEach(item => {
      if (item === 'ball') {
        counts[currentBin]++;
      } else {
        currentBin++;
      }
    });
    return counts;
  }, [arrangement, r]);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto p-4">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
        <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
          重複組合せ (nHr) の視覚化
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-300">選ぶ個数 (〇の数) $n$</label>
                <span className="font-bold text-blue-400">{n} 個</span>
              </div>
              <input type="range" min="1" max="10" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-300">種類 (グループ数) $r$</label>
                <span className="font-bold text-green-400">{r} 種類</span>
              </div>
              <input type="range" min="2" max="5" step="1" value={r} onChange={(e) => setR(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>
            
            <button onClick={generateRandomArrangement} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              ランダムに並べ替える (Shuffle)
            </button>
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-slate-200 mb-2">条件の確認</h4>
              <p className="text-sm text-slate-300">
                異なる {r} 種類のものから、重複を許して {n} 個選ぶ選び方は、
                {n} 個の「〇」と {dividers} 個の「｜ (仕切り)」を並べる順列と同じです。
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <h4 className="text-lg font-bold text-slate-200 mb-4">総数</h4>
            <div className="text-3xl font-mono text-indigo-400 font-bold mb-2">
              {combinations} 通り
            </div>
            <div className="text-slate-400 text-sm mt-4">
              <BlockMath math={`_{${n}+${r}-1}C_{${n}} = _{${totalSlots}}C_{${n}} = \\frac{${totalSlots}!}{${n}! \\cdot ${dividers}!}`} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[200px] overflow-x-auto">
          <h4 className="text-sm font-medium text-slate-400 mb-6 w-full text-left">〇と｜の並び (配列)</h4>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <AnimatePresence mode="popLayout">
              {arrangement.map((item, idx) => (
                <motion.div
                  key={`${idx}-${item}`}
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  {item === 'ball' ? (
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center border-2 border-blue-300">
                      <span className="text-white font-bold text-xs md:text-sm">〇</span>
                    </div>
                  ) : (
                    <div className="w-2 h-16 md:w-3 md:h-20 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] border border-green-300">
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 mt-2">{idx + 1}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="w-full mt-8 pt-6 border-t border-slate-800">
            <h4 className="text-sm font-medium text-slate-400 mb-4">各グループの個数 (方程式の解)</h4>
            <div className="flex justify-center items-center space-x-4">
              {binCounts.map((count, idx) => (
                <React.Fragment key={`bin-${idx}`}>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-slate-400 mb-1">グループ {String.fromCharCode(65 + idx)}</div>
                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{count}</span>
                    </div>
                  </div>
                  {idx < binCounts.length - 1 && (
                    <div className="text-slate-500 font-bold text-xl">+</div>
                  )}
                </React.Fragment>
              ))}
              <div className="text-slate-500 font-bold text-xl">=</div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 mb-1">合計</div>
                <div className="w-12 h-12 rounded-lg bg-indigo-900/50 border border-indigo-500/50 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-400">{n}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
