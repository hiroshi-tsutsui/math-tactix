import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

export default function TwoParabolasSizeViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [p, setP] = useState(1);
  const [q, setQ] = useState(2);
  const [a, setA] = useState(-1);
  const [b, setB] = useState(-1);
  const [mode, setMode] = useState<'same_x' | 'any_x'>('same_x');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const ox = w / 2;
    const oy = h / 2;
    const scale = 20;

    const mapX = (x: number) => ox + x * scale;
    const mapY = (y: number) => oy - y * scale;

    const drawGrid = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let i = 0; i <= w; i += scale) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let j = 0; j <= h; j += scale) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    };

    const drawParabola = (fn: (x: number) => number, color: string, isDashed = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (isDashed) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let x = -w/2/scale; x <= w/2/scale; x += 0.1) {
        const y = fn(x);
        const sx = mapX(x);
        const sy = mapY(y);
        if (x === -w/2/scale) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawGrid();

    const f = (x: number) => Math.pow(x - p, 2) + q;
    const g = (x: number) => -Math.pow(x - a, 2) + b;

    drawParabola(f, '#3b82f6');
    drawParabola(g, '#ef4444');

    let sameXHolds = true;
    for (let x = -10; x <= 10; x += 0.1) {
      if (f(x) <= g(x)) {
        sameXHolds = false;
        break;
      }
    }
    
    const anyXHolds = q > b;

    ctx.font = 'bold 14px sans-serif';
    if (mode === 'same_x') {
      ctx.strokeStyle = sameXHolds ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      for (let x = -8; x <= 8; x += 0.5) {
        const y1 = f(x);
        const y2 = g(x);
        ctx.beginPath();
        ctx.moveTo(mapX(x), mapY(y1));
        ctx.lineTo(mapX(x), mapY(y2));
        ctx.stroke();
      }
      ctx.fillStyle = sameXHolds ? '#16a34a' : '#dc2626';
      ctx.fillText(sameXHolds ? "条件クリア: すべてのxで f(x) > g(x)" : "失敗: f(x) <= g(x) となるxが存在", 20, 30);
    } else {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, mapY(q)); ctx.lineTo(w, mapY(q)); ctx.stroke();
      
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(0, mapY(b)); ctx.lineTo(w, mapY(b)); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = anyXHolds ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, mapY(q), w, mapY(b) - mapY(q));

      ctx.fillStyle = anyXHolds ? '#16a34a' : '#dc2626';
      ctx.fillText(anyXHolds ? "条件クリア: fの最小値 > gの最大値" : "失敗: fの最小値 <= gの最大値", 20, 30);
    }
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`f 最小値: ${q.toFixed(1)}`, mapX(p) + 10, mapY(q) - 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`g 最大値: ${b.toFixed(1)}`, mapX(a) + 10, mapY(b) - 10);

  }, [p, q, a, b, mode]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-lg aspect-square bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <canvas ref={canvasRef} width={500} height={500} className="w-full h-full object-contain" />
      </div>

      <div className="w-full max-w-lg bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex justify-center gap-4 border-b border-slate-200 pb-4">
          <button
            onClick={() => setMode('same_x')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors ${mode === 'same_x' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            任意の x
          </button>
          <button
            onClick={() => setMode('any_x')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors ${mode === 'any_x' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            任意の x₁, x₂
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-bold text-blue-600 mb-1">
              <span>f(x) の高さ (最小値 q)</span>
              <span>{q.toFixed(1)}</span>
            </div>
            <input type="range" min="-5" max="5" step="0.5" value={q} onChange={e => setQ(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between text-sm font-bold text-red-600 mb-1">
              <span>g(x) の高さ (最大値 b)</span>
              <span>{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-5" max="5" step="0.5" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-red-500" />
          </div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "2つの放物線の大小関係は、差 f(x) - g(x) の符号で判定できます。" },
        { step: 2, text: "同じ x で f(x) > g(x) なら、その x での放物線 f のグラフが上にあります。" },
        { step: 3, text: "常に f(x) ≧ g(x) であるための条件は、差の最小値が 0 以上であることです。" },
      ]} />
    </div>
    </div>
  );
}
