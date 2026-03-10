'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MovingDomainVizProps {
  p?: number; // Axis
  q?: number; // Vertex Y
  width?: number; // Domain width
}

export default function MovingDomainViz({ p = 2, q = 1, width: domainWidth = 2 }: MovingDomainVizProps) {
  const [a, setA] = useState<number>(0);
  const [mode, setMode] = useState<'min' | 'max'>('min');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = 600;
  const height = 400;
  const scale = 40;
  const offsetX = width / 2;
  const offsetY = height * 0.7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, offsetY); ctx.lineTo(width, offsetY);
        ctx.stroke();

        const f = (x: number) => Math.pow(x - p, 2) + q;

        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = 0; px <= width; px += 2) {
          const xVal = (px - offsetX) / scale;
          const yVal = f(xVal);
          const py = offsetY - yVal * scale;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const axisX = offsetX + p * scale;
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(axisX, 0); ctx.lineTo(axisX, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.font = '14px sans-serif';
        ctx.fillText(`軸 x=${p}`, axisX + 5, 20);

        const startX = offsetX + a * scale;
        const endX = offsetX + (a + domainWidth) * scale;
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(startX, offsetY); ctx.lineTo(endX, offsetY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(startX, 0, endX - startX, height);

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let xVal = a; xVal <= a + domainWidth; xVal += 0.05) {
            const yVal = f(xVal);
            const px = offsetX + xVal * scale;
            const py = offsetY - yVal * scale;
            if (xVal === a) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const drawPoint = (x: number, color: string, label?: string, isExtremum = false) => {
            const y = f(x);
            const px = offsetX + x * scale;
            const py = offsetY - y * scale;
            
            if (isExtremum) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
                ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
            }
            
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
            if (label) {
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText(label, px + 10, py - 10);
            }
        };

        const mid = a + domainWidth / 2;

        if (mode === 'max') {
            const midX = offsetX + mid * scale;
            ctx.strokeStyle = '#10b981';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(midX, 0); ctx.lineTo(midX, height);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#10b981';
            ctx.fillText(`定義域の中央 x=${mid.toFixed(1)}`, midX + 5, 40);

            if (mid < p) {
                drawPoint(a, '#ef4444', 'Max (左端)', true);
                drawPoint(a + domainWidth, '#2563eb', `x=a+${domainWidth}`);
            } else if (mid > p) {
                drawPoint(a, '#2563eb', `x=a`);
                drawPoint(a + domainWidth, '#ef4444', 'Max (右端)', true);
            } else {
                drawPoint(a, '#ef4444', 'Max (両端)', true);
                drawPoint(a + domainWidth, '#ef4444', 'Max (両端)', true);
            }
        } else {
            if (p < a) {
                drawPoint(a, '#ef4444', 'Min (左端)', true);
                drawPoint(a + domainWidth, '#2563eb', `x=a+${domainWidth}`);
            } else if (p > a + domainWidth) {
                drawPoint(a, '#2563eb', `x=a`);
                drawPoint(a + domainWidth, '#ef4444', 'Min (右端)', true);
            } else {
                drawPoint(a, '#2563eb', `x=a`);
                drawPoint(a + domainWidth, '#2563eb', `x=a+${domainWidth}`);
                drawPoint(p, '#ef4444', 'Min (頂点)', true);
            }
        }

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#111827';
        
        let caseMsg = "";
        let explanation = "";
        
        if (mode === 'min') {
            if (p < a) {
                caseMsg = "【最小値】場合分け(1): 軸 < 定義域の左端";
                explanation = "軸が左外にあるため、区間の左端(x=a)で最小。";
            } else if (p > a + domainWidth) {
                caseMsg = "【最小値】場合分け(3): 定義域の右端 < 軸";
                explanation = "軸が右外にあるため、区間の右端(x=a+2)で最小。";
            } else {
                caseMsg = "【最小値】場合分け(2): 定義域内に軸を含む";
                explanation = "頂点が区間に含まれるため、頂点(x=p)で最小。";
            }
        } else {
            if (mid < p) {
                caseMsg = "【最大値】場合分け(1): 定義域の中央 < 軸";
                explanation = "軸が右寄りなので、遠い方の左端(x=a)で最大。";
            } else if (mid > p) {
                caseMsg = "【最大値】場合分け(3): 軸 < 定義域の中央";
                explanation = "軸が左寄りなので、遠い方の右端(x=a+2)で最大。";
            } else {
                caseMsg = "【最大値】場合分け(2): 定義域の中央 = 軸";
                explanation = "軸がど真ん中なので、両端(x=a, a+2)で最大。";
            }
        }
        
        ctx.fillText(caseMsg, 20, 30);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#4b5563';
        ctx.fillText(explanation, 20, 50);
    };
    
    draw();
  }, [a, p, q, domainWidth, mode]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
            定義域が動く最大・最小 (Moving Domain)
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('min')}
            className={`px-3 py-1 text-sm rounded ${mode === 'min' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            最小値の考え方
          </button>
          <button 
            onClick={() => setMode('max')}
            className={`px-3 py-1 text-sm rounded ${mode === 'max' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            最大値の考え方
          </button>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="border bg-gray-50 rounded w-full cursor-grab active:cursor-grabbing"
      />

      <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded">
         <div className="flex justify-between text-sm text-gray-700 font-semibold">
            <span>Left: x = a ({a.toFixed(1)})</span>
            <span>Right: x = a+{domainWidth} ({(a + domainWidth).toFixed(1)})</span>
         </div>
         <input 
            type="range" 
            min="-2" max="6" step="0.1" 
            value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
         />
         <div className="text-xs text-gray-500 mt-1">
            <span className="font-bold">Point:</span> {mode === 'min' ? '定義域を動かし、頂点(軸)が含まれるかどうかの3パターンを確認しましょう。' : '定義域を動かし、「定義域の中央」と「軸」の距離の2パターン(一致で3)を確認しましょう。'}
         </div>
      </div>
    </div>
  );
}
