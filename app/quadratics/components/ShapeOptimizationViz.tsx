'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface ShapeOptimizationVizProps {
  totalLength: number; // L
}

const ShapeOptimizationViz: React.FC<ShapeOptimizationVizProps> = ({ totalLength }) => {
  const [xVal, setXVal] = useState(totalLength / 4); // Default to optimal
  
  // Calculate current state
  const yVal = totalLength - 2 * xVal; // Width of the pen
  const currentArea = xVal * yVal;
  
  // Function for the Area graph: S(x) = x(L-2x) = -2x^2 + Lx
  const data = [];
  // Domain: 0 < x < L/2
  const maxX = totalLength / 2;
  for (let x = 0; x <= maxX; x += maxX / 50) {
    const area = x * (totalLength - 2 * x);
    data.push({ x: Number(x.toFixed(2)), area: Number(area.toFixed(2)) });
  }

  // Optimal Solution
  const optimalX = totalLength / 4;
  const optimalArea = optimalX * (totalLength - 2 * optimalX);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: The Physical Setup (Diagram) */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-700 mb-4 text-center">花壇の形状 (Physical Setup)</h4>
          <div className="relative h-[200px] w-full bg-green-50 rounded-lg border border-green-200 flex items-end justify-center overflow-hidden">
            {/* The Wall */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gray-400 border-b border-gray-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold tracking-widest">WALL (壁)</span>
            </div>
            
            {/* The Pen */}
            {xVal > 0 && yVal > 0 && (
              <div 
                className="bg-green-200 border-2 border-green-600 relative transition-all duration-300 ease-out"
                style={{
                  width: `${(yVal / totalLength) * 100}%`,
                  height: `${(xVal / (totalLength/2)) * 100}%`,
                  marginBottom: '0px'
                }}
              >
                {/* Labels */}
                <span className="absolute left-[-25px] top-1/2 -translate-y-1/2 text-sm font-bold text-green-800">
                  x
                </span>
                <span className="absolute right-[-25px] top-1/2 -translate-y-1/2 text-sm font-bold text-green-800">
                  x
                </span>
                <span className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 text-sm font-bold text-green-800">
                  {yVal.toFixed(1)}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-green-900 opacity-50 text-xl">
                    S = {currentArea.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 px-4">
             <label className="block text-sm font-bold text-gray-700 mb-2">
               縦の長さ x: <span className="text-blue-600">{xVal.toFixed(1)}m</span>
             </label>
             <input 
               type="range" 
               min="0.1" 
               max={(totalLength / 2) - 0.1} 
               step="0.1" 
               value={xVal}
               onChange={(e) => setXVal(parseFloat(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
               <span>0m</span>
               <span>{totalLength/2}m</span>
             </div>
          </div>
        </div>

        {/* Right: The Quadratic Function Graph */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-700 mb-4 text-center">面積のグラフ (Function Graph)</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  domain={[0, totalLength/2]} 
                  label={{ value: 'x (縦の長さ)', position: 'bottom', offset: 0 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'S (面積)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: any) => [value ? Number(value).toFixed(2) : "0", 'Area']}
                  labelFormatter={(label: any) => `x = ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="area" 
                  stroke="#2563eb" 
                  fillOpacity={1} 
                  fill="url(#colorArea)" 
                />
                {/* Current Point */}
                <ReferenceDot 
                  x={xVal} 
                  y={currentArea} 
                  r={6} 
                  fill="#ef4444" 
                  stroke="#fff" 
                  strokeWidth={2}
                />
                {/* Optimal Line */}
                <ReferenceLine 
                  x={optimalX} 
                  stroke="#10b981" 
                  strokeDasharray="3 3" 
                  label={{ value: 'MAX', position: 'top', fill: '#10b981', fontSize: 12, fontWeight: 'bold' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-600 border border-gray-200">
             <p>関数: <MathDisplay tex={`S = -2x^2 + ${totalLength}x`} /></p>
             <p>頂点: <MathDisplay tex={`(${optimalX}, ${optimalArea})`} /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeOptimizationViz;
