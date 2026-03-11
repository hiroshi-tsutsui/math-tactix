'use client';

import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';

const InscribedPerimeterViz: React.FC = () => {
  const [t, setT] = useState(1);
  const [data, setData] = useState<any[]>([]);

  // The parabola is y = 4 - x^2
  // Domain for t is 0 < t < 2

  // For the Canvas logic
  const width = 400;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Scale functions
  const xMin = -3, xMax = 3;
  const yMin = -1, yMax = 5;

  const scaleX = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * graphWidth;
  const scaleY = (y: number) => height - margin.bottom - ((y - yMin) / (yMax - yMin)) * graphHeight;

  // Perimeter calculation
  const rectWidth = 2 * t;
  const rectHeight = 4 - t * t;
  const perimeter = 2 * (rectWidth + rectHeight);

  // Parabola Path
  let parabolaPath = '';
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = 4 - x * x;
    if (x === xMin) {
      parabolaPath += `M ${scaleX(x)} ${scaleY(y)} `;
    } else {
      parabolaPath += `L ${scaleX(x)} ${scaleY(y)} `;
    }
  }

  // Rectangle points
  const p1 = { x: t, y: 0 };
  const p2 = { x: t, y: rectHeight };
  const p3 = { x: -t, y: rectHeight };
  const p4 = { x: -t, y: 0 };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">放物線に内接する長方形の周の長さ</h3>
        <p className="text-sm text-gray-600">
          放物線 <InlineMath math="y = 4 - x^2" /> と x軸で囲まれた部分に内接する長方形の周の長さの最大値を求めます。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* SVG Graph */}
        <div className="w-full md:w-1/2 flex justify-center">
          <svg width={width} height={height} className="bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
            {/* Grid */}
            <g stroke="#e2e8f0" strokeWidth="1">
              {[-2, -1, 1, 2].map(x => (
                <line key={`vx-${x}`} x1={scaleX(x)} y1={margin.top} x2={scaleX(x)} y2={height - margin.bottom} />
              ))}
              {[1, 2, 3, 4].map(y => (
                <line key={`hy-${y}`} x1={margin.left} y1={scaleY(y)} x2={width - margin.right} y2={scaleY(y)} />
              ))}
            </g>

            {/* Axes */}
            <line x1={margin.left} y1={scaleY(0)} x2={width - margin.right} y2={scaleY(0)} stroke="#000" strokeWidth="2" />
            <line x1={scaleX(0)} y1={margin.top} x2={scaleX(0)} y2={height - margin.bottom} stroke="#000" strokeWidth="2" />

            {/* Parabola */}
            <path d={parabolaPath} fill="none" stroke="#3b82f6" strokeWidth="3" />

            {/* Inscribed Rectangle */}
            {t > 0 && t < 2 && (
              <polygon 
                points={`
                  ${scaleX(p1.x)},${scaleY(p1.y)} 
                  ${scaleX(p2.x)},${scaleY(p2.y)} 
                  ${scaleX(p3.x)},${scaleY(p3.y)} 
                  ${scaleX(p4.x)},${scaleY(p4.y)}
                `}
                fill="#fde047" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="2"
              />
            )}

            {/* Points & Labels */}
            <circle cx={scaleX(p2.x)} cy={scaleY(p2.y)} r="4" fill="#ef4444" />
            <text x={scaleX(p2.x) + 10} y={scaleY(p2.y) - 10} fontSize="12" fill="#ef4444" fontWeight="bold">
              P(t, 4-t²)
            </text>
            <text x={scaleX(p1.x) + 5} y={scaleY(p1.y) + 20} fontSize="12" fill="#666">t</text>
            <text x={scaleX(p4.x) - 15} y={scaleY(p4.y) + 20} fontSize="12" fill="#666">-t</text>
            <text x={scaleX(0) - 15} y={scaleY(4) - 10} fontSize="12" fill="#3b82f6">4</text>
          </svg>
        </div>

        {/* Controls and Math */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              点Pのx座標 t: <span className="text-blue-600">{t.toFixed(2)}</span>
            </label>
            <input 
              type="range" min="0.01" max="1.99" step="0.01" 
              value={t} onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0</span>
              <span>2</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-2">周の長さ L の計算</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>長方形の横の長さ: <InlineMath math="2t" /> ({rectWidth.toFixed(2)})</p>
              <p>長方形の縦の長さ: <InlineMath math="4 - t^2" /> ({rectHeight.toFixed(2)})</p>
              <div className="bg-white p-2 rounded border border-blue-100 overflow-x-auto text-center">
                <BlockMath math={`L = 2(2t + 4 - t^2)`} />
                <BlockMath math={`L = -2t^2 + 4t + 8`} />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border space-y-2 transition-colors duration-300 ${Math.abs(t - 1) < 0.05 ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-slate-200'}`}>
            <h4 className="font-bold text-gray-800">平方完成による最大値</h4>
            <div className="text-sm text-gray-700 overflow-x-auto text-center">
              <BlockMath math={`L = -2(t^2 - 2t) + 8`} />
              <BlockMath math={`L = -2(t - 1)^2 + 10`} />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              定義域 <InlineMath math="0 < t < 2" /> において、
              t = <span className="font-bold text-red-500">1</span> のとき、
              最大値 <span className="font-bold text-red-500">10</span> となる。
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                現在の L = {perimeter.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribedPerimeterViz;
