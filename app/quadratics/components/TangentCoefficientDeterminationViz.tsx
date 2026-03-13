import React, { useState, useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';

export default function TangentCoefficientDeterminationViz() {
  const [a, setA] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parabola: y = x^2 + ax + a
  // Line: y = -x - 1
  // Intersection: x^2 + ax + a = -x - 1 => x^2 + (a+1)x + (a+1) = 0
  // Tangency Condition: D = (a+1)^2 - 4(a+1) = (a+1)(a-3) = 0 => a = -1 or a = 3

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const scale = 40;
    const ox = w / 2;
    const oy = h / 2 + 80; // shift down a bit

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(0, oy - i * scale); ctx.lineTo(w, oy - i * scale); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox + i * scale, 0); ctx.lineTo(ox + i * scale, h); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    // Line: y = -x - 1
    ctx.strokeStyle = '#10b981'; // green
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy - (- (0 - ox)/scale - 1) * scale);
    ctx.lineTo(w, oy - (- (w - ox)/scale - 1) * scale);
    ctx.stroke();

    // Parabola: y = x^2 + ax + a
    const isTangent = Math.abs(a - (-1)) < 0.1 || Math.abs(a - 3) < 0.1;
    ctx.strokeStyle = isTangent ? '#f59e0b' : '#3b82f6'; // yellow if tangent, blue otherwise
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = x * x + a * x + a;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Roots
    const D = (a+1)*(a+1) - 4*(a+1);
    if (D >= 0) {
      const x1 = (-(a+1) - Math.sqrt(D)) / 2;
      const x2 = (-(a+1) + Math.sqrt(D)) / 2;
      const y1 = -x1 - 1;
      const y2 = -x2 - 1;

      ctx.fillStyle = isTangent ? '#f59e0b' : '#ef4444';
      ctx.beginPath(); ctx.arc(ox + x1 * scale, oy - y1 * scale, 5, 0, Math.PI * 2); ctx.fill();
      if (D > 0) {
        ctx.beginPath(); ctx.arc(ox + x2 * scale, oy - y2 * scale, 5, 0, Math.PI * 2); ctx.fill();
      }
    }

  }, [a]);

  const D = (a+1)*(a+1) - 4*(a+1);
  const isTangent = Math.abs(a - (-1)) < 0.1 || Math.abs(a - 3) < 0.1;

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="relative w-full max-w-lg aspect-video bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <canvas ref={canvasRef} width={600} height={337} className="w-full h-full" />
        {isTangent && (
          <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-lg text-sm font-bold shadow-sm animate-pulse">
            接する (D = 0)
          </div>
        )}
      </div>
      
      <div className="w-full max-w-md bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="text-sm font-bold text-slate-700 text-center mb-2">
          直線と接する条件から係数を決定
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">放物線:</span>
            <span className="font-mono text-blue-600"><InlineMath math={`y = x^2 + ${a.toFixed(1)}x + ${a.toFixed(1)}`} /></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">直線:</span>
            <span className="font-mono text-green-600"><InlineMath math={`y = -x - 1`} /></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">判別式 <InlineMath math="D" />:</span>
            <span className={`font-mono font-bold ${D > 0 ? 'text-red-500' : D === 0 ? 'text-yellow-600' : 'text-slate-400'}`}>
              {D.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 font-medium">係数 <InlineMath math="a" /></span>
            <span className="font-bold text-slate-700">{a.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="-3" max="5" step="0.1" 
            value={a} 
            onChange={(e) => setA(Number(e.target.value))}
            className={`w-full ${isTangent ? 'accent-yellow-500' : 'accent-blue-600'}`}
          />
        </div>

        <div className="text-xs text-slate-500 mt-4 leading-relaxed bg-slate-50 p-3 rounded text-center">
          <p>放物線と直線の方程式を連立して <InlineMath math="D = 0" /> となる <InlineMath math="a" /> を探します。</p>
          <div className="mt-2 text-slate-600">
            <InlineMath math="x^2 + (a+1)x + (a+1) = 0" />
          </div>
        </div>
      </div>
    </div>
  );
}
