import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AbsoluteInequalityViz() {
  const [m, setM] = useState<number>(0);

  // Function: f(x) = x^2 - 2mx + m + 2
  // D/4 = m^2 - (m + 2) = m^2 - m - 2
  const d4 = m * m - m - 2;
  const isAllPositive = d4 < 0;

  // Vertex: x = m, y = m + 2 - m^2 = -d4
  const vertexX = m;
  const vertexY = -d4;

  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height - 100; // x-axis at bottom
  const scale = 20;

  // Generate SVG path for parabola
  let path = '';
  for (let x = -10; x <= 10; x += 0.5) {
    const y = x * x - 2 * m * x + (m + 2);
    const px = centerX + x * scale;
    const py = centerY - y * scale;
    if (x === -10) path += `M ${px} ${py} `;
    else path += `L ${px} ${py} `;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">すべての実数で成り立つ2次不等式 (絶対不等式)</h3>
      <p className="text-sm text-slate-600 mb-4">
        不等式 <span className="font-mono bg-slate-100 px-1 rounded">x² - 2mx + m + 2 &gt; 0</span> がすべての実数 <span className="italic">x</span> で成り立つような定数 <span className="italic">m</span> の値の範囲を求めます。
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 relative overflow-hidden" style={{ height: 300 }}>
            <svg width={width} height={height} className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
              {/* Grid */}
              <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="#94a3b8" strokeWidth={2} />
              <line x1={centerX} y1={0} x2={centerX} y2={height} stroke="#94a3b8" strokeWidth={2} />
              <text x={width - 15} y={centerY + 15} fontSize={12} fill="#64748b">x</text>
              <text x={centerX + 5} y={15} fontSize={12} fill="#64748b">y</text>
              
              {/* Green zone for target (above x axis) */}
              <rect x={0} y={0} width={width} height={centerY} fill="rgba(34, 197, 94, 0.05)" />

              {/* Parabola */}
              <motion.path
                d={path}
                fill="none"
                stroke={isAllPositive ? "#22c55e" : "#3b82f6"}
                strokeWidth={3}
                animate={{ d: path }}
                transition={{ duration: 0.1 }}
              />

              {/* Vertex */}
              <motion.circle
                cx={centerX + vertexX * scale}
                cy={centerY - vertexY * scale}
                r={4}
                fill={isAllPositive ? "#16a34a" : "#2563eb"}
                animate={{ cx: centerX + vertexX * scale, cy: centerY - vertexY * scale }}
                transition={{ duration: 0.1 }}
              />
            </svg>
            
            <div className="absolute top-2 left-2 bg-white/90 p-2 rounded shadow text-xs font-mono">
              f(x) = x² - 2({m.toFixed(1)})x + {m.toFixed(1)} + 2
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              パラメータ m: {m.toFixed(1)}
            </label>
            <input
              type="range"
              min="-4"
              max="5"
              step="0.1"
              value={m}
              onChange={(e) => setM(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>-4</span>
              <span>5</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">判定条件</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">判別式 D/4</span>
                <span className={`font-mono font-bold ${d4 < 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {d4.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                D/4 = m² - m - 2<br />
                = (m-2)(m+1)
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border flex items-center justify-center text-center font-bold text-sm ${isAllPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {isAllPositive ? (
              <div>
                <span className="block text-lg mb-1">条件クリア</span>
                グラフが常にx軸より上にある<br />(-1 &lt; m &lt; 2)
              </div>
            ) : (
              <div>
                <span className="block text-lg mb-1">条件不成立</span>
                グラフがx軸と交わる、または下にある
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
