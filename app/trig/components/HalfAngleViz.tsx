"use client";

import React, { useState, useRef, useEffect } from "react";
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
const RADIUS = 110;

const fmt = (v: number) => {
  if (isNaN(v) || !isFinite(v)) return "\\text{undefined}";
  return v.toFixed(4);
};

export default function HalfAngleViz() {
  const [angleDeg, setAngleDeg] = useState(60);
  const [showDerivation, setShowDerivation] = useState(false);

  const alphaRad = (angleDeg * Math.PI) / 180;
  const halfRad = alphaRad / 2;

  const cosAlpha = Math.cos(alphaRad);
  const sinHalf = Math.sin(halfRad);
  const cosHalf = Math.cos(halfRad);
  const tanHalf = Math.tan(halfRad);

  const sinSqHalf = sinHalf * sinHalf;
  const cosSqHalf = cosHalf * cosHalf;
  const tanSqHalf = tanHalf * tanHalf;

  // Formula values
  const formulaSinSq = (1 - cosAlpha) / 2;
  const formulaCosSq = (1 + cosAlpha) / 2;
  const formulaTanSqValid = Math.abs(1 + cosAlpha) > 1e-10;
  const formulaTanSq = formulaTanSqValid ? (1 - cosAlpha) / (1 + cosAlpha) : NaN;

  // Unit circle points
  const alphaPoint = { x: CX + RADIUS * Math.cos(alphaRad), y: CY - RADIUS * Math.sin(alphaRad) };
  const halfPoint = { x: CX + RADIUS * Math.cos(halfRad), y: CY - RADIUS * Math.sin(halfRad) };

  // Arc for alpha
  const makeArc = (angle: number, radius: number) => {
    const steps = Math.max(20, Math.floor(Math.abs(angle) / Math.PI * 60));
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (angle * i) / steps;
      const px = CX + radius * Math.cos(t);
      const py = CY - radius * Math.sin(t);
      pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const halfDeg = angleDeg / 2;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">半角公式</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          倍角公式の逆変換から導かれる半角の公式を確認しましょう
        </p>
      </div>

      {/* Formulas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">半角公式</div>
        <KBlock tex="\\sin^2\\dfrac{\\alpha}{2} = \\dfrac{1 - \\cos\\alpha}{2}" />
        <KBlock tex="\\cos^2\\dfrac{\\alpha}{2} = \\dfrac{1 + \\cos\\alpha}{2}" />
        <KBlock tex="\\tan^2\\dfrac{\\alpha}{2} = \\dfrac{1 - \\cos\\alpha}{1 + \\cos\\alpha}" />
      </div>

      {/* Unit Circle */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[300px] border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900"
        >
          {/* Circle */}
          <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#cbd5e1" strokeWidth={1} />

          {/* Axes */}
          <line x1={CX - RADIUS - 15} y1={CY} x2={CX + RADIUS + 15} y2={CY} stroke="#94a3b8" strokeWidth={0.8} />
          <line x1={CX} y1={CY - RADIUS - 15} x2={CX} y2={CY + RADIUS + 15} stroke="#94a3b8" strokeWidth={0.8} />

          {/* Alpha arc */}
          <path d={makeArc(alphaRad, 28)} fill="none" stroke="#8b5cf6" strokeWidth={2} />
          {/* Half alpha arc */}
          <path d={makeArc(halfRad, 36)} fill="none" stroke="#22c55e" strokeWidth={2} />

          {/* Alpha line */}
          <line x1={CX} y1={CY} x2={alphaPoint.x} y2={alphaPoint.y} stroke="#8b5cf6" strokeWidth={2} />
          {/* Half angle line */}
          <line x1={CX} y1={CY} x2={halfPoint.x} y2={halfPoint.y} stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" />

          {/* Alpha point */}
          <circle cx={alphaPoint.x} cy={alphaPoint.y} r={5} fill="#8b5cf6" stroke="white" strokeWidth={2} />
          {/* Half alpha point */}
          <circle cx={halfPoint.x} cy={halfPoint.y} r={5} fill="#22c55e" stroke="white" strokeWidth={2} />

          {/* Projections */}
          <line x1={halfPoint.x} y1={halfPoint.y} x2={halfPoint.x} y2={CY} stroke="#22c55e" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          <line x1={CX} y1={halfPoint.y} x2={halfPoint.x} y2={halfPoint.y} stroke="#22c55e" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />

          {/* Labels */}
          <text x={CX + 34} y={CY - 6} fontSize={11} fill="#8b5cf6" fontWeight="bold">&#x03B1;</text>
          <text x={CX + 40} y={CY - 14} fontSize={10} fill="#22c55e" fontWeight="bold">&#x03B1;/2</text>

          {/* Origin */}
          <text x={CX - 12} y={CY + 14} fontSize={10} fill="#94a3b8">O</text>
        </svg>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            <K tex={`\\alpha = ${angleDeg}^\\circ`} />
          </span>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            <K tex={`\\dfrac{\\alpha}{2} = ${halfDeg}^\\circ`} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>360°</span>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800 space-y-2">
          <div className="text-xs text-purple-500 font-bold uppercase tracking-widest mb-2">
            <K tex="\\alpha" /> の値
          </div>
          <div className="text-sm"><K tex={`\\cos\\alpha = ${fmt(cosAlpha)}`} /></div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800 space-y-2">
          <div className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mb-2">
            <K tex="\\alpha/2" /> の値
          </div>
          <div className="text-sm"><K tex={`\\sin\\dfrac{\\alpha}{2} = ${fmt(sinHalf)}`} /></div>
          <div className="text-sm"><K tex={`\\cos\\dfrac{\\alpha}{2} = ${fmt(cosHalf)}`} /></div>
          <div className="text-sm"><K tex={`\\tan\\dfrac{\\alpha}{2} = ${fmt(tanHalf)}`} /></div>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800 space-y-4">
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">公式の検証</div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              <K tex="\\sin^2(\\alpha/2)" /> の検証:
            </div>
            <div className="pl-2">
              <K tex={`\\sin^2\\dfrac{\\alpha}{2} = ${fmt(sinSqHalf)}`} />
            </div>
            <div className="pl-2">
              <K tex={`\\dfrac{1 - \\cos\\alpha}{2} = \\dfrac{1 - (${fmt(cosAlpha)})}{2} = ${fmt(formulaSinSq)}`} />
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 pl-2">(一致)</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">
              <K tex="\\cos^2(\\alpha/2)" /> の検証:
            </div>
            <div className="pl-2">
              <K tex={`\\cos^2\\dfrac{\\alpha}{2} = ${fmt(cosSqHalf)}`} />
            </div>
            <div className="pl-2">
              <K tex={`\\dfrac{1 + \\cos\\alpha}{2} = \\dfrac{1 + (${fmt(cosAlpha)})}{2} = ${fmt(formulaCosSq)}`} />
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 pl-2">(一致)</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">
              <K tex="\\tan^2(\\alpha/2)" /> の検証:
            </div>
            <div className="pl-2">
              <K tex={`\\tan^2\\dfrac{\\alpha}{2} = ${fmt(tanSqHalf)}`} />
            </div>
            <div className="pl-2">
              <K tex={`\\dfrac{1 - \\cos\\alpha}{1 + \\cos\\alpha} = \\dfrac{1 - (${fmt(cosAlpha)})}{1 + (${fmt(cosAlpha)})} = ${fmt(formulaTanSq)}`} />
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 pl-2">(一致)</div>
          </div>
        </div>
      </div>

      {/* Derivation toggle */}
      <button
        onClick={() => setShowDerivation(!showDerivation)}
        className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium transition-colors text-left"
      >
        {showDerivation ? "▼ 倍角公式からの導出を隠す" : "▶ 倍角公式からの導出を見る"}
      </button>

      {showDerivation && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 space-y-4">
          <div className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest">導出過程</div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-2">倍角公式から出発:</div>
              <KBlock tex="\\cos 2\\theta = 1 - 2\\sin^2\\theta" />
              <div className="text-xs text-slate-500 my-1">両辺を整理して:</div>
              <KBlock tex="\\sin^2\\theta = \\dfrac{1 - \\cos 2\\theta}{2}" />
              <div className="text-xs text-slate-500 my-1">
                <K tex="\\theta = \\alpha/2" /> と置くと <K tex="2\\theta = \\alpha" /> なので:
              </div>
              <KBlock tex="\\sin^2\\dfrac{\\alpha}{2} = \\dfrac{1 - \\cos\\alpha}{2}" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-2">同様に:</div>
              <KBlock tex="\\cos 2\\theta = 2\\cos^2\\theta - 1" />
              <KBlock tex="\\cos^2\\theta = \\dfrac{1 + \\cos 2\\theta}{2}" />
              <KBlock tex="\\cos^2\\dfrac{\\alpha}{2} = \\dfrac{1 + \\cos\\alpha}{2}" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-2">tan の半角公式:</div>
              <KBlock tex="\\tan^2\\dfrac{\\alpha}{2} = \\dfrac{\\sin^2(\\alpha/2)}{\\cos^2(\\alpha/2)} = \\dfrac{(1 - \\cos\\alpha)/2}{(1 + \\cos\\alpha)/2} = \\dfrac{1 - \\cos\\alpha}{1 + \\cos\\alpha}" />
            </div>
          </div>
        </div>
      )}

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "cos2θ = 1 - 2sin²θ という倍角公式を思い出しましょう" },
          { step: 2, text: "これを sin²θ について解くと sin²θ = (1 - cos2θ)/2 です" },
          { step: 3, text: "θ = α/2 と置けば 2θ = α となり、sin²(α/2) = (1 - cosα)/2 が得られます" },
          { step: 4, text: "cos の半角公式も同様に cos2θ = 2cos²θ - 1 から導けます" },
        ]}
      />
    </div>
  );
}
