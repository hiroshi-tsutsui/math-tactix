import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Point1D = { id: number; value: number };

export default function VarianceViz({ onComplete }: { onComplete?: (v: number) => void }) {
  const [points, setPoints] = useState<Point1D[]>([
    { id: 1, value: 3 },
    { id: 2, value: 5 },
    { id: 3, value: 6 },
    { id: 4, value: 8 },
    { id: 5, value: 9 },
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const nextId = useRef(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const mean = points.length > 0 ? points.reduce((s, p) => s + p.value, 0) / points.length : 0;
  const variance = points.length > 0 ? points.reduce((s, p) => s + Math.pow(p.value - mean, 2), 0) / points.length : 0;
  const stdDev = Math.sqrt(variance);

  useEffect(() => {
    if (onComplete && stdDev < 1.0 && points.length >= 4) {
      onComplete(variance);
    }
  }, [variance, onComplete]);

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
    if (points.length > 2) {
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
        <div className="absolute bottom-10 left-0 right-0 h-px bg-slate-300"></div>
        {[0, 2, 4, 6, 8, 10].map(v => (
          <div key={v} className="absolute bottom-6 text-[10px] text-slate-400 font-mono -translate-x-1/2" style={{ left: `${(v / 10) * 100}%` }}>
            {v}
          </div>
        ))}
        
        {points.length > 0 && (
          <div 
            className="absolute top-0 bottom-10 border-l-2 border-blue-500 border-dashed transition-all duration-100"
            style={{ left: `${(mean / 10) * 100}%` }}
          >
            <div className="absolute top-2 -translate-x-1/2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
              平均: {mean.toFixed(2)}
            </div>
          </div>
        )}

        {points.map(p => {
          const dev = p.value - mean;
          const sizeStr = `${(Math.abs(dev) / 10) * 100}%`;
          return (
            <div
              key={`sq-${p.id}`}
              className="absolute bottom-10 bg-orange-200/40 border border-orange-400/60 pointer-events-none transition-all duration-100"
              style={{
                left: dev > 0 ? `${(mean / 10) * 100}%` : `${(p.value / 10) * 100}%`,
                width: sizeStr,
                height: `calc(100% * ${(Math.abs(dev) / 10)})`
              }}
            />
          );
        })}

        {points.map(p => (
          <div
            key={p.id}
            onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(p.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); removePoint(p.id); }}
            className={`absolute bottom-10 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full border-2 cursor-grab flex items-center justify-center transition-colors
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
        
        <div className="flex gap-6 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400">分散 (Variance)</div>
            <div className="font-mono text-lg text-slate-800 font-bold">{variance.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400">標準偏差 (Std Dev)</div>
            <div className="font-mono text-lg text-blue-600 font-bold">{stdDev.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
