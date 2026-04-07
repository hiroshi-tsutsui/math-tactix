"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const AlternatingPolynomialViz = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "元の式 (交代式)",
      desc: "すべての文字の次数が同じなので、1つの文字（ここでは a）について整理します。",
      math: "a^2(b-c) + b^2(c-a) + c^2(a-b)"
    },
    {
      title: "Step 1: a について整理する",
      desc: "a を含まない項、a の1次項、a の2次項に分けます。",
      math: "(b-c)a^2 - (b^2-c^2)a + (b^2c - bc^2)"
    },
    {
      title: "Step 2: 各項を因数分解して (b-c) を見つける",
      desc: "それぞれの項の中に共通因数 (b-c) が隠れています。",
      math: "(b-c)a^2 - (b-c)(b+c)a + bc(b-c)"
    },
    {
      title: "Step 3: (b-c) でくくる",
      desc: "共通因数 (b-c) を全体から前に出します。",
      math: "(b-c)\\{a^2 - (b+c)a + bc\\}"
    },
    {
      title: "Step 4: 中の2次式をたすき掛け（因数分解）する",
      desc: "和が -(b+c)、積が bc となる2数は -b と -c です。",
      math: "(b-c)(a-b)(a-c)"
    },
    {
      title: "Step 5: 輪環の順に並べ替える",
      desc: "美しい形 (a→b→c→a) にするために、(a-c) からマイナスをくくり出して -(c-a) にします。",
      math: "-(a-b)(b-c)(c-a)"
    }
  ];

  return (
    <div className="p-4 bg-slate-50 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">交代式の因数分解 (3変数)</h3>
        <p className="text-sm text-slate-600">複雑な式も、「1つの文字で整理」すれば必ず解けます。</p>
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
        { step: 1, text: "交代式とは、2つの変数を入れ替えると符号が変わる式です（f(a,b) = -f(b,a)）。" },
        { step: 2, text: "最も基本的な交代式は a - b です。すべての交代式は (a - b) を因数に持ちます。" },
        { step: 3, text: "交代式は (a - b) × (対称式) の形に因数分解できます。" },
        { step: 4, text: "まず a - b でくくれないか試し、残りが対称式になるか確認しましょう。" }
      ]} />
    </div>
  );
};

export default AlternatingPolynomialViz;
