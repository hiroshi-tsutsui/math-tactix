'use client';

import React, { useRef, useEffect } from 'react';

interface MaxMinVizProps {
  a: number; // 1 or -1
  p: number; // vertex x
  q: number; // vertex y
  domain: [number, number];
  target: 'max' | 'min';
}

const MaxMinViz: React.FC<MaxMinVizProps> = ({ a, p, q, domain, target }) => {
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
    const centerY = height / 2 + 50; // shift down slightly for more top space

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
    for (let y = -10; y <= 15; y++) {
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
    const dStartPx = centerX + domain[0] * scale;
    const dEndPx = centerX + domain[1] * scale;
    
    ctx.fillStyle = 'rgba(34, 197, 94, 0.08)'; // Green-500/8
    ctx.fillRect(dStartPx, 0, dEndPx - dStartPx, height);
    
    ctx.strokeStyle = '#22c55e'; // Green-500
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(dStartPx, 0); ctx.lineTo(dStartPx, height);
    ctx.moveTo(dEndPx, 0); ctx.lineTo(dEndPx, height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw Axis of Symmetry
    const axisPx = centerX + p * scale;
    ctx.strokeStyle = '#9ca3af'; // Gray-400
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(axisPx, 0); ctx.lineTo(axisPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Full Parabola (Faint)
    ctx.strokeStyle = '#bfdbfe'; // Blue-200
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px+=2) {
      const x = (px - centerX) / scale;
      const y = a * Math.pow(x - p, 2) + q;
      const py = centerY - y * scale;
      
      if (py >= -100 && py <= height + 100) {
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Active Parabola Range (Solid)
    ctx.strokeStyle = '#3b82f6'; // Blue-500
    ctx.lineWidth = 4;
    ctx.beginPath();
    let started = false;
    for (let px = dStartPx; px <= dEndPx; px+=1) {
      const x = (px - centerX) / scale;
      const y = a * Math.pow(x - p, 2) + q;
      const py = centerY - y * scale;
      
      if (py >= -100 && py <= height + 100) {
        if (!started) {
             ctx.moveTo(px, py);
             started = true;
        } else {
             ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Calculate Values
    const f = (x: number) => a * Math.pow(x - p, 2) + q;
    const yStart = f(domain[0]);
    const yEnd = f(domain[1]);
    const isVertexInDomain = (p >= domain[0] && p <= domain[1]);
    
    // Find Target Point
    let targetX = 0;
    let targetY = 0;
    
    if (target === 'max') {
        if (a < 0) { // Opens Down: Max is vertex if in domain, else higher boundary
            targetX = isVertexInDomain ? p : (yStart > yEnd ? domain[0] : domain[1]);
        } else { // Opens Up: Max is higher boundary
            targetX = yStart > yEnd ? domain[0] : domain[1];
        }
    } else { // min
        if (a > 0) { // Opens Up: Min is vertex if in domain, else lower boundary
            targetX = isVertexInDomain ? p : (yStart < yEnd ? domain[0] : domain[1]);
        } else { // Opens Down: Min is lower boundary
            targetX = yStart < yEnd ? domain[0] : domain[1];
        }
    }
    targetY = f(targetX);

    // Draw Target Point
    const tPx = centerX + targetX * scale;
    const tPy = centerY - targetY * scale;

    // Draw horizontal dashed line to Y-axis
    ctx.strokeStyle = target === 'max' ? '#f59e0b' : '#ef4444';
    ctx.setLineDash([2, 2]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, tPy);
    ctx.lineTo(tPx, tPy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Point Marker
    ctx.fillStyle = target === 'max' ? '#f59e0b' : '#ef4444'; // Amber for Max, Red for Min
    ctx.beginPath();
    ctx.arc(tPx, tPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Value on Y-axis
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(targetY.toString(), centerX - 25, tPy + 4);

    // Label the point
    ctx.fillStyle = target === 'max' ? '#b45309' : '#b91c1c'; // Dark Amber or Dark Red
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${target === 'max' ? '最大値' : '最小値'} (${targetX}, ${targetY})`, tPx + 10, tPy - 10);

  }, [a, p, q, domain, target]);

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl border shadow-sm w-full max-w-[600px] mt-4">
      <h3 className="text-md font-bold text-gray-700">グラフと定義域の確認</h3>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={350} 
        className="border border-gray-200 rounded bg-white w-full shadow-inner"
      />
      <div className="text-sm text-gray-600 flex gap-4">
         <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span>定義域内のグラフ</span>
         <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 border border-green-500 inline-block"></span>定義域 ({domain[0]} ≦ x ≦ {domain[1]})</span>
      </div>
    </div>
  );
};

export default MaxMinViz;
