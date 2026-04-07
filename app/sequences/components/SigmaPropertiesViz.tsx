"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface SigmaPropertiesVizProps {
  mode?: 'explore';
}

const SigmaPropertiesViz: React.FC<SigmaPropertiesVizProps> = () => {
  const [n, setN] = useState(5);
  const [c, setC] = useState(3);
  const [activeProperty, setActiveProperty] = useState<number>(0);

  // Sum k from 1 to n
  const sumK = (n * (n + 1)) / 2;
  // Sum c*k from 1 to n = c * sum k
  const sumCK = c * sumK;
  // Sum (k + k^2) = sum k + sum k^2
  const sumK2 = (n * (n + 1) * (2 * n + 1)) / 6;
  const sumKplusK2 = sumK + sumK2;
  // Sum c (constant) from 1 to n = cn
  const sumConst = c * n;

  const properties = [
    {
      title: '定数倍',
      formula: `\\sum_{k=1}^{${n}} ${c}k = ${c} \\sum_{k=1}^{${n}} k = ${c} \\times ${sumK} = ${sumCK}`,
      rule: `\\sum_{k=1}^{n} ca_k = c\\sum_{k=1}^{n} a_k`,
      desc: '定数はシグマの外に出せます。',
      color: '#3b82f6',
      terms: Array.from({ length: n }, (_, i) => c * (i + 1)),
    },
    {
      title: '分配',
      formula: `\\sum_{k=1}^{${n}} (k + k^2) = \\sum_{k=1}^{${n}} k + \\sum_{k=1}^{${n}} k^2 = ${sumK} + ${sumK2} = ${sumKplusK2}`,
      rule: `\\sum_{k=1}^{n} (a_k + b_k) = \\sum_{k=1}^{n} a_k + \\sum_{k=1}^{n} b_k`,
      desc: '和のシグマは分解できます。',
      color: '#8b5cf6',
      terms: Array.from({ length: n }, (_, i) => (i + 1) + (i + 1) * (i + 1)),
    },
    {
      title: '定数の和',
      formula: `\\sum_{k=1}^{${n}} ${c} = ${c} \\times ${n} = ${sumConst}`,
      rule: `\\sum_{k=1}^{n} c = cn`,
      desc: '定数をn回足すとcnになります。',
      color: '#ec4899',
      terms: Array.from({ length: n }, () => c),
    },
  ];

  const prop = properties[activeProperty];
  const maxVal = Math.max(...prop.terms, 1);

  const svgW = 500;
  const svgH = 200;
  const padding = 40;
  const barGroupW = (svgW - 2 * padding) / n;
  const barW = Math.min(barGroupW * 0.7, 36);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center flex-wrap">
        {properties.map((p, i) => (
          <button
            key={i}
            onClick={() => setActiveProperty(i)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeProperty === i
                ? 'text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            style={activeProperty === i ? { backgroundColor: p.color } : {}}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-2">
          <div className="text-xs text-slate-400 mb-1">一般法則</div>
          <MathDisplay tex={prop.rule} displayMode />
        </div>
        <div className="text-center mb-4">
          <div className="text-xs text-slate-400 mb-1">具体例</div>
          <MathDisplay tex={prop.formula} displayMode />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto">
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          {prop.terms.map((val, i) => {
            const cx = padding + (i + 0.5) * barGroupW;
            const h = (val / maxVal) * (svgH - 2 * padding - 20);
            return (
              <g key={i}>
                <rect
                  x={cx - barW / 2}
                  y={svgH - padding - h}
                  width={barW}
                  height={h}
                  fill={prop.color}
                  opacity={0.7}
                  rx={3}
                />
                <text
                  x={cx}
                  y={svgH - padding + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  k={i + 1}
                </text>
                <text
                  x={cx}
                  y={svgH - padding - h - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill={prop.color}
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">上限 n</span>
            <span className="font-bold text-blue-600">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">定数 c</span>
            <span className="font-bold text-pink-600">{c}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full accent-pink-600"
          />
        </div>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
        <p>{prop.desc}</p>
      </div>
    </div>
  );
};

export default SigmaPropertiesViz;
