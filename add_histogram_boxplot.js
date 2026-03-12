const fs = require('fs');
const path = require('path');

const code = `
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function HistogramBoxPlotViz({ onComplete }: { onComplete?: () => void }) {
  // Bins: 0-10, 10-20, ... 90-100 (10 bins)
  const [frequencies, setFrequencies] = useState<number[]>([2, 5, 8, 12, 10, 6, 4, 2, 1, 0]);
  const maxFreq = 20;

  // Generate individual data points assuming uniform distribution within each bin
  const data = useMemo(() => {
    let pts: number[] = [];
    frequencies.forEach((freq, i) => {
      const min = i * 10;
      const max = (i + 1) * 10;
      for (let j = 0; j < freq; j++) {
        // Uniformly space points in the bin
        const val = freq === 1 ? (min + max) / 2 : min + ((j + 0.5) / freq) * 10;
        pts.push(val);
      }
    });
    return pts.sort((a, b) => a - b);
  }, [frequencies]);

  // Calculate Quartiles
  const stats = useMemo(() => {
    const n = data.length;
    if (n === 0) return { min: 0, q1: 0, med: 0, q3: 0, max: 0, total: 0 };
    
    const getPercentile = (p: number) => {
      const idx = (n - 1) * p;
      const lower = Math.floor(idx);
      const upper = Math.ceil(idx);
      const weight = idx - lower;
      return data[lower] * (1 - weight) + data[upper] * weight;
    };

    return {
      min: data[0],
      q1: getPercentile(0.25),
      med: getPercentile(0.5),
      q3: getPercentile(0.75),
      max: data[n - 1],
      total: n
    };
  }, [data]);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent, i: number, containerRef: React.RefObject<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientY = 0;
    if ('touches' in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }
    const y = clientY - rect.top;
    const h = rect.height;
    let newFreq = Math.round(((h - y) / h) * maxFreq);
    newFreq = Math.max(0, Math.min(maxFreq, newFreq));
    
    setFrequencies(prev => {
      const next = [...prev];
      next[i] = newFreq;
      return next;
    });
  };

  useEffect(() => {
    if (stats.total > 0 && onComplete) onComplete();
  }, [stats.total, onComplete]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">ヒストグラムと箱ひげ図の対応</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          ヒストグラムの棒の高さをドラッグして分布を変えてみましょう。<br/>
          データ全体を4等分する位置（第1四分位数、中央値、第3四分位数）が面積によって決まり、下の箱ひげ図が連動して変化します。
        </p>
      </div>

      <div className="flex gap-4">
        {/* Left: Interactive Graph */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Histogram */}
          <div className="relative h-64 border-b border-l border-slate-300 ml-8">
            <div className="absolute top-0 -left-8 h-full flex flex-col justify-between text-xs text-slate-400 pb-1">
              <span>{maxFreq}</span>
              <span>{maxFreq / 2}</span>
              <span>0</span>
            </div>
            
            <div className="absolute inset-0 flex items-end">
              {frequencies.map((freq, i) => {
                const heightPct = (freq / maxFreq) * 100;
                const containerRef = useRef<HTMLDivElement>(null);
                
                return (
                  <div 
                    key={i} 
                    ref={containerRef}
                    className="flex-1 h-full relative group cursor-ns-resize"
                    onMouseDown={(e) => {
                      handleDrag(e, i, containerRef);
                      const move = (e2: MouseEvent) => handleDrag(e2 as any, i, containerRef);
                      const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                      window.addEventListener('mousemove', move);
                      window.addEventListener('mouseup', up);
                    }}
                    onTouchStart={(e) => {
                      handleDrag(e, i, containerRef);
                      const move = (e2: TouchEvent) => handleDrag(e2 as any, i, containerRef);
                      const up = () => { window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up); };
                      window.addEventListener('touchmove', move);
                      window.addEventListener('touchend', up);
                    }}
                  >
                    <motion.div 
                      className="absolute bottom-0 left-0.5 right-0.5 bg-blue-200 group-hover:bg-blue-300 border border-blue-400 rounded-t-sm transition-colors"
                      animate={{ height: \`\${heightPct}%\` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-500">
                      {i * 10}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box Plot Aligned */}
          <div className="relative h-24 ml-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -translate-y-1/2" />
            
            {stats.total > 0 && (
              <>
                {/* Whiskers */}
                <motion.div 
                  className="absolute top-1/2 h-0.5 bg-slate-700 -translate-y-1/2"
                  animate={{ left: \`\${stats.min}%\`, width: \`\${stats.max - stats.min}%\` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                
                {/* Min / Max lines */}
                <motion.div className="absolute top-1/4 h-1/2 w-0.5 bg-slate-700" animate={{ left: \`\${stats.min}%\` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                <motion.div className="absolute top-1/4 h-1/2 w-0.5 bg-slate-700" animate={{ left: \`\${stats.max}%\` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />

                {/* Box */}
                <motion.div 
                  className="absolute top-1/4 h-1/2 border-2 border-slate-700 bg-white shadow-sm"
                  animate={{ left: \`\${stats.q1}%\`, width: \`\${stats.q3 - stats.q1}%\` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    animate={{ left: \`\${((stats.med - stats.q1) / (stats.q3 - stats.q1)) * 100}%\` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </motion.div>
                
                {/* Vertical Alignment Dashed Lines */}
                <motion.div className="absolute bottom-full mb-2 w-px h-64 border-l-2 border-dashed border-red-400 pointer-events-none opacity-50" animate={{ left: \`\${stats.med}%\` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                <motion.div className="absolute bottom-full mb-2 w-px h-64 border-l border-dashed border-slate-400 pointer-events-none opacity-50" animate={{ left: \`\${stats.q1}%\` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                <motion.div className="absolute bottom-full mb-2 w-px h-64 border-l border-dashed border-slate-400 pointer-events-none opacity-50" animate={{ left: \`\${stats.q3}%\` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              </>
            )}
            
            {/* Axis */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-xs text-slate-400">
              {[0, 20, 40, 60, 80, 100].map(v => (
                <span key={v} className="relative before:absolute before:-top-2 before:left-1/2 before:w-px before:h-2 before:bg-slate-300" style={{ transform: 'translateX(-50%)' }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Stats Panel */}
        <div className="w-64 bg-slate-50 rounded-xl p-5 border border-slate-200 h-fit">
          <h4 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">リアルタイム指標</h4>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">データ総数 (n)</div>
              <div className="text-lg font-mono text-slate-800">{stats.total}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">最小値</div>
                <div className="text-sm font-mono text-slate-700">{stats.min.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">最大値</div>
                <div className="text-sm font-mono text-slate-700">{stats.max.toFixed(1)}</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">第1四分位数 (Q1)</span>
                <span className="font-mono text-sm">{stats.q1.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-red-500 font-bold">中央値 (Q2)</span>
                <span className="font-mono text-sm text-red-600 font-bold">{stats.med.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">第3四分位数 (Q3)</span>
                <span className="font-mono text-sm">{stats.q3.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-1">四分位範囲 (IQR)</div>
              <div className="text-sm font-mono text-indigo-600">{(stats.q3 - stats.q1).toFixed(1)}</div>
              <p className="text-[10px] text-slate-400 mt-1">
                ※ 箱の横幅。データの中央50%がどの程度散らばっているかを示します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'app/data/components/HistogramBoxPlotViz.tsx'), code);
console.log('Component created.');
