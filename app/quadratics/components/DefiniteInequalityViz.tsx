"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DefiniteInequalityVizProps {
  k: number;
}

export default function DefiniteInequalityViz({ k }: DefiniteInequalityVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const scale = 40;
    const ox = w / 2;
    const oy = h / 2 + 50;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) { ctx.beginPath(); ctx.moveTo(ox + x * scale, 0); ctx.lineTo(ox + x * scale, h); ctx.stroke(); }
    for (let y = -10; y <= 10; y++) { ctx.beginPath(); ctx.moveTo(0, oy - y * scale); ctx.lineTo(w, oy - y * scale); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    // Parabola: y = x^2 + 2x + k = (x+1)^2 + (k-1)
    ctx.strokeStyle = k > 1 ? '#10B981' : '#EF4444'; // Green if condition met (k > 1), Red otherwise
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = x * x + 2 * x + k;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Condition Highlighting
    if (k > 1) {
      // Show "Always > 0" area
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(0, 0, w, oy); // Above x-axis
      
      // Text
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("All Real x (常に正)", ox, 30);
    } else {
      // Show Roots
      const D = 4 - 4 * k; // b^2 - 4ac = 4 - 4k
      if (D >= 0) {
        const x1 = (-2 - Math.sqrt(D)) / 2;
        const x2 = (-2 + Math.sqrt(D)) / 2;
        ctx.fillStyle = '#EF4444';
        [[x1, 0], [x2, 0]].forEach(([rx, ry]) => {
           ctx.beginPath(); ctx.arc(ox + rx * scale, oy, 5, 0, Math.PI * 2); ctx.fill();
        });
        
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Intersects (解あり)", ox, oy + 30);
      }
    }

  }, [k]);

  return (
    <div className="w-full aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden relative">
      <canvas ref={canvasRef} width={400} height={220} className="w-full h-full" />
      
      {/* Dynamic Equation Label */}
      <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: -5, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 font-bold text-sm text-slate-700"
        >
          y = x² + 2x + {k.toFixed(1)}
        </motion.div>
      </div>
    </div>
  );
}
