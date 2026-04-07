"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const ValueAbsoluteViz: React.FC = () => {
  const [a, setA] = useState<number>(3);

  const val = Math.abs(a - 5);
  const isNegativeInside = (a - 5) < 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg w-full max-w-4xl text-gray-800">
      <h2 className="text-2xl font-bold mb-4">絶対値を含む式の値</h2>
      
      <div className="w-full mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <InlineMath math="a" /> の値: {a}
        </label>
        <input 
          type="range" 
          min="0" max="10" step="1"
          value={a} 
          onChange={(e) => setA(parseInt(e.target.value))} 
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg w-full mb-6 text-center">
        <p className="text-gray-600 mb-2">計算する式:</p>
        <div className="text-xl">
          <BlockMath math={`|a - 5|`} />
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg w-full">
        <h3 className="text-lg font-bold mb-4">ステップ解説:</h3>
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white rounded shadow-sm"
          >
            <p className="text-gray-700">1. 代入する</p>
            <BlockMath math={`|${a} - 5| = |${a - 5}|`} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 bg-white rounded shadow-sm"
          >
            <p className="text-gray-700">2. 絶対値の中身の符号を判定</p>
            <BlockMath math={`${a - 5} ${isNegativeInside ? '< 0' : '\\ge 0'}`} />
            <p className="text-sm text-gray-500 mt-2">
              {isNegativeInside 
                ? "中身が負なので、マイナスをつけて外します。" 
                : "中身が0以上なので、そのまま外します。"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="p-4 bg-white rounded shadow-sm border-l-4 border-blue-500"
          >
            <p className="text-gray-700 font-bold">3. 結果</p>
            <BlockMath math={isNegativeInside ? `-(${a - 5}) = ${val}` : `${a - 5} = ${val}`} />
          </motion.div>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "絶対値 |a| は、a ≥ 0 なら a、a < 0 なら -a です。" },
        { step: 2, text: "数直線上で |a| は原点からの距離を表します。" },
        { step: 3, text: "絶対値を含む式の値を求めるには、中身の符号を確認して場合分けしましょう。" },
        { step: 4, text: "複数の絶対値がある場合は、すべての境界点を求めてから場合分けします。" }
      ]} />
    </div>
  );
};

export default ValueAbsoluteViz;
