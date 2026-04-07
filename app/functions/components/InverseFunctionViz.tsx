"use client";

import React, { useState, useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

interface FuncDef {
  label: string;
  eval: (x: number) => number | null;
  inverseEval: (x: number) => number | null;
  inverseLabel: string;
  domain: [number, number];
}

const FUNCS: FuncDef[] = [
  {
    label: '2x + 1',
    eval: x => 2 * x + 1,
    inverseEval: x => (x - 1) / 2,
    inverseLabel: '(x - 1)/2',
    domain: [-6, 6],
  },
  {
    label: 'x\u00B2 (x \u2265 0)',
    eval: x => x >= 0 ? x * x : null,
    inverseEval: x => x >= 0 ? Math.sqrt(x) : null,
    inverseLabel: '\u221Ax',
    domain: [0, 8],
  },
  {
    label: 'x\u00B3',
    eval: x => x * x * x,
    inverseEval: x => Math.cbrt(x),
    inverseLabel: '\u00B3\u221Ax',
    domain: [-4, 4],
  },
  {
    label: '3x - 2',
    eval: x => 3 * x - 2,
    inverseEval: x => (x + 2) / 3,
    inverseLabel: '(x + 2)/3',
    domain: [-5, 5],
  },
];

export default function InverseFunctionViz() {
  const [funcIdx, setFuncIdx] = useState(0);
  const [showInverse, setShowInverse] = useState(true);
  const [showYEqualsX, setShowYEqualsX] = useState(true);
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
    const scale = 25;

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

    // y = x line
    if (showYEqualsX) {
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(w, h - w);
      // More accurate: y = x means py = cy - x*scale, px = cx + x*scale
      const maxR = Math.max(w, h) / scale;
      ctx.moveTo(cx - maxR * scale, cy + maxR * scale);
      ctx.lineTo(cx + maxR * scale, cy - maxR * scale);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // f(x)
    ctx.strokeStyle = '#3b82f6';
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

    // f^{-1}(x)
    if (showInverse) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      started = false;
      for (let px = 0; px <= w; px++) {
        const x = (px - cx) / scale;
        const y = func.inverseEval(x);
        if (y === null) { started = false; continue; }
        const py = cy - y * scale;
        if (py < -100 || py > h + 100) { started = false; continue; }
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Legend
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`f(x) = ${func.label}`, 12, 22);
    if (showInverse) {
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`f\u207B\u00B9(x) = ${func.inverseLabel}`, 12, 42);
    }
    if (showYEqualsX) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('y = x', 12, showInverse ? 62 : 42);
    }
  }, [funcIdx, showInverse, showYEqualsX, func]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={500} height={360} className="w-full border border-slate-200 rounded-xl bg-white" />
      <div className="flex flex-wrap gap-2 mb-2">
        {FUNCS.map((f, i) => (
          <button key={i} onClick={() => setFuncIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${funcIdx === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            f(x) = {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" checked={showInverse} onChange={e => setShowInverse(e.target.checked)}
            className="accent-red-500" />
          逆関数を表示
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" checked={showYEqualsX} onChange={e => setShowYEqualsX(e.target.checked)}
            className="accent-slate-500" />
          y = x の直線
        </label>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
        <p className="text-xs text-blue-800 font-medium">
          逆関数 f\u207B\u00B9(x) は元の関数 f(x) のグラフを直線 y = x に関して対称に折り返したものです。
          f(a) = b ならば f\u207B\u00B9(b) = a となります。
        </p>
      </div>
      <HintButton hints={[
        { step: 1, text: 'y = f(x) の逆関数は x と y を入れ替えて x = f(y) を y について解いて求めます。' },
        { step: 2, text: 'y = f(x) と y = f\u207B\u00B9(x) のグラフは直線 y = x に関して対称です。' },
        { step: 3, text: '逆関数が存在するには、元の関数が単射（1対1）である必要があります。y = x\u00B2 は x \u2265 0 に制限しないと逆関数が定義できません。' },
      ]} />
    </div>
  );
}
