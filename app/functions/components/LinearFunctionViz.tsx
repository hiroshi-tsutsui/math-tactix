"use client";

import React, { useState, useRef, useEffect } from 'react';

interface LinearFunctionVizProps {
  initialSlope?: number;
  initialIntercept?: number;
}

export default function LinearFunctionViz({ initialSlope = 1, initialIntercept = 0 }: LinearFunctionVizProps) {
  const [slope, setSlope] = useState(initialSlope);
  const [intercept, setIntercept] = useState(initialIntercept);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = 30;
    const rangeX = w / (2 * scale);

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let gx = -Math.floor(rangeX); gx <= Math.floor(rangeX); gx++) {
      const px = cx + gx * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    const rangeY = h / (2 * scale);
    for (let gy = -Math.floor(rangeY); gy <= Math.floor(rangeY); gy++) {
      const py = cy - gy * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('x', w - 15, cy - 8);
    ctx.fillText('y', cx + 8, 15);

    // Draw function y = slope * x + intercept
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = slope * x + intercept;
      const py = cy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Y-intercept point
    const yIntPx = cx;
    const yIntPy = cy - intercept * scale;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(yIntPx, yIntPy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    const sign = intercept >= 0 ? '+' : '';
    ctx.fillText(`y = ${slope}x ${sign}${intercept}`, 12, 25);
  }, [slope, intercept]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            傾き (a) = {slope}
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={slope}
            onChange={e => setSlope(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            切片 (b) = {intercept}
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={intercept}
            onChange={e => setIntercept(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
