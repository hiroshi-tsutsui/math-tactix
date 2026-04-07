"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calculator } from 'lucide-react';
import HintButton from '../../components/HintButton';

const CombinedVarianceViz = () => {
  const [meanA, setMeanA] = useState(50);
  const [meanB, setMeanB] = useState(70);
  const [varA, setVarA] = useState(100);
  const [varB, setVarB] = useState(100);
  const [sizeA, setSizeA] = useState(20);
  const [sizeB, setSizeB] = useState(30);

  const totalSize = sizeA + sizeB;
  const totalMean = (sizeA * meanA + sizeB * meanB) / totalSize;
  const combinedVar = (sizeA * (varA + Math.pow(meanA - totalMean, 2)) + sizeB * (varB + Math.pow(meanB - totalMean, 2))) / totalSize;

  const maxDisplayVal = 100;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          2つの集団の結合と分散
        </h3>
        <p className="text-slate-600 text-sm mt-1">
          集団Aと集団Bを合わせた全体の分散は、各集団の「分散」だけでなく、「各集団の平均と全体平均のズレの2乗」も足し合わせる必要があります。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">集団A (Group A)</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block">人数 $n_A$ : {sizeA}人</label>
                <input type="range" min="10" max="100" step="5" value={sizeA} onChange={(e) => setSizeA(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block">平均 $\{'\bar{x}_A'}$ : {meanA}</label>
                <input type="range" min="20" max="80" value={meanA} onChange={(e) => setMeanA(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block">分散 $V_A$ : {varA}</label>
                <input type="range" min="10" max="400" step="10" value={varA} onChange={(e) => setVarA(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">集団B (Group B)</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block">人数 $n_B$ : {sizeB}人</label>
                <input type="range" min="10" max="100" step="5" value={sizeB} onChange={(e) => setSizeB(Number(e.target.value))} className="w-full accent-green-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block">平均 $\{'\bar{x}_B'}$ : {meanB}</label>
                <input type="range" min="20" max="80" value={meanB} onChange={(e) => setMeanB(Number(e.target.value))} className="w-full accent-green-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block">分散 $V_B$ : {varB}</label>
                <input type="range" min="10" max="400" step="10" value={varB} onChange={(e) => setVarB(Number(e.target.value))} className="w-full accent-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="relative h-48 w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="absolute top-2 left-2 text-xs font-bold text-slate-400">データ分布 (概念図)</div>
            
            {/* Axis */}
            <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-slate-300"></div>
            <div className="absolute bottom-1 left-4 text-[10px] text-slate-400">0</div>
            <div className="absolute bottom-1 right-4 text-[10px] text-slate-400">100</div>

            {/* Group A */}
            <motion.div 
              className="absolute bottom-4 h-16 bg-blue-500/30 border-2 border-blue-500 rounded-t-lg flex items-center justify-center text-blue-800 font-bold"
              animate={{
                left: `calc(1rem + ${(meanA - Math.sqrt(varA)) / 100} * (100% - 2rem))`,
                width: `calc(${2 * Math.sqrt(varA) / 100} * (100% - 2rem))`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              A
            </motion.div>
            <motion.div 
              className="absolute bottom-20 w-px h-6 bg-blue-500"
              animate={{ left: `calc(1rem + ${meanA / 100} * (100% - 2rem))` }}
            />

            {/* Group B */}
            <motion.div 
              className="absolute bottom-4 h-16 bg-green-500/30 border-2 border-green-500 rounded-t-lg flex items-center justify-center text-green-800 font-bold"
              animate={{
                left: `calc(1rem + ${(meanB - Math.sqrt(varB)) / 100} * (100% - 2rem))`,
                width: `calc(${2 * Math.sqrt(varB) / 100} * (100% - 2rem))`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              B
            </motion.div>
            <motion.div 
              className="absolute bottom-20 w-px h-6 bg-green-500"
              animate={{ left: `calc(1rem + ${meanB / 100} * (100% - 2rem))` }}
            />

            {/* Total Mean */}
            <motion.div 
              className="absolute top-6 bottom-4 w-0.5 bg-purple-500 z-10"
              animate={{ left: `calc(1rem + ${totalMean / 100} * (100% - 2rem))` }}
            />
            <motion.div 
              className="absolute top-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded"
              animate={{ left: `calc(1rem + ${totalMean / 100} * (100% - 2rem) - 1.5rem)` }}
            >
              全体平均
            </motion.div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3">結合後の全体データ</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-600 mb-1">全体平均 $\{'\bar{x}_{total}'}$</div>
                <div className="text-2xl font-black text-purple-800">{totalMean.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-600 mb-1">全体分散 {"96330V_{total}96330"}</div>
                <div className="text-2xl font-black text-purple-800">{combinedVar.toFixed(1)}</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-purple-200/50 space-y-2">
              <div className="flex justify-between text-xs text-purple-700">
                <span>集団Aの内部ズレ寄与:</span>
                <span className="font-mono">{((sizeA * varA) / totalSize).toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs text-purple-700">
                <span>集団Bの内部ズレ寄与:</span>
                <span className="font-mono">{((sizeB * varB) / totalSize).toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-rose-600 bg-rose-50 p-1.5 rounded">
                <span>平均値同士のズレ寄与 (AとBの差):</span>
                <span className="font-mono">
                  {((sizeA * Math.pow(meanA - totalMean, 2) + sizeB * Math.pow(meanB - totalMean, 2)) / totalSize).toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-tight">
                ※「平均値同士のズレ寄与」があるため、単純な分散の平均値よりも全体の分散は大きくなります。
              </p>
            </div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: "全体の平均は各群の平均の加重平均で求められます" },
        { step: 2, text: "全体の分散 = 群内分散の加重平均 + 群間分散（平均値のズレの寄与）" },
        { step: 3, text: "平均値のズレがあるため、単純な分散の平均よりも全体の分散は大きくなります" },
      ]} />
    </div>
  );
};

export default CombinedVarianceViz;
