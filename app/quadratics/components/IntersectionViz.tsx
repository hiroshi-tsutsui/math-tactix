'use client';

import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

const IntersectionViz = () => {
  const [k, setK] = useState(0); // Line intercept parameter
  const [discriminant, setDiscriminant] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Line equation: y = 2x + k
  // Intersection: x^2 = 2x + k -> x^2 - 2x - k = 0
  // D/4 = 1 + k

  useEffect(() => {
    setDiscriminant(1 + k);
  }, [k]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Coordinate System
    // Scale: 40px = 1 unit
    const scale = 40;
    const offsetX = width / 2;     // Center X
    const offsetY = height - 100;  // Shift origin down

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    // Horizontal grid lines
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

    // Draw Parabola y = x^2
    ctx.strokeStyle = '#2563eb'; // Blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - offsetX) / scale;
      const y = x * x;
      const py = offsetY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Line y = 2x + k
    ctx.strokeStyle = '#f97316'; // Orange
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Calculate start and end points of line for visible range
    // x = (px - offsetX) / scale
    // py = offsetY - (2x + k) * scale
    const startX = (0 - offsetX) / scale;
    const startY = 2 * startX + k;
    const startPy = offsetY - startY * scale;

    const endX = (width - offsetX) / scale;
    const endY = 2 * endX + k;
    const endPy = offsetY - endY * scale;

    ctx.moveTo(0, startPy);
    ctx.lineTo(width, endPy);
    ctx.stroke();

    // Draw Intersections
    if (1 + k >= 0) {
      const sqrtD = Math.sqrt(1 + k);
      const x1 = 1 - sqrtD;
      const x2 = 1 + sqrtD;
      
      const pts = [
        { x: x1, y: x1 * x1 },
        { x: x2, y: x2 * x2 }
      ];
      
      // Filter out duplicate if tangent (D=0)
      const uniquePts = (1 + k === 0) ? [pts[0]] : pts;

      uniquePts.forEach(pt => {
        const px = offsetX + pt.x * scale;
        const py = offsetY - pt.y * scale;
        
        ctx.fillStyle = '#dc2626'; // Red dot
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

  }, [k]);

  // Status Text Logic
  const intersectionCount = discriminant > 0 ? 2 : (discriminant === 0 ? 1 : 0);
  const statusColor = 
    intersectionCount === 2 ? 'text-green-600' : 
    intersectionCount === 1 ? 'text-yellow-600' : 'text-red-600';
    
  const statusText = 
    intersectionCount === 2 ? '共有点: 2個 (異なる2点で交わる)' :
    intersectionCount === 1 ? '共有点: 1個 (接する)' : '共有点: 0個 (交わらない)';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-bold text-lg mb-2 text-gray-800">放物線と直線の共有点 (Intersection)</h3>
      
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="font-mono text-sm sm:text-lg">
             <div>Parabola: <span className="text-blue-600">y = x²</span></div>
             <div>Line: <span className="text-orange-600">y = 2x + {k.toFixed(1)}</span></div>
          </div>
          <div className={`font-bold text-sm sm:text-xl ${statusColor}`}>
            {statusText}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>定数 k: {k.toFixed(1)}</span>
            <span>判別式 D/4 = 1 + k = {discriminant.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>k = -5 (D &lt; 0)</span>
            <span>k = -1 (D = 0)</span>
            <span>k = 5 (D &gt; 0)</span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center border rounded bg-white">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="max-w-full h-auto"
        />
      </div>
      
      <HintButton hints={[
        { step: 1, text: "放物線と直線の共有点は、2つの方程式を連立して得られる2次方程式の実数解に対応します。" },
        { step: 2, text: "連立方程式の判別式 D の符号で共有点の数が決まります。D > 0 で2点、D = 0 で接する、D < 0 で共有点なしです。" },
        { step: 3, text: "接する条件 D = 0 から、パラメータ k の値を求めることができます。" },
      ]} />
      <div className="mt-4 p-3 bg-blue-50 text-sm text-blue-800 rounded">
        <p className="font-bold mb-1">ポイント:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>判別式 D &gt; 0 ⇔ グラフが2点で交わる (k &gt; -1)</li>
          <li>判別式 D = 0 ⇔ グラフが接する (k = -1)</li>
          <li>判別式 D &lt; 0 ⇔ グラフは交わらない (k &lt; -1)</li>
        </ul>
      </div>
    </div>
  );
}

export default IntersectionViz;
