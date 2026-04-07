import React, { useState } from 'react';
import HintButton from '../../components/HintButton';

export default function AtLeastOnePositiveRootViz() {
  const [m, setM] = useState(0); // parameter for equation x^2 - 2mx + m + 2 = 0

  // Eq: f(x) = x^2 - 2mx + m + 2
  // D/4 = m^2 - (m+2) = m^2 - m - 2 = (m-2)(m+1)
  // Axis: x = m
  // f(0) = m + 2

  const dValue = m * m - m - 2;
  const axis = m;
  const f0 = m + 2;

  const hasTwoPositive = dValue >= 0 && axis > 0 && f0 > 0;
  const hasOnePosOneNeg = f0 < 0;
  const hasZeroAndPos = f0 === 0 && axis > 0;
  
  const isSatisfied = hasTwoPositive || hasOnePosOneNeg || hasZeroAndPos;

  // For drawing
  const width = 400;
  const height = 300;
  const scaleX = 30;
  const scaleY = 15;
  const cx = width / 2 - 50; // offset left slightly
  const cy = height / 2 + 50; // offset down slightly

  const drawParabola = () => {
    let path = '';
    for (let px = 0; px <= width; px += 2) {
      const x = (px - cx) / scaleX;
      const y = x * x - 2 * m * x + m + 2;
      const py = cy - y * scaleY;
      if (px === 0) path += `M ${px} ${py} `;
      else path += `L ${px} ${py} `;
    }
    return path;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white text-gray-800 rounded-lg shadow w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-2">少なくとも1つの正の解をもつ条件</h3>
      <p className="text-sm mb-4">方程式 <span className="font-mono bg-gray-100 px-1 rounded">x² - 2mx + m + 2 = 0</span></p>

      <div className="relative border border-gray-300 bg-slate-50 mb-4" style={{ width, height }}>
        <svg width={width} height={height}>
          {/* x-axis */}
          <line x1={0} y1={cy} x2={width} y2={cy} stroke="#cbd5e1" strokeWidth="2" />
          <text x={width - 15} y={cy - 10} fontSize="12" fill="#64748b">x</text>
          
          {/* positive x-axis highlight */}
          <line x1={cx} y1={cy} x2={width} y2={cy} stroke={isSatisfied ? "#22c55e" : "#cbd5e1"} strokeWidth="4" />

          {/* y-axis */}
          <line x1={cx} y1={0} x2={cx} y2={height} stroke="#cbd5e1" strokeWidth="2" />
          <text x={cx + 10} y={15} fontSize="12" fill="#64748b">y</text>

          {/* Origin */}
          <text x={cx - 15} y={cy + 15} fontSize="12" fill="#64748b">O</text>

          {/* Axis of symmetry */}
          <line x1={cx + axis * scaleX} y1={0} x2={cx + axis * scaleX} y2={height} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />

          {/* Parabola */}
          <path d={drawParabola()} fill="none" stroke="#3b82f6" strokeWidth="2" />
          
          {/* y-intercept point */}
          <circle cx={cx} cy={cy - f0 * scaleY} r="4" fill="#ef4444" />
        </svg>

        {/* Dynamic status badge */}
        <div className={`absolute top-2 left-2 px-3 py-1 rounded text-sm font-bold text-white shadow ${isSatisfied ? 'bg-green-500' : 'bg-red-500'}`}>
          {isSatisfied ? '条件クリア: 少なくとも1つの正の解' : '条件未達'}
        </div>
      </div>

      <div className="w-full flex items-center mb-4 px-8">
        <label className="mr-4 font-bold w-16 text-right">m = {m.toFixed(1)}</label>
        <input 
          type="range" 
          min="-3" 
          max="4" 
          step="0.1" 
          value={m} 
          onChange={(e) => setM(parseFloat(e.target.value))}
          className="flex-1"
        />
      </div>

      <div className="w-full bg-gray-100 p-4 rounded text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-bold mb-1">場合分け1: 正の解が2つ (重解含む)</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li className={hasTwoPositive ? "font-bold text-green-600" : ""}>D/4 = (m-2)(m+1) ≥ 0 <span className="text-xs">[{dValue >= 0 ? 'OK' : 'NG'}]</span></li>
            <li className={hasTwoPositive ? "font-bold text-green-600" : ""}>軸: m {'>'} 0 <span className="text-xs">[{axis > 0 ? 'OK' : 'NG'}]</span></li>
            <li className={hasTwoPositive ? "font-bold text-green-600" : ""}>f(0): m+2 {'>'} 0 <span className="text-xs">[{f0 > 0 ? 'OK' : 'NG'}]</span></li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-1">場合分け2: 正の解と0以下の解</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li className={hasOnePosOneNeg ? "font-bold text-green-600" : ""}>正と負: f(0) {'<'} 0 <span className="text-xs">[{f0 < 0 ? 'OK' : 'NG'}]</span></li>
            <li className={hasZeroAndPos ? "font-bold text-green-600" : ""}>0と正: f(0)=0 かつ 軸{'>'}0 <span className="text-xs">[{hasZeroAndPos ? 'OK' : 'NG'}]</span></li>
          </ul>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "少なくとも1つの正の解を持つ条件は、場合分けが必要です。" },
        { step: 2, text: "場合1: 2つとも正の解 → D ≧ 0、軸 > 0、f(0) > 0 の3条件。" },
        { step: 3, text: "場合2: 正と負（または0）の解 → f(0) < 0（またはf(0)=0かつ軸>0）。" },
      ]} />
    </div>
    </div>
  );
}
