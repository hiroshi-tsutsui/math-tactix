"use client";

import React, { useState, useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

export default function RadicalFunctionViz() {
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

    // Domain boundary (dashed vertical line at x = hShift)
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    const boundPx = cx + hShift * scale;
    ctx.beginPath(); ctx.moveTo(boundPx, 0); ctx.lineTo(boundPx, h); ctx.stroke();
    ctx.setLineDash([]);

    // Shade domain region
    ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
    ctx.fillRect(0, 0, boundPx, h);

    // Draw y = a * sqrt(x - hShift) + vShift
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      const inner = x - hShift;
      if (inner < 0) continue;
      const y = a * Math.sqrt(inner) + vShift;
      const py = cy - y * scale;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Starting point
    const startY = a * Math.sqrt(0) + vShift;
    const startPy = cy - startY * scale;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(boundPx, startPy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    const hStr = hShift === 0 ? 'x' : hShift > 0 ? `x - ${hShift}` : `x + ${-hShift}`;
    const prefix = a === 1 ? '' : a === -1 ? '-' : `${a}`;
    const vStr = vShift === 0 ? '' : vShift > 0 ? ` + ${vShift}` : ` - ${-vShift}`;
    ctx.fillText(`y = ${prefix}\u221A(${hStr})${vStr}`, 12, 25);

    ctx.fillStyle = '#ef4444';
    ctx.font = '12px sans-serif';
    ctx.fillText(`定義域: x \u2265 ${hShift}`, 12, 45);
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
      <HintButton hints={[
        { step: 1, text: '無理関数 y = a√(x - h) + v の定義域は x >= h です。根号の中身が負になると実数値が存在しません。' },
        { step: 2, text: 'a > 0 なら右上に伸びる曲線、a < 0 なら右下に伸びる曲線になります。' },
        { step: 3, text: 'グラフの始点は (h, v) で、x が大きくなると増加（a > 0 の場合）しますが、増加の割合は次第に緩やかになります。' },
      ]} />
    </div>
  );
}
