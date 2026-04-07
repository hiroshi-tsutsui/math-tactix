"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import HintButton from '../../components/HintButton';

export default function OutlierViz() {
  const [outlierValue, setOutlierValue] = useState<number>(50);
  
  // Base dataset (e.g., test scores out of 100)
  const baseData = [45, 48, 50, 52, 55];
  
  const currentData = useMemo(() => {
    const data = [...baseData, outlierValue].sort((a, b) => a - b);
    return data;
  }, [outlierValue]);

  const mean = useMemo(() => {
    return currentData.reduce((a, b) => a + b, 0) / currentData.length;
  }, [currentData]);

  const median = useMemo(() => {
    const mid = Math.floor(currentData.length / 2);
    if (currentData.length % 2 === 0) {
      return (currentData[mid - 1] + currentData[mid]) / 2;
    }
    return currentData[mid];
  }, [currentData]);

  const baseMean = baseData.reduce((a, b) => a + b, 0) / baseData.length;
  const baseMedian = baseData[Math.floor(baseData.length / 2)];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        外れ値が平均値と中央値に与える影響
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-slate-700 text-sm">
        <p>
          5人のテストの点数（45, 48, 50, 52, 55）に、6人目の点数（<span className="font-bold text-red-600">外れ値</span>）を追加します。
          極端な値が入ったとき、<span className="font-bold text-blue-600">平均値（Mean）</span>と<span className="font-bold text-emerald-600">中央値（Median）</span>がどう動くか観察しましょう。
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          6人目の点数（追加する値）: <span className="text-lg font-bold text-red-600">{outlierValue}</span>
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={outlierValue}
          onChange={(e) => setOutlierValue(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0 (極端に低い)</span>
          <span>50 (普通)</span>
          <span>100</span>
          <span>200 (極端に高い)</span>
        </div>
      </div>

      <div className="relative h-32 bg-slate-50 rounded-lg border border-slate-200 mb-8 overflow-hidden">
        {/* Number line axis */}
        <div className="absolute bottom-6 left-0 right-0 border-b-2 border-slate-300"></div>
        <div className="absolute bottom-2 left-4 text-xs text-slate-400">0</div>
        <div className="absolute bottom-2 right-4 text-xs text-slate-400">200</div>
        
        {/* Base Data Points */}
        {baseData.map((val, idx) => (
          <div
            key={`base-${idx}`}
            className="absolute bottom-6 w-4 h-4 -ml-2 rounded-full bg-slate-400 border-2 border-white z-10"
            style={{ left: `${(val / 200) * 100}%`, transform: 'translateY(50%)' }}
            title={`基本データ: ${val}`}
          />
        ))}

        {/* Outlier Point */}
        <motion.div
          className="absolute bottom-6 w-5 h-5 -ml-2.5 rounded-full bg-red-500 border-2 border-white z-20 shadow-sm"
          animate={{ left: `${(outlierValue / 200) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ transform: 'translateY(50%)' }}
        />

        {/* Median Line */}
        <motion.div
          className="absolute top-0 bottom-6 w-0.5 bg-emerald-500 z-0"
          animate={{ left: `${(median / 200) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-2 -translate-x-1/2 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap">
            中央値: {median.toFixed(1)}
          </div>
        </motion.div>

        {/* Mean Line */}
        <motion.div
          className="absolute top-8 bottom-6 w-0.5 bg-blue-500 z-0"
          animate={{ left: `${(mean / 200) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-2 -translate-x-1/2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap">
            平均値: {mean.toFixed(1)}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-sm text-blue-600 font-bold mb-1">平均値（Mean）</div>
          <div className="text-2xl font-black text-blue-800">{mean.toFixed(1)}</div>
          <div className="text-xs text-slate-500 mt-2">
            すべての値の合計 ÷ 人数。<br/>
            極端な値に<span className="font-bold text-red-500">強く引っ張られる</span>。
          </div>
        </div>
        
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="text-sm text-emerald-600 font-bold mb-1">中央値（Median）</div>
          <div className="text-2xl font-black text-emerald-800">{median.toFixed(1)}</div>
          <div className="text-xs text-slate-500 mt-2">
            順位が真ん中の人の値。<br/>
            極端な値の影響を<span className="font-bold text-emerald-600">ほとんど受けない</span>（ロバスト性）。
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: "外れ値は平均値に大きく影響しますが、中央値にはほとんど影響しません" },
        { step: 2, text: "外れ値の判定基準：Q1 - 1.5×IQR 未満、または Q3 + 1.5×IQR 超過" },
        { step: 3, text: "中央値は順位が真ん中の値なので、外れ値に対して頑健（ロバスト）です" },
      ]} />
    </div>
  );
}
