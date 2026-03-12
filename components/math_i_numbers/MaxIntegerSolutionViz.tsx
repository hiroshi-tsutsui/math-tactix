"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MaxIntegerSolutionViz = () => {
  const [a, setA] = useState(3);
  const boundary = (a + 5) / 2;

  // Check if the maximum integer strictly below the boundary is 3
  const isCorrect = boundary > 3 && boundary <= 4;
  const maxInt = Math.ceil(boundary) - 1;

  const integers = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          最大整数解から定数の範囲を決定
        </h2>
        <p className="text-gray-300">
          不等式 <span className="font-mono text-xl text-blue-300">x &lt; (a + 5) / 2</span> を満たす最大の整数 <span className="font-mono text-xl">x</span> が <span className="font-bold text-yellow-400">3</span> となるような定数 <span className="font-mono text-xl">a</span> の値の範囲を求めてみましょう。
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-gray-300 font-bold">定数 <span className="font-mono text-xl text-purple-400">a</span> の値:</label>
          <span className="font-mono text-2xl font-bold text-purple-400">{a.toFixed(1)}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="6" 
          step="0.1" 
          value={a} 
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />

        <div className="bg-gray-900/50 p-4 rounded-xl flex items-center justify-center gap-4">
          <span className="text-gray-400 font-bold">境界値 (a+5)/2 =</span>
          <span className="font-mono text-2xl font-bold text-blue-400">{boundary.toFixed(2)}</span>
        </div>
      </div>

      {/* Number Line Visualization */}
      <div className="relative w-full max-w-3xl h-48 bg-gray-900/80 rounded-2xl border border-gray-700 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Number line track */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-700 rounded-full translate-y-[-50%]"></div>
        
        {/* Valid Region Highlight (Blue) */}
        <div 
          className="absolute top-1/2 left-8 h-1 bg-blue-500 rounded-l-full translate-y-[-50%]"
          style={{ width: `calc(${(Math.max(0, Math.min(boundary, 6)) / 6) * 100}% - 32px)` }}
        ></div>

        {/* Boundary Marker (Open Circle with Arrow) */}
        <motion.div 
          className="absolute top-1/2 flex flex-col items-center justify-center pointer-events-none"
          style={{ left: `calc(32px + ${(boundary / 6) * 100}%)`, transform: 'translate(-50%, -50%)' }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative w-5 h-5 rounded-full border-2 border-blue-400 bg-gray-900 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <div className="absolute bottom-full mb-3 text-blue-300 font-mono text-sm font-bold whitespace-nowrap bg-gray-800 px-2 py-0.5 rounded border border-gray-700 shadow-lg">
              (a+5)/2
            </div>
          </div>
          <div className="absolute right-2 top-1/2 w-8 h-0.5 bg-blue-400 translate-y-[-50%] opacity-80">
            <div className="absolute left-0 top-1/2 w-2 h-2 border-l-2 border-b-2 border-blue-400 rotate-45 translate-y-[-50%] translate-x-[-2px]"></div>
          </div>
        </motion.div>

        {/* Integer Markers */}
        <div className="absolute top-1/2 left-8 right-8 flex justify-between transform translate-y-[-50%] pointer-events-none">
          {integers.map(i => {
            const isIncluded = i < boundary;
            const isTarget = i === 3;
            const isMaxIncluded = isIncluded && i === maxInt;

            return (
              <div key={i} className="flex flex-col items-center relative w-0">
                {/* Tick mark */}
                <div className={`w-0.5 h-4 mb-2 ${isIncluded ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
                
                {/* Number */}
                <span className={`
                  font-mono text-lg transition-colors duration-200 mt-2
                  ${isMaxIncluded ? 'text-yellow-400 font-bold scale-125 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : isIncluded ? 'text-blue-200' : 'text-gray-500'}
                `}>
                  {i}
                </span>

                {/* Target label */}
                {isTarget && (
                  <div className={`absolute top-[40px] text-xs font-bold whitespace-nowrap px-2 py-1 rounded shadow-lg
                    ${isMaxIncluded ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}
                  `}>
                    目標: 最大整数
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Logic Explanation */}
      <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700 w-full max-w-2xl space-y-4">
        <h3 className="text-lg font-bold text-gray-200 border-b border-gray-700 pb-2">境界値の論理チェック</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${boundary > 3 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {boundary > 3 ? '✓' : '✗'}
            </div>
            <span className="text-gray-300 leading-relaxed">
              <span className="font-mono font-bold text-yellow-400">3</span> を解に含む必要があるため、境界は3より右。<br/>
              <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-blue-300">3 &lt; (a+5)/2</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${boundary <= 4 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {boundary <= 4 ? '✓' : '✗'}
            </div>
            <span className="text-gray-300 leading-relaxed">
              <span className="font-mono font-bold text-gray-400">4</span> は解に含んではいけないため、境界は4以下。<br/>
              <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-blue-300">(a+5)/2 ≤ 4</span>
              <br/>
              <span className="text-sm text-gray-400 mt-1 block border-l-2 border-blue-500/50 pl-2">※ 不等号が <span className="text-blue-400 font-bold">&lt; (白丸)</span> なので、丁度 <span className="text-gray-300 font-bold">4</span> に乗っても 4 は含まれない。だから <span className="font-bold text-white">≤</span> が正解。</span>
            </span>
          </div>
        </div>
        
        {isCorrect ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-center shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          >
            <div className="text-green-400 font-bold mb-1 text-lg">条件クリア！</div>
            <div className="text-green-300 text-sm mb-3">最大の整数が3になっています。</div>
            <div className="font-mono text-2xl font-bold text-white tracking-widest bg-gray-900 py-2 rounded-lg border border-gray-700 inline-block px-6">
              1 &lt; a ≤ 3
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-center"
          >
            <div className="text-red-400 font-bold mb-1 text-lg">条件を満たしていません</div>
            <div className="text-red-300">現在の最大整数: {maxInt >= 0 ? maxInt : "なし"}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MaxIntegerSolutionViz;
