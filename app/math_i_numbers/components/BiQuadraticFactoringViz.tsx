"use client";
import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function BiQuadraticFactoringViz() {
  const [step, setStep] = useState<number>(0);
  
  const steps = [
    {
      title: "Step 1: 置き換えでの失敗",
      desc: "$X = x^2$ と置いてみます。$X^2 + X + 1$ となりますが、これ以上因数分解できません。この方法は使えないようです。",
      math: "x^4 + x^2 + 1 \\\\ \\downarrow \\\\ X^2 + X + 1 \\quad (\\text{因数分解できない})"
    },
    {
      title: "Step 2: 両端の項に注目する",
      desc: "真ん中の項 $x^2$ を無視して、両端の $x^4$ と $1$ に注目します。これらを作り出せる「平方の形 (2乗)」を考えます。",
      math: "\\textcolor{#ef4444}{x^4} + x^2 + \\textcolor{#ef4444}{1} \\\\ \\downarrow \\\\ (\\textcolor{#ef4444}{x^2} + \\textcolor{#ef4444}{1})^2 \\text{ をベースにする}"
    },
    {
      title: "Step 3: 理想の形と現実のズレ",
      desc: "先ほど考えた $(x^2+1)^2$ を展開すると $x^4 + 2x^2 + 1$ になります。元の式の真ん中は $x^2$ なので、理想の形には $x^2$ が1つ足りません。",
      math: "\\text{理想: } x^4 + \\textcolor{#3b82f6}{2x^2} + 1 \\\\ \\text{現実: } x^4 + \\textcolor{#64748b}{x^2} + 1 \\\\ \\downarrow \\\\ \\text{差分: } \\textcolor{#3b82f6}{+x^2} \\text{ が必要}"
    },
    {
      title: "Step 4: 足して引く (平方の差を作る)",
      desc: "無理やり理想の形を作るために、$x^2$ を足して、すぐに $x^2$ を引きます。これで値は変わりません。",
      math: "x^4 + x^2 \\textcolor{#3b82f6}{+ x^2} + 1 \\textcolor{#ef4444}{- x^2} \\\\ \\downarrow \\\\ (x^4 + 2x^2 + 1) \\textcolor{#ef4444}{- x^2}"
    },
    {
      title: "Step 5: 2乗 - 2乗 の形",
      desc: "カッコの中を因数分解すると、見事な「2乗 引く 2乗」の形が完成します。これが最大の山場です。",
      math: "\\underbrace{(x^4 + 2x^2 + 1)}_{\\text{平方完成}} - x^2 \\\\ \\downarrow \\\\ \\textcolor{#3b82f6}{(x^2 + 1)^2} - \\textcolor{#ef4444}{x^2}"
    },
    {
      title: "Step 6: 和と差の積の公式を適用",
      desc: "$A^2 - B^2 = (A - B)(A + B)$ の公式を使います。$A = (x^2+1)$、$B = x$ として当てはめます。",
      math: "\\textcolor{#3b82f6}{A}^2 - \\textcolor{#ef4444}{B}^2 = (\\textcolor{#3b82f6}{A} - \\textcolor{#ef4444}{B})(\\textcolor{#3b82f6}{A} + \\textcolor{#ef4444}{B}) \\\\ \\downarrow \\\\ \\{ \\textcolor{#3b82f6}{(x^2+1)} - \\textcolor{#ef4444}{x} \\} \\{ \\textcolor{#3b82f6}{(x^2+1)} + \\textcolor{#ef4444}{x} \\}"
    },
    {
      title: "Step 7: 降べきの順に整理して完成",
      desc: "カッコの中の項を次数の高い順 (降べきの順) に並べ替えて完成です。",
      math: "(x^2 - x + 1)(x^2 + x + 1)"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-6">
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg mb-2">複二次式の因数分解 (平方の差を作る)</h3>
          <p className="text-sm text-slate-600">
            次の式を因数分解しなさい。<br />
            <span className="inline-block mt-2 px-4 py-2 bg-white rounded-lg border border-slate-300 font-bold text-xl">
              <InlineMath math="x^4 + x^2 + 1" />
            </span>
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-between items-center px-4">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${step === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            ← 戻る
          </button>
          <span className="text-sm font-bold text-slate-500">Step {step + 1} / {steps.length}</span>
          <button 
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${step === steps.length - 1 ? 'bg-indigo-200 text-indigo-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            次へ →
          </button>
        </div>

        {/* Current Step Content */}
        <div className="min-h-[280px] bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-sm flex flex-col items-center justify-center space-y-6 relative overflow-hidden transition-all duration-300">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <h4 className="font-bold text-indigo-700 text-lg">{steps[step].title}</h4>
          
          <div className="w-full text-center">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              <InlineMath math={steps[step].desc} />
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 w-full max-w-md flex justify-center text-xl sm:text-2xl transform transition-transform duration-300 hover:scale-105">
            <BlockMath math={steps[step].math} />
          </div>

        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center">
          <span className="text-xl mr-2">💡</span> 発想のポイント (Intuition)
        </h4>
        <p className="text-sm text-blue-800 leading-relaxed space-y-2">
          このタイプの問題は、数学Iの因数分解における<strong>「最大の壁」</strong>です。<br />
          通常は $X = x^2$ と置き換えて解きますが、$X^2 + X + 1$ となり解けません。その時、<strong>「無理やり $( )^2 - ( )^2$ の形を作る」</strong>という発想の切り替えが必要です。<br />
          両端の項（$x^4$ と $1$）を見て、「$(x^2+1)^2$ が隠れているはずだ！」とアタリをつけるのがコツです。足りないパーツは自分で足して、後から帳尻合わせで引けば良いのです。
        </p>
      </div>
    </div>
  );
}
