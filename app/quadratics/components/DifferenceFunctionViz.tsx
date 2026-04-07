'use client';
import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

export default function DifferenceFunctionViz({ onComplete }: { onComplete?: () => void }) {
  const [a, setA] = useState(1);
  const [m, setM] = useState(2);
  const [k, setK] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const scale = 30;
    const offsetX = width / 2;
    const offsetY1 = height / 3;
    const offsetY2 = (height * 3) / 4;

    const toX = (x: number) => offsetX + x * scale;
    const toY1 = (y: number) => offsetY1 - y * scale;
    const toY2 = (y: number) => offsetY2 - y * scale;

    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, offsetY1); ctx.lineTo(width, offsetY1);
    ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, height/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, offsetY2); ctx.lineTo(width, offsetY2);
    ctx.moveTo(offsetX, height/2); ctx.lineTo(offsetX, height);
    ctx.stroke();

    const f = (x: number) => a * x * x;
    const g = (x: number) => m * x + k;
    const h = (x: number) => f(x) - g(x);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i <= width; i++) {
      const x = (i - offsetX) / scale;
      const y = f(x);
      if(i === 0) ctx.moveTo(toX(x), toY1(y));
      else ctx.lineTo(toX(x), toY1(y));
    }
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toX(-10), toY1(g(-10)));
    ctx.lineTo(toX(10), toY1(g(10)));
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i <= width; i++) {
      const x = (i - offsetX) / scale;
      const y = h(x);
      if(i === 0) ctx.moveTo(toX(x), toY2(y));
      else ctx.lineTo(toX(x), toY2(y));
    }
    ctx.stroke();

    const D = m*m + 4*a*k;
    if(D >= 0 && a !== 0) {
      const x1 = (m - Math.sqrt(D)) / (2*a);
      const x2 = (m + Math.sqrt(D)) / (2*a);
      
      [x1, x2].forEach(x => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(toX(x), toY1(f(x)));
        ctx.lineTo(toX(x), toY2(h(x)));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(toX(x), toY1(f(x)), 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(toX(x), toY2(h(x)), 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (!hasCompleted && onComplete) {
      onComplete();
      setHasCompleted(true);
    }
  }, [a, m, k, hasCompleted, onComplete]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-2xl mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white mb-2">差の関数 h(x) = f(x) - g(x)</h3>
        <p className="text-sm text-gray-400">
          上段: f(x) と g(x) の交点
        </p>
        <p className="text-sm text-gray-400">
          下段: h(x) と x軸 の交点
        </p>
      </div>

      <div className="flex justify-center mb-6 relative">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={400} 
          className="bg-gray-900 rounded-lg shadow-inner w-full max-w-[500px]"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm block mb-1">放物線の開き a: {a.toFixed(1)}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="text-gray-300 text-sm block mb-1">直線の傾き m: {m.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={m} onChange={e => setM(parseFloat(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="text-gray-300 text-sm block mb-1">直線の切片 k: {k.toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.5" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full" />
        </div>
      
      <HintButton hints={[
        { step: 1, text: "2つの関数 f(x) と g(x) の差 f(x) - g(x) が正の範囲は、f(x) > g(x) が成り立つ範囲です。" },
        { step: 2, text: "差関数のグラフが x 軸より上にある範囲が解です。" },
        { step: 3, text: "差関数の零点（交点）を求めて、符号の変化を調べましょう。" },
      ]} />
    </div>
    </div>
  );
}
