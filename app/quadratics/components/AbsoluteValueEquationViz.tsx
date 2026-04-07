'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
interface AbsoluteValueEquationVizProps {
  a: number; // Parameter for |x^2 - a^2|
  initialK?: number; // Initial value for y=k line
  mode?: 'count' | 'range'; // Mode of interaction
  correctKRange?: [number, number]; // For 'range' mode feedback
}

const AbsoluteValueEquationViz: React.FC<AbsoluteValueEquationVizProps> = ({ 
  a, 
  initialK = 2, 
  mode = 'count',
  correctKRange 
}) => {
  const [k, setK] = useState(initialK);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for drawing
  const scaleX = 40; // 40px per unit X
  const scaleY = 40; // 40px per unit Y
  const padding = 40;

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
    const originY = height - 50; // Place X-axis near bottom

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += scaleX) {
      ctx.beginPath();
      ctx.moveTo(x + (originX % scaleX), 0);
      ctx.lineTo(x + (originX % scaleX), height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = 0; y <= height; y += scaleY) {
      ctx.beginPath();
      ctx.moveTo(0, y + (originY % scaleY));
      ctx.lineTo(width, y + (originY % scaleY));
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw Function: y = |x^2 - a^2|
    ctx.strokeStyle = '#3b82f6'; // Blue-500
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const a2 = a * a;
    
    for (let px = 0; px <= width; px++) {
      const x = (px - originX) / scaleX;
      const y = Math.abs(x * x - a2);
      const py = originY - y * scaleY;
      
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw y=k Line
    const kY = originY - k * scaleY;
    
    ctx.strokeStyle = '#ef4444'; // Red-500
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, kY);
    ctx.lineTo(width, kY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Label for y=k
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`y = ${k.toFixed(1)}`, width - 80, kY - 10);

    // Calculate Intersections
    // |x^2 - a^2| = k
    // Case 1: x^2 - a^2 = k  => x^2 = a^2 + k => x = ±sqrt(a^2 + k)
    // Case 2: -(x^2 - a^2) = k => a^2 - x^2 = k => x^2 = a^2 - k => x = ±sqrt(a^2 - k) (only if a^2 - k >= 0)
    
    let intersections = [];
    
    if (k >= 0) {
      // Outer intersections (always exist if k >= -a^2, which is true for abs val)
      const x1 = Math.sqrt(a2 + k);
      intersections.push(x1);
      intersections.push(-x1);
      
      // Inner intersections (only if k <= a^2)
      if (k < a2 && k > 0) {
        const x2 = Math.sqrt(a2 - k);
        intersections.push(x2);
        intersections.push(-x2);
      } else if (k === a2) {
        intersections.push(0); // Peak
      }
    } else {
      // No intersections if k < 0
    }

    // Draw Intersection Points
    intersections.forEach(x => {
      const px = originX + x * scaleX;
      const py = originY - k * scaleY; // Use k directly for Y
      
      ctx.fillStyle = '#10b981'; // Emerald-500
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke(); // Outline
    });

    // Draw Solution Count Text on Canvas
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px sans-serif';
    ctx.fillText(`交点の数 (解の個数): ${intersections.length}`, 20, 30);

  }, [a, k]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="p-1 bg-blue-100 text-blue-600 rounded">視覚化</span>
          方程式 <MathDisplay tex={`|x^2 - ${a*a}| = k`} /> の解の個数
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          スライダーを動かして、定数 <MathDisplay tex="k" /> の値を変えてみよう。
          赤い直線 <MathDisplay tex="y=k" /> と青いグラフの交点の数がどう変化するか確認しよう。
        </p>
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="font-bold text-gray-700 min-w-[80px]">k = {k.toFixed(1)}</label>
          <input 
            type="range" 
            min="-2" 
            max={a*a + 3} 
            step="0.1" 
            value={k} 
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-sm text-gray-500 w-32 text-right">
             範囲: -2 〜 {(a*a + 3).toFixed(0)}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {mode === 'range' && correctKRange && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
          <strong>ヒント:</strong> 解が4個になるのは、直線が「山」の頂点より下、かつ $x$軸より上にあるときです。
        </div>
      )}
      <HintButton hints={[
        { step: 1, text: "|f(x)| = k を解くには、f(x) = k と f(x) = -k の2つの場合に分けます。" },
        { step: 2, text: "y = |x² - a²| のグラフで、W字の山の高さ a² より k が小さいか大きいかで解の個数が変わります。" },
        { step: 3, text: "k = 0 で2個、0 < k < a² で4個、k = a² で3個、k > a² で2個の解を持ちます。" },
      ]} />
    
    </div>
  );
};

export default AbsoluteValueEquationViz;
