import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Scatter } from 'recharts';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
export const IntersectionParabolasViz: React.FC = () => {
  const [k, setK] = useState<number>(1);

  // f(x) = x^2 - 4
  // g(x) = -x^2 + 2x
  // intersection f(x) = g(x) => 2x^2 - 2x - 4 = 0 => x^2 - x - 2 = 0 => (x-2)(x+1) = 0 => x = -1, 2
  // Points: (-1, -3) and (2, 0)
  // Family: f(x) + k * g(x) = 0 => (1-k)x^2 + 2kx - 4 = y
  // If k = 1, y = 2x - 4 (the common chord line)
  
  const generateData = () => {
    const data = [];
    for (let x = -3; x <= 4; x += 0.1) {
      const rx = Math.round(x * 10) / 10;
      const f = rx * rx - 4;
      const g = -rx * rx + 2 * rx;
      const family = f + k * g;
      data.push({ x: rx, f, g, family });
    }
    return data;
  };

  const data = generateData();
  const intersections = [
    { x: -1, y: -3 },
    { x: 2, y: 0 }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">2つの放物線の交点を通る図形</h3>
        <p className="text-slate-600 text-sm mb-4">
          2つの放物線 <MathDisplay tex="f(x) = x^2 - 4" /> と <MathDisplay tex="g(x) = -x^2 + 2x" /> の交点を通る図形群を <MathDisplay tex="f(x) + k \cdot g(x) = 0" /> で表現します。<br/>
          <span className="font-semibold text-blue-600">k = 1</span> のとき、<MathDisplay tex="x^2" />の項が消えて「2交点を通る直線（共通弦）」になることを確認しましょう。
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            パラメータ <MathDisplay tex="k" /> : <span className="font-bold text-blue-600">{k.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-2"
            max="3"
            step="0.1"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[-3, 4]} ticks={[-3, -2, -1, 0, 1, 2, 3, 4]} />
              <YAxis domain={[-8, 8]} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Line type="monotone" dataKey="f" stroke="#94a3b8" strokeWidth={2} dot={false} name="f(x)" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="g" stroke="#94a3b8" strokeWidth={2} dot={false} name="g(x)" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="family" stroke="#3b82f6" strokeWidth={3} dot={false} name="f(x) + k*g(x) = 0" />
              <Scatter data={intersections} fill="#ef4444" name="交点" shape="circle" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2">図形の方程式</h4>
          <MathDisplay tex={`y = f(x) + k \\cdot g(x)`} displayMode />
          <MathDisplay tex={`y = (x^2 - 4) + (${k.toFixed(1)})(-x^2 + 2x)`} displayMode />
          <MathDisplay tex={`y = ${(1-k).toFixed(1)}x^2 + ${(2*k).toFixed(1)}x - 4`} displayMode />
          {k === 1 ? (
            <p className="text-red-600 font-bold mt-2 text-center">★ 2次項が消え、2交点を通る直線（共通弦）になります！</p>
          ) : (
            <p className="text-blue-600 font-bold mt-2 text-center">★ 2交点を通る新たな放物線になります。</p>
          )}
        </div>
      </div>
    </div>
  );
};
