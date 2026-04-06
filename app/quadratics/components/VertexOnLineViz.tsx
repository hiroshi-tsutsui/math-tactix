"use client";

import React, { useState } from "react";
import { BlockMath } from "react-katex";

export default function VertexOnLineViz() {
  const [p, setP] = useState(0);

  const q = 2 * p - 1;
  const targetX = 2;
  const targetY = 2;

  const width = 400;
  const height = 400;
  const scale = 30;
  const originX = width / 2;
  const originY = height / 2 + 50;

  const toX = (x: number) => originX + x * scale;
  const toY = (y: number) => originY - y * scale;

  const parabolaPoints = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = Math.pow(x - p, 2) + q;
    parabolaPoints.push(`${toX(x)},${toY(y)}`);
  }

  const linePoint1X = -10;
  const linePoint1Y = 2 * linePoint1X - 1;
  const linePoint2X = 10;
  const linePoint2Y = 2 * linePoint2X - 1;

  const currentYAt2 = Math.pow(2 - p, 2) + q;
  const isMatch = Math.abs(currentYAt2 - targetY) < 0.1;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">
        2次関数の決定 (頂点が直線上にある)
      </h3>

      <div className="mb-4">
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          条件: 「頂点が直線 <span className="font-mono bg-gray-100 px-1 rounded">y = 2x - 1</span> 上にあり、
          点 <span className="font-mono bg-gray-100 px-1 rounded">(2, 2)</span> を通る、
          <span className="font-mono bg-gray-100 px-1 rounded">x²</span> の係数が 1 の放物線を求めよ」
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="bg-gray-50 border rounded">
            {[...Array(21)].map((_, i) => {
              const val = i - 10;
              return (
                <g key={`grid-${i}`}>
                  <line x1={toX(val)} y1={0} x2={toX(val)} y2={height} stroke="#eee" strokeWidth="1" />
                  <line x1={0} y1={toY(val)} x2={width} y2={toY(val)} stroke="#eee" strokeWidth="1" />
                </g>
              );
            })}
            <line x1={0} y1={originY} x2={width} y2={originY} stroke="#333" strokeWidth="2" />
            <line x1={originX} y1={0} x2={originX} y2={height} stroke="#333" strokeWidth="2" />

            <circle cx={toX(targetX)} cy={toY(targetY)} r={5} fill={isMatch ? "#22c55e" : "#ef4444"} />
            <text x={toX(targetX) + 10} y={toY(targetY) - 10} fill={isMatch ? "#16a34a" : "#dc2626"} className="text-sm font-bold">
              (2, 2)
            </text>

            <line
              x1={toX(linePoint1X)}
              y1={toY(linePoint1Y)}
              x2={toX(linePoint2X)}
              y2={toY(linePoint2Y)}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x={toX(3)} y={toY(6)} fill="#64748b" className="text-xs">
              y = 2x - 1
            </text>

            <polyline
              points={parabolaPoints.join(" ")}
              fill="none"
              stroke={isMatch ? "#22c55e" : "#3b82f6"}
              strokeWidth="2"
            />

            <circle cx={toX(p)} cy={toY(q)} r={5} fill="#3b82f6" />
            <text x={toX(p) + 10} y={toY(q) + 20} fill="#2563eb" className="text-sm">
              ({p.toFixed(1)}, {q.toFixed(1)})
            </text>
          </svg>
        </div>

        <div className="w-full md:w-64 flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">頂点の x座標 (p) をスライド</h4>
            <input
              type="range"
              min="-2"
              max="4"
              step="0.1"
              value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full accent-blue-600 mb-2"
            />
            <div className="text-sm text-gray-700 font-mono">
              <p>p = {p.toFixed(1)}</p>
              <p>q = 2({p.toFixed(1)}) - 1 = {q.toFixed(1)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-bold text-gray-800 mb-2">現在の式</h4>
            <div className="text-sm">
              <BlockMath math={`y = (x - ${p >= 0 ? p.toFixed(1) : `(${p.toFixed(1)})`})^2 ${q >= 0 ? '+' : ''} ${q.toFixed(1)}`} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
              <p className="text-gray-600 mb-1">x=2 のときの y座標:</p>
              <p className={`font-bold font-mono ${isMatch ? "text-green-600" : "text-red-600"}`}>
                y = {currentYAt2.toFixed(2)}
              </p>
              {isMatch && (
                <p className="text-green-600 font-bold mt-2 animate-pulse">
                  ✅ 点(2,2)を通過！
                </p>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
            <strong>学習ポイント:</strong>
            <br />
            頂点が「直線 y = 2x - 1 上」にあるということは、頂点を <span className="font-mono">(p, q)</span> と置いたとき、代入して <span className="font-mono">q = 2p - 1</span> と表せるということです。
            これにより、未知数が p だけになります。
          </div>
        </div>
      </div>
    </div>
  );
}
