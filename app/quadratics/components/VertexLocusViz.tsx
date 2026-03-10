import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { RefreshCw } from 'lucide-react';

export const VertexLocusViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [p, setP] = useState(1);
  const width = 500;
  const height = 400;
  
  // Logical coordinate system bounds
  const xMin = -4;
  const xMax = 4;
  const yMin = -6;
  const yMax = 6;
  
  const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i = Math.floor(xMin); i <= Math.ceil(xMax); i++) {
      ctx.moveTo(toCanvasX(i), 0); ctx.lineTo(toCanvasX(i), height);
    }
    for(let i = Math.floor(yMin); i <= Math.ceil(yMax); i++) {
      ctx.moveTo(0, toCanvasY(i)); ctx.lineTo(width, toCanvasY(i));
    }
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0)); ctx.lineTo(width, toCanvasY(0));
    ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), height);
    ctx.stroke();

    // The Locus: Y = -X^2 + X
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Light red / dotted
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let px = xMin; px <= xMax; px += 0.05) {
      const py = -px * px + px;
      const cx = toCanvasX(px);
      const cy = toCanvasY(py);
      if (px === xMin) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // The current Parabola: y = x^2 - 2px + p
    ctx.strokeStyle = '#3b82f6'; // Blue
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = x * x - 2 * p * x + p;
      const cx = toCanvasX(x);
      const cy = toCanvasY(y);
      if (x === xMin) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Current vertex (p, -p^2 + p)
    const vx = p;
    const vy = -p * p + p;
    const cvx = toCanvasX(vx);
    const cvy = toCanvasY(vy);

    // Draw moving line (locus trace)
    ctx.beginPath();
    ctx.arc(cvx, cvy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444'; // Red
    ctx.fill();

    // Highlight text
    ctx.fillStyle = '#111827';
    ctx.font = '14px Arial';
    ctx.fillText(`頂点 (${vx.toFixed(1)}, ${vy.toFixed(1)})`, cvx + 10, cvy - 10);

  }, [p]);

  return (
    <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-800">放物線の頂点の軌跡 (Locus of Vertex)</h3>
      
      <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-6 bg-slate-50">
        <canvas ref={canvasRef} width={width} height={height} className="block" />
        <div className="absolute top-4 left-4 bg-white/90 p-3 rounded shadow-sm border border-gray-100 backdrop-blur-sm">
          <div className="text-sm font-semibold text-gray-700 mb-1">現在の放物線:</div>
          <BlockMath math={`y = x^2 - 2(${p.toFixed(1)})x + ${p.toFixed(1)}`} />
          <div className="text-sm font-semibold text-gray-700 mt-2 mb-1">軌跡の方程式:</div>
          <BlockMath math={`y = -x^2 + x`} />
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-50 p-4 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            媒介変数 <span className="text-blue-600 font-mono">p</span>
          </label>
          <span className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded-md min-w-[3rem] text-center">
            {p.toFixed(1)}
          </span>
        </div>
        <input 
          type="range" 
          min="-3" 
          max="3" 
          step="0.1" 
          value={p} 
          onChange={(e) => setP(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
        <p className="text-sm text-gray-500 mt-3 text-center">
          スライダーを動かして、青い放物線の「赤い頂点」が赤い点線上を動く様子を確認しましょう。
        </p>
      </div>

      <div className="mt-6 w-full max-w-2xl bg-blue-50/50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-bold text-gray-800 mb-2 border-b border-blue-200 pb-2">💡 なぜこうなるのか？</h4>
        <div className="text-gray-700 space-y-2 text-sm">
          <p>1. 青い放物線を平方完成すると <InlineMath math="y = (x - p)^2 - p^2 + p" /> になります。</p>
          <p>2. この式の <strong>頂点</strong> の座標は、<InlineMath math="(p, -p^2 + p)" /> です。</p>
          <p>3. 頂点の座標を <InlineMath math="(X, Y)" /> とおくと、<strong>X = p</strong>, <strong>Y = -p^2 + p</strong> となります。</p>
          <p>4. <strong>Y</strong> の式にある <strong>p</strong> を <strong>X</strong> に置き換えると、<InlineMath math="Y = -X^2 + X" /> になります。</p>
          <p>5. したがって、頂点は常に <strong>赤い点線</strong>（<InlineMath math="y = -x^2 + x" />）の上を動くことになります。</p>
        </div>
      </div>
    </div>
  );
};

export default VertexLocusViz;