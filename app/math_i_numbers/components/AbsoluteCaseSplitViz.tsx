"use client";

import React, { useState } from 'react';

const AbsoluteCaseSplitViz = () => {
  // y = |x - a|
  const [a, setA] = useState(2);
  // y = bx + c
  const [b, setB] = useState(2);
  const [c, setC] = useState(-1);

  const width = 600;
  const height = 400;
  const scale = 30;
  const centerX = width / 2;
  const centerY = height / 2;

  const toX = (x: number) => centerX + x * scale;
  const toY = (y: number) => centerY - y * scale;

  // Case 1: x >= a
  // x - a = bx + c => (1-b)x = a + c => x = (a+c)/(1-b)
  let root1 = null;
  let valid1 = false;
  if (1 - b !== 0) {
    root1 = (a + c) / (1 - b);
    valid1 = root1 >= a;
  }

  // Case 2: x &lt; a
  // -x + a = bx + c => (-1-b)x = c - a => x = (c-a)/(-1-b) = (a-c)/(b+1)
  let root2 = null;
  let valid2 = false;
  if (-1 - b !== 0) {
    root2 = (a - c) / (b + 1);
    valid2 = root2 < a;
  }

  const axes = (
    <g className="text-gray-400">
      <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="currentColor" strokeWidth={1} />
      <line x1={centerX} y1={0} x2={centerX} y2={height} stroke="currentColor" strokeWidth={1} />
      {[...Array(21)].map((_, i) => {
        const x = i - 10;
        if (x === 0) return null;
        return (
          <g key={'x'+x}>
            <line x1={toX(x)} y1={centerY - 3} x2={toX(x)} y2={centerY + 3} stroke="currentColor" />
            <text x={toX(x)} y={centerY + 15} fontSize={10} textAnchor="middle" fill="currentColor">{x}</text>
          </g>
        );
      })}
      {[...Array(15)].map((_, i) => {
        const y = i - 7;
        if (y === 0) return null;
        return (
          <g key={'y'+y}>
            <line x1={centerX - 3} y1={toY(y)} x2={centerX + 3} y2={toY(y)} stroke="currentColor" />
            <text x={centerX - 15} y={toY(y) + 3} fontSize={10} textAnchor="middle" fill="currentColor">{y}</text>
          </g>
        );
      })}
    </g>
  );

  const getAbsPath = () => {
    let d = `M 0 ${toY(Math.abs(-10 - a))} `;
    for(let i = -10; i <= 10; i+=0.1) {
      d += `L ${toX(i)} ${toY(Math.abs(i - a))} `;
    }
    return d;
  };

  const getLinePath = () => {
    return `M ${toX(-10)} ${toY(b * -10 + c)} L ${toX(10)} ${toY(b * 10 + c)}`;
  };

  const ghostLine1 = () => {
    return `M ${toX(-10)} ${toY(-10 - a)} L ${toX(10)} ${toY(10 - a)}`;
  };

  const ghostLine2 = () => {
    return `M ${toX(-10)} ${toY(-(-10 - a))} L ${toX(10)} ${toY(-(10 - a))}`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-2xl mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">絶対値を含む方程式 (場合分けの視覚化)</h3>
        
        <div className="text-center mb-6">
          <p className="text-xl font-medium font-serif">
            |x {a >= 0 ? '-' : '+'} {Math.abs(a)}| = {b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-slate-600 mb-1">左辺の頂点 a (x - a): {a}</label>
            <input type="range" min="-5" max="5" step="1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">右辺の傾き b: {b}</label>
            <input type="range" min="-3" max="3" step="0.5" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">右辺の切片 c: {c}</label>
            <input type="range" min="-5" max="5" step="1" value={c} onChange={(e) => setC(parseFloat(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded border ${valid1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="font-bold text-sm mb-1">場合分け1: x ≥ {a} のとき</div>
            <div className="text-xs text-slate-600">絶対値はそのまま外れる:</div>
            <div className="font-mono text-sm mt-1">x - {a} = {b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}</div>
            {root1 !== null ? (
              <div className="mt-2 text-sm font-bold">
                解: x = {root1.toFixed(2)}
                {valid1 ? (
                  <span className="text-green-600 ml-2">✓ 適する (x ≥ {a})</span>
                ) : (
                  <span className="text-red-600 ml-2">✗ 不適 (x &lt; {a})</span>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-500">解なし</div>
            )}
          </div>
          
          <div className={`p-3 rounded border ${valid2 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="font-bold text-sm mb-1">場合分け2: x &lt; {a} のとき</div>
            <div className="text-xs text-slate-600">絶対値はマイナスをつけて外れる:</div>
            <div className="font-mono text-sm mt-1">-(x - {a}) = {b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}</div>
            {root2 !== null ? (
              <div className="mt-2 text-sm font-bold">
                解: x = {root2.toFixed(2)}
                {valid2 ? (
                  <span className="text-green-600 ml-2">✓ 適する (x &lt; {a})</span>
                ) : (
                  <span className="text-red-600 ml-2">✗ 不適 (x ≥ {a})</span>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-500">解なし</div>
            )}
          </div>
        </div>

        <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50" style={{ height: 400 }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            {axes}
            
            {/* Domain separator line */}
            <line x1={toX(a)} y1={0} x2={toX(a)} y2={height} stroke="purple" strokeWidth={1} strokeDasharray="4 4" />
            <text x={toX(a) + 5} y={20} fill="purple" fontSize={12}>x = {a} (場合分けの境界)</text>
            
            {/* Ghost lines (the full algebraic lines before restricting domain) */}
            <path d={ghostLine1()} stroke="#3b82f6" strokeWidth={1} strokeDasharray="2 2" opacity={0.3} />
            <path d={ghostLine2()} stroke="#3b82f6" strokeWidth={1} strokeDasharray="2 2" opacity={0.3} />

            {/* The right side (Line) */}
            <path d={getLinePath()} stroke="#ef4444" strokeWidth={2} fill="none" />
            <text x={toX(2)} y={toY(b*2+c) - 10} fill="#ef4444" fontSize={12}>y = {b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}</text>

            {/* The left side (Absolute Value) */}
            <path d={getAbsPath()} stroke="#3b82f6" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={toX(a - 2)} y={toY(Math.abs(-2)) - 10} fill="#3b82f6" fontSize={12}>y = |x - {a}|</text>

            {/* Intersections */}
            {root1 !== null && (
              <circle cx={toX(root1)} cy={toY(b * root1 + c)} r={6} fill={valid1 ? "#22c55e" : "#ef4444"} stroke="white" strokeWidth={2} />
            )}
            {root1 !== null && !valid1 && (
              <text x={toX(root1) + 10} y={toY(b * root1 + c)} fill="#ef4444" fontSize={12} fontWeight="bold">不適 (Extraneous)</text>
            )}

            {root2 !== null && (
              <circle cx={toX(root2)} cy={toY(b * root2 + c)} r={6} fill={valid2 ? "#22c55e" : "#ef4444"} stroke="white" strokeWidth={2} />
            )}
            {root2 !== null && !valid2 && (
              <text x={toX(root2) + 10} y={toY(b * root2 + c)} fill="#ef4444" fontSize={12} fontWeight="bold">不適 (Extraneous)</text>
            )}
          </svg>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-slate-700 w-full max-w-2xl">
        <h4 className="font-bold text-blue-900 mb-2">💡 なぜ「適・不適」が生じるのか？（図形的意味）</h4>
        <p>方程式を解く際、絶対値を外すために場合分け（<code className="font-bold">x ≥ a</code> と <code className="font-bold">x &lt; a</code>）を行います。しかし、外した後の式（例：<code className="bg-blue-100 px-1 rounded">x - a = bx + c</code>）は、境界 <code className="font-bold">x = a</code> を超えてどこまでも伸びる直線（点線）を表してしまいます。</p>
        <p className="mt-2">代数的な計算は、この「架空の延長線（点線）」と右辺の直線の交点も「解」として出してしまいます。この交点が本来の場合分けの範囲外（V字の反対側）にある場合、それは元の絶対値グラフとは交わっていないため「不適（Extraneous Solution）」となります。</p>
      </div>
    </div>
  );
};

export default AbsoluteCaseSplitViz;
