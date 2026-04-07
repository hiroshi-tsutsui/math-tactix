"use client";
import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

export default function ParametricLinearInequalityViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);

  const getSolution = () => {
    if (a > 0) {
      return `x > ${b/a}`;
    } else if (a < 0) {
      return `x < ${b/a}`;
    } else { // a === 0
      if (b < 0) {
        return "すべての実数 (All real numbers)";
      } else {
        return "解なし (No solution)";
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <h3 className="font-bold text-slate-800 text-center">不等式 <InlineMath math="ax > b" /> の解</h3>
        
        <div className="flex justify-center items-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm font-medium text-slate-600">係数 a = {a}</label>
            <input type="range" min="-5" max="5" step="1" value={a} onChange={(e) => setA(parseInt(e.target.value))} className="w-32 accent-indigo-600" />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm font-medium text-slate-600">定数 b = {b}</label>
            <input type="range" min="-5" max="5" step="1" value={b} onChange={(e) => setB(parseInt(e.target.value))} className="w-32 accent-emerald-600" />
          </div>
        </div>

        <div className="mt-8 text-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">現在の式</div>
          <div className="text-xl">
            <BlockMath math={`${a}x > ${b}`} />
          </div>
          
          <div className="my-4 border-t border-slate-100 w-1/2 mx-auto"></div>
          
          <div className="text-sm text-slate-500 mb-2">解</div>
          <div className="text-xl font-bold text-indigo-700">
            {getSolution()}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-600 space-y-2 bg-indigo-50 p-4 rounded-lg">
          <p><strong>場合分けの理由:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><InlineMath math="a > 0" /> のとき、両辺を <InlineMath math="a" /> で割っても不等号の向きは<strong>そのまま</strong>です。</li>
            <li><InlineMath math="a < 0" /> のとき、両辺を負の数 <InlineMath math="a" /> で割るため、不等号の向きが<strong>逆転</strong>します。</li>
            <li><InlineMath math="a = 0" /> のとき、左辺は常に <InlineMath math="0" /> になります。<InlineMath math="0 > b" /> が成り立つかどうかで「解なし」か「すべての実数」かが決まります。</li>
          </ul>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "不等式 ax > b を解くとき、a の符号によって場合分けが必要です。" },
        { step: 2, text: "a > 0 なら不等号の向きはそのまま、a < 0 なら不等号の向きが逆転します。" },
        { step: 3, text: "a = 0 のとき、左辺は 0 になるので、0 > b が成り立つかで解が決まります。" },
        { step: 4, text: "3つの場合（a > 0, a < 0, a = 0）それぞれの解を確認しましょう。" }
      ]} />
    </div>
  );
}
