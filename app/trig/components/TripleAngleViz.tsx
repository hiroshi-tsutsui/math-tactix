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

export default function TripleAngleViz() {
  const [alphaDeg, setAlphaDeg] = useState(30);
  const [showDerivation, setShowDerivation] = useState(false);

  const alphaRad = useMemo(() => (alphaDeg * Math.PI) / 180, [alphaDeg]);

  const sinA = Math.sin(alphaRad);
  const cosA = Math.cos(alphaRad);
  const tanA = Math.tan(alphaRad);

  // Triple angle values
  const sin3A = 3 * sinA - 4 * sinA * sinA * sinA;
  const cos3A = 4 * cosA * cosA * cosA - 3 * cosA;
  const tripleRad = 3 * alphaRad;
  const sin3A_direct = Math.sin(tripleRad);
  const cos3A_direct = Math.cos(tripleRad);

  // tan3A (avoid division by zero)
  const tan3ADenom = 1 - 3 * tanA * tanA;
  const tan3A =
    Math.abs(tan3ADenom) > 1e-10
      ? (3 * tanA - tanA * tanA * tanA) / tan3ADenom
      : NaN;
  const tan3A_direct = Math.tan(tripleRad);

  // Unit circle points
  const alphaPoint = { x: CX + R * Math.cos(alphaRad), y: CY - R * Math.sin(alphaRad) };
  const triplePoint = { x: CX + R * Math.cos(tripleRad), y: CY - R * Math.sin(tripleRad) };

  // Arc path for alpha
  const arcPath = useMemo(() => {
    const steps = 40;
    const pts: string[] = [];
    const endAngle = Math.min(alphaRad, 2 * Math.PI);
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * endAngle;
      const x = CX + 30 * Math.cos(a);
      const y = CY - 30 * Math.sin(a);
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [alphaRad]);

  // Arc path for 3alpha
  const tripleArcPath = useMemo(() => {
    const steps = 60;
    const pts: string[] = [];
    const endAngle = tripleRad;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * endAngle;
      const x = CX + 45 * Math.cos(a);
      const y = CY - 45 * Math.sin(a);
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [tripleRad]);

  const fmt = (v: number) => (Number.isNaN(v) ? "---" : v.toFixed(4));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">三倍角公式</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          sin3α, cos3α, tan3α を加法定理・倍角公式から導出
        </p>
      </div>

      {/* Formulas */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800 space-y-3">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-2">三倍角の公式</h4>
        <KBlock tex="\\sin 3\\alpha = 3\\sin\\alpha - 4\\sin^3\\alpha" />
        <KBlock tex="\\cos 3\\alpha = 4\\cos^3\\alpha - 3\\cos\\alpha" />
        <KBlock tex="\\tan 3\\alpha = \\frac{3\\tan\\alpha - \\tan^3\\alpha}{1 - 3\\tan^2\\alpha}" />
      </div>

      {/* Unit Circle SVG */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[300px]"
        >
          {/* Grid */}
          <line x1={0} y1={CY} x2={SVG_SIZE} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={CX} y1={0} x2={CX} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth={1} />

          {/* Unit circle */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={SVG_SIZE - 10} y={CY - 8} fontSize={11} fill="#94a3b8" textAnchor="end">x</text>
          <text x={CX + 8} y={14} fontSize={11} fill="#94a3b8">y</text>

          {/* Alpha arc */}
          <path d={arcPath} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.6} />
          {/* 3-alpha arc */}
          <path d={tripleArcPath} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.4} />

          {/* Alpha radius */}
          <line x1={CX} y1={CY} x2={alphaPoint.x} y2={alphaPoint.y} stroke="#3b82f6" strokeWidth={2} />
          {/* 3alpha radius */}
          <line x1={CX} y1={CY} x2={triplePoint.x} y2={triplePoint.y} stroke="#ef4444" strokeWidth={2} />

          {/* Alpha point */}
          <circle cx={alphaPoint.x} cy={alphaPoint.y} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />
          {/* 3alpha point */}
          <circle cx={triplePoint.x} cy={triplePoint.y} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />

          {/* Labels */}
          <text
            x={alphaPoint.x + (alphaPoint.x > CX ? 10 : -10)}
            y={alphaPoint.y + (alphaPoint.y > CY ? 16 : -10)}
            fontSize={12}
            fontWeight="bold"
            fill="#3b82f6"
            textAnchor={alphaPoint.x > CX ? "start" : "end"}
          >
            {"\u03B1"}={alphaDeg}°
          </text>
          <text
            x={triplePoint.x + (triplePoint.x > CX ? 10 : -10)}
            y={triplePoint.y + (triplePoint.y > CY ? 16 : -10)}
            fontSize={12}
            fontWeight="bold"
            fill="#ef4444"
            textAnchor={triplePoint.x > CX ? "start" : "end"}
          >
            3{"\u03B1"}={alphaDeg * 3}°
          </text>
        </svg>
      </div>

      {/* Slider */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-bold text-blue-600">
            <K tex={`\\alpha = ${alphaDeg}^\\circ`} />
          </span>
          <span className="text-slate-400">
            <K tex={`3\\alpha = ${alphaDeg * 3}^\\circ`} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          step={1}
          value={alphaDeg}
          onChange={(e) => setAlphaDeg(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0°</span>
          <span>60°</span>
        </div>
      </div>

      {/* Real-time values */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">リアルタイム検証</h4>

        {/* sin */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 space-y-2">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">sin 3α</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">公式から計算</div>
              <div className="font-mono font-bold">
                <K tex={`3\\sin\\alpha - 4\\sin^3\\alpha = ${fmt(sin3A)}`} />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">直接計算</div>
              <div className="font-mono font-bold">
                <K tex={`\\sin(3 \\times ${alphaDeg}^\\circ) = ${fmt(sin3A_direct)}`} />
              </div>
            </div>
          </div>
          <div className={`text-xs font-bold ${Math.abs(sin3A - sin3A_direct) < 1e-8 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(sin3A - sin3A_direct) < 1e-8 ? "一致" : `差: ${Math.abs(sin3A - sin3A_direct).toExponential(2)}`}
          </div>
        </div>

        {/* cos */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 space-y-2">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400">cos 3α</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">公式から計算</div>
              <div className="font-mono font-bold">
                <K tex={`4\\cos^3\\alpha - 3\\cos\\alpha = ${fmt(cos3A)}`} />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">直接計算</div>
              <div className="font-mono font-bold">
                <K tex={`\\cos(3 \\times ${alphaDeg}^\\circ) = ${fmt(cos3A_direct)}`} />
              </div>
            </div>
          </div>
          <div className={`text-xs font-bold ${Math.abs(cos3A - cos3A_direct) < 1e-8 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(cos3A - cos3A_direct) < 1e-8 ? "一致" : `差: ${Math.abs(cos3A - cos3A_direct).toExponential(2)}`}
          </div>
        </div>

        {/* tan */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 space-y-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400">tan 3α</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">公式から計算</div>
              <div className="font-mono font-bold">
                <K tex={`\\frac{3\\tan\\alpha - \\tan^3\\alpha}{1 - 3\\tan^2\\alpha} = ${fmt(tan3A)}`} />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">直接計算</div>
              <div className="font-mono font-bold">
                <K tex={`\\tan(3 \\times ${alphaDeg}^\\circ) = ${fmt(tan3A_direct)}`} />
              </div>
            </div>
          </div>
          {!Number.isNaN(tan3A) && (
            <div className={`text-xs font-bold ${Math.abs(tan3A - tan3A_direct) < 1e-6 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(tan3A - tan3A_direct) < 1e-6 ? "一致" : `差: ${Math.abs(tan3A - tan3A_direct).toExponential(2)}`}
            </div>
          )}
          {Number.isNaN(tan3A) && (
            <div className="text-xs font-bold text-red-600">分母 = 0（未定義）</div>
          )}
        </div>

        {/* Basic values */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-400">sin α</div>
            <div className="font-mono text-sm font-bold">{fmt(sinA)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-400">cos α</div>
            <div className="font-mono text-sm font-bold">{fmt(cosA)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-400">tan α</div>
            <div className="font-mono text-sm font-bold">{fmt(tanA)}</div>
          </div>
        </div>
      </div>

      {/* Derivation toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className="w-full flex items-center justify-between p-4 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>導出過程を{showDerivation ? "隠す" : "表示"}</span>
          <span className="text-lg">{showDerivation ? "▲" : "▼"}</span>
        </button>

        {showDerivation && (
          <div className="px-5 pb-5 space-y-4">
            {/* sin derivation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">sin 3α の導出</div>
              <div className="space-y-1 text-sm">
                <KBlock tex="\\sin 3\\alpha = \\sin(2\\alpha + \\alpha)" />
                <KBlock tex="= \\sin 2\\alpha \\cos\\alpha + \\cos 2\\alpha \\sin\\alpha" />
                <KBlock tex="= 2\\sin\\alpha\\cos^2\\alpha + (1 - 2\\sin^2\\alpha)\\sin\\alpha" />
                <KBlock tex="= 2\\sin\\alpha(1 - \\sin^2\\alpha) + \\sin\\alpha - 2\\sin^3\\alpha" />
                <KBlock tex="= 2\\sin\\alpha - 2\\sin^3\\alpha + \\sin\\alpha - 2\\sin^3\\alpha" />
                <KBlock tex="= 3\\sin\\alpha - 4\\sin^3\\alpha" />
              </div>
            </div>

            {/* cos derivation */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">cos 3α の導出</div>
              <div className="space-y-1 text-sm">
                <KBlock tex="\\cos 3\\alpha = \\cos(2\\alpha + \\alpha)" />
                <KBlock tex="= \\cos 2\\alpha \\cos\\alpha - \\sin 2\\alpha \\sin\\alpha" />
                <KBlock tex="= (2\\cos^2\\alpha - 1)\\cos\\alpha - 2\\sin^2\\alpha\\cos\\alpha" />
                <KBlock tex="= 2\\cos^3\\alpha - \\cos\\alpha - 2(1 - \\cos^2\\alpha)\\cos\\alpha" />
                <KBlock tex="= 2\\cos^3\\alpha - \\cos\\alpha - 2\\cos\\alpha + 2\\cos^3\\alpha" />
                <KBlock tex="= 4\\cos^3\\alpha - 3\\cos\\alpha" />
              </div>
            </div>

            {/* tan derivation */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">tan 3α の導出</div>
              <div className="space-y-1 text-sm">
                <KBlock tex="\\tan 3\\alpha = \\tan(2\\alpha + \\alpha) = \\frac{\\tan 2\\alpha + \\tan\\alpha}{1 - \\tan 2\\alpha \\cdot \\tan\\alpha}" />
                <KBlock tex="\\tan 2\\alpha = \\frac{2\\tan\\alpha}{1 - \\tan^2\\alpha}" />
                <KBlock tex="\\tan 3\\alpha = \\frac{\\frac{2\\tan\\alpha}{1-\\tan^2\\alpha} + \\tan\\alpha}{1 - \\frac{2\\tan\\alpha}{1-\\tan^2\\alpha} \\cdot \\tan\\alpha}" />
                <KBlock tex="= \\frac{2\\tan\\alpha + \\tan\\alpha(1-\\tan^2\\alpha)}{(1-\\tan^2\\alpha) - 2\\tan^2\\alpha}" />
                <KBlock tex="= \\frac{3\\tan\\alpha - \\tan^3\\alpha}{1 - 3\\tan^2\\alpha}" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <HintButton
        hints={[
          { step: 1, text: "三倍角公式は sin3α = sin(2α + α) として加法定理を適用するところから始めます。" },
          { step: 2, text: "sin2α = 2sinα cosα, cos2α = 1 - 2sin²α を代入して展開します。" },
          { step: 3, text: "cos²α = 1 - sin²α の関係を使って sin だけの式に整理すると sin3α = 3sinα - 4sin³α が得られます。" },
          { step: 4, text: "cos3α も同様に cos(2α + α) から導出。tan3α は tan(2α + α) と tan2α の公式を組み合わせます。" },
        ]}
      />

      {/* Memorable formulas */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
        <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-3">覚え方のポイント</h4>
        <ul className="text-sm text-green-600 dark:text-green-300 space-y-2 list-disc list-inside">
          <li>
            <K tex="\\sin 3\\alpha" /> の係数: <strong>3, -4</strong>（sinのみで構成）
          </li>
          <li>
            <K tex="\\cos 3\\alpha" /> の係数: <strong>4, -3</strong>（cosのみで構成、sinと符号反転パターン）
          </li>
          <li>
            三倍角公式は<strong>加法定理 + 倍角公式</strong>の組み合わせで必ず導出できます
          </li>
          <li>
            <K tex="\\sin 3\\alpha = 0" /> の解は <K tex="\\alpha = 0^\\circ, 60^\\circ, 120^\\circ, \\ldots" />（60°ごと）
          </li>
        </ul>
      </div>
    </div>
  );
}
