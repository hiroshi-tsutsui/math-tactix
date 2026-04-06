"use client";

import React, { useState } from 'react';
;
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

export default function IndependentVariablesViz() {
  const [xVal, setXVal] = useState(0);
  const [yVal, setYVal] = useState(0);

  // Parabola 1: f(x) = (x - 2)^2 - 4
  const fX = Math.pow(xVal - 2, 2) - 4;
  // Parabola 2: g(y) = (y + 3)^2 - 9
  const gY = Math.pow(yVal + 3, 2) - 9;
  
  const z = fX + gY;

  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="p-4 bg-slate-900 border-slate-700">
        <h3 className="text-lg font-bold text-white mb-2">2変数関数の最大・最小（独立変数）</h3>
        <p className="text-sm text-slate-300 mb-4">
          <MathDisplay tex="z = x^2 - 4x + y^2 + 6y" /> の最小値を考えます。<br/>
          互いに独立な変数 <MathDisplay tex="x" /> と <MathDisplay tex="y" /> について、それぞれ平方完成を行うことで、2つの放物線の最小値の和として考えることができます。
        </p>
        <div className="bg-slate-800 p-4 rounded-md mb-4 text-center text-white">
          <MathDisplay tex="z = (x^2 - 4x) + (y^2 + 6y)" displayMode />
          <MathDisplay tex="z = \{(x - 2)^2 - 4\} + \{(y + 3)^2 - 9\}" displayMode />
          <MathDisplay tex="z = (x - 2)^2 + (y + 3)^2 - 13" displayMode />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h4 className="text-blue-400 font-medium text-center">xの動き</h4>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>x = {xVal.toFixed(1)}</span>
              <span>(x-2)² - 4 = {fX.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-2" max="6" step="0.1" 
              value={xVal} onChange={(e) => setXVal(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-slate-400 text-center">最小値: x=2 のとき -4</p>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="text-green-400 font-medium text-center">yの動き</h4>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>y = {yVal.toFixed(1)}</span>
              <span>(y+3)² - 9 = {gY.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-7" max="1" step="0.1" 
              value={yVal} onChange={(e) => setYVal(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
            <p className="text-xs text-slate-400 text-center">最小値: y=-3 のとき -9</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
          <h4 className="text-purple-400 font-bold mb-2">全体の最小値 z</h4>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-mono text-white">z = {z.toFixed(2)}</span>
            <span>
              {z.toFixed(2) === "-13.00" ? <span className="text-yellow-400 font-bold ml-2">最小値達成！ (-13)</span> : ""}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            2つの変数が完全に独立している（互いに影響し合わない）ため、
            xの式が最小になる瞬間と、yの式が最小になる瞬間を同時に満たすことができます。
            だからこそ「それぞれの最小値の和が全体の最小値になる」のです。
          </p>
        </div>
      </div>
    </div>
  );
}
