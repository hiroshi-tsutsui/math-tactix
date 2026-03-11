"use client";
import React, { useState } from 'react';

export default function CompletingSquareViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(4);
  const [c, setC] = useState(3);

  const p = b / (2 * a);
  const q = c - (b * b) / (4 * a);

  return (
    <div className="p-4 border rounded shadow-sm bg-white text-gray-800">
      <h3 className="text-xl font-bold mb-4">二次関数の平方完成 (Completing the Square)</h3>
      <div className="flex gap-4 mb-4">
        <label>
          a: <input type="number" value={a} onChange={e => setA(Number(e.target.value) || 1)} className="border p-1 w-16" />
        </label>
        <label>
          b: <input type="number" value={b} onChange={e => setB(Number(e.target.value) || 0)} className="border p-1 w-16" />
        </label>
        <label>
          c: <input type="number" value={c} onChange={e => setC(Number(e.target.value) || 0)} className="border p-1 w-16" />
        </label>
      </div>
      <div className="font-mono text-lg space-y-2">
        <p>1. 基本形: <br/> y = {a}x² {b >= 0 ? '+' : ''} {b}x {c >= 0 ? '+' : ''} {c}</p>
        <p>2. aでくくる: <br/> y = {a}(x² {b/a >= 0 ? '+' : ''} {b/a}x) {c >= 0 ? '+' : ''} {c}</p>
        <p>3. 平方完成: <br/> y = {a}(x {p >= 0 ? '+' : ''} {p})² - {a * p * p} {c >= 0 ? '+' : ''} {c}</p>
        <p>4. 頂点形: <br/> y = {a}(x {p >= 0 ? '+' : ''} {p})² {q >= 0 ? '+' : ''} {q}</p>
      </div>
      <div className="mt-4 p-2 bg-blue-50 border-l-4 border-blue-500">
        <p className="font-bold">頂点 (Vertex): (-{p}, {q})</p>
        <p>軸 (Axis): x = -{p}</p>
      </div>
    </div>
  );
}
