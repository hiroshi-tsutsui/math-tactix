"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

export default function TranslationQuadraticViz() {
  const [p, setP] = useState(0); // x-translation
  const [q, setQ] = useState(0); // y-translation
  
  // Base function: y = x^2
  // Translated function: y = (x - p)^2 + q
  
  const generatePath = (isBase: boolean) => {
    let path = "";
    for (let x = -10; x <= 10; x += 0.5) {
      const realX = isBase ? x : x + p;
      const realY = isBase ? x * x : x * x + q;
      
      const svgX = 200 + realX * 20;
      const svgY = 300 - realY * 20;
      
      if (x === -10) {
        path += `M ${svgX} ${svgY} `;
      } else {
        path += `L ${svgX} ${svgY} `;
      }
    }
    return path;
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-white overflow-hidden mb-8">
      <div className="bg-slate-800 text-white p-4">
        <h2 className="text-xl font-bold">2次関数のグラフの平行移動</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 border p-4 rounded-lg bg-slate-50">
            <div>
              <p className="font-semibold mb-2">基準の関数:</p>
              <div className="bg-white p-2 rounded border inline-block min-w-[120px] text-center">
                <MathDisplay tex="y = x^2" />
              </div>
              <p className="text-sm text-slate-500 mt-2">頂点: <MathDisplay tex="(0, 0)" /></p>
            </div>
            
            <div className="pt-4 border-t">
              <p className="font-semibold mb-2">移動後の関数:</p>
              <div className="bg-blue-50 p-2 rounded border border-blue-200 inline-block min-w-[200px] text-center text-blue-800">
                <MathDisplay tex={`y = (x ${p > 0 ? `- ${p}` : p < 0 ? `+ ${Math.abs(p)}` : ""})^2 ${q !== 0 ? (q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`) : ""}`} />
              </div>
              <p className="text-sm text-slate-500 mt-2">頂点: <MathDisplay tex={`(${p}, ${q})`} /></p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-1 block">x軸方向の平行移動 (p): {p}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={p}
                  onChange={(e) => setP(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">y軸方向の平行移動 (q): {q}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={q}
                  onChange={(e) => setQ(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <button 
                onClick={() => {setP(0); setQ(0)}} 
                className="w-full mt-2 py-2 px-4 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
              >
                リセット
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mt-4 border border-blue-100">
              <p className="font-semibold mb-2">【ポイント】</p>
              <p>関数 <MathDisplay tex="y = f(x)" /> のグラフを x軸方向に <MathDisplay tex="p" />、y軸方向に <MathDisplay tex="q" /> だけ平行移動したグラフの方程式は、</p>
              <div className="text-center my-2">
                 <MathDisplay tex="y - q = f(x - p)" />
              </div>
              <p>すなわち、<MathDisplay tex="y = f(x - p) + q" /> となる。</p>
            </div>
          </div>

          <div className="border rounded-lg p-2 bg-white flex justify-center items-center overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 400" className="bg-slate-50 rounded" style={{maxWidth: '400px', maxHeight: '400px'}}>
              {/* Grid lines */}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="#e2e8f0" strokeWidth={i === 10 ? 2 : 1} />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#e2e8f0" strokeWidth={i === 15 ? 2 : 1} />
              ))}
              
              {/* Axes Labels */}
              <text x="380" y="295" fontSize="12" fill="#64748b">x</text>
              <text x="205" y="15" fontSize="12" fill="#64748b">y</text>
              <text x="185" y="315" fontSize="12" fill="#64748b">O</text>

              {/* Base Parabola */}
              <path
                d={generatePath(true)}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Translated Parabola */}
              <path
                d={generatePath(false)}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              
              {/* Vertices */}
              <circle cx="200" cy="300" r="4" fill="#64748b" />
              <circle cx={200 + p * 20} cy={300 - q * 20} r="5" fill="#2563eb" />
              
              {/* Translation Vector */}
              {(p !== 0 || q !== 0) && (
                <g>
                  <line 
                    x1="200" 
                    y1="300" 
                    x2={200 + p * 20} 
                    y2={300 - q * 20} 
                    stroke="#ef4444" 
                    strokeWidth="2" 
                    markerEnd="url(#arrow)"
                    strokeDasharray="4,2"
                  />
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                  </defs>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: 'y = ax\u00B2 を x 方向に p、y 方向に q 平行移動すると y = a(x - p)\u00B2 + q になります。' },
        { step: 2, text: '頂点は (0, 0) から (p, q) に移動します。グラフの形（開き具合）は変わりません。' },
        { step: 3, text: 'x 方向の移動は符号に注意: y = a(x - p)\u00B2 の p > 0 は右方向への移動です。' },
      ]} />
    </div>
  );
}
