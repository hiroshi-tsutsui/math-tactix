'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface SolutionsInRangeVizProps {
  problem: any;
}

const SolutionsInRangeViz: React.FC<SolutionsInRangeVizProps> = ({ problem }) => {
  const [k, setK] = useState(problem?.k || 0);
  const [data, setData] = useState<any[]>([]);

  // Constants for visualization
  const rangeStart = 0;
  const rangeEnd = 3;
  const yMin = -5;
  const yMax = 15;
  const xMin = -2;
  const xMax = 5;

  // Calculate conditions
  // Logic: D = 4(k^2 - (k+2)) = 4(k^2 - k - 2) = 4(k-2)(k+1).
  // D > 0 => (k-2)(k+1) > 0 => k < -1 or k > 2.
  const isDiscriminantOk = (k < -1) || (k > 2);
  const D_val = (k-2)*(k+1);

  const axis = k;
  const isAxisOk = axis > rangeStart && axis < rangeEnd;
  
  const f0 = k + 2;
  const f3 = 9 - 6 * k + k + 2; // 11 - 5k
  const isEndpointsOk = f0 > 0 && f3 > 0;
  
  const isAllGood = isDiscriminantOk && isAxisOk && isEndpointsOk;

  useEffect(() => {
    const newData = [];
    // Generate enough points for smooth curve
    for (let x = xMin; x <= xMax; x += 0.1) {
      // y = x^2 - 2kx + k + 2
      const y = x * x - 2 * k * x + k + 2;
      newData.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(2)) });
    }
    setData(newData);
  }, [k]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800">解の存在範囲の視覚化</h3>
      
      {/* Graph Area */}
      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={[xMin, xMax]} 
              allowDataOverflow={true} 
            />
            <YAxis 
              domain={[yMin, yMax]} 
              allowDataOverflow={true} 
            />
            <Tooltip />
            
            {/* The Function */}
            <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={2} dot={false} />
            
            {/* The Target Range */}
            <ReferenceArea x1={rangeStart} x2={rangeEnd} fill="#82ca9d" fillOpacity={0.2} label="Target Range" />
            
            {/* The Axis */}
            <ReferenceLine x={axis} stroke="red" strokeDasharray="3 3" label="Axis" />
            
            {/* X-Axis Highlight */}
            <ReferenceLine y={0} stroke="#666" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Control Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          パラメータ <MathDisplay tex={`k = ${k.toFixed(2)}`} />
        </label>
        <input
          type="range"
          min="-3"
          max="4"
          step="0.1"
          value={k}
          onChange={(e) => setK(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-3</span>
          <span>4</span>
        </div>
      </div>

      {/* Condition Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className={`p-3 rounded border ${isDiscriminantOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-bold text-sm mb-1">1. 判別式 <MathDisplay tex="D > 0" /></div>
          <div className="text-xs">
            <MathDisplay tex="D/4 = (k-2)(k+1)" /> <br/>
            値: {D_val.toFixed(2)} <br/>
            {isDiscriminantOk ? 'OK (異なる2つの実数解)' : 'NG (実数解なし/重解)'}
          </div>
        </div>

        <div className={`p-3 rounded border ${isAxisOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-bold text-sm mb-1">2. 軸の位置</div>
          <div className="text-xs">
            <MathDisplay tex="0 < \text{軸} < 3" /> <br/>
            軸: <MathDisplay tex={`x = ${axis.toFixed(2)}`} /> <br/>
            {isAxisOk ? 'OK (範囲内)' : 'NG (範囲外)'}
          </div>
        </div>

        <div className={`p-3 rounded border ${isEndpointsOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-bold text-sm mb-1">3. 端点の符号</div>
          <div className="text-xs">
            <MathDisplay tex="f(0) > 0, f(3) > 0" /> <br/>
            <MathDisplay tex={`f(0) = ${f0.toFixed(2)}`} /> <br/>
            <MathDisplay tex={`f(3) = ${f3.toFixed(2)}`} /> <br/>
            {isEndpointsOk ? 'OK (両方正)' : 'NG (片方または両方が負)'}
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className={`p-4 rounded-lg text-center font-bold text-white ${isAllGood ? 'bg-green-500' : 'bg-gray-400'}`}>
        {isAllGood ? '条件クリア！ (解が範囲内に2つ存在)' : '条件未達成'}
      
      <HintButton hints={[
        { step: 1, text: "指定された範囲に解が2つあるための条件は、解の配置の3条件です。" },
        { step: 2, text: "D ≧ 0、p < 軸 < q、f(p) > 0 かつ f(q) > 0 (a > 0 の場合) を全て満たす必要があります。" },
        { step: 3, text: "k をスライダーで動かして、3条件が同時に満たされる範囲を確認しましょう。" },
      ]} />
    </div>
    </div>
  );
};

export default SolutionsInRangeViz;
