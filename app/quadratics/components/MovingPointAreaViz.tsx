"use client";
import React, { useState } from 'react';

export default function MovingPointAreaViz() {
  const [t, setT] = useState(2);
  const maxT = 4;
  
  // AC = 6, BC = 8
  const AC = 6;
  const BC = 8;
  const speedP = 1;
  const speedQ = 2;
  
  const cp = AC - speedP * t; // Distance from C to P
  const cq = speedQ * t;      // Distance from C to Q
  const area = 0.5 * cp * cq;
  
  const isMax = t === 3;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm text-black my-4">
      <h3 className="text-lg font-bold mb-2">2次関数の最大・最小の応用 (動点と面積)</h3>
      <p className="text-sm mb-4">
        直角三角形ABC (∠C=90°, AC=6, BC=8) の辺上を点が動きます。<br/>
        点PはAからCへ毎秒1の速さで、点QはCからBへ毎秒2の速さで同時に出発します。<br/>
        △PCQの面積 $S = \frac{1}{2}(6-t)(2t) = -t^2 + 6t$ の最大値を考えます。
      </p>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-64 h-64 border-l-2 border-b-2 border-gray-400 bg-gray-50 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Triangle ABC */}
            <polygon points="0,0 0,100 100,100" fill="rgba(200,200,255,0.2)" stroke="blue" strokeWidth="2" />
            <text x="5" y="15" fontSize="6" fill="blue">A</text>
            <text x="5" y="95" fontSize="6" fill="blue">C</text>
            <text x="90" y="95" fontSize="6" fill="blue">B</text>
            
            {/* Triangle PCQ */}
            <polygon 
              points={`0,${100 - (cp / AC) * 100} 0,100 ${(cq / BC) * 100},100`} 
              fill={isMax ? "rgba(255,100,100,0.8)" : "rgba(255,100,100,0.4)"} 
              stroke="red" 
              strokeWidth="2" 
            />
            {/* Point P */}
            <circle cx="0" cy={100 - (cp / AC) * 100} r="2" fill="red" />
            <text x="5" y={100 - (cp / AC) * 100 - 2} fontSize="5" fill="red">P</text>
            
            {/* Point Q */}
            <circle cx={(cq / BC) * 100} cy="100" r="2" fill="red" />
            <text x={(cq / BC) * 100 - 2} y="95" fontSize="5" fill="red">Q</text>
          </svg>
        </div>
        
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              経過時間 $t$: <span className="text-blue-600 font-bold">{t.toFixed(1)} 秒</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max={maxT} 
              step="0.1" 
              value={t} 
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 (出発)</span>
              <span>{maxT} (QがBに到達)</span>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm">CPの長さ = $6 - {t.toFixed(1)} = {cp.toFixed(1)}$</p>
            <p className="text-sm">CQの長さ = $2 \times {t.toFixed(1)} = {cq.toFixed(1)}$</p>
            <div className="mt-2 text-lg font-bold border-t pt-2 border-gray-300">
              面積 $S$: <span className={isMax ? "text-red-600 text-xl" : "text-gray-800"}>{area.toFixed(2)}</span>
            </div>
            {isMax && (
              <div className="mt-2 text-sm text-red-600 font-bold animate-pulse">
                最大値に達しました！ (t=3 のとき S=9)
              </div>
            )}
          </div>
          
          <div className="text-sm bg-blue-50 text-blue-800 p-3 rounded border border-blue-200">
            <strong>【解説】</strong><br/>
            面積 $S = \frac{1}{2}(6-t)(2t) = -t^2 + 6t$<br/>
            これを平方完成すると $S = -(t-3)^2 + 9$<br/>
            定義域 $0 \le t \le 4$ において、頂点 $t=3$ で最大値9をとります。
          </div>
        </div>
      </div>
    </div>
  );
}
