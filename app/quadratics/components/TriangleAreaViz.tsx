'use client';

import React, { useState, useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface TriangleAreaVizProps {
  problem: any;
}

export default function TriangleAreaViz({ problem }: TriangleAreaVizProps) {
  const [t, setT] = useState<number>(0.5); // x-coord of P
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants for y = x^2, A(-1, 1), B(2, 4)
  const a = -1;
  const a_y = 1;
  const b = 2;
  const b_y = 4;
  
  const py = t * t;
  
  // Area = 0.5 * | xA(yB - yP) + xB(yP - yA) + xP(yA - yB) |
  const area = 0.5 * Math.abs(a * (b_y - py) + b * (py - a_y) + t * (a_y - b_y));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate system transform
    const scale = 40;
    const originX = width / 2;
    const originY = height - 50; // shift down so y=4 is visible

    const toX = (x: number) => originX + x * scale;
    const toY = (y: number) => originY - y * scale;

    // Draw grid & axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(toX(i), 0); ctx.lineTo(toX(i), height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, toY(i)); ctx.lineTo(width, toY(i)); ctx.stroke();
    }
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke(); // x
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke(); // y

    // Draw Parabola y = x^2
    ctx.strokeStyle = '#3b82f6'; // blue
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = -3; px <= 3; px += 0.05) {
      const py_val = px * px;
      if (px === -3) ctx.moveTo(toX(px), toY(py_val));
      else ctx.lineTo(toX(px), toY(py_val));
    }
    ctx.stroke();

    // Line AB
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(toX(a), toY(a_y));
    ctx.lineTo(toX(b), toY(b_y));
    ctx.stroke();
    ctx.setLineDash([]);

    // Triangle PAB
    ctx.fillStyle = 'rgba(168, 85, 247, 0.3)'; // purple transparent
    ctx.beginPath();
    ctx.moveTo(toX(a), toY(a_y));
    ctx.lineTo(toX(b), toY(b_y));
    ctx.lineTo(toX(t), toY(py));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tangent at P: y = 2tx - t^2
    const m = 2 * t;
    const k = -t * t;
    ctx.strokeStyle = '#ef4444'; // red
    ctx.lineWidth = 2;
    ctx.beginPath();
    // draw tangent line extending left and right
    ctx.moveTo(toX(-3), toY(m * -3 + k));
    ctx.lineTo(toX(3), toY(m * 3 + k));
    ctx.stroke();

    // Draw Points
    const drawPoint = (x: number, y: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(toX(x), toY(y), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(label, toX(x) + 10, toY(y) - 10);
    };

    drawPoint(a, a_y, '#111827', 'A(-1, 1)');
    drawPoint(b, b_y, '#111827', 'B(2, 4)');
    drawPoint(t, py, '#ef4444', `P(${t.toFixed(2)}, ${py.toFixed(2)})`);

  }, [t]);

  // Check if maximized (t = 0.5)
  const isMaximized = Math.abs(t - 0.5) < 0.01;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">放物線上の三角形の面積最大化</h3>
        <p className="text-sm text-slate-600 mb-4">
          放物線 <InlineMath math="y = x^2" /> 上の2点 <InlineMath math="A(-1, 1)" /> と <InlineMath math="B(2, 4)" /> の間を動く点 <InlineMath math="P(t, t^2)" /> があります。
          <InlineMath math="\triangle PAB" /> の面積が最大になるのは、点 <InlineMath math="P" /> での接線が直線 <InlineMath math="AB" /> と平行になるときです。
        </p>

        <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex justify-center">
          <canvas ref={canvasRef} width={500} height={400} className="w-full max-w-[500px]" />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-700">点 P の x座標 (<InlineMath math="t" />)</span>
              <span className="text-sm font-bold text-blue-600">{t.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-1" 
              max="2" 
              step="0.05" 
              value={t} 
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>-1 (A)</span>
              <span>2 (B)</span>
            </div>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-lg border-2 transition-all ${isMaximized ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-200'}`}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500 mb-1">現在の面積 S</div>
              <div className="text-xl font-bold text-slate-800">
                {area.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">接線の傾き (y&apos;=2t)</div>
              <div className={`text-xl font-bold ${isMaximized ? 'text-purple-600' : 'text-slate-800'}`}>
                {(2 * t).toFixed(2)}
              </div>
            </div>
          </div>
          {isMaximized && (
            <div className="mt-3 text-center text-sm font-bold text-purple-600 bg-white p-2 rounded shadow-sm">
              ✨ 面積が最大です！接線の傾きと直線ABの傾き(1)が一致しています。
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
