import React, { useRef, useEffect, useState } from 'react';
import HintButton from '../../components/HintButton';

export default function TwoParabolasViz({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(-2);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const ox = w / 2;
    const oy = h / 2 + 50; 
    const scale = 40;

    ctx.clearRect(0, 0, w, h);
    
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(0, oy - i * scale); ctx.lineTo(w, oy - i * scale); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox + i * scale, 0); ctx.lineTo(ox + i * scale, h); ctx.stroke();
    }
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

    // y1 = x^2
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = x * x;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // y2 = -x^2 + 2x + k
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = -x * x + 2 * x + k;
      const py = oy - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    const D_quarter = 1 + 2 * k;
    
    if (D_quarter > 0) {
      const x1 = (1 - Math.sqrt(D_quarter)) / 2;
      const x2 = (1 + Math.sqrt(D_quarter)) / 2;
      [x1, x2].forEach(ix => {
        const iy = ix * ix;
        ctx.fillStyle = '#10b981'; 
        ctx.beginPath();
        ctx.arc(ox + ix * scale, oy - iy * scale, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else if (Math.abs(D_quarter) < 0.1) {
      const ix = 0.5;
      const iy = 0.25;
      ctx.fillStyle = '#eab308'; 
      ctx.beginPath();
      ctx.arc(ox + ix * scale, oy - iy * scale, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (!hasCompleted && onComplete) {
        setHasCompleted(true);
        onComplete();
      }
    }
    
  }, [k, hasCompleted, onComplete]);

  const D_quarter = 1 + 2 * k;
  const status = Math.abs(D_quarter) < 0.1 ? "接する (D = 0)" : D_quarter > 0 ? "2点で交わる (D > 0)" : "共有点なし (D < 0)";
  const statusColor = Math.abs(D_quarter) < 0.1 ? "text-yellow-600" : D_quarter > 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="font-mono text-sm">
            <span className="text-blue-600 font-bold">y = x²</span>
            <span className="mx-4">vs</span>
            <span className="text-red-600 font-bold">y = -x² + 2x {k >= 0 ? `+ ${k.toFixed(1)}` : `- ${Math.abs(k).toFixed(1)}`}</span>
          </div>
          <div className={`font-bold text-sm ${statusColor}`}>
            {status}
          </div>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg shadow-inner"
        />
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm text-slate-500 font-bold">
            <span>k をスライドして接する瞬間を見つけよう</span>
            <span className="font-mono text-black">k = {k.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="-3" 
            max="2" 
            step="0.1" 
            value={k} 
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4 text-sm font-mono flex flex-col gap-2">
            <div>① 2つの式を連立: x² = -x² + 2x + k</div>
            <div>② 整理する: 2x² - 2x - k = 0</div>
            <div>③ 判別式 D/4 = (-1)² - 2(-k) = 1 + 2k</div>
            <div className="font-bold border-t border-blue-200 pt-2 mt-1 flex items-center gap-2">
              <span className="text-blue-600">D/4 = {D_quarter.toFixed(2)}</span>
              {Math.abs(D_quarter) < 0.1 && <span className="text-yellow-600 text-xs px-2 py-1 bg-yellow-100 rounded-full">TANGENT!</span>}
            </div>
          </div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "2つの放物線が接する条件は、連立方程式の判別式 D = 0 です。" },
        { step: 2, text: "f(x) = g(x) を整理すると2次方程式になり、D = 0 で接します。" },
        { step: 3, text: "k を動かして D = 0 になる瞬間を見つけましょう。それが接する条件です。" },
      ]} />
    </div>
    </div>
  );
}
