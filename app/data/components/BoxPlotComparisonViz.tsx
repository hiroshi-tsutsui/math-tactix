"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

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

interface DataSet {
  name: string;
  data: number[];
  color: string;
  bgColor: string;
}

interface FiveNumberSummary {
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

const PRESETS: { label: string; a: DataSet; b: DataSet }[] = [
  {
    label: "テスト点数（期末考査）",
    a: {
      name: "クラスA",
      data: [45, 52, 58, 60, 62, 65, 67, 70, 72, 75, 78, 80, 82, 85, 90],
      color: "#3b82f6",
      bgColor: "rgba(59,130,246,0.15)",
    },
    b: {
      name: "クラスB",
      data: [30, 40, 55, 58, 60, 62, 63, 64, 65, 68, 70, 85, 92, 95, 98],
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.15)",
    },
  },
  {
    label: "通学時間（分）",
    a: {
      name: "1年生",
      data: [5, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
      color: "#3b82f6",
      bgColor: "rgba(59,130,246,0.15)",
    },
    b: {
      name: "3年生",
      data: [8, 10, 15, 15, 20, 20, 22, 25, 25, 30, 55, 60],
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.15)",
    },
  },
  {
    label: "50m走タイム（秒）",
    a: {
      name: "男子",
      data: [6.8, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.5, 7.6, 7.8, 8.0, 8.2],
      color: "#3b82f6",
      bgColor: "rgba(59,130,246,0.15)",
    },
    b: {
      name: "女子",
      data: [7.5, 7.8, 8.0, 8.2, 8.3, 8.5, 8.6, 8.8, 9.0, 9.2, 9.5, 10.0],
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.15)",
    },
  },
];

function calcSummary(data: number[]): FiveNumberSummary {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;

  const getMedian = (arr: number[]): number => {
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };

  const median = getMedian(sorted);
  const lower = sorted.slice(0, Math.floor(n / 2));
  const upper = sorted.slice(Math.ceil(n / 2));
  const q1 = getMedian(lower);
  const q3 = getMedian(upper);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);
  const inliers = sorted.filter((v) => v >= lowerFence && v <= upperFence);

  return {
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

export default function BoxPlotComparisonViz({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [presetIndex, setPresetIndex] = useState(0);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preset = PRESETS[presetIndex];
  const summaryA = calcSummary(preset.a.data);
  const summaryB = calcSummary(preset.b.data);

  // Determine which is more stable (smaller IQR = more stable)
  const moreStable = summaryA.iqr < summaryB.iqr ? preset.a.name : summaryB.iqr < summaryA.iqr ? preset.b.name : "同じ";

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === moreStable && onComplete) {
      onComplete();
    }
  };

  // Canvas drawing
  const drawBoxPlot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Calculate global range
    const allValues = [...preset.a.data, ...preset.b.data];
    const globalMin = Math.floor(Math.min(...allValues) - 2);
    const globalMax = Math.ceil(Math.max(...allValues) + 2);
    const range = globalMax - globalMin;

    const padL = 60;
    const padR = 20;
    const plotW = w - padL - padR;

    const toX = (v: number) => padL + ((v - globalMin) / range) * plotW;

    // Draw axis
    const axisY = h - 40;
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, axisY);
    ctx.lineTo(w - padR, axisY);
    ctx.stroke();

    // Tick marks
    const step = range <= 20 ? 2 : range <= 50 ? 5 : 10;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    for (let v = Math.ceil(globalMin / step) * step; v <= globalMax; v += step) {
      const x = toX(v);
      ctx.beginPath();
      ctx.moveTo(x, axisY);
      ctx.lineTo(x, axisY + 6);
      ctx.stroke();
      ctx.fillText(v.toString(), x, axisY + 18);
    }

    // Draw one box plot
    const drawOne = (
      summary: FiveNumberSummary,
      color: string,
      bgColor: string,
      yCenter: number,
      boxH: number,
      label: string
    ) => {
      const whiskerMin = summary.inliers.length > 0 ? summary.inliers[0] : summary.min;
      const whiskerMax = summary.inliers.length > 0 ? summary.inliers[summary.inliers.length - 1] : summary.max;

      // Label
      ctx.fillStyle = "#475569";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, padL - 8, yCenter + 4);

      // Highlight hovered stat
      const highlight = (statName: string, x: number) => {
        if (hoveredStat === statName) {
          ctx.save();
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 2]);
          ctx.beginPath();
          ctx.moveTo(x, yCenter - boxH / 2 - 8);
          ctx.lineTo(x, yCenter + boxH / 2 + 8);
          ctx.stroke();
          ctx.restore();
        }
      };

      // Whisker lines
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Left whisker
      ctx.beginPath();
      ctx.moveTo(toX(whiskerMin), yCenter);
      ctx.lineTo(toX(summary.q1), yCenter);
      ctx.stroke();

      // Right whisker
      ctx.beginPath();
      ctx.moveTo(toX(summary.q3), yCenter);
      ctx.lineTo(toX(whiskerMax), yCenter);
      ctx.stroke();

      // Whisker caps
      ctx.beginPath();
      ctx.moveTo(toX(whiskerMin), yCenter - boxH / 3);
      ctx.lineTo(toX(whiskerMin), yCenter + boxH / 3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX(whiskerMax), yCenter - boxH / 3);
      ctx.lineTo(toX(whiskerMax), yCenter + boxH / 3);
      ctx.stroke();

      // Box
      const boxX = toX(summary.q1);
      const boxW = toX(summary.q3) - boxX;
      ctx.fillStyle = bgColor;
      ctx.fillRect(boxX, yCenter - boxH / 2, boxW, boxH);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, yCenter - boxH / 2, boxW, boxH);

      // Median line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toX(summary.median), yCenter - boxH / 2);
      ctx.lineTo(toX(summary.median), yCenter + boxH / 2);
      ctx.stroke();

      // Outliers
      summary.outliers.forEach((v) => {
        ctx.beginPath();
        ctx.arc(toX(v), yCenter, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Highlights
      highlight("min", toX(whiskerMin));
      highlight("q1", toX(summary.q1));
      highlight("median", toX(summary.median));
      highlight("q3", toX(summary.q3));
      highlight("max", toX(whiskerMax));
    };

    drawOne(summaryA, preset.a.color, preset.a.bgColor, 60, 40, preset.a.name);
    drawOne(summaryB, preset.b.color, preset.b.bgColor, 140, 40, preset.b.name);
  }, [presetIndex, hoveredStat, preset, summaryA, summaryB]);

  useEffect(() => {
    drawBoxPlot();
    const handleResize = () => drawBoxPlot();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawBoxPlot]);

  const renderStatRow = (
    label: string,
    statKey: string,
    valA: number,
    valB: number,
    isBold?: boolean
  ) => (
    <tr
      key={statKey}
      className={`cursor-pointer transition-colors ${
        hoveredStat === statKey ? "bg-red-50" : "hover:bg-slate-50"
      } ${isBold ? "font-bold" : ""}`}
      onMouseEnter={() => setHoveredStat(statKey)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <td className="py-1.5 px-2 text-xs text-slate-600">{label}</td>
      <td className="py-1.5 px-2 text-xs font-mono text-blue-600 text-right">
        {valA.toFixed(1)}
      </td>
      <td className="py-1.5 px-2 text-xs font-mono text-amber-600 text-right">
        {valB.toFixed(1)}
      </td>
    </tr>
  );

  return (
    <div className="w-full space-y-4 p-4">
      {/* Preset selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          データセット:
        </span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setPresetIndex(i);
              setAnswered(false);
              setSelectedAnswer(null);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              presetIndex === i
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 200 }}
        />
      </div>

      {/* Statistics table */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          五数要約 (ホバーで強調)
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-1 px-2 text-xs text-slate-400 text-left">統計量</th>
              <th className="py-1 px-2 text-xs text-blue-500 text-right">
                {preset.a.name}
              </th>
              <th className="py-1 px-2 text-xs text-amber-500 text-right">
                {preset.b.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {renderStatRow("最小値", "min", summaryA.min, summaryB.min)}
            {renderStatRow("Q1（第1四分位数）", "q1", summaryA.q1, summaryB.q1)}
            {renderStatRow("中央値（Q2）", "median", summaryA.median, summaryB.median)}
            {renderStatRow("Q3（第3四分位数）", "q3", summaryA.q3, summaryB.q3)}
            {renderStatRow("最大値", "max", summaryA.max, summaryB.max)}
            {renderStatRow(
              "四分位範囲（IQR）",
              "iqr",
              summaryA.iqr,
              summaryB.iqr,
              true
            )}
          </tbody>
        </table>
      </div>

      {/* Math formulas */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
        <KBlock tex={`Q_1 = \\text{下位半分の中央値}, \\quad Q_3 = \\text{上位半分の中央値}`} />
        <KBlock tex={`\\text{IQR}(\\text{四分位範囲}) = Q_3 - Q_1`} />
        <div className="text-xs text-blue-600 text-center mt-1">
          IQR が小さいほどデータの散らばりが小さく「安定」していると言えます
        </div>
      </div>

      {/* Quiz section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-sm">
          どちらのデータがより安定していますか？（IQR で判定）
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer(preset.a.name)}
            disabled={answered}
            className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
              answered && selectedAnswer === preset.a.name
                ? selectedAnswer === moreStable
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            } ${answered ? "cursor-default" : "cursor-pointer"}`}
          >
            {preset.a.name}
          </button>
          <button
            onClick={() => handleAnswer(preset.b.name)}
            disabled={answered}
            className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
              answered && selectedAnswer === preset.b.name
                ? selectedAnswer === moreStable
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
                : "border-amber-200 text-amber-600 hover:bg-amber-50"
            } ${answered ? "cursor-default" : "cursor-pointer"}`}
          >
            {preset.b.name}
          </button>
        </div>
        {answered && (
          <div
            className={`text-sm p-3 rounded-lg ${
              selectedAnswer === moreStable
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {selectedAnswer === moreStable ? (
              <p>
                正解! <strong>{moreStable}</strong> の IQR ={" "}
                {(moreStable === preset.a.name ? summaryA.iqr : summaryB.iqr).toFixed(1)}{" "}
                の方が小さいので、データが中央値の周りに集中しており安定しています。
              </p>
            ) : (
              <p>
                不正解。正解は <strong>{moreStable}</strong> です。
                {preset.a.name} の IQR = {summaryA.iqr.toFixed(1)}、
                {preset.b.name} の IQR = {summaryB.iqr.toFixed(1)} なので、
                IQR が小さい <strong>{moreStable}</strong> の方が安定しています。
              </p>
            )}
          </div>
        )}
      </div>

      {/* Outlier info */}
      {(summaryA.outliers.length > 0 || summaryB.outliers.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          <strong>外れ値:</strong>{" "}
          {summaryA.outliers.length > 0 && (
            <span>
              {preset.a.name}: [{summaryA.outliers.join(", ")}]
            </span>
          )}{" "}
          {summaryB.outliers.length > 0 && (
            <span>
              {preset.b.name}: [{summaryB.outliers.join(", ")}]
            </span>
          )}
          <span className="block mt-1">
            外れ値の判定基準: <K tex="Q_1 - 1.5 \times \text{IQR}" /> より小さい、または{" "}
            <K tex="Q_3 + 1.5 \times \text{IQR}" /> より大きい値
          </span>
        </div>
      )}
    </div>
  );
}
