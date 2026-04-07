"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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

interface SamplingDistributionVizProps {
  onComplete?: () => void;
}

export default function SamplingDistributionViz({ onComplete }: SamplingDistributionVizProps) {
  const [mu, setMu] = useState(50);
  const [sigma, setSigma] = useState(10);
  const [n, setN] = useState(25);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const hasCompleted = useRef(false);

  const standardError = sigma / Math.sqrt(n);

  // Box-Muller transform for normal random numbers
  const normalRandom = useCallback((mean: number, sd: number): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + sd * z;
  }, []);

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    const means: number[] = [];
    for (let i = 0; i < 1000; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += normalRandom(mu, sigma);
      }
      means.push(sum / n);
    }
    setSampleMeans(means);
    setIsSimulating(false);

    if (!hasCompleted.current && onComplete) {
      hasCompleted.current = true;
      onComplete();
    }
  }, [mu, sigma, n, normalRandom, onComplete]);

  const resetSimulation = useCallback(() => {
    setSampleMeans([]);
    hasCompleted.current = false;
  }, []);

  // Build histogram data
  const histogramData = (() => {
    if (sampleMeans.length === 0) return { bins: [], maxCount: 0 };

    const binCount = 30;
    const minVal = mu - 4 * standardError;
    const maxVal = mu + 4 * standardError;
    const binWidth = (maxVal - minVal) / binCount;

    const bins: { start: number; end: number; count: number }[] = [];
    for (let i = 0; i < binCount; i++) {
      bins.push({
        start: minVal + i * binWidth,
        end: minVal + (i + 1) * binWidth,
        count: 0,
      });
    }

    for (const mean of sampleMeans) {
      const idx = Math.floor((mean - minVal) / binWidth);
      if (idx >= 0 && idx < binCount) {
        bins[idx].count++;
      }
    }

    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return { bins, maxCount };
  })();

  // Stats from simulation
  const simMean =
    sampleMeans.length > 0
      ? sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length
      : 0;
  const simSD =
    sampleMeans.length > 0
      ? Math.sqrt(
          sampleMeans.reduce((acc, x) => acc + (x - simMean) ** 2, 0) /
            sampleMeans.length
        )
      : 0;

  const svgWidth = 500;
  const svgHeight = 260;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = svgWidth - margin.left - margin.right;
  const plotH = svgHeight - margin.top - margin.bottom;

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        標本分布の基礎 (Sampling Distribution)
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        母集団から標本サイズ <K tex="n" /> のサンプルを1000回抽出し、標本平均{" "}
        <K tex="\bar{X}" /> の分布を観察します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3">
              母集団パラメータ
            </h4>
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    母平均 <K tex={`\\mu = ${mu}`} />
                  </span>
                  <span className="text-slate-400">40 ~ 60</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="60"
                  step="1"
                  value={mu}
                  onChange={(e) => {
                    setMu(parseInt(e.target.value));
                    resetSimulation();
                  }}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    母標準偏差 <K tex={`\\sigma = ${sigma}`} />
                  </span>
                  <span className="text-slate-400">1 ~ 20</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={sigma}
                  onChange={(e) => {
                    setSigma(parseInt(e.target.value));
                    resetSimulation();
                  }}
                  className="w-full accent-green-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>
                    標本サイズ <K tex={`n = ${n}`} />
                  </span>
                  <span className="text-slate-400">1 ~ 100</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={n}
                  onChange={(e) => {
                    setN(parseInt(e.target.value));
                    resetSimulation();
                  }}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSimulating
              ? "シミュレーション中..."
              : sampleMeans.length > 0
                ? "再シミュレーション (1000回)"
                : "シミュレーション開始 (1000回)"}
          </button>

          {/* Theoretical vs Simulated */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 text-sm mb-2">
              理論値 (Theory)
            </h4>
            <div className="space-y-1 text-sm">
              <KBlock
                tex={`E(\\bar{X}) = \\mu = ${mu}`}
              />
              <KBlock
                tex={`V(\\bar{X}) = \\frac{\\sigma^2}{n} = \\frac{${sigma}^2}{${n}} = ${(sigma ** 2 / n).toFixed(2)}`}
              />
              <KBlock
                tex={`\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = ${standardError.toFixed(3)}`}
              />
            </div>
          </div>

          {sampleMeans.length > 0 && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-800 text-sm mb-2">
                シミュレーション結果
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-green-900">
                  標本平均の平均:{" "}
                  <span className="font-bold font-mono">
                    {simMean.toFixed(3)}
                  </span>
                  <span className="text-xs text-green-600 ml-2">
                    (理論値: {mu})
                  </span>
                </p>
                <p className="text-green-900">
                  標本平均の標準偏差:{" "}
                  <span className="font-bold font-mono">
                    {simSD.toFixed(3)}
                  </span>
                  <span className="text-xs text-green-600 ml-2">
                    (理論値: {standardError.toFixed(3)})
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Histogram */}
        <div className="flex flex-col items-center">
          <div className="bg-white border border-slate-200 rounded-xl p-4 w-full">
            <h4 className="font-bold text-slate-700 text-sm mb-2 text-center">
              標本平均 <K tex="\bar{X}" /> の分布 (n=1000)
            </h4>
            {sampleMeans.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                シミュレーションを実行してください
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full"
                style={{ maxHeight: 300 }}
              >
                {/* Axes */}
                <line
                  x1={margin.left}
                  y1={margin.top + plotH}
                  x2={margin.left + plotW}
                  y2={margin.top + plotH}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />
                <line
                  x1={margin.left}
                  y1={margin.top}
                  x2={margin.left}
                  y2={margin.top + plotH}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />

                {/* Histogram bars */}
                {histogramData.bins.map((bin, i) => {
                  const barH =
                    (bin.count / histogramData.maxCount) * plotH;
                  const barW = plotW / histogramData.bins.length;
                  const x = margin.left + i * barW;
                  const y = margin.top + plotH - barH;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width={barW - 1}
                      height={barH}
                      fill="#3b82f6"
                      opacity={0.7}
                    />
                  );
                })}

                {/* Mean line */}
                {(() => {
                  const minVal = mu - 4 * standardError;
                  const maxVal = mu + 4 * standardError;
                  const range = maxVal - minVal;
                  const meanX =
                    margin.left + ((simMean - minVal) / range) * plotW;
                  return (
                    <>
                      <line
                        x1={meanX}
                        y1={margin.top}
                        x2={meanX}
                        y2={margin.top + plotH}
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="5,5"
                      />
                      <text
                        x={meanX}
                        y={margin.top - 5}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#ef4444"
                        fontWeight="bold"
                      >
                        mean={simMean.toFixed(1)}
                      </text>
                    </>
                  );
                })()}

                {/* Theoretical mu line */}
                {(() => {
                  const minVal = mu - 4 * standardError;
                  const maxVal = mu + 4 * standardError;
                  const range = maxVal - minVal;
                  const muX =
                    margin.left + ((mu - minVal) / range) * plotW;
                  return (
                    <line
                      x1={muX}
                      y1={margin.top}
                      x2={muX}
                      y2={margin.top + plotH}
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  );
                })()}

                {/* X-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                  const minVal = mu - 4 * standardError;
                  const maxVal = mu + 4 * standardError;
                  const val = minVal + frac * (maxVal - minVal);
                  return (
                    <text
                      key={frac}
                      x={margin.left + frac * plotW}
                      y={margin.top + plotH + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#64748b"
                    >
                      {val.toFixed(1)}
                    </text>
                  );
                })}

                {/* Y-axis label */}
                <text
                  x={margin.left - 8}
                  y={margin.top + plotH / 2}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                  transform={`rotate(-90, ${margin.left - 8}, ${margin.top + plotH / 2})`}
                >
                  度数
                </text>
              </svg>
            )}

            {sampleMeans.length > 0 && (
              <div className="flex justify-center gap-6 mt-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-0.5 bg-green-500" /> 母平均{" "}
                  <K tex="\mu" />
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-0.5 bg-red-500 border-dashed" />{" "}
                  シミュレーション平均
                </span>
              </div>
            )}
          </div>

          {/* Central Limit Theorem note */}
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mt-4 w-full">
            <h4 className="font-bold text-purple-800 text-sm mb-2">
              中心極限定理 (Central Limit Theorem)
            </h4>
            <p className="text-xs text-purple-900 leading-relaxed">
              母集団の分布に関わらず、標本サイズ <K tex="n" /> が十分大きければ、
              標本平均 <K tex="\bar{X}" /> の分布は正規分布{" "}
              <K tex={`N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)`} />{" "}
              に近づきます。スライダーで <K tex="n" />{" "}
              を大きくすると、ヒストグラムがより正規分布に近づくことを確認しましょう。
            </p>
          </div>
        </div>
      </div>

      <HintButton
        hints={[
          {
            step: 1,
            text: "標本平均の期待値は母平均に等しい: E(X̄) = μ。これは不偏性と呼ばれます。",
          },
          {
            step: 2,
            text: "標本平均の分散は V(X̄) = σ²/n で、標本サイズ n が大きいほど小さくなります。",
          },
          {
            step: 3,
            text: "標準誤差 SE = σ/√n は、標本平均のばらつきの大きさを表します。",
          },
          {
            step: 4,
            text: "中心極限定理: n が十分大きければ、母集団の分布形状によらず X̄ は近似的に正規分布に従います。",
          },
        ]}
      />
    </div>
  );
}
