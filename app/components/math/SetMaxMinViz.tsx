"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function SetMaxMinViz() {
  const [total, setTotal] = useState(100);
  const [nA, setNA] = useState(60);
  const [nB, setNB] = useState(70);
  const [position, setPosition] = useState(0); // Offset of B relative to A to show overlap

  // Derived calculations
  const theoreticalMin = Math.max(0, nA + nB - total);
  const theoreticalMax = Math.min(nA, nB);

  // The visualization logic: A is fixed from left. B slides.
  // We represent the universe as a bar of length 100%.
  // A is a blue bar of length nA%.
  // B is an orange bar of length nB%.
  // By sliding B left and right, we can change the overlap.
  
  // We need to constrain the overlap to be between theoreticalMin and theoreticalMax
  useEffect(() => {
    // If nA or nB changes, reset position to theoreticalMax
    setPosition(theoreticalMax);
  }, [nA, nB, total, theoreticalMax]);

  const overlap = position;
  const onlyA = nA - overlap;
  const onlyB = nB - overlap;
  const none = total - (onlyA + overlap + onlyB);

  const handleOverlapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setPosition(val);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6 space-y-8 border border-slate-200">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">集合の要素の最大・最小</h2>
        <p className="text-slate-600">
          「和集合の最大値・最小値」や「共通部分の最大値・最小値」を視覚的に理解します。
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            全体集合 <InlineMath math="n(U)" /> = {total}
          </label>
          <input
            type="range"
            min="50"
            max="150"
            value={total}
            onChange={(e) => setTotal(parseInt(e.target.value))}
            className="w-full accent-slate-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-600 block">
            集合A <InlineMath math="n(A)" /> = {nA}
          </label>
          <input
            type="range"
            min="0"
            max={total}
            value={nA}
            onChange={(e) => setNA(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-orange-600 block">
            集合B <InlineMath math="n(B)" /> = {nB}
          </label>
          <input
            type="range"
            min="0"
            max={total}
            value={nB}
            onChange={(e) => setNB(parseInt(e.target.value))}
            className="w-full accent-orange-600"
          />
        </div>
      </div>

      {/* Interactive Overlap Control */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-slate-800 mb-2">共通部分をスライドして確認</h3>
          <p className="text-sm text-slate-600">
            AとBの重なり具合（共通部分 <InlineMath math="n(A \cap B)" />）を手動で動かしてみましょう。<br/>
            物理的に重ならないと全体をはみ出す限界（最小値）と、すっぽり収まる限界（最大値）が直感的に分かります。
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">
            最小: {theoreticalMin}
          </span>
          <input
            type="range"
            min={theoreticalMin}
            max={theoreticalMax}
            value={overlap}
            onChange={handleOverlapChange}
            className="w-full accent-purple-600"
          />
          <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">
            最大: {theoreticalMax}
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-purple-700">
            現在の <InlineMath math="n(A \cap B)" /> = {overlap}
          </div>
        </div>
      </div>

      {/* Bar Visualization */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 relative">
        <div className="text-center mb-4">
          <span className="font-bold text-slate-800">全体集合 U ({total})</span>
        </div>
        
        {/* The U Container */}
        <div className="relative h-24 w-full bg-slate-100 border-2 border-dashed border-slate-300 rounded overflow-hidden">
          
          {/* We'll render A strictly from the left */}
          <div 
            className="absolute top-2 bottom-12 left-0 bg-blue-500 opacity-80 rounded flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
            style={{ width: `${(nA / total) * 100}%` }}
          >
            A ({nA})
          </div>

          {/* We'll render B overlapping. B's left edge is (nA - overlap) */}
          <div 
            className="absolute top-12 bottom-2 bg-orange-500 opacity-80 rounded flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
            style={{ 
              left: `${((nA - overlap) / total) * 100}%`,
              width: `${(nB / total) * 100}%` 
            }}
          >
            B ({nB})
          </div>

          {/* Overlap Highlight Box */}
          <div 
            className="absolute top-2 bottom-2 border-2 border-purple-500 bg-purple-500/30 transition-all duration-300 z-10 flex flex-col items-center justify-center"
            style={{ 
              left: `${((nA - overlap) / total) * 100}%`,
              width: `${(overlap / total) * 100}%` 
            }}
          >
            <span className="bg-white/80 text-purple-700 px-1 rounded text-xs font-bold shadow-sm">
              ∩ : {overlap}
            </span>
          </div>

        </div>

        {/* Current State Info */}
        <div className="mt-6 flex justify-around text-sm">
          <div className="text-center">
            <div className="font-semibold text-blue-600">Aのみ</div>
            <div className="text-lg">{onlyA}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">共通部分 <InlineMath math="A \cap B" /></div>
            <div className="text-lg">{overlap}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-orange-600">Bのみ</div>
            <div className="text-lg">{onlyB}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-slate-500">どちらでもない <InlineMath math="\overline{A \cup B}" /></div>
            <div className="text-lg">{none}</div>
          </div>
        </div>

      </div>

      {/* Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg border-2 ${overlap === theoreticalMax ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50'}`}>
          <h4 className="font-bold text-slate-800 mb-2 flex items-center">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-sm">MAX</span>
            共通部分が最大になる時
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            どちらか一方が、もう一方に「すっぽり収まる」ときです。
          </p>
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <BlockMath math={`n(A \\cap B)_{max} = \\min(n(A), n(B))`} />
            <div className="text-purple-700 font-bold mt-2">
              最大値: {theoreticalMax}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${overlap === theoreticalMin ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          <h4 className="font-bold text-slate-800 mb-2 flex items-center">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm">MIN</span>
            共通部分が最小になる時
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            AとBを「なるべく離した」ときです。もし離しすぎて全体のU（{total}）を超えてしまう場合、仕方なくはみ出た分が最小の共通部分になります。
          </p>
          <div className="bg-white p-3 rounded shadow-sm text-center overflow-x-auto">
            <BlockMath math={`n(A \\cap B)_{min} = \\max(0, n(A) + n(B) - n(U))`} />
            <div className="text-red-700 font-bold mt-2">
              最小値: {theoreticalMin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
