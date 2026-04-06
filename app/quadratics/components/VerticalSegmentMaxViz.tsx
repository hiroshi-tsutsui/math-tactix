"use client";

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import MathDisplay from '@/app/lib/components/MathDisplay';

export default function VerticalSegmentMaxViz() {
  const [t, setT] = useState(1.5); // x-coordinate
  const a = -1, b = 4, c = 0; // Parabola y = -x^2 + 4x
  const m = 1, n = 0; // Line y = x
  const domain = [0, 3]; // Intersections at x=0 and x=3

  const getP = (x: number) => a * x * x + b * x + c;
  const getL = (x: number) => m * x + n;
  
  const width = 400;
  const height = 400;
  
  const mapX = (x: number) => (x + 1) * (width / 5);
  const mapY = (y: number) => height - (y + 1) * (height / 6);
  
  const yP = getP(t);
  const yL = getL(t);
  const diff = yP - yL;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          放物線と直線の間の線分の長さの最大値
        </h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          放物線 <MathDisplay tex="y = -x^2 + 4x" /> と直線 <MathDisplay tex="y = x" /> の間にある、
          y軸に平行な線分PQの長さを最大にする <MathDisplay tex="x" /> の値を視覚的に確認します。
          区間は <MathDisplay tex="0 \le x \le 3" /> です。
        </p>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              x座標: <MathDisplay tex={`t = ${t.toFixed(2)}`} />
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={t}
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="text-sm text-slate-700 bg-white p-3 rounded shadow-sm">
            <p className="mb-2">線分の長さ <MathDisplay tex="L" /> は、上の関数から下の関数を引くことで求まります。</p>
            <MathDisplay tex={`L = (-t^2 + 4t) - (t) = -t^2 + 3t`} displayMode />
            <MathDisplay tex={`L = -(t - 1.5)^2 + 2.25`} displayMode />
            <p className="mt-2 text-center text-blue-600 font-bold">
              現在の長さ: {diff.toFixed(2)}
              {Math.abs(t - 1.5) < 0.01 && " (最大値！)"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden" style={{ minHeight: "400px" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines and axes */}
          <line x1="0" y1={mapY(0)} x2={width} y2={mapY(0)} stroke="#ccc" strokeWidth="2" />
          <line x1={mapX(0)} y1="0" x2={mapX(0)} y2={height} stroke="#ccc" strokeWidth="2" />

          {/* Line y = x */}
          <line
            x1={mapX(-1)} y1={mapY(getL(-1))}
            x2={mapX(4)} y2={mapY(getL(4))}
            stroke="#94a3b8" strokeWidth="2"
          />

          {/* Parabola */}
          <path
            d={`M ${Array.from({length: 50}).map((_, i) => {
              const x = -1 + (i / 49) * 5;
              return `${mapX(x)},${mapY(getP(x))}`;
            }).join(" L ")}`}
            fill="none" stroke="#3b82f6" strokeWidth="3"
          />
          
          {/* Vertical Segment */}
          <line
            x1={mapX(t)} y1={mapY(yP)}
            x2={mapX(t)} y2={mapY(yL)}
            stroke="#ef4444" strokeWidth="4"
          />
          
          <circle cx={mapX(t)} cy={mapY(yP)} r="5" fill="#3b82f6" />
          <circle cx={mapX(t)} cy={mapY(yL)} r="5" fill="#ef4444" />
          
          <text x={mapX(t) + 10} y={mapY(yP) - 10} fontSize="14" fill="#3b82f6">P</text>
          <text x={mapX(t) + 10} y={mapY(yL) + 20} fontSize="14" fill="#ef4444">Q</text>
        </svg>
      </div>
    </div>
  );
}
