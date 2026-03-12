"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, AlertCircle } from 'lucide-react';

export default function FenceEnclosureViz() {
  const [x, setX] = useState<number>(3); // initial x
  const L = 20; // total fence length

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  // Math calculations
  const y = L - 2 * x;
  const area = x * y;
  
  // Parabola data
  const vertexX = L / 4;
  const vertexY = (L * L) / 8;

  // Draw enclosure
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Draw wall (top)
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.fillRect(0, 0, w, 20);

    // Wall texture lines
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 10, 20);
      ctx.stroke();
    }

    // Scale mapping for drawing
    // max x is 10, max y is 20. 
    // Let's reserve padding
    const scale = Math.min((w - 40) / L, (h - 60) / (L / 2));
    
    // Center the enclosure horizontally
    // Physical dimensions: width is y (parallel to wall), depth is x (perpendicular)
    const pxW = y * scale;
    const pxH = x * scale;
    
    const startX = (w - pxW) / 2;
    const startY = 20; // from the wall

    // Draw fence
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]); // fence look
    
    // Left side (length x)
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + pxH);
    
    // Bottom side (length y)
    ctx.lineTo(startX + pxW, startY + pxH);
    
    // Right side (length x)
    ctx.lineTo(startX + pxW, startY);
    
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(startX, startY, pxW, pxH);

    // Labels
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    
    // x label (left)
    ctx.fillText(`x = ${x.toFixed(1)} m`, startX - 35, startY + pxH / 2 + 5);
    // x label (right)
    ctx.fillText(`x = ${x.toFixed(1)} m`, startX + pxW + 35, startY + pxH / 2 + 5);
    // y label (bottom)
    ctx.fillText(`20 - 2x = ${y.toFixed(1)} m`, startX + pxW / 2, startY + pxH + 20);

    // Area label in the middle
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(`面積 = ${area.toFixed(1)} m²`, startX + pxW / 2, startY + pxH / 2 + 5);

  }, [x, y, area]);

  // Draw Parabola graph
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padding = 30;

    // Draw Axes
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    // x-axis
    const xAxisY = h - padding;
    ctx.moveTo(padding, xAxisY);
    ctx.lineTo(w - padding, xAxisY);
    // y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.stroke();

    // Map math coords to px coords
    const domainMax = 10;
    const rangeMax = 60; // slightly above max area 50

    const toPxX = (val: number) => padding + (val / domainMax) * (w - 2 * padding);
    const toPxY = (val: number) => xAxisY - (val / rangeMax) * (h - 2 * padding);

    // Draw Parabola
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    for (let t = 0; t <= domainMax; t += 0.1) {
      const px = toPxX(t);
      const py = toPxY(-2 * t * t + 20 * t);
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw vertex marker
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([4, 4]);
    ctx.moveTo(toPxX(vertexX), xAxisY);
    ctx.lineTo(toPxX(vertexX), toPxY(vertexY));
    ctx.lineTo(padding, toPxY(vertexY));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('5', toPxX(vertexX), xAxisY + 15);
    ctx.fillText('50', padding - 20, toPxY(vertexY) + 5);

    // Draw current point
    const currentPx = toPxX(x);
    const currentPy = toPxY(area);
    
    ctx.beginPath();
    ctx.fillStyle = '#ef4444';
    ctx.arc(currentPx, currentPy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Highlight line to point
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.moveTo(currentPx, xAxisY);
    ctx.lineTo(currentPx, currentPy);
    ctx.lineTo(padding, currentPy);
    ctx.stroke();

  }, [x, area]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6 text-blue-800">
        <Maximize2 size={24} />
        <h3 className="text-lg font-bold">壁を利用した長方形の面積の最大化</h3>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
        <p className="text-sm text-slate-700 leading-relaxed mb-2">
          長さ <strong>20m</strong> の金網を使って、一方を壁とした長方形の囲いを作ります。<br/>
          壁と垂直な辺の長さを <span className="font-semibold text-blue-600">x m</span> としたとき、面積 <span className="font-semibold text-emerald-600">S</span> が最大になる x を探してみましょう。
        </p>
        <div className="text-sm text-slate-600 font-mono bg-white p-2 rounded inline-block border border-slate-200">
          金網の総延長: x + (20 - 2x) + x = 20 m<br/>
          面積 S = x(20 - 2x) = -2x² + 20x
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enclosure Visualization */}
        <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg p-4 relative">
          <h4 className="text-sm font-bold text-slate-600 mb-2">上から見た図 (囲い)</h4>
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={300} 
            className="w-full h-auto bg-slate-50/50 rounded"
          />
        </div>

        {/* Graph Visualization */}
        <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg p-4 relative">
          <h4 className="text-sm font-bold text-slate-600 mb-2">面積の変化 S(x)</h4>
          <canvas 
            ref={graphRef} 
            width={400} 
            height={300} 
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-700">
            壁と垂直な辺の長さ <span className="text-blue-600">x</span>
          </label>
          <span className="font-mono font-bold text-lg text-blue-700">{x.toFixed(1)} m</span>
        </div>
        
        <input
          type="range"
          min="0.1"
          max="9.9"
          step="0.1"
          value={x}
          onChange={(e) => setX(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
          <span>0 (壁にくっつく)</span>
          <span>5 (最大)</span>
          <span>10 (壁から10m伸びるだけ)</span>
        </div>

        <motion.div 
          className="mt-6 p-4 bg-white rounded-lg border border-slate-200 text-sm text-slate-700"
          animate={{ borderColor: Math.abs(x - 5) < 0.1 ? '#10b981' : '#e2e8f0' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold">現在の面積:</span>
              <span className="ml-2 font-mono text-lg">{area.toFixed(2)} m²</span>
            </div>
            {Math.abs(x - 5) < 0.1 && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
                <Maximize2 size={14} /> 最大値 (頂点)
              </span>
            )}
          </div>
          
          <div className="mt-3 text-xs text-slate-500 flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p>
              x を大きくしすぎると、壁と平行な辺 (20 - 2x) が短くなりすぎて面積は小さくなります。
              逆に x を小さくしすぎても面積は稼げません。二次関数 -2x² + 20x の頂点 (x=5) がベストなバランスになります。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
