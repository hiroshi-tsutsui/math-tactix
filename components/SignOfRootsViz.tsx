"use client";

import React, { useState } from "react";
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

export default function SignOfRootsViz() {
  const [m, setM] = useState(3.5);

  const D4 = m * m - (m + 6);
  const axis = m;
  const f0 = m + 6;

  const data = [];
  for (let x = -8; x <= 8; x += 0.2) {
    data.push({
      x: Number(x.toFixed(1)),
      y: x * x - 2 * m * x + (m + 6),
    });
  }

  let roots: number[] = [];
  if (D4 > 0) {
    roots = [m - Math.sqrt(D4), m + Math.sqrt(D4)];
  } else if (D4 === 0) {
    roots = [m, m];
  }

  let rootCondition = "実数解なし";
  if (D4 > 0) {
    if (roots[0] > 0 && roots[1] > 0) rootCondition = "異なる2つの正の解";
    else if (roots[0] < 0 && roots[1] < 0) rootCondition = "異なる2つの負の解";
    else if (roots[0] < 0 && roots[1] > 0) rootCondition = "異符号の解";
    else rootCondition = "一方が0の解";
  } else if (D4 === 0) {
    if (roots[0] > 0) rootCondition = "正の重解";
    else if (roots[0] < 0) rootCondition = "負の重解";
    else rootCondition = "0の重解";
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
        2次方程式の実数解の符号条件の視覚化
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        方程式 <span className="font-mono bg-slate-100 px-1 rounded">x² - 2mx + (m + 6) = 0</span> の実数解の符号と、その条件を視覚化します。
        <br />
        パラメータ $m$ をスライダーで動かし、解が「ともに正」「ともに負」「異符号」となる条件（$D/4$, 軸の位置, $f(0)$）を確認しましょう。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              パラメータ m: {m.toFixed(1)}
            </label>
            <input
              type="range"
              min="-8"
              max="8"
              step="0.1"
              value={m}
              onChange={(e) => setM(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="font-bold text-slate-800">
              現在の状態: <span className="text-blue-600">{rootCondition}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
              <div className={`p-2 rounded border ${D4 > 0 ? 'bg-green-50 border-green-200' : D4 === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="font-bold text-center">① 判別式 D/4</div>
                <div className="text-center font-mono text-slate-600">{D4.toFixed(2)}</div>
                <div className={`text-center font-bold mt-1 ${D4 > 0 ? 'text-green-600' : D4 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {D4 > 0 ? 'D/4 > 0' : D4 === 0 ? 'D/4 = 0' : 'D/4 < 0'}
                </div>
              </div>
              
              <div className={`p-2 rounded border ${axis > 0 ? 'bg-indigo-50 border-indigo-200' : axis < 0 ? 'bg-orange-50 border-orange-200' : 'bg-slate-100 border-slate-200'}`}>
                <div className="font-bold text-center">② 軸の位置 x</div>
                <div className="text-center font-mono text-slate-600">{axis.toFixed(2)}</div>
                <div className={`text-center font-bold mt-1 ${axis > 0 ? 'text-indigo-600' : axis < 0 ? 'text-orange-600' : 'text-slate-500'}`}>
                  {axis > 0 ? '軸 > 0' : axis < 0 ? '軸 < 0' : '軸 = 0'}
                </div>
              </div>

              <div className={`p-2 rounded border ${f0 > 0 ? 'bg-purple-50 border-purple-200' : f0 < 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-100 border-slate-200'}`}>
                <div className="font-bold text-center">③ y切片 f(0)</div>
                <div className="text-center font-mono text-slate-600">{f0.toFixed(2)}</div>
                <div className={`text-center font-bold mt-1 ${f0 > 0 ? 'text-purple-600' : f0 < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {f0 > 0 ? 'f(0) > 0' : f0 < 0 ? 'f(0) < 0' : 'f(0) = 0'}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 mt-4 space-y-1 bg-white p-3 rounded border border-slate-200 shadow-sm">
              <p>📌 <b>異なる2つの正の解の条件:</b><br/><span className="pl-4 text-slate-800 font-medium">D&gt;0 かつ 軸&gt;0 かつ f(0)&gt;0</span></p>
              <p>📌 <b>異なる2つの負の解の条件:</b><br/><span className="pl-4 text-slate-800 font-medium">D&gt;0 かつ 軸&lt;0 かつ f(0)&gt;0</span></p>
              <p>📌 <b>異符号の解の条件:</b><br/><span className="pl-4 text-slate-800 font-medium">f(0)&lt;0  (※このとき自動的に D&gt;0 となる)</span></p>
            </div>
          </div>
        </div>

        <div className="h-64 md:h-80 w-full border border-slate-200 rounded bg-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[-8, 8]} stroke="#64748b" tick={{fontSize: 12}} />
              <YAxis domain={[-10, 20]} stroke="#64748b" tick={{fontSize: 12}} />
              <ReferenceLine y={0} stroke="#0f172a" strokeWidth={2} />
              <ReferenceLine x={0} stroke="#0f172a" strokeWidth={2} />
              
              <ReferenceLine x={axis} stroke="#818cf8" strokeDasharray="4 4" />
              
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
              
              {/* Plot roots */}
              {roots.length > 0 && roots.map((r, i) => (
                <ReferenceDot key={i} x={r} y={0} r={6} fill={r > 0 ? "#10b981" : r < 0 ? "#ef4444" : "#f59e0b"} stroke="white" strokeWidth={2} />
              ))}
              
              {/* Plot f(0) */}
              <ReferenceDot x={0} y={f0} r={5} fill="#a855f7" stroke="white" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
