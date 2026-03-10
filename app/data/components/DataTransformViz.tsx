"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function DataTransformViz({ onComplete }: { onComplete: () => void }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Original Data
  const baseData = [2, 4, 5, 7, 8];
  const meanX = baseData.reduce((acc, val) => acc + val, 0) / baseData.length; // 5.2
  const varX = baseData.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0) / baseData.length; // 4.56
  const sdX = Math.sqrt(varX); // 2.135
  
  useEffect(() => {
    if (a !== 1 || b !== 0) {
      setHasChanged(true);
      if (a === -2 && b === 3) {
        onComplete();
      }
    }
  }, [a, b, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw functions
    const drawAxis = (y: number, label: string) => {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(w - 20, y);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(label, 20, y - 20);
      
      // Ticks from -20 to 20
      for (let i = -20; i <= 20; i += 5) {
        const xPos = 20 + ((i + 20) / 40) * (w - 40);
        ctx.beginPath();
        ctx.moveTo(xPos, y - 5);
        ctx.lineTo(xPos, y + 5);
        ctx.stroke();
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), xPos, y + 15);
      }
    };
    
    const drawDots = (data: number[], y: number, color: string) => {
      data.forEach(val => {
        const xPos = 20 + ((val + 20) / 40) * (w - 40);
        ctx.beginPath();
        ctx.arc(xPos, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };
    
    const drawMeanAndSpread = (mean: number, sd: number, y: number, color: string) => {
      const meanXPos = 20 + ((mean + 20) / 40) * (w - 40);
      const sdWidth = (sd / 40) * (w - 40);
      
      // Mean Line
      ctx.beginPath();
      ctx.moveTo(meanXPos, y - 25);
      ctx.lineTo(meanXPos, y + 25);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Spread (SD)
      ctx.fillStyle = color + '22'; // 20% opacity
      ctx.fillRect(meanXPos - sdWidth, y - 10, sdWidth * 2, 20);
    };

    // Original Axis (x)
    const yAxis1 = h * 0.3;
    drawAxis(yAxis1, "元のデータ x");
    drawDots(baseData, yAxis1, '#3b82f6');
    drawMeanAndSpread(meanX, sdX, yAxis1, '#3b82f6');

    // Transformed Axis (y)
    const yAxis2 = h * 0.7;
    drawAxis(yAxis2, "変換後のデータ y = ax + b");
    
    const transformedData = baseData.map(val => a * val + b);
    const meanY = a * meanX + b;
    const sdY = Math.abs(a) * sdX;
    
    drawDots(transformedData, yAxis2, '#f59e0b');
    drawMeanAndSpread(meanY, sdY, yAxis2, '#f59e0b');
    
    // Connect lines
    transformedData.forEach((val, i) => {
      const x1 = 20 + ((baseData[i] + 20) / 40) * (w - 40);
      const x2 = 20 + ((val + 20) / 40) * (w - 40);
      ctx.beginPath();
      ctx.moveTo(x1, yAxis1 + 10);
      ctx.lineTo(x2, yAxis2 - 10);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

  }, [a, b]);

  const meanY = a * meanX + b;
  const varY = (a * a) * varX;
  const sdY = Math.abs(a) * sdX;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Level 5: データの変換 (y = ax + b)</h3>
        {hasChanged && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">
            変換中...
          </span>
        )}
      </div>

      <div className="relative w-full aspect-[2/1] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-600 mb-4">変換パラメータ (y = ax + b)</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-mono text-slate-500">a (倍率)</span>
                <span className="font-bold text-blue-600">{a}</span>
              </div>
              <input type="range" min="-3" max="3" step="0.5" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-mono text-slate-500">b (平行移動)</span>
                <span className="font-bold text-amber-600">{b}</span>
              </div>
              <input type="range" min="-10" max="10" step="1" value={b} onChange={(e) => setB(parseInt(e.target.value))} className="w-full accent-amber-600" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-slate-200 text-sm">
            <span className="font-bold text-slate-700">ミッション:</span> <MathComponent tex="y = -2x + 3" /> を作ってみよう！
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 text-sm">
          <h4 className="font-bold text-slate-600 border-b pb-2">統計量の変化</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="text-slate-400">指標</div>
            <div className="font-bold text-blue-600">x (元)</div>
            <div className="font-bold text-amber-600">y (変換後)</div>
            
            <div className="text-slate-500">平均 <MathComponent tex="\bar{x}, \bar{y}" /></div>
            <div className="font-mono">{meanX.toFixed(2)}</div>
            <div className="font-mono bg-amber-50 rounded">{meanY.toFixed(2)}</div>
            
            <div className="text-slate-500">分散 <MathComponent tex="s^2" /></div>
            <div className="font-mono">{varX.toFixed(2)}</div>
            <div className="font-mono bg-amber-50 rounded">{varY.toFixed(2)}</div>
            
            <div className="text-slate-500">標準偏差 <MathComponent tex="s" /></div>
            <div className="font-mono">{sdX.toFixed(2)}</div>
            <div className="font-mono bg-amber-50 rounded">{sdY.toFixed(2)}</div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600 leading-relaxed">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>平均</strong>は <MathComponent tex="\bar{y} = a\bar{x} + b" /> (そのまま影響を受ける)</li>
              <li><strong>分散</strong>は <MathComponent tex="s_y^2 = a^2 s_x^2" /> (2乗倍になる、bは無関係)</li>
              <li><strong>標準偏差</strong>は <MathComponent tex="s_y = |a| s_x" /> (絶対値倍になる、bは無関係)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
