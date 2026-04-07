"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

export default function RootComparisonViz() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(6);
  const [c, setC] = useState(3);
  const [d, setD] = useState(8);

  const sum1 = a + b;
  const sum2 = c + d;
  const prod1 = a * b;
  const prod2 = c * d;

  const val1 = Math.sqrt(a) + Math.sqrt(b);
  const val2 = Math.sqrt(c) + Math.sqrt(d);
  
  const isSumEqual = sum1 === sum2;

  return (
    <div className="flex flex-col items-center border p-6 rounded-lg bg-white shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-500 pb-2">平方根の大小比較</h3>
      <p className="mb-4 text-gray-700 text-sm">
        正の数 $A, B$ について、$A \gt B \iff A^2 \gt B^2$ であることを利用します。
      </p>

      <div className="grid grid-cols-2 gap-6 w-full mb-6">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <div className="font-semibold text-blue-700 mb-2">値 A</div>
          <BlockMath math={`\\sqrt{${a}} + \\sqrt{${b}}`} />
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs text-gray-600">a: {a}</label>
            <input type="range" min="1" max="20" value={a} onChange={e => setA(parseInt(e.target.value))} className="w-full" />
            <label className="text-xs text-gray-600">b: {b}</label>
            <input type="range" min="1" max="20" value={b} onChange={e => setB(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg text-center">
          <div className="font-semibold text-red-700 mb-2">値 B</div>
          <BlockMath math={`\\sqrt{${c}} + \\sqrt{${d}}`} />
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs text-gray-600">c: {c}</label>
            <input type="range" min="1" max="20" value={c} onChange={e => setC(parseInt(e.target.value))} className="w-full" />
            <label className="text-xs text-gray-600">d: {d}</label>
            <input type="range" min="1" max="20" value={d} onChange={e => setD(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-4">両辺を2乗して比較</h4>
        <div className="flex flex-col gap-4 text-lg">
          <div>
            <span className="text-blue-600 font-bold">A²</span> = <InlineMath math={`(\\sqrt{${a}} + \\sqrt{${b}})^2 = ${a} + ${b} + 2\\sqrt{${a} \\times ${b}} = ${sum1} + 2\\sqrt{${prod1}}`} />
          </div>
          <div>
            <span className="text-red-600 font-bold">B²</span> = <InlineMath math={`(\\sqrt{${c}} + \\sqrt{${d}})^2 = ${c} + ${d} + 2\\sqrt{${c} \\times ${d}} = ${sum2} + 2\\sqrt{${prod2}}`} />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300">
          {!isSumEqual ? (
            <div className="text-yellow-600 font-medium">
              整数部分（和）が等しくないため、単純な根号内の比較だけでは大小が確定しません。整数部分を揃える問題設定（和が同じ）にするか、近似値で比較する必要があります。
            </div>
          ) : (
            <div>
              <p className="mb-2 text-gray-700">整数部分が等しい (<InlineMath math={`${sum1}`} />) ため、根号の中身の大小で全体が決まります。</p>
              <div className="flex justify-center items-center text-2xl font-bold p-4 bg-white rounded shadow-sm border">
                {prod1 > prod2 ? (
                  <span className="text-blue-600">A &gt; B</span>
                ) : prod1 < prod2 ? (
                  <span className="text-red-600">A &lt; B</span>
                ) : (
                  <span className="text-gray-600">A = B</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "無理数の大小比較では、直接比較が難しいので工夫が必要です。" },
        { step: 2, text: "両辺を二乗して比較する方法が基本です（ただし両辺が正のとき限定）。" },
        { step: 3, text: "√a - √b の符号を調べるには、有理化して (a - b)/(√a + √b) とする方法もあります。" },
        { step: 4, text: "二乗してもまだ根号が残る場合は、もう一度二乗するか、差を計算して符号を判定しましょう。" }
      ]} />
    </div>
  );
}
