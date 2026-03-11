import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const SaltWaterInequalityViz = () => {
  const [addedWater, setAddedWater] = useState(100);
  const initialSalt = 20; // 20g
  const initialWater = 80; // Total 100g -> 20%
  const initialTotal = initialSalt + initialWater;
  
  const currentTotal = initialTotal + addedWater;
  const currentConcentration = (initialSalt / currentTotal) * 100;
  
  const isTargetMet = currentConcentration <= 10;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">
        食塩水の濃度と不等式 (Target: 10% 以下)
      </h3>
      <div className="mb-6 space-y-4 text-slate-700">
        <p>20%の食塩水100gに水を加えて、濃度を10%以下にしたい。加える水を何g以上にすればよいか。</p>
        <p>加える水の量を <InlineMath math="x" /> gとすると、食塩の量は20gのままで、全体の重さは <InlineMath math="100 + x" /> gになる。</p>
        <BlockMath math="\frac{20}{100 + x} \times 100 \le 10" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Visualization area */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-48 h-64 border-b-4 border-slate-400 bg-slate-50 rounded-b-xl overflow-hidden flex flex-col justify-end">
            {/* Water layer */}
            <div 
              className="w-full bg-blue-200 flex flex-col items-center justify-end transition-all duration-300 relative"
              style={{ height: `${Math.min(100, (currentTotal / 300) * 100)}%` }}
            >
              <div className="absolute top-2 text-blue-800 text-sm font-bold">全体: {currentTotal}g</div>
              {/* Salt layer */}
              <div className="w-full bg-white bg-opacity-70 h-8 flex items-center justify-center border-t border-slate-300">
                <span className="text-slate-600 text-xs font-bold">塩 20g (固定)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className={`text-2xl font-bold ${isTargetMet ? 'text-green-600' : 'text-red-500'}`}>
              現在の濃度: {currentConcentration.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              加える水 (x g): <span className="text-lg font-bold text-blue-600">{addedWater}</span> g
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={addedWater}
              onChange={(e) => setAddedWater(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0g</span>
              <span>100g</span>
              <span>200g</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-l-4 ${isTargetMet ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <h4 className={`font-bold ${isTargetMet ? 'text-green-800' : 'text-red-800'} mb-2`}>
              判定: {isTargetMet ? '条件クリア (10%以下)' : 'まだ濃い (10%より大きい)'}
            </h4>
            <p className="text-sm">
              <InlineMath math={`\\frac{20}{100 + ${addedWater}} \\times 100 = ${currentConcentration.toFixed(1)}\\%`} />
            </p>
            {isTargetMet && (
              <p className="text-green-700 text-sm mt-2">
                水が {addedWater}g 追加されたことで、全体が {currentTotal}g となり、濃度が目標を達成しました。<br/>
                よって解は <InlineMath math="x \ge 100" /> となります。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaltWaterInequalityViz;
