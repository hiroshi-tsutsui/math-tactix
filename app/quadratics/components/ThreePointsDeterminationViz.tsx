"use client";

import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
export default function ThreePointsDeterminationViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  
  const targetPoints = [
    { x: 1, y: -4 },
    { x: -1, y: 0 },
    { x: 3, y: 0 }
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cw = width / 2;
    const ch = height / 2;
    const scale = 30;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += scale) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for (let i = 0; i < height; i += scale) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(width, ch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw, 0); ctx.lineTo(cw, height); ctx.stroke();

    // Draw Target Points
    ctx.fillStyle = '#ef4444';
    targetPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(cw + p.x * scale, ch - p.y * scale, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw Parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px - cw) / scale;
      const y = a * x * x + b * x + c;
      const py = ch - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

  }, [a, b, c]);

  const f = (x: number) => a * x * x + b * x + c;
  const match = targetPoints.every(p => Math.abs(f(p.x) - p.y) < 0.1);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-xl font-bold mb-4">2次関数の決定 (3点から決定)</h3>
      <p className="text-gray-600 mb-4">
        3つの点 <MathDisplay tex="(1, -4), (-1, 0), (3, 0)" /> を通る2次関数 <MathDisplay tex="y = ax^2 + bx + c" /> を見つけよう。
      </p>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <canvas ref={canvasRef} width={400} height={400} className="border border-gray-200 bg-gray-50 rounded-lg w-full max-w-md mx-auto" />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">係数の調整</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MathDisplay tex="a" /> (開き具合): {a}
                </label>
                <input type="range" min="-3" max="3" step="0.5" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MathDisplay tex="b" /> (軸の移動): {b}
                </label>
                <input type="range" min="-5" max="5" step="0.5" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MathDisplay tex="c" /> (y切片): {c}
                </label>
                <input type="range" min="-5" max="5" step="0.5" value={c} onChange={(e) => setC(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">現在の方程式</h4>
            <MathDisplay tex={`y = ${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`} displayMode />
            {match ? (
              <div className="mt-4 bg-green-100 text-green-800 p-3 rounded font-bold text-center">
                ✨ 全ての点を通過しました！正解です！
              </div>
            ) : (
              <div className="mt-4 bg-red-100 text-red-800 p-3 rounded font-bold text-center">
                まだ通っていない点があります。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
