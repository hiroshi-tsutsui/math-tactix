"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

export default function FactoringSubstitutionViz() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const a = 1;
  const b = -2;
  const c = -8;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">置き換えによる因数分解</h3>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Step {step + 1} / 5
        </span>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-100 min-h-[300px] flex flex-col items-center justify-center">
        {step >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full text-center"
          >
            <p className="text-sm font-bold text-slate-500 mb-2">1. 元の式</p>
            <div className="text-xl">
              <BlockMath math="(x^2 - 3x)^2 - 2(x^2 - 3x) - 8" />
            </div>
          </motion.div>
        )}

        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full text-center"
          >
            <p className="text-sm font-bold text-indigo-500 mb-2">2. 共通部分を A と置く</p>
            <div className="bg-indigo-50 p-3 rounded-lg inline-block border border-indigo-100">
              <InlineMath math="A = x^2 - 3x" />
            </div>
            <div className="text-xl mt-3">
              <BlockMath math="A^2 - 2A - 8" />
            </div>
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full text-center"
          >
            <p className="text-sm font-bold text-emerald-600 mb-2">3. A について因数分解</p>
            <div className="text-xl text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg inline-block">
              <BlockMath math="(A - 4)(A + 2)" />
            </div>
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full text-center"
          >
            <p className="text-sm font-bold text-orange-600 mb-2">4. A を元の式に戻す</p>
            <div className="text-lg bg-orange-50 p-2 rounded-lg inline-block text-orange-800">
              <BlockMath math="\{(x^2 - 3x) - 4\}\{(x^2 - 3x) + 2\}" />
            </div>
          </motion.div>
        )}

        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center"
          >
            <p className="text-sm font-bold text-blue-600 mb-2">5. さらに因数分解できるか確認</p>
            <div className="text-xl text-blue-800 font-bold bg-blue-50 p-4 rounded-lg inline-block border-2 border-blue-200">
              <BlockMath math="(x - 4)(x + 1)(x - 2)(x - 1)" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            step === 0 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          前の手順
        </button>

        <p className="text-sm text-slate-600 font-medium">
          {step === 0 && "式全体を展開すると4次式になり計算が複雑です。"}
          {step === 1 && "同じ形 (x² - 3x) を1つの文字 A に置き換えます。"}
          {step === 2 && "これで2次式の因数分解と同じになりました。"}
          {step === 3 && "因数分解が終わったら、A を元の形に戻します。"}
          {step === 4 && "それぞれのカッコの中が因数分解できる場合は最後まで行います。"}
        </p>

        <button
          onClick={nextStep}
          disabled={step === 4}
          className={`px-4 py-2 rounded-lg font-bold transition-colors shadow-sm ${
            step === 4
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          次の手順
        </button>
      </div>
      <HintButton hints={[
        { step: 1, text: "複雑な式に共通する部分式を見つけ、それを新しい文字（t など）で置換しましょう。" },
        { step: 2, text: "置換後の式が二次式などのシンプルな形になるか確認します。" },
        { step: 3, text: "置換した文字で因数分解し、元の式に戻して展開・整理します。" },
        { step: 4, text: "置換した文字の範囲（例: t > 0）に注意して、解の妥当性を検証しましょう。" }
      ]} />
    </div>
  );
}
