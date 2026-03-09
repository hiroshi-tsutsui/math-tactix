'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Props {
  problem: {
    description: string;
    explanation: string;
    a: number;
    b: number;
    c: number;
  };
}

export default function AbsoluteGraphLineViz({ problem }: Props) {
  const [k, setK] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 50; // shift down to show more top
    const scale = 25;

    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += scale) {
      ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
    }
    for (let i = 0; i < canvas.height; i += scale) {
      ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();

    // Axes
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
    ctx.stroke();

    // Draw Absolute Graph y = |x^2 - 4|
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    for (let px = 0; px < canvas.width; px++) {
      const x = (px - cx) / scale;
      const y = Math.abs(x * x - 4);
      const py = cy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Line y = x + k
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    const x1 = -10, y1 = x1 + k;
    const x2 = 10, y2 = x2 + k;
    ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
    ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
    ctx.stroke();

  }, [k]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-lg font-bold text-gray-800">{problem.description}</div>
      <canvas ref={canvasRef} width={400} height={350} className="border border-gray-300 bg-white rounded-lg shadow-sm" />
      <div className="flex flex-col items-center gap-2 w-full max-w-md">
        <label className="text-gray-700 font-medium">切片 k : {k.toFixed(1)}</label>
        <input 
          type="range" 
          min="-5" max="5" step="0.1" 
          value={k} 
          onChange={(e) => setK(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-md w-full max-w-md">
        {problem.explanation}
      </div>
    </div>
  );
}
