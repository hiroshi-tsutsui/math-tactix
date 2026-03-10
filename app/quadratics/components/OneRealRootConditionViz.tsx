"use client";

import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function OneRealRootConditionViz() {
  const [p, setP] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const width = 600;
  const height = 400;
  const padding = 40;
  const xMin = -5;
  const xMax = 5;
  const yMin = -5;
  const yMax = 5;

  const mapX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const mapY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  const d1 = p * p - 4;
  const d2 = 1 - 4 * p;

  const hasRealRoots1 = d1 >= 0;
  const hasRealRoots2 = d2 >= 0;

  const exactlyOne = (hasRealRoots1 && !hasRealRoots2) || (!hasRealRoots1 && hasRealRoots2);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
      ctx.beginPath();
      ctx.moveTo(mapX(i), padding);
      ctx.lineTo(mapX(i), height - padding);
      ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
      ctx.beginPath();
      ctx.moveTo(padding, mapY(i));
      ctx.lineTo(width - padding, mapY(i));
      ctx.stroke();
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mapX(xMin), mapY(0));
    ctx.lineTo(mapX(xMax), mapY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(yMin));
    ctx.lineTo(mapX(0), mapY(yMax));
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('x', mapX(xMax) + 5, mapY(0) + 4);
    ctx.fillText('y', mapX(0) - 15, mapY(yMax) - 5);
    ctx.fillText('O', mapX(0) - 15, mapY(0) + 15);
  };

  const drawParabola = (ctx: CanvasRenderingContext2D, fn: (x: number) => number, color: string, isDPositive: boolean) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= width - 2 * padding; i++) {
      const x = xMin + (i / (width - 2 * padding)) * (xMax - xMin);
      const y = fn(x);
      if (i === 0) ctx.moveTo(mapX(x), mapY(y));
      else ctx.lineTo(mapX(x), mapY(y));
    }
    ctx.stroke();

    // If real roots exist, highlight them
    if (isDPositive) {
      for (let i = 0; i <= width - 2 * padding; i++) {
        const x = xMin + (i / (width - 2 * padding)) * (xMax - xMin);
        const y = fn(x);
        if (Math.abs(y) < 0.1) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(mapX(x), mapY(0), 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx);

    const f1 = (x: number) => x * x + p * x + 1;
    const f2 = (x: number) => x * x + x + p;

    drawParabola(ctx, f1, '#3b82f6', hasRealRoots1); // Blue for f1
    drawParabola(ctx, f2, '#ef4444', hasRealRoots2); // Red for f2

  }, [p]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-2xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
          一方だけが実数解をもつ条件
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          2つの2次方程式が与えられたとき、パラメータ <InlineMath math="p" /> の値によってそれぞれの実数解の個数が変化します。
          「一方だけが実数解をもつ」という条件を視覚的に確認しましょう。
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-700 mb-2">方程式① (青)</h4>
            <BlockMath math={`x^2 ${p >= 0 ? '+' : ''} ${p.toFixed(1)}x + 1 = 0`} />
            <div className="mt-2 text-sm flex flex-col justify-between items-start gap-1">
              <span>判別式 <InlineMath math="D_1 = p^2 - 4" /></span>
              <span className={`font-bold ${d1 >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                D₁ = {d1.toFixed(2)} {d1 >= 0 ? ' (実数解あり)' : ' (実数解なし)'}
              </span>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-700 mb-2">方程式② (赤)</h4>
            <BlockMath math={`x^2 + x ${p >= 0 ? '+' : ''} ${p.toFixed(1)} = 0`} />
            <div className="mt-2 text-sm flex flex-col justify-between items-start gap-1">
              <span>判別式 <InlineMath math="D_2 = 1 - 4p" /></span>
              <span className={`font-bold ${d2 >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                D₂ = {d2.toFixed(2)} {d2 >= 0 ? ' (実数解あり)' : ' (実数解なし)'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <label className="text-sm font-semibold text-slate-700 mb-2">
            パラメータ <InlineMath math="p" /> : {p.toFixed(1)}
          </label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value))}
            className="w-full max-w-md accent-purple-600"
          />
          <div className="w-full max-w-md flex justify-between text-xs text-slate-500 mt-1">
            <span>-5</span>
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 text-center font-bold text-lg mb-6 ${exactlyOne ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-300 text-slate-500'}`}>
          {exactlyOne ? '✓ 達成！一方だけが実数解をもっています' : '× 条件未達成 (両方あり / 両方なし)'}
        </div>

        <div className="flex justify-center w-full">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border border-slate-300 rounded shadow-inner bg-slate-50"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}
