"use client";

import React, { useState, useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

interface FuncOption {
  label: string;
  eval: (x: number) => number;
}

const INNER_FUNCS: FuncOption[] = [
  { label: '2x + 1', eval: x => 2 * x + 1 },
  { label: 'x - 1', eval: x => x - 1 },
  { label: 'x\u00B2', eval: x => x * x },
  { label: '|x|', eval: x => Math.abs(x) },
];

const OUTER_FUNCS: FuncOption[] = [
  { label: 'x\u00B2', eval: x => x * x },
  { label: '2x', eval: x => 2 * x },
  { label: 'x + 3', eval: x => x + 3 },
  { label: '|x|', eval: x => Math.abs(x) },
];

export default function CompositeFunctionViz() {
  const [innerIdx, setInnerIdx] = useState(0);
  const [outerIdx, setOuterIdx] = useState(0);
  const [probeX, setProbeX] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const g = INNER_FUNCS[innerIdx];
  const f = OUTER_FUNCS[outerIdx];

  const gVal = g.eval(probeX);
  const fgVal = f.eval(gVal);

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
    const scale = 20;

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

    // g(x) - inner
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = g.eval(x);
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // f(x) - outer (thin)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = f.eval(x);
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // f(g(x)) - composite (thick)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = f.eval(g.eval(x));
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Probe point visualization
    const probePx = cx + probeX * scale;
    const gPy = cy - gVal * scale;
    const fgPy = cy - fgVal * scale;

    // Vertical line from x-axis to g(x)
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(probePx, cy); ctx.lineTo(probePx, gPy); ctx.stroke();
    ctx.setLineDash([]);

    // Point on g(x)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(probePx, gPy, 5, 0, Math.PI * 2); ctx.fill();

    // Point on f(g(x))
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(probePx, fgPy, 6, 0, Math.PI * 2); ctx.fill();

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`g(x) = ${g.label}`, 12, 20);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`f(x) = ${f.label}`, 12, 38);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`(f\u2218g)(x) = f(g(x))`, 12, 56);
  }, [innerIdx, outerIdx, probeX, g, f, gVal, fgVal]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />

      {/* Step display */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">合成関数のステップ</p>
        <p className="text-sm font-mono text-slate-700">x = {probeX}</p>
        <p className="text-sm font-mono text-amber-600">g({probeX}) = {g.label.replace(/x/g, `(${probeX})`)} = {gVal.toFixed(2)}</p>
        <p className="text-sm font-mono text-blue-600">f(g({probeX})) = f({gVal.toFixed(2)}) = {fgVal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-amber-600 mb-1">内側の関数 g(x)</p>
          <div className="flex flex-wrap gap-1">
            {INNER_FUNCS.map((fn, i) => (
              <button key={i} onClick={() => setInnerIdx(i)}
                className={`px-2 py-1 rounded text-xs font-bold ${innerIdx === i ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {fn.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-600 mb-1">外側の関数 f(x)</p>
          <div className="flex flex-wrap gap-1">
            {OUTER_FUNCS.map((fn, i) => (
              <button key={i} onClick={() => setOuterIdx(i)}
                className={`px-2 py-1 rounded text-xs font-bold ${outerIdx === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {fn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 block mb-1">入力値 x = {probeX}</label>
        <input type="range" min={-5} max={5} step={0.5} value={probeX}
          onChange={e => setProbeX(Number(e.target.value))} className="w-full accent-blue-600" />
      </div>
      <HintButton hints={[
        { step: 1, text: '(f∘g)(x) = f(g(x)) は g を先に適用してから f を適用する合成関数です。' },
        { step: 2, text: '合成の順序が重要です。一般に f(g(x)) と g(f(x)) は異なります。' },
        { step: 3, text: '定義域は「g の定義域のうち、g(x) の値が f の定義域に入るもの」に限られます。' },
      ]} />
    </div>
  );
}
