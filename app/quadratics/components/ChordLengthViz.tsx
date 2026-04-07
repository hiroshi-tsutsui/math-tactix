import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
export default function ChordLengthViz() {
  const [m, setM] = useState(1);
  const [n, setN] = useState(2);
  const a = 1; // y = x^2

  // Line is y = mx + n. Parabola is y = x^2.
  // Intersection: x^2 - mx - n = 0.
  // D = m^2 + 4n
  const D = m * m + 4 * n;
  
  const hasIntersections = D > 0;
  
  const rootD = hasIntersections ? Math.sqrt(D) : 0;
  const x1 = (m - rootD) / 2;
  const x2 = (m + rootD) / 2;

  const y1 = m * x1 + n;
  const y2 = m * x2 + n;

  // Length L = |x2 - x1| * sqrt(1 + m^2) = rootD * sqrt(1 + m^2)
  const lengthL = hasIntersections ? rootD * Math.sqrt(1 + m * m) : 0;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-indigo-500 pb-2 w-full text-center">
        放物線の弦の長さ
      </h2>
      
      <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <p className="text-slate-700 text-sm mb-2 text-center">放物線 <MathDisplay tex="y = x^2" /> と直線 <MathDisplay tex={`y = ${m}x + ${n >= 0 ? n : `(${n})`}`} /> の交点を結ぶ線分（弦）の長さを求めます。</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
              直線の傾き (m)
            </label>
            <div className="flex items-center space-x-3">
              <input 
                type="range" min="-3" max="3" step="0.5" 
                value={m} onChange={(e) => setM(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-sm font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded w-12 text-center">{m}</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
              直線の切片 (n)
            </label>
            <div className="flex items-center space-x-3">
              <input 
                type="range" min="-2" max="5" step="0.5" 
                value={n} onChange={(e) => setN(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-sm font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded w-12 text-center">{n}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-lg aspect-square bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden mb-6 shadow-inner">
        <svg viewBox="-5 -5 10 10" className="w-full h-full transform scale-y-[-1]">
          {/* Grid lines */}
          <g className="stroke-slate-200" strokeWidth="0.05">
            {Array.from({length: 11}).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={-5} y1={i - 5} x2={5} y2={i - 5} />
                <line x1={i - 5} y1={-5} x2={i - 5} y2={5} />
              </React.Fragment>
            ))}
          </g>
          
          {/* Axes */}
          <line x1="-5" y1="0" x2="5" y2="0" className="stroke-slate-400" strokeWidth="0.08" />
          <line x1="0" y1="-5" x2="0" y2="5" className="stroke-slate-400" strokeWidth="0.08" />
          
          {/* Parabola */}
          <path 
            d={`M -5 25 Q 0 0 5 25`} 
            fill="none" 
            className="stroke-indigo-500" 
            strokeWidth="0.12" 
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Line */}
          <line 
            x1="-5" y1={m * -5 + n} 
            x2="5" y2={m * 5 + n} 
            className="stroke-emerald-400 opacity-60" 
            strokeWidth="0.08" 
          />
          
          {/* Chord */}
          {hasIntersections && (
            <>
              <line 
                x1={x1} y1={y1} 
                x2={x2} y2={y2} 
                className="stroke-rose-500" 
                strokeWidth="0.2" 
                strokeLinecap="round"
              />
              <circle cx={x1} cy={y1} r="0.15" className="fill-rose-500" />
              <circle cx={x2} cy={y2} r="0.15" className="fill-rose-500" />
            </>
          )}
        </svg>
      </div>

      <div className="w-full bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm text-sm">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center">
          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mr-2 text-xs">理</span>
          弦の長さの求め方
        </h3>
        
        {hasIntersections ? (
          <div className="space-y-4 text-slate-600">
            <p>1. 交点のx座標 <MathDisplay tex="\alpha, \beta" /> を求めます（<MathDisplay tex="x^2 = mx + n \implies x^2 - mx - n = 0" /> の解）。</p>
            <MathDisplay tex={`D = (-${m})^2 - 4(1)(-${n}) = ${D}`} displayMode />
            
            <p>2. 解と係数の関係、または解の公式から差 <MathDisplay tex="\beta - \alpha" /> を求めます。</p>
            <MathDisplay tex={`|\\beta - \\alpha| = \\frac{\\sqrt{D}}{|a|} = \\sqrt{${D}}`} displayMode />
            
            <p>3. 直線の傾きが <MathDisplay tex="m" /> なので、交点間の距離 <MathDisplay tex="L" /> は三平方の定理より：</p>
            <div className="bg-white p-3 rounded border border-rose-100 shadow-inner">
              <MathDisplay tex={`L = |\\beta - \\alpha| \\sqrt{1 + m^2}`} displayMode />
              <MathDisplay tex={`L = \\sqrt{${D}} \\times \\sqrt{1 + (${m})^2} = \\sqrt{${D}} \\times \\sqrt{${1 + m * m}} = ${lengthL.toFixed(2)}`} displayMode />
            </div>
            <p className="text-center font-bold text-rose-600">弦の長さ: {lengthL.toFixed(2)}</p>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-4 bg-slate-100 rounded-lg">
            <p className="font-bold">交点がありません（弦が存在しません）</p>
            <MathDisplay tex={`D = ${D} < 0`} displayMode />
          </div>
        )}
      
      <HintButton hints={[
        { step: 1, text: "放物線と直線の交点間の弦の長さは L = |β - α|√(1 + m²) で求められます。" },
        { step: 2, text: "α, β は連立方程式の2つの解で、|β - α| = √D / |a| です（a は2次の係数）。" },
        { step: 3, text: "傾き m の直線上の2点間距離には √(1 + m²) の因子がかかります。" },
      ]} />
    </div>
    </div>
  );
}
