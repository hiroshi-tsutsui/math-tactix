"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import HintButton from '../../components/HintButton';

export default function XInterceptsDeterminationViz() {
  const [alpha, setAlpha] = useState(-2);
  const [beta, setBeta] = useState(4);
  const [px, setPx] = useState(1);
  const [py, setPy] = useState(6);

  // y = a(x - alpha)(x - beta)
  // a = y / ((x - alpha)(x - beta))
  
  const denom = (px - alpha) * (px - beta);
  let a = 0;
  let isValid = false;

  if (Math.abs(denom) > 0.001) {
    a = py / denom;
    isValid = true;
  }

  const data = [];
  for (let x = -6; x <= 6; x += 0.2) {
    data.push({
      x: Number(x.toFixed(1)),
      y: isValid ? a * (x - alpha) * (x - beta) : 0,
    });
  }

  const signStr = (n: number) => n >= 0 ? `-${n}` : `+${Math.abs(n)}`;
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
        x軸との交点から2次関数を決定
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        x軸との交点 $(\alpha, 0), (\beta, 0)$ と、通る点 $(p, q)$ を指定すると、
        <br/>
        <span className="font-mono bg-slate-100 px-1 rounded">y = a(x - α)(x - β)</span> の形から $a$ を求められます。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3">1. x軸との交点</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">α = {alpha}</label>
                <input type="range" min="-5" max="5" step="1" value={alpha} onChange={(e) => setAlpha(parseInt(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">β = {beta}</label>
                <input type="range" min="-5" max="5" step="1" value={beta} onChange={(e) => setBeta(parseInt(e.target.value))} className="w-full accent-blue-500" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              基本形: $y = a(x {signStr(alpha)})(x {signStr(beta)})$
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3">2. 通る点 (p, q)</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">x座標 p = {px}</label>
                <input type="range" min="-5" max="5" step="1" value={px} onChange={(e) => setPx(parseInt(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">y座標 q = {py}</label>
                <input type="range" min="-10" max="10" step="1" value={py} onChange={(e) => setPy(parseInt(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-800 text-sm mb-2">3. a の決定</h4>
            {isValid ? (
              <div className="space-y-1 text-sm text-green-900">
                <p>点({px}, {py}) を代入:</p>
                <p className="font-mono bg-white/50 p-1 rounded inline-block">
                  {py} = a({px} {signStr(alpha)})({px} {signStr(beta)})
                </p>
                <p className="font-mono">
                  {py} = a({px - alpha})({px - beta})
                </p>
                <p className="font-mono">
                  {denom}a = {py}
                </p>
                <p className="font-bold text-lg text-blue-700 mt-2">
                  a = {a === Math.round(a) ? a : a.toFixed(2)}
                </p>
                <p className="font-bold mt-2 pt-2 border-t border-green-200">
                  y = {a === Math.round(a) ? a : a.toFixed(2)}(x {signStr(alpha)})(x {signStr(beta)})
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-600 font-bold">
                ※ 通る点のx座標が交点と同じため、aを決定できません。
              </p>
            )}
          </div>
        </div>

        <div className="h-80 w-full border border-slate-200 rounded bg-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[-6, 6]} stroke="#64748b" tick={{fontSize: 12}} />
              <YAxis domain={[-12, 12]} stroke="#64748b" tick={{fontSize: 12}} />
              <ReferenceLine y={0} stroke="#0f172a" strokeWidth={2} />
              <ReferenceLine x={0} stroke="#0f172a" strokeWidth={2} />
              
              {isValid && (
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {/* Roots */}
              <ReferenceDot x={alpha} y={0} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
              <ReferenceDot x={beta} y={0} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
              
              {/* Point */}
              <ReferenceDot x={px} y={py} r={6} fill="#a855f7" stroke="white" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "x 切片 α, β ともう1点 (px, py) が与えられたとき、y = a(x-α)(x-β) の形を使います。" },
        { step: 2, text: "点 (px, py) を代入すると a = py / ((px-α)(px-β)) で a が決まります。" },
        { step: 3, text: "スライダーで α, β, 通る点を調整して、放物線がどう変化するか確認しましょう。" },
      ]} />
    </div>
    </div>
  );
}
