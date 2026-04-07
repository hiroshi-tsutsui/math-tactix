"use client";
import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

export default function AbsoluteInequalityViz() {
  const [k, setK] = useState<number>(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = 30; // 30px per unit

  // Equation: y = x^2 + kx + (k+3)
  const a = 1;
  const b = k;
  const c = k + 3;

  // Vertex
  const p = -b / (2 * a);
  const q = a * p * p + b * p + c;

  // Discriminant
  const D = b * b - 4 * a * c;

  const isAlwaysPositive = D < 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height - 100; // Shift origin down

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for(let x = -10; x <= 10; x++) {
      ctx.moveTo(originX + x * scale, 0);
      ctx.lineTo(originX + x * scale, height);
    }
    for(let y = -5; y <= 15; y++) {
      ctx.moveTo(0, originY - y * scale);
      ctx.lineTo(width, originY - y * scale);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    // X axis
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    // Y axis
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Fill "danger zone" (y <= 0)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Red zone
    ctx.fillRect(0, originY, width, height - originY);

    // Draw Parabola
    ctx.beginPath();
    const parabolaColor = isAlwaysPositive ? '#22c55e' : '#ef4444'; // Green if always > 0, else Red
    ctx.strokeStyle = parabolaColor;
    ctx.lineWidth = 3;

    for(let px = 0; px <= width; px += 2) {
      const x = (px - originX) / scale;
      const y = a * x * x + b * x + c;
      const py = originY - y * scale;
      if (px === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Vertex
    ctx.beginPath();
    ctx.fillStyle = parabolaColor;
    ctx.arc(originX + p * scale, originY - q * scale, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Vertex Label
    ctx.fillStyle = '#111827';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Vertex (${p.toFixed(1)}, ${q.toFixed(1)})`, originX + p * scale + 10, originY - q * scale - 10);

  }, [k, p, q, isAlwaysPositive]);

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4 border rounded-xl shadow-sm bg-white">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">常に成り立つ2次不等式</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">問題</h3>
            <p className="text-gray-700">すべての実数 <span className="font-mono">x</span> について、次の不等式が成り立つような定数 <span className="font-mono">k</span> の値の範囲を求めよ。</p>
            <div className="mt-2 text-center text-lg font-bold">
              <MathDisplay tex={`x^2 + kx + (k+3) > 0`} displayMode />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="block font-medium text-gray-700">
              パラメータ <span className="font-mono">k</span> を動かす: <span className="font-bold text-blue-600">{k.toFixed(1)}</span>
            </label>
            <input 
              type="range" 
              min="-5" 
              max="8" 
              step="0.1" 
              value={k} 
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-5</span>
              <span>0</span>
              <span>8</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-bold text-gray-700">現在の状態</h4>
            <div className="flex justify-between">
              <span>判別式 <span className="font-mono">D = k^2 - 4(k+3)</span></span>
              <span className="font-mono font-bold text-orange-600">{D.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>頂点のy座標 <span className="font-mono">q</span></span>
              <span className="font-mono font-bold text-purple-600">{q.toFixed(2)}</span>
            </div>

            <motion.div 
              className={`mt-4 p-3 rounded text-center font-bold text-white ${isAlwaysPositive ? 'bg-green-500' : 'bg-red-500'}`}
              animate={{ scale: isAlwaysPositive ? 1.05 : 1 }}
            >
              {isAlwaysPositive ? 'グラフはすべてx軸より上！ (D < 0)' : 'グラフがx軸と交わる、または下にある！ (D ≧ 0)'}
            </motion.div>
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-inner flex justify-center items-center p-2 min-h-[400px]">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-[400px] h-auto border border-gray-100 rounded"
          />
        </div>
      
      <HintButton hints={[
        { step: 1, text: "すべての x で f(x) > 0 が成り立つ条件は、グラフ全体が x 軸より上にあることです。" },
        { step: 2, text: "a > 0 のとき、頂点の y 座標が正（つまり D < 0）なら常に正です。" },
        { step: 3, text: "判別式 D = k² - 4(k+3) < 0 を解くと k の範囲が求まります。" },
      ]} />
    </div>
    </div>
  );
}
