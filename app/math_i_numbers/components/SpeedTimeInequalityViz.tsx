"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SpeedTimeInequalityViz() {
  // Constants
  const totalDistance = 10;
  const walkSpeed = 4;
  const runSpeed = 10;
  const timeLimit = 1.5;

  // State
  const [walkDistance, setWalkDistance] = useState(5);
  const runDistance = totalDistance - walkDistance;

  // Calculations
  const walkTime = walkDistance / walkSpeed;
  const runTime = runDistance / runSpeed;
  const totalTime = walkTime + runTime;
  
  const isSuccess = totalTime <= timeLimit;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-xl text-slate-200 font-sans">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">1次不等式の文章題 (道のりと時間)</h3>
        <p className="text-sm text-slate-400">
          家から駅まで10kmの道のりを行く。歩く速さを時速4km、走る速さを時速10kmとする。<br/>
          全体で1.5時間（90分）以内に到着するには、最大で何kmまで歩くことができるか？
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Interactive Slider */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-4 flex justify-between">
            <span>歩く距離 (x km) を調整:</span>
            <span className="text-cyan-400 font-mono">{walkDistance.toFixed(1)} km</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.1"
            value={walkDistance}
            onChange={(e) => setWalkDistance(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
            <span>0km (すべて走る)</span>
            <span>10km (すべて歩く)</span>
          </div>
        </div>

        {/* Visual Map */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-4">道のりと時間の視覚化</h4>
          
          <div className="w-full h-8 bg-slate-700 rounded overflow-hidden flex mb-2 relative">
            <motion.div 
              className="h-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${(walkDistance / totalDistance) * 100}%` }}
              layout
            >
              歩き {walkDistance.toFixed(1)}km
            </motion.div>
            <motion.div 
              className="h-full bg-rose-500 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${(runDistance / totalDistance) * 100}%` }}
              layout
            >
              走り {runDistance.toFixed(1)}km
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center mt-6 p-4 rounded bg-slate-900 border border-slate-700">
            <div className="text-center">
              <div className="text-xs text-slate-400">合計所要時間</div>
              <div className={`text-2xl font-mono font-bold ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalTime.toFixed(2)} 時間
              </div>
            </div>
            <div className="text-center px-4 border-l border-slate-700">
              <div className="text-xs text-slate-400">制限時間</div>
              <div className="text-2xl font-mono font-bold text-slate-300">
                1.50 時間
              </div>
            </div>
            <div className="text-center px-4 border-l border-slate-700">
              <div className="text-xs text-slate-400">判定</div>
              <div className={`text-lg font-bold px-3 py-1 rounded-full ${isSuccess ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/50' : 'bg-rose-900/50 text-rose-400 border border-rose-500/50'}`}>
                {isSuccess ? '条件クリア' : '時間オーバー'}
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Explanation */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-4">立式と解法</h4>
          <div className="text-sm text-slate-300 space-y-3 font-mono">
            <p>歩いた道のりを <span className="text-blue-400">x</span> km とすると、走った道のりは <span className="text-rose-400">(10 - x)</span> km。</p>
            <p>時間の合計が 1.5 時間以下であるから：</p>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-center text-lg">
              <span className="text-blue-400">x/4</span> + <span className="text-rose-400">(10 - x)/10</span> ≤ 1.5
            </div>
            <p className="text-slate-400 text-xs mt-2">両辺を 20 倍して分母を払うと：</p>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-center">
              5x + 2(10 - x) ≤ 30<br/>
              5x + 20 - 2x ≤ 30<br/>
              3x ≤ 10<br/>
              x ≤ 10/3 (約 3.33 km)
            </div>
            <p className="mt-2 text-yellow-400 bg-yellow-900/20 p-2 rounded border border-yellow-700/50">
              <strong>Point:</strong> スライダーを動かして、歩く距離が3.3kmを超えると「時間オーバー」になることを確認しよう。抽象的な不等式が、物理的な「時間の壁」であることが直感的に理解できる。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
