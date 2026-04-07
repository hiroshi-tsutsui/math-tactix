import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
export default function SegmentLengthViz() {
  const [c, setC] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const scaleX = 30;
    const scaleY = 15;
    const ox = w / 2;
    const oy = h / 2 + 50;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for(let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(0, oy - i * scaleY); ctx.lineTo(w, oy - i * scaleY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox + i * scaleX, 0); ctx.lineTo(ox + i * scaleX, h); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    // Parabola y = x^2 - 4x + c
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for(let px = 0; px <= w; px++) {
      const x = (px - ox) / scaleX;
      const y = x * x - 4 * x + c;
      const py = oy - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Intersection Points
    const D = 16 - 4 * c;
    if (D > 0) {
      const x1 = 2 - Math.sqrt(D) / 2;
      const x2 = 2 + Math.sqrt(D) / 2;
      const px1 = ox + x1 * scaleX;
      const px2 = ox + x2 * scaleX;
      
      // Highlight segment
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(px1, oy); ctx.lineTo(px2, oy); ctx.stroke();

      // Points
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(px1, oy, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px2, oy, 5, 0, Math.PI*2); ctx.fill();

      // Label L
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px sans-serif';
      const L = x2 - x1;
      ctx.fillText(`L = ${L.toFixed(1)}`, ox + 2 * scaleX - 10, oy - 15);
    }
  }, [c]);

  const D = 16 - 4 * c;
  const length = D > 0 ? Math.sqrt(D) : 0;

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="relative w-full max-w-lg aspect-video bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <canvas ref={canvasRef} width={600} height={337} className="w-full h-full" />
      </div>
      
      <div className="w-full max-w-md bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-sm font-bold text-slate-700">
          <span>切片 <MathDisplay tex="c" />: {c.toFixed(1)}</span>
          <span className="text-red-500">線分の長さ <MathDisplay tex="L" />: {length.toFixed(1)}</span>
        </div>
        <input 
          type="range" 
          min="-10" max="4" step="0.1" 
          value={c} 
          onChange={(e) => setC(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="text-xs text-slate-500 text-center">
          <MathDisplay tex="y = x^2 - 4x + c" /><br/>
          <MathDisplay tex="c" /> を動かして、<MathDisplay tex="L = 6" /> になる点を探してみよう
        </div>
      
      <HintButton hints={[
        { step: 1, text: "放物線上の2点間の線分の長さは、x 座標の差と y 座標の差から求めます。" },
        { step: 2, text: "垂直方向の線分なら L = |f(x₁) - f(x₂)|、斜めなら距離の公式を使います。" },
        { step: 3, text: "c を動かして指定された長さになる条件を見つけましょう。" },
      ]} />
    </div>
    </div>
  );
}
