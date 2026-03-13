"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function GaussSymbolViz() {
  const [x, setX] = useState(2.3);
  
  const gaussX = Math.floor(x);
  
  const minX = -5;
  const maxX = 5;
  
  // Convert value to percentage across the range for number line rendering
  const getPercent = (val: number) => ((val - minX) / (maxX - minX)) * 100;

  return (
    <div className="flex flex-col items-center border p-6 rounded-lg bg-white shadow-sm w-full max-w-2xl mx-auto font-sans">
      <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-500 pb-2">ガウス記号 (Gauss Symbol)</h3>
      <p className="mb-4 text-gray-700 text-sm">
        実数 $x$ を超えない最大の整数を <InlineMath math="[x]" /> と表します。
      </p>

      <div className="w-full mb-8">
        <label className="block text-sm font-semibold mb-2">
          $x$ の値を調整してください: {x.toFixed(1)}
        </label>
        <input 
          type="range" 
          min={minX} 
          max={maxX} 
          step="0.1" 
          value={x} 
          onChange={(e) => setX(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="w-full relative h-32 bg-gray-50 rounded border p-4 mb-6">
        {/* Number line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-400 -translate-y-1/2 rounded"></div>
        
        {/* Ticks and integer labels */}
        {Array.from({ length: maxX - minX + 1 }).map((_, i) => {
          const val = minX + i;
          return (
            <div 
              key={val} 
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `calc(1rem + (100% - 2rem) * ${getPercent(val) / 100})` }}
            >
              <div className="w-0.5 h-3 bg-gray-600 mb-1"></div>
              <span className={`text-xs ${val === gaussX ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                {val}
              </span>
            </div>
          );
        })}

        {/* Current x marker */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-100"
          style={{ left: `calc(1rem + (100% - 2rem) * ${getPercent(x) / 100})` }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs font-bold text-blue-600 absolute -top-5">x={x.toFixed(1)}</span>
        </div>

        {/* Connection arrow from x to [x] */}
        {x !== gaussX && (
          <div 
            className="absolute top-1/2 mt-2 h-4 border-l-2 border-b-2 border-red-400 transition-all duration-100"
            style={{ 
              left: `calc(1rem + (100% - 2rem) * ${getPercent(gaussX) / 100})`, 
              width: `calc((100% - 2rem) * ${(x - gaussX) / (maxX - minX)})` 
            }}
          >
            {/* Arrowhead */}
            <div className="absolute -left-1.5 -bottom-1.5 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-red-400"></div>
          </div>
        )}
      </div>

      <div className="w-full bg-blue-50 p-4 rounded-md border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">計算と意味</h4>
        <div className="flex flex-col gap-2">
          <div className="text-center p-2 bg-white rounded shadow-sm">
            <BlockMath math={`x = ${x.toFixed(1)}`} />
          </div>
          <div className="text-center p-2 bg-white rounded shadow-sm border-l-4 border-red-500">
            <BlockMath math={`[${x.toFixed(1)}] = ${gaussX}`} />
          </div>
          <div className="text-sm text-gray-700 mt-2">
            <InlineMath math={`${gaussX} \\le ${x.toFixed(1)} < ${gaussX + 1}`} /> となるため、整数部分は <span className="font-bold text-red-600">{gaussX}</span> となります。
            {x < 0 && !Number.isInteger(x) && (
              <p className="mt-2 font-bold text-red-700 bg-red-50 p-2 rounded">
                ⚠️ 注意: 負の数の場合、単純に小数を切り捨てるのではなく、<br />「左側にある直近の整数」を選びます。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
