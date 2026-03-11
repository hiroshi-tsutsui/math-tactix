"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ConditionForSimultaneousInequalitiesViz = () => {
  const [a, setA] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fixed inequality: -2 < x < 3
  const minX = -5;
  const maxX = 5;

  // Render logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const mapX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const yLine = height / 2 + 20;

    // Draw axis
    ctx.beginPath();
    ctx.moveTo(0, yLine);
    ctx.lineTo(width, yLine);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid marks
    for (let i = minX; i <= maxX; i++) {
      const px = mapX(i);
      ctx.beginPath();
      ctx.moveTo(px, yLine - 5);
      ctx.lineTo(px, yLine + 5);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), px, yLine + 20);
    }

    // Fixed Inequality: -2 < x < 3
    const p1 = mapX(-2);
    const p2 = mapX(3);
    const yFixed = yLine - 30;

    ctx.beginPath();
    ctx.moveTo(p1, yFixed);
    ctx.lineTo(p2, yFixed);
    ctx.lineTo(p2, yLine);
    ctx.moveTo(p1, yLine);
    ctx.lineTo(p1, yFixed);
    ctx.strokeStyle = '#3b82f6'; // blue
    ctx.lineWidth = 3;
    ctx.stroke();

    // Open circles for fixed
    ctx.beginPath();
    ctx.arc(p1, yLine, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p2, yLine, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

    // Moving Inequality: x > a
    const pa = mapX(a);
    const yMoving = yLine - 50;
    
    ctx.beginPath();
    ctx.moveTo(pa, yLine);
    ctx.lineTo(pa, yMoving);
    ctx.lineTo(width, yMoving);
    ctx.strokeStyle = '#ef4444'; // red
    ctx.lineWidth = 3;
    ctx.stroke();

    // Open circle for a
    ctx.beginPath();
    ctx.arc(pa, yLine, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Label a
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px sans-serif';
    ctx.fillText('a', pa, yLine + 35);

    // Intersection
    if (a < 3) {
      const startX = Math.max(-2, a);
      const endX = 3;
      if (startX < endX) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)'; // purple overlap
        ctx.fillRect(mapX(startX), yLine - 50, mapX(endX) - mapX(startX), 50);
      }
    }

  }, [a]);

  const hasSolution = a < 3;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-4 text-slate-700 text-sm">
        <p>連立不等式 <InlineMath math="-2 < x < 3" />, <InlineMath math="x > a" /> が解をもつための定数 <InlineMath math="a" /> の条件を視覚化します。</p>
      </div>

      <div className="mb-6 flex flex-col items-center">
        <label className="text-sm font-bold text-slate-700 mb-2">
          定数 <InlineMath math="a" /> の値: {a.toFixed(1)}
        </label>
        <input
          type="range"
          min="-4"
          max="4"
          step="0.1"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-full max-w-md"
        />
      </div>

      <div className="relative w-full aspect-[2/1] max-h-64 mb-4 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 left-2 bg-white/80 p-2 rounded shadow-sm text-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span><InlineMath math="-2 < x < 3" /></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span><InlineMath math="x > a" /></span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="text-lg">💡</span> 判定と解説
        </h4>
        <div className="text-sm text-slate-700 space-y-2">
          <div className={`p-3 rounded border ${hasSolution ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <span className="font-bold">{hasSolution ? '解をもつ (Overlap Exists)' : '解をもたない (No Overlap)'}</span>
            <span className="ml-2">
              (現在の状態: {hasSolution ? <InlineMath math={`a = ${a.toFixed(1)} < 3`} /> : <InlineMath math={`a = ${a.toFixed(1)} \\ge 3`} />})
            </span>
          </div>
          <p>
            「解をもつ」とは、2つの不等式の範囲が重なる部分（紫色の領域）が存在するということです。
          </p>
          <p>
            赤い範囲 <InlineMath math="x > a" /> を左右に動かしてみましょう。
            重なりが存在するためには、赤い範囲の左端である <InlineMath math="a" /> が、青い範囲の右端である <InlineMath math="3" /> よりも<strong>左側</strong>になければなりません。
          </p>
          <div className="mt-2 bg-white p-3 rounded border border-slate-200 font-bold text-center">
            求める条件は: <InlineMath math="a < 3" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ※ <InlineMath math="a = 3" /> のときは、青い範囲も <InlineMath math="x < 3" /> (白丸) であり、赤い範囲も <InlineMath math="x > 3" /> (白丸) となるため、境界線上で重ならず「解なし」となります。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionForSimultaneousInequalitiesViz;
