'use client';

import React, { useRef, useEffect, useState } from 'react';
import HintButton from '../../components/HintButton';

interface MovingAxisVizProps {
  domain: { start: number; end: number };
  q: number; // constant for vertical shift
  initialMode?: 'min' | 'max';
}

const MovingAxisViz: React.FC<MovingAxisVizProps> = ({ domain, q = 3, initialMode = 'min' }) => {
  const [a, setA] = useState(0); // Axis position
  const [mode, setMode] = useState<'min' | 'max'>(initialMode); // Visualization Mode
  
  // Update mode when initialMode changes (e.g. new problem)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;
    const scale = 30; // 1 unit = 30px
    const centerX = width / 2;
    const centerY = height - 50; // Use bottom as base, but leave margin

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -10; x <= 10; x++) {
      ctx.moveTo(centerX + x * scale, 0);
      ctx.lineTo(centerX + x * scale, height);
    }
    for (let y = 0; y <= 15; y++) {
      ctx.moveTo(0, centerY - y * scale);
      ctx.lineTo(width, centerY - y * scale);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y
    ctx.stroke();

    // Draw Domain (Shaded Area)
    const dStartPx = centerX + domain.start * scale;
    const dEndPx = centerX + domain.end * scale;
    
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'; // Green-500/10
    ctx.fillRect(dStartPx, 0, dEndPx - dStartPx, height);
    
    ctx.strokeStyle = '#22c55e'; // Green-500
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dStartPx, 0); ctx.lineTo(dStartPx, height);
    ctx.moveTo(dEndPx, 0); ctx.lineTo(dEndPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Parabola: y = (x-a)^2 + q
    // Vertex is (a, q)
    ctx.strokeStyle = '#3b82f6'; // Blue-500
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px+=2) {
      const x = (px - centerX) / scale;
      const y = Math.pow(x - a, 2) + q;
      const py = centerY - y * scale;
      
      if (py >= -100 && py <= height + 100) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Highlight Active Range (Part of parabola within domain)
    ctx.strokeStyle = mode === 'min' ? '#ef4444' : '#f59e0b'; // Red or Amber
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Only draw within domain range
    for (let px = dStartPx; px <= dEndPx; px+=2) {
      const x = (px - centerX) / scale;
      const y = Math.pow(x - a, 2) + q;
      const py = centerY - y * scale;
      
      if (py >= -100 && py <= height + 100) {
        if (px === dStartPx) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Axis (Red dashed)
    const axisPx = centerX + a * scale;
    ctx.strokeStyle = '#ef4444'; // Red-500
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(axisPx, 0); ctx.lineTo(axisPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Logic for Points
    let targetX = 0;
    let targetLabel = "";
    
    const mid = (domain.start + domain.end) / 2;

    if (mode === 'min') {
      // Minimum Logic
      if (a < domain.start) {
        targetX = domain.start;
        targetLabel = "Min (Start)";
      } else if (a > domain.end) {
        targetX = domain.end;
        targetLabel = "Min (End)";
      } else {
        targetX = a;
        targetLabel = "Min (Vertex)";
      }
    } else {
      // Maximum Logic
      if (a < mid) {
        targetX = domain.end;
        targetLabel = "Max (End)";
      } else if (a > mid) {
        targetX = domain.start;
        targetLabel = "Max (Start)";
      } else {
        // a == mid
        targetX = domain.start; // Default to start for label, draw both below
        targetLabel = "Max";
      }
    }

    // Draw Target Point(s) and Value Lines
    const drawPoint = (tx: number, label: string) => {
        const ty = Math.pow(tx - a, 2) + q;
        const tPx = centerX + tx * scale;
        const tPy = centerY - ty * scale;

        // Draw horizontal line to Y-axis
        ctx.strokeStyle = mode === 'min' ? '#ef4444' : '#f59e0b';
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, tPy);
        ctx.lineTo(tPx, tPy);
        ctx.stroke();

        // Draw Point
        ctx.fillStyle = mode === 'min' ? '#ef4444' : '#f59e0b'; // Red for Min, Amber for Max
        ctx.beginPath();
        ctx.arc(tPx, tPy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw Label
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = mode === 'min' ? '#ef4444' : '#f59e0b';
        ctx.fillText(label, tPx + 10, tPy - 10);
        
        // Draw Value on Y-axis
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.fillText(ty.toFixed(1), centerX - 25, tPy + 4);
    };

    if (mode === 'max' && Math.abs(a - mid) < 0.05) {
       // Close to midpoint -> Show both
       drawPoint(domain.start, "Max");
       drawPoint(domain.end, "Max");
    } else {
       drawPoint(targetX, targetLabel);
    }
    
    // Draw Midpoint for Max mode visualization aid
    if (mode === 'max') {
       const midPx = centerX + mid * scale;
       ctx.strokeStyle = '#9ca3af'; // Gray-400
       ctx.setLineDash([2, 2]);
       ctx.lineWidth = 1;
       ctx.beginPath();
       ctx.moveTo(midPx, 0); ctx.lineTo(midPx, height);
       ctx.stroke();
       ctx.font = '12px sans-serif';
       ctx.fillStyle = '#9ca3af';
       ctx.fillText("Mid", midPx + 5, 20);
    }

  }, [domain, q, a, mode]);

  // Determine case for text
  let caseText = "";
  const mid = (domain.start + domain.end) / 2;
  
  if (mode === 'min') {
    if (a < domain.start) caseText = `軸 < ${domain.start}: 単調増加 → 左端(x=${domain.start})で最小`;
    else if (a > domain.end) caseText = `軸 > ${domain.end}: 単調減少 → 右端(x=${domain.end})で最小`;
    else caseText = `${domain.start} ≦ 軸 ≦ ${domain.end}: 頂点が含まれる → 頂点(x=${a.toFixed(1)})で最小`;
  } else {
    if (a < mid) caseText = `軸 < 中央(${mid}): 軸が左寄り → 遠い右端(x=${domain.end})で最大`;
    else if (a > mid) caseText = `軸 > 中央(${mid}): 軸が右寄り → 遠い左端(x=${domain.start})で最大`;
    else caseText = `軸 = 中央(${mid}): 左右対称 → 両端で最大`;
  }

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl border shadow-sm w-full max-w-[600px]">
      <div className="flex justify-between w-full items-center mb-2">
        <h3 className="text-md font-bold text-gray-700">軸の移動シミュレーション (Level 4 Refined)</h3>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setMode('min')}
             className={`px-3 py-1 rounded text-sm font-bold transition-colors ${mode === 'min' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
             最小値
           </button>
           <button 
             onClick={() => setMode('max')}
             className={`px-3 py-1 rounded text-sm font-bold transition-colors ${mode === 'max' ? 'bg-white shadow text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
             最大値
           </button>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={350} 
        className="border border-gray-200 rounded bg-white w-full"
      />
      
      <div className={`w-full p-4 rounded-lg text-center transition-colors ${mode === 'min' ? 'bg-red-50' : 'bg-amber-50'}`}>
        <label className={`block text-sm font-bold mb-2 ${mode === 'min' ? 'text-red-800' : 'text-amber-800'}`}>
          軸の位置 (a = {a.toFixed(1)})
        </label>
        <input 
          type="range" 
          min="-2" 
          max="4" 
          step="0.1" 
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${mode === 'min' ? 'bg-red-200 accent-red-600' : 'bg-amber-200 accent-amber-600'}`}
        />
        <p className={`mt-2 text-sm font-bold ${mode === 'min' ? 'text-red-700' : 'text-amber-700'}`}>
          {caseText}
        </p>
      
      <HintButton hints={[
        { step: 1, text: "軸（パラメータ）が動くと、定義域に対する頂点の位置が変わり、最大値・最小値が変化します。" },
        { step: 2, text: "場合分け: 軸が定義域の左、中、右にある3つの場合を考えます。" },
        { step: 3, text: "各場合で最大値（または最小値）がどの点で達成されるか確認しましょう。" },
      ]} />
    </div>
    </div>
  );
};

export default MovingAxisViz;
