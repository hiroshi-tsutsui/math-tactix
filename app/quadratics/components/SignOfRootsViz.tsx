import React, { useState } from 'react';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
const SignOfRootsViz = ({ problem }: { problem: any }) => {
  const [m, setM] = useState(-2.5);

  // x^2 + mx + m + 3 = 0
  const a = 1;
  const b = m;
  const c = m + 3;

  const discriminant = b * b - 4 * a * c;
  const sumOfRoots = -b / a;
  const productOfRoots = c / a;

  const isDPositive = discriminant > 0;
  const isSumPositive = sumOfRoots > 0;
  const isProductPositive = productOfRoots > 0;

  const isCorrect = isDPositive && isSumPositive && isProductPositive;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2次方程式の実数解の符号（視覚化）</h3>
      <div className="text-slate-600 mb-6 space-y-2">
        <MathDisplay tex={problem.equation} displayMode />
        <p className="text-sm">{problem.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            パラメータ m の値: <span className="text-indigo-600 font-bold">{m.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-6"
            max="2"
            step="0.1"
            value={m}
            onChange={(e) => setM(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-6"
          />

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 mb-2">3つの条件の確認:</h4>
            
            <div className={`flex items-center justify-between p-2 rounded ${isDPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="text-xs font-bold">① 判別式 D &gt; 0</span>
              <span>{isDPositive ? '✓' : '×'}</span>
            </div>
            
            <div className={`flex items-center justify-between p-2 rounded ${isSumPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="text-xs font-bold">② 和 α+β &gt; 0 (軸が右)</span>
              <span>{isSumPositive ? '✓' : '×'}</span>
            </div>

            <div className={`flex items-center justify-between p-2 rounded ${isProductPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="text-xs font-bold">③ 積 αβ &gt; 0 (y切片が正)</span>
              <span>{isProductPositive ? '✓' : '×'}</span>
            </div>

            {isCorrect && (
              <div className="mt-4 p-2 bg-indigo-100 text-indigo-800 text-center text-sm font-bold rounded">
                2つの正の実数解をもつ条件クリア！<br />({problem.correctAnswer})
              </div>
            )}
          </div>
        </div>

        <div className="relative h-[300px] border border-slate-200 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            <g stroke="#e2e8f0" strokeWidth="1">
              {[...Array(11)].map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={i * 40} y1="0" x2={i * 40} y2="300" />
                  <line x1="0" y1={i * 30} x2="400" y2={i * 30} />
                </React.Fragment>
              ))}
            </g>
            <line x1="0" y1="150" x2="400" y2="150" stroke="#64748b" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#64748b" strokeWidth="2" />
            
            <rect x="200" y="0" width="200" height="300" fill="rgba(74, 222, 128, 0.1)" />
            <circle cx="200" cy={150 - c * 15} r="6" fill={c > 0 ? "#22c55e" : "#ef4444"} />

            <polyline
              points={
                [...Array(101)].map((_, i) => {
                  const px = -5 + (i * 0.1);
                  const py = a * px * px + b * px + c;
                  return `${200 + px * 40},${150 - py * 15}`;
                }).join(' ')
              }
              fill="none"
              stroke={isCorrect ? "#4f46e5" : "#94a3b8"}
              strokeWidth="3"
            />
          </svg>
        </div>
      
      <HintButton hints={[
        { step: 1, text: "解の符号は解と係数の関係で判定できます。α + β = -b/a、αβ = c/a です。" },
        { step: 2, text: "2解とも正: D ≧ 0、α + β > 0、αβ > 0 の3条件。" },
        { step: 3, text: "2解とも負: D ≧ 0、α + β < 0、αβ > 0。正と負: αβ < 0 のみ。" },
      ]} />
    </div>
    </div>
  );
};

export default SignOfRootsViz;
