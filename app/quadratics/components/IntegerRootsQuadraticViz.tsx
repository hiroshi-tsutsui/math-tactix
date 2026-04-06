"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
export default function IntegerRootsQuadraticViz() {
  const [k, setK] = useState<number>(12); // constant term
  
  // Calculate factor pairs for k
  const factorPairs = useMemo(() => {
    if (k === 0) return [];
    const pairs = [];
    const absK = Math.abs(k);
    for (let i = 1; i <= Math.sqrt(absK); i++) {
      if (absK % i === 0) {
        const j = absK / i;
        if (k > 0) {
          pairs.push({ alpha: i, beta: j });
          pairs.push({ alpha: -i, beta: -j });
        } else {
          pairs.push({ alpha: i, beta: -j });
          pairs.push({ alpha: -i, beta: j });
        }
      }
    }
    // Sort by alpha
    return pairs.sort((a, b) => a.alpha - b.alpha);
  }, [k]);

  // Selected pair index
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(0);
  
  useEffect(() => {
    if (factorPairs.length > 0) {
      if (selectedPairIdx >= factorPairs.length) {
        setSelectedPairIdx(0);
      }
    }
  }, [factorPairs, selectedPairIdx]);

  const selectedPair = factorPairs[selectedPairIdx];
  const aValue = selectedPair ? -(selectedPair.alpha + selectedPair.beta) : 0;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Transform setup
    const scaleX = 15;
    const scaleY = 5;
    const originX = width / 2;
    const originY = height / 2 + 50;

    const toCanvasX = (x: number) => originX + x * scaleX;
    const toCanvasY = (y: number) => originY - y * scaleY;

    // Grid and axes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = -20; x <= 20; x++) {
      ctx.moveTo(toCanvasX(x), 0);
      ctx.lineTo(toCanvasX(x), height);
    }
    for (let y = -50; y <= 50; y += 10) {
      ctx.moveTo(0, toCanvasY(y));
      ctx.lineTo(width, toCanvasY(y));
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw parabolas
    factorPairs.forEach((pair, idx) => {
      const a = -(pair.alpha + pair.beta);
      const isSelected = idx === selectedPairIdx;
      
      ctx.beginPath();
      ctx.strokeStyle = isSelected ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = isSelected ? 3 : 1;
      
      for (let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scaleX;
        const y = x * x + a * x + k;
        const py = toCanvasY(y);
        
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      
      if (isSelected) {
        // Draw roots
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(toCanvasX(pair.alpha), originY, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(toCanvasX(pair.beta), originY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Root labels
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`α = ${pair.alpha}`, toCanvasX(pair.alpha), originY + 20);
        ctx.fillText(`β = ${pair.beta}`, toCanvasX(pair.beta), originY + 35);
        
        // Vertex
        const vx = -a / 2;
        const vy = vx * vx + a * vx + k;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(toCanvasX(vx), toCanvasY(vy), 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw y-intercept (0, k)
    if (k !== 0) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(originX, toCanvasY(k), 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'left';
      ctx.fillText(`(0, ${k})`, originX + 10, toCanvasY(k) - 10);
    }

  }, [k, factorPairs, selectedPairIdx]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-2">2次方程式の整数解と係数の決定</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          <MathDisplay tex="x^2 + ax + k = 0" /> の2つの解 <MathDisplay tex="\alpha, \beta" /> がともに整数であるとき、
          解と係数の関係より <MathDisplay tex="\alpha \beta = k" />, <MathDisplay tex="\alpha + \beta = -a" /> が成り立ちます。<br/>
          定数 <MathDisplay tex="k" /> を調整し、条件を満たす放物線群を確認しましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border-slate-200">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">
                定数項 <MathDisplay tex="k" /> (積 <MathDisplay tex="\alpha\beta" />): <span className="font-mono bg-slate-100 px-2 py-1 rounded">{k}</span>
              </label>
            </div>
            <input type="range" min="-24" max="24" step="1" value={k} onChange={(e) => { const val = parseInt(e.target.value); if(val !== 0) setK(val); }} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 my-4" />

            {k === 0 && <p className="text-xs text-red-500 mt-1">※ k=0は除外しています</p>}
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-2 font-medium">条件を満たす整数解の組 <MathDisplay tex="(\alpha, \beta)" /></p>
              <div className="grid grid-cols-2 gap-2">
                {factorPairs.map((pair, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPairIdx(idx)}
                    className={`text-sm py-2 px-3 rounded-md border text-center transition-colors ${
                      idx === selectedPairIdx 
                        ? 'bg-blue-500 text-white border-blue-600 font-medium' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    ({pair.alpha}, {pair.beta}) → a = {-(pair.alpha + pair.beta)}
                  </button>
                ))}
              </div>
            </div>

            {selectedPair && (
              <motion.div 
                key={selectedPairIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <div className="flex flex-col space-y-2">
                  <div className="text-center">
                    <MathDisplay tex={`x^2 ${aValue >= 0 ? '+' : ''}${aValue}x ${k >= 0 ? '+' : ''}${k} = 0`} displayMode />
                  </div>
                  <div className="text-sm text-green-800 text-center">
                    <MathDisplay tex={`(x - ${selectedPair.alpha})(x - ${selectedPair.beta}) = 0`} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-6 border-slate-200 bg-white">
          <div className="relative w-full aspect-square md:aspect-auto md:h-full min-h-[400px]">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full h-full border border-slate-100 rounded-lg bg-slate-50/50"
            />
            <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500" />
                <span>選択中の放物線</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>整数解 (α, β)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>共通のy切片 (0, k)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
