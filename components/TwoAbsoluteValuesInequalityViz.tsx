"use client";

import React, { useState, useEffect } from 'react';

export default function TwoAbsoluteValuesInequalityViz() {
  const [x, setX] = useState<number>(0);

  // function: y = |x - 2| + |x + 3|
  // We want to visualize |x - 2| + |x + 3| < 7
  
  const y = Math.abs(x - 2) + Math.abs(x + 3);
  const target = 7;
  
  // boundaries are x = 2, x = -3
  // x < -3: y = -(x-2) - (x+3) = -2x - 1
  // -3 <= x < 2: y = -(x-2) + (x+3) = 5
  // x >= 2: y = (x-2) + (x+3) = 2x + 1

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">絶対値を含む不等式: |x - 2| + |x + 3| &lt; 7</h3>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-slate-700 text-sm mb-2">
          <strong>目標:</strong> 関数 <code>y = |x - 2| + |x + 3|</code> のグラフを描き、<code>y &lt; 7</code> となる <code>x</code> の範囲を視覚的に理解します。
        </p>
        <p className="text-slate-700 text-sm">
          絶対値の中身が 0 になる <code>x = -3</code> と <code>x = 2</code> を境に場合分けを行います。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-square bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            {/* Graph Visualization */}
            <svg viewBox="-6 -2 12 14" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Grid Lines */}
              {[0, 2, 4, 6, 8, 10].map(y => (
                <line key={`h-${y}`} x1="-6" y1={y} x2="6" y2={y} stroke="#e2e8f0" strokeWidth="0.05" />
              ))}
              {[-4, -2, 0, 2, 4].map(x => (
                <line key={`v-${x}`} x1={x} y1="-2" x2={x} y2="12" stroke="#e2e8f0" strokeWidth="0.05" />
              ))}
              
              {/* Axes */}
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#94a3b8" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2="12" stroke="#94a3b8" strokeWidth="0.1" />
              
              {/* y = 7 line */}
              <line x1="-6" y1="7" x2="6" y2="7" stroke="#ef4444" strokeWidth="0.15" strokeDasharray="0.3,0.3" />
              <text x="-5.5" y="6.5" fill="#ef4444" fontSize="0.6" fontWeight="bold">y = 7</text>

              {/* The function y = |x - 2| + |x + 3| */}
              {/* Left piece: x < -3 -> y = -2x - 1 */}
              <line x1="-6" y1={11} x2="-3" y2={5} stroke="#3b82f6" strokeWidth="0.15" />
              {/* Middle piece: -3 <= x <= 2 -> y = 5 */}
              <line x1="-3" y1={5} x2="2" y2={5} stroke="#3b82f6" strokeWidth="0.15" />
              {/* Right piece: x > 2 -> y = 2x + 1 */}
              <line x1="2" y1={5} x2="5" y2={11} stroke="#3b82f6" strokeWidth="0.15" />
              
              {/* Current x point */}
              <circle cx={x} cy={y} r="0.2" fill={y < 7 ? "#22c55e" : "#ef4444"} />
              <line x1={x} y1="0" x2={x} y2={y} stroke={y < 7 ? "#22c55e" : "#ef4444"} strokeWidth="0.1" strokeDasharray="0.2,0.2" />
              
              {/* Solution range highlight on x-axis (-4 < x < 3) */}
              <line x1="-4" y1="0" x2="3" y2="0" stroke="#22c55e" strokeWidth="0.4" opacity="0.3" />
              <circle cx="-4" cy="0" r="0.15" fill="white" stroke="#22c55e" strokeWidth="0.1" />
              <circle cx="3" cy="0" r="0.15" fill="white" stroke="#22c55e" strokeWidth="0.1" />
            </svg>
          </div>
          <div className="mt-6 w-full max-w-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              x の値: <span className="text-blue-600 font-bold">{x.toFixed(1)}</span>
            </label>
            <input 
              type="range" 
              min="-6" max="6" step="0.1" 
              value={x} 
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4 text-sm text-slate-700">
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">現在の状態 (x = {x.toFixed(1)})</h4>
            <ul className="space-y-1">
              <li>|x - 2| = |{(x - 2).toFixed(1)}| = <span className="font-mono">{Math.abs(x - 2).toFixed(1)}</span></li>
              <li>|x + 3| = |{(x + 3).toFixed(1)}| = <span className="font-mono">{Math.abs(x + 3).toFixed(1)}</span></li>
              <li>y = <span className="font-mono">{y.toFixed(1)}</span></li>
              <li className={`font-bold mt-2 ${y < 7 ? 'text-green-600' : 'text-red-600'}`}>
                {y < 7 ? '条件を満たす (y < 7)' : '条件を満たさない (y >= 7)'}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">場合分けによる解法</h4>
            <div className="space-y-3">
              <div className={`p-2 rounded ${x < -3 ? 'bg-blue-100 border border-blue-300' : 'bg-slate-50'}`}>
                <p className="font-bold">[1] x &lt; -3 のとき</p>
                <p>-(x - 2) - (x + 3) &lt; 7</p>
                <p>-2x - 1 &lt; 7  ⇒  x &gt; -4</p>
                <p className="text-xs text-slate-500 mt-1">範囲との共通部分は -4 &lt; x &lt; -3</p>
              </div>
              <div className={`p-2 rounded ${x >= -3 && x < 2 ? 'bg-blue-100 border border-blue-300' : 'bg-slate-50'}`}>
                <p className="font-bold">[2] -3 ≦ x &lt; 2 のとき</p>
                <p>-(x - 2) + (x + 3) &lt; 7</p>
                <p>5 &lt; 7 (常に成立)</p>
                <p className="text-xs text-slate-500 mt-1">範囲との共通部分は -3 ≦ x &lt; 2</p>
              </div>
              <div className={`p-2 rounded ${x >= 2 ? 'bg-blue-100 border border-blue-300' : 'bg-slate-50'}`}>
                <p className="font-bold">[3] x ≧ 2 のとき</p>
                <p>(x - 2) + (x + 3) &lt; 7</p>
                <p>2x + 1 &lt; 7  ⇒  x &lt; 3</p>
                <p className="text-xs text-slate-500 mt-1">範囲との共通部分は 2 ≦ x &lt; 3</p>
              </div>
              <div className="bg-green-50 p-2 border border-green-200 rounded">
                <p className="font-bold text-green-800">最終的な解:</p>
                <p>[1], [2], [3] を合わせて、<strong>-4 &lt; x &lt; 3</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
