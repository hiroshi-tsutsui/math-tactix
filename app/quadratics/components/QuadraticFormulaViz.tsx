import React, { useState, useEffect, useRef } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
export default function QuadraticFormulaViz() {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const D = b * b - 4 * a * c;
  const axis = -b / (2 * a);
  const distance = D >= 0 ? Math.sqrt(D) / Math.abs(2 * a) : 0;
  
  const root1 = axis - distance;
  const root2 = axis + distance;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const scale = 30;
    const originX = width / 2;
    const originY = height / 2 + 50;

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();

    // Graph
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - originX) / scale;
      const y = a * x * x + b * x + c;
      const py = originY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Axis of Symmetry
    const pxAxis = originX + axis * scale;
    ctx.strokeStyle = '#f59e0b'; // Amber
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pxAxis, 0);
    ctx.lineTo(pxAxis, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance to roots
    if (D >= 0) {
      const py0 = originY;
      
      // Root 1
      const pxRoot1 = originX + root1 * scale;
      ctx.fillStyle = '#ef4444'; // Red
      ctx.beginPath(); ctx.arc(pxRoot1, py0, 5, 0, Math.PI * 2); ctx.fill();

      // Root 2
      const pxRoot2 = originX + root2 * scale;
      ctx.beginPath(); ctx.arc(pxRoot2, py0, 5, 0, Math.PI * 2); ctx.fill();

      // Horizontal lines showing distance
      ctx.strokeStyle = '#22c55e'; // Green
      ctx.lineWidth = 2;
      
      // Right distance
      ctx.beginPath();
      ctx.moveTo(pxAxis, py0 - 15);
      ctx.lineTo(pxRoot2, py0 - 15);
      ctx.stroke();
      
      // Left distance
      ctx.beginPath();
      ctx.moveTo(pxAxis, py0 - 15);
      ctx.lineTo(pxRoot1, py0 - 15);
      ctx.stroke();
      
      // Ticks
      ctx.beginPath(); ctx.moveTo(pxAxis, py0 - 20); ctx.lineTo(pxAxis, py0 - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pxRoot1, py0 - 20); ctx.lineTo(pxRoot1, py0 - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pxRoot2, py0 - 20); ctx.lineTo(pxRoot2, py0 - 10); ctx.stroke();
      
      // Text
      ctx.fillStyle = '#22c55e';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+d', (pxAxis + pxRoot2) / 2, py0 - 25);
      ctx.fillText('-d', (pxAxis + pxRoot1) / 2, py0 - 25);
    }
  }, [a, b, c, axis, D, root1, root2]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl shadow-inner border border-slate-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">a = {a} (開き具合)</label>
            <input type="range" min="-3" max="3" step="1" value={a} onChange={(e) => setA(e.target.value === '0' ? 1 : Number(e.target.value))} className="w-full" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">b = {b} (1次の係数)</label>
            <input type="range" min="-10" max="10" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">c = {c} (y切片)</label>
            <input type="range" min="-10" max="10" step="1" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 text-center border-b pb-2">解の公式の幾何学的意味</h3>
          <MathDisplay tex={`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`} displayMode />
          <div className="text-center mt-4 space-y-3">
            <div className="bg-amber-50 p-2 rounded text-sm text-amber-800 border border-amber-100">
              <span className="font-bold">軸 (中心):</span> <MathDisplay tex={`x = \\frac{-(${b})}{2(${a})} = ${axis}`} />
            </div>
            <div className="bg-green-50 p-2 rounded text-sm text-green-800 border border-green-100">
              <span className="font-bold">距離 (±の幅):</span> 
              {D >= 0 ? (
                <>
                  <MathDisplay tex={`d = \\frac{\\sqrt{${D}}}{${Math.abs(2*a)}} \\approx ${distance.toFixed(2)}`} />
                </>
              ) : (
                <span className="text-red-500 font-medium ml-1">判別式 D &lt; 0 のため実数解なし</span>
              )}
            </div>
            <p className="text-xs mt-4 text-slate-500 text-left px-2 leading-relaxed">
              解の公式は単なる暗記ではなく、「対称軸」からの「左右への距離」を表しています。グラフ上の点と数式の関係を確認してみましょう。
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-xl border border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}
