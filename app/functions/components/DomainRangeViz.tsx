"use client";

import React, { useState, useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

interface FuncDef {
  label: string;
  eval: (x: number) => number | null;
  domainDesc: string;
  rangeDesc: string;
  domainCheck: (x: number) => boolean;
}

const FUNCS: FuncDef[] = [
  {
    label: 'x\u00B2',
    eval: x => x * x,
    domainDesc: '\u211D (全ての実数)',
    rangeDesc: 'y \u2265 0',
    domainCheck: () => true,
  },
  {
    label: '\u221Ax',
    eval: x => x >= 0 ? Math.sqrt(x) : null,
    domainDesc: 'x \u2265 0',
    rangeDesc: 'y \u2265 0',
    domainCheck: x => x >= 0,
  },
  {
    label: '1/x',
    eval: x => Math.abs(x) < 0.01 ? null : 1 / x,
    domainDesc: 'x \u2260 0',
    rangeDesc: 'y \u2260 0',
    domainCheck: x => Math.abs(x) > 0.01,
  },
  {
    label: '\u221A(4 - x\u00B2)',
    eval: x => {
      const inner = 4 - x * x;
      return inner >= 0 ? Math.sqrt(inner) : null;
    },
    domainDesc: '-2 \u2264 x \u2264 2',
    rangeDesc: '0 \u2264 y \u2264 2',
    domainCheck: x => 4 - x * x >= 0,
  },
  {
    label: '1/(x-1)',
    eval: x => Math.abs(x - 1) < 0.01 ? null : 1 / (x - 1),
    domainDesc: 'x \u2260 1',
    rangeDesc: 'y \u2260 0',
    domainCheck: x => Math.abs(x - 1) > 0.01,
  },
  {
    label: '\u221A(x - 1) + 2',
    eval: x => x >= 1 ? Math.sqrt(x - 1) + 2 : null,
    domainDesc: 'x \u2265 1',
    rangeDesc: 'y \u2265 2',
    domainCheck: x => x >= 1,
  },
];

export default function DomainRangeViz() {
  const [funcIdx, setFuncIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const func = FUNCS[funcIdx];

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

    // Shade undefined domain on x-axis
    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      if (!func.domainCheck(x)) {
        ctx.fillRect(px, 0, 1, h);
      }
    }

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

    // Domain highlight on x-axis
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    let inDomain = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      if (func.domainCheck(x)) {
        if (!inDomain) { ctx.moveTo(px, cy); inDomain = true; }
        else ctx.lineTo(px, cy);
      } else {
        inDomain = false;
      }
    }
    ctx.stroke();

    // Range highlight on y-axis
    const yValues: number[] = [];
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      const y = func.eval(x);
      if (y !== null) yValues.push(y);
    }
    if (yValues.length > 0) {
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      const y1 = cy - maxY * scale;
      const y2 = cy - minY * scale;
      ctx.beginPath(); ctx.moveTo(cx, Math.max(0, y1)); ctx.lineTo(cx, Math.min(h, y2)); ctx.stroke();
    }

    // Draw function
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx) / scale;
      const y = func.eval(x);
      if (y === null) { started = false; continue; }
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Labels
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(`f(x) = ${func.label}`, 12, 22);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`\u5B9A\u7FA9\u57DF: ${func.domainDesc}`, 12, 42);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`\u5024\u57DF: ${func.rangeDesc}`, 12, 60);
  }, [funcIdx, func]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="flex flex-wrap gap-2">
        {FUNCS.map((f, i) => (
          <button key={i} onClick={() => setFuncIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${funcIdx === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">定義域 (Domain)</p>
          <p className="text-sm font-medium text-slate-700">{func.domainDesc}</p>
          <p className="text-xs text-slate-500 mt-1">x軸上の青い線</p>
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">値域 (Range)</p>
          <p className="text-sm font-medium text-slate-700">{func.rangeDesc}</p>
          <p className="text-xs text-slate-500 mt-1">y軸上の緑の線</p>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: '定義域（domain）は関数に代入できる x の範囲です。分母が 0 になる点や根号の中が負になる点は除きます。' },
        { step: 2, text: '値域（range）は関数が実際にとりうる y の値の範囲です。グラフの上下の広がりを見ると分かります。' },
        { step: 3, text: '赤い領域は定義域外（関数が定義されない部分）を示しています。x 軸上の青い線が定義域、y 軸上の緑の線が値域です。' },
      ]} />
    </div>
  );
}
