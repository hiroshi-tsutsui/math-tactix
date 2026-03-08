import React, { useEffect, useRef } from 'react';

interface QuadraticInequalityVizProps {
  a: number;
  b: number;
  c: number;
  inequalitySign: string;
}

const QuadraticInequalityViz: React.FC<QuadraticInequalityVizProps> = ({ a, b, c, inequalitySign }) => {
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
    const scale = 40; // Pixels per unit

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid (Light)
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

    // Draw Axes (Dark)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y
    ctx.stroke();

    // Draw Parabola
    ctx.strokeStyle = '#2563eb'; // Blue-600
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= width; px+=2) {
      const x = (px - centerX) / scale;
      const y = a * x * x + b * x + c;
      const py = centerY - y * scale;
      
      if (py >= -100 && py <= height + 100) { // Optimize drawing range
        if (!started) {
             ctx.moveTo(px, py);
             started = true;
        } else {
             ctx.lineTo(px, py);
        }
      } else {
        started = false; // Break path if off-screen to avoid weird lines
      }
    }
    ctx.stroke();

    // Draw Roots & Intervals
    const D = b * b - 4 * a * c;
    const isPositive = inequalitySign.includes('>');
    const isEqual = inequalitySign.includes('=');
    
    ctx.strokeStyle = '#dc2626'; // Red
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    
    if (D > 0) {
      const x1 = (-b - Math.sqrt(D)) / (2 * a);
      const x2 = (-b + Math.sqrt(D)) / (2 * a);
      const left = Math.min(x1, x2);
      const right = Math.max(x1, x2);
      
      const pLeft = centerX + left * scale;
      const pRight = centerX + right * scale;
      
      ctx.beginPath();
      // Determine range
      // If a > 0 (Upward):
      //   > 0 (Positive) -> Outside
      //   < 0 (Negative) -> Inside
      const upward = a > 0;
      const outside = (upward && isPositive) || (!upward && !isPositive);
      
      if (outside) {
        ctx.moveTo(0, centerY); ctx.lineTo(pLeft, centerY);
        ctx.moveTo(pRight, centerY); ctx.lineTo(width, centerY);
      } else {
        ctx.moveTo(pLeft, centerY); ctx.lineTo(pRight, centerY);
      }
      ctx.stroke();
      
      // Draw Roots (Hollow or Filled)
      ctx.fillStyle = isEqual ? '#dc2626' : '#ffffff';
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      
      [pLeft, pRight].forEach(px => {
        ctx.beginPath();
        ctx.arc(px, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

    } else if (D === 0) {
       const root = -b / (2*a);
       const pRoot = centerX + root * scale;
       
       // a > 0 (Upward)
       //   > 0 -> All except root
       //   >= 0 -> All real
       //   < 0 -> None
       //   <= 0 -> Only root
       const upward = a > 0;
       
       ctx.beginPath();
       if (upward) {
         if (isPositive) {
             if (isEqual) { // >= 0
                 ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
             } else { // > 0
                 ctx.moveTo(0, centerY); ctx.lineTo(pRoot - 6, centerY);
                 ctx.moveTo(pRoot + 6, centerY); ctx.lineTo(width, centerY);
             }
         } else { // < 0 or <= 0
             if (isEqual) { // <= 0
                ctx.moveTo(pRoot-1, centerY); ctx.lineTo(pRoot+1, centerY); // Dot
             }
         }
       }
       ctx.stroke();
       
       // Draw Root
       ctx.fillStyle = isEqual ? '#dc2626' : '#ffffff';
       ctx.strokeStyle = '#dc2626';
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.arc(pRoot, centerY, 5, 0, Math.PI * 2);
       ctx.fill();
       ctx.stroke();
       
    } else { // D < 0 (Floating)
       // a > 0 (Floating Up)
       //   > 0 -> All real
       //   < 0 -> None
       const upward = a > 0;
       const allReal = (upward && isPositive) || (!upward && !isPositive);
       
       if (allReal) {
         ctx.beginPath();
         ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
         ctx.stroke();
       }
    }

  }, [a, b, c, inequalitySign]);

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
            <span>グラフ: y = {a}x²...</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 inline-block rounded-full"></span>
            <span>解の範囲 (x軸)</span>
        </div>
      </div>
    </div>
  );
};

export default QuadraticInequalityViz;
