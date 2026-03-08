'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';

type RangeType = 'inside' | 'outside';

interface Range {
  type: RangeType;
  min: number;
  max: number;
  // Optional for input, added internally
  id?: number;
  color?: string;
}

interface SimultaneousInequalityVizProps {
  initialRanges: Range[]; // Used for "Solution Mode" (fixed problem)
  mode?: 'interactive' | 'solution'; // Default to 'solution' for now to match current usage
}

const SimultaneousInequalityViz: React.FC<SimultaneousInequalityVizProps> = ({ initialRanges, mode = 'solution' }) => {
  // State for interactive mode (future proofing)
  const [ranges, setRanges] = useState<Range[]>(initialRanges);
  const [step, setStep] = useState(0); // 0: Start, 1: Show 1, 2: Show 2, 3: Show Answer

  useEffect(() => {
    setRanges(initialRanges);
    setStep(0);
  }, [initialRanges]);

  const width = 600;
  const height = 300;
  const margin = 50;
  const xMin = -8;
  const xMax = 8;
  const axisY = height / 2;

  const scaleX = (x: number) => {
    const clamped = Math.max(xMin, Math.min(xMax, x));
    return ((clamped - xMin) / (xMax - xMin)) * (width - 2 * margin) + margin;
  };

  // Helper to get intersection ranges
  const getIntersections = () => {
    // 0.05 step scan (simple but effective for visualization)
    const scanStep = 0.05;
    const segments: [number, number][] = [];
    let currentStart: number | null = null;

    for (let x = xMin; x <= xMax; x += scanStep) {
      const inR1 = ranges[0].type === 'inside' 
        ? (x > ranges[0].min && x < ranges[0].max) 
        : (x < ranges[0].min || x > ranges[0].max);
      
      const inR2 = ranges[1].type === 'inside' 
        ? (x > ranges[1].min && x < ranges[1].max) 
        : (x < ranges[1].min || x > ranges[1].max);

      if (inR1 && inR2) {
        if (currentStart === null) currentStart = x;
      } else {
        if (currentStart !== null) {
          segments.push([currentStart, x]);
          currentStart = null;
        }
      }
    }
    if (currentStart !== null) segments.push([currentStart, xMax]);
    return segments;
  };

  const drawRange = (range: Range, yOffset: number, isVisible: boolean) => {
    if (!isVisible) return null;

    const yLevel = axisY + yOffset;
    const rMinX = scaleX(range.min);
    const rMaxX = scaleX(range.max);
    
    // Check for "out of bounds" to draw arrows
    const minArrow = range.min <= xMin;
    const maxArrow = range.max >= xMax;

    return (
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <text x={margin} y={yLevel - 15} fill={range.color} fontSize="14" fontWeight="bold">
          {range.id === 1 ? '不等式 ①' : '不等式 ②'}
        </text>

        {range.type === 'inside' ? (
           <g>
             {/* Main Bar */}
             <line x1={rMinX} y1={yLevel} x2={rMaxX} y2={yLevel} stroke={range.color} strokeWidth="4" />
             {/* Connectors to Axis */}
             <line x1={rMinX} y1={yLevel} x2={rMinX} y2={axisY} stroke={range.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
             <line x1={rMaxX} y1={yLevel} x2={rMaxX} y2={axisY} stroke={range.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
             
             {/* Endpoints (Open Circles for < >) */}
             <circle cx={rMinX} cy={yLevel} r="5" fill="white" stroke={range.color} strokeWidth="2" />
             <circle cx={rMaxX} cy={yLevel} r="5" fill="white" stroke={range.color} strokeWidth="2" />
             
             {/* Labels */}
             <text x={rMinX} y={yLevel + (yOffset > 0 ? 25 : -15)} textAnchor="middle" fontSize="12" fill={range.color} fontWeight="bold">{range.min}</text>
             <text x={rMaxX} y={yLevel + (yOffset > 0 ? 25 : -15)} textAnchor="middle" fontSize="12" fill={range.color} fontWeight="bold">{range.max}</text>
           </g>
        ) : (
           <g>
             {/* Left Part */}
             <line x1={minArrow ? margin - 10 : margin} y1={yLevel} x2={rMinX} y2={yLevel} stroke={range.color} strokeWidth="4" />
             {minArrow && <path d={`M ${margin-5} ${yLevel} l 5 -5 M ${margin-5} ${yLevel} l 5 5`} stroke={range.color} strokeWidth="2" fill="none"/>}
             
             {/* Right Part */}
             <line x1={rMaxX} y1={yLevel} x2={maxArrow ? width - margin + 10 : width - margin} y2={yLevel} stroke={range.color} strokeWidth="4" />
             {maxArrow && <path d={`M ${width-margin+5} ${yLevel} l -5 -5 M ${width-margin+5} ${yLevel} l -5 5`} stroke={range.color} strokeWidth="2" fill="none"/>}

             {/* Connectors */}
             <line x1={rMinX} y1={yLevel} x2={rMinX} y2={axisY} stroke={range.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
             <line x1={rMaxX} y1={yLevel} x2={rMaxX} y2={axisY} stroke={range.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />

             {/* Endpoints */}
             <circle cx={rMinX} cy={yLevel} r="5" fill="white" stroke={range.color} strokeWidth="2" />
             <circle cx={rMaxX} cy={yLevel} r="5" fill="white" stroke={range.color} strokeWidth="2" />

             {/* Labels */}
             <text x={rMinX} y={yLevel + (yOffset > 0 ? 25 : -15)} textAnchor="middle" fontSize="12" fill={range.color} fontWeight="bold">{range.min}</text>
             <text x={rMaxX} y={yLevel + (yOffset > 0 ? 25 : -15)} textAnchor="middle" fontSize="12" fill={range.color} fontWeight="bold">{range.max}</text>
           </g>
        )}
      </motion.g>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 flex gap-3 w-full justify-center">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30 font-bold transition-all text-sm"
        >
          戻る
        </button>
        <span className="px-6 py-2 font-mono font-bold text-gray-600 bg-gray-50 rounded-lg border border-gray-200 tracking-wider">
          STEP {step + 1} / 4
        </span>
        <button 
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 shadow-md font-bold transition-all text-sm"
        >
          {step === 2 ? '共通範囲を見る' : '次へ'}
        </button>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid Background */}
          {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
             const x = scaleX(xMin + i);
             return <line key={i} x1={x} y1={0} x2={x} y2={height} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
          })}

          {/* Main Axis */}
          <line x1={margin} y1={axisY} x2={width - margin} y2={axisY} stroke="#374151" strokeWidth="3" markerEnd="url(#arrow)" />
          
          {/* Origin */}
          <circle cx={scaleX(0)} cy={axisY} r="4" fill="#374151" />
          <text x={scaleX(0)} y={axisY + 25} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">0</text>

          {/* Definitions */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#374151" />
            </marker>
          </defs>

          {/* Range 1 (Blue, Top) */}
          {drawRange({ ...ranges[0], id: 1, color: '#3b82f6' }, -60, step >= 1)}

          {/* Range 2 (Red, Bottom) */}
          {drawRange({ ...ranges[1], id: 2, color: '#ef4444' }, 60, step >= 2)}

          {/* Intersection (Purple, On Axis) */}
          {step >= 3 && getIntersections().map((seg, i) => (
             <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <line 
                 x1={scaleX(seg[0])} y1={axisY} 
                 x2={scaleX(seg[1])} y2={axisY} 
                 stroke="#8b5cf6" strokeWidth="8" strokeOpacity="0.6" strokeLinecap="round"
               />
               <text x={scaleX((seg[0] + seg[1])/2)} y={axisY - 15} textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">共通範囲</text>
             </motion.g>
          ))}
        </svg>
      </div>

      <div className="mt-6 w-full text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {step === 0 && "Step 1: 数直線を用意する"}
          {step === 1 && "Step 2: 1つ目の範囲を描く"}
          {step === 2 && "Step 3: 2つ目の範囲を描く"}
          {step === 3 && "Step 4: 重なりを見つける"}
        </h3>
        <p className="text-gray-600 text-sm">
          {step === 0 && "まずは原点0を中心とした数直線を確認しましょう。"}
          {step === 1 && "不等式①の解の範囲（青）を数直線の上に描きます。"}
          {step === 2 && "不等式②の解の範囲（赤）を数直線の下に描きます。高さ（レベル）を変えると見やすいです。"}
          {step === 3 && "上下の範囲が重なっている部分（紫）が、この連立不等式の解です！"}
        </p>
      </div>
    </div>
  );
};

export default SimultaneousInequalityViz;