"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HintButton from '../../components/HintButton';

export default function CommonTangentViz() {
  const [m, setM] = useState<number>(2);
  const [n, setN] = useState<number>(-1);
  const [k, setK] = useState<number>(0); // Vertical shift of the second parabola

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Math setup
  // f(x) = x^2
  // g(x) = -x^2 + 4x - 4 + k
  // Line = mx + n

  // D1 = m^2 + 4n
  const D1 = m * m + 4 * n;
  
  // D2 for g(x) = mx + n
  // -x^2 + 4x - 4 + k = mx + n
  // x^2 + (m-4)x + (n + 4 - k) = 0
  const D2 = (m - 4) * (m - 4) - 4 * (n + 4 - k);

  const isTangent1 = Math.abs(D1) < 0.1;
  const isTangent2 = Math.abs(D2) < 0.1;
  const isCommonTangent = isTangent1 && isTangent2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate system
    const scale = 30; // pixels per unit
    const ox = width / 2;
    const oy = height / 2 + 50;

    const toX = (x: number) => ox + x * scale;
    const toY = (y: number) => oy - y * scale;

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(toX(i), 0); ctx.lineTo(toX(i), height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, toY(i)); ctx.lineTo(width, toY(i)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(width, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, height); ctx.stroke();

    // Helper: draw function
    const drawFunction = (fn: (x: number) => number, color: string, width: number = 2) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      for (let px = 0; px <= canvas.width; px += 2) {
        const x = (px - ox) / scale;
        const y = fn(x);
        const py = toY(y);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    // Parabola 1: y = x^2
    drawFunction(x => x * x, "#3b82f6", 3);

    // Parabola 2: y = -x^2 + 4x - 4 + k
    drawFunction(x => -x * x + 4 * x - 4 + k, "#ef4444", 3);

    // Line: y = mx + n
    drawFunction(x => m * x + n, isCommonTangent ? "#eab308" : "#10b981", isCommonTangent ? 4 : 2);

    // Intersection Points logic for Parabola 1
    if (D1 >= 0) {
      const x1 = (m - Math.sqrt(D1)) / 2;
      const x2 = (m + Math.sqrt(D1)) / 2;
      const points = D1 < 0.1 ? [m / 2] : [x1, x2];
      ctx.fillStyle = "#10b981";
      points.forEach(x => {
        const y = m * x + n;
        ctx.beginPath(); ctx.arc(toX(x), toY(y), 5, 0, Math.PI * 2); ctx.fill();
      });
    }

    // Intersection Points logic for Parabola 2
    if (D2 >= 0) {
      const x1 = (-(m - 4) - Math.sqrt(D2)) / 2;
      const x2 = (-(m - 4) + Math.sqrt(D2)) / 2;
      const points = D2 < 0.1 ? [-(m - 4) / 2] : [x1, x2];
      ctx.fillStyle = "#10b981";
      points.forEach(x => {
        const y = m * x + n;
        ctx.beginPath(); ctx.arc(toX(x), toY(y), 5, 0, Math.PI * 2); ctx.fill();
      });
    }

  }, [m, n, k, D1, D2, isCommonTangent]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-800 mb-2">2つの放物線の共通接線</h3>
      <p className="text-sm text-slate-500 mb-6 text-center">
        $f(x) = x^2$ (青) と $g(x) = -x^2 + 4x - 4 + k$ (赤) の両方に接する直線を引いてみよう。<br/>
        直線が接するとき、連立した方程式の判別式 $D$ が $0$ になります。
      </p>

      <div className="relative w-full aspect-video max-w-2xl bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-contain" />
        
        {isCommonTangent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg font-bold shadow-md"
          >
            共通接線を発見！ (D₁ = 0, D₂ = 0)
          </motion.div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2">直線の操作 ($y = mx + n$)</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">傾き $m$: {m.toFixed(1)}</label>
                <input type="range" min="-4" max="8" step="0.5" value={m} onChange={(e) => setM(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">切片 $n$: {n.toFixed(1)}</label>
                <input type="range" min="-8" max="4" step="0.5" value={n} onChange={(e) => setN(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2">放物線の操作</h4>
            <div>
              <label className="text-sm text-slate-600 block mb-1">上下移動 $k$: {k.toFixed(1)}</label>
              <input type="range" min="-4" max="4" step="0.5" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full accent-red-500" />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2">判別式の値</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className={`flex justify-between ${isTangent1 ? 'text-yellow-600 font-bold' : 'text-slate-600'}`}>
                <span>D₁ (青と緑):</span>
                <span>{D1.toFixed(2)} {D1 === 0 ? '(接する)' : D1 > 0 ? '(2交点)' : '(交点なし)'}</span>
              </div>
              <div className={`flex justify-between ${isTangent2 ? 'text-yellow-600 font-bold' : 'text-slate-600'}`}>
                <span>D₂ (赤と緑):</span>
                <span>{D2.toFixed(2)} {D2 === 0 ? '(接する)' : D2 > 0 ? '(2交点)' : '(交点なし)'}</span>
              </div>
            </div>
          </div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "2つの放物線の共通接線は、両方の放物線に接する直線です。" },
        { step: 2, text: "直線 y = mx + n が放物線に接する条件は、連立方程式の判別式 D = 0 です。" },
        { step: 3, text: "D₁ = 0 かつ D₂ = 0 を同時に満たす m, n が共通接線の傾きと切片です。" },
      ]} />
    </div>
    </div>
  );
}
