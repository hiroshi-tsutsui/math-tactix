"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import katex from "katex";

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
const PADDING = 40;
const X_MIN = -2 * Math.PI;
const X_MAX = 4 * Math.PI;
const Y_SCALE = 80; // pixels per unit in y

function toSVGX(x: number): number {
  return PADDING + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PADDING);
}

function toSVGY(y: number): number {
  return SVG_H / 2 - y * Y_SCALE;
}

export default function TrigFunctionGraphViz() {
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const steps = 600;
    for (let i = 0; i <= steps; i++) {
      const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
      const y = amplitude * Math.sin(frequency * x + phase);
      pts.push({ x, y });
    }
    return pts;
  }, [amplitude, frequency, phase]);

  const pathD = useMemo(() => {
    return points
      .map((p, i) => {
        const sx = toSVGX(p.x);
        const sy = toSVGY(p.y);
        const clampedY = Math.max(-10, Math.min(SVG_H + 10, sy));
        return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${clampedY.toFixed(1)}`;
      })
      .join(" ");
  }, [points]);

  const period = frequency !== 0 ? (2 * Math.PI) / Math.abs(frequency) : Infinity;

  // Feature points: zeros, maxima, minima within visible range
  const featurePoints = useMemo(() => {
    const fps: { x: number; y: number; type: "zero" | "max" | "min" }[] = [];
    if (frequency === 0) return fps;

    // zeros: sin(bx + c) = 0 => bx + c = n*pi => x = (n*pi - c) / b
    for (let n = -10; n <= 20; n++) {
      const x = (n * Math.PI - phase) / frequency;
      if (x >= X_MIN && x <= X_MAX) {
        fps.push({ x, y: 0, type: "zero" });
      }
    }

    // maxima: sin(bx + c) = 1 => bx + c = pi/2 + 2n*pi
    for (let n = -10; n <= 10; n++) {
      const x = (Math.PI / 2 + 2 * n * Math.PI - phase) / frequency;
      if (x >= X_MIN && x <= X_MAX) {
        fps.push({ x, y: amplitude, type: "max" });
      }
    }

    // minima: sin(bx + c) = -1 => bx + c = -pi/2 + 2n*pi
    for (let n = -10; n <= 10; n++) {
      const x = (-Math.PI / 2 + 2 * n * Math.PI - phase) / frequency;
      if (x >= X_MIN && x <= X_MAX) {
        fps.push({ x, y: -amplitude, type: "min" });
      }
    }

    return fps;
  }, [amplitude, frequency, phase]);

  // Axis ticks
  const xTicks = useMemo(() => {
    const ticks: { x: number; label: string }[] = [];
    for (let n = -2; n <= 4; n++) {
      if (n === 0) continue;
      ticks.push({
        x: n * Math.PI,
        label: n === 1 ? "\\pi" : n === -1 ? "-\\pi" : `${n}\\pi`,
      });
    }
    return ticks;
  }, []);

  const formulaTex = useMemo(() => {
    const aStr = amplitude === 1 ? "" : amplitude === -1 ? "-" : `${amplitude}`;
    const bStr = frequency === 1 ? "" : frequency === -1 ? "-" : `${frequency}`;
    const cStr =
      phase === 0
        ? ""
        : phase > 0
        ? `+${Number(phase.toFixed(1))}`
        : `${Number(phase.toFixed(1))}`;
    return `y = ${aStr}\\sin(${bStr}x${cStr})`;
  }, [amplitude, frequency, phase]);

  const periodTex = useMemo(() => {
    if (frequency === 0) return "T = \\infty";
    const b = Math.abs(frequency);
    if (b === 1) return "T = 2\\pi";
    if (b === 2) return "T = \\pi";
    return `T = \\dfrac{2\\pi}{${b}}`;
  }, [frequency]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <KBlock tex={formulaTex} />
      </div>

      {/* SVG Graph */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-w-[600px] mx-auto border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900"
        >
          {/* Grid lines */}
          {[-3, -2, -1, 1, 2, 3].map((v) => (
            <line
              key={`hy-${v}`}
              x1={PADDING}
              y1={toSVGY(v)}
              x2={SVG_W - PADDING}
              y2={toSVGY(v)}
              stroke="#e2e8f0"
              strokeWidth={0.5}
            />
          ))}

          {/* X axis */}
          <line
            x1={PADDING}
            y1={SVG_H / 2}
            x2={SVG_W - PADDING}
            y2={SVG_H / 2}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          {/* Y axis */}
          <line
            x1={toSVGX(0)}
            y1={10}
            x2={toSVGX(0)}
            y2={SVG_H - 10}
            stroke="#94a3b8"
            strokeWidth={1}
          />

          {/* X-axis ticks */}
          {xTicks.map((tick) => {
            const sx = toSVGX(tick.x);
            return (
              <g key={`xt-${tick.x}`}>
                <line x1={sx} y1={SVG_H / 2 - 3} x2={sx} y2={SVG_H / 2 + 3} stroke="#94a3b8" strokeWidth={1} />
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[-2, -1, 1, 2].map((v) => (
            <text
              key={`yl-${v}`}
              x={toSVGX(0) - 8}
              y={toSVGY(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#94a3b8"
            >
              {v}
            </text>
          ))}

          {/* Origin */}
          <text x={toSVGX(0) - 8} y={SVG_H / 2 + 14} textAnchor="end" fontSize={10} fill="#94a3b8">
            O
          </text>

          {/* Sine curve */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2} />

          {/* Feature points */}
          {featurePoints.map((fp, i) => {
            const cx = toSVGX(fp.x);
            const cy = toSVGY(fp.y);
            if (cy < 5 || cy > SVG_H - 5) return null;
            const color =
              fp.type === "zero" ? "#64748b" : fp.type === "max" ? "#ef4444" : "#22c55e";
            return (
              <circle
                key={`fp-${i}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                stroke="white"
                strokeWidth={1}
              />
            );
          })}
        </svg>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">振幅</div>
          <K tex={`A = ${amplitude}`} />
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">周期</div>
          <K tex={periodTex} />
          {period !== Infinity && (
            <div className="text-[10px] text-slate-500 mt-1">
              ({period.toFixed(2)})
            </div>
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>振幅 a</span>
            <span className="font-mono text-blue-600">{amplitude}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-blue-500 cursor-pointer"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>角周波数 b</span>
            <span className="font-mono text-blue-600">{frequency}</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.5}
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-blue-500 cursor-pointer"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>位相 c</span>
            <span className="font-mono text-blue-600">{phase.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.1}
            value={phase}
            onChange={(e) => setPhase(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 最大値
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 最小値
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> ゼロ点
        </span>
      </div>
    </div>
  );
}
