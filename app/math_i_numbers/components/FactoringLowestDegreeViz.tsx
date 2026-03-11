import React, { useState } from 'react';
import { BlockMath } from 'react-katex';

const FactoringLowestDegreeViz = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "元の式",
      math: "x^2 + xy - x + y - 2",
      explanation: "複数の文字（xとy）が含まれる式です。xは2次、yは1次です。",
      focus: []
    },
    {
      title: "最低次数の文字に注目",
      math: "x^2 + \\textcolor{red}{xy} - x + \\textcolor{red}{y} - 2",
      explanation: "次数が最も低い文字に注目します。ここでは y (1次) です。yを含む項を集めます。",
      focus: ['xy', 'y']
    },
    {
      title: "y でくくる",
      math: "y(x + 1) + x^2 - x - 2",
      explanation: "yを含む項をyでくくります。残りの項（xのみの項と定数項）はそのまままとめます。",
      focus: ['y(x+1)']
    },
    {
      title: "残りの部分を因数分解",
      math: "y(x + 1) + \\textcolor{blue}{(x - 2)(x + 1)}",
      explanation: "残りの2次式 x^2 - x - 2 を因数分解します。",
      focus: ['(x-2)(x+1)']
    },
    {
      title: "共通因数でくくる",
      math: "\\textcolor{green}{(x + 1)}(y + x - 2)",
      explanation: "両方の塊に共通因数 (x + 1) が現れました。これで全体をくくって完成です！",
      focus: ['(x+1)']
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-2xl mx-auto p-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white">最低次数の文字で整理する因数分解</h2>
        <p className="text-gray-400 text-sm">ステップバイステップで式が整理される様子を確認しましょう</p>
      </div>

      <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-6 border border-gray-700 relative overflow-hidden">
        <div className="absolute top-4 left-4 text-xs font-mono text-gray-500">STEP {step + 1}/5</div>
        <h3 className="text-lg text-blue-300 font-semibold mb-4">{steps[step].title}</h3>
        <div className="text-3xl text-white my-4">
          <BlockMath math={steps[step].math} />
        </div>
        <p className="text-gray-300 text-sm text-center max-w-md h-12">
          {steps[step].explanation}
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          前のステップ
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          次のステップ
        </button>
      </div>
      
      <div className="flex space-x-2 mt-4">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full ${i === step ? 'bg-blue-500' : i < step ? 'bg-blue-900' : 'bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FactoringLowestDegreeViz;
