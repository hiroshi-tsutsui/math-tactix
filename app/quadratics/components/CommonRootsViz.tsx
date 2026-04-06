'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
const CommonRootsViz: React.FC = () => {
  const [m, setM] = useState(-2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scaleX = 40;
  const scaleY = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = containerRef.current.clientWidth;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const originX = width / 2;
    const originY = height / 2 + 50; // Shift down slightly

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scaleX) {
      ctx.beginPath();
      ctx.moveTo(x + (originX % scaleX), 0);
      ctx.lineTo(x + (originX % scaleX), height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scaleY) {
      ctx.beginPath();
      ctx.moveTo(0, y + (originY % scaleY));
      ctx.lineTo(width, y + (originY % scaleY));
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Functions
    // f1(x) = x^2 + mx + 1 (Blue)
    // f2(x) = x^2 + x + m (Red)
    
    // Draw f1
    ctx.strokeStyle = '#3b82f6'; // Blue-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - originX) / scaleX;
      const y = x * x + m * x + 1;
      const py = originY - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw f2
    ctx.strokeStyle = '#ef4444'; // Red-500
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - originX) / scaleX;
      const y = x * x + x + m;
      const py = originY - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw roots on x-axis
    const drawRoot = (x: number, color: string, offset: number) => {
      const px = originX + x * scaleX;
      const py = originY;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.font = '12px sans-serif';
      ctx.fillText(x.toFixed(1), px - 10, py + offset);
    };

    // Roots of f1: x^2 + mx + 1 = 0 => D = m^2 - 4
    let f1Roots: number[] = [];
    if (m * m - 4 >= 0) {
      f1Roots.push((-m + Math.sqrt(m * m - 4)) / 2);
      f1Roots.push((-m - Math.sqrt(m * m - 4)) / 2);
    }

    // Roots of f2: x^2 + x + m = 0 => D = 1 - 4m
    let f2Roots: number[] = [];
    if (1 - 4 * m >= 0) {
      f2Roots.push((-1 + Math.sqrt(1 - 4 * m)) / 2);
      f2Roots.push((-1 - Math.sqrt(1 - 4 * m)) / 2);
    }

    // Check for common root
    let commonRoot = null;
    if (m === -2) {
      commonRoot = 1;
    }

    // Draw roots
    f1Roots.forEach(r => drawRoot(r, '#3b82f6', 20)); // Blue
    f2Roots.forEach(r => drawRoot(r, '#ef4444', 35)); // Red
    
    if (commonRoot !== null) {
      // Highlight common root
      const px = originX + commonRoot * scaleX;
      ctx.strokeStyle = '#10b981'; // Green
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, originY, 10, 0, Math.PI * 2);
      ctx.stroke();
      
      // Text indicator
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`共通解 x = ${commonRoot}`, 20, 30);
    } else {
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px sans-serif';
      ctx.fillText('共通解なし', 20, 30);
    }

    // Draw equations text
    ctx.fillStyle = '#3b82f6';
    ctx.font = '14px sans-serif';
    ctx.fillText(`y = x² ${m >= 0 ? '+' : '-'} ${Math.abs(m)}x + 1`, 20, 60);

    ctx.fillStyle = '#ef4444';
    ctx.fillText(`y = x² + x ${m >= 0 ? '+' : '-'} ${Math.abs(m)}`, 20, 80);

  }, [m]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="p-1 bg-blue-100 text-blue-600 rounded">視覚化</span>
          共通解問題のグラフ的意味
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          2つの2次方程式が「共通解」をもつということは、それぞれのグラフ（青と赤の放物線）が
          <strong className="text-gray-900 mx-1">x軸上の同じ点を通る</strong>
          ことを意味します。<br />
          スライダーを動かして、$m=-2$ のときにグラフがどうなるか確認しましょう。
        </p>
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="font-bold text-gray-700 min-w-[80px]">m = {m.toFixed(1)}</label>
          <input 
            type="range" 
            min="-5" 
            max="3" 
            step="0.1" 
            value={m} 
            onChange={(e) => setM(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default CommonRootsViz;