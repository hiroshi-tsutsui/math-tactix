'use client';

import React, { useState, useEffect, useRef } from 'react';

const DiscriminantViz = () => {
  const [c, setC] = useState(0); // y-intercept
  const [discriminant, setDiscriminant] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parabola: y = x^2 - 4x + c
  // a=1, b=-4
  // D = (-4)^2 - 4(1)(c) = 16 - 4c

  useEffect(() => {
    setDiscriminant(16 - 4 * c);
  }, [c]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Scale: 40px = 1 unit
    const scale = 40;
    const offsetX = width / 2;     // Center X
    const offsetY = height / 2 + 50;  // Shift origin down slightly

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, offsetY); ctx.lineTo(width, offsetY); // X-axis
    ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, height); // Y-axis
    ctx.stroke();

    // Draw Parabola y = x^2 - 4x + c
    ctx.strokeStyle = '#2563eb'; // Blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const x = (px - offsetX) / scale;
      const y = x * x - 4 * x + c;
      const py = offsetY - y * scale;
      
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Intersections with X-axis (y = 0)
    const D = 16 - 4 * c;
    if (D >= 0) {
      const sqrtD = Math.sqrt(D);
      const x1 = (4 - sqrtD) / 2;
      const x2 = (4 + sqrtD) / 2;
      
      const pts = D === 0 ? [x1] : [x1, x2];

      pts.forEach(ptX => {
        const px = offsetX + ptX * scale;
        const py = offsetY;
        
        ctx.fillStyle = '#dc2626'; // Red dot
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

  }, [c]);

  const intersectionCount = discriminant > 0 ? 2 : (discriminant === 0 ? 1 : 0);
  const statusColor = 
    intersectionCount === 2 ? 'text-green-600' : 
    intersectionCount === 1 ? 'text-yellow-600' : 'text-red-600';
    
  const statusText = 
    intersectionCount === 2 ? 'x軸との共有点: 2個 (D > 0)' :
    intersectionCount === 1 ? 'x軸との共有点: 1個 (接する) (D = 0)' : 'x軸との共有点: 0個 (D < 0)';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-bold text-lg mb-2 text-gray-800">判別式とグラフの共有点 (Discriminant)</h3>
      
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="font-mono text-sm sm:text-lg">
             <div><span className="text-blue-600">y = x² - 4x {c >= 0 ? '+' : ''} {c.toFixed(1)}</span></div>
          </div>
          <div className={`font-bold text-sm sm:text-xl ${statusColor}`}>
            {statusText}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>定数項 c: {c.toFixed(1)}</span>
            <span>判別式 D = (-4)² - 4(1)({c.toFixed(1)}) = {discriminant.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={c}
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>c = 0 (D = 16)</span>
            <span>c = 4 (D = 0)</span>
            <span>c = 8 (D = -16)</span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center border rounded bg-white">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          className="max-w-full h-auto"
        />
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 text-sm text-blue-800 rounded">
        <p className="font-bold mb-1">判別式 D = b² - 4ac の意味:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>D &gt; 0</strong>: x軸と 異なる2点 で交わる (実数解2つ)</li>
          <li><strong>D = 0</strong>: x軸と 1点 で接する (重解)</li>
          <li><strong>D &lt; 0</strong>: x軸と 交わらない (実数解なし)</li>
        </ul>
      </div>
    </div>
  );
}

export default DiscriminantViz;
