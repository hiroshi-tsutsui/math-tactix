"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

type Mode = "elevation" | "depression";

export default function TrigApplicationViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 420, height: 320 });
  const [mode, setMode] = useState<Mode>("elevation");
  const [distance, setDistance] = useState(50);
  const [angleDeg, setAngleDeg] = useState(35);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.min(entry.contentRect.width - 32, 600);
        if (w > 0) {
          setCanvasSize({ width: Math.round(w), height: Math.round(w * 0.76) });
        }
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const angleRad = toRad(angleDeg);
  const tanVal = Math.tan(angleRad);
  const height = distance * tanVal;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (mode === "elevation") {
      drawElevation(ctx, W, H);
    } else {
      drawDepression(ctx, W, H);
    }
  }, [mode, distance, angleDeg, height]);

  const drawElevation = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const groundY = H - 60;
    const maxDim = Math.max(distance, height);
    const scale = Math.min((W - 120) / (distance + 20), (H - 120) / (Math.max(height, 30) + 20));
    const clampedScale = Math.min(scale, 6);

    // Observer position
    const obsX = 60;
    const obsY = groundY;

    // Building base & top
    const buildBaseX = obsX + distance * clampedScale;
    const buildBaseY = groundY;
    const buildTopX = buildBaseX;
    const buildTopY = groundY - height * clampedScale;

    // Ground line
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(W - 20, groundY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Building (rectangle)
    const buildWidth = 30;
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fillRect(buildBaseX - buildWidth / 2, buildTopY, buildWidth, height * clampedScale);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(buildBaseX - buildWidth / 2, buildTopY, buildWidth, height * clampedScale);

    // Distance line
    ctx.beginPath();
    ctx.moveTo(obsX, groundY + 15);
    ctx.lineTo(buildBaseX, groundY + 15);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();
    // arrows
    ctx.beginPath();
    ctx.moveTo(obsX, groundY + 10);
    ctx.lineTo(obsX, groundY + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(buildBaseX, groundY + 10);
    ctx.lineTo(buildBaseX, groundY + 20);
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`d = ${distance}m`, (obsX + buildBaseX) / 2, groundY + 32);

    // Height line
    ctx.beginPath();
    ctx.moveTo(buildBaseX + buildWidth / 2 + 10, buildBaseY);
    ctx.lineTo(buildBaseX + buildWidth / 2 + 10, buildTopY);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(buildBaseX + buildWidth / 2 + 5, buildBaseY);
    ctx.lineTo(buildBaseX + buildWidth / 2 + 15, buildBaseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(buildBaseX + buildWidth / 2 + 5, buildTopY);
    ctx.lineTo(buildBaseX + buildWidth / 2 + 15, buildTopY);
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`h = ${height.toFixed(1)}m`, buildBaseX + buildWidth / 2 + 18, (buildBaseY + buildTopY) / 2);

    // Sight line (observer to building top)
    ctx.beginPath();
    ctx.moveTo(obsX, obsY);
    ctx.lineTo(buildTopX, buildTopY);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle arc (elevation angle from horizontal)
    ctx.beginPath();
    const arcR = 40;
    ctx.arc(obsX, obsY, arcR, -toRad(angleDeg), 0, false);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`θ = ${angleDeg}°`, obsX + arcR + 4, obsY - 10);

    // Observer icon (simple stick figure)
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(obsX, obsY - 18, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(obsX, obsY - 12);
    ctx.lineTo(obsX, obsY);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#334155";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("観測者", obsX, obsY - 28);
    ctx.fillText("建物", buildBaseX, buildTopY - 10);
    ctx.fillText("仰角", obsX + 20, obsY - 40);

    // Right angle mark at building base
    const markSize = 8;
    ctx.beginPath();
    ctx.moveTo(buildBaseX - markSize, groundY);
    ctx.lineTo(buildBaseX - markSize, groundY - markSize);
    ctx.lineTo(buildBaseX, groundY - markSize);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  const drawDepression = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const cliffTopY = 80;
    const maxDim = Math.max(distance, height);
    const scale = Math.min((W - 120) / (distance + 20), (H - 160) / (Math.max(height, 30) + 20));
    const clampedScale = Math.min(scale, 4);

    // Cliff observer position (top-left)
    const obsX = 60;
    const obsY = cliffTopY;

    // Sea level (bottom)
    const seaY = obsY + height * clampedScale;

    // Target position on sea
    const targetX = obsX + distance * clampedScale;
    const targetY = seaY;

    // Cliff face
    ctx.fillStyle = "rgba(120, 113, 108, 0.15)";
    ctx.fillRect(20, obsY, 40, seaY - obsY);
    ctx.strokeStyle = "#78716c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, obsY);
    ctx.lineTo(60, seaY);
    ctx.stroke();

    // Sea line
    ctx.beginPath();
    ctx.moveTo(55, seaY);
    ctx.lineTo(W - 20, seaY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Horizontal reference line from observer
    ctx.beginPath();
    ctx.moveTo(obsX, obsY);
    ctx.lineTo(targetX + 30, obsY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sight line (observer to target)
    ctx.beginPath();
    ctx.moveTo(obsX, obsY);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Depression angle arc (from horizontal down)
    ctx.beginPath();
    const arcR = 40;
    ctx.arc(obsX, obsY, arcR, 0, toRad(angleDeg), false);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`θ = ${angleDeg}°`, obsX + arcR + 4, obsY + 18);

    // Distance label (horizontal)
    ctx.beginPath();
    ctx.moveTo(obsX, seaY + 15);
    ctx.lineTo(targetX, seaY + 15);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`d = ${distance}m`, (obsX + targetX) / 2, seaY + 32);

    // Height label
    ctx.beginPath();
    ctx.moveTo(30, obsY);
    ctx.lineTo(30, seaY);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`h = ${height.toFixed(1)}m`, 26, (obsY + seaY) / 2);

    // Target dot
    ctx.beginPath();
    ctx.arc(targetX, targetY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Observer dot
    ctx.beginPath();
    ctx.arc(obsX, obsY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#334155";
    ctx.fill();

    // Labels
    ctx.fillStyle = "#334155";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("観測者（崖の上）", obsX + 40, obsY - 12);
    ctx.fillText("俯角", obsX + 24, obsY + 34);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("海面", targetX + 30, seaY - 8);

    // Right angle mark
    const markSize = 8;
    ctx.beginPath();
    ctx.moveTo(obsX + markSize, seaY);
    ctx.lineTo(obsX + markSize, seaY - markSize);
    ctx.lineTo(obsX, seaY - markSize);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("elevation")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
            mode === "elevation"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          仰角モード
        </button>
        <button
          onClick={() => setMode("depression")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
            mode === "depression"
              ? "bg-amber-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          俯角モード
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full"
          style={{ maxWidth: canvasSize.width }}
        />
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-emerald-600">
              観測距離 d = {distance} m
            </span>
          </div>
          <input type="range" min={10} max={100} step={1} value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>10m</span><span>100m</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-indigo-600">
              {mode === "elevation" ? "仰角" : "俯角"} θ = {angleDeg}°
            </span>
            <span className="text-slate-400 text-xs">
              {angleRad.toFixed(4)} rad
            </span>
          </div>
          <input type="range" min={5} max={80} step={1} value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full accent-indigo-500" />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>5°</span><span>80°</span>
          </div>
        </div>
      </div>

      {/* Calculation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">計算過程</h3>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-sm">
            {mode === "elevation" ? "仰角" : "俯角"}{" "}
            <K tex={`\\theta = ${angleDeg}^\\circ = ${angleRad.toFixed(4)} \\text{ rad}`} />
          </p>
          <p className="text-sm">
            <K tex={`\\tan \\theta = \\tan ${angleDeg}^\\circ = ${tanVal.toFixed(4)}`} />
          </p>
        </div>

        <div className={`rounded-xl p-4 ${
          mode === "elevation"
            ? "bg-blue-50 dark:bg-blue-950/30"
            : "bg-amber-50 dark:bg-amber-950/30"
        }`}>
          <p className="text-sm mb-2">
            <K tex={`h = d \\times \\tan \\theta`} />
          </p>
          <p className="text-sm mb-2">
            <K tex={`= ${distance} \\times \\tan ${angleDeg}^\\circ`} />
          </p>
          <p className="text-sm mb-2">
            <K tex={`= ${distance} \\times ${tanVal.toFixed(4)}`} />
          </p>
          <p className="text-xl font-bold text-center pt-1">
            <K tex={`h = ${height.toFixed(2)} \\text{ m}`} />
          </p>
        </div>
      </div>

      {/* Angle conversion table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">角度の表現</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">度数法</div>
            <div className="font-bold"><K tex={`${angleDeg}^\\circ`} /></div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">弧度法</div>
            <div className="font-bold"><K tex={`${angleRad.toFixed(4)} \\text{ rad}`} /></div>
          </div>
        </div>
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">
          {mode === "elevation" ? "仰角" : "俯角"}のポイント
        </h4>
        <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-2 list-disc list-inside">
          {mode === "elevation" ? (
            <>
              <li><strong>仰角</strong>とは水平線から上方を見上げる角度</li>
              <li>
                <K tex="h = d \tan \theta" /> で建物や塔の高さを求められる
              </li>
              <li>観測者の目の高さは今回は無視（地面からの角度で計算）</li>
              <li>角度が大きくなるほど tan の値は急激に増加する</li>
            </>
          ) : (
            <>
              <li><strong>俯角</strong>とは水平線から下方を見下ろす角度</li>
              <li>
                俯角と仰角は錯角の関係で等しい（平行線と直線の性質）
              </li>
              <li>
                <K tex="h = d \tan \theta" /> で崖の高さや距離を求められる
              </li>
              <li>測量・航海・建築など実用的な場面で多用される</li>
            </>
          )}
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: "仰角・俯角の問題では、直角三角形を描いて tanθ = 対辺/隣辺 を使います" },
        { step: 2, text: "高さ h = d × tanθ（d: 水平距離、θ: 仰角）で計算できます" },
        { step: 3, text: "俯角は水平線から下向きの角度で、仰角と錯角の関係にあります" },
      ]} />
    </div>
  );
}
