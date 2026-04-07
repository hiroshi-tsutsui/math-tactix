"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import HintButton from '../../components/HintButton';

export default function ReciprocalSymmetricViz() {
  const [xValue, setXValue] = useState(2);

  // Constants for visual scaling (using a fixed base scale to represent areas)
  // Instead of dynamic area scaling which might be visually unstable, we can use a stable 
  // visualization where the length is x and height is 1/x for the rectangles
  // But for the formula (x + 1/x)^2, it's a square of side length (x + 1/x).
  
  const baseScale = 50; 
  const xLength = xValue * baseScale;
  const invLength = (1 / xValue) * baseScale * 4; // Multiplied by 4 just for visual visibility at higher x

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4">
      <div className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          <InlineMath math="(x + \frac{1}{x})^2" /> の展開面積
        </h3>
        
        <div className="relative border-4 border-gray-800 bg-white" 
             style={{ width: xLength + invLength, height: xLength + invLength }}>
          
          {/* Top-Left: x^2 */}
          <motion.div 
            className="absolute top-0 left-0 bg-blue-100 border-2 border-blue-500 flex items-center justify-center overflow-hidden"
            style={{ width: xLength, height: xLength }}
            layout
          >
            <span className="text-blue-700 font-bold text-xl"><InlineMath math="x^2" /></span>
          </motion.div>
          
          {/* Top-Right: x * 1/x */}
          <motion.div 
            className="absolute top-0 flex items-center justify-center bg-yellow-100 border-2 border-yellow-500 overflow-hidden"
            style={{ left: xLength, width: invLength, height: xLength }}
            layout
          >
            <span className="text-yellow-700 font-bold whitespace-nowrap"><InlineMath math="1" /></span>
          </motion.div>
          
          {/* Bottom-Left: 1/x * x */}
          <motion.div 
            className="absolute left-0 flex items-center justify-center bg-yellow-100 border-2 border-yellow-500 overflow-hidden"
            style={{ top: xLength, width: xLength, height: invLength }}
            layout
          >
            <span className="text-yellow-700 font-bold whitespace-nowrap"><InlineMath math="1" /></span>
          </motion.div>

          {/* Bottom-Right: (1/x)^2 */}
          <motion.div 
            className="absolute flex items-center justify-center bg-green-100 border-2 border-green-500 overflow-hidden"
            style={{ top: xLength, left: xLength, width: invLength, height: invLength }}
            layout
          >
            <span className="text-green-700 font-bold text-sm"><InlineMath math="\frac{1}{x^2}" /></span>
          </motion.div>
          
          {/* Side Labels */}
          <div className="absolute -top-6 left-0 text-center text-gray-600 font-bold" style={{ width: xLength }}>
            <InlineMath math="x" />
          </div>
          <div className="absolute -top-6 text-center text-gray-600 font-bold" style={{ left: xLength, width: invLength }}>
            <InlineMath math="\frac{1}{x}" />
          </div>
          <div className="absolute -left-6 top-0 flex items-center justify-center text-gray-600 font-bold" style={{ height: xLength }}>
            <InlineMath math="x" />
          </div>
          <div className="absolute -left-8 flex items-center justify-center text-gray-600 font-bold" style={{ top: xLength, height: invLength }}>
            <InlineMath math="\frac{1}{x}" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            変数 <InlineMath math="x" /> の値: {xValue.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={xValue}
            onChange={(e) => setXValue(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-4 text-gray-800 text-sm">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2 border-b border-yellow-300 pb-1">なぜ真ん中の項が消えるのか？</h4>
            <p className="mt-2 leading-relaxed">
              スライダーを動かして <InlineMath math="x" /> の値を変えてみてください。<br/>
              青い正方形 (<InlineMath math="x^2" />) と緑の正方形 (<InlineMath math="\frac{1}{x^2}" />) の大きさは極端に変化しますが、<br/>
              <strong>黄色い長方形の面積は常に「<InlineMath math="x \times \frac{1}{x} = 1" />」で固定</strong>されています。
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2 border-b border-blue-300 pb-1">対称式の変形公式</h4>
            <p className="mt-2 leading-relaxed">
              全体の正方形の面積 <InlineMath math="(x + \frac{1}{x})^2" /> から、2つの黄色い長方形 (面積の合計 <InlineMath math="2" />) を物理的に引き剥がすと、青と緑の正方形だけが残ります。<br/>
              <span className="block text-center my-3 text-lg font-bold text-blue-900">
                <InlineMath math="x^2 + \frac{1}{x^2} = \left(x + \frac{1}{x}\right)^2 - 2" />
              </span>
              この公式は「長方形2個分を削る」という幾何学的な事実を表しています。
            </p>
          </div>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "x + 1/x = s のとき、x² + 1/x² = s² - 2 で求められます。" },
        { step: 2, text: "x³ + 1/x³ = s³ - 3s となります（x + 1/x の三乗を展開して確認）。" },
        { step: 3, text: "t = x + 1/x と置換すると、高次の対称式も t の多項式で表せます。" },
        { step: 4, text: "x - 1/x の値は (x + 1/x)² - 4 = s² - 4 の平方根で求められます。" }
      ]} />
    </div>
  );
}
