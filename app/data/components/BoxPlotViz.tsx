import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import HintButton from '../../components/HintButton';

type Point1D = { id: number; value: number };

export default function BoxPlotViz({ onComplete }: { onComplete?: (v: number) => void }) {
  const [points, setPoints] = useState<Point1D[]>([
    { id: 1, value: 2 },
    { id: 2, value: 3 },
    { id: 3, value: 4 },
    { id: 4, value: 5 },
    { id: 5, value: 5.5 },
    { id: 6, value: 7 },
    { id: 7, value: 9 },
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const nextId = useRef(10);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate quartiles
  const sorted = [...points].map(p => p.value).sort((a, b) => a - b);
  const n = sorted.length;
  
  const getMedian = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };

  const min = sorted.length > 0 ? sorted[0] : 0;
  const max = sorted.length > 0 ? sorted[sorted.length - 1] : 0;
  const median = getMedian(sorted);
  
  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = sorted.slice(Math.ceil(n / 2));
  
  const q1 = getMedian(lowerHalf);
  const q3 = getMedian(upperHalf);
  const iqr = q3 - q1;

  // Completion condition: Create an outlier or something, or just explore
  useEffect(() => {
    if (onComplete && max > q3 + 1.5 * iqr) {
      onComplete(1);
    }
  }, [max, q3, iqr, onComplete]);

  const handlePointerDown = (id: number) => setDraggingId(id);
  const handlePointerUp = () => setDraggingId(null);
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let newValue = (x / rect.width) * 10;
    newValue = Math.max(0, Math.min(10, newValue));
    setPoints(pts => pts.map(p => p.id === draggingId ? { ...p, value: newValue } : p));
  };

  const addPoint = () => {
    setPoints([...points, { id: nextId.current++, value: Math.random() * 8 + 1 }]);
  };

  const removePoint = (id: number) => {
    if (points.length > 4) {
      setPoints(pts => pts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none touch-none bg-white p-4 rounded-xl">
      <div 
        ref={containerRef}
        className="relative w-full h-80 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden my-4"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Axis */}
        <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-300"></div>
        {[0, 2, 4, 6, 8, 10].map(v => (
          <div key={v} className="absolute top-[78%] text-[10px] text-slate-400 font-mono -translate-x-1/2" style={{ left: `${(v / 10) * 100}%` }}>
            {v}
          </div>
        ))}
        
        {/* Box Plot Visualization */}
        {points.length >= 4 && (
          <div className="absolute top-1/3 left-0 right-0 h-16 pointer-events-none transition-all duration-100">
            {/* Whiskers */}
            <div className="absolute top-1/2 -translate-y-1/2 h-px bg-blue-500" style={{ left: `${(min / 10) * 100}%`, width: `${((q1 - min) / 10) * 100}%` }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 h-px bg-blue-500" style={{ left: `${(q3 / 10) * 100}%`, width: `${((max - q3) / 10) * 100}%` }}></div>
            
            {/* Whisker Caps */}
            <div className="absolute top-1/4 bottom-1/4 w-px bg-blue-500" style={{ left: `${(min / 10) * 100}%` }}></div>
            <div className="absolute top-1/4 bottom-1/4 w-px bg-blue-500" style={{ left: `${(max / 10) * 100}%` }}></div>

            {/* Box */}
            <div 
              className="absolute top-0 bottom-0 border-2 border-blue-500 bg-blue-100/50"
              style={{ left: `${(q1 / 10) * 100}%`, width: `${(iqr / 10) * 100}%` }}
            ></div>
            
            {/* Median Line */}
            <div className="absolute top-0 bottom-0 w-px bg-blue-600" style={{ left: `${(median / 10) * 100}%` }}></div>
          </div>
        )}

        {/* Draggable Points */}
        {points.map(p => (
          <div
            key={p.id}
            onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(p.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); removePoint(p.id); }}
            className={`absolute top-[75%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 cursor-grab flex items-center justify-center transition-colors
              ${draggingId === p.id ? 'bg-orange-500 border-white scale-125 z-10' : 'bg-slate-800 border-white hover:bg-slate-700'}
            `}
            style={{ left: `${(p.value / 10) * 100}%`, touchAction: 'none' }}
          />
        ))}
      </div>

      <div className="flex w-full justify-between items-center px-2">
        <div className="flex gap-4">
          <button onClick={addPoint} className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50">
            <Plus className="w-3 h-3" /> データ追加
          </button>
          <div className="text-[10px] text-slate-400 italic flex items-center">
            (ダブルクリックで削除)
          </div>
        </div>
        
        <div className="flex gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm overflow-x-auto text-[10px]">
          <div className="text-center min-w-[50px]">
            <div className="font-bold text-slate-400">最小値</div>
            <div className="font-mono text-base text-slate-800 font-bold">{min.toFixed(1)}</div>
          </div>
          <div className="text-center min-w-[50px]">
            <div className="font-bold text-slate-400">第1四分位</div>
            <div className="font-mono text-base text-slate-800 font-bold">{q1.toFixed(1)}</div>
          </div>
          <div className="text-center min-w-[50px]">
            <div className="font-bold text-slate-400">中央値</div>
            <div className="font-mono text-base text-blue-600 font-bold">{median.toFixed(1)}</div>
          </div>
          <div className="text-center min-w-[50px]">
            <div className="font-bold text-slate-400">第3四分位</div>
            <div className="font-mono text-base text-slate-800 font-bold">{q3.toFixed(1)}</div>
          </div>
          <div className="text-center min-w-[50px]">
            <div className="font-bold text-slate-400">最大値</div>
            <div className="font-mono text-base text-slate-800 font-bold">{max.toFixed(1)}</div>
          </div>
          <div className="text-center min-w-[50px] border-l border-slate-200 pl-4">
            <div className="font-bold text-slate-400">四分位範囲</div>
            <div className="font-mono text-base text-orange-600 font-bold">{iqr.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: "箱ひげ図は最小値・Q1・中央値・Q3・最大値の5数要約を表します" },
        { step: 2, text: "四分位範囲 IQR = Q3 - Q1 は箱の横幅に対応します" },
        { step: 3, text: "データを追加・削除して分布の変化を観察しましょう" },
      ]} />
    </div>
  );
}
