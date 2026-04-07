"use client";
import React from 'react';
import HintButton from '../../components/HintButton';

export default function QuadraticInequalityGraphViz() {
  return (
    <div className="p-4 border rounded-lg bg-white text-black">
      <h3 className="text-lg font-bold">2次不等式の解とグラフの関係</h3>
      <p>この機能は準備中です。</p>
      <HintButton hints={[
        { step: 1, text: "2次不等式 f(x) > 0 の解は、放物線 y = f(x) が x 軸より上にある x の範囲です。" },
        { step: 2, text: "まず f(x) = 0 を解いて x 軸との交点（解）を求めます。" },
        { step: 3, text: "a > 0（下に凸）のとき f(x) > 0 の解は「2つの解の外側」、f(x) < 0 の解は「2つの解の内側」です。" },
      ]} />
    </div>
  );
}
