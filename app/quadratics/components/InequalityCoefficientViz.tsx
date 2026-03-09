'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface VizProps {
  levelParams: any;
  onSuccess: () => void;
}

export default function InequalityCoefficientViz({ levelParams, onSuccess }: VizProps) {
  const [aInput, setAInput] = useState<number | ''>('');
  const [bInput, setBInput] = useState<number | ''>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const p = levelParams;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cStr = p.c > 0 ? `+${p.c}` : p.c === 0 ? "" : `${p.c}`;
  const eqTex = `ax^2 + bx ${cStr} > 0`;

  useEffect(() => {
    drawGraph();
  }, [aInput, bInput, p]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / 10;
    const scaleY = height / 10;
    const offsetX = width / 2;
    const offsetY = height / 2;

    const toCanvas = (x: number, y: number) => [
      offsetX + x * scaleX,
      offsetY - y * scaleY
    ];

    // Axes
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, offsetY); ctx.lineTo(width, offsetY);
    ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, height);
    ctx.stroke();

    // Solution Range Highlight
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    const [x1] = toCanvas(p.alpha, 0);
    const [x2] = toCanvas(p.beta, 0);
    if (p.isInside) {
      ctx.fillRect(x1, 0, x2 - x1, height);
    } else {
      ctx.fillRect(0, 0, x1, height);
      ctx.fillRect(x2, 0, width - x2, height);
    }

    // Target parabola outline (faint)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -5; x <= 5; x += 0.1) {
      const y = p.a * x * x + p.b * x + p.c;
      const [cx, cy] = toCanvas(x, y);
      if (x === -5) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Student Parabola
    const a = Number(aInput);
    const b = Number(bInput);
    const c = p.c;
    if (a !== 0 && !isNaN(a) && !isNaN(b)) {
      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -5; x <= 5; x += 0.1) {
        const y = a * x * x + b * x + c;
        const [cx, cy] = toCanvas(x, y);
        if (x === -5) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
  };

  const handleCheck = () => {
    setShowFeedback(true);
    if (Number(aInput) === p.a && Number(bInput) === p.b) {
      setIsCorrect(true);
      setTimeout(() => onSuccess(), 2000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-xl">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-blue-400">
          二次不等式の決定
        </h3>
        
        <div className="mb-4">
          <p className="text-lg mb-2">次の条件を満たす定数 <InlineMath math="a, b" /> の値を求めよ。</p>
          <div className="bg-gray-900 p-4 rounded-lg flex flex-col gap-2">
            <BlockMath math={`\\text{不等式 } ${eqTex} \\text{ の解が } ${p.solutionText} \\text{ である。}`} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-gray-900 rounded-lg p-2 border border-gray-700 flex justify-center items-center">
            <canvas ref={canvasRef} width={300} height={300} className="rounded" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            <p className="text-sm text-gray-400 mb-2">
              <span className="text-green-400 font-bold">緑の領域</span> が不等式 <InlineMath math="> 0" /> の解です。<br/>
              グラフがこの条件を満たすように <InlineMath math="a" /> と <InlineMath math="b" /> を決定してください。
            </p>

            <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
              <span className="text-xl font-bold w-12 text-right"><InlineMath math="a =" /></span>
              <input
                type="number"
                className="bg-gray-800 text-white p-2 rounded w-24 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={aInput}
                onChange={e => { setAInput(e.target.value === '' ? '' : Number(e.target.value)); setShowFeedback(false); }}
              />
            </div>
            
            <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
              <span className="text-xl font-bold w-12 text-right"><InlineMath math="b =" /></span>
              <input
                type="number"
                className="bg-gray-800 text-white p-2 rounded w-24 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={bInput}
                onChange={e => { setBInput(e.target.value === '' ? '' : Number(e.target.value)); setShowFeedback(false); }}
              />
            </div>

            <button
              onClick={handleCheck}
              className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all ${
                isCorrect ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isCorrect ? "正解！" : "判定する"}
            </button>
            
            {showFeedback && !isCorrect && (
              <p className="text-red-400 text-center font-bold">
                不正解です。解の形からグラフが「上に凸」か「下に凸」かを判断しましょう。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
