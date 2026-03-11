"use client";
import React, { useState } from 'react';

export default function AbsoluteInequalityCaseSplitViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4">絶対値を含む不等式 (場合分け)</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">不等式 |x - {a}| &lt; {b}x + {c} を解く</p>
        <div className="flex flex-col gap-2">
          <label className="text-sm">a (絶対値の中心): {a}
            <input type="range" min="-5" max="5" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full" />
          </label>
          <label className="text-sm">b (直線の傾き): {b}
            <input type="range" min="-3" max="3" step="0.5" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full" />
          </label>
        </div>
      </div>
      <div className="p-4 bg-blue-50 text-blue-800 rounded">
        <p><strong>場合分け 1:</strong> x ≧ {a} のとき、x - {a} &lt; {b}x + {c}</p>
        <p><strong>場合分け 2:</strong> x &lt; {a} のとき、-(x - {a}) &lt; {b}x + {c}</p>
        <p className="mt-2 text-sm text-gray-500">※ V字型のグラフ（絶対値）が直線より下にある領域を視覚的に確認します。</p>
      </div>
    </div>
  );
}
