"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

function computeStats(data: number[]): { mean: number; variance: number; sd: number } {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  return { mean, variance, sd };
}

export default function VarianceTransformViz({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shiftA, setShiftA] = useState(0);
  const [scaleK, setScaleK] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);

  const baseData = [3, 5, 6, 8, 10, 12, 14];
  const origStats = computeStats(baseData);

  // Transformed data: y_i = k * x_i + a
  const transformedData = baseData.map((x) => scaleK * x + shiftA);
  const transStats = computeStats(transformedData);

  // Theoretical values
  const theoMean = scaleK * origStats.mean + shiftA;
  const theoVariance = scaleK * scaleK * origStats.variance;
  const theoSd = Math.abs(scaleK) * origStats.sd;

  useEffect(() => {
    if (hasInteracted && (shiftA !== 0 || scaleK !== 1)) {
      onComplete();
    }
  }, [hasInteracted, shiftA, scaleK, onComplete]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padding = { left: 40, right: 20, top: 30, bottom: 30 };
    const plotW = W - padding.left - padding.right;

    // Determine x-axis range
    const allData = [...baseData, ...transformedData];
    const minVal = Math.min(...allData) - 2;
    const maxVal = Math.max(...allData) + 2;
    const range = maxVal - minVal || 1;

    const toX = (v: number) => padding.left + ((v - minVal) / range) * plotW;

    // Two rows: original on top, transformed on bottom
    const row1Y = H * 0.3;
    const row2Y = H * 0.7;

    // Labels
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("元データ", padding.left, row1Y - 24);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("変換後", padding.left, row2Y - 24);

    // X-axis lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, row1Y);
    ctx.lineTo(W - padding.right, row1Y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding.left, row2Y);
    ctx.lineTo(W - padding.right, row2Y);
    ctx.stroke();

    // Tick marks
    const step = range > 40 ? 10 : range > 20 ? 5 : range > 10 ? 2 : 1;
    const firstTick = Math.ceil(minVal / step) * step;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    for (let v = firstTick; v <= maxVal; v += step) {
      const x = toX(v);
      ctx.beginPath();
      ctx.moveTo(x, row1Y - 3);
      ctx.lineTo(x, row1Y + 3);
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();
      ctx.fillText(String(v), x, row1Y + 14);

      ctx.beginPath();
      ctx.moveTo(x, row2Y - 3);
      ctx.lineTo(x, row2Y + 3);
      ctx.stroke();
      ctx.fillText(String(v), x, row2Y + 14);
    }

    // Draw original data dots
    baseData.forEach((v) => {
      const x = toX(v);
      ctx.beginPath();
      ctx.arc(x, row1Y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.fillStyle = "#1e40af";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(v), x, row1Y - 14);
    });

    // Draw mean line for original
    const origMeanX = toX(origStats.mean);
    ctx.beginPath();
    ctx.moveTo(origMeanX, row1Y - 10);
    ctx.lineTo(origMeanX, row1Y + 10);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw transformed data dots with arrows
    transformedData.forEach((v, i) => {
      const x = toX(v);
      const origX = toX(baseData[i]);

      // Arrow from original to transformed
      ctx.beginPath();
      ctx.moveTo(origX, row1Y + 10);
      ctx.quadraticCurveTo(
        (origX + x) / 2, (row1Y + row2Y) / 2,
        x, row2Y - 10
      );
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dot
      ctx.beginPath();
      ctx.arc(x, row2Y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.fillStyle = "#991b1b";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(v.toFixed(1), x, row2Y - 14);
    });

    // Draw mean line for transformed
    const transMeanX = toX(transStats.mean);
    ctx.beginPath();
    ctx.moveTo(transMeanX, row2Y - 10);
    ctx.lineTo(transMeanX, row2Y + 10);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [baseData, transformedData, origStats.mean, transStats.mean, shiftA, scaleK]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      {/* Canvas - dot plot */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={440}
          height={240}
          className="w-full max-w-[440px]"
        />
      </div>

      {/* Transformation formula */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <p className="text-sm mb-2 text-slate-500">変換式</p>
        <div className="text-lg">
          <K tex={`y_i = ${scaleK === 1 ? "" : scaleK < 0 ? `(${scaleK})` : String(scaleK)} ${scaleK === 1 ? "" : "\\cdot"} x_i ${shiftA >= 0 ? (shiftA === 0 ? "" : `+ ${shiftA}`) : `- ${Math.abs(shiftA)}`}`} />
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-emerald-600">
              一様移動 a = {shiftA}
            </span>
            <span className="text-xs text-slate-400">
              <K tex="x_i \to x_i + a" />
            </span>
          </div>
          <input type="range" min={-10} max={10} step={1} value={shiftA}
            onChange={(e) => { setShiftA(Number(e.target.value)); setHasInteracted(true); }}
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>-10</span><span>0</span><span>+10</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-indigo-600">
              スケール k = {scaleK}
            </span>
            <span className="text-xs text-slate-400">
              <K tex="x_i \to k \cdot x_i" />
            </span>
          </div>
          <input type="range" min={-3} max={3} step={0.5} value={scaleK}
            onChange={(e) => { setScaleK(Number(e.target.value)); setHasInteracted(true); }}
            className="w-full accent-indigo-500" />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>-3</span><span>0</span><span>+3</span>
          </div>
        </div>
      </div>

      {/* Statistics comparison table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">統計量の比較</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-2 text-slate-500 font-medium">統計量</th>
                <th className="text-center py-2 px-2 text-blue-600 font-bold">元データ</th>
                <th className="text-center py-2 px-2 text-red-600 font-bold">変換後</th>
                <th className="text-center py-2 px-2 text-slate-500 font-medium">理論値</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 px-2 font-medium">
                  平均 <K tex="\bar{x}" />
                </td>
                <td className="text-center py-2 px-2 text-blue-600 font-mono">
                  {origStats.mean.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-red-600 font-mono">
                  {transStats.mean.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-slate-500 font-mono">
                  {theoMean.toFixed(2)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 px-2 font-medium">
                  分散 <K tex="s^2" />
                </td>
                <td className="text-center py-2 px-2 text-blue-600 font-mono">
                  {origStats.variance.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-red-600 font-mono">
                  {transStats.variance.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-slate-500 font-mono">
                  {theoVariance.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium">
                  標準偏差 <K tex="s" />
                </td>
                <td className="text-center py-2 px-2 text-blue-600 font-mono">
                  {origStats.sd.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-red-600 font-mono">
                  {transStats.sd.toFixed(2)}
                </td>
                <td className="text-center py-2 px-2 text-slate-500 font-mono">
                  {theoSd.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shift property */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-3">
            一様移動 <K tex="y_i = x_i + a" />
          </h4>
          <div className="space-y-2 text-sm text-emerald-600 dark:text-emerald-400">
            <p><K tex="\bar{y} = \bar{x} + a" /></p>
            <p><K tex="s_y^2 = s_x^2" /> (変化なし)</p>
            <p><K tex="s_y = s_x" /> (変化なし)</p>
          </div>
          <p className="text-xs text-emerald-500 mt-2">
            全データを同じだけ移動しても、ばらつきは変わらない
          </p>
        </div>

        {/* Scale property */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-3">
            スケール変換 <K tex="y_i = k \cdot x_i" />
          </h4>
          <div className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400">
            <p><K tex="\bar{y} = k \cdot \bar{x}" /></p>
            <p><K tex="s_y^2 = k^2 \cdot s_x^2" /></p>
            <p><K tex="s_y = |k| \cdot s_x" /></p>
          </div>
          <p className="text-xs text-indigo-500 mt-2">
            分散はk²倍、標準偏差は|k|倍になる
          </p>
        </div>
      </div>

      {/* Combined formula */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">
          一般の変換 <K tex="y_i = k \cdot x_i + a" />
        </h4>
        <div className="space-y-2 text-sm text-center">
          <p><K tex="\bar{y} = k \cdot \bar{x} + a" /></p>
          <p><K tex="s_y^2 = k^2 \cdot s_x^2" /></p>
          <p><K tex="s_y = |k| \cdot s_x" /></p>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          定数の加算は平均のみに影響し、分散・標準偏差には影響しない
        </p>
      </div>

      {/* Original data display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">元データ</h3>
        <div className="flex flex-wrap gap-2">
          {baseData.map((v, i) => (
            <span key={i} className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg font-mono text-sm font-bold">
              {v}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-slate-400">変換後:</span>
          {transformedData.map((v, i) => (
            <span key={i} className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg font-mono text-sm font-bold">
              {v.toFixed(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
