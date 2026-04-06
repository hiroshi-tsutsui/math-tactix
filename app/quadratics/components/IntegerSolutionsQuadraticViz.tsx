"use client";

import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
export default function IntegerSolutionsQuadraticViz() {
  const [a, setA] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Axes
    const cx = width / 2;
    const cy = height / 2 + 50;
    const scale = 30;

    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Draw integer points on x-axis
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for(let i = -10; i <= 10; i++) {
      const px = cx + i * scale;
      ctx.beginPath();
      ctx.arc(px, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(i.toString(), px, cy + 15);
    }

    // Function: y = x^2 - ax - 6
    const f = (x: number) => x * x - a * x - 6;

    // Draw Parabola
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    for (let px = 0; px <= width; px += 2) {
      const x = (px - cx) / scale;
      const y = f(x);
      const py = cy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Roots
    const d = Math.sqrt(a * a + 24);
    const r1 = (a - d) / 2;
    const r2 = (a + d) / 2;

    // Highlight region < 0 on x-axis
    ctx.beginPath();
    ctx.strokeStyle = '#a855f7'; // Purple
    ctx.lineWidth = 4;
    ctx.moveTo(cx + r1 * scale, cy);
    ctx.lineTo(cx + r2 * scale, cy);
    ctx.stroke();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.fillRect(cx + r1 * scale, cy - 20, (r2 - r1) * scale, 40);

    // Highlight integer solutions
    ctx.fillStyle = '#ef4444'; // Red
    for(let i = -10; i <= 10; i++) {
      if (i > r1 && i < r2) {
        const px = cx + i * scale;
        ctx.beginPath();
        ctx.arc(px, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [a]);

  const fStr = `x^2 - ${a}x - 6 < 0`;
  const fStrClean = fStr.replace('--', '+ ').replace('- 1x', '- x').replace('+ 1x', '+ x').replace('- 0x ', '');
  
  const d = Math.sqrt(a * a + 24);
  const r1 = (a - d) / 2;
  const r2 = (a + d) / 2;
  
  let solutions = [];
  for(let i = -10; i <= 10; i++) {
    if (i > r1 && i < r2) solutions.push(i);
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">2次不等式の整数解の個数</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          パラメータ <span className="font-mono text-blue-600">a = {a}</span>
        </label>
        <input 
          type="range" 
          min="-5" 
          max="5" 
          step="0.5" 
          value={a} 
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">対象の2次不等式:</p>
          <div className="text-center overflow-x-auto">
            <MathDisplay tex={fStrClean} displayMode />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-800 mb-2">満たす整数解 ({solutions.length}個):</p>
          <div className="text-center font-mono text-lg text-purple-900 overflow-x-auto">
            {solutions.length > 0 ? solutions.join(', ') : 'なし'}
          </div>
        </div>
      </div>

      <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          className="w-full max-w-full h-auto"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <p className="font-bold mb-1">💡 学習のポイント:</p>
        <p>2次不等式 <span className="font-mono">f(x) &lt; 0</span> の整数解の個数を考える問題は、グラフの <strong>x軸より下の部分（紫の帯）</strong> に含まれる整数（赤丸）を数えることと同じです。</p>
        <p className="mt-1">パラメータ <span className="font-mono">a</span> を動かすと放物線の軸が移動し、紫の帯が伸縮・移動します。特定の個数の整数解を持たせるための <span className="font-mono">a</span> の範囲を視覚的に確認しましょう。</p>
      </div>
    </div>
  );
}
