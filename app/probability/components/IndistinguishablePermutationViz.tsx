"use client";

import React, { useState, useMemo } from 'react';
import HintButton from '../../components/HintButton';

const IndistinguishablePermutationViz: React.FC = () => {
  const [numA, setNumA] = useState(2);
  const [numB, setNumB] = useState(2);

  const total = numA + numB;

  // Calculate combinations nCr for the placement of 'A's
  const calculateCombinations = (n: number, r: number) => {
    if (r === 0 || n === r) return 1;
    let num = 1;
    let den = 1;
    for (let i = 0; i < r; i++) {
      num *= (n - i);
      den *= (i + 1);
    }
    return num / den;
  };

  const totalArrangements = calculateCombinations(total, numA);

  const factorial = (n: number) => {
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  return (
    <div className="w-full bg-white text-gray-800 p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-center">同じものを含む順列 (Permutations with Indistinguishable Items)</h3>
      
      <p className="text-sm text-gray-600 mb-6 text-center">
        Aが<span className="font-bold text-red-500">{numA}個</span>、
        Bが<span className="font-bold text-blue-500">{numB}個</span>あります。
        これらを一列に並べる場合の数を考えましょう。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Controls */}
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
          <label className="block text-sm font-medium mb-2 text-gray-700">Aの個数: {numA}</label>
          <input 
            type="range" min="1" max="4" value={numA} 
            onChange={(e) => setNumA(Number(e.target.value))}
            className="w-full mb-6 accent-red-500"
          />
          
          <label className="block text-sm font-medium mb-2 text-gray-700">Bの個数: {numB}</label>
          <input 
            type="range" min="1" max="4" value={numB} 
            onChange={(e) => setNumB(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Formula */}
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-gray-700 mb-4">公式による計算</p>
          <div className="text-2xl font-serif flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-gray-800 px-2">{total}!</span>
              <span>{numA}! &times; {numB}!</span>
            </div>
            <span>=</span>
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-gray-800 px-2">{factorial(total)}</span>
              <span>{factorial(numA)} &times; {factorial(numB)}</span>
            </div>
            <span>=</span>
            <span className="text-3xl font-bold text-green-600">{totalArrangements}</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">総数 {total}! を、同じものの入れ替えの数 ({numA}!, {numB}!) で割ります。</p>
        </div>
      </div>

      {/* Visual Explanation */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-700 mb-4 text-center">Cを使った考え方 (場所を選ぶ)</h4>
        <p className="text-sm text-gray-600 mb-4 text-center">
          {total}個の「枠」の中から、Aを入れる場所を{numA}箇所選びます。残りの{numB}箇所には自動的にBが入ります。
        </p>
        <div className="flex justify-center items-center text-2xl font-serif">
          <span>_{total}C_{numA} = </span>
          <span className="ml-2 text-3xl font-bold text-green-600">{totalArrangements} 通り</span>
        </div>
      </div>

      <HintButton
        hints={[
          { step: 1, text: "すべて区別すると (A+B)! 通りの並び方があります" },
          { step: 2, text: "同じ種類のもの同士を入れ替えても見た目は変わりません" },
          { step: 3, text: "A が numA 個なら A 同士の入れ替え numA! 通りが重複しています" },
          { step: 4, text: "よって総数は (A+B)! / (A! × B!) = C(A+B, A) 通りです" },
        ]}
      />
    </div>
  );
};

export default IndistinguishablePermutationViz;
