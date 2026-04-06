'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
interface VizProps {
  onSuccess?: () => void;
}

export const IntersectionDistanceViz: React.FC<VizProps> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [m, setM] = useState<number>(1);
  const [n, setN] = useState<number>(2);
  const [distance, setDistance] = useState<number>(0);

  // Parabola: y = x^2
  // Line: y = mx + n

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Scale and origin
    const scale = 30; // 30 pixels per unit
    const originX = width / 2;
    const originY = height / 1.5;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();

    // Map functions
    const mapX = (x: number) => originX + x * scale;
    const mapY = (y: number) => originY - y * scale;

    // Draw Parabola: y = x^2
    ctx.strokeStyle = '#3b82f6'; // Blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px - originX) / scale;
      const y = x * x;
      const py = mapY(y);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Line: y = mx + n
    ctx.strokeStyle = '#10b981'; // Green
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, mapY(m * ((0 - originX) / scale) + n));
    ctx.lineTo(width, mapY(m * ((width - originX) / scale) + n));
    ctx.stroke();

    // Calculate Intersections: x^2 - mx - n = 0
    // D = m^2 - 4(1)(-n) = m^2 + 4n
    const D = m * m + 4 * n;
    
    if (D > 0) {
      const x1 = (m - Math.sqrt(D)) / 2;
      const x2 = (m + Math.sqrt(D)) / 2;
      const y1 = m * x1 + n;
      const y2 = m * x2 + n;

      // Draw Distance Line segment
      ctx.strokeStyle = '#ef4444'; // Red
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x2), mapY(y2));
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(mapX(x1), mapY(y1), 6, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(mapX(x2), mapY(y2), 6, 0, 2 * Math.PI); ctx.fill();

      // Calc real distance
      const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      setDistance(dist);
      
      if (dist >= 5 && onSuccess) onSuccess();

    } else {
      setDistance(0);
    }

  }, [m, n, onSuccess]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">放物線と直線の交点間の距離</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <MathDisplay tex={`y = x^2`} displayMode />
            <MathDisplay tex={`y = ${m}x ${n >= 0 ? '+' : ''} ${n}`} displayMode />
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-slate-700">傾き m: {m.toFixed(1)}</span>
              </div>
              <input
                type="range"
                value={m}
                min={-3}
                max={3}
                step={0.1}
                onChange={(e) => setM(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-slate-700">切片 n: {n.toFixed(1)}</span>
              </div>
              <input
                type="range"
                value={n}
                min={-4}
                max={8}
                step={0.1}
                onChange={(e) => setN(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">学習のポイント</h4>
            <p className="text-sm text-blue-800">
              交点の x 座標を α, β とすると、交点間の距離 $L$ は:
            </p>
            <MathDisplay tex={`L = (\\beta - \\alpha)\\sqrt{1 + m^2}`} displayMode />
            <MathDisplay tex={`= \\frac{\\sqrt{D}}{|a|} \\sqrt{1 + m^2}`} displayMode />
            {distance > 0 ? (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                <span className="font-bold text-red-600">現在の距離 L: {distance.toFixed(2)}</span>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <span className="text-gray-500 font-medium">共有点がありません</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner p-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-auto bg-slate-50"
          />
        </div>
      </div>
    </div>
  );
};
