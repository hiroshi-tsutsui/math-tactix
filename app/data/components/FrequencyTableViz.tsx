"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FrequencyTableViz = ({ onComplete }: { onComplete?: () => void }) => {
  // Class frequencies for [0,10), [10,20), [20,30), [30,40), [40,50)
  const [frequencies, setFrequencies] = useState([2, 5, 8, 3, 2]);

  const classes = [
    { min: 0, max: 10, mark: 5 },
    { min: 10, max: 20, mark: 15 },
    { min: 20, max: 30, mark: 25 },
    { min: 30, max: 40, mark: 35 },
    { min: 40, max: 50, mark: 45 },
  ];

  const maxFreq = 15;

  // Calculate totals
  const totalFreq = frequencies.reduce((sum, f) => sum + f, 0);
  const totalSum = frequencies.reduce((sum, f, i) => sum + f * classes[i].mark, 0);
  const mean = totalFreq > 0 ? totalSum / totalFreq : 0;

  // Find median class
  let medianClassIndex = -1;
  if (totalFreq > 0) {
    const target = totalFreq / 2;
    let accum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      accum += frequencies[i];
      if (accum >= target) {
        medianClassIndex = i;
        break;
      }
    }
  }

  // Find mode class (most frequent)
  let modeFreq = -1;
  let modeClassIndex = -1;
  frequencies.forEach((f, i) => {
    if (f > modeFreq) {
      modeFreq = f;
      modeClassIndex = i;
    }
  });

  const handleDrag = (index: number, newY: number, containerHeight: number) => {
    const scale = maxFreq / containerHeight;
    const value = Math.max(0, Math.min(maxFreq, Math.round((containerHeight - newY) * scale)));
    
    setFrequencies(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 min-h-[500px]">
      <h3 className="text-xl font-bold mb-4 text-slate-800">度数分布表と代表値 (ヒストグラム)</h3>
      <p className="text-sm text-slate-600 mb-6 max-w-2xl text-center">
        ヒストグラムの棒（度数）を上下にドラッグして、データ分布を操作しましょう。<br/>
        右側の「度数分布表」から平均値（階級値×度数の合計 / 総度数）や中央値の階級がどう変化するか確認してください。
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Histogram */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative h-64 border-b-2 border-l-2 border-slate-300 ml-8 mb-6">
            {/* Y-axis labels */}
            {[0, 5, 10, 15].map(v => (
              <div key={v} className="absolute left-[-24px] text-xs text-slate-500" style={{ bottom: `${(v / maxFreq) * 100}%`, transform: 'translateY(50%)' }}>
                {v}
              </div>
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {frequencies.map((f, i) => (
                <div key={i} className="relative flex-1 mx-1 group h-full flex items-end">
                  <div 
                    className={`w-full relative transition-all duration-75 ease-out rounded-t-sm cursor-ns-resize
                      ${i === medianClassIndex ? 'bg-purple-400 border-2 border-purple-500' : 'bg-blue-400 hover:bg-blue-500'}`}
                    style={{ height: `${(f / maxFreq) * 100}%` }}
                    onPointerDown={(e) => {
                      const container = e.currentTarget.parentElement;
                      if (!container) return;
                      const rect = container.getBoundingClientRect();
                      
                      const onMove = (moveEvt: PointerEvent) => {
                        const newY = moveEvt.clientY - rect.top;
                        handleDrag(i, newY, rect.height);
                      };
                      
                      const onUp = () => {
                        document.removeEventListener('pointermove', onMove);
                        document.removeEventListener('pointerup', onUp);
                      };
                      
                      document.addEventListener('pointermove', onMove);
                      document.addEventListener('pointerup', onUp);
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-700">
                      {f}
                    </div>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">
                    {classes[i].min}~{classes[i].max}
                  </div>
                </div>
              ))}
            </div>

            {/* Mean Line */}
            {totalFreq > 0 && (
              <div 
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 z-10 pointer-events-none transition-all duration-300"
                style={{ left: `${(mean / 50) * 100}%` }}
              >
                <div className="absolute -top-6 -translate-x-1/2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold shadow-sm whitespace-nowrap">
                  平均: {mean.toFixed(1)}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-8 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div>平均値 (Mean)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-400 border-2 border-purple-500 rounded-sm"></div>中央値の階級 (Median Class)</div>
          </div>
        </div>

        {/* Frequency Table */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="py-2 px-2 border-b">階級 (以上~未満)</th>
                <th className="py-2 px-2 border-b">階級値 (x)</th>
                <th className="py-2 px-2 border-b">度数 (f)</th>
                <th className="py-2 px-2 border-b">階級値 × 度数</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i === medianClassIndex ? 'bg-purple-50 font-medium' : ''}`}>
                  <td className="py-2">{cls.min} ~ {cls.max}</td>
                  <td className="py-2 text-slate-500">{cls.mark}</td>
                  <td className="py-2 font-bold text-blue-600">{frequencies[i]}</td>
                  <td className="py-2 text-slate-600">{cls.mark * frequencies[i]}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-800">
                <td className="py-3" colSpan={2}>計</td>
                <td className="py-3 text-blue-700">{totalFreq}</td>
                <td className="py-3">{totalSum}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">代表値の計算</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>
                <strong>平均値:</strong> (階級値×度数の合計) ÷ (総度数)<br/>
                = <span className="font-mono bg-white px-1 rounded">{totalSum} ÷ {totalFreq || 1}</span> = <strong className="text-red-600">{mean.toFixed(2)}</strong>
              </li>
              <li>
                <strong>最頻値 (モード):</strong> 最も度数が多い階級の階級値<br/>
                = <strong className="text-blue-600">{modeClassIndex >= 0 ? classes[modeClassIndex].mark : '-'}</strong> (度数: {modeFreq})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyTableViz;
