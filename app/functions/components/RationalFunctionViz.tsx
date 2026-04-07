"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function RationalFunctionViz() {
  const [k, setK] = useState(1);
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
    const rangeX = w / (2 * scale);
    const rangeY = h / (2 * scale);
    for (let gx = -Math.ceil(rangeX); gx <= Math.ceil(rangeX); gx++) {
      const px = cx + gx * scale;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let gy = -Math.ceil(rangeY); gy <= Math.ceil(rangeY); gy++) {
      const py = cy - gy * scale;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Asymptotes (dashed)
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    // Vertical asymptote: x = hShift
    const vaPx = cx + hShift * scale;
    ctx.beginPath(); ctx.moveTo(vaPx, 0); ctx.lineTo(vaPx, h); ctx.stroke();
    // Horizontal asymptote: y = vShift
    const haPy = cy - vShift * scale;
    ctx.beginPath(); ctx.moveTo(0, haPy); ctx.lineTo(w, haPy); ctx.stroke();
    ctx.setLineDash([]);

    // Draw y = k/(x - hShift) + vShift
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    const step = 0.05;

    // Left branch (x < hShift)
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      if (Math.abs(x - hShift) < 0.02) {
        started = false;
        continue;
      }
      if (x >= hShift) break;
      const y = k / (x - hShift) + vShift;
      const py = cy - y * scale;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Right branch (x > hShift)
    ctx.beginPath();
    started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      if (x <= hShift) continue;
      if (Math.abs(x - hShift) < 0.02) continue;
      const y = k / (x - hShift) + vShift;
      const py = cy - y * scale;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    const hStr = hShift === 0 ? 'x' : hShift > 0 ? `x - ${hShift}` : `x + ${-hShift}`;
    const vStr = vShift === 0 ? '' : vShift > 0 ? ` + ${vShift}` : ` - ${-vShift}`;
    ctx.fillText(`y = ${k}/(${hStr})${vStr}`, 12, 25);

    ctx.fillStyle = '#f97316';
    ctx.font = '12px sans-serif';
    ctx.fillText(`漸近線: x = ${hShift}, y = ${vShift}`, 12, 45);
  }, [k, hShift, vShift]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            k = {k}
          </label>
          <input type="range" min={-5} max={5} step={0.5} value={k}
            onChange={e => setK(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            水平移動 = {hShift}
          </label>
          <input type="range" min={-4} max={4} step={0.5} value={hShift}
            onChange={e => setHShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            垂直移動 = {vShift}
          </label>
          <input type="range" min={-4} max={4} step={0.5} value={vShift}
            onChange={e => setVShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>
    </div>
  );
}
