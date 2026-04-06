"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

function getMedian(arr: number[]): number {
  const n = arr.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

interface QuartileStats {
  sorted: number[];
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outliers: number[];
  inliers: number[];
}

function computeQuartiles(data: number[]): QuartileStats | null {
  if (data.length < 4) return null;

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const median = getMedian(sorted);

  // Split into lower and upper halves (exclude median for odd n)
  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = sorted.slice(Math.ceil(n / 2));

  const q1 = getMedian(lowerHalf);
  const q3 = getMedian(upperHalf);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);
  const inliers = sorted.filter((v) => v >= lowerFence && v <= upperFence);

  return {
    sorted,
    min: sorted[0],
    q1,
    median,
    q3,
    max: sorted[n - 1],
    iqr,
    lowerFence,
    upperFence,
    outliers,
    inliers,
  };
}

const DEFAULT_DATA = "3, 7, 8, 5, 12, 14, 21, 13, 18, 6, 9, 11, 15, 2, 40";

export default function QuartileAnalysisViz({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [inputText, setInputText] = useState(DEFAULT_DATA);
  const [data, setData] = useState<number[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Parse input
  const parseInput = useCallback((text: string) => {
    const nums = text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
    setData(nums);
  }, []);

  useEffect(() => {
    parseInput(inputText);
  }, [inputText, parseInput]);

  const stats = useMemo(() => computeQuartiles(data), [data]);

  // Trigger completion once user interacts
  useEffect(() => {
    if (hasInteracted && stats && onComplete) {
      onComplete();
    }
  }, [hasInteracted, stats, onComplete]);

  // SVG box plot
  const renderBoxPlot = () => {
    if (!stats) return null;

    const W = 400;
    const H = 160;
    const padL = 50;
    const padR = 50;
    const plotW = W - padL - padR;
    const midY = H / 2;
    const boxH = 50;

    // Data range for scaling - include outliers
    const dataMin = stats.min;
    const dataMax = stats.max;
    const range = dataMax - dataMin || 1;
    const margin = range * 0.1;
    const scaleMin = dataMin - margin;
    const scaleMax = dataMax + margin;
    const scaleRange = scaleMax - scaleMin;

    const toX = (v: number) => padL + ((v - scaleMin) / scaleRange) * plotW;

    const whiskerMin = stats.inliers.length > 0 ? stats.inliers[0] : stats.q1;
    const whiskerMax = stats.inliers.length > 0 ? stats.inliers[stats.inliers.length - 1] : stats.q3;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {/* Axis */}
        <line
          x1={padL}
          y1={H - 20}
          x2={W - padR}
          y2={H - 20}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
        {/* Tick marks */}
        {[stats.min, stats.q1, stats.median, stats.q3, stats.max].map(
          (v, i) => (
            <g key={i}>
              <line
                x1={toX(v)}
                y1={H - 25}
                x2={toX(v)}
                y2={H - 15}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <text
                x={toX(v)}
                y={H - 5}
                textAnchor="middle"
                fontSize={9}
                fill="#64748b"
              >
                {v % 1 === 0 ? v : v.toFixed(1)}
              </text>
            </g>
          )
        )}

        {/* Left whisker */}
        <line
          x1={toX(whiskerMin)}
          y1={midY}
          x2={toX(stats.q1)}
          y2={midY}
          stroke="#334155"
          strokeWidth={2}
        />
        {/* Left whisker cap */}
        <line
          x1={toX(whiskerMin)}
          y1={midY - boxH / 4}
          x2={toX(whiskerMin)}
          y2={midY + boxH / 4}
          stroke="#334155"
          strokeWidth={2}
        />

        {/* Right whisker */}
        <line
          x1={toX(stats.q3)}
          y1={midY}
          x2={toX(whiskerMax)}
          y2={midY}
          stroke="#334155"
          strokeWidth={2}
        />
        {/* Right whisker cap */}
        <line
          x1={toX(whiskerMax)}
          y1={midY - boxH / 4}
          x2={toX(whiskerMax)}
          y2={midY + boxH / 4}
          stroke="#334155"
          strokeWidth={2}
        />

        {/* Box */}
        <rect
          x={toX(stats.q1)}
          y={midY - boxH / 2}
          width={toX(stats.q3) - toX(stats.q1)}
          height={boxH}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth={2}
          rx={4}
        />

        {/* Median line */}
        <line
          x1={toX(stats.median)}
          y1={midY - boxH / 2}
          x2={toX(stats.median)}
          y2={midY + boxH / 2}
          stroke="#ef4444"
          strokeWidth={2.5}
        />

        {/* Labels above */}
        <text x={toX(whiskerMin)} y={midY - boxH / 2 - 20} textAnchor="middle" fontSize={9} fill="#64748b">
          最小*
        </text>
        <text x={toX(stats.q1)} y={midY - boxH / 2 - 8} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="bold">
          Q1={stats.q1 % 1 === 0 ? stats.q1 : stats.q1.toFixed(1)}
        </text>
        <text x={toX(stats.median)} y={midY - boxH / 2 - 20} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight="bold">
          中央値={stats.median % 1 === 0 ? stats.median : stats.median.toFixed(1)}
        </text>
        <text x={toX(stats.q3)} y={midY - boxH / 2 - 8} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="bold">
          Q3={stats.q3 % 1 === 0 ? stats.q3 : stats.q3.toFixed(1)}
        </text>
        <text x={toX(whiskerMax)} y={midY - boxH / 2 - 20} textAnchor="middle" fontSize={9} fill="#64748b">
          最大*
        </text>

        {/* Outliers */}
        {stats.outliers.map((v, i) => (
          <circle
            key={`outlier-${i}`}
            cx={toX(v)}
            cy={midY}
            r={5}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2}
          />
        ))}
        {stats.outliers.length > 0 && (
          <text x={W - padR + 5} y={midY + 4} fontSize={9} fill="#f59e0b" fontWeight="bold">
            外れ値
          </text>
        )}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">箱ひげ図と四分位数</h2>
        <p className="text-sm text-slate-500">
          データの分布を5つの要約統計量で可視化
        </p>
      </div>

      {/* Data Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-2">データ入力</h3>
        <p className="text-xs text-slate-500 mb-2">
          カンマまたはスペース区切りで数値を入力してください（4個以上）
        </p>
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setHasInteracted(true);
          }}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono resize-none"
          placeholder="例: 3, 7, 8, 5, 12, 14, 21"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-400">
            データ数: {data.length}
            {data.length < 4 && " (4個以上必要)"}
          </span>
          <button
            onClick={() => {
              setInputText(DEFAULT_DATA);
              setHasInteracted(true);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            デフォルトに戻す
          </button>
        </div>
      </div>

      {/* Box Plot */}
      {stats && (
        <>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
            {renderBoxPlot()}
            {stats.outliers.length > 0 && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                * ひげの端は外れ値を除いた範囲の最小・最大値です
              </p>
            )}
          </div>

          {/* Statistics Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-3">五数要約</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { label: "最小値", value: stats.min, color: "text-slate-600" },
                { label: "Q1", value: stats.q1, color: "text-blue-600" },
                {
                  label: "中央値(Q2)",
                  value: stats.median,
                  color: "text-red-600",
                },
                { label: "Q3", value: stats.q3, color: "text-blue-600" },
                { label: "最大値", value: stats.max, color: "text-slate-600" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-100"
                >
                  <div className="text-[10px] text-slate-400 font-bold mb-1">
                    {item.label}
                  </div>
                  <div className={`text-lg font-bold ${item.color}`}>
                    {item.value % 1 === 0
                      ? item.value
                      : item.value.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                <div className="text-[10px] text-purple-400 font-bold mb-1">
                  四分位範囲 (IQR)
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {stats.iqr % 1 === 0 ? stats.iqr : stats.iqr.toFixed(1)}
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                <div className="text-[10px] text-amber-400 font-bold mb-1">
                  外れ値の数
                </div>
                <div className="text-lg font-bold text-amber-600">
                  {stats.outliers.length}
                </div>
              </div>
            </div>
            {stats.outliers.length > 0 && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                外れ値: {stats.outliers.join(", ")} （{" "}
                <K tex={`v < ${stats.lowerFence.toFixed(1)}`} /> または{" "}
                <K tex={`v > ${stats.upperFence.toFixed(1)}`} /> ）
              </div>
            )}
          </div>

          {/* Formulas */}
          <div className="bg-slate-900 text-white rounded-2xl p-5">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
              四分位数の定義
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-400 text-xs mb-1">
                  第1四分位数 (Q1)
                </div>
                <p className="text-slate-300">
                  データを昇順に並べたとき、下位半分の中央値
                </p>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">
                  第2四分位数 (Q2) = 中央値
                </div>
                <p className="text-slate-300">
                  データ全体の中央値
                </p>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">
                  第3四分位数 (Q3)
                </div>
                <p className="text-slate-300">
                  データを昇順に並べたとき、上位半分の中央値
                </p>
              </div>
              <hr className="border-slate-700" />
              <div>
                <div className="text-slate-400 text-xs mb-1">
                  四分位範囲 (IQR)
                </div>
                <KBlock tex="IQR = Q_3 - Q_1" />
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">
                  外れ値の判定
                </div>
                <KBlock tex="v < Q_1 - 1.5 \times IQR \quad \text{or} \quad v > Q_3 + 1.5 \times IQR" />
              </div>
            </div>
          </div>
        </>
      )}

      {!stats && data.length > 0 && data.length < 4 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 text-center">
          <p className="text-sm text-amber-700">
            箱ひげ図を描画するには4個以上のデータが必要です。
          </p>
        </div>
      )}
    </div>
  );
}
