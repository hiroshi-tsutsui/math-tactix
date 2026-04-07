"use client";

import React, { useState, useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

type BaseFunc = 'x^2' | 'abs(x)' | 'sqrt(x)';

const baseFuncLabels: Record<BaseFunc, string> = {
  'x^2': 'x\u00B2',
  'abs(x)': '|x|',
  'sqrt(x)': '\u221Ax',
};

function evalBase(base: BaseFunc, x: number): number | null {
  switch (base) {
    case 'x^2': return x * x;
    case 'abs(x)': return Math.abs(x);
    case 'sqrt(x)': return x >= 0 ? Math.sqrt(x) : null;
  }
}

export default function FunctionTransformViz() {
  const [baseFunc, setBaseFunc] = useState<BaseFunc>('x^2');
  const [hShift, setHShift] = useState(0);
  const [vShift, setVShift] = useState(0);
  const [xFlip, setXFlip] = useState(false);
  const [yFlip, setYFlip] = useState(false);
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
    const scale = 25;

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

    // Original function (dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = evalBase(baseFunc, x);
      if (y === null) { started = false; continue; }
      const py = cy - y * scale;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Transformed function
    // y = (yFlip ? -1 : 1) * f((xFlip ? -1 : 1) * (x - hShift)) + vShift
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const innerX = (xFlip ? -1 : 1) * (x - hShift);
      const baseY = evalBase(baseFunc, innerX);
      if (baseY === null) { started = false; continue; }
      const y = (yFlip ? -1 : 1) * baseY + vShift;
      const py = cy - y * scale;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px sans-serif';
    const xSign = xFlip ? '-' : '';
    const hStr = hShift === 0 ? `${xSign}x` : hShift > 0 ? `${xSign}(x - ${hShift})` : `${xSign}(x + ${-hShift})`;
    const ySign = yFlip ? '-' : '';
    const vStr = vShift === 0 ? '' : vShift > 0 ? ` + ${vShift}` : ` - ${-vShift}`;
    ctx.fillText(`y = ${ySign}f(${hStr})${vStr}`, 12, 25);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(`f(x) = ${baseFuncLabels[baseFunc]}`, 12, 45);
  }, [baseFunc, hShift, vShift, xFlip, yFlip]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="flex gap-2 mb-2">
        {(Object.keys(baseFuncLabels) as BaseFunc[]).map(f => (
          <button key={f}
            onClick={() => setBaseFunc(f)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${baseFunc === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            f(x) = {baseFuncLabels[f]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">水平移動 = {hShift}</label>
          <input type="range" min={-5} max={5} step={0.5} value={hShift}
            onChange={e => setHShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">垂直移動 = {vShift}</label>
          <input type="range" min={-5} max={5} step={0.5} value={vShift}
            onChange={e => setVShift(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" checked={xFlip} onChange={e => setXFlip(e.target.checked)}
            className="accent-blue-600" />
          x軸方向に反転 (y軸対称)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" checked={yFlip} onChange={e => setYFlip(e.target.checked)}
            className="accent-blue-600" />
          y軸方向に反転 (x軸対称)
        </label>
      </div>
      <HintButton hints={[
        { step: 1, text: 'y = f(x - h) は元のグラフを x 方向に +h 平行移動します。符号に注意: x - h の h が正なら右へ移動です。' },
        { step: 2, text: 'y = f(x) + v は元のグラフを y 方向に +v 平行移動します。v > 0 なら上、v < 0 なら下です。' },
        { step: 3, text: 'y = f(-x) は y 軸に関する対称移動、y = -f(x) は x 軸に関する対称移動です。' },
      ]} />
    </div>
  );
}
