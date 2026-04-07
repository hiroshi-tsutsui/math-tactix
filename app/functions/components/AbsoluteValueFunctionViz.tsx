"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function AbsoluteValueFunctionViz() {
  const [a, setA] = useState(1);
  const [hShift, setHShift] = useState(0);
  const [vShift, setVShift] = useState(0);
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

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let gx = -Math.ceil(w / (2 * scale)); gx <= Math.ceil(w / (2 * scale)); gx++) {
      const px = cx + gx * scale;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let gy = -Math.ceil(h / (2 * scale)); gy <= Math.ceil(h / (2 * scale)); gy++) {
      const py = cy - gy * scale;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Draw y = a|x - hShift| + vShift
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = a * Math.abs(x - hShift) + vShift;
      const py = cy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Vertex point
    const vertexPx = cx + hShift * scale;
    const vertexPy = cy - vShift * scale;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(vertexPx, vertexPy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw y = x without absolute value (reference dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = a * (x - hShift) + vShift;
      const py = cy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    const hStr = hShift === 0 ? 'x' : hShift > 0 ? `x - ${hShift}` : `x + ${-hShift}`;
    const prefix = a === 1 ? '' : a === -1 ? '-' : `${a}`;
    const vStr = vShift === 0 ? '' : vShift > 0 ? ` + ${vShift}` : ` - ${-vShift}`;
    ctx.fillText(`y = ${prefix}|${hStr}|${vStr}`, 12, 25);

    ctx.fillStyle = '#ef4444';
    ctx.font = '12px sans-serif';
    ctx.fillText(`頂点: (${hShift}, ${vShift})`, 12, 45);
  }, [a, hShift, vShift]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">a = {a}</label>
          <input type="range" min={-3} max={3} step={0.5} value={a}
            onChange={e => setA(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">水平移動 = {hShift}</label>
          <input type="range" min={-4} max={4} step={0.5} value={hShift}
            onChange={e => setHShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">垂直移動 = {vShift}</label>
          <input type="range" min={-4} max={4} step={0.5} value={vShift}
            onChange={e => setVShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>
    </div>
  );
}
