"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const SymmetricThreeVariablesViz = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "元の式",
      desc: "数学Iで頻出する3変数の対称式です。このままでは因数分解できないので、工夫が必要です。",
      math: "a^3 + b^3 + c^3 - 3abc"
    },
    {
      title: "Step 1: 前半2つを変形",
      desc: "a³+b³ を (a+b)³ - 3ab(a+b) の形に置き換えます。",
      math: "\\{(a+b)^3 - 3ab(a+b)\\} + c^3 - 3abc"
    },
    {
      title: "Step 2: 順番を並べ替える",
      desc: "3乗の項 (a+b)³ と c³ を近づけ、残りの項をまとめます。",
      math: "\\{(a+b)^3 + c^3\\} - 3ab(a+b) - 3abc"
    },
    {
      title: "Step 3: 3乗の和を公式で展開",
      desc: "前半部分を A³+B³ = (A+B)(A²-AB+B²) の公式を使って展開します。(A=a+b, B=c)",
      math: "\\{(a+b+c)((a+b)^2 - (a+b)c + c^2)\\} - 3ab(a+b) - 3abc"
    },
    {
      title: "Step 4: 後半を -3ab でくくる",
      desc: "後半の2つの項から共通因数 -3ab をくくり出します。すると (a+b+c) が現れます。",
      math: "\\{(a+b+c)((a+b)^2 - (a+b)c + c^2)\\} - 3ab(a+b+c)"
    },
    {
      title: "Step 5: 全体を (a+b+c) でくくる",
      desc: "式全体から (a+b+c) を前に出します。",
      math: "(a+b+c) \\{ (a+b)^2 - (a+b)c + c^2 - 3ab \\}"
    },
    {
      title: "Step 6: 中のカッコを展開・整理する",
      desc: "中身を展開して整理すると、美しい公式が完成します。",
      math: "(a+b+c)(a^2 + b^2 + c^2 - ab - bc - ca)"
    }
  ];

  return (
    <div className="p-4 bg-slate-50 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">3変数の3乗の和 (対称式)</h3>
        <p className="text-sm text-slate-600">a³+b³+c³-3abc の因数分解は、丸暗記ではなく「作る」ものです。</p>
      </div>

      <div className="bg-white p-4 rounded border-2 border-slate-200 mb-6 flex flex-col items-center justify-center min-h-[120px]">
        <BlockMath math={steps[step].math} />
      </div>

      <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400 mb-6 min-h-[100px]">
        <h4 className="font-bold text-blue-800 mb-2">{steps[step].title}</h4>
        <p className="text-blue-900">{steps[step].desc}</p>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))} 
          disabled={step === 0}
          className={`px-4 py-2 rounded font-medium ${step === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >
          前のステップ
        </button>
        <div className="flex space-x-1">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === step ? 'bg-blue-600' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        <button 
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))} 
          disabled={step === steps.length - 1}
          className={`px-4 py-2 rounded font-medium ${step === steps.length - 1 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {step === steps.length - 1 ? '完了' : '次のステップ'}
        </button>
      </div>
      <HintButton hints={[
        { step: 1, text: "3変数の対称式は、基本対称式 s₁ = a+b+c、s₂ = ab+bc+ca、s₃ = abc で表せます。" },
        { step: 2, text: "a² + b² + c² = s₁² - 2s₂ のように、基本対称式の組合せに変換しましょう。" },
        { step: 3, text: "a³ + b³ + c³ = s₁³ - 3s₁s₂ + 3s₃（ニュートンの恒等式）です。" },
        { step: 4, text: "与えられた条件から s₁, s₂, s₃ を求め、目的の式に代入しましょう。" }
      ]} />
    </div>
  );
};

export default SymmetricThreeVariablesViz;
