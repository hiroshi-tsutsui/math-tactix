import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const MovingRightEdgeViz: React.FC = () => {
  const [a, setA] = useState(1.5);
  const [mode, setMode] = useState<'min' | 'max'>('min');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parabola: y = x^2 - 4x
  // Vertex: x=2, y=-4. Roots: x=0, x=4
  const axis = 2;
  const f = (x: number) => x * x - 4 * x;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Map coordinates: x in [-1, 6], y in [-5, 6]
    const minX = -1, maxX = 6;
    const minY = -5, maxY = 6;
    const mapX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const mapY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      ctx.beginPath(); ctx.moveTo(mapX(x), 0); ctx.lineTo(mapX(x), height); ctx.stroke();
    }
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      ctx.beginPath(); ctx.moveTo(0, mapY(y)); ctx.lineTo(width, mapY(y)); ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, mapY(0)); ctx.lineTo(width, mapY(0)); ctx.stroke(); // x-axis
    ctx.beginPath(); ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), height); ctx.stroke(); // y-axis

    // Draw the full parabola (faded)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = minX; x <= maxX; x += 0.05) {
      if (x === minX) ctx.moveTo(mapX(x), mapY(f(x)));
      else ctx.lineTo(mapX(x), mapY(f(x)));
    }
    ctx.stroke();

    // Draw axis of symmetry
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(mapX(axis), 0); ctx.lineTo(mapX(axis), height); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('軸 x=2', mapX(axis) + 5, mapY(-4.5));

    // Draw domain [0, a]
    ctx.fillStyle = 'rgba(147, 197, 253, 0.2)'; // light blue region
    ctx.fillRect(mapX(0), 0, mapX(a) - mapX(0), height);
    
    // Draw domain boundaries
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mapX(a), 0); ctx.lineTo(mapX(a), height); ctx.stroke();
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(`x=a (${a.toFixed(1)})`, mapX(a) + 5, 20);
    ctx.fillText(`x=0`, mapX(0) - 25, 20);

    // If Max mode, draw the center of the domain x = a/2
    if (mode === 'max') {
        const center = a / 2;
        ctx.strokeStyle = '#f59e0b'; // amber
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(mapX(center), 0); ctx.lineTo(mapX(center), height); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#d97706';
        ctx.fillText(`中央 x=${center.toFixed(2)}`, mapX(center) + 5, height - 20);
    }

    // Draw parabola segment inside domain
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 0; x <= a; x += 0.05) {
      if (x === 0) ctx.moveTo(mapX(x), mapY(f(x)));
      else ctx.lineTo(mapX(x), mapY(f(x)));
    }
    ctx.lineTo(mapX(a), mapY(f(a))); // ensure strict end
    ctx.stroke();

    // Highlight Min/Max Point
    let targetX = 0;
    if (mode === 'min') {
        if (a < axis) targetX = a;
        else targetX = axis;
    } else {
        const center = a / 2;
        if (center < axis) targetX = 0;
        else if (Math.abs(center - axis) < 0.01) targetX = 0; // both 0 and a, we'll draw both
        else targetX = a;
    }

    ctx.fillStyle = mode === 'min' ? '#ef4444' : '#10b981';
    ctx.beginPath();
    ctx.arc(mapX(targetX), mapY(f(targetX)), 6, 0, 2 * Math.PI);
    ctx.fill();

    if (mode === 'max' && Math.abs(a/2 - axis) < 0.01) {
        ctx.beginPath();
        ctx.arc(mapX(a), mapY(f(a)), 6, 0, 2 * Math.PI);
        ctx.fill();
    }

  }, [a, mode]);

  // Determine current case string
  const getCaseText = () => {
      if (mode === 'min') {
          if (a < 2) return "場合分け①: a < 2 (右端が軸より左)";
          return "場合分け②: a ≥ 2 (右端が軸を越える)";
      } else {
          const center = a / 2;
          if (center < 2) return "場合分け①: a/2 < 2 つまり a < 4 (定義域の中央が軸より左)";
          if (Math.abs(center - 2) < 0.01) return "場合分け②: a/2 = 2 つまり a = 4 (定義域の中央が軸と一致)";
          return "場合分け③: a/2 > 2 つまり a > 4 (定義域の中央が軸より右)";
      }
  };

  const getExplanation = () => {
      if (mode === 'min') {
          if (a < 2) return "定義域内に頂点が含まれないため、右端 x = a で最小値をとります。";
          return "定義域内に頂点が含まれるため、頂点 x = 2 で最小値をとります。";
      } else {
          const center = a / 2;
          if (center < 2) return "定義域の中央が軸(x=2)より左にあるため、軸から遠い左端 x = 0 で最大値をとります。";
          if (Math.abs(center - 2) < 0.01) return "定義域の中央が軸(x=2)と一致するため、両端 x = 0, 4 で最大値をとります。";
          return "定義域の中央が軸(x=2)より右にあるため、軸から遠い右端 x = a で最大値をとります。";
      }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
        定義域の右端が動く最大・最小
      </h3>
      
      <div className="mb-4 p-4 bg-slate-50 rounded-lg text-slate-700">
        <p>関数: <MathDisplay tex="y = x^2 - 4x \quad (0 \le x \le a)" /></p>
        <p className="mt-2 text-sm text-slate-500">
          この関数の軸は <MathDisplay tex="x = 2" /> です。右端 <MathDisplay tex="a" /> の値が大きくなるにつれて、定義域 <MathDisplay tex="[0, a]" /> が右に伸びていきます。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    求める値:
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('min')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'min' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}
                    >
                        最小値
                    </button>
                    <button
                        onClick={() => setMode('max')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'max' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}
                    >
                        最大値
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    定義域の右端 <MathDisplay tex="a" /> : <span className="text-blue-600">{a.toFixed(1)}</span>
                </label>
                <input
                    type="range"
                    min="0.5"
                    max="5.5"
                    step="0.1"
                    value={a}
                    onChange={(e) => setA(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                />
            </div>

            <div className={`p-4 rounded-lg border-l-4 ${mode === 'min' ? 'bg-red-50 border-red-400 text-red-800' : 'bg-emerald-50 border-emerald-400 text-emerald-800'}`}>
                <div className="font-bold mb-2">{getCaseText()}</div>
                <div className="text-sm">{getExplanation()}</div>
            </div>
        </div>

        <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-center">
            <canvas ref={canvasRef} width={400} height={350} className="bg-white border border-slate-300 rounded-md shadow-sm w-full max-w-[400px]" />
        </div>
      
      <HintButton hints={[
        { step: 1, text: "定義域の右端が動くとき、最小値・最大値の取り方が場合分けで変わります。" },
        { step: 2, text: "右端が軸の左側か右側かで、最小値がどの点で達成されるかが変わります。" },
        { step: 3, text: "スライダーを動かして、場合分けの境界がどこにあるか確認しましょう。" },
      ]} />
    </div>
    </div>
  );
};

export default MovingRightEdgeViz;
