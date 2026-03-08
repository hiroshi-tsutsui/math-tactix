'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MovingDomainVizProps {
  // Quadratic Function: y = a(x-p)^2 + q
  p?: number; // Axis
  q?: number; // Vertex Y
  width?: number; // Domain width (e.g., 2 for [a, a+2])
}

export default function MovingDomainViz({ p = 2, q = 1, width: domainWidth = 2 }: MovingDomainVizProps) {
  const [a, setA] = useState<number>(0); // Start of domain [a, a+2]
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const width = 600;
  const height = 400;
  const scale = 40; // pixels per unit
  const offsetX = width / 2;
  const offsetY = height * 0.7; // Lower axis to show more positive y

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Function
    const draw = () => {
        // Clear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Grid & Axis
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y-Axis
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, height);
        ctx.stroke();

        // X-Axis
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(width, offsetY);
        ctx.stroke();

        // Function: y = (x-p)^2 + q
        ctx.strokeStyle = '#9ca3af'; // Gray-400 (Base Graph)
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const f = (x: number) => Math.pow(x - p, 2) + q;

        for (let px = 0; px <= width; px += 2) {
          const xVal = (px - offsetX) / scale;
          const yVal = f(xVal);
          const py = offsetY - yVal * scale;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Axis of Symmetry (Red Dashed)
        const axisX = offsetX + p * scale;
        ctx.strokeStyle = '#ef4444'; // Red-500
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(axisX, 0);
        ctx.lineTo(axisX, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Label Axis
        ctx.fillStyle = '#ef4444';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Axis x=${p}`, axisX + 5, 20);

        // Domain Visualization [a, a+width]
        const startX = offsetX + a * scale;
        const endX = offsetX + (a + domainWidth) * scale;
        
        // Domain Highlight on X-Axis
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; // Blue transparent
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(startX, offsetY);
        ctx.lineTo(endX, offsetY);
        ctx.stroke();

        // Domain Area Shade
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(startX, 0, endX - startX, height);

        // Function segment in Domain (Active Graph)
        ctx.strokeStyle = '#2563eb'; // Blue-600
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

        // Endpoints
        const drawPoint = (x: number, color: string, label?: string) => {
            const y = f(x);
            const px = offsetX + x * scale;
            const py = offsetY - y * scale;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
            if (label) {
                ctx.fillStyle = '#1f2937';
                ctx.fillText(label, px + 10, py - 10);
            }
        };

        drawPoint(a, '#2563eb', `x=a`);
        drawPoint(a + domainWidth, '#2563eb', `x=a+${domainWidth}`);
        
        // Vertex (if in domain)
        if (p >= a && p <= a + domainWidth) {
             drawPoint(p, '#ef4444', 'Min');
        }

        // Logic Visualization
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#111827';
        
        // Determine Case
        let caseMsg = "";
        const mid = a + domainWidth / 2;
        
        if (p < a) {
            // Case 1: Axis is Left of Domain
            caseMsg = "Case: 軸 < 定義域の左端 (Min at Left)";
        } else if (p > a + domainWidth) {
             // Case 3: Axis is Right of Domain
            caseMsg = "Case: 定義域の右端 < 軸 (Min at Right)";
        } else {
             // Case 2: Axis is Inside Domain
            caseMsg = "Case: 定義域内に軸を含む (Min at Vertex)";
        }
        ctx.fillText(caseMsg, 20, 30);
    };
    
    // Animation Loop (simple redraw on state change)
    draw();

  }, [a, p, q, domainWidth]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
            定義域が動く最大・最小 (Moving Domain)
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Visual Tech</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border bg-gray-50 rounded w-full cursor-grab active:cursor-grabbing"
      />

      <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded">
         <div className="flex justify-between text-sm text-gray-700 font-semibold">
            <span>Left: x = a ({a.toFixed(1)})</span>
            <span>Right: x = a+2 ({(a + 2).toFixed(1)})</span>
         </div>
         <input 
            type="range" 
            min="-2" 
            max="6" 
            step="0.1" 
            value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
         />
         <div className="text-xs text-gray-500 mt-1">
            <span className="font-bold">Point:</span> 定義域 [a, a+2] をスライドさせて、最小値となる場所(頂点or端点)の変化を確認せよ。
         </div>
      </div>
    </div>
  );
}
