"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function AbsoluteValueViz() {
  const [a, setA] = useState(2);
  const [c, setC] = useState(3);
  const [type, setType] = useState<'eq' | 'lt' | 'gt'>('lt');

  const xMin = -10;
  const xMax = 10;
  
  const width = 600;
  const height = 150;
  const margin = { left: 40, right: 40, top: 20, bottom: 40 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const getX = (val: number) => {
    return margin.left + ((val - xMin) / (xMax - xMin)) * graphWidth;
  };
  const yCenter = margin.top + graphHeight / 2;

  const leftPt = a - c;
  const rightPt = a + c;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-8 w-full max-w-lg justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-500 mb-2">基準点 <InlineMath math="a" /></label>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="accent-indigo-500 w-32"
          />
          <span className="text-sm font-mono mt-1">{a}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-500 mb-2">距離 <InlineMath math="c" /></label>
          <input
            type="range"
            min="0"
            max="8"
            step="1"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="accent-indigo-500 w-32"
          />
          <span className="text-sm font-mono mt-1">{c}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setType('eq')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'eq' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <InlineMath math="|x - a| = c" />
        </button>
        <button
          onClick={() => setType('lt')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'lt' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <InlineMath math="|x - a| < c" />
        </button>
        <button
          onClick={() => setType('gt')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'gt' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <InlineMath math="|x - a| > c" />
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <svg width={width} height={height} className="overflow-visible">
          {/* Number Line */}
          <line
            x1={margin.left - 20} y1={yCenter}
            x2={width - margin.right + 20} y2={yCenter}
            stroke="#cbd5e1" strokeWidth="2"
          />
          <polygon points={`${width - margin.right + 20},${yCenter - 4} ${width - margin.right + 28},${yCenter} ${width - margin.right + 20},${yCenter + 4}`} fill="#cbd5e1" />
          
          {/* Ticks and Labels */}
          {Array.from({ length: 21 }, (_, i) => i - 10).map((i) => {
            if (i < xMin || i > xMax) return null;
            return (
              <g key={i}>
                <line
                  x1={getX(i)} y1={yCenter - 4}
                  x2={getX(i)} y2={yCenter + 4}
                  stroke="#94a3b8" strokeWidth="1"
                />
                {i % 2 === 0 && (
                  <text x={getX(i)} y={yCenter + 20} fontSize="12" fill="#64748b" textAnchor="middle">
                    {i}
                  </text>
                )}
              </g>
            );
          })}

          {/* Highlights */}
          {c > 0 && (
            <>
              {type === 'lt' && (
                <line
                  x1={getX(leftPt)} y1={yCenter}
                  x2={getX(rightPt)} y2={yCenter}
                  stroke="#4f46e5" strokeWidth="6" strokeOpacity="0.8"
                />
              )}
              {type === 'gt' && (
                <>
                  <line
                    x1={getX(xMin - 1)} y1={yCenter}
                    x2={getX(leftPt)} y2={yCenter}
                    stroke="#ef4444" strokeWidth="6" strokeOpacity="0.8"
                  />
                  <line
                    x1={getX(rightPt)} y1={yCenter}
                    x2={getX(xMax + 1)} y2={yCenter}
                    stroke="#ef4444" strokeWidth="6" strokeOpacity="0.8"
                  />
                </>
              )}
              
              {/* Boundary points */}
              <circle
                cx={getX(leftPt)} cy={yCenter} r="6"
                fill={type === 'eq' ? '#10b981' : 'white'}
                stroke={type === 'eq' ? '#10b981' : (type === 'lt' ? '#4f46e5' : '#ef4444')}
                strokeWidth="3"
              />
              <circle
                cx={getX(rightPt)} cy={yCenter} r="6"
                fill={type === 'eq' ? '#10b981' : 'white'}
                stroke={type === 'eq' ? '#10b981' : (type === 'lt' ? '#4f46e5' : '#ef4444')}
                strokeWidth="3"
              />
              <text x={getX(leftPt)} y={yCenter - 15} fontSize="12" fill="#64748b" textAnchor="middle">
                {leftPt}
              </text>
              <text x={getX(rightPt)} y={yCenter - 15} fontSize="12" fill="#64748b" textAnchor="middle">
                {rightPt}
              </text>
            </>
          )}
          
          {c === 0 && (
            <circle
              cx={getX(a)} cy={yCenter} r="6"
              fill={type === 'eq' || type === 'lt' ? '#10b981' : 'white'}
              stroke={type === 'eq' || type === 'lt' ? '#10b981' : '#ef4444'}
              strokeWidth="3"
            />
          )}

          {/* Center Point */}
          <circle cx={getX(a)} cy={yCenter} r="4" fill="#334155" />
          <text x={getX(a)} y={yCenter + 35} fontSize="12" fontWeight="bold" fill="#334155" textAnchor="middle">
            基準点 {a}
          </text>

          {/* Distance Indicator */}
          {c > 0 && (
            <path
              d={`M ${getX(a)} ${yCenter - 25} Q ${(getX(a) + getX(rightPt))/2} ${yCenter - 40} ${getX(rightPt)} ${yCenter - 25}`}
              fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4"
              markerEnd="url(#arrow)" markerStart="url(#arrow)"
            />
          )}
          {c > 0 && (
             <text x={(getX(a) + getX(rightPt))/2} y={yCenter - 38} fontSize="12" fill="#64748b" textAnchor="middle">
               距離 {c}
             </text>
          )}

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl w-full max-w-2xl text-center">
        <h4 className="text-sm font-bold text-blue-900 mb-2">現在の条件と解</h4>
        <div className="text-blue-800 font-medium">
          <BlockMath math={`|x - (${a})| ${type === 'eq' ? '=' : type === 'lt' ? '<' : '>'} ${c}`} />
          <div className="mt-2 text-lg">
            {c < 0 ? (
              type === 'gt' ? 'すべての実数' : '解なし'
            ) : c === 0 ? (
              type === 'eq' ? `x = ${a}` : type === 'lt' ? '解なし' : `x \\neq ${a}`
            ) : (
              type === 'eq' ? `x = ${leftPt}, ${rightPt}` :
              type === 'lt' ? `${leftPt} < x < ${rightPt}` :
              `x < ${leftPt}, \\quad ${rightPt} < x`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
