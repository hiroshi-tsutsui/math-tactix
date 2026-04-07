"use client";

import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

export default function AbsoluteInequalityAllRealsViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-4);
  const [c, setC] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const discriminant = b * b - 4 * a * c;
  const isAllReals = a > 0 && discriminant < 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, w, h);
    
    // Origin mapping
    const originX = w / 2;
    const originY = h / 2 + 50; // shift down a bit
    const scale = 30;

    // Highlight "y > 0" region
    ctx.fillStyle = isAllReals ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.05)';
    ctx.fillRect(0, 0, w, originY);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(w, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, h);
    ctx.stroke();

    // Draw Parabola
    ctx.beginPath();
    ctx.strokeStyle = isAllReals ? '#22c55e' : '#3b82f6';
    ctx.lineWidth = 3;
    
    let first = true;
    for (let px = 0; px <= w; px++) {
      const x = (px - originX) / scale;
      const y = a * x * x + b * x + c;
      const py = originY - y * scale;
      
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw vertex
    if (a !== 0) {
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const pvx = originX + vx * scale;
      const pvy = originY - vy * scale;
      
      ctx.fillStyle = isAllReals ? '#15803d' : '#1d4ed8';
      ctx.beginPath();
      ctx.arc(pvx, pvy, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [a, b, c, isAllReals]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full relative">
        <h3 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2">すべての実数で成り立つ2次不等式（絶対不等式）</h3>
        <p className="text-slate-600 text-sm mb-4">
          不等式 <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">ax² + bx + c &gt; 0</span> がすべての実数xで成り立つ条件を視覚的に確認しましょう。
        </p>

        <div className="relative border rounded bg-slate-50 overflow-hidden flex justify-center py-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="bg-white border shadow-inner"
          />
          {isAllReals ? (
             <div className="absolute top-6 right-6 bg-green-100 text-green-800 px-3 py-1 rounded font-bold border border-green-300 shadow-sm animate-pulse">
               条件クリア (常に正)
             </div>
          ) : (
             <div className="absolute top-6 right-6 bg-red-100 text-red-800 px-3 py-1 rounded font-bold border border-red-300 shadow-sm">
               条件未達
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">a (グラフの向きと開き)</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">{a.toFixed(1)}</div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">b (軸の移動)</label>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">{b.toFixed(1)}</div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">c (上下の移動)</label>
            <input
              type="range"
              min="-5"
              max="10"
              step="0.1"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">{c.toFixed(1)}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-3 text-sm">判定条件: 常に y &gt; 0 となるには？</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center">
              <span className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-[10px] text-white ${a > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>{a > 0 ? '✓' : ''}</span>
              <div>
                <span className="block font-bold text-slate-700">1. 下に凸であること (a &gt; 0)</span>
                <span className="text-xs text-slate-500">上に凸(a &lt; 0)だと、必ずどこかでx軸の下に潜ってしまいます。</span>
              </div>
            </li>
            <li className="flex items-center">
              <span className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-[10px] text-white ${discriminant < 0 ? 'bg-green-500' : 'bg-slate-300'}`}>{discriminant < 0 ? '✓' : ''}</span>
              <div>
                <span className="block font-bold text-slate-700">2. x軸と交わらないこと (判別式 D &lt; 0)</span>
                <span className="text-xs text-slate-500">D ≥ 0 だと、x軸と交わるか接するため、y &gt; 0 が崩れます。</span>
              </div>
            </li>
          </ul>
          <div className="mt-4 text-center p-3 bg-white rounded border border-slate-300 font-mono text-sm shadow-sm">
            D = b² - 4ac = ({b.toFixed(1)})² - 4({a.toFixed(1)})({c.toFixed(1)}) = <span className={discriminant < 0 ? 'text-green-600 font-bold' : 'text-red-600'}>{discriminant.toFixed(2)}</span>
          </div>
        </div>
        <HintButton hints={[
          { step: 1, text: 'ax\u00B2 + bx + c > 0 が全ての実数 x で成り立つ条件は、a > 0 かつ判別式 D < 0 です。' },
          { step: 2, text: 'a > 0（下に凸）でないと、x \u2192 \u00B1\u221E で必ず負になります。D \u2265 0 だと x 軸と交わるか接するため不等式が崩れます。' },
          { step: 3, text: '判別式 D = b\u00B2 - 4ac < 0 のとき、放物線は x 軸と交わらず、常に正（a > 0 の場合）になります。' },
        ]} />
      </div>
    </div>
  );
}
