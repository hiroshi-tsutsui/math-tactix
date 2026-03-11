"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function HigherDegreeValueViz() {
  const [step, setStep] = useState(1);

  // Example: x = (1 + sqrt(5))/2
  // 2x - 1 = sqrt(5) => 4x^2 - 4x + 1 = 5 => 4x^2 - 4x - 4 = 0 => x^2 - x - 1 = 0
  // Goal: Evaluate x^3 + x^2 - x + 2
  // Division: x^3 + x^2 - x + 2 = (x^2 - x - 1)(x + 2) + (2x + 4)

  const maxStep = 4;

  const nextStep = () => {
    if (step < maxStep) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          次数下げによる高次式の値
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          無理数をそのまま代入するのではなく、<span className="font-semibold text-blue-600">2次方程式を作って次数を下げる（割り算する）</span>テクニックを視覚化します。
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Problem Statement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-slate-700 font-bold mb-2">問題</p>
          <div className="text-center">
            <BlockMath math="x = \frac{1 + \sqrt{5}}{2} \text{ のとき、次の式の値を求めよ。}" />
            <BlockMath math="P = x^3 + x^2 - x + 2" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1: Create Equation */}
          <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 hidden'}`}>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-emerald-700 text-sm mb-2">Step 1: x を解にもつ2次方程式を作る</h4>
              <p className="text-sm text-slate-600 mb-2">
                ルートだけを右辺に残して両辺を2乗します。
              </p>
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center gap-2 text-sm text-slate-800">
                <BlockMath math="x = \frac{1 + \sqrt{5}}{2}" />
                <BlockMath math="2x - 1 = \sqrt{5}" />
                <BlockMath math="(2x - 1)^2 = 5" />
                <BlockMath math="4x^2 - 4x + 1 = 5" />
                <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded">
                  <BlockMath math="x^2 - x - 1 = 0" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Division */}
          <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 hidden'}`}>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-blue-700 text-sm mb-2">Step 2: 高次式を2次方程式で割る</h4>
              <p className="text-sm text-slate-600 mb-2">
                <InlineMath math="P" /> を <InlineMath math="x^2 - x - 1" /> で割ります。
                <br/>(商：<InlineMath math="x + 2" />、余り：<InlineMath math="2x + 4" />)
              </p>
              <div className="bg-slate-50 p-4 rounded-lg flex justify-center text-sm text-slate-800">
                <BlockMath math="P = (x^2 - x - 1)(x + 2) + (2x + 4)" />
              </div>
            </div>
          </div>

          {/* Step 3: Zero Out */}
          <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 hidden'}`}>
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-bold text-amber-700 text-sm mb-2">Step 3: 0 になる部分を消去（次数下げ）</h4>
              <p className="text-sm text-slate-600 mb-2">
                Step 1より <InlineMath math="x^2 - x - 1 = 0" /> なので、<span className="font-bold text-amber-600">前の大きな塊が丸ごと 0 になって消えます</span>。
              </p>
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center gap-2 text-sm text-slate-800">
                <BlockMath math="P = \underbrace{(x^2 - x - 1)}_{= 0}(x + 2) + (2x + 4)" />
                <div className="bg-amber-100 px-4 py-2 rounded text-amber-800 font-bold">
                  <BlockMath math="P = 0 \cdot (x + 2) + 2x + 4 = 2x + 4" />
                </div>
                <p className="text-xs text-amber-700 mt-1">※ 3次式が一気に1次式になりました！</p>
              </div>
            </div>
          </div>

          {/* Step 4: Final Value */}
          <div className={`transition-all duration-500 ${step >= 4 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 hidden'}`}>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-bold text-indigo-700 text-sm mb-2">Step 4: 1次式に代入する</h4>
              <p className="text-sm text-slate-600 mb-2">
                小さくなった式に元の <InlineMath math="x" /> を代入します。
              </p>
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center gap-2 text-sm text-slate-800">
                <BlockMath math="P = 2x + 4" />
                <BlockMath math="P = 2\left(\frac{1 + \sqrt{5}}{2}\right) + 4" />
                <BlockMath math="P = (1 + \sqrt{5}) + 4" />
                <div className="bg-indigo-100 text-indigo-800 font-bold text-xl px-6 py-3 rounded-lg shadow-sm border border-indigo-200">
                  <InlineMath math="5 + \sqrt{5}" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            前のステップ
          </button>
          
          <div className="flex gap-1">
            {[...Array(maxStep)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i + 1 <= step ? 'bg-blue-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            disabled={step === maxStep}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700"
          >
            次のステップ
          </button>
        </div>
      </div>
    </div>
  );
}
