"use client";

import React, { useState, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
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
  return <div ref={ref} className="my-2" />;
};

interface ConfidenceIntervalVizProps {
  onComplete?: () => void;
}

export default function ConfidenceIntervalViz({ onComplete }: ConfidenceIntervalVizProps) {
  const [sigma, setSigma] = useState(10);
  const [n, setN] = useState(25);
  const [xBar, setXBar] = useState(50);
  const [confidenceLevel, setConfidenceLevel] = useState<95 | 99>(95);
  const hasCompleted = useRef(false);

  const z = confidenceLevel === 95 ? 1.96 : 2.576;
  const standardError = sigma / Math.sqrt(n);
  const marginOfError = z * standardError;
  const lower = xBar - marginOfError;
  const upper = xBar + marginOfError;
  const intervalWidth = upper - lower;

  useEffect(() => {
    if (!hasCompleted.current && onComplete) {
      // Complete after user interacts (changes any parameter)
      const timer = setTimeout(() => {
        hasCompleted.current = true;
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sigma, n, xBar, confidenceLevel, onComplete]);

  // SVG Number Line
  const svgWidth = 560;
  const svgHeight = 120;
  const lineY = 60;
  const margin = 40;
  const plotW = svgWidth - 2 * margin;

  // Dynamic range: center on xBar, show +/- 4*SE or at least +/- 10
  const displayRange = Math.max(4 * standardError, 10);
  const minX = xBar - displayRange;
  const maxX = xBar + displayRange;

  const toSvgX = (val: number) => {
    return margin + ((val - minX) / (maxX - minX)) * plotW;
  };

  const tickValues = (() => {
    const step = displayRange > 30 ? 10 : displayRange > 15 ? 5 : displayRange > 5 ? 2 : 1;
    const ticks: number[] = [];
    const start = Math.ceil(minX / step) * step;
    for (let v = start; v <= maxX; v += step) {
      ticks.push(v);
    }
    return ticks;
  })();

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        信頼区間の構成 (Confidence Interval)
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        母標準偏差 <K tex="\sigma" /> が既知のとき、標本平均 <K tex="\bar{X}" />{" "}
        から母平均 <K tex="\mu" /> の信頼区間を構成します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3">パラメータ設定</h4>
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    母標準偏差 <K tex={`\\sigma = ${sigma}`} />
                  </span>
                  <span className="text-slate-400">1 ~ 30</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={sigma}
                  onChange={(e) => setSigma(parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    標本サイズ <K tex={`n = ${n}`} />
                  </span>
                  <span className="text-slate-400">1 ~ 200</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    標本平均 <K tex={`\\bar{X} = ${xBar}`} />
                  </span>
                  <span className="text-slate-400">20 ~ 80</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="0.5"
                  value={xBar}
                  onChange={(e) => setXBar(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Confidence Level Toggle */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3">信頼水準</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setConfidenceLevel(95)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
                  confidenceLevel === 95
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                95% (<K tex="z = 1.96" />)
              </button>
              <button
                onClick={() => setConfidenceLevel(99)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
                  confidenceLevel === 99
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                99% (<K tex="z = 2.576" />)
              </button>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 text-sm mb-2">信頼区間の公式</h4>
            <KBlock
              tex={`\\bar{X} - z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}} \\leq \\mu \\leq \\bar{X} + z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}`}
            />
          </div>
        </div>

        {/* Right: Visualization and Results */}
        <div className="space-y-4">
          {/* Calculation Steps */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-800 text-sm mb-2">計算過程</h4>
            <div className="space-y-1 text-sm">
              <KBlock
                tex={`\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = ${standardError.toFixed(3)}`}
              />
              <KBlock
                tex={`E = z \\times \\text{SE} = ${z} \\times ${standardError.toFixed(3)} = ${marginOfError.toFixed(3)}`}
              />
              <div className="pt-2 border-t border-green-200 mt-2">
                <KBlock
                  tex={`${confidenceLevel}\\%\\text{ CI}: [${lower.toFixed(2)},\\; ${upper.toFixed(2)}]`}
                />
              </div>
              <p className="text-xs text-green-700 mt-1">
                区間の幅: <span className="font-bold font-mono">{intervalWidth.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* SVG Number Line */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-700 text-sm mb-2 text-center">
              数直線上の信頼区間
            </h4>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full">
              {/* Number line */}
              <line
                x1={margin}
                y1={lineY}
                x2={svgWidth - margin}
                y2={lineY}
                stroke="#64748b"
                strokeWidth={1.5}
              />

              {/* Tick marks */}
              {tickValues.map((v) => {
                const x = toSvgX(v);
                if (x < margin - 5 || x > svgWidth - margin + 5) return null;
                return (
                  <g key={v}>
                    <line
                      x1={x}
                      y1={lineY - 5}
                      x2={x}
                      y2={lineY + 5}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />
                    <text
                      x={x}
                      y={lineY + 18}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#64748b"
                    >
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Confidence interval bar */}
              <rect
                x={toSvgX(lower)}
                y={lineY - 16}
                width={toSvgX(upper) - toSvgX(lower)}
                height={12}
                fill={confidenceLevel === 95 ? "#3b82f6" : "#8b5cf6"}
                opacity={0.3}
                rx={3}
              />
              <line
                x1={toSvgX(lower)}
                y1={lineY - 20}
                x2={toSvgX(lower)}
                y2={lineY - 4}
                stroke={confidenceLevel === 95 ? "#2563eb" : "#7c3aed"}
                strokeWidth={2.5}
              />
              <line
                x1={toSvgX(upper)}
                y1={lineY - 20}
                x2={toSvgX(upper)}
                y2={lineY - 4}
                stroke={confidenceLevel === 95 ? "#2563eb" : "#7c3aed"}
                strokeWidth={2.5}
              />

              {/* Lower bound label */}
              <text
                x={toSvgX(lower)}
                y={lineY - 24}
                textAnchor="middle"
                fontSize={9}
                fill={confidenceLevel === 95 ? "#2563eb" : "#7c3aed"}
                fontWeight="bold"
              >
                {lower.toFixed(1)}
              </text>

              {/* Upper bound label */}
              <text
                x={toSvgX(upper)}
                y={lineY - 24}
                textAnchor="middle"
                fontSize={9}
                fill={confidenceLevel === 95 ? "#2563eb" : "#7c3aed"}
                fontWeight="bold"
              >
                {upper.toFixed(1)}
              </text>

              {/* Sample mean marker */}
              <circle
                cx={toSvgX(xBar)}
                cy={lineY}
                r={5}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={toSvgX(xBar)}
                y={lineY + 30}
                textAnchor="middle"
                fontSize={10}
                fill="#ef4444"
                fontWeight="bold"
              >
                X&#772; = {xBar}
              </text>
            </svg>

            <div className="flex justify-center gap-6 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> 標本平均{" "}
                <K tex="\bar{X}" />
              </span>
              <span className="flex items-center gap-1">
                <span
                  className={`inline-block w-3 h-2 rounded ${confidenceLevel === 95 ? "bg-blue-400" : "bg-purple-400"}`}
                  style={{ opacity: 0.5 }}
                />{" "}
                {confidenceLevel}% 信頼区間
              </span>
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-800 text-sm mb-2">解釈</h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              「同じ方法で100回サンプリングすると、そのうち約{confidenceLevel}回は
              構成した信頼区間の中に真の母平均 <K tex="\mu" /> が含まれる」
              という意味です。
            </p>
            <p className="text-xs text-amber-700 mt-2">
              <K tex="n" /> を大きくするか <K tex="\sigma" />{" "}
              を小さくすると区間が狭くなり、推定の精度が上がります。
              信頼水準を99%に上げると区間は広がります。
            </p>
          </div>
        </div>
      </div>

      <HintButton
        hints={[
          {
            step: 1,
            text: "信頼区間は X̄ ± z × σ/√n で構成します。z は信頼水準に対応する正規分布の値です。",
          },
          {
            step: 2,
            text: "95%信頼区間では z = 1.96、99%信頼区間では z = 2.576 を使います。",
          },
          {
            step: 3,
            text: "標本サイズ n を4倍にすると、信頼区間の幅は半分（1/2）になります（√4 = 2 のため）。",
          },
          {
            step: 4,
            text: "信頼区間は「この区間に母平均がある確率が95%」ではなく、「この方法で区間を作ると95%の確率で母平均を含む」という意味です。",
          },
        ]}
      />
    </div>
  );
}
