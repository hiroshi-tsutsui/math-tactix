'use client';

import { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

interface ParametricInequalityVizProps {
  fixedRoot: number; // e.g., 2
  inequalitySign: '<' | '>' | '<=' | '>='; // e.g., '<'
}

export default function ParametricInequalityViz({ fixedRoot, inequalitySign }: ParametricInequalityVizProps) {
  const [a, setA] = useState<number>(fixedRoot + 2); // Start with a > alpha
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants for rendering
  const width = 600;
  const height = 400;
  const scale = 40; // pixels per unit
  const offsetX = width / 2;
  const offsetY = height / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Function
    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        // Grid & Axis
        ctx.strokeStyle = '#e5e7eb'; // light gray
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

        // Ticks
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        
        for (let i = -10; i <= 10; i++) {
          if (i === 0) continue;
          const x = offsetX + i * scale;
          const y = offsetY; // Tick on axis
          
          // X-ticks
          if (x > 0 && x < width) {
            ctx.beginPath(); ctx.moveTo(x, offsetY - 3); ctx.lineTo(x, offsetY + 3); ctx.stroke();
            ctx.fillText(i.toString(), x, offsetY + 15);
          }
        }

        // Function: y = (x - fixedRoot)(x - a)
        ctx.strokeStyle = '#3b82f6'; // Blue-500
        ctx.lineWidth = 3;
        ctx.beginPath();

        const f = (x: number) => (x - fixedRoot) * (x - a);

        let started = false;
        // Draw Quadratic
        for (let px = 0; px <= width; px += 2) {
          const xVal = (px - offsetX) / scale;
          const yVal = f(xVal);
          const py = offsetY - yVal * scale; // Invert Y for canvas

          if (py >= -100 && py <= height + 100) { // Optimize drawing range
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
             started = false; // Break line if out of bounds to avoid artifacts
          }
        }
        ctx.stroke();

        // Roots
        const root1 = fixedRoot;
        const root2 = a;
        
        // Draw Roots
        const drawPoint = (val: number, label: string, color: string) => {
          const px = offsetX + val * scale;
          const py = offsetY;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1f2937'; // gray-800
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(label, px, py - 15);
        };

        drawPoint(root1, `α=${root1}`, '#ef4444'); // Red for fixed
        drawPoint(root2, `a=${root2.toFixed(1)}`, '#10b981'); // Emerald for variable

        // Solution Visualization on X-Axis (Green Highlight)
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'; // Green transparent
        const py = offsetY; // On x-axis

        const left = Math.min(root1, root2);
        const right = Math.max(root1, root2);

        ctx.beginPath();
        if (inequalitySign.includes('<')) {
            // Between roots
            if (Math.abs(root1 - root2) > 0.01) {
                ctx.moveTo(offsetX + left * scale, py);
                ctx.lineTo(offsetX + right * scale, py);
            }
        } else {
            // Outside roots
            // Left of 'left'
            ctx.moveTo(0, py);
            ctx.lineTo(offsetX + left * scale, py);
            
            // Right of 'right'
            ctx.moveTo(offsetX + right * scale, py);
            ctx.lineTo(width, py);
        }
        ctx.stroke();
        
        // Case Text Logic
        let caseText = "";
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#4b5563';
        ctx.textAlign = 'left';

        if (Math.abs(a - fixedRoot) < 0.1) {
            caseText = `a = ${fixedRoot} (重解)`;
        } else if (a < fixedRoot) {
            caseText = `a < ${fixedRoot}`;
        } else {
            caseText = `a > ${fixedRoot}`;
        }
        ctx.fillText(`Case: ${caseText}`, 20, 30);
    };

    draw();
  }, [a, fixedRoot, inequalitySign]); 

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white mt-4">
      <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            文字係数を含む2次不等式の視覚化
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Visual Tech</span>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border bg-gray-50 rounded w-full cursor-crosshair"
      />
      
      <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded">
        <div className="flex justify-between">
          <label className="font-semibold text-gray-700">Parameter a: {a.toFixed(1)}</label>
          <span className="text-sm text-gray-500">Fixed Root α = {fixedRoot}</span>
        </div>
        <input 
          type="range" 
          min="-5" 
          max="8" 
          step="0.1" 
          value={a} 
          onChange={(e) => setA(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <p className="text-sm text-gray-600 mt-1">
            <span className="font-bold">Check Point:</span> $a$ を動かして、$a = {fixedRoot}$ の瞬間に不等式の解がどうなるか確認せよ。
        </p>
      
      <HintButton hints={[
        { step: 1, text: "2次不等式にパラメータが含まれる場合、解の形がパラメータの値で変わります。" },
        { step: 2, text: "パラメータの値によって解の範囲の端点が移動し、不等号が等号を含むかどうかも変わります。" },
        { step: 3, text: "a をスライダーで動かして、解の範囲がどう変化するか視覚的に確認しましょう。" },
      ]} />
    </div>
    </div>
  );
}
