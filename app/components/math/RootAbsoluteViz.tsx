"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const RootAbsoluteViz = () => {
  const [a, setA] = useState(-5);

  const calculateResult = () => {
    return Math.abs(a);
  };

  const isPositive = a >= 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
          インタラクティブ確認
        </h4>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">
                <InlineMath math={`a`} /> の値: {a}
              </label>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={a}
              onChange={(e) => setA(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>-10</span>
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h5 className="font-bold text-slate-700 mb-4">計算ステップ:</h5>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/50 rounded-lg text-center overflow-x-auto">
                <BlockMath math={`\\sqrt{(${a})^2} = \\sqrt{${a * a}} = ${calculateResult()}`} />
              </div>

              <div className={`p-4 rounded-lg text-center transition-colors ${isPositive ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
                <div className="font-semibold mb-2">
                  {isPositive ? (
                    <span><InlineMath math="a \ge 0" /> なので、そのまま外れます。</span>
                  ) : (
                    <span><InlineMath math="a < 0" /> なので、マイナスをつけて外します。</span>
                  )}
                </div>
                <BlockMath math={`\\sqrt{a^2} = ${isPositive ? 'a' : '-a'} = ${isPositive ? a : -a}`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <h5 className="font-bold text-indigo-900 mb-2 flex items-center">
              <span className="mr-2">💡</span> 視覚的証明
            </h5>
            <p className="text-sm text-indigo-800 mb-4">
              平方根 <InlineMath math="\sqrt{X}" /> は「<strong>正の</strong>平方根」を意味します。そのため、結果は必ず $0$ 以上にならなければなりません。
              $a$ がマイナスの時、そのまま $a$ として外すと負の数になってしまうため、「マイナスをかけて正にする」必要があります。
            </p>
            <div className="text-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold text-lg text-slate-800">
                よって、 <InlineMath math="\sqrt{a^2} = |a|" /> となります。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootAbsoluteViz;
