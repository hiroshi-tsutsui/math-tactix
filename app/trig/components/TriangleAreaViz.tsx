"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

type DerivationStep = 0 | 1 | 2 | 3;

export default function TriangleAreaViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sideA, setSideA] = useState(12);
  const [sideB, setSideB] = useState(8);
  const [angleC, setAngleC] = useState(50);
  const [derivStep, setDerivStep] = useState<DerivationStep>(0);

  const sinC = Math.sin(toRad(angleC));
  const h = sideB * sinC;
  const area = 0.5 * sideA * sideB * sinC;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const maxSide = Math.max(sideA, sideB);
    const scale = Math.min(W, H) / (maxSide * 2.5 + 1);
    const padBottom = 60;
    const baseY = H - padBottom;

    // C at left, along base a to the right, B at angle
    const Cx = 60;
    const Cy = baseY;
    const Ax = Cx + sideA * scale;
    const Ay = baseY;

    // B is at distance b from C, at angle C above the base
    const Bx = Cx + sideB * scale * Math.cos(toRad(angleC));
    const By = Cy - sideB * scale * Math.sin(toRad(angleC));

    // Height foot (perpendicular from B to line CA = base a)
    const Hx = Bx;
    const Hy = baseY;

    // Fill triangle
    ctx.beginPath();
    ctx.moveTo(Cx, Cy);
    ctx.lineTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.06)";
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw side a (base: C to A)
    ctx.beginPath();
    ctx.moveTo(Cx, Cy);
    ctx.lineTo(Ax, Ay);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw side b (C to B)
    ctx.beginPath();
    ctx.moveTo(Cx, Cy);
    ctx.lineTo(Bx, By);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw side c (A to B) lighter
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw height h if derivation step >= 1
    if (derivStep >= 1) {
      ctx.beginPath();
      ctx.moveTo(Bx, By);
      ctx.lineTo(Hx, Hy);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right angle mark
      const markSize = 10;
      ctx.beginPath();
      ctx.moveTo(Hx - markSize, Hy);
      ctx.lineTo(Hx - markSize, Hy - markSize);
      ctx.lineTo(Hx, Hy - markSize);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label h
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`h`, Bx + 8, (By + Hy) / 2);
    }

    // Angle arc at C
    ctx.beginPath();
    const arcR = 25;
    ctx.arc(Cx, Cy, arcR, -toRad(angleC), 0, false);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`C=${angleC}°`, Cx + arcR + 4, Cy - 12);

    // Side labels
    // a label (midpoint of base)
    const aMx = (Cx + Ax) / 2;
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`a=${sideA}`, aMx, baseY + 20);

    // b label (midpoint of CB)
    const bMx = (Cx + Bx) / 2 - 14;
    const bMy = (Cy + By) / 2;
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`b=${sideB}`, bMx, bMy);

    // Vertex labels
    const verts: { x: number; y: number; label: string; dx: number; dy: number }[] = [
      { x: Cx, y: Cy, label: "C", dx: -16, dy: 16 },
      { x: Ax, y: Ay, label: "A", dx: 12, dy: 16 },
      { x: Bx, y: By, label: "B", dx: 0, dy: -14 },
    ];
    verts.forEach(({ x, y, label, dx, dy }) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#334155";
      ctx.fill();
      ctx.fillStyle = "#334155";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + dx, y + dy);
    });

    // Area shading
    if (derivStep >= 2) {
      ctx.beginPath();
      ctx.moveTo(Cx, Cy);
      ctx.lineTo(Ax, Ay);
      ctx.lineTo(Bx, By);
      ctx.closePath();
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
      ctx.fill();
    }
  }, [sideA, sideB, angleC, derivStep]);

  useEffect(() => {
    draw();
  }, [draw]);

  const nextStep = () => {
    setDerivStep((prev) => (Math.min(prev + 1, 3) as DerivationStep));
  };

  const resetSteps = () => {
    setDerivStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={350}
          className="w-full max-w-[400px]"
        />
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">辺 a = {sideA}</span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={sideA}
            onChange={(e) => setSideA(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">辺 b = {sideB}</span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={sideB}
            onChange={(e) => setSideB(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-indigo-500">角 C = {angleC}°</span>
            <span className="text-slate-400">sin C = {sinC.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={175}
            step={1}
            value={angleC}
            onChange={(e) => setAngleC(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Derivation steps */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-700">導出過程</h3>
          <div className="flex gap-2">
            <button
              onClick={nextStep}
              disabled={derivStep >= 3}
              className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-40"
            >
              次のステップ
            </button>
            <button
              onClick={resetSteps}
              className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Step 0: always visible */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-bold mb-1">Step 0: 三角形の面積公式</p>
            <p className="text-sm">
              <K tex="S = \dfrac{1}{2} \times \text{底辺} \times \text{高さ}" />
            </p>
          </div>

          {derivStep >= 1 && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-xs text-amber-600 font-bold mb-1">Step 1: 高さ h を求める</p>
              <p className="text-sm">
                頂点Bから底辺aに垂線を下ろすと:{" "}
                <K tex={`h = b \\sin C = ${sideB} \\times \\sin ${angleC}^\\circ = ${h.toFixed(2)}`} />
              </p>
            </div>
          )}

          {derivStep >= 2 && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs text-blue-600 font-bold mb-1">Step 2: 面積公式に代入</p>
              <p className="text-sm">
                <K tex={`S = \\dfrac{1}{2} \\cdot a \\cdot h = \\dfrac{1}{2} \\cdot a \\cdot b \\sin C`} />
              </p>
            </div>
          )}

          {derivStep >= 3 && (
            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <p className="text-xs text-green-600 font-bold mb-1">Step 3: 計算結果</p>
              <p className="text-sm">
                <K tex={`S = \\dfrac{1}{2} \\cdot ${sideA} \\cdot ${sideB} \\cdot \\sin ${angleC}^\\circ = \\dfrac{1}{2} \\cdot ${sideA} \\cdot ${sideB} \\cdot ${sinC.toFixed(4)}`} />
              </p>
              <p className="text-lg font-bold text-green-700 mt-1 text-center">
                <K tex={`S = ${area.toFixed(2)}`} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Area result */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
        <h3 className="font-bold text-sm text-slate-700 mb-3">面積</h3>
        <div className="text-sm mb-2">
          <K tex={`S = \\dfrac{1}{2} ab \\sin C = \\dfrac{1}{2} \\cdot ${sideA} \\cdot ${sideB} \\cdot \\sin ${angleC}^\\circ`} />
        </div>
        <div className="text-2xl font-black text-indigo-600">
          <K tex={`S = ${area.toFixed(2)}`} />
        </div>
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">面積公式のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            <K tex="S = \dfrac{1}{2} ab \sin C" />（2辺とその挟む角）
          </li>
          <li>
            同様に <K tex="S = \dfrac{1}{2} bc \sin A = \dfrac{1}{2} ca \sin B" />
          </li>
          <li>角が 90° のとき sin C = 1 となり、通常の底辺×高さ÷2 に一致</li>
          <li>角が 0° や 180° に近づくと面積は 0 に近づく</li>
        </ul>
      </div>
    </div>
  );
}
