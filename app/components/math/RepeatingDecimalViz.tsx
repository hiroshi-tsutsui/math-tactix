"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function RepeatingDecimalViz() {
  const [digits, setDigits] = useState<number>(12);
  const [length, setLength] = useState<number>(2);

  const displayDecimal = length === 1 
    ? `0.\\dot{${digits}}`
    : `0.\\dot{${Math.floor(digits/10)}}\\dot{${digits%10}}`;

  const mult = Math.pow(10, length);
  const fractionStr = `\\frac{${digits}}{${mult - 1}}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-800">循環小数から分数への変換</h3>
        <p className="text-sm text-slate-500 mt-1">循環する部分をずらして消去する仕組みを視覚化します。</p>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">循環する数字</label>
            <input 
              type="range" 
              min={length === 1 ? 1 : 10} 
              max={length === 1 ? 9 : 99} 
              value={digits}
              onChange={(e) => setDigits(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="text-right text-sm font-medium text-indigo-600">{digits}</div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">循環の長さ</label>
            <input 
              type="range" 
              min="1" 
              max="2" 
              value={length}
              onChange={(e) => {
                const newLen = Number(e.target.value);
                setLength(newLen);
                if (newLen === 1) setDigits(Math.min(9, digits));
                if (newLen === 2) setDigits(Math.max(10, digits));
              }}
              className="w-full accent-indigo-500"
            />
            <div className="text-right text-sm font-medium text-indigo-600">{length}桁</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-6">
          <div className="bg-indigo-50 text-indigo-900 p-6 rounded-xl space-y-4">
            <p className="font-medium text-sm">ステップ 1: <InlineMath math="x" /> とおいて式を立てる</p>
            <BlockMath math={`x = 0.${digits}${digits}${digits}\\dots`} />
          </div>

          <div className="bg-emerald-50 text-emerald-900 p-6 rounded-xl space-y-4">
            <p className="font-medium text-sm">ステップ 2: 小数点をずらして循環部分を揃える</p>
            <p className="text-xs text-emerald-700">循環部分が{length}桁なので、両辺を{mult}倍します。</p>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-max border border-emerald-200 bg-white p-4 rounded-lg shadow-sm">
                <BlockMath math={`\\begin{aligned} ${mult}x &= ${digits}.${digits}${digits}${digits}\\dots \\\\ -) \\quad x &= \\phantom{${digits}.}0.${digits}${digits}${digits}\\dots \\\\ \\hline ${mult-1}x &= ${digits} \\end{aligned}`} />
              </div>
            </div>
          </div>

          <div className="bg-sky-50 text-sky-900 p-6 rounded-xl space-y-4">
            <p className="font-medium text-sm">ステップ 3: 方程式を解く</p>
            <BlockMath math={`x = ${fractionStr}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
