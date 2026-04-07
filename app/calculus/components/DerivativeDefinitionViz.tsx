"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const DerivativeDefinitionViz: React.FC = () => {
  const [h, setH] = useState(1.0);
  const [xVal, setXVal] = useState(1.0);

  const f = (x: number) => x * x; // f(x) = x^2
  const trueDerivative = 2 * xVal;
  const approxDerivative = (f(xVal + h) - f(xVal)) / h;

  const svgW = 600;
  const svgH = 320;
  const padding = 50;
  const plotW = svgW - 2 * padding;
  const plotH = svgH - 2 * padding;

  const xMin = -1;
  const xMax = 4;
  const yMin = -1;
  const yMax = 10;

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => svgH - padding - ((y - yMin) / (yMax - yMin)) * plotH;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = f(x);
      if (y >= yMin && y <= yMax) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`);
      }
    }
    return `M ${pts.join(' L ')}`;
  }, []);

  const fx = f(xVal);
  const fxh = f(xVal + h);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <MathDisplay
            tex={`f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}`}
            displayMode
          />
        </div>
        <div className="text-center mb-4 text-sm text-slate-600">
          <MathDisplay
            tex={`f(x) = x^2, \\quad x = ${xVal.toFixed(1)}, \\quad h = ${h.toFixed(3)}`}
          />
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto">
          {/* Axes */}
          <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(yMin)} x2={toSvgX(0)} y2={toSvgY(yMax)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Curve */}
          <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {/* Secant line */}
          {h > 0.001 && (
            <line
              x1={toSvgX(xVal - 0.5)}
              y1={toSvgY(fx + approxDerivative * (-0.5))}
              x2={toSvgX(xVal + h + 0.5)}
              y2={toSvgY(fx + approxDerivative * (h + 0.5))}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="6,3"
            />
          )}

          {/* Tangent line (true derivative) */}
          <line
            x1={toSvgX(xVal - 0.8)}
            y1={toSvgY(fx + trueDerivative * (-0.8))}
            x2={toSvgX(xVal + 0.8)}
            y2={toSvgY(fx + trueDerivative * 0.8)}
            stroke="#10b981"
            strokeWidth={2}
          />

          {/* Points */}
          <circle cx={toSvgX(xVal)} cy={toSvgY(fx)} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />
          {h > 0.01 && (
            <circle cx={toSvgX(xVal + h)} cy={toSvgY(fxh)} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />
          )}

          {/* Labels */}
          <text x={toSvgX(xVal) - 10} y={toSvgY(fx) - 12} fontSize={11} fill="#3b82f6" fontWeight="bold">
            ({xVal.toFixed(1)}, {fx.toFixed(2)})
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">h の値</span>
            <span className="font-bold text-red-500">{h.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.001}
            max={2}
            step={0.001}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">x の値</span>
            <span className="font-bold text-blue-600">{xVal.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={xVal}
            onChange={(e) => setXVal(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-xs text-red-400 mb-1">割線の傾き（近似）</div>
          <div className="text-xl font-bold text-red-600">{approxDerivative.toFixed(4)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-xs text-green-400 mb-1">真の微分係数</div>
          <div className="text-xl font-bold text-green-600">{trueDerivative.toFixed(4)}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">微分の定義</p>
        <MathDisplay
          tex={`f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}`}
          displayMode
        />
        <p className="mt-2">
          h を 0 に近づけると、
          <span className="text-red-600 font-bold">割線（赤い破線）</span>が
          <span className="text-green-600 font-bold">接線（緑の線）</span>に近づきます。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '微分係数は f\'(a) = lim[h→0] (f(a+h) - f(a)) / h で定義されます。これは接線の傾きを表します。' },
        { step: 2, text: '(f(a+h) - f(a)) / h は2点を結ぶ割線の傾きです。h を小さくするほど接線の傾きに近づきます。' },
        { step: 3, text: 'スライダーで h を 0 に近づけて、赤い割線が緑の接線に重なっていく様子を観察しましょう。' },
      ]} />
    </div>
  );
};

export default DerivativeDefinitionViz;
