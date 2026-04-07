
"use client";
import React, { useState } from 'react';
import HintButton from '../../components/HintButton';

export default function RightTriangleRectangleViz() {
  const [x, setX] = useState(2);
  const base = 4;
  const height = 4;
  
  const rectHeight = height - (height / base) * x;
  const area = x * rectHeight;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm text-black my-4">
      <h3 className="text-lg font-bold mb-2">直角三角形に内接する長方形の面積の最大値</h3>
      <p className="text-sm mb-4">底辺4, 高さ4の直角三角形に内接する長方形の面積を最大化します。</p>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-64 h-64 border-b-2 border-l-2 border-gray-400 bg-gray-50">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 0,100 100,100" fill="rgba(200,200,255,0.3)" stroke="blue" strokeWidth="2" />
            <rect 
              x="0" 
              y={100 - (rectHeight / height) * 100} 
              width={(x / base) * 100} 
              height={(rectHeight / height) * 100} 
              fill="rgba(255,100,100,0.5)" 
              stroke="red" 
              strokeWidth="2" 
            />
          </svg>
        </div>
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold mb-1">長方形の幅 x: {x.toFixed(1)}</label>
          <input 
            type="range" 
            min="0" 
            max="4" 
            step="0.1" 
            value={x} 
            onChange={(e) => setX(parseFloat(e.target.value))} 
            className="w-full mb-4 cursor-pointer"
          />
          <div className="bg-gray-100 p-3 rounded mb-2">
            <p className="text-sm">高さ y = 4 - x : <strong>{rectHeight.toFixed(1)}</strong></p>
            <p className="text-sm">面積 S = x(4 - x) : <strong className="text-red-600 text-lg">{area.toFixed(2)}</strong></p>
          </div>
          <p className="text-xs text-gray-600">
            xを変化させ、面積Sがいつ最大になるか確認しましょう。<br/>
            S = -x² + 4x = -(x-2)² + 4 より、x=2 のとき最大値 4 です。
          </p>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "直角三角形に内接する長方形の面積を、底辺 x の関数として表します。" },
        { step: 2, text: "相似を使って長方形の高さを x で表すと、面積は2次関数 S(x) = -x² + (底辺)x になります。" },
        { step: 3, text: "S(x) を平方完成して、頂点で最大値を求めます。" },
      ]} />
    </div>
    </div>
  );
}
