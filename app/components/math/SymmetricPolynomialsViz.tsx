"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function SymmetricPolynomialsViz() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(2);
  const [showSubtraction, setShowSubtraction] = useState(false);

  // Constants for visualization scaling
  const maxVal = 5;
  const scale = 20; // pixels per unit
  const sum = x + y;
  const totalSize = sum * scale;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex flex-col space-y-2 w-full max-w-xs">
          <label className="text-sm font-medium text-slate-700 flex justify-between">
            <span>幅 <InlineMath math="x" /></span>
            <span>{x}</span>
          </label>
          <input
            type="range"
            min="1"
            max={maxVal}
            step="0.5"
            value={x}
            onChange={(e) => {
              setX(parseFloat(e.target.value));
              setShowSubtraction(false);
            }}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full max-w-xs">
          <label className="text-sm font-medium text-slate-700 flex justify-between">
            <span>高さ <InlineMath math="y" /></span>
            <span>{y}</span>
          </label>
          <input
            type="range"
            min="1"
            max={maxVal}
            step="0.5"
            value={y}
            onChange={(e) => {
              setY(parseFloat(e.target.value));
              setShowSubtraction(false);
            }}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-md font-bold text-slate-800 mb-1">面積モデルによる視覚化</h3>
            <p className="text-xs text-slate-500">全体は <InlineMath math="(x+y)^2" /> の正方形</p>
          </div>
          
          <div 
            className="relative border-2 border-slate-800 bg-white"
            style={{ width: `${totalSize}px`, height: `${totalSize}px` }}
          >
            {/* x^2 block */}
            <div 
              className="absolute top-0 left-0 bg-blue-100 border border-blue-300 flex items-center justify-center transition-all duration-500"
              style={{ width: `${x * scale}px`, height: `${x * scale}px` }}
            >
              <span className="text-blue-700 font-bold text-sm"><InlineMath math="x^2" /></span>
            </div>

            {/* y^2 block */}
            <div 
              className="absolute bg-green-100 border border-green-300 flex items-center justify-center transition-all duration-500"
              style={{ 
                top: `${x * scale}px`, 
                left: `${x * scale}px`,
                width: `${y * scale}px`, 
                height: `${y * scale}px` 
              }}
            >
              <span className="text-green-700 font-bold text-sm"><InlineMath math="y^2" /></span>
            </div>

            {/* xy block 1 (Top Right) */}
            <div 
              className={`absolute top-0 flex items-center justify-center transition-all duration-700 ${showSubtraction ? 'bg-red-100 border border-red-300 opacity-20 transform translate-x-4 -translate-y-4' : 'bg-amber-100 border border-amber-300'}`}
              style={{ 
                left: `${x * scale}px`,
                width: `${y * scale}px`, 
                height: `${x * scale}px` 
              }}
            >
              <span className={`${showSubtraction ? 'text-red-700' : 'text-amber-700'} font-bold text-sm`}><InlineMath math="xy" /></span>
            </div>

            {/* xy block 2 (Bottom Left) */}
            <div 
              className={`absolute left-0 flex items-center justify-center transition-all duration-700 ${showSubtraction ? 'bg-red-100 border border-red-300 opacity-20 transform -translate-x-4 translate-y-4' : 'bg-amber-100 border border-amber-300'}`}
              style={{ 
                top: `${x * scale}px`,
                width: `${x * scale}px`, 
                height: `${y * scale}px` 
              }}
            >
              <span className={`${showSubtraction ? 'text-red-700' : 'text-amber-700'} font-bold text-sm`}><InlineMath math="xy" /></span>
            </div>
          </div>

          <button
            onClick={() => setShowSubtraction(!showSubtraction)}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium text-sm transition-colors border border-indigo-200"
          >
            {showSubtraction ? "2xy を元に戻す" : "2xy を引き離す"}
          </button>
        </div>

        <div className="flex flex-col justify-center space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-200 pb-2">基本対称式による表現</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">基本対称式の値</p>
              <div className="flex space-x-6">
                <div><InlineMath math="x + y =" /> <span className="font-bold text-indigo-600">{sum}</span></div>
                <div><InlineMath math="xy =" /> <span className="font-bold text-amber-600">{x * y}</span></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">目標の式: <InlineMath math="x^2 + y^2" /></p>
              <div className="text-sm overflow-x-auto text-center">
                <BlockMath math={`x^2 + y^2 = (x + y)^2 - 2xy`} />
                <BlockMath math={`= (${sum})^2 - 2(${x * y})`} />
                <BlockMath math={`= ${sum * sum} - ${2 * x * y}`} />
                <BlockMath math={`= ${sum * sum - 2 * x * y}`} />
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-2">
              <p className="font-bold text-slate-700 mb-1">💡 面積モデルの直感</p>
              <p>
                「<InlineMath math="x^2 + y^2" />」は青と緑の正方形の面積の和です。しかし、直接計算するよりも、
                全体の大きな正方形 <InlineMath math="(x+y)^2" /> から、不要な長方形 <InlineMath math="xy" /> を2つ引くほうが、計算が圧倒的に楽になる場面が多くあります（これを対称式の基本定理と呼びます）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
