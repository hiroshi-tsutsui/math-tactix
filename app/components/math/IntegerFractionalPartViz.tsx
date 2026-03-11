"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Target, Lightbulb, ArrowRight } from 'lucide-react';

export default function IntegerFractionalPartViz() {
  const [n, setN] = useState(5);
  const root = Math.sqrt(n);
  const intPart = Math.floor(root);
  const fracPart = root - intPart;
  
  // Find surrounding perfect squares
  const lowerSq = intPart * intPart;
  const upperSq = (intPart + 1) * (intPart + 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" />
          無理数の整数部分と小数部分
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                平方根の中身 (n) を調整: n = {n}
              </label>
              <input
                type="range"
                min="2"
                max="24"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                ※ 完全平方数(4, 9, 16等)は無理数にならないので省いて考えます。
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <div className="text-lg text-slate-800 mb-2">
                対象の数: <span className="font-bold text-indigo-600">√{n}</span>
              </div>
              <div className="text-sm text-slate-600 font-mono mb-4">
                √{n} ≒ {root.toFixed(3)}...
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-slate-700">
                  <span className="w-24 font-semibold">整数部分 (a):</span>
                  <span className="font-mono text-lg text-emerald-600">{intPart}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <span className="w-24 font-semibold">小数部分 (b):</span>
                  <span className="font-mono text-lg text-amber-600">√{n} - {intPart}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 space-y-4">
            <h3 className="font-bold text-indigo-800 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              小数部分の「正体」
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              小数部分は無限に続く数字 (0.{fracPart.toFixed(3)}...) なので、数字そのものでは書き表せません。
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm font-mono text-center text-slate-800">
              (元の数) = (整数部分) + (小数部分)
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              だから、移項して引き算の形にします：
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm font-mono text-center font-bold text-amber-600 border border-amber-200">
              (小数部分) = (元の数) - (整数部分)
            </div>
          </div>
        </div>

        {/* Visual Number Line */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-6 text-center">数直線上での可視化</h3>
          <div className="relative h-32 max-w-2xl mx-auto">
            {/* Base Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -translate-y-1/2 rounded-full" />
            
            {/* Integers */}
            {[intPart, intPart + 1].map((val) => {
              const leftPercent = ((val - intPart + 0.5) / 2) * 100;
              return (
                <div key={val} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${leftPercent}%` }}>
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <div className="mt-2 font-bold text-slate-700 text-lg">{val}</div>
                  <div className="mt-1 text-xs text-slate-400">√{val * val}</div>
                </div>
              );
            })}

            {/* Root Position */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              initial={{ left: '25%' }}
              animate={{ left: `${((root - intPart + 0.5) / 2) * 100}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-200" />
              <div className="mb-8 font-bold text-indigo-600 text-lg absolute bottom-full pb-2">√{n}</div>
            </motion.div>

            {/* Gap Highlights */}
            {/* Integer Part highlight */}
            <div className="absolute top-1/2 mt-8 left-0 text-sm font-bold text-emerald-600 text-right pr-4" style={{ width: '25%' }}>
              整数部分: {intPart}
            </div>
            
            {/* Fractional Part Braces/Line */}
            <motion.div 
              className="absolute top-1/2 h-2 bg-amber-400 mt-2 rounded-full"
              initial={{ left: '25%', width: 0 }}
              animate={{ 
                left: '25%', 
                width: `${((root - intPart) / 2) * 100}%` 
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <motion.div 
              className="absolute top-1/2 mt-5 text-sm font-bold text-amber-600 whitespace-nowrap"
              initial={{ left: '25%' }}
              animate={{ left: `${25 + ((root - intPart) / 4) * 100}%` }}
              transition={{ type: "spring", stiffness: 100 }}
              style={{ transform: 'translateX(-50%)' }}
            >
              小数部分 (√{n} - {intPart})
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
