import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DomainAlwaysPositiveViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(1);
  const [mode, setMode] = useState<'positive' | 'negative'>('positive');
  
  // f(x) = x^2 - 2ax + a + 2 for positive mode
  // f(x) = -x^2 + 2ax - a - 2 for negative mode
  // Domain: 0 <= x <= 2
  const domainStart = 0;
  const domainEnd = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Transform coordinates
    // x: -2 to 4 (range 6), y: -4 to 6 (range 10)
    const mapX = (x: number) => (x + 2) * (width / 6);
    const mapY = (y: number) => height - (y + 4) * (height / 10);
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mapY(0));
    ctx.lineTo(width, mapY(0));
    ctx.moveTo(mapX(0), 0);
    ctx.lineTo(mapX(0), height);
    ctx.stroke();

    // Draw domain
    ctx.fillStyle = mode === 'positive' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    ctx.fillRect(mapX(domainStart), 0, mapX(domainEnd) - mapX(domainStart), height);
    
    // Draw domain boundaries
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(mapX(domainStart), 0);
    ctx.moveTo(mapX(domainStart), height);
    ctx.moveTo(mapX(domainEnd), 0);
    ctx.moveTo(mapX(domainEnd), height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw target region (above or below x-axis)
    ctx.fillStyle = mode === 'positive' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    if (mode === 'positive') {
      ctx.fillRect(mapX(domainStart), 0, mapX(domainEnd) - mapX(domainStart), mapY(0));
    } else {
      ctx.fillRect(mapX(domainStart), mapY(0), mapX(domainEnd) - mapX(domainStart), height - mapY(0));
    }

    // Graph function
    const f = (x: number) => mode === 'positive' 
      ? Math.pow(x, 2) - 2 * a * x + a + 2
      : -Math.pow(x, 2) + 2 * a * x - a - 2;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = px / (width / 6) - 2;
      const y = f(x);
      if (px === 0) ctx.moveTo(px, mapY(y));
      else ctx.lineTo(px, mapY(y));
    }
    ctx.stroke();

    // Highlight part in domain
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let px = mapX(domainStart); px <= mapX(domainEnd); px += 2) {
      const x = px / (width / 6) - 2;
      const y = f(x);
      if (px === mapX(domainStart)) ctx.moveTo(px, mapY(y));
      else ctx.lineTo(px, mapY(y));
    }
    ctx.stroke();

    // Draw min/max point in domain
    let criticalX = a;
    if (criticalX < domainStart) criticalX = domainStart;
    if (criticalX > domainEnd) criticalX = domainEnd;
    
    const criticalY = f(criticalX);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(mapX(criticalX), mapY(criticalY), 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw axis of symmetry
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mapX(a), 0);
    ctx.lineTo(mapX(a), height);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [a, mode]);

  const f = (x: number) => mode === 'positive' 
    ? Math.pow(x, 2) - 2 * a * x + a + 2
    : -Math.pow(x, 2) + 2 * a * x - a - 2;

  let criticalX = a;
  let caseName = "";
  if (a < 0) { criticalX = 0; caseName = "軸 < 0 (左側)"; }
  else if (a > 2) { criticalX = 2; caseName = "軸 > 2 (右側)"; }
  else { criticalX = a; caseName = "0 ≦ 軸 ≦ 2 (区間内)"; }

  const criticalY = f(criticalX);
  const isSatisfied = mode === 'positive' ? criticalY > 0 : criticalY < 0;

  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-800">特定の区間で常に正・負となる条件</h3>
        <p className="text-slate-600 text-sm">
          定義域 <span className="font-semibold px-1">0 ≦ x ≦ 2</span> において、関数が常に{mode === 'positive' ? '正 (&gt; 0)' : '負 (< 0)'}となる条件を考えます。
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('positive')}
          className={`px-4 py-2 rounded-md font-bold transition-colors ${mode === 'positive' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          常に正 (&gt; 0)
        </button>
        <button
          onClick={() => setMode('negative')}
          className={`px-4 py-2 rounded-md font-bold transition-colors ${mode === 'negative' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          常に負 (&lt; 0)
        </button>
      </div>

      <div className="relative w-full aspect-video bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full"
        />
        
        {/* Absolute visual OK/NG Badge */}
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold shadow-sm ${
          isSatisfied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {isSatisfied ? '条件クリア ✓' : '条件未達 ✗'}
        </div>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>軸の位置: x = {a.toFixed(2)}</span>
            <span className="text-slate-500">パラメーター a</span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="3.5"
            step="0.1"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-2">現在の状況</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>関数: {mode === 'positive' ? 'f(x) = x² - 2ax + a + 2' : 'f(x) = -x² + 2ax - a - 2'}</p>
              <p>軸の位置: <span className="font-mono bg-white px-1 border border-slate-200 rounded">x = {a.toFixed(1)}</span></p>
              <p className="font-semibold text-blue-700 mt-2">
                場合分け: {caseName}
              </p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${isSatisfied ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className={`font-bold mb-2 border-b pb-2 ${isSatisfied ? 'text-green-800 border-green-200' : 'text-red-800 border-red-200'}`}>
              {mode === 'positive' ? '最小値' : '最大値'}のチェック
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>区間内での{mode === 'positive' ? '最小' : '最大'}値は x = {criticalX.toFixed(1)} のとき</p>
              <p>値 = <span className="font-mono bg-white px-1 border border-slate-200 rounded">{criticalY.toFixed(2)}</span></p>
              <p className={`font-bold mt-2 ${isSatisfied ? 'text-green-600' : 'text-red-600'}`}>
                {mode === 'positive' ? '最小値 &gt; 0' : '最大値 &lt; 0'} {isSatisfied ? 'を満たしている' : 'を満たしていない'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainAlwaysPositiveViz;
