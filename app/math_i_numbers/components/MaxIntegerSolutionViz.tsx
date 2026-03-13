"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MaxIntegerSolutionViz() {
  const [aValue, setAValue] = useState(3.5);
  const maxInteger = Math.floor(aValue - 0.0001); // Since x < a
  
  const minValid = 3;
  const maxValid = 4;
  
  const isValid = aValue > 3 && aValue <= 4;
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">最大整数解から定数の範囲を決定</h3>
        <p className="text-slate-600 text-sm">
          問題: 不等式 <span className="font-mono bg-slate-100 px-1 rounded">x &lt; a</span> を満たす最大の整数が <span className="font-bold text-blue-600">3</span> であるとき、定数 <span className="font-mono">a</span> の値の範囲を求めよ。
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg mb-8 relative h-20">
          {/* Number Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -translate-y-1/2 rounded-full"></div>
          
          {/* Ticks and Numbers */}
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className="absolute top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2" style={{ left: `${(num - 1) * 25}%` }}>
              <div className="h-4 w-0.5 bg-slate-400 mb-1"></div>
              <span className={`text-sm font-medium ${num === 3 ? 'text-blue-600 font-bold text-lg' : 'text-slate-500'}`}>{num}</span>
            </div>
          ))}

          {/* Solution Range (x < a) */}
          <motion.div 
            className={`absolute top-1/2 h-1 -translate-y-1/2 opacity-50 ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ left: 0, right: `${100 - (aValue - 1) * 25}%` }}
          ></motion.div>

          {/* Value a */}
          <motion.div
            className="absolute top-1/2 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${(aValue - 1) * 25}%`, top: '10%' }}
          >
            <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 ${isValid ? 'border-green-500' : 'border-red-500'}`}></div>
            <div className={`text-sm font-bold mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>a = {aValue.toFixed(2)}</div>
          </motion.div>
        </div>

        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
            定数 a の値を動かす
          </label>
          <input
            type="range"
            min="1.5"
            max="4.5"
            step="0.1"
            value={aValue}
            onChange={(e) => setAValue(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="text-blue-800 font-bold mb-2">現在の状態分析</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <span className="font-mono bg-white px-1 border border-slate-200 rounded">a = {aValue.toFixed(2)}</span> のとき、
            <span className="font-mono bg-white px-1 border border-slate-200 rounded">x &lt; {aValue.toFixed(2)}</span>
          </li>
          <li className="flex items-center gap-2">
            この範囲に含まれる最大の整数: 
            <span className={`font-bold ${maxInteger === 3 ? 'text-green-600' : 'text-red-600'}`}>
              {maxInteger}
            </span>
            {maxInteger === 3 ? ' (条件クリア ✓)' : ' (条件を満たさない ✗)'}
          </li>
          <li className="mt-2 pt-2 border-t border-blue-200 font-medium">
            <span className="text-blue-700">正しい範囲:</span> 3 &lt; a ≦ 4
          </li>
        </ul>
      </div>
    </div>
  );
}
