import React, { useState, useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { Sliders, RefreshCw, Eye } from 'lucide-react';

const IntegerSolutionsViz = () => {
  const [a, setA] = useState(3.5);
  const [includeBoundary, setIncludeBoundary] = useState(false);
  const [targetCount, setTargetCount] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // x < a or x <= a, positive integers x
  const getSolutions = () => {
    const maxInt = includeBoundary ? Math.floor(a) : Math.ceil(a) - 1;
    const sols = [];
    for (let i = 1; i <= Math.max(0, maxInt); i++) {
      sols.push(i);
    }
    return sols;
  };

  const solutions = getSolutions();
  const isCorrect = solutions.length === targetCount;

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI canvas setup
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate mapping
    const minX = -1;
    const maxX = 6;
    const toCanvasX = (val: number) => 40 + ((val - minX) / (maxX - minX)) * (width - 80);
    const yAxis = height / 2;

    // Draw region x < a or x <= a
    ctx.beginPath();
    ctx.rect(0, yAxis - 40, toCanvasX(a), 80);
    ctx.fillStyle = isCorrect ? 'rgba(79, 70, 229, 0.1)' : 'rgba(148, 163, 184, 0.1)';
    ctx.fill();

    // Draw main number line
    ctx.beginPath();
    ctx.moveTo(toCanvasX(minX), yAxis);
    ctx.lineTo(toCanvasX(maxX), yAxis);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw integer ticks
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '500 14px ui-sans-serif, system-ui';

    for (let i = minX; i <= maxX; i++) {
      const cx = toCanvasX(i);
      ctx.beginPath();
      ctx.moveTo(cx, yAxis - 6);
      ctx.lineTo(cx, yAxis + 6);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillText(i.toString(), cx, yAxis + 15);
    }

    // Draw solutions (positive integers)
    for (let i = 1; i <= maxX; i++) {
      const cx = toCanvasX(i);
      const isSol = i <= (includeBoundary ? Math.floor(a) : Math.ceil(a) - 1);
      
      if (isSol) {
        ctx.beginPath();
        ctx.arc(cx, yAxis, 6, 0, Math.PI * 2);
        ctx.fillStyle = isCorrect ? '#4f46e5' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw boundary 'a'
    const ax = toCanvasX(a);
    
    // Draw vertical line for boundary
    ctx.beginPath();
    ctx.moveTo(ax, yAxis);
    ctx.lineTo(ax, yAxis - 40);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw horizontal arrow pointing left
    ctx.beginPath();
    ctx.moveTo(ax, yAxis - 40);
    ctx.lineTo(ax - 20, yAxis - 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ax - 20, yAxis - 40);
    ctx.lineTo(ax - 12, yAxis - 46);
    ctx.lineTo(ax - 12, yAxis - 34);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();

    // Draw circle for 'a' (open or closed)
    ctx.beginPath();
    ctx.arc(ax, yAxis, 5, 0, Math.PI * 2);
    if (includeBoundary) {
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
    } else {
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Label 'a'
    ctx.fillStyle = '#4f46e5';
    ctx.fillText('a', ax, yAxis - 60);

  }, [a, includeBoundary, isCorrect]);

  return (
    <div className="bg-slate-50 p-6 rounded-2xl space-y-8 border border-slate-100 shadow-inner">
      <div className="flex items-center space-x-2 mb-4">
        <Sliders className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-700">条件シミュレーター</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">問題設定</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                不等式の形
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIncludeBoundary(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    !includeBoundary ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  } border`}
                >
                  <InlineMath math="x < a" />
                </button>
                <button
                  onClick={() => setIncludeBoundary(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    includeBoundary ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  } border`}
                >
                  <InlineMath math="x \le a" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                目標: 正の整数解がちょうど {targetCount} 個
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1個</span>
                <span>2個</span>
                <span>3個</span>
                <span>4個</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">境界 a の調整</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                <InlineMath math="a = " /> {a.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-48 relative overflow-hidden flex flex-col justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className={`p-4 rounded-xl border flex flex-col justify-center items-center transition-all ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <span className={`text-sm font-bold mb-2 ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              現在の解の個数: {solutions.length}個 {isCorrect ? '(正解!)' : ''}
            </span>
            <span className={`text-xs ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
              含まれる整数: {solutions.length > 0 ? solutions.join(', ') : 'なし'}
            </span>
          </div>

          {isCorrect && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-sm font-bold text-indigo-800 mb-2">💡 視覚的ポイント</h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                {targetCount}個の整数が含まれるためには、境界線 <InlineMath math="a" /> が <InlineMath math={targetCount.toString()} /> と <InlineMath math={(targetCount + 1).toString()} /> の間にある必要があります。<br/>
                さらに、不等号が {includeBoundary ? '「≦ (含む)」' : '「< (含まない)」'} であることに注意して、境界ギリギリのときの判定を考えましょう。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegerSolutionsViz;
