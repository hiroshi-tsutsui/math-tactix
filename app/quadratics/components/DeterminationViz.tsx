import React, { useEffect, useRef } from 'react';

interface DeterminationVizProps {
  params: any;
}

const DeterminationViz: React.FC<DeterminationVizProps> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30; // Pixels per unit

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y
    ctx.stroke();

    // Helper: Plot Point
    const plotPoint = (x: number, y: number, color: string, label?: string) => {
      const px = centerX + x * scale;
      const py = centerY - y * scale;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      
      if (label) {
        ctx.fillStyle = '#1f2937';
        ctx.font = '10px sans-serif';
        ctx.fillText(label, px + 6, py - 6);
      }
    };

    // Helper: Draw Parabola (y = ax^2 + bx + c)
    const drawParabola = (a: number, b: number, c: number, color: string = '#2563eb') => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      // Draw with higher resolution
      for (let px = 0; px <= width; px+=1) {
        const x = (px - centerX) / scale;
        const y = a * x * x + b * x + c;
        const py = centerY - y * scale;
        
        if (py >= -500 && py <= height + 500) { // Wider render range
          if (!started) {
               ctx.moveTo(px, py);
               started = true;
          } else {
               ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    };

    // Draw based on type
    if (params.type === 'vertex_point') {
      const { p, q, x1, y1, a } = params;
      plotPoint(p, q, '#dc2626', `頂点`);
      plotPoint(x1, y1, '#059669', `点`);
      
      // y = a(x-p)^2 + q = ax^2 - 2apx + (ap^2 + q)
      const b = -2 * a * p;
      const c = a * p * p + q;
      drawParabola(a, b, c);

    } else if (params.type === 'axis_points') {
      const { axis, p1, p2, a, q } = params; // Note: q is from y = a(x-p)^2 + q

      // Draw Axis
      const pAxis = centerX + axis * scale;
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pAxis, 0); ctx.lineTo(pAxis, height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      plotPoint(p1.x, p1.y, '#059669');
      plotPoint(p2.x, p2.y, '#059669');

      // y = a(x-axis)^2 + q
      const b = -2 * a * axis;
      const c = a * axis * axis + q;
      drawParabola(a, b, c);

    } else if (params.type === 'intercepts_point') {
      const { alpha, beta, p1, a } = params;
      
      plotPoint(alpha, 0, '#dc2626', `${alpha}`);
      plotPoint(beta, 0, '#dc2626', `${beta}`);
      plotPoint(p1.x, p1.y, '#059669');

      // y = a(x-alpha)(x-beta) = a(x^2 - (alpha+beta)x + alpha*beta)
      const b = -a * (alpha + beta);
      const c = a * alpha * beta;
      drawParabola(a, b, c);

    } else if (params.type === 'three_points') {
      const { p1, p2, p3, a, b, c } = params;
      
      plotPoint(p1.x, p1.y, '#059669');
      plotPoint(p2.x, p2.y, '#059669');
      plotPoint(p3.x, p3.y, '#059669');
      
      drawParabola(a, b, c);
    }

  }, [params]);

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border mt-4">
      <h4 className="font-bold text-gray-700 mb-2 text-sm border-b pb-1 w-full text-center">視覚的イメージ</h4>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="border border-gray-200 rounded bg-white shadow-inner"
      />
      <div className="mt-2 text-xs text-gray-500 flex gap-4">
        <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-600 inline-block rounded-full"></span>
            <span>求める放物線</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 inline-block rounded-full"></span>
            <span>条件 (点・軸)</span>
        </div>
      </div>
    </div>
  );
};

export default DeterminationViz;
