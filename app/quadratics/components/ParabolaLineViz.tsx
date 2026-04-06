"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import katex from "katex";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

export default function ParabolaLineViz() {
  const [mSlider, setMSlider] = useState(50); // 0-100 -> -5..5
  const [nSlider, setNSlider] = useState(50); // 0-100 -> -10..10

  const m = (mSlider / 100) * 10 - 5;
  const n = (nSlider / 100) * 20 - 10;
  const mRound = Math.round(m * 100) / 100;
  const nRound = Math.round(n * 100) / 100;

  // Discriminant: x^2 - mx - n = 0 => D = m^2 + 4n
  const D = mRound * mRound + 4 * nRound;
  const DRound = Math.round(D * 100) / 100;

  // Intersection points
  const intersections = useMemo(() => {
    if (D < -0.001) return [];
    if (Math.abs(D) <= 0.001) {
      const x = mRound / 2;
      return [{ x, y: x * x }];
    }
    const sqrtD = Math.sqrt(D);
    const x1 = (mRound - sqrtD) / 2;
    const x2 = (mRound + sqrtD) / 2;
    return [
      { x: x1, y: x1 * x1 },
      { x: x2, y: x2 * x2 },
    ];
  }, [mRound, nRound, D]);

  // SVG dimensions
  const W = 340;
  const H = 300;
  const padding = 40;
  const graphW = W - 2 * padding;
  const graphH = H - 2 * padding;

  const xRange = 10; // -5 to 5
  const yRange = 14; // -4 to 10
  const yMin = -4;
  const yMax = 10;
  const toSvgX = (x: number) => padding + ((x + xRange / 2) / xRange) * graphW;
  const toSvgY = (y: number) => padding + ((yMax - y) / yRange) * graphH;

  // Parabola points
  const parabolaPoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = -xRange / 2; x <= xRange / 2; x += 0.05) {
      const y = x * x;
      if (y >= yMin && y <= yMax) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`);
      }
    }
    return pts.join(" ");
  }, []);

  // Line points
  const linePoints = useMemo(() => {
    const x1 = -xRange / 2;
    const x2 = xRange / 2;
    const y1 = mRound * x1 + nRound;
    const y2 = mRound * x2 + nRound;
    return { x1: toSvgX(x1), y1: toSvgY(y1), x2: toSvgX(x2), y2: toSvgY(y2) };
  }, [mRound, nRound]);

  // Badge
  const badgeText = D > 0.001 ? "2点で交わる" : Math.abs(D) <= 0.001 ? "接する" : "共有点なし";
  const badgeColor = D > 0.001 ? "#3b82f6" : Math.abs(D) <= 0.001 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-bold text-center">二次関数と直線の位置関係</h3>

      {/* Equations */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800 text-center space-y-2">
        <div><K tex={`y = x^2 \\quad \\text{(放物線)}`} /></div>
        <div><K tex={`y = ${mRound >= 0 ? "" : ""}${mRound}x ${nRound >= 0 ? "+" : ""} ${nRound} \\quad \\text{(直線)}`} /></div>
      </div>

      {/* Badge */}
      <div className="flex justify-center">
        <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: badgeColor + "20", color: badgeColor, border: `2px solid ${badgeColor}` }}>
          D = {DRound.toFixed(2)} → {badgeText}
        </span>
      </div>

      {/* SVG graph */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px]">
          {/* Grid */}
          {Array.from({ length: Math.floor(xRange) + 1 }, (_, i) => i - Math.floor(xRange / 2)).map((x) => (
            <line key={`gx${x}`} x1={toSvgX(x)} y1={padding} x2={toSvgX(x)} y2={H - padding}
              stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((y) => (
            <line key={`gy${y}`} x1={padding} y1={toSvgY(y)} x2={W - padding} y2={toSvgY(y)}
              stroke="#f1f5f9" strokeWidth={1} />
          ))}

          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={W - padding} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={H - padding} stroke="#94a3b8" strokeWidth={1.5} />
          <text x={W - padding + 8} y={toSvgY(0) + 4} fontSize={11} fill="#94a3b8">x</text>
          <text x={toSvgX(0) + 6} y={padding - 4} fontSize={11} fill="#94a3b8">y</text>
          <text x={toSvgX(0) - 10} y={toSvgY(0) + 14} fontSize={10} fill="#94a3b8">O</text>

          {/* Parabola */}
          <polyline points={parabolaPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {/* Line */}
          <line x1={linePoints.x1} y1={linePoints.y1} x2={linePoints.x2} y2={linePoints.y2}
            stroke="#ef4444" strokeWidth={2} />

          {/* Intersection points */}
          {intersections.map((pt, i) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);
            const isTangent = Math.abs(D) <= 0.001;
            return (
              <g key={i}>
                <circle cx={sx} cy={sy} r={isTangent ? 8 : 5} fill={isTangent ? "#f59e0b" : "#22c55e"}
                  stroke="white" strokeWidth={2} opacity={isTangent ? 0.8 : 1} />
                {isTangent && (
                  <circle cx={sx} cy={sy} r={14} fill="none" stroke="#f59e0b" strokeWidth={2} opacity={0.4} />
                )}
                <text x={sx + 10} y={sy - 10} fontSize={10} fontWeight="bold"
                  fill={isTangent ? "#f59e0b" : "#22c55e"}>
                  ({pt.x.toFixed(2)}, {pt.y.toFixed(2)})
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <line x1={padding + 5} y1={H - 16} x2={padding + 25} y2={H - 16} stroke="#3b82f6" strokeWidth={2} />
          <text x={padding + 30} y={H - 12} fontSize={10} fill="#64748b">y = x²</text>
          <line x1={padding + 80} y1={H - 16} x2={padding + 100} y2={H - 16} stroke="#ef4444" strokeWidth={2} />
          <text x={padding + 105} y={H - 12} fontSize={10} fill="#64748b">y = mx+n</text>
        </svg>
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">傾き m = {mRound.toFixed(2)}</span>
          </div>
          <input type="range" min={0} max={100} step={1} value={mSlider}
            onChange={(e) => setMSlider(Number(e.target.value))}
            className="w-full accent-red-500" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-5</span><span>5</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-orange-500">切片 n = {nRound.toFixed(2)}</span>
          </div>
          <input type="range" min={0} max={100} step={1} value={nSlider}
            onChange={(e) => setNSlider(Number(e.target.value))}
            className="w-full accent-orange-500" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-10</span><span>10</span>
          </div>
        </div>
      </div>

      {/* Discriminant calculation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm mb-3">判別式の計算</h4>
        <div className="space-y-2 text-sm overflow-x-auto">
          <div><K tex={`x^2 = mx + n \\implies x^2 - mx - n = 0`} /></div>
          <div><K tex={`D = m^2 + 4n = (${mRound.toFixed(2)})^2 + 4 \\cdot (${nRound.toFixed(2)}) = ${DRound.toFixed(2)}`} /></div>
        </div>

        {/* Intersection coordinates */}
        {intersections.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-500 mb-2">共有点の座標</div>
            <div className="flex gap-3 flex-wrap">
              {intersections.map((pt, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm">
                  <K tex={`(${pt.x.toFixed(2)},\\; ${pt.y.toFixed(2)})`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key points */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-2">ポイント</h4>
        <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1 list-disc list-inside">
          <li>放物線と直線の共有点は連立方程式の実数解に対応</li>
          <li><K tex="D = m^2 + 4n" /> で位置関係が決まる</li>
          <li>D = 0 のとき直線は放物線に接する（接線）</li>
          <li>m と n を動かして、接する条件 <K tex="n = -m^2/4" /> を確認しよう</li>
        </ul>
      </div>
    </div>
  );
}
