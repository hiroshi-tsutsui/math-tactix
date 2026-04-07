"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HintButton from '../../components/HintButton';

export default function DiscountInequalityViz() {
  const [items, setItems] = useState<number>(10);
  
  const normalPrice = 100 * items;
  const cardPrice = 500 + 80 * items;
  const isCardCheaper = cardPrice < normalPrice;

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
        会員カードの損益分岐点 (1次不等式)
      </h3>
      
      <div className="mb-6">
        <p className="text-sm text-slate-600 mb-2 font-medium">
          【問題】 1個100円の商品がある。500円の会員カードを買うと、商品が20%引き（1個80円）になる。<br/>
          会員カードを買った方が安くなるのは、何個以上買うときか？
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Visualizer */}
        <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg">
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700">通常購入 (100円/個)</span>
              <span className="text-slate-800">{normalPrice} 円</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 relative">
              <motion.div 
                className="h-full bg-slate-500 rounded-full"
                animate={{ width: `${Math.min(normalPrice / 40, 100)}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-blue-600">会員購入 (500円 + 80円/個)</span>
              <span className="text-blue-700">{cardPrice} 円</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 relative flex overflow-hidden">
              <div className="h-full bg-yellow-400" style={{ width: `${Math.min(500 / 40, 100)}%` }} title="入会金: 500円" />
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: `${Math.min((80 * items) / 40, 100)}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center border-t pt-4 border-slate-200">
            <div className="text-sm font-bold text-slate-700">購入する個数: <span className="text-lg text-indigo-600">{items}</span> 個</div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${isCardCheaper ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isCardCheaper ? "会員の方が安い！" : "通常の方が安い"}
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="40" 
            step="1"
            value={items} 
            onChange={(e) => setItems(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-slate-800">
          <p className="font-bold text-blue-800 mb-2">💡 1次不等式の立式と図形的意味</p>
          <p className="mb-2">購入する個数を <span className="font-mono text-blue-700">x</span> とおくと：</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-slate-700 mb-4">
            <li>通常の代金: <span className="font-mono">100x</span> 円</li>
            <li>会員の代金: <span className="font-mono">500 + 80x</span> 円</li>
          </ul>
          <p className="mb-2">「会員の方が安くなる」条件は：</p>
          <div className="bg-white p-3 rounded border border-blue-200 text-center font-mono text-lg mb-4">
            100x &gt; 500 + 80x
          </div>
          <p className="mb-1">これを解くと：</p>
          <div className="bg-white p-2 rounded border border-blue-100 text-center font-mono text-md mb-4 text-slate-600">
            20x &gt; 500<br/>
            x &gt; 25
          </div>
          <p>
            つまり、<strong>25個のとき両者は同じ金額（3000円）</strong>になり、<strong>26個以上</strong>買うと会員カードの元が取れてお得になることが視覚的にわかります。
          </p>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "割引の問題では、定価 × (1 - 割引率) で売値を求めます。" },
        { step: 2, text: "「どちらの店が安いか」は、各店の支払い総額を不等式で比較します。" },
        { step: 3, text: "個数を変数として不等式を立て、一方が安くなる条件を求めましょう。" },
        { step: 4, text: "境界の個数（等しくなる点）を求め、それより多いか少ないかで判断します。" }
      ]} />
    </div>
  );
}
