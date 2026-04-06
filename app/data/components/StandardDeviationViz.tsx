"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import katex from "katex";

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
  return <div ref={ref} />;
};

interface Stats {
  data: number[];
  mean: number;
  deviations: number[];
  squaredDeviations: number[];
  variance: number;
  stdDev: number;
}

function computeStats(data: number[]): Stats | null {
  if (data.length === 0) return null;
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const deviations = data.map((v) => v - mean);
  const squaredDeviations = deviations.map((d) => d * d);
  const variance = squaredDeviations.reduce((s, v) => s + v, 0) / n;
  const stdDev = Math.sqrt(variance);
  return { data, mean, deviations, squaredDeviations, variance, stdDev };
}

const DEFAULT_DATA = "4, 7, 2, 9, 5, 8, 3, 6";
const COMPARE_SPREAD_HIGH = "1, 3, 5, 7, 9, 11, 13, 15";
const COMPARE_SPREAD_LOW = "7, 8, 7, 9, 8, 8, 7, 8";

type Mode = "single" | "compare";

export default function StandardDeviationViz({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("single");
  const [inputText, setInputText] = useState(DEFAULT_DATA);
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const parseData = useCallback((text: string): number[] => {
    return text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
  }, []);

  const data = useMemo(() => parseData(inputText), [inputText, parseData]);
  const stats = useMemo(() => computeStats(data), [data]);
  const statsHigh = useMemo(() => computeStats(parseData(COMPARE_SPREAD_HIGH)), [parseData]);
  const statsLow = useMemo(() => computeStats(parseData(COMPARE_SPREAD_LOW)), [parseData]);

  useEffect(() => {
    if (hasInteracted && stats && onComplete) {
      onComplete();
    }
  }, [hasInteracted, stats, onComplete]);

  const maxStep = 4;

  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

  const renderDeviationChart = (s: Stats, label: string, color: string) => {
    const W = 360;
    const H = 160;
    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const n = s.data.length;
    const barW = Math.min(30, plotW / n - 4);
    const maxDev = Math.max(...s.deviations.map(Math.abs), 1);
    const midY = padT + plotH / 2;

    return (
      <div className="text-center">
        {label && <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
          {/* Zero line */}
          <line x1={padL} y1={midY} x2={W - padR} y2={midY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,2" />
          <text x={padL - 4} y={midY + 4} textAnchor="end" fontSize={9} fill="#94a3b8">0</text>

          {/* Bars */}
          {s.deviations.map((d, i) => {
            const x = padL + (i / n) * plotW + (plotW / n - barW) / 2;
            const h = (Math.abs(d) / maxDev) * (plotH / 2);
            const y = d >= 0 ? midY - h : midY;
            const fill = d >= 0 ? "#3b82f6" : "#ef4444";
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={h} fill={fill} rx={2} opacity={0.8} />
                <text x={x + barW / 2} y={d >= 0 ? y - 3 : y + h + 10} textAnchor="middle" fontSize={8} fill={fill} fontWeight="bold">
                  {d >= 0 ? "+" : ""}{fmt(d)}
                </text>
                <text x={x + barW / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="#64748b">
                  {s.data[i]}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-[10px] text-slate-400 mt-1">
          青: 平均より大きい / 赤: 平均より小さい
        </p>
      </div>
    );
  };

  const renderSingleMode = () => {
    if (!stats) return null;
    return (
      <div className="space-y-4">
        {/* Step 0: Data & Mean */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-2">Step 1: データと平均</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {stats.data.map((v, i) => (
              <span key={i} className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-mono font-bold text-slate-700">
                {v}
              </span>
            ))}
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            <div className="text-[10px] text-blue-400 font-bold mb-1">平均</div>
            <div className="text-lg font-bold text-blue-600">
              <K tex={`\\bar{x} = \\frac{${stats.data.join("+")}}{${stats.data.length}} = ${fmt(stats.mean)}`} />
            </div>
          </div>
        </div>

        {/* Step 1: Deviations */}
        {step >= 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-2">Step 2: 偏差（各データ - 平均）</h3>
            <p className="text-xs text-slate-500 mb-3">
              各データが平均からどれだけ離れているかを示します。
            </p>
            {renderDeviationChart(stats, "", "#3b82f6")}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1 text-slate-400">データ</th>
                    <th className="text-right py-1 text-slate-400">偏差</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.data.map((v, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1 font-mono">{v}</td>
                      <td className={`py-1 text-right font-mono font-bold ${stats.deviations[i] >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        {v} - {fmt(stats.mean)} = {fmt(stats.deviations[i])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 2: Squared Deviations */}
        {step >= 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-2">Step 3: 偏差の2乗</h3>
            <p className="text-xs text-slate-500 mb-3">
              偏差の正負を解消するため2乗します。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stats.deviations.map((d, i) => (
                <div key={i} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400">
                    <K tex={`(${fmt(d)})^2`} />
                  </div>
                  <div className="text-sm font-bold text-purple-600">{fmt(stats.squaredDeviations[i])}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Variance */}
        {step >= 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-2">Step 4: 分散</h3>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
              <div className="text-[10px] text-purple-400 font-bold mb-2">分散 = 偏差の2乗の平均</div>
              <KBlock tex={`s^2 = \\frac{${stats.squaredDeviations.map((v) => fmt(v)).join("+")}}{${stats.data.length}} = ${fmt(stats.variance)}`} />
            </div>
          </div>
        )}

        {/* Step 4: Standard Deviation */}
        {step >= 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-2">Step 5: 標準偏差</h3>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
              <div className="text-[10px] text-green-500 font-bold mb-2">標準偏差 = 分散の平方根</div>
              <KBlock tex={`s = \\sqrt{${fmt(stats.variance)}} = ${fmt(stats.stdDev)}`} />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              標準偏差は元のデータと同じ単位で「散らばり具合」を表します。値が大きいほどデータは広く散らばっています。
            </p>
          </div>
        )}

        {/* Step Navigation */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setStep(Math.max(0, step - 1)); setHasInteracted(true); }}
            disabled={step === 0}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
          >
            前のステップ
          </button>
          <span className="px-3 py-2 text-xs text-slate-400 font-bold">
            Step {step + 1} / {maxStep + 1}
          </span>
          <button
            onClick={() => { setStep(Math.min(maxStep, step + 1)); setHasInteracted(true); }}
            disabled={step === maxStep}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-blue-200 bg-blue-50 text-blue-600 disabled:opacity-40 hover:bg-blue-100"
          >
            次のステップ
          </button>
        </div>
      </div>
    );
  };

  const renderCompareMode = () => {
    if (!statsHigh || !statsLow) return null;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* High spread */}
          <div className="bg-white rounded-2xl border border-red-200 p-4">
            <h4 className="text-sm font-bold text-red-600 mb-1">散らばり大</h4>
            <p className="text-[10px] text-slate-400 mb-2">データ: {COMPARE_SPREAD_HIGH}</p>
            {renderDeviationChart(statsHigh, "", "#ef4444")}
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="bg-red-50 p-2 rounded-xl">
                <div className="text-[10px] text-red-400 font-bold">分散</div>
                <div className="text-sm font-bold text-red-600">{fmt(statsHigh.variance)}</div>
              </div>
              <div className="bg-red-50 p-2 rounded-xl">
                <div className="text-[10px] text-red-400 font-bold">標準偏差</div>
                <div className="text-sm font-bold text-red-600">{fmt(statsHigh.stdDev)}</div>
              </div>
            </div>
          </div>

          {/* Low spread */}
          <div className="bg-white rounded-2xl border border-blue-200 p-4">
            <h4 className="text-sm font-bold text-blue-600 mb-1">散らばり小</h4>
            <p className="text-[10px] text-slate-400 mb-2">データ: {COMPARE_SPREAD_LOW}</p>
            {renderDeviationChart(statsLow, "", "#3b82f6")}
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded-xl">
                <div className="text-[10px] text-blue-400 font-bold">分散</div>
                <div className="text-sm font-bold text-blue-600">{fmt(statsLow.variance)}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl">
                <div className="text-[10px] text-blue-400 font-bold">標準偏差</div>
                <div className="text-sm font-bold text-blue-600">{fmt(statsLow.stdDev)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
          <h4 className="text-sm font-bold text-slate-700 mb-2">比較</h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <div className="text-slate-400 font-bold mb-1">平均</div>
              <div className="text-red-600 font-bold">{fmt(statsHigh.mean)}</div>
              <div className="text-blue-600 font-bold">{fmt(statsLow.mean)}</div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <div className="text-slate-400 font-bold mb-1">分散</div>
              <div className="text-red-600 font-bold">{fmt(statsHigh.variance)}</div>
              <div className="text-blue-600 font-bold">{fmt(statsLow.variance)}</div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <div className="text-slate-400 font-bold mb-1">標準偏差</div>
              <div className="text-red-600 font-bold">{fmt(statsHigh.stdDev)}</div>
              <div className="text-blue-600 font-bold">{fmt(statsLow.stdDev)}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            散らばりが大きいデータは分散・標準偏差が大きく、散らばりが小さいデータは分散・標準偏差が小さくなります。
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">標準偏差と分散</h2>
        <p className="text-sm text-slate-500">
          データの散らばりを数値で表す
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setMode("single"); setHasInteracted(true); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg border ${mode === "single" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          ステップ解説
        </button>
        <button
          onClick={() => { setMode("compare"); setHasInteracted(true); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg border ${mode === "compare" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          比較モード
        </button>
      </div>

      {/* Data Input (single mode only) */}
      {mode === "single" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-2">データ入力</h3>
          <p className="text-xs text-slate-500 mb-2">
            カンマまたはスペース区切りで数値を入力してください
          </p>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setStep(0);
              setHasInteracted(true);
            }}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono resize-none"
            placeholder="例: 4, 7, 2, 9, 5, 8, 3, 6"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-400">
              データ数: {data.length}
              {data.length === 0 && " (1個以上必要)"}
            </span>
            <button
              onClick={() => {
                setInputText(DEFAULT_DATA);
                setStep(0);
                setHasInteracted(true);
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              デフォルトに戻す
            </button>
          </div>
        </div>
      )}

      {mode === "single" ? renderSingleMode() : renderCompareMode()}

      {/* Formulas */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          公式まとめ
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-slate-400 text-xs mb-1">平均</div>
            <KBlock tex="\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i" />
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">偏差</div>
            <KBlock tex="d_i = x_i - \bar{x}" />
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">分散</div>
            <KBlock tex="s^2 = \frac{1}{n}\sum_{i=1}^{n} (x_i - \bar{x})^2" />
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">標準偏差</div>
            <KBlock tex="s = \sqrt{s^2} = \sqrt{\frac{1}{n}\sum_{i=1}^{n} (x_i - \bar{x})^2}" />
          </div>
        </div>
      </div>
    </div>
  );
}
