'use client';

import React, { useRef, useEffect, useState } from 'react';

const GraphTransformationViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [p, setP] = useState(0); // Horizontal shift
  const [q, setQ] = useState(0); // Vertical shift
  const [mode, setMode] = useState<'translation' | 'symmetryX' | 'symmetryY' | 'symmetryOrigin'>('translation');

  // Reset shifts when mode changes
  useEffect(() => {
    if (mode !== 'translation') {
      setP(0);
      setQ(0);
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Constants
    const width = canvas.width;
    const height = canvas.height;
    const scale = 40; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -10; x <= 10; x++) {
      ctx.moveTo(centerX + x * scale, 0);
      ctx.lineTo(centerX + x * scale, height);
    }
    for (let y = -10; y <= 10; y++) {
      ctx.moveTo(0, centerY - y * scale);
      ctx.lineTo(width, centerY - y * scale);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY); // X-axis
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height); // Y-axis
    ctx.stroke();

    // Base Function: y = x^2 (Dotted Gray)
    ctx.strokeStyle = '#9ca3af';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      const y = x * x; // Base function
      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Transformed Function (Solid Blue/Red)
    ctx.strokeStyle = mode === 'translation' ? '#2563eb' : '#ef4444'; // Blue for move, Red for flip
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      let y = 0;

      switch (mode) {
        case 'translation':
          y = Math.pow(x - p, 2) + q;
          break;
        case 'symmetryX': // y -> -y
          y = -(x * x);
          break;
        case 'symmetryY': // x -> -x
          y = Math.pow(-x, 2);
          break;
        case 'symmetryOrigin': // x -> -x, y -> -y
          y = -(Math.pow(-x, 2));
          break;
      }

      const py = centerY - y * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Vertex Point
    let vertexX = 0;
    let vertexY = 0;
    
    if (mode === 'translation') {
      vertexX = p;
      vertexY = q;
    } else if (mode === 'symmetryX' || mode === 'symmetryOrigin') {
      vertexX = 0;
      vertexY = 0; // Simplified for base x^2
    }

    const vPx = centerX + vertexX * scale;
    const vPy = centerY - vertexY * scale;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(vPx, vPy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label Vertex
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px sans-serif';
    const label = `(${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`;
    ctx.fillText(label, vPx + 10, vPy - 10);

  }, [p, q, mode]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800">
        {mode === 'translation' ? '平行移動 (Translation)' : '対称移動 (Symmetry)'}
      </h3>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('translation')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'translation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          平行移動
        </button>
        <button
          onClick={() => setMode('symmetryX')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'symmetryX' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          X軸対称
        </button>
        <button
          onClick={() => setMode('symmetryY')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'symmetryY' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Y軸対称
        </button>
        <button
          onClick={() => setMode('symmetryOrigin')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'symmetryOrigin' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          原点対称
        </button>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="border border-gray-200 rounded-lg bg-gray-50"
        />
        
        {/* Equation Display Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded shadow border border-blue-100">
          <p className="text-lg font-mono text-blue-800">
            {mode === 'translation' && `y = (x - ${p.toFixed(1)})² + ${q.toFixed(1)}`}
            {mode === 'symmetryX' && `y = -x²`}
            {mode === 'symmetryY' && `y = (-x)² = x²`}
            {mode === 'symmetryOrigin' && `y = -(-x)² = -x²`}
          </p>
        </div>
      </div>

      {/* Controls for Translation */}
      {mode === 'translation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-lg">
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-700">
              <span>X軸方向 (p): {p}</span>
            </label>
            <input 
              type="range" 
              min="-5" max="5" step="0.5" 
              value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-700">
              <span>Y軸方向 (q): {q}</span>
            </label>
            <input 
              type="range" 
              min="-5" max="5" step="0.5" 
              value={q}
              onChange={(e) => setQ(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}

      {/* Explanation Text */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 max-w-2xl">
        <p className="font-bold mb-1">💡 ポイント</p>
        {mode === 'translation' && (
          <ul className="list-disc list-inside space-y-1">
            <li>頂点が <span className="font-mono">(0, 0)</span> から <span className="font-mono">({p}, {q})</span> に移動します。</li>
            <li>式は <span className="font-mono">x</span> の代わりに <span className="font-mono">(x - p)</span>、<span className="font-mono">y</span> の代わりに <span className="font-mono">(y - q)</span> を代入した形になります。</li>
            <li><span className="font-bold text-red-600">注意:</span> x軸方向の移動は、式の中では符号が逆になります！ (例: 右に3移動 → <span className="font-mono">(x - 3)</span>)</li>
          </ul>
        )}
        {mode === 'symmetryX' && (
          <p>X軸に対称移動すると、y座標の符号が逆転します。<br/>式: <span className="font-mono">y → -y</span> なので <span className="font-mono">-y = x² ⇔ y = -x²</span></p>
        )}
        {mode === 'symmetryY' && (
          <p>Y軸に対称移動すると、x座標の符号が逆転します。<br/>式: <span className="font-mono">x → -x</span> なので <span className="font-mono">y = (-x)² = x²</span> (元のグラフと重なります)</p>
        )}
        {mode === 'symmetryOrigin' && (
          <p>原点に対称移動すると、xとy両方の符号が逆転します。<br/>式: <span className="font-mono">x → -x, y → -y</span> なので <span className="font-mono">-y = (-x)² ⇔ y = -x²</span></p>
        )}
      </div>
    </div>
  );
};

export default GraphTransformationViz;