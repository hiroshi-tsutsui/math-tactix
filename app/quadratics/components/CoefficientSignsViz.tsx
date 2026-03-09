import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import katex from 'katex';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

export default function CoefficientSignsViz() {
  const [a, setA] = useState(-1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(3);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const D = b * b - 4 * a * c;
  const f_1 = a + b + c;
  const axis = -b / (2 * a);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    const scale = 30; // pixels per unit
    const cx = width / 2;
    const cy = height / 2;

    const toScreenX = (x: number) => cx + x * scale;
    const toScreenY = (y: number) => cy - y * scale;

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) {
      ctx.beginPath(); ctx.moveTo(toScreenX(x), 0); ctx.lineTo(toScreenX(x), height); ctx.stroke();
    }
    for (let y = -10; y <= 10; y++) {
      ctx.beginPath(); ctx.moveTo(0, toScreenY(y)); ctx.lineTo(width, toScreenY(y)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();

    // Marks for x=1
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('1', toScreenX(1) - 4, cy + 15);
    ctx.beginPath(); ctx.arc(toScreenX(1), cy, 3, 0, Math.PI * 2); ctx.fill();
    
    // Y-intercept
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(cx, toScreenY(c), 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillText('c', cx + 10, toScreenY(c) + 4);

    // Axis of symmetry
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(toScreenX(axis), 0); ctx.lineTo(toScreenX(axis), height); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.fillText('x = -b/2a', toScreenX(axis) + 5, 20);

    // The Parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - cx) / scale;
      const y = a * x * x + b * x + c;
      const py = toScreenY(y);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // f(1) point
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(toScreenX(1), toScreenY(f_1), 5, 0, Math.PI * 2); ctx.fill();

  }, [a, b, c]);

  const StatBox = ({ label, value, explanation, color }: { label: string, value: number, explanation: string, color: string }) => {
    const isPositive = value > 0;
    const isZero = value === 0;
    const signStr = isPositive ? '> 0' : isZero ? '= 0' : '< 0';
    const bgColors: any = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      amber: 'bg-amber-50 border-amber-200 text-amber-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      red: 'bg-red-50 border-red-200 text-red-900',
    };
    const iconColors: any = {
      blue: 'text-blue-500', green: 'text-green-500', amber: 'text-amber-500', purple: 'text-purple-500', red: 'text-red-500'
    };

    return (
      <div className={`p-4 rounded-xl border ${bgColors[color]} flex flex-col gap-2`}>
        <div className="flex justify-between items-center">
          <div className="font-bold flex items-center gap-2">
            <MathComponent tex={label} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{signStr}</span>
            {isPositive ? <CheckCircle2 className={`w-5 h-5 ${iconColors[color]}`} /> : <XCircle className={`w-5 h-5 ${iconColors[color]}`} />}
          </div>
        </div>
        <div className="text-xs opacity-80 mt-1">{explanation}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          係数の符号とグラフの形状
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          スライダーを動かして、各係数がグラフのどの部分（開き方、軸の位置、y切片）に対応しているかを確認しましょう。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Canvas */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm aspect-video relative">
            <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
          </div>

          {/* Right: Controls & Stats */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span><MathComponent tex="a" /> (開き方)</span>
                  <span>{a}</span>
                </div>
                <input type="range" min="-3" max="3" step="0.5" value={a} onChange={(e) => { if(Number(e.target.value) !== 0) setA(Number(e.target.value)) }} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span><MathComponent tex="b" /> (軸への影響)</span>
                  <span>{b}</span>
                </div>
                <input type="range" min="-5" max="5" step="0.5" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span><MathComponent tex="c" /> (y切片)</span>
                  <span>{c}</span>
                </div>
                <input type="range" min="-5" max="5" step="0.5" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <StatBox label="a" value={a} explanation="グラフが上に凸か下に凸かを決定します。" color="blue" />
              <StatBox label="b" value={b === 0 ? 0 : (-a * axis * 2)} explanation={`軸の方程式 x = -b/2a から判定します。aと異符号なら軸は右側です。`} color="purple" />
              <StatBox label="c" value={c} explanation="y軸との交点（y切片）のy座標です。" color="amber" />
              <StatBox label="b^2 - 4ac" value={D} explanation="x軸との共有点の個数を決定します（D>0で2個）。" color="red" />
              <StatBox label="a + b + c" value={f_1} explanation="x = 1 のときの y の値 f(1) です。" color="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
