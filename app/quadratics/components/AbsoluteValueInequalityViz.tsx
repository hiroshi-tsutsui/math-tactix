import React, { useState, useRef, useEffect } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
interface AbsoluteValueInequalityVizProps {
  a: number;
  initialM: number;
  initialN: number;
}

export default function AbsoluteValueInequalityViz({ a, initialM, initialN }: AbsoluteValueInequalityVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [m, setM] = useState(initialM);
  const [n, setN] = useState(initialN);
  
  const a2 = a * a;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Coordinate system
    const scale = 30; // pixels per unit
    const ox = w / 2;
    const oy = h - 60; // origin near bottom

    // Draw axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, oy); ctx.lineTo(w, oy); // x-axis
    ctx.moveTo(ox, 0); ctx.lineTo(ox, h); // y-axis
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#f1f5f9';
    for(let i=1; i<20; i++) {
        ctx.beginPath(); ctx.moveTo(0, oy - i*scale); ctx.lineTo(w, oy - i*scale); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox + i*scale, 0); ctx.lineTo(ox + i*scale, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - i*scale, 0); ctx.lineTo(ox - i*scale, h); ctx.stroke();
    }

    // Graph function
    const drawGraph = () => {
      // 1. Draw absolute value graph y = |x^2 - a^2|
      ctx.strokeStyle = '#3b82f6'; // Blue
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px < w; px++) {
        const x = (px - ox) / scale;
        const y = Math.abs(x * x - a2);
        const py = oy - y * scale;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 2. Draw line y = mx + n
      ctx.strokeStyle = '#f59e0b'; // Orange
      ctx.lineWidth = 2;
      ctx.beginPath();
      const xLeft = -ox / scale;
      const xRight = w / scale;
      ctx.moveTo(0, oy - (m * xLeft + n) * scale);
      ctx.lineTo(w, oy - (m * xRight + n) * scale);
      ctx.stroke();

      // 3. Highlight intersection region (abs graph < line)
      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)'; // Purple
      ctx.beginPath();
      for (let px = 0; px < w; px++) {
        const x = (px - ox) / scale;
        const absY = Math.abs(x * x - a2);
        const lineY = m * x + n;
        
        if (absY < lineY) {
          // Fill region between line and graph
          const pyAbs = oy - absY * scale;
          const pyLine = oy - lineY * scale;
          ctx.fillRect(px, pyLine, 1, pyAbs - pyLine);
          
          // Project onto x-axis
          ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.fillRect(px, oy - 2, 1, 4);
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        }
      }
    };

    drawGraph();
  }, [a, m, n]);

  return (
    <div className="flex flex-col items-center w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-4">
      <h3 className="text-lg font-bold text-slate-800 mb-2">絶対値関数のグラフと直線</h3>
      
      <div className="relative w-full max-w-lg aspect-[4/3] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={450} 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full max-w-md mt-6 space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">直線の傾き <MathDisplay tex="m" /> : {m}</label>
          <input 
            type="range" min="-5" max="5" step="0.5" 
            value={m} onChange={(e) => setM(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">y切片 <MathDisplay tex="n" /> : {n}</label>
          <input 
            type="range" min="-10" max="15" step="1" 
            value={n} onChange={(e) => setN(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-purple-50 rounded-lg text-purple-800 text-sm w-full leading-relaxed">
        <strong>視覚的意味:</strong><br/>
        青いグラフ <MathDisplay tex={`y = |x^2 - ${a2}|`} /> が、オレンジの直線 <MathDisplay tex={`y = ${m}x + ${n}`} /> より「下」にある <MathDisplay tex="x" /> の範囲（紫の帯）が解です。<br/>
        交点は、2つの2次方程式 <MathDisplay tex={`x^2 - ${a2} = ${m}x + ${n}`} /> または <MathDisplay tex={`-(x^2 - ${a2}) = ${m}x + ${n}`} /> を解いて求めます。
      
      <HintButton hints={[
        { step: 1, text: "|x² - a²| < mx + n を解くには、グラフ的に絶対値グラフが直線より下にある範囲を見つけます。" },
        { step: 2, text: "場合分け: x² - a² = mx + n と -(x² - a²) = mx + n の2つの2次方程式を解きます。" },
        { step: 3, text: "紫の帯で示された範囲が不等式の解です。交点を正確に求めて解の範囲を決定します。" },
      ]} />
    </div>
    </div>
  );
}
