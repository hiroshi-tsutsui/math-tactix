"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function RootAbsoluteSimplificationViz() {
  const [xValue, setXValue] = useState(3.5);

  // The expression is P = \sqrt{(x-2)^2} + \sqrt{(x-5)^2} = |x-2| + |x-5|
  
  const getCase = (x: number) => {
    if (x < 2) return 1;
    if (x >= 2 && x < 5) return 2;
    return 3;
  };

  const currentCase = getCase(xValue);

  const getSimplifiedExpression = (c: number) => {
    if (c === 1) return "-(x-2) - (x-5) = -2x + 7";
    if (c === 2) return "(x-2) - (x-5) = 3";
    if (c === 3) return "(x-2) + (x-5) = 2x - 7";
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">【問題】次の式を簡単にせよ</h3>
        <BlockMath math="P = \sqrt{x^2 - 4x + 4} + \sqrt{x^2 - 10x + 25}" />
        
        <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded text-sm text-slate-700">
          <p className="font-bold text-indigo-700 mb-2">【ステップ1】ルートの中を平方完成（因数分解）する</p>
          <BlockMath math="P = \sqrt{(x-2)^2} + \sqrt{(x-5)^2}" />
          <p className="mt-2 text-red-600 font-bold">⚠️ ここで P = (x-2) + (x-5) = 2x-7 とするのは絶対NG！</p>
          <p className="mt-1">必ず <InlineMath math="\sqrt{A^2} = |A|" /> の公式を使い、絶対値記号をつけて外します。</p>
          <BlockMath math="P = |x-2| + |x-5|" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">【ステップ2】数直線で x の位置を動かして場合分けを確認</h3>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            x の値: {xValue.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="7"
            step="0.1"
            value={xValue}
            onChange={(e) => setXValue(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="relative h-24 mt-8">
          {/* Number line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -translate-y-1/2"></div>
          
          {/* Boundaries */}
          <div className="absolute top-1/2 left-[28.5%] w-3 h-3 bg-slate-800 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-[71.4%] w-3 h-3 bg-slate-800 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="absolute top-[60%] left-[28.5%] -translate-x-1/2 text-sm font-bold">2</div>
          <div className="absolute top-[60%] left-[71.4%] -translate-x-1/2 text-sm font-bold">5</div>

          {/* Current x position */}
          <div 
            className="absolute top-1/2 w-4 h-4 bg-indigo-600 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-lg transition-all duration-100 border-2 border-white"
            style={{ left: `${(xValue / 7) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs py-1 px-2 rounded font-bold">
              x
            </div>
          </div>
          
          {/* Regions shading */}
          <div className={`absolute top-1/4 h-1/2 left-0 w-[28.5%] transition-colors duration-300 ${currentCase === 1 ? 'bg-orange-100 opacity-50' : 'bg-transparent'}`}></div>
          <div className={`absolute top-1/4 h-1/2 left-[28.5%] w-[42.9%] transition-colors duration-300 ${currentCase === 2 ? 'bg-green-100 opacity-50' : 'bg-transparent'}`}></div>
          <div className={`absolute top-1/4 h-1/2 left-[71.4%] right-0 transition-colors duration-300 ${currentCase === 3 ? 'bg-blue-100 opacity-50' : 'bg-transparent'}`}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg border-2 transition-all ${currentCase === 1 ? 'border-orange-500 bg-orange-50 scale-105' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
            <h4 className="font-bold text-orange-700 text-center mb-2">[1] x &lt; 2 のとき</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>x - 2 は <span className="font-bold text-red-500">負</span> (-) なので: -(x - 2)</p>
              <p>x - 5 は <span className="font-bold text-red-500">負</span> (-) なので: -(x - 5)</p>
            </div>
            <div className="mt-3 font-bold text-center">
              P = -2x + 7
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 transition-all ${currentCase === 2 ? 'border-green-500 bg-green-50 scale-105' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
            <h4 className="font-bold text-green-700 text-center mb-2">[2] 2 &le; x &lt; 5 のとき</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>x - 2 は <span className="font-bold text-blue-600">正</span> (+) なので: +(x - 2)</p>
              <p>x - 5 は <span className="font-bold text-red-500">負</span> (-) なので: -(x - 5)</p>
            </div>
            <div className="mt-3 font-bold text-center">
              P = 3 <span className="text-xs text-slate-500 font-normal">(定数になる！)</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 transition-all ${currentCase === 3 ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
            <h4 className="font-bold text-blue-700 text-center mb-2">[3] x &ge; 5 のとき</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>x - 2 は <span className="font-bold text-blue-600">正</span> (+) なので: +(x - 2)</p>
              <p>x - 5 は <span className="font-bold text-blue-600">正</span> (+) なので: +(x - 5)</p>
            </div>
            <div className="mt-3 font-bold text-center">
              P = 2x - 7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
