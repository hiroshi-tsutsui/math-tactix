"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function ThreeTermsRationalizationViz() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "1. 2つの項を1つのグループにまとめる",
      desc: "3つの項がある分母は、一度に有理化できません。まずは2つの項をカッコでくくり、1つのカタマリ（ラージAなど）として見立てます。",
      math: "\\frac{1}{1 + \\sqrt{2} + \\sqrt{3}} \\longrightarrow \\frac{1}{(1 + \\sqrt{2}) + \\sqrt{3}}"
    },
    {
      title: "2. 共役な無理数を掛ける (1回目)",
      desc: "カタマリを利用して、(A+B)(A-B) = A^2 - B^2 の形を作ります。分母と分子に (1+√2) - √3 を掛けます。",
      math: "\\frac{1 \\times \\textcolor{blue}{\\{(1 + \\sqrt{2}) - \\sqrt{3}\\}}}{\\{(1 + \\sqrt{2}) + \\sqrt{3}\\} \\times \\textcolor{blue}{\\{(1 + \\sqrt{2}) - \\sqrt{3}\\}}}"
    },
    {
      title: "3. 分母を展開してルートを減らす",
      desc: "分母を (1+√2)^2 - (√3)^2 として展開すると、3つの項があったルートが1つのルート(2√2)だけに減ります。",
      math: "\\frac{1 + \\sqrt{2} - \\sqrt{3}}{(1 + 2\\sqrt{2} + 2) - 3} = \\frac{1 + \\sqrt{2} - \\sqrt{3}}{2\\sqrt{2}}"
    },
    {
      title: "4. 再度有理化する (2回目)",
      desc: "最後に、残った √2 を消すために、分母と分子にもう一度 √2 を掛けます。",
      math: "\\frac{(1 + \\sqrt{2} - \\sqrt{3}) \\times \\textcolor{red}{\\sqrt{2}}}{2\\sqrt{2} \\times \\textcolor{red}{\\sqrt{2}}}"
    },
    {
      title: "5. 計算完了",
      desc: "分子を展開し、分母を整数にすれば完成です。3項の有理化は「カタマリ化 → 2回有理化する」が鉄則です。",
      math: "\\frac{\\sqrt{2} + 2 - \\sqrt{6}}{4}"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Interactive Progress */}
        <div className="flex-1">
          <div className="space-y-4 relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 -z-10"></div>
            {steps.map((s, idx) => {
              const isActive = idx === step;
              const isPast = idx < step;
              return (
                <div 
                  key={idx} 
                  className={`relative flex items-start gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer ${isActive ? 'bg-indigo-50 border border-indigo-100' : isPast ? 'hover:bg-slate-50 opacity-70' : 'opacity-40 grayscale pointer-events-none'}`}
                  onClick={() => setStep(idx)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${isActive ? 'bg-indigo-500 text-white shadow-md' : isPast ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{s.title}</h4>
                    {isActive && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-between items-center px-2">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              前へ
            </button>
            <button 
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              次へ <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Dynamic Math Display */}
        <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center border border-slate-200 shadow-inner min-h-[300px]">
          <div className="text-sm font-medium text-slate-500 mb-6 tracking-widest uppercase">ステップ {step + 1} の式</div>
          <div className="text-xl md:text-2xl transition-all duration-500 transform scale-110">
            <BlockMath math={steps[step].math} />
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <span>Focus:</span>
            <span className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 font-medium">
              {step === 0 && "( )でくくる"}
              {step === 1 && "共役を掛ける"}
              {step === 2 && "2√2 だけ残る"}
              {step === 3 && "√2 を掛ける"}
              {step === 4 && "有理化完了"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
