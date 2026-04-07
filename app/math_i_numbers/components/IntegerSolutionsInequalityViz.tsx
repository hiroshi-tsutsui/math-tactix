"use client";
import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

export default function IntegerSolutionsInequalityViz() {
  const [a, setA] = useState<number>(4.5);
  const p = 2; // Fixed lower bound x > 2
  const targetCount = 3; // We want exactly 3 integer solutions (3, 4, 5)

  // Calculate the integer solutions
  const getSolutions = () => {
    let solutions = [];
    for (let i = Math.floor(p) + 1; i <= Math.floor(a); i++) {
      if (i > p && i <= a) {
        solutions.push(i);
      }
    }
    return solutions;
  };

  const solutions = getSolutions();
  const isCorrect = solutions.length === targetCount;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <h3 className="font-bold text-slate-800 text-center text-lg">
          連立不等式の整数解の個数 (Number of Integer Solutions)
        </h3>
        
        <p className="text-sm text-slate-600 text-center">
          次の連立不等式を満たす整数 <InlineMath math="x" /> が<strong>ちょうど {targetCount} 個</strong>となるような、定数 <InlineMath math="a" /> の値の範囲を求めてください。
        </p>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-center text-lg">
          <BlockMath math={`\\begin{cases} x > ${p} \\\\ x \\le a \\end{cases}`} />
        </div>

        <div className="flex flex-col items-center space-y-2 mt-4">
          <label className="text-sm font-semibold text-slate-700">
            パラメータ <InlineMath math="a" /> の値: {a.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="2" max="8" step="0.1" 
            value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full max-w-md accent-indigo-600"
          />
        </div>

        {/* Number Line Visualization */}
        <div className="relative w-full h-32 bg-white rounded-lg border border-slate-200 mt-6 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 800 120" className="w-full h-full">
            {/* Axis */}
            <line x1="50" y1="80" x2="750" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="750,75 760,80 750,85" fill="#94a3b8" />

            {/* Ticks and Labels */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(tick => {
              const x = 50 + (tick / 8) * 650;
              return (
                <g key={tick}>
                  <line x1={x} y1="75" x2={x} y2="85" stroke="#94a3b8" strokeWidth="2" />
                  <text x={x} y="105" textAnchor="middle" className="text-sm fill-slate-500">{tick}</text>
                  
                  {/* Highlight integer points if they are solutions */}
                  {solutions.includes(tick) && (
                    <circle cx={x} cy="80" r="6" fill="#4f46e5" className="animate-pulse" />
                  )}
                </g>
              );
            })}

            {/* Range Box */}
            <rect 
              x={50 + (p / 8) * 650} 
              y="40" 
              width={Math.max(0, (a - p) / 8 * 650)} 
              height="40" 
              fill="#4f46e5" 
              fillOpacity="0.15" 
            />

            {/* Left bound (Open circle for x > 2) */}
            <line x1={50 + (p / 8) * 650} y1="40" x2={50 + (p / 8) * 650} y2="80" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4" />
            <circle cx={50 + (p / 8) * 650} cy="40" r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />

            {/* Right bound (Closed circle for x <= a) */}
            <line x1={50 + (a / 8) * 650} y1="40" x2={50 + (a / 8) * 650} y2="80" stroke="#4f46e5" strokeWidth="2" />
            <circle cx={50 + (a / 8) * 650} cy="40" r="4" fill="#4f46e5" stroke="#4f46e5" strokeWidth="2" />
            <text x={50 + (a / 8) * 650} y="30" textAnchor="middle" className="text-sm font-bold fill-indigo-700">a</text>
          </svg>
        </div>

        {/* Solution feedback */}
        <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700">現在の整数解:</span>
            <span className={`font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {solutions.length > 0 ? solutions.join(', ') : 'なし'} （計 {solutions.length} 個）
            </span>
          </div>
          {isCorrect && (
            <div className="mt-2 text-sm text-green-700 text-center font-bold animate-fade-in">
              🎯 条件クリア！ 整数解がちょうど3個（3, 4, 5）含まれています。
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
        <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
          <span className="text-xl mr-2">💡</span> 直感的な理解 (Intuitive Understanding)
        </h4>
        <p className="text-sm text-indigo-800 leading-relaxed space-y-2">
          この問題は、数直線上をスライドする「壁」として理解できます。壁 <InlineMath math="a" /> が右に動くにつれて、内側に取り込まれる整数が一つずつ増えます。
          <br /><br />
          <strong>境界の判定（= が入るかどうか）の罠：</strong><br />
          • もし <InlineMath math="a = 5" /> になるとどうなるか？ → <InlineMath math="x \le 5" /> となるため、<InlineMath math="x = 5" /> は「含まれます」。よって、<InlineMath math="a" /> は 5 を含んで良いので <InlineMath math="5 \le a" /> となります。<br />
          • もし <InlineMath math="a = 6" /> になるとどうなるか？ → <InlineMath math="x \le 6" /> となり、<InlineMath math="x = 6" /> が「4個目の整数」として入り込んでしまいます。よって、<InlineMath math="a" /> は 6 に到達してはいけないため <InlineMath math="a < 6" /> となります。<br />
          したがって、正解は <InlineMath math="5 \le a < 6" /> です。白丸（含まない）と黒丸（含む）の違いを視覚的に確かめましょう。
        </p>
      </div>
      <HintButton hints={[
        { step: 1, text: "不等式を解いて、解の範囲を数直線上に表しましょう。" },
        { step: 2, text: "解の範囲に含まれる整数を数え上げます。境界の等号（≤ か <）に注意してください。" },
        { step: 3, text: "整数解がちょうど指定の個数になるための条件を、端の整数から考えます。" },
        { step: 4, text: "境界値が整数のときは、含む（≤）か含まない（<）かで答えが変わります。" }
      ]} />
    </div>
  );
}
