'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AbsoluteValueGraphVizProps {
  initialA?: number; // Parameter for y = |x^2 - a^2|
}

const AbsoluteValueGraphViz: React.FC<AbsoluteValueGraphVizProps> = ({ initialA = 2 }) => {
  const [a, setA] = useState(initialA);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Coordinate system: Center (width/2, height/2)
    // Scale: 40px per unit
    const scale = 40;
    const offsetX = width / 2;
    const offsetY = height / 2 + 100; // Shift origin down to show more positive Y

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(0, offsetY);
    ctx.lineTo(width, offsetY);
    // Y-axis
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, height);
    ctx.stroke();

    // Draw Graph: y = |x^2 - a^2|
    // Original function: y = x^2 - a^2 (dashed gray)
    ctx.strokeStyle = '#9ca3af';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - offsetX) / scale;
      const y = x * x - a * a;
      const py = offsetY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Absolute Value function: y = |x^2 - a^2| (solid blue)
    ctx.strokeStyle = '#2563eb';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - offsetX) / scale;
      const y = Math.abs(x * x - a * a);
      const py = offsetY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Key Points
    // Roots: (-a, 0), (a, 0)
    const points = [
      { x: -a, y: 0, label: `-${a.toFixed(1)}` },
      { x: a, y: 0, label: `${a.toFixed(1)}` },
      { x: 0, y: a * a, label: `${(a*a).toFixed(1)}` } // Max of the "hump"
    ];

    points.forEach(p => {
      const px = offsetX + p.x * scale;
      const py = offsetY - p.y * scale;
      
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1f2937';
      ctx.font = '14px sans-serif';
      ctx.fillText(p.label, px + 8, py - 8);
    });

    // Label: y = |x^2 - a^2|
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`y = |x² - ${a.toFixed(1)}²|`, 20, 30);
  };

  useEffect(() => {
    draw();
  }, [a]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">絶対値グラフの視覚化</h3>
        <p className="text-sm text-gray-600 mb-4">
          {'y = |x^2 - a^2| のグラフ。'}<br/>
          {'x^2 - a^2 < 0 (x軸より下) の部分が'} <span className="text-blue-600 font-bold">折り返される</span> 様子を確認しよう。
        </p>
        
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded">
          <label className="font-bold text-gray-700 min-w-[60px]">a = {a.toFixed(1)}</label>
          <input 
            type="range" 
            min="0" max="4" step="0.1" 
            value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full border rounded bg-white"
      />
    </div>
  );
};

export default AbsoluteValueGraphViz;
