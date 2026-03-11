"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function ConditionNumberLineViz() {
  const [a, setA] = useState(1);
  
  const pMin = a - 2;
  const pMax = a + 2;
  const qMin = 0;
  const qMax = 5;

  const isPinsideQ = pMin >= qMin && pMax <= qMax;
  const isQinsideP = qMin >= pMin && qMax <= pMax;
  
  let statusText = "P と Q に包含関係はありません";
  let statusColor = "text-slate-600";
  
  if (isPinsideQ && isQinsideP) {
    statusText = "P は Q であるための 必要十分条件 です (P = Q)";
    statusColor = "text-indigo-600 font-bold";
  } else if (isPinsideQ) {
    statusText = "P は Q であるための 十分条件 です (P ⊂ Q)";
    statusColor = "text-emerald-600 font-bold";
  } else if (isQinsideP) {
    statusText = "P は Q であるための 必要条件 です (Q ⊂ P)";
    statusColor = "text-rose-600 font-bold";
  }

  const width = 600;
  const height = 200;
  const margin = { left: 40, right: 40, top: 50, bottom: 40 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMinGraph = -4;
  const xMaxGraph = 9;

  const getX = (val: number) => {
    return margin.left + ((val - xMinGraph) / (xMaxGraph - xMinGraph)) * graphWidth;
  };
  const yAxis = margin.top + graphHeight / 2;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full max-w-2xl">
        <h4 className="text-sm font-bold text-slate-700 mb-4 text-center">条件の設定</h4>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 min-w-[200px] text-center">
            <div className="font-bold text-emerald-600 mb-2">条件 P</div>
            <BlockMath math={`|x - a| < 2`} />
            <div className="text-sm mt-2 text-slate-600">
              <InlineMath math={`${pMin} < x < ${pMax}`} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 min-w-[200px] text-center">
            <div className="font-bold text-rose-600 mb-2">条件 Q</div>
            <BlockMath math={`0 < x < 5`} />
            <div className="text-sm mt-2 text-slate-600">
              <InlineMath math={`0 < x < 5`} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <label className="text-sm font-semibold text-slate-700 mb-2">パラメータ a を動かす: a = {a}</label>
          <input
            type="range"
            min="-2"
            max="7"
            step="0.5"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full max-w-md accent-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl overflow-x-auto flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Number Line */}
          <line
            x1={margin.left - 20} y1={yAxis}
            x2={width - margin.right + 20} y2={yAxis}
            stroke="#cbd5e1" strokeWidth="2"
          />
          <polygon points={`${width - margin.right + 20},${yAxis - 4} ${width - margin.right + 28},${yAxis} ${width - margin.right + 20},${yAxis + 4}`} fill="#cbd5e1" />
          
          {/* Ticks */}
          {Array.from({ length: 14 }, (_, i) => i - 4).map((i) => (
            <g key={i}>
              <line x1={getX(i)} y1={yAxis - 4} x2={getX(i)} y2={yAxis + 4} stroke="#94a3b8" strokeWidth="1" />
              <text x={getX(i)} y={yAxis + 20} fontSize="12" fill="#64748b" textAnchor="middle">{i}</text>
            </g>
          ))}

          {/* Condition Q (Fixed) */}
          <path
            d={`M ${getX(qMin)} ${yAxis} L ${getX(qMin)} ${yAxis - 40} L ${getX(qMax)} ${yAxis - 40} L ${getX(qMax)} ${yAxis}`}
            fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4"
          />
          <circle cx={getX(qMin)} cy={yAxis} r="4" fill="white" stroke="#f43f5e" strokeWidth="2" />
          <circle cx={getX(qMax)} cy={yAxis} r="4" fill="white" stroke="#f43f5e" strokeWidth="2" />
          <text x={getX((qMin + qMax) / 2)} y={yAxis - 48} fontSize="14" fontWeight="bold" fill="#f43f5e" textAnchor="middle">Q</text>

          {/* Condition P (Movable) */}
          <path
            d={`M ${getX(pMin)} ${yAxis} L ${getX(pMin)} ${yAxis - 20} L ${getX(pMax)} ${yAxis - 20} L ${getX(pMax)} ${yAxis}`}
            fill="none" stroke="#10b981" strokeWidth="3"
          />
          <circle cx={getX(pMin)} cy={yAxis} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
          <circle cx={getX(pMax)} cy={yAxis} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
          <text x={getX((pMin + pMax) / 2)} y={yAxis - 28} fontSize="14" fontWeight="bold" fill="#10b981" textAnchor="middle">P</text>
          
          {/* Shaded overlap if sufficient */}
          {isPinsideQ && (
            <rect x={getX(pMin)} y={yAxis - 20} width={getX(pMax) - getX(pMin)} height={20} fill="#10b981" fillOpacity="0.2" />
          )}
          {/* Shaded overlap if Q inside P */}
          {isQinsideP && (
            <rect x={getX(qMin)} y={yAxis - 40} width={getX(qMax) - getX(qMin)} height={40} fill="#f43f5e" fillOpacity="0.1" />
          )}

        </svg>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl w-full max-w-2xl text-center">
        <h4 className="text-sm font-bold text-indigo-900 mb-2">判定結果</h4>
        <div className={`text-lg ${statusColor}`}>
          {statusText}
        </div>
        <p className="text-sm text-indigo-800 mt-4 leading-relaxed">
          P が Q の「十分条件」であるためには、P の範囲が完全に Q の内側に収まる (<InlineMath math="P \subset Q" />) 必要があります。<br/>
          逆に、P が Q の「必要条件」であるためには、Q の範囲が完全に P の内側に収まる (<InlineMath math="Q \subset P" />) 必要があります。
        </p>
      </div>
    </div>
  );
}
