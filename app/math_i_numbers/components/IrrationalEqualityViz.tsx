"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import HintButton from '../../components/HintButton';

export default function IrrationalEqualityViz({ onComplete }: { onComplete: () => void }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-1);
  const [p, setP] = useState(2); // sqrt(2)
  const [isSuccess, setIsSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // sqrt(p)
  const sqrtP = Math.sqrt(p);
  const currentY = a + b * sqrtP;

  useEffect(() => {
    drawGraph();
    if (a === 0 && b === 0) {
      setIsSuccess(true);
      onComplete();
    } else {
      setIsSuccess(false);
    }
  }, [a, b, p]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const margin = 40;
    const graphWidth = width - margin * 2;
    const graphHeight = height - margin * 2;
    
    // Scale
    const xMin = -1;
    const xMax = 5;
    const yMin = -5;
    const yMax = 5;
    
    const scaleX = graphWidth / (xMax - xMin);
    const scaleY = graphHeight / (yMax - yMin);
    
    const toPx = (x: number) => margin + (x - xMin) * scaleX;
    const toPy = (y: number) => margin + graphHeight - (y - yMin) * scaleY;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = xMin; i <= xMax; i++) {
      ctx.beginPath(); ctx.moveTo(toPx(i), margin); ctx.lineTo(toPx(i), height - margin); ctx.stroke();
    }
    for (let i = yMin; i <= yMax; i++) {
      ctx.beginPath(); ctx.moveTo(margin, toPy(i)); ctx.lineTo(width - margin, toPy(i)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(toPx(xMin), toPy(0)); ctx.lineTo(toPx(xMax), toPy(0)); ctx.stroke(); // X
    ctx.beginPath(); ctx.moveTo(toPx(0), toPy(yMin)); ctx.lineTo(toPx(0), toPy(yMax)); ctx.stroke(); // Y

    // Label Origin
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('O', toPx(0) - 15, toPy(0) + 15);

    // Line y = a + bx
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toPx(xMin), toPy(a + b * xMin));
    ctx.lineTo(toPx(xMax), toPy(a + b * xMax));
    ctx.stroke();

    // Mark x = sqrt(p)
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(toPx(sqrtP), toPy(yMin));
    ctx.lineTo(toPx(sqrtP), toPy(yMax));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`√${p}`, toPx(sqrtP) - 10, toPy(0) + 15);

    // The Point (sqrt(p), a + b*sqrt(p))
    ctx.fillStyle = a === 0 && b === 0 ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(toPx(sqrtP), toPy(currentY), 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Label for the point
    ctx.fillText(`y = ${currentY.toFixed(2)}`, toPx(sqrtP) + 10, toPy(currentY) - 10);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        無理数の相等 (a, bが有理数のとき)
      </h3>
      <p className="text-slate-600 mb-6 text-sm">
        命題: <code className="bg-slate-100 px-1 rounded">a, b</code> が有理数であり、
        <code className="bg-slate-100 px-1 rounded">√{p}</code> が無理数であるとき、
        <br/>
        <code className="bg-slate-100 px-1 rounded text-blue-600 font-bold">a + b√{p} = 0</code> 
        ならば <code className="bg-slate-100 px-1 rounded text-emerald-600 font-bold">a = 0 かつ b = 0</code> である。
        <br/>
        <span className="text-xs text-slate-500 mt-1 block">
          グラフ上で y = a + bx の直線が x = √{p} で y = 0 となる条件を探りましょう。
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-slate-700 mb-4 text-sm">パラメータ制御</h4>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>a (有理数・切片)</span>
                  <span className="text-blue-600">{a}</span>
                </label>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>b (有理数・傾き)</span>
                  <span className="text-blue-600">{b}</span>
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>p (無理数の元)</span>
                  <span className="text-amber-600">{p}</span>
                </label>
                <select 
                  value={p} 
                  onChange={(e) => setP(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded"
                >
                  <option value={2}>√2 (約1.414)</option>
                  <option value={3}>√3 (約1.732)</option>
                  <option value={5}>√5 (約2.236)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 space-y-2">
            <p><strong>現在の値:</strong> <br/>y = {a} + {b}√{p} = {currentY.toFixed(4)}</p>
            {b !== 0 && (
              <p>直線がx軸と交わる点(x切片)は: <br/>x = {-a}/{b} = {(-a/b).toFixed(2)} (有理数)</p>
            )}
            {b === 0 && a !== 0 && (
              <p>直線はx軸と平行で交わりません。</p>
            )}
            <p className="mt-2 text-xs text-blue-600">
              有理数xでのみy=0になる直線が、無理数x=√{p}でy=0になるには、直線が常にy=0 (つまりa=0, b=0)になるしかありません。
            </p>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg"
          />
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm border border-emerald-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              証明完了
            </motion.div>
          )}
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "無理数の等式 a + b√c = 0（a, b は有理数、√c は無理数）から、a = 0 かつ b = 0 です。" },
        { step: 2, text: "両辺の有理部分と無理部分をそれぞれ等しいとおく（係数比較）方法を使います。" },
        { step: 3, text: "方程式を整理して「有理数 = 無理数 × (式)」の形にし、矛盾なく成り立つ条件を求めます。" },
        { step: 4, text: "未知数が2つなら、有理部分と無理部分から連立方程式を立てて解きましょう。" }
      ]} />
    </div>
  );
}
