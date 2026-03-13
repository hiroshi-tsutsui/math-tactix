"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function VertexAxisDeterminationViz() {
  const [mode, setMode] = useState<'vertex' | 'axis'>('vertex');
  const [a, setA] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Settings for Problem 1 (Vertex)
  // Vertex (1, 2), passes through (3, -6)
  const v_p = 1;
  const v_q = 2;
  const v_pt_x = 3;
  const v_pt_y = -6;
  // correct_a = -2

  // Settings for Problem 2 (Axis)
  // Axis x = -2, passes through (0, -3) and (1, 6)
  const ax_p = -2;
  const ax_pt1_x = 0;
  const ax_pt1_y = -3;
  const ax_pt2_x = 1;
  const ax_pt2_y = 6;
  // correct: y = a(x+2)^2 + q
  // -3 = a(4) + q => 4a + q = -3
  // 6 = a(9) + q => 9a + q = 6
  // => 5a = 9 => a = 1.8. Wait, let's pick better integers.
  // Axis x = 1, passes through (0, 3) and (3, 6)
  // 3 = a + q
  // 6 = 4a + q
  // => 3a = 3 => a = 1, q = 2
  const ax_p_alt = 1;
  const ax_pt1_alt_x = 0;
  const ax_pt1_alt_y = 3;
  const ax_pt2_alt_x = 3;
  const ax_pt2_alt_y = 6;
  const [ax_a, setAxA] = useState<number>(2);
  const [ax_q, setAxQ] = useState<number>(0);

  const scale = 25; // px per unit
  const width = 400;
  const height = 400;
  const originX = width / 2;
  const originY = height / 2 + 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for(let x = -10; x <= 10; x++) {
      ctx.beginPath(); ctx.moveTo(originX + x * scale, 0); ctx.lineTo(originX + x * scale, height); ctx.stroke();
    }
    for(let y = -10; y <= 15; y++) {
      ctx.beginPath(); ctx.moveTo(0, originY - y * scale); ctx.lineTo(width, originY - y * scale); ctx.stroke();
    }
    ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();

    const drawParabola = (currentA: number, currentP: number, currentQ: number, color: string, dash: number[] = []) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash(dash);
      for(let px = 0; px <= width; px += 2) {
        const x = (px - originX) / scale;
        const y = currentA * Math.pow(x - currentP, 2) + currentQ;
        const py = originY - y * scale;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawPoint = (x: number, y: number, color: string, label: string) => {
      const px = originX + x * scale;
      const py = originY - y * scale;
      ctx.beginPath(); ctx.fillStyle = color; ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#111827'; ctx.font = '12px sans-serif';
      ctx.fillText(label, px + 8, py - 8);
    };

    if (mode === 'vertex') {
      // Correct parabola (ghost)
      drawParabola(-2, v_p, v_q, 'rgba(34, 197, 94, 0.3)', [5, 5]);
      
      // Current parabola
      drawParabola(a, v_p, v_q, '#3b82f6');
      
      // Known Points
      drawPoint(v_p, v_q, '#ef4444', `頂点 (${v_p}, ${v_q})`);
      drawPoint(v_pt_x, v_pt_y, '#f59e0b', `通る点 (${v_pt_x}, ${v_pt_y})`);
      
      // Target Point
      const currentYatTarget = a * Math.pow(v_pt_x - v_p, 2) + v_q;
      drawPoint(v_pt_x, currentYatTarget, '#3b82f6', '');
    } else {
      // Axis mode
      // Correct: y = 1(x-1)^2 + 2
      drawParabola(1, ax_p_alt, 2, 'rgba(34, 197, 94, 0.3)', [5, 5]);

      // Current Parabola
      drawParabola(ax_a, ax_p_alt, ax_q, '#8b5cf6');

      // Axis Line
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.moveTo(originX + ax_p_alt * scale, 0);
      ctx.lineTo(originX + ax_p_alt * scale, height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444'; ctx.fillText(`軸 x = ${ax_p_alt}`, originX + ax_p_alt * scale + 5, 20);

      // Known Points
      drawPoint(ax_pt1_alt_x, ax_pt1_alt_y, '#f59e0b', `点1 (${ax_pt1_alt_x}, ${ax_pt1_alt_y})`);
      drawPoint(ax_pt2_alt_x, ax_pt2_alt_y, '#f59e0b', `点2 (${ax_pt2_alt_x}, ${ax_pt2_alt_y})`);
    }

  }, [mode, a, ax_a, ax_q]);

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4 border rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">2次関数の決定 (頂点と軸)</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('vertex')} 
            className={`px-3 py-1 rounded text-sm ${mode === 'vertex' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            条件: 頂点
          </button>
          <button 
            onClick={() => setMode('axis')} 
            className={`px-3 py-1 rounded text-sm ${mode === 'axis' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          >
            条件: 軸
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 mb-2">問題</h3>
            {mode === 'vertex' ? (
              <p className="text-gray-700">頂点が <InlineMath math="(1, 2)" /> で、点 <InlineMath math="(3, -6)" /> を通る2次関数を求めよ。</p>
            ) : (
              <p className="text-gray-700">軸が直線 <InlineMath math="x = 1" /> で、2点 <InlineMath math="(0, 3)" /> と <InlineMath math="(3, 6)" /> を通る2次関数を求めよ。</p>
            )}
          </div>

          <div className="space-y-4 pt-4">
            {mode === 'vertex' ? (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-800 font-bold mb-1">Step 1: 頂点から式を立てる</p>
                  <BlockMath math={`y = a(x - 1)^2 + 2`} />
                </div>
                <div className="bg-amber-50 p-3 rounded space-y-2">
                  <p className="text-sm text-amber-800 font-bold">Step 2: 通る点を代入して a を決める</p>
                  <p className="text-xs text-gray-600">点(3, -6)を通るので代入:</p>
                  <BlockMath math={`-6 = a(3 - 1)^2 + 2`} />
                  
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    未知数 <InlineMath math="a" /> を動かす: <span className="font-bold text-blue-600">{a.toFixed(1)}</span>
                  </label>
                  <input 
                    type="range" min="-5" max="5" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  {a === -2 && <p className="text-green-600 font-bold text-center mt-2">正解！ y = -2(x-1)² + 2</p>}
                </div>
              </>
            ) : (
              <>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm text-purple-800 font-bold mb-1">Step 1: 軸から式を立てる</p>
                  <BlockMath math={`y = a(x - 1)^2 + q`} />
                </div>
                <div className="bg-amber-50 p-3 rounded space-y-2">
                  <p className="text-sm text-amber-800 font-bold">Step 2: 2点を通る条件から a, q を決める</p>
                  
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    <InlineMath math="a" /> (開き具合): <span className="font-bold text-purple-600">{ax_a.toFixed(1)}</span>
                  </label>
                  <input 
                    type="range" min="-3" max="5" step="0.1" value={ax_a} onChange={(e) => setAxA(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    <InlineMath math="q" /> (頂点のy座標): <span className="font-bold text-purple-600">{ax_q.toFixed(1)}</span>
                  </label>
                  <input 
                    type="range" min="-5" max="5" step="0.1" value={ax_q} onChange={(e) => setAxQ(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  {ax_a === 1 && ax_q === 2 && <p className="text-green-600 font-bold text-center mt-2">正解！ y = (x-1)² + 2</p>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex justify-center items-center p-2 min-h-[400px]">
          <canvas ref={canvasRef} width={width} height={height} className="w-full max-w-[400px] bg-white border border-gray-100 rounded shadow-sm" />
        </div>
      </div>
    </div>
  );
}
