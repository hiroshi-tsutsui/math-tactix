'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Problem } from '../types';
import { BlockMath } from 'react-katex';

interface SubstitutionMaxMinVizProps {
  problem: Problem;
}

export default function SubstitutionMaxMinViz({ problem }: SubstitutionMaxMinVizProps) {
  const { a, b, c, x_max } = problem.params;
  const canvasTRef = useRef<HTMLCanvasElement>(null);
  const canvasYRef = useRef<HTMLCanvasElement>(null);
  const [currentX, setCurrentX] = useState<number>(0);
  const [currentT, setCurrentT] = useState<number>(0);

  // t = x^2 - 2ax
  const calcT = (x: number) => x * x - 2 * a * x;
  // y = t^2 - 2bt + c
  const calcY = (t: number) => t * t - 2 * b * t + c;

  const t_min = calcT(a); // x=a is the vertex of t
  const t_max = Math.max(calcT(0), calcT(x_max));

  useEffect(() => {
    setCurrentT(calcT(currentX));
  }, [currentX, a]);

  const drawTGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / 6;
    const scaleT = height / (t_max - Math.min(t_min, -2) + 4);
    const offsetX = 1 * scaleX;
    const offsetT = height - Math.max(Math.abs(t_min), 2) * scaleT - 20;

    // Axes
    ctx.beginPath();
    ctx.moveTo(0, offsetT);
    ctx.lineTo(width, offsetT); // x-axis
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, height); // t-axis
    ctx.strokeStyle = '#9ca3af';
    ctx.stroke();

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('x', width - 15, offsetT - 5);
    ctx.fillText('t', offsetX + 5, 15);

    // Graph t = x^2 - 2ax
    ctx.beginPath();
    ctx.strokeStyle = '#d1d5db';
    for (let px = -1; px <= x_max + 1; px += 0.1) {
      const xCoord = offsetX + px * scaleX;
      const tCoord = offsetT - calcT(px) * scaleT;
      if (px === -1) ctx.moveTo(xCoord, tCoord);
      else ctx.lineTo(xCoord, tCoord);
    }
    ctx.stroke();

    // Domain highlight
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    for (let px = 0; px <= x_max; px += 0.05) {
      const xCoord = offsetX + px * scaleX;
      const tCoord = offsetT - calcT(px) * scaleT;
      if (px === 0) ctx.moveTo(xCoord, tCoord);
      else ctx.lineTo(xCoord, tCoord);
    }
    ctx.stroke();
    ctx.lineWidth = 1;

    // Current point
    const curXCoord = offsetX + currentX * scaleX;
    const curTCoord = offsetT - calcT(currentX) * scaleT;
    
    ctx.beginPath();
    ctx.arc(curXCoord, curTCoord, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Trace lines
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(curXCoord, offsetT);
    ctx.lineTo(curXCoord, curTCoord);
    ctx.lineTo(offsetX, curTCoord);
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawYGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const y_min_val = calcY(b >= t_min && b <= t_max ? b : (calcY(t_min) < calcY(t_max) ? t_min : t_max));
    const y_max_val = Math.max(calcY(t_min), calcY(t_max));

    const scaleT = width / (Math.max(t_max, 5) + 2);
    const scaleY = height / (y_max_val - Math.min(y_min_val, -2) + 5);
    const offsetT = 1.5 * scaleT;
    const offsetY = height - Math.max(Math.abs(y_min_val), 2) * scaleY - 20;

    // Axes
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(width, offsetY); // t-axis
    ctx.moveTo(offsetT, 0);
    ctx.lineTo(offsetT, height); // y-axis
    ctx.strokeStyle = '#9ca3af';
    ctx.stroke();

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('t', width - 15, offsetY - 5);
    ctx.fillText('y', offsetT + 5, 15);

    // Graph y = t^2 - 2bt + c
    ctx.beginPath();
    ctx.strokeStyle = '#d1d5db';
    for (let pt = t_min - 1; pt <= t_max + 1; pt += 0.1) {
      const tCoord = offsetT + pt * scaleT;
      const yCoord = offsetY - calcY(pt) * scaleY;
      if (pt === t_min - 1) ctx.moveTo(tCoord, yCoord);
      else ctx.lineTo(tCoord, yCoord);
    }
    ctx.stroke();

    // Domain highlight
    ctx.beginPath();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    for (let pt = t_min; pt <= t_max; pt += 0.05) {
      const tCoord = offsetT + pt * scaleT;
      const yCoord = offsetY - calcY(pt) * scaleY;
      if (pt === t_min) ctx.moveTo(tCoord, yCoord);
      else ctx.lineTo(tCoord, yCoord);
    }
    ctx.stroke();
    ctx.lineWidth = 1;

    // Current point
    const curTCoord = offsetT + currentT * scaleT;
    const curYCoord = offsetY - calcY(currentT) * scaleY;
    
    ctx.beginPath();
    ctx.arc(curTCoord, curYCoord, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Trace lines
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(curTCoord, offsetY);
    ctx.lineTo(curTCoord, curYCoord);
    ctx.lineTo(offsetT, curYCoord);
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (canvasTRef.current) {
      const ctx = canvasTRef.current.getContext('2d');
      if (ctx) drawTGraph(ctx, 300, 200);
    }
    if (canvasYRef.current) {
      const ctx = canvasYRef.current.getContext('2d');
      if (ctx) drawYGraph(ctx, 300, 200);
    }
  }, [currentX, currentT, a, b, c, x_max]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-xl">
        <BlockMath>{problem.question}</BlockMath>
      </div>
      
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md w-full">
        <p><b>Step 1:</b> $t = x^2 - ${2*a}x$ とおく。$0 \\le x \\le ${x_max}$ における $t$ の値の範囲を求める。</p>
        <p><b>Step 2:</b> $y = t^2 - ${2*b}t + ${c}$ のグラフを、求めた $t$ の範囲で考え、最大値・最小値を求める。</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
        {/* Graph 1: t vs x */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-center font-bold text-slate-700 mb-2">Step 1: t の範囲を特定</h3>
          <BlockMath>{`t = (x - ${a})^2 - ${a*a}`}</BlockMath>
          <canvas ref={canvasTRef} width={300} height={200} className="w-full h-auto bg-slate-50 mt-2" />
          <div className="text-center mt-2 text-blue-600 font-semibold">
            {t_min} ≤ t ≤ {t_max}
          </div>
        </div>

        {/* Graph 2: y vs t */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-center font-bold text-slate-700 mb-2">Step 2: y の最大・最小</h3>
          <BlockMath>{`y = (t - ${b})^2 ${c - b*b < 0 ? '-' : '+'} ${Math.abs(c - b*b)}`}</BlockMath>
          <canvas ref={canvasYRef} width={300} height={200} className="w-full h-auto bg-slate-50 mt-2" />
          <div className="text-center mt-2 text-purple-600 font-semibold">
            t = {currentT.toFixed(2)} のとき y = {calcY(currentT).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-4 rounded-xl border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          $x$ を動かして $t$ と $y$ の連動を確認: x = {currentX.toFixed(2)}
        </label>
        <input
          type="range"
          min={0}
          max={x_max}
          step={0.01}
          value={currentX}
          onChange={(e) => setCurrentX(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}