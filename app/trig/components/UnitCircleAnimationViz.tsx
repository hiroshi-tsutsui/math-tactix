"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const CIRCLE_R = 100;
const CIRCLE_CX = 140;
const CIRCLE_CY = 150;
const GRAPH_X0 = 300;
const GRAPH_W = 280;
const GRAPH_H = 200;
const GRAPH_CY = 150;
const SVG_W = 600;
const SVG_H = 300;

export default function UnitCircleAnimationViz() {
  const [theta, setTheta] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTheta((prev) => {
        const next = prev + dt * 1.2; // ~1.2 rad/s
        return next > 4 * Math.PI ? next - 4 * Math.PI : next;
      });

      animRef.current = requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    }
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isPlaying, animate]);

  const cosVal = Math.cos(theta);
  const sinVal = Math.sin(theta);

  // Point on unit circle
  const px = CIRCLE_CX + CIRCLE_R * cosVal;
  const py = CIRCLE_CY - CIRCLE_R * sinVal;

  // Graph: map theta [0, 4pi] -> GRAPH_X0 to GRAPH_X0 + GRAPH_W
  const thetaInGraph = (t: number) =>
    GRAPH_X0 + (t / (4 * Math.PI)) * GRAPH_W;
  const sinInGraph = (s: number) => GRAPH_CY - s * (GRAPH_H / 2.5);

  // Pre-compute the full sine curve for the graph area
  const sineCurvePath = useMemo(() => {
    const pts: string[] = [];
    const steps = 400;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 4 * Math.PI;
      const gx = thetaInGraph(t);
      const gy = sinInGraph(Math.sin(t));
      pts.push(`${i === 0 ? "M" : "L"}${gx.toFixed(1)},${gy.toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  // Traced path up to current theta
  const tracedPath = useMemo(() => {
    const pts: string[] = [];
    const steps = Math.max(2, Math.round((theta / (4 * Math.PI)) * 400));
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * theta;
      const gx = thetaInGraph(t);
      const gy = sinInGraph(Math.sin(t));
      pts.push(`${i === 0 ? "M" : "L"}${gx.toFixed(1)},${gy.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [theta]);

  // Arc for the angle on unit circle
  const arcPath = useMemo(() => {
    if (theta < 0.01) return "";
    const endAngle = Math.min(theta, 2 * Math.PI);
    const r = 25;
    const largeArc = endAngle > Math.PI ? 1 : 0;
    const ex = CIRCLE_CX + r * Math.cos(-endAngle + 2 * Math.PI); // svg y-flip
    const ey = CIRCLE_CY - r * Math.sin(endAngle);
    const sx = CIRCLE_CX + r;
    const sy = CIRCLE_CY;
    return `M${sx},${sy} A${r},${r} 0 ${largeArc} 0 ${ex.toFixed(1)},${ey.toFixed(1)}`;
  }, [theta]);

  const currentGX = thetaInGraph(theta);
  const currentGY = sinInGraph(sinVal);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-w-[600px] mx-auto border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900"
        >
          {/* === Unit Circle === */}
          {/* Axes */}
          <line x1={CIRCLE_CX - CIRCLE_R - 20} y1={CIRCLE_CY} x2={CIRCLE_CX + CIRCLE_R + 20} y2={CIRCLE_CY} stroke="#94a3b8" strokeWidth={0.8} />
          <line x1={CIRCLE_CX} y1={CIRCLE_CY - CIRCLE_R - 20} x2={CIRCLE_CX} y2={CIRCLE_CY + CIRCLE_R + 20} stroke="#94a3b8" strokeWidth={0.8} />

          {/* Circle */}
          <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill="none" stroke="#cbd5e1" strokeWidth={1} />

          {/* Angle arc */}
          {arcPath && <path d={arcPath} fill="none" stroke="#3b82f6" strokeWidth={1.5} />}

          {/* Radius line */}
          <line x1={CIRCLE_CX} y1={CIRCLE_CY} x2={px} y2={py} stroke="#1e293b" strokeWidth={1.5} className="dark:stroke-white" />

          {/* sin projection (vertical) */}
          <line x1={px} y1={CIRCLE_CY} x2={px} y2={py} stroke="#ef4444" strokeWidth={2} strokeDasharray="4,2" />

          {/* cos projection (horizontal) */}
          <line x1={CIRCLE_CX} y1={CIRCLE_CY} x2={px} y2={CIRCLE_CY} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,2" />

          {/* Point P */}
          <circle cx={px} cy={py} r={5} fill="#1e293b" stroke="white" strokeWidth={1.5} className="dark:fill-white" />

          {/* Labels */}
          <text x={CIRCLE_CX} y={CIRCLE_CY + CIRCLE_R + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">
            1
          </text>
          <text x={CIRCLE_CX + CIRCLE_R + 8} y={CIRCLE_CY + 4} fontSize={10} fill="#94a3b8">
            1
          </text>

          {/* sin label */}
          <text x={px + 8} y={(CIRCLE_CY + py) / 2 + 4} fontSize={10} fill="#ef4444" fontWeight="bold">
            sin
          </text>

          {/* cos label */}
          <text x={(CIRCLE_CX + px) / 2} y={CIRCLE_CY + 14} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight="bold">
            cos
          </text>

          {/* === Graph area === */}
          {/* Graph axes */}
          <line x1={GRAPH_X0} y1={GRAPH_CY} x2={GRAPH_X0 + GRAPH_W} y2={GRAPH_CY} stroke="#94a3b8" strokeWidth={0.8} />
          <line x1={GRAPH_X0} y1={GRAPH_CY - GRAPH_H / 2.5 - 10} x2={GRAPH_X0} y2={GRAPH_CY + GRAPH_H / 2.5 + 10} stroke="#94a3b8" strokeWidth={0.8} />

          {/* Full sine curve (faint) */}
          <path d={sineCurvePath} fill="none" stroke="#e2e8f0" strokeWidth={1} />

          {/* Traced sine curve (bright) */}
          <path d={tracedPath} fill="none" stroke="#ef4444" strokeWidth={2} />

          {/* Current point on graph */}
          <circle cx={currentGX} cy={currentGY} r={4} fill="#ef4444" stroke="white" strokeWidth={1.5} />

          {/* Connecting line from unit circle to graph */}
          <line
            x1={px}
            y1={py}
            x2={currentGX}
            y2={currentGY}
            stroke="#94a3b8"
            strokeWidth={0.5}
            strokeDasharray="3,3"
          />

          {/* Graph y-labels */}
          <text x={GRAPH_X0 - 6} y={sinInGraph(1) + 4} textAnchor="end" fontSize={9} fill="#94a3b8">
            1
          </text>
          <text x={GRAPH_X0 - 6} y={sinInGraph(-1) + 4} textAnchor="end" fontSize={9} fill="#94a3b8">
            -1
          </text>

          {/* Graph x-labels */}
          {[1, 2, 3, 4].map((n) => (
            <text
              key={`gxl-${n}`}
              x={thetaInGraph(n * Math.PI)}
              y={GRAPH_CY + 14}
              textAnchor="middle"
              fontSize={8}
              fill="#94a3b8"
            >
              {n === 1 ? "\u03C0" : n === 2 ? "2\u03C0" : n === 3 ? "3\u03C0" : "4\u03C0"}
            </text>
          ))}

          <text x={GRAPH_X0 + GRAPH_W / 2} y={25} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight="bold">
            y = sin {"\u03B8"}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
            isPlaying
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setTheta(0);
          }}
          className="px-4 py-2 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Theta slider */}
      <div>
        <label className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
          <span>
            <K tex={`\\theta`} />
          </span>
          <span className="font-mono text-blue-600">{(theta * 180 / Math.PI).toFixed(0)}&deg; ({theta.toFixed(2)} rad)</span>
        </label>
        <input
          type="range"
          min={0}
          max={4 * Math.PI}
          step={0.01}
          value={theta}
          onChange={(e) => {
            setIsPlaying(false);
            setTheta(parseFloat(e.target.value));
          }}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-blue-500 cursor-pointer"
        />
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">cos</div>
          <span className="font-mono font-bold text-blue-600">{cosVal.toFixed(3)}</span>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">sin</div>
          <span className="font-mono font-bold text-red-600">{sinVal.toFixed(3)}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">
            <K tex="\sin^2\!\theta + \cos^2\!\theta" />
          </div>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
            {(sinVal ** 2 + cosVal ** 2).toFixed(3)}
          </span>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: "単位円上の点の座標は (cosθ, sinθ) です" },
        { step: 2, text: "角度θが変化するとき、x座標がcosθ、y座標がsinθを表します" },
        { step: 3, text: "sin²θ + cos²θ = 1 は単位円の方程式 x² + y² = 1 そのものです" },
      ]} />
    </div>
  );
}
