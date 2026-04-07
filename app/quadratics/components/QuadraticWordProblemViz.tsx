"use client";

import React, { useState, useEffect, useRef } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from "../../components/HintButton";

type Scenario = "area" | "profit";

export default function QuadraticWordProblemViz() {
  const [scenario, setScenario] = useState<Scenario>("area");
  const [xValue, setXValue] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scenario configs
  const configs = {
    area: {
      title: "面積の最大化",
      description:
        "周の長さが20 mのロープで長方形を作ります。縦をx m、横を(10 - x) mとするとき、面積S = x(10 - x) の最大値を求めましょう。",
      f: (x: number) => x * (10 - x),
      texF: "S = x(10 - x) = -x^2 + 10x",
      xMin: 0,
      xMax: 10,
      xLabel: "縦 x (m)",
      yLabel: "面積 S (m^2)",
      vertexX: 5,
      vertexY: 25,
      unit: "m\u00B2",
      texVertex: "x = 5 \\text{ のとき } S_{\\max} = 25 \\text{ m}^2",
      currentLabel: (x: number, y: number) =>
        `縦 ${x.toFixed(1)} m, 横 ${(10 - x).toFixed(1)} m, 面積 ${y.toFixed(1)} m\u00B2`,
    },
    profit: {
      title: "利益の最大化",
      description:
        "1個100円の商品を1日100個売れます。1円値上げするごとに販売数は1個減ります。単価をx円上げたとき、利益 P = (100 + x)(100 - x) の最大値を求めましょう。",
      f: (x: number) => (100 + x) * (100 - x),
      texF: "P = (100 + x)(100 - x) = -x^2 + 10000",
      xMin: -20,
      xMax: 100,
      xLabel: "値上げ額 x (円)",
      yLabel: "利益 P (円)",
      vertexX: 0,
      vertexY: 10000,
      unit: "円",
      texVertex: "x = 0 \\text{ のとき } P_{\\max} = 10000 \\text{ 円}",
      currentLabel: (x: number, y: number) =>
        `値上げ ${x.toFixed(0)}円, 単価 ${(100 + x).toFixed(0)}円, 販売数 ${(100 - x).toFixed(0)}個, 利益 ${y.toFixed(0)}円`,
    },
  };

  const cfg = configs[scenario];

  // Reset slider when switching
  useEffect(() => {
    setXValue(cfg.vertexX);
  }, [scenario]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentY = cfg.f(xValue);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { left: 50, right: 20, top: 20, bottom: 40 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const xRange = cfg.xMax - cfg.xMin;
    // Compute y range from function
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let px = 0; px <= 100; px++) {
      const x = cfg.xMin + (xRange * px) / 100;
      const y = cfg.f(x);
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    // Add padding to y range
    const yPad = (yMax - yMin) * 0.1 || 1;
    yMin -= yPad;
    yMax += yPad;
    const yRange = yMax - yMin;

    const toScreenX = (x: number) =>
      padding.left + ((x - cfg.xMin) / xRange) * plotW;
    const toScreenY = (y: number) =>
      padding.top + plotH - ((y - yMin) / yRange) * plotH;

    // Background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(padding.left, padding.top, plotW, plotH);

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const xStep = xRange <= 20 ? 1 : xRange <= 50 ? 5 : 10;
    for (let x = Math.ceil(cfg.xMin / xStep) * xStep; x <= cfg.xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, padding.top);
      ctx.lineTo(sx, padding.top + plotH);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(x.toString(), sx, padding.top + plotH + 14);
    }

    // Axes
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 1.5;
    // x-axis at y=0 if visible
    const y0screen = toScreenY(0);
    if (y0screen >= padding.top && y0screen <= padding.top + plotH) {
      ctx.beginPath();
      ctx.moveTo(padding.left, y0screen);
      ctx.lineTo(padding.left + plotW, y0screen);
      ctx.stroke();
    }
    // left axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + plotH);
    ctx.stroke();

    // Fill area under curve (up to current x)
    ctx.beginPath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    const startPx = toScreenX(cfg.xMin);
    const endPx = toScreenX(xValue);
    ctx.moveTo(startPx, toScreenY(0));
    for (let px = startPx; px <= endPx; px++) {
      const x = cfg.xMin + ((px - padding.left) / plotW) * xRange;
      ctx.lineTo(px, toScreenY(cfg.f(x)));
    }
    ctx.lineTo(endPx, toScreenY(0));
    ctx.closePath();
    ctx.fill();

    // Draw the parabola
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    let first = true;
    for (let px = padding.left; px <= padding.left + plotW; px++) {
      const x = cfg.xMin + ((px - padding.left) / plotW) * xRange;
      const y = cfg.f(x);
      const sy = toScreenY(y);
      if (first) {
        ctx.moveTo(px, sy);
        first = false;
      } else {
        ctx.lineTo(px, sy);
      }
    }
    ctx.stroke();

    // Mark vertex (max)
    const vsx = toScreenX(cfg.vertexX);
    const vsy = toScreenY(cfg.vertexY);
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(vsx, vsy, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `最大値: ${cfg.vertexY}${scenario === "area" ? " m\u00B2" : " 円"}`,
      vsx,
      vsy - 14
    );

    // Mark current point
    const csx = toScreenX(xValue);
    const csy = toScreenY(currentY);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(csx, csy, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Dashed line from current point to axes
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(csx, csy);
    ctx.lineTo(csx, toScreenY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(csx, csy);
    ctx.lineTo(padding.left, csy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Y-axis label for current
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(currentY.toFixed(1), padding.left - 4, csy + 4);
  }, [xValue, scenario, cfg, currentY]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full">
        <h3 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2">
          二次不等式の文章題（最大化問題）
        </h3>

        {/* Scenario selector */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setScenario("area")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              scenario === "area"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            面積の最大化
          </button>
          <button
            onClick={() => setScenario("profit")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              scenario === "profit"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            利益の最大化
          </button>
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          {cfg.description}
        </p>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <MathDisplay tex={cfg.texF} displayMode />
        </div>

        <div className="relative border rounded bg-slate-50 overflow-hidden flex justify-center py-4">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            className="bg-white border shadow-inner"
          />
        </div>

        {/* Slider */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            {cfg.xLabel}
          </label>
          <input
            type="range"
            min={cfg.xMin}
            max={cfg.xMax}
            step={scenario === "area" ? 0.1 : 1}
            value={xValue}
            onChange={(e) => setXValue(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="text-center font-mono text-sm text-slate-700 mt-1">
            {cfg.currentLabel(xValue, currentY)}
          </div>
        </div>

        {/* Result comparison */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <div className="text-xs text-red-500 font-semibold mb-1">
              現在の値
            </div>
            <div className="text-2xl font-bold text-red-700">
              {currentY.toFixed(scenario === "area" ? 1 : 0)}
            </div>
            <div className="text-xs text-red-400">{cfg.unit}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-xs text-green-500 font-semibold mb-1">
              最大値（頂点）
            </div>
            <div className="text-2xl font-bold text-green-700">
              {cfg.vertexY}
            </div>
            <div className="text-xs text-green-400">{cfg.unit}</div>
          </div>
        </div>

        {/* Hints */}
        <HintButton
          hints={
            scenario === "area"
              ? [
                  { step: 1, text: "周の長さが 20m のロープで長方形を作るので、(縦 + 横) × 2 = 20、つまり 縦 + 横 = 10 です。" },
                  { step: 2, text: "縦を x とすると横は 10 - x。面積 S = x(10 - x) = -x² + 10x です。" },
                  { step: 3, text: "S = -(x² - 10x) = -(x - 5)² + 25。頂点は x = 5 で、最大値 S = 25 m² です。" },
                ]
              : [
                  { step: 1, text: "単価 (100 + x) 円、販売数 (100 - x) 個。利益 P = (100 + x)(100 - x) です。" },
                  { step: 2, text: "P = 10000 - x² なので、x = 0 のとき P は最大です。" },
                  { step: 3, text: "つまり値上げしない（x = 0）のが最適。P の最大値は 10000 円です。" },
                ]
          }
        />

        {/* Explanation */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-3 text-sm">
            解法のポイント
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <strong>1. 関数の式を立てる:</strong> 条件から変数xの式で目的量を表します。
            </li>
            <li>
              <strong>2. 二次関数の最大値:</strong>{" "}
              <MathDisplay tex="y = a(x - p)^2 + q" /> の形にして頂点を求めます。
            </li>
            <li>
              <strong>3. 定義域の確認:</strong>{" "}
              文章題では変数xの範囲に制限があるため、頂点が定義域内にあるか確認します。
            </li>
          </ul>
          <div className="mt-3 p-3 bg-white rounded border border-slate-300 text-center">
            <MathDisplay tex={cfg.texVertex} displayMode />
          </div>
        </div>
      </div>
    </div>
  );
}
