"use client";

import React, { useState, useRef, useEffect } from 'react';

type SymFunc = 'even' | 'odd' | 'neither';

interface FuncDef {
  label: string;
  type: SymFunc;
  eval: (x: number) => number;
  latex: string;
}

const FUNC_OPTIONS: FuncDef[] = [
  { label: 'x\u00B2', type: 'even', eval: x => x * x, latex: 'x^2' },
  { label: 'x\u00B2 + 1', type: 'even', eval: x => x * x + 1, latex: 'x^2 + 1' },
  { label: 'cos(x)', type: 'even', eval: x => Math.cos(x), latex: 'cos(x)' },
  { label: 'x\u00B3', type: 'odd', eval: x => x * x * x, latex: 'x^3' },
  { label: 'sin(x)', type: 'odd', eval: x => Math.sin(x), latex: 'sin(x)' },
  { label: 'x\u00B3 - x', type: 'odd', eval: x => x * x * x - x, latex: 'x^3 - x' },
  { label: 'x\u00B2 + x', type: 'neither', eval: x => x * x + x, latex: 'x^2 + x' },
  { label: 'x\u00B2 + 2x + 1', type: 'neither', eval: x => (x + 1) * (x + 1), latex: '(x+1)^2' },
];

export default function FunctionSymmetryViz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showMirror, setShowMirror] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const func = FUNC_OPTIONS[selectedIdx];

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
      ctx.beginPath(); ctx.moveTo(cx + gx * scale, 0); ctx.lineTo(cx + gx * scale, h); ctx.stroke();
    }
    for (let gy = -Math.ceil(h / (2 * scale)); gy <= Math.ceil(h / (2 * scale)); gy++) {
      ctx.beginPath(); ctx.moveTo(0, cy - gy * scale); ctx.lineTo(w, cy - gy * scale); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Symmetry axis/line highlight
    if (func.type === 'even') {
      // Y-axis highlight
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    } else if (func.type === 'odd') {
      // Origin highlight
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    }

    // Draw f(x)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = func.eval(x);
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mirror/reflected function
    if (showMirror) {
      ctx.setLineDash([5, 5]);
      if (func.type === 'even') {
        // f(-x) should equal f(x) — draw f(-x) in different color
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        started = false;
        for (let px = 0; px <= w; px++) {
          const x = (px - cx) / scale;
          const y = func.eval(-x);
          const py = cy - y * scale;
          if (py < -100 || py > h + 100) { started = false; continue; }
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (func.type === 'odd') {
        // -f(-x) should equal f(x)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        started = false;
        for (let px = 0; px <= w; px++) {
          const x = (px - cx) / scale;
          const y = -func.eval(-x);
          const py = cy - y * scale;
          if (py < -100 || py > h + 100) { started = false; continue; }
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else {
        // Show f(-x) to show it doesn't match
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        started = false;
        for (let px = 0; px <= w; px++) {
          const x = (px - cx) / scale;
          const y = func.eval(-x);
          const py = cy - y * scale;
          if (py < -100 || py > h + 100) { started = false; continue; }
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`f(x) = ${func.label}`, 12, 25);

    const typeLabel = func.type === 'even' ? '偶関数 (y軸対称)' : func.type === 'odd' ? '奇関数 (原点対称)' : 'どちらでもない';
    const typeColor = func.type === 'even' ? '#10b981' : func.type === 'odd' ? '#10b981' : '#ef4444';
    ctx.fillStyle = typeColor;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(typeLabel, 12, 45);
  }, [selectedIdx, showMirror, func]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="flex flex-wrap gap-2">
        {FUNC_OPTIONS.map((f, i) => (
          <button key={i}
            onClick={() => setSelectedIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedIdx === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
        <input type="checkbox" checked={showMirror} onChange={e => setShowMirror(e.target.checked)}
          className="accent-blue-600" />
        対称性チェック表示
      </label>
    </div>
  );
}
