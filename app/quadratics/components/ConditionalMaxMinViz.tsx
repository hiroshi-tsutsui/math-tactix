"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function ConditionalMaxMinViz() {
  const [k, setK] = useState(4); // Line: x + y = c (fixed c = 4)
  const [r2, setR2] = useState(25); // value of x^2 + y^2 = r^2
  
  const c = 4; // Constant for the line x + y = c

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const scale = 20;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += scale) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();

    // Line x + y = c => y = -x + c
    ctx.strokeStyle = '#3b82f6'; // Blue line
    ctx.lineWidth = 2;
    ctx.beginPath();
    const x1 = -10; const y1 = -x1 + c;
    const x2 = 10;  const y2 = -x2 + c;
    ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
    ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
    ctx.stroke();

    // Circle x^2 + y^2 = r^2
    const r = Math.sqrt(r2);
    ctx.strokeStyle = '#ef4444'; // Red circle
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Intersection Points Calculation
    // (x)^2 + (c-x)^2 = r^2 => 2x^2 - 2cx + c^2 - r^2 = 0
    // Discriminant D/4 = c^2 - 2(c^2 - r^2) = 2r^2 - c^2
    const D = 2 * r2 - c * c;
    if (D >= 0) {
      const sx1 = (c + Math.sqrt(D)) / 2;
      const sy1 = c - sx1;
      const sx2 = (c - Math.sqrt(D)) / 2;
      const sy2 = c - sx2;

      ctx.fillStyle = '#10b981'; // Green dot
      ctx.beginPath(); ctx.arc(cx + sx1 * scale, cy - sy1 * scale, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + sx2 * scale, cy - sy2 * scale, 4, 0, 2 * Math.PI); ctx.fill();
    }

  }, [r2]);

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-900 rounded-lg shadow-xl text-white">
      <h3 className="text-xl font-bold mb-4">条件付き最大・最小 (Conditional Max/Min)</h3>
      <p className="mb-4 text-sm text-gray-300">
        条件 <MathComponent tex="x + y = 4" /> のとき、<MathComponent tex="x^2 + y^2" /> の最小値を視覚的に探します。
      </p>

      <div className="relative border border-gray-700 rounded-lg overflow-hidden bg-black mb-6">
        <canvas ref={canvasRef} width={400} height={400} className="block" />
      </div>

      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          値 <MathComponent tex="k = x^2 + y^2" /> : {r2.toFixed(1)}
        </label>
        <input 
          type="range" 
          min="4" 
          max="36" 
          step="0.1" 
          value={r2} 
          onChange={(e) => setR2(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
          <p className="text-sm">
            円 <MathComponent tex="x^2 + y^2 = k" /> が直線 <MathComponent tex="x + y = 4" /> と交点を持つときの実数 <MathComponent tex="x, y" /> が存在します。
          </p>
          <p className="text-sm mt-2 text-emerald-400 font-bold">
            {r2 < 8 ? "交点なし (条件を満たさない)" : r2 === 8 ? "接する (最小値!)" : "2点で交わる"}
          </p>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "条件付き最大・最小では、制約条件を使って変数を減らします（例: x + y = 一定）。" },
        { step: 2, text: "x² + y² = k とすると、原点からの距離が √k の円です。直線との接点が最小値を与えます。" },
        { step: 3, text: "最小値は点と直線の距離の公式で求められます: d² = (c²/2) → k_min = c²/2。" },
      ]} />
    </div>
    </div>
  );
}
