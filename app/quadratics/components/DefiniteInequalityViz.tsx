"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import HintButton from '../../components/HintButton';

interface DefiniteInequalityVizProps {
  k: number;
}

export default function DefiniteInequalityViz({ k }: DefiniteInequalityVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants for the quadratic: y = x^2 + 2x + k
  // Vertex: (-1, k-1)
  // Discriminant D/4 = 1^2 - 1*k = 1 - k
  const D_quarter = 1 - k;
  const vertexY = k - 1;
  const isAlwaysPositive = vertexY > 0; // equivalent to D < 0 for a > 0

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    
    // Canvas settings
    const scale = 40; 
    const ox = w / 2;     // Origin X
    const oy = h / 2 + 50; // Origin Y (shifted down to show positive y mostly)

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid Background
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) { 
      ctx.beginPath(); ctx.moveTo(ox + x * scale, 0); ctx.lineTo(ox + x * scale, h); ctx.stroke(); 
    }
    for (let y = -5; y <= 15; y++) { 
      ctx.beginPath(); ctx.moveTo(0, oy - y * scale); ctx.lineTo(w, oy - y * scale); ctx.stroke(); 
    }

    // Axes
    ctx.strokeStyle = '#374151'; // gray-700
    ctx.lineWidth = 2;
    // X-axis
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    // Y-axis
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    // Condition Region (y > 0)
    // We want to highlight the region above x-axis that the graph MUST reside in
    // to be "Always Positive".
    // Let's use a subtle fill for the "Safe Zone" (y > 0)
    ctx.fillStyle = isAlwaysPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.05)';
    ctx.fillRect(0, 0, w, oy);

    // Parabola: y = x^2 + 2x + k
    ctx.strokeStyle = isAlwaysPositive ? '#10B981' : '#EF4444'; // Green if valid, Red if invalid
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Draw smooth curve
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = x * x + 2 * x + k;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Vertex Point
    const vx = -1;
    const vy = k - 1;
    const vpx = ox + vx * scale;
    const vpy = oy - vy * scale;
    
    ctx.fillStyle = isAlwaysPositive ? '#059669' : '#DC2626';
    ctx.beginPath(); 
    ctx.arc(vpx, vpy, 6, 0, Math.PI * 2); 
    ctx.fill();
    
    // Vertex Label
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(`V(-1, ${vy.toFixed(1)})`, vpx + 10, vpy);

    // Roots (if D >= 0)
    if (D_quarter >= 0) {
      const sqrtD = Math.sqrt(D_quarter);
      const x1 = -1 - sqrtD;
      const x2 = -1 + sqrtD;
      
      ctx.fillStyle = '#EF4444';
      [[x1, 0], [x2, 0]].forEach(([rx, ry]) => {
         const rpx = ox + rx * scale;
         const rpy = oy - ry * scale;
         ctx.beginPath(); ctx.arc(rpx, rpy, 4, 0, Math.PI * 2); ctx.fill();
      });
    }

  }, [k, isAlwaysPositive, D_quarter]);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-mono font-bold shadow-sm ${
          isAlwaysPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          D/4 = 1 - k = {D_quarter.toFixed(1)} <br/>
          {isAlwaysPositive ? '(D < 0: No Real Roots)' : '(D ≥ 0: Real Roots Exist)'}
        </div>
        
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-mono font-bold shadow-sm ${
          isAlwaysPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          Min Value (Vertex y): {vertexY.toFixed(1)} <br/>
          {isAlwaysPositive ? '(y > 0: Condition Met!)' : '(y ≤ 0: Condition Failed)'}
        </div>
      </div>

      <canvas ref={canvasRef} width={600} height={350} className="w-full h-auto block" />
      
      <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs text-slate-500 border border-slate-100">
        y = x² + 2x + {k.toFixed(1)}
      
      <HintButton hints={[
        { step: 1, text: "2次式が常に正（f(x) > 0 for all x）であるための条件は a > 0 かつ D < 0 です。" },
        { step: 2, text: "グラフが全体で x 軸より上にある ⟺ 頂点の y 座標が正 ⟺ D < 0。" },
        { step: 3, text: "k の値をスライダーで動かして、放物線が x 軸と交わるか交わらないかの境界を確認しましょう。" },
      ]} />
    </div>
    </div>
  );
}
