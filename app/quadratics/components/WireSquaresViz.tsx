'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/app/lib/components/MathDisplay';

export default function WireSquaresViz() {
  const [wireLength, setWireLength] = useState(40);
  const [cutPoint, setCutPoint] = useState(20);

  // Math logic
  const sideA = cutPoint / 4;
  const sideB = (wireLength - cutPoint) / 4;
  const areaA = sideA * sideA;
  const areaB = sideB * sideB;
  const totalArea = areaA + areaB;

  // The quadratic function: S(x) = (x/4)^2 + ((L-x)/4)^2 = 1/16 * (2x^2 - 2Lx + L^2)
  // Vertex is at x = L/2
  const optimalCut = wireLength / 2;
  const minArea = (optimalCut / 4) ** 2 * 2;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        針金の切断と正方形の面積 (Wire Squares Area)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Visualization */}
        <div className="space-y-6 flex flex-col items-center">
          
          {/* Wire Representation */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-500 font-bold mb-1">
              <span>0</span>
              <span className="text-blue-600">切断位置: {cutPoint.toFixed(1)} cm</span>
              <span>{wireLength} cm</span>
            </div>
            <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden flex">
              <motion.div 
                className="h-full bg-blue-500"
                style={{ width: `${(cutPoint / wireLength) * 100}%` }}
                layout
              />
              <motion.div 
                className="h-full bg-red-500"
                style={{ width: `${((wireLength - cutPoint) / wireLength) * 100}%` }}
                layout
              />
            </div>
            
            <input
              type="range"
              min="0"
              max={wireLength}
              step="0.1"
              value={cutPoint}
              onChange={(e) => setCutPoint(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600 mt-2"
            />
          </div>

          {/* Squares Visualization */}
          <div className="flex items-end justify-center gap-8 h-[200px] w-full border-b-2 border-dashed border-gray-300 pb-2">
            {/* Square A */}
            <div className="flex flex-col items-center">
              <motion.div 
                className="bg-blue-100 border-2 border-blue-500 flex items-center justify-center shadow-sm"
                style={{ 
                  width: `${sideA * 10}px`, 
                  height: `${sideA * 10}px` 
                }}
                layout
              >
                {sideA > 1 && (
                  <span className="text-blue-800 font-bold text-xs opacity-70">
                    S₁
                  </span>
                )}
              </motion.div>
              <div className="text-sm mt-2 text-blue-700 font-bold">
                1辺: {sideA.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600">
                面積: {areaA.toFixed(2)}
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-400 mb-8">+</div>

            {/* Square B */}
            <div className="flex flex-col items-center">
              <motion.div 
                className="bg-red-100 border-2 border-red-500 flex items-center justify-center shadow-sm"
                style={{ 
                  width: `${sideB * 10}px`, 
                  height: `${sideB * 10}px` 
                }}
                layout
              >
                {sideB > 1 && (
                  <span className="text-red-800 font-bold text-xs opacity-70">
                    S₂
                  </span>
                )}
              </motion.div>
              <div className="text-sm mt-2 text-red-700 font-bold">
                1辺: {sideB.toFixed(2)}
              </div>
              <div className="text-xs text-red-600">
                面積: {areaB.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 w-full text-center">
            <span className="text-gray-500 font-bold text-sm block mb-1">面積の和 (Total Area)</span>
            <span className={`text-3xl font-bold transition-colors ${Math.abs(cutPoint - optimalCut) < 0.2 ? 'text-green-600' : 'text-gray-800'}`}>
              {totalArea.toFixed(2)} cm²
            </span>
            {Math.abs(cutPoint - optimalCut) < 0.2 && (
              <span className="ml-3 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded animate-pulse">
                MINIMUM!
              </span>
            )}
          </div>
        </div>

        {/* Right: Explanation & Math */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">問題の構造化 (Formulation)</h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              長さ <MathDisplay tex={`${wireLength}`} /> cm の針金を、端から <MathDisplay tex="x" /> cm の位置で切断します。<br/>
              切断された2本の針金（長さ <MathDisplay tex="x" /> と <MathDisplay tex={`${wireLength} - x`} />）で、それぞれ正方形を作ります。
            </p>
            <div className="text-sm overflow-x-auto">
              <MathDisplay tex={`S_1 = \\left(\\frac{x}{4}\\right)^2 = \\frac{x^2}{16}`} displayMode />
              <MathDisplay tex={`S_2 = \\left(\\frac{${wireLength} - x}{4}\\right)^2 = \\frac{(x - ${wireLength})^2}{16}`} displayMode />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-bold text-purple-800 mb-2">2次関数の最小値 (Minimizing the Quadratic)</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              面積の和 <MathDisplay tex="y = S_1 + S_2" /> を計算し、平方完成（Completing the Square）を行います。
            </p>
            <div className="text-sm overflow-x-auto">
              <MathDisplay tex={`y = \\frac{1}{16} \\left( x^2 + (x - ${wireLength})^2 \\right)`} displayMode />
              <MathDisplay tex={`y = \\frac{1}{16} \\left( 2x^2 - ${2 * wireLength}x + ${wireLength ** 2} \\right)`} displayMode />
              <MathDisplay tex={`y = \\frac{1}{8} (x - ${optimalCut})^2 + ${minArea}`} displayMode />
            </div>
            <p className="text-sm text-gray-700 mt-2 border-t border-purple-200 pt-2">
              よって、<MathDisplay tex={`x = ${optimalCut}`} /> cm のとき（つまり<strong>ちょうど半分に切ったとき</strong>）、面積の和は最小値 <MathDisplay tex={`${minArea}`} /> cm² をとります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
