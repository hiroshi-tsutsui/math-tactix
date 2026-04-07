import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import HintButton from '../../components/HintButton';

const ExpansionSubstitutionViz = () => {
  const [step, setStep] = useState(0);

  const expressions = [
    {
      title: "元の式",
      math: "(x + y - z)(x - y + z)",
      explanation: "4つの項をそのまま展開すると9回の掛け算が必要になり、計算ミスの原因になります。共通する「カタマリ」を探しましょう。",
    },
    {
      title: "ステップ 1: 符号に注目してくくる",
      math: "\\{x + (y - z)\\}\\{x - (y - z)\\}",
      explanation: "後ろの2項に注目します。前半は +y-z、後半は -y+z。後半をマイナスでくくると、見事に (y-z) という共通のカタマリが現れます。",
    },
    {
      title: "ステップ 2: カタマリを A と置く",
      math: "(x + A)(x - A)",
      explanation: "(y-z) を大文字の A に置き換えます。すると、見慣れた「和と差の積」の公式が使える形に激変します！",
    },
    {
      title: "ステップ 3: 公式で一気に展開",
      math: "x^2 - A^2",
      explanation: "公式 (a+b)(a-b) = a^2 - b^2 を適用し、一瞬で展開します。",
    },
    {
      title: "ステップ 4: A を元の式に戻す",
      math: "x^2 - (y - z)^2",
      explanation: "A は私たちが勝手に置いた文字なので、元の (y - z) に戻します。ここでも必ずカッコをつけましょう。",
    },
    {
      title: "ステップ 5: 最後の展開と整理",
      math: "x^2 - (y^2 - 2yz + z^2) = x^2 - y^2 + 2yz - z^2",
      explanation: "残りの2乗を展開し、マイナスを分配して完成です。そのまま展開するよりはるかに速く、正確に計算できます。",
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">展開の工夫 (置き換え)</h3>
      <p className="text-slate-300 text-sm mb-6 text-center">
        複雑な展開は、共通の「カタマリ」を見つけて1つの文字に置き換えることで、劇的に簡単になります。<br/>
        特にマイナスでくくってカタマリを作る問題は頻出です。
      </p>

      {/* Interactive Step Area */}
      <div className="w-full bg-slate-800 rounded-lg p-6 min-h-[300px] flex flex-col items-center relative overflow-hidden">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center w-full"
        >
          <div className="text-emerald-400 font-semibold mb-2">{expressions[step].title}</div>
          <div className="text-3xl text-white my-6 p-4 rounded-xl border border-slate-700 min-w-[300px] flex justify-center overflow-x-auto w-full">
            <BlockMath math={expressions[step].math} />
          </div>
          <div className="text-slate-300 text-sm max-w-lg text-center leading-relaxed px-4">
            {expressions[step].explanation}
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-center gap-2 mt-6">
        {expressions.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-6 w-full">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors flex-1 max-w-[120px]"
        >
          ← 前へ
        </button>
        <button
          onClick={() => setStep(Math.min(expressions.length - 1, step + 1))}
          disabled={step === expressions.length - 1}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-500 transition-colors flex-1 max-w-[120px]"
        >
          次へ →
        </button>
      </div>

      <HintButton hints={[
        { step: 1, text: "展開公式を使って式を展開し、その後に条件の値を代入しましょう。" },
        { step: 2, text: "(a + b)² = a² + 2ab + b²、(a - b)² = a² - 2ab + b² が基本公式です。" },
        { step: 3, text: "展開した結果に a + b や ab の値を代入して数値を求めます。" },
        { step: 4, text: "代入の順番を工夫すると計算がシンプルになることがあります。" }
      ]} />
    </div>
  );
};

export default ExpansionSubstitutionViz;
