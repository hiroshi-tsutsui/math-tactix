"use client";

import React, { useState, useEffect, useRef } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from '../../components/HintButton';

export default function AbsoluteQuadraticViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const discriminant = b * b - 4 * a * c;
  const roots: number[] = [];
  if (a !== 0 && discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b - sqrtD) / (2 * a);
    const r2 = (-b + sqrtD) / (2 * a);
    if (discriminant === 0) {
      roots.push(r1);
    } else {
      roots.push(r1, r2);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2 + 30;
    const scale = 30;

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(w, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, h);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px sans-serif";
    ctx.fillText("x", w - 16, originY - 6);
    ctx.fillText("y", originX + 6, 14);

    // Helper: evaluate f(x) = ax^2 + bx + c
    const f = (x: number) => a * x * x + b * x + c;

    // Draw original parabola (dashed)
    ctx.beginPath();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    let first = true;
    for (let px = 0; px <= w; px++) {
      const x = (px - originX) / scale;
      const y = f(x);
      const py = originY - y * scale;
      if (py < -200 || py > h + 200) {
        first = true;
        continue;
      }
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw |f(x)| (solid, blue)
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    first = true;
    for (let px = 0; px <= w; px++) {
      const x = (px - originX) / scale;
      const y = Math.abs(f(x));
      const py = originY - y * scale;
      if (py < -200 || py > h + 200) {
        first = true;
        continue;
      }
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Mark x-intercepts of original (where f(x) = 0)
    for (const r of roots) {
      const px = originX + r * scale;
      const py = originY;
      if (px >= 0 && px <= w) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(`x=${r.toFixed(2)}`, px - 20, py + 18);
      }
    }

    // Mark vertex of original
    if (a !== 0) {
      const vx = -b / (2 * a);
      const vy = f(vx);
      const pvx = originX + vx * scale;
      const pvy = originY - vy * scale;
      if (pvx >= 0 && pvx <= w && pvy >= 0 && pvy <= h) {
        ctx.fillStyle = "#94a3b8";
        ctx.beginPath();
        ctx.arc(pvx, pvy, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Mark vertex of |f(x)| (reflected if vy < 0)
      const absVy = Math.abs(vy);
      const absVpy = originY - absVy * scale;
      if (pvx >= 0 && pvx <= w && absVpy >= 0 && absVpy <= h) {
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(pvx, absVpy, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Legend
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, h - 36);
    ctx.lineTo(44, h - 36);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.fillText("y = ax\u00B2+bx+c (元)", 48, h - 32);

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, h - 18);
    ctx.lineTo(44, h - 18);
    ctx.stroke();
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("y = |ax\u00B2+bx+c|", 48, h - 14);
  }, [a, b, c, roots]);

  const formatCoeff = (v: number, showSign: boolean) => {
    const abs = Math.abs(v);
    const sign = v < 0 ? "-" : showSign ? "+" : "";
    if (abs === 1) return sign;
    if (abs === 0) return "";
    return `${sign}${abs.toFixed(1).replace(/\.0$/, "")}`;
  };

  const texOriginal = `y = ${formatCoeff(a, false)}x^2 ${b >= 0 ? "+" : ""} ${b === 0 ? "" : `${b.toFixed(1).replace(/\.0$/, "")}x`} ${c >= 0 ? "+" : ""} ${c === 0 ? "" : c.toFixed(1).replace(/\.0$/, "")}`;
  const texAbsolute = `y = \\left| ${formatCoeff(a, false)}x^2 ${b >= 0 ? "+" : ""} ${b === 0 ? "" : `${b.toFixed(1).replace(/\.0$/, "")}x`} ${c >= 0 ? "+" : ""} ${c === 0 ? "" : c.toFixed(1).replace(/\.0$/, "")} \\right|`;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full">
        <h3 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2">
          絶対値を含む二次関数のグラフ
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          <MathDisplay tex="y = |ax^2 + bx + c|" /> のグラフは、
          元の放物線のx軸より下の部分をx軸に関して折り返したものです。
          スライダーで係数を変えて、グラフの変化を観察しましょう。
        </p>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center space-y-1">
          <div className="text-sm text-slate-500">元の関数（破線）</div>
          <MathDisplay tex={texOriginal} className="text-lg" />
          <div className="text-sm text-slate-500 mt-2">絶対値付き（実線）</div>
          <MathDisplay tex={texAbsolute} className="text-lg text-blue-700" />
        </div>

        <div className="relative border rounded bg-slate-50 overflow-hidden flex justify-center py-4">
          <canvas
            ref={canvasRef}
            width={480}
            height={360}
            className="bg-white border shadow-inner"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">
              a (開き具合と向き)
            </label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">
              {a.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">
              b (軸の移動)
            </label>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">
              {b.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">
              c (上下の移動)
            </label>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="accent-blue-500"
            />
            <div className="text-center font-mono mt-1 text-slate-700">
              {c.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-3 text-sm">ポイント解説</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">●</span>
              <span>
                <strong>赤い点</strong>は元の二次関数のx軸との交点（実数解）を示します。
                この点で絶対値グラフは「折れ」ます。
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">●</span>
              <span>
                元の放物線が <MathDisplay tex="y < 0" /> の部分は、
                x軸に関して折り返されて <MathDisplay tex="y > 0" /> 側に現れます。
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-slate-400 mr-2 mt-0.5">●</span>
              <span>
                判別式{" "}
                <MathDisplay
                  tex={`D = b^2 - 4ac = ${discriminant.toFixed(2)}`}
                />{" "}
                {discriminant < 0
                  ? "< 0 なので、元の放物線はx軸と交わらず、絶対値を取っても形は変わりません。"
                  : discriminant === 0
                  ? "= 0 なので、元の放物線はx軸に接します。"
                  : "> 0 なので、2箇所の交点で折り返しが起こります。"}
              </span>
            </li>
          </ul>
        </div>
        <HintButton hints={[
          { step: 1, text: 'y = |ax\u00B2 + bx + c| のグラフは、元の二次関数で y < 0 となる部分を x 軸に関して折り返したものです。' },
          { step: 2, text: '判別式 D > 0 のとき、放物線が x 軸と交わる2点で「折れ」が生じます。D \u2264 0 なら折り返しは起こりません。' },
          { step: 3, text: '絶対値を取ると、グラフは常に y \u2265 0 の領域に収まります。交点付近では微分不可能（角ができる）になります。' },
        ]} />
      </div>
    </div>
  );
}
