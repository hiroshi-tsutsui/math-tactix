"use client";

import React, { useRef, useEffect, useMemo } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const SVG_W = 600;
const SVG_H = 400;
const PADDING = 40;
const X_MIN = -2 * Math.PI;
const X_MAX = 2 * Math.PI;
const Y_MIN = -5;
const Y_MAX = 5;

function toSVGX(x: number): number {
  return PADDING + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PADDING);
}

function toSVGY(y: number): number {
  return PADDING + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PADDING);
}

export default function TangentGraphViz() {
  // Asymptotes: x = pi/2 + n*pi
  const asymptotes = useMemo(() => {
    const lines: number[] = [];
    for (let n = -3; n <= 3; n++) {
      const x = Math.PI / 2 + n * Math.PI;
      if (x >= X_MIN && x <= X_MAX) {
        lines.push(x);
      }
    }
    return lines;
  }, []);

  // Build path segments, splitting at asymptotes
  const pathSegments = useMemo(() => {
    const segments: string[] = [];
    const steps = 1200;
    let currentSegment: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
      const y = Math.tan(x);

      // Check if near an asymptote
      const nearAsymptote = asymptotes.some((a) => Math.abs(x - a) < 0.02);
      if (nearAsymptote || Math.abs(y) > Y_MAX + 2) {
        if (currentSegment.length > 1) {
          segments.push(currentSegment.join(" "));
        }
        currentSegment = [];
        continue;
      }

      const sx = toSVGX(x);
      const sy = toSVGY(Math.max(Y_MIN - 1, Math.min(Y_MAX + 1, y)));
      const clampedSy = Math.max(PADDING - 10, Math.min(SVG_H - PADDING + 10, sy));
      currentSegment.push(
        `${currentSegment.length === 0 ? "M" : "L"}${sx.toFixed(1)},${clampedSy.toFixed(1)}`
      );
    }
    if (currentSegment.length > 1) {
      segments.push(currentSegment.join(" "));
    }
    return segments;
  }, [asymptotes]);

  // Zeros of tan(x): x = n*pi
  const zeros = useMemo(() => {
    const zs: number[] = [];
    for (let n = -2; n <= 2; n++) {
      const x = n * Math.PI;
      if (x >= X_MIN && x <= X_MAX) {
        zs.push(x);
      }
    }
    return zs;
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <KBlock tex="y = \\tan x" />
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-w-[600px] mx-auto border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900"
        >
          {/* Horizontal grid lines */}
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => (
            <line
              key={`hg-${v}`}
              x1={PADDING}
              y1={toSVGY(v)}
              x2={SVG_W - PADDING}
              y2={toSVGY(v)}
              stroke="#e2e8f0"
              strokeWidth={0.5}
            />
          ))}

          {/* X axis */}
          <line x1={PADDING} y1={toSVGY(0)} x2={SVG_W - PADDING} y2={toSVGY(0)} stroke="#94a3b8" strokeWidth={1} />
          {/* Y axis */}
          <line x1={toSVGX(0)} y1={PADDING} x2={toSVGX(0)} y2={SVG_H - PADDING} stroke="#94a3b8" strokeWidth={1} />

          {/* Y-axis labels */}
          {[-4, -2, 2, 4].map((v) => (
            <text key={`yl-${v}`} x={toSVGX(0) - 8} y={toSVGY(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {v}
            </text>
          ))}

          <text x={toSVGX(0) - 8} y={toSVGY(0) + 14} textAnchor="end" fontSize={10} fill="#94a3b8">
            O
          </text>

          {/* Asymptotes */}
          {asymptotes.map((a) => (
            <line
              key={`asym-${a}`}
              x1={toSVGX(a)}
              y1={PADDING}
              x2={toSVGX(a)}
              y2={SVG_H - PADDING}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="6,4"
              opacity={0.7}
            />
          ))}

          {/* Tangent curve segments */}
          {pathSegments.map((d, i) => (
            <path key={`seg-${i}`} d={d} fill="none" stroke="#f59e0b" strokeWidth={2} />
          ))}

          {/* Zeros */}
          {zeros.map((z) => (
            <circle
              key={`zero-${z}`}
              cx={toSVGX(z)}
              cy={toSVGY(0)}
              r={3.5}
              fill="#64748b"
              stroke="white"
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">周期</div>
          <K tex="T = \pi" />
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 mb-1">漸近線</div>
          <K tex={`x = \\frac{\\pi}{2} + n\\pi`} />
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 space-y-3">
        <p className="font-bold">tan x の特徴</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <K tex="\tan x = \dfrac{\sin x}{\cos x}" /> で定義される
          </li>
          <li>
            <K tex="\cos x = 0" /> となる <K tex={`x = \\frac{\\pi}{2} + n\\pi`} /> で未定義（赤い点線が漸近線）
          </li>
          <li>
            周期は <K tex="\pi" />（sin/cos の半分）
          </li>
          <li>
            原点を通り、奇関数: <K tex="\tan(-x) = -\tan x" />
          </li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: "tanx = sinx/cosx なので、cosx = 0 の点で漸近線が現れます" },
        { step: 2, text: "tanのグラフの周期はπ（sin/cosの半分）です" },
        { step: 3, text: "tanは奇関数なので原点対称：tan(-x) = -tan(x) です" },
      ]} />
    </div>
  );
}
