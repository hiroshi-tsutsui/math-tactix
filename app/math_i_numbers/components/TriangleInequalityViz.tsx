"use client";

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function TriangleInequalityViz() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">絶対値の不等式 (三角不等式)</h3>
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-gray-700 mb-2">三角不等式 <MathComponent tex="|a| + |b| \ge |a + b|" className="inline" /> を視覚的に確認します。</p>
        <p className="text-sm text-gray-600">スライダーを動かして、a と b の符号が異なる場合に等号が成立しないことを確認してください。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">値 a: <span className="text-blue-600">{a}</span></label>
          <input
            type="range" min="-10" max="10" step="1" value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">値 b: <span className="text-green-600">{b}</span></label>
          <input
            type="range" min="-10" max="10" step="1" value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-inner flex flex-col items-center">
        <div className="w-full max-w-md relative h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400 z-10" />
          <div 
            className="absolute h-4 bg-blue-400 opacity-80 rounded-sm top-2"
            style={{ 
              left: a >= 0 ? '50%' : `calc(50% - ${Math.abs(a)*4}%)`, 
              width: `${Math.abs(a)*4}%` 
            }}
          />
          <div 
            className="absolute h-4 bg-green-400 opacity-80 rounded-sm top-8"
            style={{ 
              left: b >= 0 ? '50%' : `calc(50% - ${Math.abs(b)*4}%)`, 
              width: `${Math.abs(b)*4}%` 
            }}
          />
          <div 
            className="absolute h-4 bg-purple-500 opacity-80 rounded-sm top-14"
            style={{ 
              left: (a+b) >= 0 ? '50%' : `calc(50% - ${Math.abs(a+b)*4}%)`, 
              width: `${Math.abs(a+b)*4}%` 
            }}
          />
        </div>
        
        <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">|a| + |b|</div>
            <div className="text-xl font-bold text-gray-800">{Math.abs(a) + Math.abs(b)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">|a + b|</div>
            <div className="text-xl font-bold text-purple-600">{Math.abs(a + b)}</div>
          </div>
        </div>
        
        <div className={`mt-6 p-3 rounded-lg w-full text-center font-bold ${Math.abs(a) + Math.abs(b) === Math.abs(a + b) ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
          {Math.abs(a) + Math.abs(b) === Math.abs(a + b) 
            ? "等号成立: |a| + |b| = |a + b| (同符号または0)" 
            : "不等号: |a| + |b| > |a + b| (異符号)"}
        </div>
      </div>
    </div>
  );
}
