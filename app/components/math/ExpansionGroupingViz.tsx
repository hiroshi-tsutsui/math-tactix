import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath } from 'react-katex';

export default function ExpansionGroupingViz() {
  const [step, setStep] = useState(0);

  // $(x+1)(x+2)(x+3)(x+4)$
  // 1+4 = 5, 2+3 = 5
  // (x^2 + 5x + 4)(x^2 + 5x + 6)
  
  const factors = [
    { id: 1, val: 1 },
    { id: 2, val: 2 },
    { id: 3, val: 3 },
    { id: 4, val: 4 }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4">展開の工夫 (4つの1次式の積)</h3>
      <p className="text-gray-600 mb-6 text-sm text-center">
        (x+1)(x+2)(x+3)(x+4) を展開します。<br/>
        共通の形「x² + 5x」を作り出すために、足して同じ数になるペアを探します。
      </p>

      <div className="mb-8 w-full">
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <BlockMath math="(x+1)(x+2)(x+3)(x+4)" />
            <p className="mt-4 text-sm text-blue-600 font-bold">ペアを探そう: 1+4 = 5, 2+3 = 5</p>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <BlockMath math="\{(x+1)(x+4)\}\{(x+2)(x+3)\}" />
            <p className="mt-4 text-sm text-green-600 font-bold">順番を入れ替えてペアを作ります。</p>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <BlockMath math="(x^2 + 5x + 4)(x^2 + 5x + 6)" />
            <p className="mt-4 text-sm text-purple-600 font-bold">ペアごとに展開すると、共通部分 x² + 5x が現れます。</p>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <BlockMath math="A = x^2 + 5x \text{ とおくと}" />
            <BlockMath math="(A + 4)(A + 6)" />
            <BlockMath math="= A^2 + 10A + 24" />
            <p className="mt-4 text-sm text-orange-600 font-bold">共通部分を A と置き換えて展開します。</p>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <BlockMath math="= (x^2 + 5x)^2 + 10(x^2 + 5x) + 24" />
            <BlockMath math="= (x^4 + 10x^3 + 25x^2) + 10x^2 + 50x + 24" />
            <BlockMath math="= x^4 + 10x^3 + 35x^2 + 50x + 24" />
            <p className="mt-4 text-sm text-red-600 font-bold">A を元に戻して整理すれば完成です！</p>
          </motion.div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          前へ
        </button>
        <button
          onClick={() => setStep(Math.min(4, step + 1))}
          disabled={step === 4}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
