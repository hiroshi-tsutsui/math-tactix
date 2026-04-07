"use client";

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import MathComponent from './MathComponent';
import HintButton from '../../components/HintButton';

export default function ContradictionViz() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">

            {step === 0 && (
                <div className="text-center animate-fade-in">
                    <div className="text-xl font-bold mb-4">目標: <MathComponent tex="\sqrt{2}" /> は無理数であることを証明せよ</div>
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold">
                        背理法のスタート：<br/>「有理数である（分数で表せる）」と【仮定】する！
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="\sqrt{2} = \frac{p}{q}" className="text-3xl font-bold block mb-4" />
                    <div className="text-sm text-slate-500 mb-2">（pとqは互いに素な自然数）</div>
                    <div className="flex items-center gap-4 text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100 font-bold">
                        両辺を2乗して分母を払うと…<br/>
                        <MathComponent tex="2q^2 = p^2" />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="2 \times q^2 = p^2" className="text-2xl font-bold block mb-4 text-blue-600" />
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 font-bold text-sm text-left">
                        左辺は「2×何か」なので【偶数】。<br/>
                        つまり右辺の <MathComponent tex="p^2" /> も【偶数】。<br/>
                        <MathComponent tex="p^2" /> が偶数なら、<MathComponent tex="p" /> も【偶数】である。
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="p = 2k" className="text-2xl font-bold block mb-4" />
                    <div className="bg-slate-100 p-4 rounded-xl text-sm text-left font-bold text-slate-700">
                        <MathComponent tex="2q^2 = (2k)^2" /> に代入<br/>
                        <MathComponent tex="2q^2 = 4k^2" /> <br/>
                        <MathComponent tex="q^2 = 2k^2" />
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="text-center animate-fade-in">
                    <MathComponent tex="q^2 = 2 \times k^2" className="text-2xl font-bold block mb-4 text-purple-600" />
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 font-bold text-sm text-left">
                        右辺は「2×何か」なので【偶数】。<br/>
                        つまり左辺の <MathComponent tex="q^2" /> も【偶数】。<br/>
                        <MathComponent tex="q^2" /> が偶数なら、<MathComponent tex="q" /> も【偶数】である。
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="text-center animate-fade-in">
                    <div className="text-4xl mb-4">&#128165; 矛盾 &#128165;</div>
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-200 font-bold text-sm text-left">
                        pも偶数、qも偶数になった！<br/>
                        最初のアサンプション「pとqは互いに素（これ以上約分できない）」に完全に矛盾する！<br/>
                        <span className="block mt-2 text-center text-lg">∴ <MathComponent tex="\sqrt{2}" /> は無理数である。</span>
                    </div>
                </div>
            )}

          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 disabled:opacity-50">
                      戻る
                  </button>
                  <div className="font-bold text-slate-500">Step {step + 1} / 6</div>
                  <button disabled={step === 5} onClick={() => setStep(s => s + 1)} className="p-3 bg-blue-500 text-white rounded-xl shadow-sm border border-blue-600 disabled:opacity-50 font-bold">
                      次へ
                  </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><Calculator className="w-4 h-4" /> 背理法（Proof by Contradiction）</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                          直接証明するのが難しいとき、「もしそれが逆だったらどうなるか？」と仮定して、論理を進めます。<br/>
                          論理を進めて「ありえないこと（矛盾）」が起きたら、「やっぱり最初の仮定が間違っていたんだ！」と結論づける強力な証明方法です。
                      </p>
                  </div>
              </div>

              <HintButton hints={[
                { step: 1, text: '背理法は「結論の否定」を仮定して矛盾を導く証明法です。' },
                { step: 2, text: '手順: (1)結論の否定を仮定 → (2)論理的に推論 → (3)矛盾を発見 → (4)仮定が誤りと結論。' },
                { step: 3, text: '√2 が無理数であることの証明が背理法の代表例です。「有理数と仮定」して矛盾を導きます。' },
              ]} />

          </div>
      </main>
    </div>
  );
}
