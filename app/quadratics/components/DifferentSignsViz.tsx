import React, { useState } from 'react';

const DifferentSignsViz = () => {
  const [m, setM] = useState(0);
  
  const yIntercept = -(m * m + 1);
  const hasDifferentSigns = yIntercept < 0;

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">異符号の解の視覚化</h3>
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          パラメータ m: {m}
        </label>
        <input 
          type="range" 
          min="-5" max="5" step="0.5" 
          value={m} 
          onChange={(e) => setM(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-sm">方程式: <span className="font-mono">x² - {m}x {yIntercept} = 0</span></p>
        <p className="text-sm">
          y切片 <span className="font-mono">f(0) = {yIntercept}</span>
        </p>
      </div>
      <div className={`p-4 rounded-lg font-bold text-center ${hasDifferentSigns ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        条件 f(0) &lt; 0: {hasDifferentSigns ? "満たしている (異符号の解)" : "満たしていない"}
      </div>
      <p className="mt-4 text-sm text-slate-600">
        異符号の解をもつ条件は、y切片が負になること（f(0) &lt; 0）だけです。軸や判別式の条件は不要であることを視覚的に確認します。
      </p>
    </div>
  );
};

export default DifferentSignsViz;
