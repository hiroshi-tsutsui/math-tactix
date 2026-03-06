import React, { useRef, useEffect } from 'react';

interface QuadraticGraphProps {
  a: number;
  p: number;
  q: number;
  width?: number;
  height?: number;
  showAxis?: boolean;
  highlightVertex?: boolean;
  domain?: [number, number]; // [start, end]
  target?: 'max' | 'min';
  inequality?: {
    roots: [number, number];
    solutionType: 'between' | 'outside' | 'all' | 'none' | 'point';
    sign: '>' | '<' | '>=' | '<=';
  };
}

const QuadraticGraph: React.FC<QuadraticGraphProps> = ({ 
  a, p, q, width = 400, height = 220, showAxis = true, highlightVertex = true,
  domain, target, inequality
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    const w = width;
    const h = height;
    ctx.clearRect(0, 0, w, h);
    
    // Coordinate System
    const scale = 20; // 20px = 1 unit
    const ox = w / 2;
    const oy = h / 2 + 50; // Shift origin down

    // Draw Domain Shading (Background)
    if (domain) {
      const [dStart, dEnd] = domain;
      const x1 = ox + dStart * scale;
      const x2 = ox + dEnd * scale;
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; // blue-500, 10%
      ctx.fillRect(x1, 0, x2 - x1, h);
      
      // Domain boundaries
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, h); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Grid
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = -10; x <= 10; x++) {
      const xPos = ox + x * scale;
      ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, h); ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = -10; y <= 15; y++) {
       const yPos = oy - y * scale;
       ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(w, yPos); ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke(); // X
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke(); // Y

    // Function
    const f = (x: number) => a * (x - p) ** 2 + q;

    // Draw Parabola
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();

    let first = true;
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = f(x);
      const py = oy - y * scale;
      
      if (Math.abs(y) > 20) { first = true; continue; }
      
      if (first) { ctx.moveTo(px, py); first = false; }
      else { ctx.lineTo(px, py); }
    }
    ctx.stroke();

    // Highlight Vertex
    if (highlightVertex) {
      const vx = ox + p * scale;
      const vy = oy - q * scale;
      
      // Axis of Symmetry
      if (showAxis) {
        ctx.strokeStyle = '#ef4444'; 
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(vx, 0); ctx.lineTo(vx, h); ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = '#ef4444'; 
      ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Highlight Max/Min if domain exists
    if (domain && target) {
      // ... logic for max/min ...
    }

    if (inequality) {
      const { roots, solutionType, sign } = inequality;
      const [r1, r2] = roots; // r1 <= r2
      const x1 = ox + r1 * scale;
      const x2 = ox + r2 * scale;
      const axisY = oy;

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#22c55e'; // green-500
      ctx.lineCap = 'butt';

      const drawSegment = (start: number, end: number) => {
        ctx.beginPath(); ctx.moveTo(start, axisY); ctx.lineTo(end, axisY); ctx.stroke();
      };

      if (solutionType === 'between') {
        drawSegment(x1, x2);
      } else if (solutionType === 'outside') {
        drawSegment(0, x1);
        drawSegment(x2, w);
        // Arrows at ends
        // ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(10, axisY-5); ctx.stroke();
      }

      // Draw boundary points
      const isInclusive = sign.includes('=');
      const radius = 5;

      const drawPoint = (x: number) => {
        ctx.beginPath();
        ctx.arc(x, axisY, radius, 0, Math.PI * 2);
        if (isInclusive) {
          ctx.fillStyle = '#22c55e';
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#22c55e';
          ctx.stroke();
        }
      };

      if (solutionType !== 'none' && solutionType !== 'all') {
         drawPoint(x1);
         drawPoint(x2);
      }
    }

  }, [a, p, q, width, height, showAxis, highlightVertex, domain, target, inequality]);

  return <canvas ref={canvasRef} width={width} height={height} className="rounded-lg shadow-sm border border-slate-200 bg-white" />;
};

export default QuadraticGraph;
