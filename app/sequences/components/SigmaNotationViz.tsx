"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

type FormulaType = 'k' | 'k2' | 'k3';

interface SigmaNotationVizProps {
  initialType?: FormulaType;
}

const SigmaNotationViz: React.FC<SigmaNotationVizProps> = ({
  initialType = 'k',
}) => {
  const [formulaType, setFormulaType] = useState<FormulaType>(initialType);
  const [n, setN] = useState(8);

  const computeTerm = (k: number): number => {
    switch (formulaType) {
      case 'k': return k;
      case 'k2': return k * k;
      case 'k3': return k * k * k;
    }
  };

  const terms = useMemo(() => {
    return Array.from({ length: n }, (_, i) => computeTerm(i + 1));
  }, [n, formulaType]);

  const sum = terms.reduce((a, b) => a + b, 0);

  const expectedSum = (() => {
    switch (formulaType) {
      case 'k': return (n * (n + 1)) / 2;
      case 'k2': return (n * (n + 1) * (2 * n + 1)) / 6;
      case 'k3': return Math.pow((n * (n + 1)) / 2, 2);
    }
  })();

  const formulaTex = (() => {
    switch (formulaType) {
      case 'k': return `\\sum_{k=1}^{${n}} k = \\frac{${n}(${n}+1)}{2} = ${expectedSum}`;
      case 'k2': return `\\sum_{k=1}^{${n}} k^2 = \\frac{${n}(${n}+1)(2 \\cdot ${n}+1)}{6} = ${expectedSum}`;
      case 'k3': return `\\sum_{k=1}^{${n}} k^3 = \\left\\{\\frac{${n}(${n}+1)}{2}\\right\\}^2 = ${expectedSum}`;
    }
  })();

  const svgW = 600;
  const svgH = 300;
  const padding = 50;
  const maxVal = Math.max(...terms, 1);
  const barGroupW = (svgW - 2 * padding) / n;
  const barW = Math.min(barGroupW * 0.7, 32);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay tex={formulaTex} displayMode />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {terms.map((val, i) => {
            const cx = padding + (i + 0.5) * barGroupW;
            const h = (val / maxVal) * (svgH - 2 * padding - 20);
            const colors = ['#3b82f6', '#8b5cf6', '#ec4899'];
            const color = colors[['k', 'k2', 'k3'].indexOf(formulaType)];
            return (
              <g key={i}>
                <rect
                  x={cx - barW / 2}
                  y={svgH - padding - h}
                  width={barW}
                  height={h}
                  fill={color}
                  opacity={0.7}
                  rx={3}
                />
                <text
                  x={cx}
                  y={svgH - padding + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  {i + 1}
                </text>
                <text
                  x={cx}
                  y={svgH - padding - h - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill={color}
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-2 justify-center">
        {(['k', 'k2', 'k3'] as FormulaType[]).map((ft) => {
          const labels: Record<FormulaType, string> = {
            k: 'Sigma k',
            k2: 'Sigma k^2',
            k3: 'Sigma k^3',
          };
          return (
            <button
              key={ft}
              onClick={() => setFormulaType(ft)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                formulaType === ft
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <MathDisplay tex={`\\sum ${ft === 'k' ? 'k' : ft === 'k2' ? 'k^2' : 'k^3'}`} />
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">上限 n</span>
          <span className="font-bold text-blue-600">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-2">シグマの公式</p>
        <div className="space-y-2">
          <MathDisplay tex={`\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}`} displayMode />
          <MathDisplay tex={`\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}`} displayMode />
          <MathDisplay tex={`\\sum_{k=1}^{n} k^3 = \\left\\{\\frac{n(n+1)}{2}\\right\\}^2`} displayMode />
        </div>
      </div>
    </div>
  );
};

export default SigmaNotationViz;
