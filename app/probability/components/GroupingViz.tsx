import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

export default function GroupingViz() {
  const [totalPeople, setTotalPeople] = useState(6);
  const [groupSize, setGroupSize] = useState(2);
  const [hasLabels, setHasLabels] = useState(true);

  // For 6 people, 2 per group: groups = 3
  // For 4 people, 2 per group: groups = 2
  // We'll restrict totalPeople to 4, 6, 8, 9 depending on what's evenly divisible.
  const numGroups = Math.floor(totalPeople / groupSize);
  
  const labeledAns: number = Array.from({length: numGroups}).reduce((acc: number, _, i) => {
    let remain = totalPeople - i * groupSize;
    let comb = factorial(remain) / (factorial(groupSize) * factorial(remain - groupSize));
    return acc * comb;
  }, 1);

  const unlabeledAns = labeledAns / factorial(numGroups);

  const currentAns = hasLabels ? labeledAns : unlabeledAns;

  function factorial(n: number): number {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }

  // Generate people icons
  const people = Array.from({length: totalPeople}, (_, i) => String.fromCharCode(65 + i)); // A, B, C, D...

  return (
    <div className="w-full h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">組分け (Grouping)</h2>
        <p className="text-slate-300 text-sm mb-4">
          {totalPeople}人を{groupSize}人ずつ、{numGroups}つの{hasLabels ? "部屋(区別あり)" : "組(区別なし)"}に分ける方法は何通りあるか？
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">総人数 (n): {totalPeople}</label>
              <input type="range" min="4" max="8" step="2" value={totalPeople} onChange={(e) => {
                const newT = parseInt(e.target.value);
                setTotalPeople(newT);
                if (newT % groupSize !== 0) setGroupSize(2); // reset if invalid
              }} className="w-full accent-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">1組の人数: {groupSize}</label>
              <input type="range" min="1" max={Math.floor(totalPeople/2)} step="1" value={groupSize} 
                onChange={(e) => {
                  let v = parseInt(e.target.value);
                  if (totalPeople % v !== 0) {
                     // find nearest valid divisor
                     v = [1,2,3,4].find(d => totalPeople % d === 0 && d >= v) || 1;
                  }
                  setGroupSize(v);
                }} 
                className="w-full accent-green-500" />
                <p className="text-xs text-slate-500">※均等に分けられる人数のみ</p>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${hasLabels ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                onClick={() => setHasLabels(true)}
              >
                部屋に区別あり (Labeled)
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${!hasLabels ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                onClick={() => setHasLabels(false)}
              >
                組に区別なし (Unlabeled)
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-700">
             <div className="flex space-x-4 mb-6">
                {Array.from({length: numGroups}).map((_, i) => (
                  <div key={i} className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 border-dashed ${hasLabels ? 'border-blue-500 bg-blue-500/10' : 'border-orange-500 bg-orange-500/10'}`}>
                    <span className={`text-xs font-bold mb-2 ${hasLabels ? 'text-blue-400' : 'text-orange-400'}`}>
                      {hasLabels ? `部屋 ${i + 1}` : `組`}
                    </span>
                    <div className="flex space-x-1">
                       {Array.from({length: groupSize}).map((_, j) => (
                          <div key={j} className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
                             ?
                          </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">総数:</p>
                <div className="text-3xl font-bold text-white">
                  {currentAns} <span className="text-lg font-normal text-slate-400">通り</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-4">
          <h3 className="font-bold text-white border-b border-slate-700 pb-2">解説</h3>
          {hasLabels ? (
            <div>
              <p className="text-slate-300 text-sm mb-2">
                部屋に区別があるため、順番に人を選んでいきます。
              </p>
              <BlockMath math={`\\text{部屋1: } {}_{${totalPeople}}\\text{C}_{${groupSize}} \\times \\text{部屋2: } {}_{${totalPeople - groupSize}}\\text{C}_{${groupSize}} \\dots`} />
              <BlockMath math={`= ${labeledAns} \\text{ 通り}`} />
            </div>
          ) : (
            <div>
              <p className="text-slate-300 text-sm mb-2">
                組に区別がない場合、区別した場合の順列（{numGroups}! 通り）が重複して数えられています。
                そのため、区別した場合の総数を <InlineMath math={`${numGroups}!`} /> で割ります。
              </p>
              <BlockMath math={`\\frac{${labeledAns}}{${numGroups}!} = ${unlabeledAns} \\text{ 通り}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
