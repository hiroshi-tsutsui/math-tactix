"use client";

import React, { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import HintButton from '../../components/HintButton';

const LinearEquationCasesViz = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);

  // SVG dimensions
  const width = 600;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 30; // 1 unit = 30px

  // Graph y = ax
  const line1y1 = cy - (a * (-cx / scale)) * scale;
  const line1y2 = cy - (a * (cx / scale)) * scale;

  // Graph y = b
  const line2y = cy - b * scale;

  // Intersection
  let intersectionX = null;
  let statusText = "";
  let statusColor = "";

  if (a !== 0) {
    intersectionX = b / a;
    statusText = `ただ1つの解をもつ: x = ${intersectionX.toFixed(2)}`;
    statusColor = "text-green-500";
  } else if (a === 0 && b === 0) {
    statusText = "無数の解をもつ (すべての実数)";
    statusColor = "text-purple-500";
  } else if (a === 0 && b !== 0) {
    statusText = "解はない (不能)";
    statusColor = "text-red-500";
  }

  return (
    <div className="flex flex-col items-center p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-700 w-full max-w-4xl">
      <h3 className="text-xl font-bold text-white mb-2">1次方程式 ax = b の解の分類</h3>
      <p className="text-slate-400 mb-6 text-sm">
        「<InlineMath math="a" /> で割る」前に、<InlineMath math="a=0" /> の場合をチェック！グラフで交点を確認しよう。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center">
          <div className="mb-6">
            <label className="text-slate-300 text-sm font-semibold mb-2 block">
              傾き <InlineMath math="a" /> : {a}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>-5</span>
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-slate-300 text-sm font-semibold mb-2 block">
              高さ <InlineMath math="b" /> : {b}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>-5</span>
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded border border-slate-700">
            <div className="text-center mb-3 text-lg">
              <InlineMath math={`{${a}}x = {${b}}`} />
            </div>
            <div className={`text-center font-bold text-xl ${statusColor}`}>
              {statusText}
            </div>
            
            <div className="mt-4 text-slate-400 text-sm">
              {a !== 0 && (
                <p>傾きがある (<InlineMath math="a \neq 0" />) ため、必ず1点で交わります。</p>
              )}
              {a === 0 && b === 0 && (
                <p>2つの直線が完全に重なるため、交点は無数にあります（すべてのxが解）。</p>
              )}
              {a === 0 && b !== 0 && (
                <p>2つの直線は平行で決して交わらないため、解はありません。</p>
              )}
            </div>
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="relative bg-slate-950 rounded-lg border border-slate-700 overflow-hidden flex justify-center items-center">
          <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Grid */}
            {[...Array(21)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1="0" y1={i * scale + cy % scale} x2={width} y2={i * scale + cy % scale} stroke="#1e293b" strokeWidth="1" />
                <line x1={i * scale + cx % scale} y1="0" x2={i * scale + cx % scale} y2={height} stroke="#1e293b" strokeWidth="1" />
              </React.Fragment>
            ))}

            {/* Axes */}
            <line x1="0" y1={cy} x2={width} y2={cy} stroke="#475569" strokeWidth="2" />
            <line x1={cx} y1="0" x2={cx} y2={height} stroke="#475569" strokeWidth="2" />

            {/* y = b (red line) */}
            <line x1="0" y1={line2y} x2={width} y2={line2y} stroke="#ef4444" strokeWidth="3" opacity="0.8" />
            <text x={10} y={line2y - 10} fill="#ef4444" fontSize="16" fontWeight="bold">y = {b}</text>

            {/* y = ax (blue line) */}
            {a === 0 ? (
               <line x1="0" y1={cy} x2={width} y2={cy} stroke="#3b82f6" strokeWidth="4" opacity="0.8" />
            ) : (
               <line x1="0" y1={line1y1} x2={width} y2={line1y2} stroke="#3b82f6" strokeWidth="3" opacity="0.8" />
            )}
            {a !== 0 && (
               <text x={cx + 30} y={cy - (a * 1) * scale - 10} fill="#3b82f6" fontSize="16" fontWeight="bold">y = {a}x</text>
            )}

            {/* Intersection Point */}
            {intersectionX !== null && (
              <>
                <circle cx={cx + intersectionX * scale} cy={line2y} r="6" fill="#22c55e" />
                <line 
                  x1={cx + intersectionX * scale} y1={cy} 
                  x2={cx + intersectionX * scale} y2={line2y} 
                  stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" 
                />
                <text 
                  x={cx + intersectionX * scale} 
                  y={cy + (line2y > cy ? -10 : 20)} 
                  fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle"
                >
                  {intersectionX.toFixed(1)}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "ax = b の形の方程式は、a の値によって解の個数が変わります。" },
        { step: 2, text: "a ≠ 0 なら x = b/a で一意の解があります。" },
        { step: 3, text: "a = 0 かつ b = 0 なら 0 = 0 となり、任意の x が解（不定）です。" },
        { step: 4, text: "a = 0 かつ b ≠ 0 なら 0 = b（矛盾）となり、解なし（不能）です。" }
      ]} />
    </div>
  );
};

export default LinearEquationCasesViz;
