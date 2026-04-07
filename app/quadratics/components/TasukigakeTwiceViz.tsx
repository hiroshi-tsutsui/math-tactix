import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Layers } from 'lucide-react';
import HintButton from '../../components/HintButton';

export default function TasukigakeTwiceViz() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "元の式",
      desc: "x² + 3xy + 2y² + 2x + 5y - 3",
      detail: "文字が2つある2次式です。まずは次数の低い文字（または同じなら x）について整理します。"
    },
    {
      title: "ステップ 1: xについて整理",
      desc: "x² + (3y + 2)x + (2y² + 5y - 3)",
      detail: "xの2次方程式のような形 A x² + B x + C を作ります。後半の y の部分が定数項 C の役割を果たします。"
    },
    {
      title: "ステップ 2: 定数項(yの部分)を因数分解",
      desc: "2y² + 5y - 3 = (y + 3)(2y - 1)",
      detail: "まずは y の2次式を1回目のたすき掛けで因数分解します。\n 1 × -1 = -1\n 2 × 3 = 6\n 計: 5"
    },
    {
      title: "ステップ 3: 式全体を更新",
      desc: "x² + (3y + 2)x + (y + 3)(2y - 1)",
      detail: "分解した結果を元の式に戻します。これで C の部分が2つの因数に分かれました。"
    },
    {
      title: "ステップ 4: 2回目のたすき掛け (xについて)",
      desc: "(y+3) と (2y-1) を使って (3y+2) を作る",
      detail: " 1 × (2y - 1) = 2y - 1\n 1 × (y + 3) = y + 3\n ----------------------\n 計: 3y + 2  （見事に一致！）"
    },
    {
      title: "最終結果",
      desc: "= (x + y + 3)(x + 2y - 1)",
      detail: "これで2変数の2次式の因数分解が完了しました！"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Layers className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">たすき掛けの応用 (2変数の因数分解)</h3>
            <p className="text-sm text-slate-400">2回のたすき掛けを使って複雑な式を解く</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {steps.map((s, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  idx === step 
                    ? 'bg-blue-500/20 border-blue-500/50 scale-100 opacity-100' 
                    : idx < step
                      ? 'bg-slate-800 border-slate-700 opacity-70 scale-95'
                      : 'hidden'
                }`}
              >
                <div className="font-bold text-blue-400 mb-1">{s.title}</div>
                <div className="text-xl text-slate-100 font-mono mb-2">{s.desc}</div>
                {idx === step && (
                  <div className="text-slate-300 text-sm whitespace-pre-line">{s.detail}</div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full md:w-64 flex flex-col justify-end space-y-3">
            <button 
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              次のステップへ
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setStep(0)}
              className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              リセット
            </button>
          </div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "2文字の2次式の因数分解は、一方の文字で整理して「たすき掛け」を2回使います。" },
        { step: 2, text: "まず x について整理し、定数項（y の式）を先に因数分解します。" },
        { step: 3, text: "因数分解した結果を使って、全体をたすき掛けで因数分解します。" },
      ]} />
    </div>
    </div>
  );
}
