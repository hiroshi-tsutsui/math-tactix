'use client';

import React, { useRef, useEffect, useState } from 'react';
import HintButton from '../../components/HintButton';

interface GraphTransformationVizProps {
  initialParams?: { a: number, p: number, q: number };
  targetParams?: { a: number, p: number, q: number }; // If provided, show target as ghost or goal
  transformationType?: 'translation' | 'symmetry_x' | 'symmetry_y' | 'symmetry_origin';
}

const GraphTransformationViz: React.FC<GraphTransformationVizProps> = ({ 
  initialParams = { a: 1, p: 0, q: 0 },
  targetParams,
  transformationType 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive state
  const [a, setA] = useState(initialParams.a);
  const [p, setP] = useState(initialParams.p); 
  const [q, setQ] = useState(initialParams.q);
  const [mode, setMode] = useState<'translation' | 'symmetryX' | 'symmetryY' | 'symmetryOrigin'>('translation');

  // Sync with props if they change (new problem)
  useEffect(() => {
    setA(initialParams.a);
    setP(initialParams.p);
    setQ(initialParams.q);
    
    // Map generator type to component mode
    if (transformationType === 'symmetry_x') setMode('symmetryX');
    else if (transformationType === 'symmetry_y') setMode('symmetryY');
    else if (transformationType === 'symmetry_origin') setMode('symmetryOrigin');
    else setMode('translation');
  }, [initialParams, transformationType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Constants
    const width = canvas.width;
    const height = canvas.height;
    const scale = 30; // pixels per unit (slightly smaller to fit more)
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Helper: Draw Grid
    const drawGrid = () => {
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -15; x <= 15; x++) {
        ctx.moveTo(centerX + x * scale, 0);
        ctx.lineTo(centerX + x * scale, height);
      }
      for (let y = -15; y <= 15; y++) {
        ctx.moveTo(0, centerY - y * scale);
        ctx.lineTo(width, centerY - y * scale);
      }
      ctx.stroke();

      // Axes
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();
    };

    drawGrid();

    // Helper: Draw Parabola
    const drawParabola = (
      paramA: number, paramP: number, paramQ: number, 
      color: string, dashed: boolean = false, lineWidth: number = 2
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (dashed) ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);
      
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= width; px+=2) { // optimization
        const x = (px - centerX) / scale;
        // y = a(x-p)^2 + q
        const y = paramA * Math.pow(x - paramP, 2) + paramQ;
        const py = centerY - y * scale;
        
        if (py >= -100 && py <= height + 100) { // optimization bounds
            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Vertex
      const vPx = centerX + paramP * scale;
      const vPy = centerY - paramQ * scale;
      if (vPx >= 0 && vPx <= width && vPy >= 0 && vPy <= height) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(vPx, vPy, 4, 0, Math.PI * 2);
          ctx.fill();
      }
    };

    // 1. Draw Original Graph (Gray Dashed)
    // Always show the "Start" state
    drawParabola(initialParams.a, initialParams.p, initialParams.q, '#9ca3af', true);

    // 2. Draw Target Graph (Green Dashed) - IF provided (Solution)
    if (targetParams) {
        drawParabola(targetParams.a, targetParams.p, targetParams.q, '#10b981', true, 1);
    }

    // 3. Draw Current Interactive Graph (Blue/Red)
    // Calculate current transformation based on mode
    let currentA = a;
    let currentP = p;
    let currentQ = q;

    if (mode === 'symmetryX') {
        currentA = -a;
        currentQ = -q;
    } else if (mode === 'symmetryY') {
        currentP = -p;
    } else if (mode === 'symmetryOrigin') {
        currentA = -a;
        currentP = -p;
        currentQ = -q;
    }

    const color = mode === 'translation' ? '#3b82f6' : '#ef4444';
    drawParabola(currentA, currentP, currentQ, color, false, 3);

  }, [a, p, q, mode, initialParams, targetParams]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full">
      <div className="flex justify-between w-full items-center">
          <h3 className="text-md font-bold text-gray-700">
            {mode === 'translation' ? '平行移動 (Translation)' : '対称移動 (Symmetry)'}
          </h3>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
             {transformationType ? "問題モード (Problem Mode)" : "自由モード (Free Mode)"}
          </div>
      </div>

      <div className="relative w-full flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="border border-gray-200 rounded-lg bg-white w-full max-w-[600px]"
        />
        
        {/* Equation Legend */}
        <div className="absolute top-4 right-4 bg-white/95 p-3 rounded-lg shadow-sm border border-gray-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2 mb-1">
             <span className="w-3 h-1 bg-gray-400 border-dashed border-gray-400 border-t"></span>
             <span className="text-gray-500">元: y = {formatEq(initialParams.a, initialParams.p, initialParams.q)}</span>
          </div>
          {targetParams && (
             <div className="flex items-center gap-2 mb-1">
               <span className="w-3 h-1 bg-green-500 border-dashed border-green-500 border-t"></span>
               <span className="text-green-600">正解: y = {formatEq(targetParams.a, targetParams.p, targetParams.q)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 font-bold">
             <span className={`w-3 h-1 ${mode === 'translation' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
             <span className={mode === 'translation' ? 'text-blue-600' : 'text-red-600'}>
                今: y = {formatEq(
                    mode === 'symmetryX' || mode === 'symmetryOrigin' ? -a : a,
                    mode === 'symmetryY' || mode === 'symmetryOrigin' ? -p : p,
                    mode === 'symmetryX' || mode === 'symmetryOrigin' ? -q : q
                )}
             </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      {mode === 'translation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg bg-gray-50 p-4 rounded-lg">
          <div className="space-y-1">
            <label className="flex justify-between text-sm font-medium text-gray-700">
              <span>X軸方向 (p): <span className="text-blue-600 font-bold">{p}</span></span>
            </label>
            <input 
              type="range" 
              min="-6" max="6" step="1" 
              value={p}
              onChange={(e) => setP(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="space-y-1">
            <label className="flex justify-between text-sm font-medium text-gray-700">
              <span>Y軸方向 (q): <span className="text-blue-600 font-bold">{q}</span></span>
            </label>
            <input 
              type="range" 
              min="-6" max="6" step="1" 
              value={q}
              onChange={(e) => setQ(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}
      
      {mode !== 'translation' && (
         <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            {mode === 'symmetryX' && "X軸対称: 上下が反転します (y → -y)"}
            {mode === 'symmetryY' && "Y軸対称: 左右が反転します (x → -x)"}
            {mode === 'symmetryOrigin' && "原点対称: 上下左右が反転します"}
         </div>
      )}

      {/* Manual Mode Toggle (only if not in problem mode) */}
      {!transformationType && (
        <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => setMode('translation')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">平行移動</button>
            <button onClick={() => setMode('symmetryX')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">X軸対称</button>
            <button onClick={() => setMode('symmetryY')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Y軸対称</button>
        </div>
      )}
      <HintButton hints={[
        { step: 1, text: "y = f(x) を x 軸方向に p、y 軸方向に q だけ平行移動すると y - q = f(x - p) になります。" },
        { step: 2, text: "x 軸対称は y → -y、y 軸対称は x → -x、原点対称は (x,y) → (-x,-y) です。" },
        { step: 3, text: "頂点の移動を追跡すると変換が理解しやすくなります。" },
      ]} />
    
    </div>
  );
};

// Helper to format equation string for display
function formatEq(a: number, p: number, q: number): string {
    let s = "";
    if (a === -1) s += "-";
    else if (a !== 1) s += a;
    
    if (p === 0) s += "x²";
    else s += `(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})²`;
    
    if (q !== 0) s += ` ${q > 0 ? '+' : '-'} ${Math.abs(q)}`;
    return s || "0";
}

export default GraphTransformationViz;