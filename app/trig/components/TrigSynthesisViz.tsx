"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

const SVG_W = 600;
const SVG_H = 300;
const MARGIN = { top: 30, right: 20, bottom: 30, left: 40 };
const PLOT_W = SVG_W - MARGIN.left - MARGIN.right;
const PLOT_H = SVG_H - MARGIN.top - MARGIN.bottom;

function fmt(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "\\text{undefined}";
  return v.toFixed(4);
}

function fmtShort(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "—";
  return v.toFixed(2);
}

export default function TrigSynthesisViz() {
  const [a, setA] = useState(1.0);
  const [b, setB] = useState(1.0);
  const [thetaDeg, setThetaDeg] = useState(45);
  const [showDerivation, setShowDerivation] = useState(false);

  const thetaRad = (thetaDeg * Math.PI) / 180;

  // R and phi
  const R = Math.sqrt(a * a + b * b);
  const phi = Math.atan2(b, a); // phi such that a = R cos phi, b = R sin phi
  const phiDeg = (phi * 180) / Math.PI;

  // LHS and RHS values
  const lhs = a * Math.sin(thetaRad) + b * Math.cos(thetaRad);
  const rhs = R * Math.sin(thetaRad + phi);

  // Generate graph points
  const graphPoints = useMemo(() => {
    const pts: { x: number; yLhs: number; yRhs: number }[] = [];
    const steps = 360;
    for (let i = 0; i <= steps; i++) {
      const xDeg = (i / steps) * 360;
      const xRad = (xDeg * Math.PI) / 180;
      pts.push({
        x: xDeg,
        yLhs: a * Math.sin(xRad) + b * Math.cos(xRad),
        yRhs: R * Math.sin(xRad + phi),
      });
    }
    return pts;
  }, [a, b, R, phi]);

  // Find y-range for scaling
  const yMax = useMemo(() => {
    const maxVal = Math.max(
      ...graphPoints.map((p) => Math.max(Math.abs(p.yLhs), Math.abs(p.yRhs)))
    );
    return Math.max(maxVal * 1.15, 0.5);
  }, [graphPoints]);

  // Scale functions
  const scaleX = (deg: number) => MARGIN.left + (deg / 360) * PLOT_W;
  const scaleY = (val: number) =>
    MARGIN.top + PLOT_H / 2 - (val / yMax) * (PLOT_H / 2);

  // Generate SVG path
  const makePath = (key: "yLhs" | "yRhs") => {
    return graphPoints
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${scaleX(p.x).toFixed(1)},${scaleY(
            p[key]
          ).toFixed(1)}`
      )
      .join(" ");
  };

  const lhsPath = useMemo(() => makePath("yLhs"), [graphPoints, yMax]);
  const rhsPath = useMemo(() => makePath("yRhs"), [graphPoints, yMax]);

  // Current theta marker position
  const markerX = scaleX(thetaDeg);
  const markerYLhs = scaleY(lhs);

  // Grid lines
  const xTicks = [0, 90, 180, 270, 360];
  const yTicks = useMemo(() => {
    const ticks: number[] = [0];
    const step = yMax > 3 ? 2 : yMax > 1.5 ? 1 : 0.5;
    for (let v = step; v <= yMax; v += step) {
      ticks.push(v);
      ticks.push(-v);
    }
    return ticks;
  }, [yMax]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
          三角関数の合成
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          a sin&theta; + b cos&theta; を R sin(&theta; + &phi;) の形に変換します
        </p>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          合成公式
        </div>
        <KBlock tex="a\sin\theta + b\cos\theta = R\sin(\theta + \varphi)" />
        <KBlock tex="R = \sqrt{a^2 + b^2},\quad \tan\varphi = \frac{b}{a}" />
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
          パラメータ
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>
              a = {a.toFixed(1)}
            </span>
            <span className="text-slate-400">-3.0 ~ 3.0</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>
              b = {b.toFixed(1)}
            </span>
            <span className="text-slate-400">-3.0 ~ 3.0</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-green-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>
              &theta; = {thetaDeg}&deg;
            </span>
            <span className="text-slate-400">0&deg; ~ 360&deg;</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={thetaDeg}
            onChange={(e) => setThetaDeg(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Computed values */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          計算結果
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 mb-1">R (振幅)</div>
            <K tex={`R = \\sqrt{(${fmtShort(a)})^2 + (${fmtShort(b)})^2} = ${fmtShort(R)}`} />
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 mb-1">&phi; (補助角)</div>
            <K tex={`\\varphi = ${fmtShort(phiDeg)}°`} />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              左辺
            </span>
            <K
              tex={`${fmtShort(a)}\\sin ${thetaDeg}° + ${fmtShort(b)}\\cos ${thetaDeg}° = ${fmt(lhs)}`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-red-500 dark:text-red-400">
              右辺
            </span>
            <K
              tex={`${fmtShort(R)}\\sin(${thetaDeg}° + ${fmtShort(phiDeg)}°) = ${fmt(rhs)}`}
            />
          </div>
          <div className="text-center pt-1 border-t border-blue-200 dark:border-blue-700">
            <span
              className={`text-xs font-bold ${
                Math.abs(lhs - rhs) < 1e-8
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500"
              }`}
            >
              {Math.abs(lhs - rhs) < 1e-8
                ? "一致 (Perfect Match)"
                : `差: ${Math.abs(lhs - rhs).toExponential(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
          グラフ (重ね描画)
        </div>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {xTicks.map((deg) => (
            <line
              key={`xg-${deg}`}
              x1={scaleX(deg)}
              y1={MARGIN.top}
              x2={scaleX(deg)}
              y2={MARGIN.top + PLOT_H}
              stroke="#e2e8f0"
              strokeWidth={0.5}
            />
          ))}
          {yTicks.map((v, i) => (
            <line
              key={`yg-${i}`}
              x1={MARGIN.left}
              y1={scaleY(v)}
              x2={MARGIN.left + PLOT_W}
              y2={scaleY(v)}
              stroke="#e2e8f0"
              strokeWidth={0.5}
            />
          ))}

          {/* Axes */}
          <line
            x1={MARGIN.left}
            y1={scaleY(0)}
            x2={MARGIN.left + PLOT_W}
            y2={scaleY(0)}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          <line
            x1={MARGIN.left}
            y1={MARGIN.top}
            x2={MARGIN.left}
            y2={MARGIN.top + PLOT_H}
            stroke="#94a3b8"
            strokeWidth={1}
          />

          {/* X axis labels */}
          {xTicks.map((deg) => (
            <text
              key={`xl-${deg}`}
              x={scaleX(deg)}
              y={MARGIN.top + PLOT_H + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#94a3b8"
            >
              {deg}&deg;
            </text>
          ))}

          {/* Y axis labels */}
          {yTicks
            .filter((v) => v !== 0)
            .map((v, i) => (
              <text
                key={`yl-${i}`}
                x={MARGIN.left - 6}
                y={scaleY(v) + 3}
                textAnchor="end"
                fontSize={9}
                fill="#94a3b8"
              >
                {v.toFixed(1)}
              </text>
            ))}

          {/* LHS graph: blue, slightly wider */}
          <path d={lhsPath} fill="none" stroke="#3b82f6" strokeWidth={3} opacity={0.9} />

          {/* RHS graph: red, dashed */}
          <path
            d={rhsPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 3"
            opacity={0.9}
          />

          {/* Current theta marker */}
          <line
            x1={markerX}
            y1={MARGIN.top}
            x2={markerX}
            y2={MARGIN.top + PLOT_H}
            stroke="#a855f7"
            strokeWidth={1}
            strokeDasharray="4 2"
            opacity={0.6}
          />
          <circle
            cx={markerX}
            cy={markerYLhs}
            r={4}
            fill="#a855f7"
            stroke="white"
            strokeWidth={1.5}
          />

          {/* Legend */}
          <line x1={SVG_W - 180} y1={14} x2={SVG_W - 160} y2={14} stroke="#3b82f6" strokeWidth={3} />
          <text x={SVG_W - 155} y={18} fontSize={10} fill="#64748b">
            y = a sin x + b cos x
          </text>
          <line
            x1={SVG_W - 180}
            y1={28}
            x2={SVG_W - 160}
            y2={28}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
          <text x={SVG_W - 155} y={32} fontSize={10} fill="#64748b">
            y = R sin(x + &phi;)
          </text>
        </svg>
        <p className="text-[10px] text-center text-slate-400 mt-1">
          2つのグラフが完全に重なっていることを確認してください
        </p>
      </div>

      {/* Derivation toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className="w-full flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          <span>導出過程を表示</span>
          <span className="text-slate-400">{showDerivation ? "▲" : "▼"}</span>
        </button>
        {showDerivation && (
          <div className="mt-4 space-y-4 text-sm">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-bold">
                STEP 1: 加法定理で展開
              </p>
              <KBlock tex="R\sin(\theta + \varphi) = R(\sin\theta\cos\varphi + \cos\theta\sin\varphi)" />
              <KBlock tex="= (R\cos\varphi)\sin\theta + (R\sin\varphi)\cos\theta" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-bold">
                STEP 2: 係数を比較
              </p>
              <KBlock tex="a = R\cos\varphi,\quad b = R\sin\varphi" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-bold">
                STEP 3: R を求める
              </p>
              <KBlock tex="a^2 + b^2 = R^2\cos^2\varphi + R^2\sin^2\varphi = R^2(\cos^2\varphi + \sin^2\varphi) = R^2" />
              <KBlock tex="\therefore R = \sqrt{a^2 + b^2}" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-bold">
                STEP 4: &phi; を求める
              </p>
              <KBlock tex="\frac{\sin\varphi}{\cos\varphi} = \frac{b/R}{a/R} = \frac{b}{a}" />
              <KBlock tex="\therefore \tan\varphi = \frac{b}{a},\quad \varphi = \arctan\frac{b}{a}" />
            </div>
          </div>
        )}
      </div>

      {/* HintButton */}
      <HintButton
        hints={[
          {
            step: 1,
            text: "R sin(θ + φ) を加法定理で展開すると R sinθ cosφ + R cosθ sinφ になります",
          },
          {
            step: 2,
            text: "係数を比較すると a = R cosφ, b = R sinφ が成り立ちます",
          },
          {
            step: 3,
            text: "a² + b² = R²(cos²φ + sin²φ) = R² なので R = √(a² + b²)",
          },
          {
            step: 4,
            text: "sinφ/cosφ = b/a なので tan φ = b/a。φ = arctan(b/a) と求まります",
          },
        ]}
      />
    </div>
  );
}
