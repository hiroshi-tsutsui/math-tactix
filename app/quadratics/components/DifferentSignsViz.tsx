import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

export default function DifferentSignsViz() {
  const [m, setM] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Equation: x^2 + mx + (m - 2) = 0
  const a = 1;
  const b = m;
  const c = m - 2;

  const f = (x: number) => a * x * x + b * x + c;

  const discriminant = b * b - 4 * a * c;
  const f_zero = c; // f(0)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate system
    const scale = 40;
    const cx = width / 2;
    const cy = height / 2;

    const toScreen = (x: number, y: number): [number, number] => [cx + x * scale, cy - y * scale];

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) {
      ctx.beginPath();
      const [x1, y1] = toScreen(x, -10);
      const [x2, y2] = toScreen(x, 10);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    for (let y = -10; y <= 10; y++) {
      ctx.beginPath();
      const [x1, y1] = toScreen(-10, y);
      const [x2, y2] = toScreen(10, y);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Draw Parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px - cx) / scale;
      const y = f(x);
      const [, sy] = toScreen(x, y);
      if (px === 0) ctx.moveTo(px, sy);
      else ctx.lineTo(px, sy);
    }
    ctx.stroke();

    // Highlight y-intercept
    const [zx, zy] = toScreen(0, f_zero);
    ctx.fillStyle = f_zero < 0 ? '#22c55e' : '#ef4444';
    ctx.beginPath();
    ctx.arc(zx, zy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Label y-intercept
    ctx.fillStyle = '#0f172a';
    ctx.font = '14px sans-serif';
    ctx.fillText(`f(0) = ${f_zero.toFixed(1)}`, zx + 10, zy - 10);

    // Roots
    if (discriminant >= 0) {
      const root1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      
      const r1Screen = toScreen(root1, 0);
      const r2Screen = toScreen(root2, 0);
      
      ctx.fillStyle = root1 < 0 ? '#a855f7' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(r1Screen[0], r1Screen[1], 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = root2 > 0 ? '#a855f7' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(r2Screen[0], r2Screen[1], 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillText(`x1 = ${root1.toFixed(2)}`, r1Screen[0] - 20, r1Screen[1] - 15);
      ctx.fillText(`x2 = ${root2.toFixed(2)}`, r2Screen[0] - 20, r2Screen[1] - 15);
    }

  }, [m]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="flex-1">
        <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto bg-slate-50"
          />
        </div>
      </div>
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">異符号の解 (Roots with Different Signs)</h3>
          <p className="text-sm text-slate-600 mb-4">
            方程式: <code className="bg-white px-1 py-0.5 rounded border border-slate-200">x² + mx + (m - 2) = 0</code>
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">m の値</span>
                <span className="text-blue-600 font-bold">{m.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={m}
                onChange={(e) => setM(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-800 text-sm">条件チェック</h4>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center justify-between p-2 rounded ${f_zero < 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span>f(0) &lt; 0</span>
              <span className="font-bold">{f_zero < 0 ? '条件クリア' : 'NG'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${discriminant > 0 ? 'bg-slate-50 text-slate-600 border border-slate-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span>判別式 D &gt; 0</span>
              <span className="font-bold">常にクリア (冗長)</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              f(0) &lt; 0 であれば、頂点は必ずx軸より下にあるため、D &gt; 0 を調べる必要はありません。(冗長な条件)
            </p>
          </div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "異符号の2つの解を持つ条件は、f(0) < 0（解と係数の関係で αβ < 0）です。" },
        { step: 2, text: "f(0) = c/a < 0 が成り立てば、グラフは原点で x 軸の下にあり、必ず正と負の解を持ちます。" },
        { step: 3, text: "この場合、D > 0 は自動的に満たされるので、別途確認する必要はありません。" },
      ]} />
    </div>
    </div>
  );
}
