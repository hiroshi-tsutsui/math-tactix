"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

export default function BothRootsBetweenViz({ problem }: { problem?: any }) {
  const [a, setA] = useState<number>(1.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const d_div_4 = a * a - a - 2;
  const axis = a;
  const f0 = a + 2;
  const f3 = 11 - 5 * a;

  const dCondition = d_div_4 >= 0;
  const axisCondition = axis > 0 && axis < 3;
  const borderCondition = f0 > 0 && f3 > 0;
  const allClear = dCondition && axisCondition && borderCondition;

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.7;
    const scale = 50;

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
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    const x0 = centerX;
    const x3 = centerX + 3 * scale;
    
    // Domain highlight
    ctx.fillStyle = allClear ? 'rgba(34, 197, 94, 0.1)' : 'rgba(203, 213, 225, 0.2)';
    ctx.fillRect(x0, 0, x3 - x0, height);

    ctx.beginPath();
    ctx.moveTo(x0, 0); ctx.lineTo(x0, height);
    ctx.moveTo(x3, 0); ctx.lineTo(x3, height);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Parabola
    ctx.beginPath();
    ctx.strokeStyle = allClear ? '#22c55e' : '#3b82f6';
    ctx.lineWidth = 3;
    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      const y = x * x - 2 * a * x + a + 2;
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Axis line
    const axisPx = centerX + axis * scale;
    ctx.beginPath();
    ctx.moveTo(axisPx, 0); ctx.lineTo(axisPx, height);
    ctx.strokeStyle = axisCondition ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // f(0) and f(3)
    const py0 = centerY - f0 * scale;
    const py3 = centerY - f3 * scale;
    
    ctx.fillStyle = f0 > 0 ? '#22c55e' : '#ef4444';
    ctx.beginPath(); ctx.arc(x0, py0, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = f3 > 0 ? '#22c55e' : '#ef4444';
    ctx.beginPath(); ctx.arc(x3, py3, 6, 0, Math.PI * 2); ctx.fill();

    // Origin and 3 marks
    ctx.fillStyle = '#475569';
    ctx.font = '14px sans-serif';
    ctx.fillText('0', x0 - 15, centerY + 20);
    ctx.fillText('3', x3 - 5, centerY + 20);
  };

  useEffect(() => {
    drawGraph();
  }, [a, allClear]);

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">2つの解が特定の区間にある条件</h3>
        <p className="text-sm text-slate-600 mb-4">
          方程式 $x^2 - 2ax + a + 2 = 0$ が $0 &lt; x &lt; 3$ に異なる2つの実数解をもつ条件を満たすように $a$ を調整してください。
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-6 w-full max-w-4xl">
        <div className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-colors \${dCondition ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
          <div className="text-sm font-bold text-slate-500 mb-2 text-center">① 判別式 (交点の数)</div>
          <div className="text-center"><MathDisplay tex="D/4 = a^2 - a - 2 \ge 0" displayMode /></div>
          <div className={`text-center font-bold mt-2 \${dCondition ? 'text-green-600' : 'text-red-500'}`}>
            {dCondition ? 'OK (2解を持つ)' : 'NG (解を持たない)'}
          </div>
        </div>

        <div className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-colors \${axisCondition ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
          <div className="text-sm font-bold text-slate-500 mb-2 text-center">② 軸の位置</div>
          <div className="text-center"><MathDisplay tex="0 < a < 3" displayMode /></div>
          <div className={`text-center font-bold mt-2 \${axisCondition ? 'text-green-600' : 'text-red-500'}`}>
            {axisCondition ? 'OK (軸が範囲内)' : 'NG (軸が範囲外)'}
          </div>
        </div>

        <div className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-colors \${borderCondition ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
          <div className="text-sm font-bold text-slate-500 mb-2 text-center">③ 端点の符号</div>
          <div className="text-center"><MathDisplay tex="f(0) > 0, \ f(3) > 0" displayMode /></div>
          <div className={`text-center font-bold mt-2 \${borderCondition ? 'text-green-600' : 'text-red-500'}`}>
            {borderCondition ? 'OK (端点で正)' : 'NG (端点で負)'}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-slate-700">パラメータ $a$</span>
          <span className="text-xl font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{a.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="-1"
          max="4"
          step="0.1"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>-1.0</span>
          <span>正解: $2 \le a &lt; 2.2$</span>
          <span>4.0</span>
        </div>
      </div>

      <div className="relative w-full max-w-2xl border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-lg">
        {allClear && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-md z-10 flex items-center gap-2"
          >
            <span className="text-xl">✅</span> 3条件すべてクリア！
          </motion.div>
        )}
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="block w-full h-auto"
        />
      
      <HintButton hints={[
        { step: 1, text: "2つの解がともに区間 [p, q] にある条件は3つあります。" },
        { step: 2, text: "条件: (1) D ≧ 0、(2) p < 軸 < q、(3) f(p) > 0 かつ f(q) > 0（a > 0の場合）。" },
        { step: 3, text: "3条件の共通部分がパラメータの範囲になります。1つでも欠けると条件を満たしません。" },
      ]} />
    </div>
    </div>
  );
}
