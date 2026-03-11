"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';

export default function RationalizationViz() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const [step, setStep] = useState(0);

  const reset = () => {
    setStep(0);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newA = parseInt(e.target.value);
    setA(newA);
    if (newA <= b) setB(newA - 1);
    setStep(0);
  };

  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newB = parseInt(e.target.value);
    setB(newB);
    if (newB >= a) setA(newB + 1);
    setStep(0);
  };

  const renderMath = () => {
    if (step === 0) {
      return `\\frac{${c}}{\\sqrt{${a}} + \\sqrt{${b}}}`;
    } else if (step === 1) {
      return `\\frac{${c}}{\\sqrt{${a}} + \\sqrt{${b}}} \\times \\frac{\\textcolor{red}{\\sqrt{${a}} - \\sqrt{${b}}}}{\\textcolor{red}{\\sqrt{${a}} - \\sqrt{${b}}}}`;
    } else if (step === 2) {
      return `\\frac{${c}(\\sqrt{${a}} - \\sqrt{${b}})}{(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2} = \\frac{${c}(\\sqrt{${a}} - \\sqrt{${b}})}{${a} - ${b}}`;
    } else {
      const denom = a - b;
      let finalStr = "";
      if (denom === 1) {
        finalStr = c === 1 ? `\\sqrt{${a}} - \\sqrt{${b}}` : `${c}(\\sqrt{${a}} - \\sqrt{${b}})`;
      } else {
        if (c % denom === 0) {
           const factor = c / denom;
           finalStr = factor === 1 ? `\\sqrt{${a}} - \\sqrt{${b}}` : `${factor}(\\sqrt{${a}} - \\sqrt{${b}})`;
        } else {
           finalStr = `\\frac{${c}(\\sqrt{${a}} - \\sqrt{${b}})}{${denom}}`;
        }
      }
      return finalStr;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-xs">1</span>
          パラメータの設定
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>分子 <InlineMath math="c" /></span>
              <span className="text-indigo-600">{c}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={c}
              onChange={(e) => { setC(parseInt(e.target.value)); setStep(0); }}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>分母の平方根1 <InlineMath math="a" /></span>
              <span className="text-indigo-600">{a}</span>
            </label>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={a}
              onChange={handleAChange}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>分母の平方根2 <InlineMath math="b" /></span>
              <span className="text-indigo-600">{b}</span>
            </label>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={b}
              onChange={handleBChange}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden min-h-[250px] flex flex-col justify-center">
        <h3 className="text-sm font-bold text-slate-700 absolute top-6 left-6 flex items-center">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-xs">2</span>
          有理化のステップ
        </h3>

        <div className="flex justify-center items-center py-12">
          <div className="text-2xl md:text-3xl text-slate-800 transition-all duration-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <BlockMath math={renderMath()} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto flex justify-center space-x-4">
          <button
            onClick={reset}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            リセット
          </button>
          <button
            onClick={nextStep}
            disabled={step === 3}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === 0 && '共役な無理数を掛ける'}
            {step === 1 && '分母を展開する'}
            {step === 2 && '計算を完了する'}
            {step === 3 && '完了'}
          </button>
        </div>
      </div>

      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 text-sm text-indigo-900/80 leading-relaxed">
        <strong className="text-indigo-900 block mb-1">💡 有理化のポイント：</strong>
        <p>
          分母に <InlineMath math="\sqrt{a} + \sqrt{b}" /> がある場合、和と差の積の展開公式 <InlineMath math="(x+y)(x-y) = x^2 - y^2" /> を利用します。<br/>
          分母と分子の両方に符号を逆にした <InlineMath math="\sqrt{a} - \sqrt{b}" /> を掛けることで、分母が <InlineMath math="(\sqrt{a})^2 - (\sqrt{b})^2 = a - b" /> となり、ルートが外れて有理数になります。
        </p>
      </div>
    </div>
  );
}
