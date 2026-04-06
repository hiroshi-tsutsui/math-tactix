"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function QuadraticSetsViz() {
  const [aBounds, setABounds] = useState([-2, 3]);
  const [bBounds, setBBounds] = useState([1, 4]);
  const [bType, setBType] = useState<'inside'|'outside'>('outside');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const ox = w / 2;
    const oy = h / 2;
    const scale = 30;

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, oy); ctx.lineTo(w - 20, oy); ctx.stroke();

    for(let i=-6; i<=6; i++) {
        const x = ox + i * scale;
        ctx.beginPath(); ctx.moveTo(x, oy - 5); ctx.lineTo(x, oy + 5); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x, oy + 20);
    }

    const ax1 = ox + aBounds[0] * scale;
    const ax2 = ox + aBounds[1] * scale;
    const ay = oy - 40;

    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax1, ay); ctx.lineTo(ax2, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax1, oy); ctx.lineTo(ax1, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax2, oy); ctx.lineTo(ax2, ay); ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(ax1, ay, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ax2, ay, 4, 0, Math.PI*2); ctx.fill();
    ctx.font = 'bold 14px sans-serif'; ctx.fillText('A', (ax1+ax2)/2, ay - 10);

    const bx1 = ox + bBounds[0] * scale;
    const bx2 = ox + bBounds[1] * scale;
    const by = oy - 20;

    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    if (bType === 'outside') {
        ctx.beginPath(); ctx.moveTo(20, by); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, by); ctx.lineTo(w-20, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx1, oy); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, oy); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx1, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx2, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.fillText('B', bx1 - 20, by - 10);
        ctx.fillText('B', bx2 + 20, by - 10);
    } else {
        ctx.beginPath(); ctx.moveTo(bx1, by); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx1, oy); ctx.lineTo(bx1, by); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, oy); ctx.lineTo(bx2, by); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx1, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx2, by, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.fillText('B', (bx1+bx2)/2, by - 10);
    }

    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    if (bType === 'outside') {
        if (aBounds[0] < bBounds[0]) {
            const ix1 = ox + aBounds[0] * scale;
            const ix2 = ox + Math.min(aBounds[1], bBounds[0]) * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
        if (aBounds[1] > bBounds[1]) {
            const ix1 = ox + Math.max(aBounds[0], bBounds[1]) * scale;
            const ix2 = ox + aBounds[1] * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
    } else {
        const start = Math.max(aBounds[0], bBounds[0]);
        const end = Math.min(aBounds[1], bBounds[1]);
        if (start < end) {
            const ix1 = ox + start * scale;
            const ix2 = ox + end * scale;
            ctx.fillRect(ix1, oy - 10, ix2 - ix1, 20);
        }
    }

  }, [aBounds, bBounds, bType]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <canvas ref={canvasRef} width={400} height={200} className="w-full max-w-md border border-slate-100 dark:border-slate-800 rounded-xl" />
        <p className="mt-4 text-sm text-slate-500 font-mono text-center">
          紫色の領域が A と B の共通部分です。<br/>
          整数解がいくつ含まれるか数えてみましょう。
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <div className="font-bold text-blue-700 dark:text-blue-400 mb-2">集合 A (閉区間: ≤, ≥)</div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-mono w-12 text-black dark:text-white">Min: {aBounds[0]}</span>
            <input type="range" min="-6" max="0" value={aBounds[0]} onChange={e => setABounds([parseInt(e.target.value), aBounds[1]])} className="w-full" />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span className="text-sm font-mono w-12 text-black dark:text-white">Max: {aBounds[1]}</span>
            <input type="range" min="1" max="6" value={aBounds[1]} onChange={e => setABounds([aBounds[0], parseInt(e.target.value)])} className="w-full" />
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
          <div className="font-bold text-red-700 dark:text-red-400 mb-2 flex justify-between items-center">
            <span>集合 B (開区間: &lt;, &gt;)</span>
            <button onClick={() => setBType(bType === "outside" ? "inside" : "outside")} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-md">
              Toggle: {bType === "outside" ? "x < b1, b2 < x" : "b1 < x < b2"}
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-mono w-12 text-black dark:text-white">b1: {bBounds[0]}</span>
            <input type="range" min="-4" max="2" value={bBounds[0]} onChange={e => setBBounds([parseInt(e.target.value), bBounds[1]])} className="w-full" />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span className="text-sm font-mono w-12 text-black dark:text-white">b2: {bBounds[1]}</span>
            <input type="range" min="3" max="6" value={bBounds[1]} onChange={e => setBBounds([bBounds[0], parseInt(e.target.value)])} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
