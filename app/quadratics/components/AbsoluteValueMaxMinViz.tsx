import React, { useEffect, useRef, useState } from 'react';
import { Problem } from '../types';
import { useTheme } from '../../contexts/ThemeContext';
import HintButton from '../../components/HintButton';

interface Props {
  problem: Problem;
  isCorrect: boolean;
}

export const AbsoluteValueMaxMinViz: React.FC<Props> = ({ problem, isCorrect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  
  // Extract parameters from params safely
  const meta = problem.params;
  const b = (meta?.b as number) || -4;
  const c = (meta?.c as number) || 3;
  // Make domain interactive
  const defaultDomain = (meta?.domain as number[]) || [0, 4];
  const [domainA, setDomainA] = useState<number>(defaultDomain[0]);
  const [domainB, setDomainB] = useState<number>(defaultDomain[1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Setup coordinates
    const scale = 30; // pixels per unit
    const originX = width / 2;
    const originY = height / 1.5; // shift down to show positive y-axis

    // Colors based on theme
    const isDark = resolvedTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const axisColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    const graphColor = isDark ? '#60A5FA' : '#3B82F6';
    const highlightColor = isDark ? '#F87171' : '#EF4444';
    const domainFill = isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)';
    const textColor = isDark ? '#FFF' : '#000';

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, originY - i * scale);
      ctx.lineTo(width, originY - i * scale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(originX + i * scale, 0);
      ctx.lineTo(originX + i * scale, height);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // The function: f(x) = |x^2 + bx + c|
    const f = (x: number) => Math.abs(x * x + b * x + c);
    
    // Draw base function (dashed, underneath)
    const baseF = (x: number) => x * x + b * x + c;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px - originX) / scale;
      const y = baseF(x);
      const py = originY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight domain range area
    const pDomainA = originX + domainA * scale;
    const pDomainB = originX + domainB * scale;
    ctx.fillStyle = domainFill;
    ctx.fillRect(pDomainA, 0, pDomainB - pDomainA, height);

    // Draw absolute value function inside domain
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let startedInside = false;
    for (let px = 0; px <= width; px += 1) {
      const x = (px - originX) / scale;
      if (x >= domainA && x <= domainB) {
        const y = f(x);
        const py = originY - y * scale;
        if (!startedInside) {
            ctx.moveTo(px, py);
            startedInside = true;
        } else {
            ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Draw absolute value function outside domain
    ctx.strokeStyle = graphColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let startedOutside = false;
    for (let px = 0; px <= width; px += 2) {
      const x = (px - originX) / scale;
      if (x < domainA || x > domainB) {
        const y = f(x);
        const py = originY - y * scale;
        if (!startedOutside) {
            ctx.moveTo(px, py);
            startedOutside = true;
        } else {
            ctx.lineTo(px, py);
        }
      } else {
          startedOutside = false;
      }
    }
    ctx.stroke();
    
    // Draw points at domain boundaries
    const pyA = originY - f(domainA) * scale;
    const pyB = originY - f(domainB) * scale;
    
    ctx.fillStyle = highlightColor;
    ctx.beginPath(); ctx.arc(pDomainA, pyA, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(pDomainB, pyB, 5, 0, Math.PI * 2); ctx.fill();

    // Draw Vertex (critical point inside domain)
    const vertexX = -b / 2;
    if (vertexX >= domainA && vertexX <= domainB) {
      const pyV = originY - f(vertexX) * scale;
      ctx.fillStyle = isDark ? '#FBBF24' : '#D97706'; // Yellow/Orange
      ctx.beginPath(); ctx.arc(originX + vertexX * scale, pyV, 5, 0, Math.PI * 2); ctx.fill();
    }
    
    // Find absolute max/min within domain for display
    // Critical points: domainA, domainB, vertexX, roots.
    const criticalPoints = [domainA, domainB];
    if (vertexX >= domainA && vertexX <= domainB) criticalPoints.push(vertexX);
    
    // calculate roots of x^2 + bx + c = 0
    const D = b * b - 4 * c;
    if (D >= 0) {
      const root1 = (-b + Math.sqrt(D)) / 2;
      const root2 = (-b - Math.sqrt(D)) / 2;
      if (root1 >= domainA && root1 <= domainB) criticalPoints.push(root1);
      if (root2 >= domainA && root2 <= domainB) criticalPoints.push(root2);
    }
    
    const maxVal = Math.max(...criticalPoints.map(x => f(x)));
    const minVal = Math.min(...criticalPoints.map(x => f(x)));

    // Render max/min text on canvas
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Max: ${maxVal.toFixed(2)}`, 10, 20);
    ctx.fillText(`Min: ${minVal.toFixed(2)}`, 10, 40);

  }, [b, c, domainA, domainB, resolvedTheme]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-md aspect-video bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={225}
          className="w-full h-full"
        />
      </div>
      
      <div className="flex flex-col gap-2 w-full max-w-md p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">区間 (Domain) を調整</div>
        <div className="flex items-center gap-4">
            <span className="text-xs w-8 text-right">a: {domainA}</span>
            <input 
              type="range" min="-5" max={domainB - 1} step="0.5" 
              value={domainA} onChange={(e) => setDomainA(Number(e.target.value))}
              className="flex-1"
            />
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs w-8 text-right">b: {domainB}</span>
            <input 
              type="range" min={domainA + 1} max="5" step="0.5" 
              value={domainB} onChange={(e) => setDomainB(Number(e.target.value))}
              className="flex-1"
            />
        </div>
      
      <HintButton hints={[
        { step: 1, text: "y = |f(x)| の最小値は必ず 0 以上です。f(x) = 0 の解が定義域内にあれば最小値は 0 です。" },
        { step: 2, text: "最大値は定義域の端点での値と、折り返しの山の頂点での値を比較して求めます。" },
        { step: 3, text: "定義域を動かして、最大値・最小値がどう変化するか確認しましょう。" },
      ]} />
    </div>
    </div>
  );
};
