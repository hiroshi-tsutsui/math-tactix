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

const SVG_SIZE = 300;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const R = 110;

export default function DoubleAngleViz() {
  const [angleDeg, setAngleDeg] = useState(30);

  const alphaRad = (angleDeg * Math.PI) / 180;
  const doubleRad = 2 * alphaRad;

  const sinA = Math.sin(alphaRad);
  const cosA = Math.cos(alphaRad);
  const tanA = Math.tan(alphaRad);

  const sin2A = Math.sin(doubleRad);
  const cos2A = Math.cos(doubleRad);
  // tan is undefined at 90 degrees
  const tan2AValid = Math.abs(Math.cos(doubleRad)) > 1e-10;
  const tan2A = tan2AValid ? Math.tan(doubleRad) : NaN;

  // Unit circle points
  const alphaPoint = { x: CX + R * cosA, y: CY - R * sinA };
  const doublePoint = { x: CX + R * Math.cos(doubleRad), y: CY - R * Math.sin(doubleRad) };

  // Arc path for angle alpha
  const arcPath = useMemo(() => {
    const arcR = 30;
    const steps = 40;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (alphaRad * i) / steps;
      const px = CX + arcR * Math.cos(t);
      const py = CY - arcR * Math.sin(t);
      pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [alphaRad]);

  // Arc path for angle 2*alpha
  const doubleArcPath = useMemo(() => {
    const arcR = 22;
    const steps = 60;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (doubleRad * i) / steps;
      const px = CX + arcR * Math.cos(t);
      const py = CY - arcR * Math.sin(t);
      pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [doubleRad]);

  const fmt = (v: number) => {
    if (isNaN(v) || !isFinite(v)) return "\\text{undefined}";
    return v.toFixed(4);
  };

  const [showDerivation, setShowDerivation] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">倍角公式</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          加法定理から導かれる倍角の公式を視覚的に確認しましょう
        </p>
      </div>

      {/* Formulas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">倍角公式</div>
        <KBlock tex="\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha" />
        <KBlock tex="\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha" />
        <KBlock tex="\\tan 2\\alpha = \\dfrac{2\\tan\\alpha}{1 - \\tan^2\\alpha}" />
      </div>

      {/* Unit Circle SVG */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[300px] border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900"
        >
          {/* Circle */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#cbd5e1" strokeWidth={1} />

          {/* Axes */}
          <line x1={CX - R - 15} y1={CY} x2={CX + R + 15} y2={CY} stroke="#94a3b8" strokeWidth={0.8} />
          <line x1={CX} y1={CY - R - 15} x2={CX} y2={CY + R + 15} stroke="#94a3b8" strokeWidth={0.8} />

          {/* Alpha arc */}
          <path d={arcPath} fill="none" stroke="#3b82f6" strokeWidth={2} />
          {/* Double alpha arc */}
          <path d={doubleArcPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" />

          {/* Alpha line */}
          <line x1={CX} y1={CY} x2={alphaPoint.x} y2={alphaPoint.y} stroke="#3b82f6" strokeWidth={2} />
          {/* Double alpha line */}
          <line x1={CX} y1={CY} x2={doublePoint.x} y2={doublePoint.y} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" />

          {/* Alpha point */}
          <circle cx={alphaPoint.x} cy={alphaPoint.y} r={5} fill="#3b82f6" stroke="white" strokeWidth={2} />
          {/* Double alpha point */}
          <circle cx={doublePoint.x} cy={doublePoint.y} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />

          {/* Projections for alpha */}
          <line x1={alphaPoint.x} y1={alphaPoint.y} x2={alphaPoint.x} y2={CY} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          <line x1={CX} y1={alphaPoint.y} x2={alphaPoint.x} y2={alphaPoint.y} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />

          {/* Projections for 2alpha */}
          <line x1={doublePoint.x} y1={doublePoint.y} x2={doublePoint.x} y2={CY} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          <line x1={CX} y1={doublePoint.y} x2={doublePoint.x} y2={doublePoint.y} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />

          {/* Labels */}
          <text x={CX + 36} y={CY - 8} fontSize={12} fill="#3b82f6" fontWeight="bold">&#x03B1;</text>
          <text x={CX + 26} y={CY - 16} fontSize={11} fill="#ef4444" fontWeight="bold">2&#x03B1;</text>

          {/* Origin */}
          <text x={CX - 12} y={CY + 14} fontSize={10} fill="#94a3b8">O</text>
        </svg>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            <K tex={`\\alpha = ${angleDeg}^\\circ`} />
          </span>
          <span className="text-sm font-bold text-red-500">
            <K tex={`2\\alpha = ${2 * angleDeg}^\\circ`} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={180}
          step={1}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
        </div>
      </div>

      {/* Values table */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 space-y-2">
          <div className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-2">
            <K tex="\\alpha" /> の値
          </div>
          <div className="text-sm"><K tex={`\\sin\\alpha = ${fmt(sinA)}`} /></div>
          <div className="text-sm"><K tex={`\\cos\\alpha = ${fmt(cosA)}`} /></div>
          <div className="text-sm"><K tex={`\\tan\\alpha = ${fmt(tanA)}`} /></div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800 space-y-2">
          <div className="text-xs text-red-500 font-bold uppercase tracking-widest mb-2">
            <K tex="2\\alpha" /> の値
          </div>
          <div className="text-sm"><K tex={`\\sin 2\\alpha = ${fmt(sin2A)}`} /></div>
          <div className="text-sm"><K tex={`\\cos 2\\alpha = ${fmt(cos2A)}`} /></div>
          <div className="text-sm"><K tex={`\\tan 2\\alpha = ${fmt(tan2A)}`} /></div>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800 space-y-3">
        <div className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest">公式の検証</div>
        <div className="text-sm space-y-1">
          <div>
            <K tex={`2\\sin\\alpha\\cos\\alpha = 2 \\times ${fmt(sinA)} \\times ${fmt(cosA)} = ${fmt(2 * sinA * cosA)}`} />
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            = <K tex={`\\sin 2\\alpha = ${fmt(sin2A)}`} /> (一致)
          </div>
        </div>
        <div className="text-sm space-y-1">
          <div>
            <K tex={`\\cos^2\\alpha - \\sin^2\\alpha = ${fmt(cosA * cosA)} - ${fmt(sinA * sinA)} = ${fmt(cosA * cosA - sinA * sinA)}`} />
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            = <K tex={`\\cos 2\\alpha = ${fmt(cos2A)}`} /> (一致)
          </div>
        </div>
      </div>

      {/* cos2α の変形 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">cos 2α の3つの表現</div>
        <div className="space-y-2 text-sm">
          <div><K tex={`\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = ${fmt(cos2A)}`} /></div>
          <div><K tex={`= 2\\cos^2\\alpha - 1 = 2 \\times ${fmt(cosA * cosA)} - 1 = ${fmt(2 * cosA * cosA - 1)}`} /></div>
          <div><K tex={`= 1 - 2\\sin^2\\alpha = 1 - 2 \\times ${fmt(sinA * sinA)} = ${fmt(1 - 2 * sinA * sinA)}`} /></div>
        </div>
      </div>

      {/* Derivation toggle */}
      <button
        onClick={() => setShowDerivation(!showDerivation)}
        className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium transition-colors text-left"
      >
        {showDerivation ? "▼ 加法定理からの導出を隠す" : "▶ 加法定理からの導出を見る"}
      </button>

      {showDerivation && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 space-y-4">
          <div className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest">導出過程</div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-1">sin の倍角公式:</div>
              <KBlock tex="\\sin 2\\alpha = \\sin(\\alpha + \\alpha)" />
              <KBlock tex="= \\sin\\alpha\\cos\\alpha + \\cos\\alpha\\sin\\alpha" />
              <KBlock tex="= 2\\sin\\alpha\\cos\\alpha" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">cos の倍角公式:</div>
              <KBlock tex="\\cos 2\\alpha = \\cos(\\alpha + \\alpha)" />
              <KBlock tex="= \\cos\\alpha\\cos\\alpha - \\sin\\alpha\\sin\\alpha" />
              <KBlock tex="= \\cos^2\\alpha - \\sin^2\\alpha" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">tan の倍角公式:</div>
              <KBlock tex="\\tan 2\\alpha = \\tan(\\alpha + \\alpha) = \\dfrac{\\tan\\alpha + \\tan\\alpha}{1 - \\tan\\alpha\\tan\\alpha}" />
              <KBlock tex="= \\dfrac{2\\tan\\alpha}{1 - \\tan^2\\alpha}" />
            </div>
          </div>
        </div>
      )}

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "加法定理 sin(A+B) = sinA cosB + cosA sinB に A=B=α を代入してみよう" },
          { step: 2, text: "sin2α = sin(α+α) = sinα cosα + cosα sinα = 2sinα cosα となります" },
          { step: 3, text: "cos2α = cos(α+α) = cosα cosα - sinα sinα = cos²α - sin²α" },
          { step: 4, text: "sin²α + cos²α = 1 を使うと cos2α = 2cos²α - 1 = 1 - 2sin²α に変形できます" },
        ]}
      />
    </div>
  );
}
