"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
export default function MaxMinCoefficientDeterminationViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  // Function y = a(x - 2)^2 + b - 4a
  // Domain 0 <= x <= 3
  // Vertex at x = 2
  // f(0) = b
  // f(2) = b - 4a
  // f(3) = b - 3a

  const f = (x: number) => a * (x * x - 4 * x) + b;
  const f_0 = b;
  const f_2 = b - 4 * a;

  const currentMax = a > 0 ? f_0 : f_2;
  const currentMin = a > 0 ? f_2 : f_0;

  const targetMax = 5;
  const targetMin = 1;

  const isMatched = currentMax === targetMax && currentMin === targetMin;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl shadow-2xl space-y-6 max-w-4xl mx-auto text-white">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          最大・最小から係数決定 (Determining Coefficients from Max/Min)
        </h2>
        <p className="text-gray-300">
          関数 <MathDisplay tex="f(x) = ax^2 - 4ax + b \ (0 \le x \le 3)" /> の最大値が5、最小値が1となるように、定数 <MathDisplay tex="a, b" /> の値を定めよ。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Graph Area */}
        <div className="relative w-full aspect-square bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center">
          <svg viewBox="-1 -4 5 12" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid & Axes */}
            <g className="text-gray-600" stroke="currentColor" strokeWidth="0.02">
              {[0, 1, 2, 3, 4].map((x) => (
                <line key={`x-${x}`} x1={x} y1="-4" x2={x} y2="8" />
              ))}
              {[-2, 0, 2, 4, 6, 8].map((y) => (
                <line key={`y-${y}`} x1="-1" y1={y} x2="4" y2={y} />
              ))}
              <line x1="-1" y1="0" x2="4" y2="0" stroke="white" strokeWidth="0.04" />
              <line x1="0" y1="-4" x2="0" y2="8" stroke="white" strokeWidth="0.04" />
            </g>

            {/* Target Max / Min lines */}
            <line x1="-1" y1={-targetMax} x2="4" y2={-targetMax} stroke="red" strokeWidth="0.04" strokeDasharray="0.1,0.1" />
            <line x1="-1" y1={-targetMin} x2="4" y2={-targetMin} stroke="blue" strokeWidth="0.04" strokeDasharray="0.1,0.1" />
            <text x="3.5" y={-targetMax - 0.2} fill="red" fontSize="0.3">Max=5</text>
            <text x="3.5" y={-targetMin - 0.2} fill="blue" fontSize="0.3">Min=1</text>

            {/* Domain Box */}
            <rect x="0" y="-4" width="3" height="12" fill="rgba(255, 255, 255, 0.05)" />
            <line x1="0" y1="-4" x2="0" y2="8" stroke="gray" strokeWidth="0.05" strokeDasharray="0.1,0.1" />
            <line x1="3" y1="-4" x2="3" y2="8" stroke="gray" strokeWidth="0.05" strokeDasharray="0.1,0.1" />

            {/* Axis of Symmetry */}
            <line x1="2" y1="-4" x2="2" y2="8" stroke="yellow" strokeWidth="0.04" strokeDasharray="0.2,0.1" />

            {/* Parabola */}
            <path
              d={`M ${Array.from({ length: 50 }, (_, i) => {
                const x = -0.5 + (4.5 * i) / 49;
                return `${x} ${-f(x)}`;
              }).join(" L ")}`}
              fill="none"
              stroke="gray"
              strokeWidth="0.03"
            />

            {/* Domain Parabola */}
            <path
              d={`M ${Array.from({ length: 50 }, (_, i) => {
                const x = 0 + (3 * i) / 49;
                return `${x} ${-f(x)}`;
              }).join(" L ")}`}
              fill="none"
              stroke={isMatched ? "#4ADE80" : "#A78BFA"}
              strokeWidth="0.08"
            />

            {/* Current Max/Min points */}
            {a !== 0 && (
              <>
                <circle cx={a > 0 ? 0 : 2} cy={a > 0 ? -f_0 : -f_2} r="0.15" fill="red" />
                <circle cx={a > 0 ? 2 : 0} cy={a > 0 ? -f_2 : -f_0} r="0.15" fill="blue" />
              </>
            )}
          </svg>
        </div>

        {/* Controls Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">パラメータ操作</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm">
                <span>係数 <MathDisplay tex="a" /> (開き具合・向き): {a.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              {a === 0 && <p className="text-red-400 text-xs mt-1">※ a=0 だと2次関数になりません</p>}
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm">
                <span>係数 <MathDisplay tex="b" /> (y切片): {b.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="-5"
                max="10"
                step="1"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">現在の状態</h3>
            <div className="text-sm space-y-1">
              <p>軸は常に <MathDisplay tex="x=2" /> (定義域内)</p>
              {a > 0 && (
                <div className="text-green-300">
                  <p>【<MathDisplay tex="a > 0" /> の場合】</p>
                  <p>下に凸なので、頂点 <MathDisplay tex="x=2" /> で最小、軸から遠い <MathDisplay tex="x=0" /> で最大。</p>
                  <p>最大値: <MathDisplay tex="f(0) = b" /> = {f_0.toFixed(1)}</p>
                  <p>最小値: <MathDisplay tex="f(2) = b - 4a" /> = {f_2.toFixed(1)}</p>
                </div>
              )}
              {a < 0 && (
                <div className="text-yellow-300">
                  <p>【<MathDisplay tex="a < 0" /> の場合】</p>
                  <p>上に凸なので、頂点 <MathDisplay tex="x=2" /> で最大、軸から遠い <MathDisplay tex="x=0" /> で最小。</p>
                  <p>最大値: <MathDisplay tex="f(2) = b - 4a" /> = {f_2.toFixed(1)}</p>
                  <p>最小値: <MathDisplay tex="f(0) = b" /> = {f_0.toFixed(1)}</p>
                </div>
              )}
            </div>
          </div>

          <motion.div
            className={`p-4 rounded-lg text-center font-bold ${
              isMatched ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
            }`}
            animate={{ scale: isMatched ? [1, 1.05, 1] : 1 }}
          >
            {isMatched ? "条件クリア！定数が決定しました" : "ターゲットの最大値・最小値に合わせてください"}
          </motion.div>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "定義域内の最大値・最小値が与えられたとき、係数 a, b を連立方程式で求めます。" },
        { step: 2, text: "a > 0 なら頂点で最小値、端点で最大値。a < 0 なら逆です。" },
        { step: 3, text: "最大値と最小値の条件から a, b の連立方程式を立てて解きます。" },
      ]} />
    </div>
    </div>
  );
}
