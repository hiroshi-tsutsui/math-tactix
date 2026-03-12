"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// --- Components ---
const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

type Point = { id: number; x: number; y: number };

export default function CovarianceViz({ onComplete }: { onComplete?: () => void }) {
  const [points, setPoints] = useState<Point[]>([
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 40, y: 50 },
    { id: 3, x: 70, y: 60 },
    { id: 4, x: 80, y: 80 },
    { id: 5, x: 30, y: 20 }
  ]);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 400;
  const margin = 50;
  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;

  // Scale functions (domain: 0 to 100)
  const xScale = (val: number) => margin + (val / 100) * innerWidth;
  const yScale = (val: number) => margin + ((100 - val) / 100) * innerHeight;
  
  // Inverse scale functions
  const invertX = (x: number) => Math.max(0, Math.min(100, ((x - margin) / innerWidth) * 100));
  const invertY = (y: number) => Math.max(0, Math.min(100, 100 - ((y - margin) / innerHeight) * 100));

  // Compute stats
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
  const covariance = points.reduce((sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0) / points.length;

  const handlePointerDown = (e: React.PointerEvent, id: number) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggedPoint(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedPoint === null) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;
    
    setPoints(prev => prev.map(p => 
      p.id === draggedPoint 
        ? { ...p, x: invertX(x), y: invertY(y) }
        : p
    ));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedPoint !== null) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDraggedPoint(null);
    }
  };

  useEffect(() => {
    if (Math.abs(covariance) > 400 && onComplete) {
      onComplete();
    }
  }, [covariance, onComplete]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Visual Area */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 relative overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-2">散布図と共分散の面積</h3>
          <p className="text-sm text-slate-500 mb-4">
            点をドラッグして分布を変えてみましょう。平均線の「右上」と「左下」にある点は<span className="text-blue-600 font-bold">青色（正の面積）</span>を、「右下」と「左上」にある点は<span className="text-red-600 font-bold">赤色（負の面積）</span>を作ります。
          </p>
          
          <svg 
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Axes */}
            <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#cbd5e1" strokeWidth="2" />
            <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#cbd5e1" strokeWidth="2" />
            
            {/* Mean lines */}
            <line 
              x1={xScale(meanX)} y1={margin} 
              x2={xScale(meanX)} y2={height - margin} 
              stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" 
            />
            <line 
              x1={margin} y1={yScale(meanY)} 
              x2={width - margin} y2={yScale(meanY)} 
              stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" 
            />
            
            <text x={xScale(meanX) + 5} y={margin - 10} fill="#64748b" fontSize="12"><tspan style={{fontFamily: 'serif', fontStyle: 'italic'}}>x</tspan>の平均</text>
            <text x={width - margin + 10} y={yScale(meanY) - 5} fill="#64748b" fontSize="12"><tspan style={{fontFamily: 'serif', fontStyle: 'italic'}}>y</tspan>の平均</text>

            {/* Rectangles representing (x - meanX) * (y - meanY) */}
            {points.map(p => {
              const dx = p.x - meanX;
              const dy = p.y - meanY;
              const rectX = xScale(Math.min(p.x, meanX));
              const rectY = yScale(Math.max(p.y, meanY)); // SVG y is inverted, higher val = lower y
              const rectW = Math.abs(xScale(p.x) - xScale(meanX));
              const rectH = Math.abs(yScale(p.y) - yScale(meanY));
              
              // Positive area (dx and dy have same sign) -> blue
              // Negative area (dx and dy have different signs) -> red
              const isPositive = dx * dy >= 0;
              
              return (
                <rect 
                  key={`rect-${p.id}`}
                  x={rectX} y={rectY} width={rectW} height={rectH}
                  fill={isPositive ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)"}
                  stroke={isPositive ? "rgba(59, 130, 246, 0.5)" : "rgba(239, 68, 68, 0.5)"}
                  strokeWidth="1"
                />
              );
            })}

            {/* Data points */}
            {points.map(p => (
              <circle 
                key={p.id}
                cx={xScale(p.x)} 
                cy={yScale(p.y)} 
                r={draggedPoint === p.id ? 8 : 6}
                fill="#334155"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, p.id)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Logic & Math Area */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
          <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 p-1 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            数学的構造
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="text-slate-400 text-xs mb-1">共分散の定義</div>
              <div className="bg-slate-800/50 p-3 rounded text-center">
                <MathComponent tex="s_{xy} = \frac{1}{n} \sum (x_i - \bar{x})(y_i - \bar{y})" />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm">現在の共分散</span>
                <span className={`font-mono text-lg font-bold ${covariance > 0 ? 'text-blue-400' : covariance < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                  {covariance.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                共分散は、各点が作る「面積」の平均です。<br/>
                <span className="text-blue-400">青い面積</span>が多ければ正の相関、<span className="text-red-400">赤い面積</span>が多ければ負の相関になります。
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-700/50">
              <div className="text-xs text-indigo-300 font-bold mb-1">テストの鉄則</div>
              <div className="text-sm text-indigo-100">
                「共分散が負」になるのは、xが平均より大きいときにyが平均より小さい（またはその逆）点が多いからです。四象限で面積をイメージすると符号を間違えません。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
