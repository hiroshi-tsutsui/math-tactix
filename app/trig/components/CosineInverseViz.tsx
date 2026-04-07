"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";
import HintButton from '../../components/HintButton';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Check triangle inequality */
function isValidTriangle(a: number, b: number, c: number): boolean {
  return a + b > c && b + c > a && c + a > b;
}

/** Find the index of the max side */
function maxSideIndex(a: number, b: number, c: number): number {
  if (a >= b && a >= c) return 0;
  if (b >= a && b >= c) return 1;
  return 2;
}

export default function CosineInverseViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sideA, setSideA] = useState(7);
  const [sideB, setSideB] = useState(5);
  const [sideC, setSideC] = useState(8);

  // Determine the largest side and compute the opposite angle
  const sides = [sideA, sideB, sideC];
  const maxIdx = maxSideIndex(sideA, sideB, sideC);
  const valid = isValidTriangle(sideA, sideB, sideC);

  // Compute angle opposite to each side using cosine rule inverse
  const computeAngle = useCallback(
    (oppositeSide: number, adj1: number, adj2: number): number => {
      const cosVal = (adj1 ** 2 + adj2 ** 2 - oppositeSide ** 2) / (2 * adj1 * adj2);
      return toDeg(Math.acos(Math.max(-1, Math.min(1, cosVal))));
    },
    []
  );

  const angleA = valid ? computeAngle(sideA, sideB, sideC) : 0;
  const angleB = valid ? computeAngle(sideB, sideA, sideC) : 0;
  const angleC = valid ? computeAngle(sideC, sideA, sideB) : 0;

  // The angle opposite to the largest side
  const targetAngle = [angleA, angleB, angleC][maxIdx];
  const targetSide = sides[maxIdx];
  const adj1 = sides[(maxIdx + 1) % 3];
  const adj2 = sides[(maxIdx + 2) % 3];
  const cosValue = valid
    ? (adj1 ** 2 + adj2 ** 2 - targetSide ** 2) / (2 * adj1 * adj2)
    : 0;

  const labels = ["A", "B", "C"];
  const targetLabel = labels[maxIdx];
  const adj1Label = labels[(maxIdx + 1) % 3];
  const adj2Label = labels[(maxIdx + 2) % 3];
  const sideLabels = ["a", "b", "c"];
  const targetSideLabel = sideLabels[maxIdx];
  const adj1SideLabel = sideLabels[(maxIdx + 1) % 3];
  const adj2SideLabel = sideLabels[(maxIdx + 2) % 3];

  // Draw triangle on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!valid) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("三角不等式を満たしません", W / 2, H / 2);
      return;
    }

    const maxSide = Math.max(sideA, sideB, sideC);
    const scale = Math.min(W, H) / (maxSide * 3.2 + 1);
    const cx = W / 2;
    const cy = H / 2 + 20;

    // Place vertices: B at left, C at right (side a = BC opposite A)
    // Angle at B
    const cosBval = (sideA ** 2 + sideC ** 2 - sideB ** 2) / (2 * sideA * sideC);
    const angleBrad = Math.acos(Math.max(-1, Math.min(1, cosBval)));

    const Bx = cx - (sideA * scale) / 2;
    const By = cy + 40;
    const Cx = cx + (sideA * scale) / 2;
    const Cy = By;

    // A is above, placed using angle at B and side c (AB)
    const Ax = Bx + sideC * scale * Math.cos(-angleBrad);
    const Ay = By + sideC * scale * Math.sin(-angleBrad);

    // Triangle fill
    const isObtuse = targetAngle > 90;
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.fillStyle = isObtuse ? "rgba(239, 68, 68, 0.06)" : "rgba(59, 130, 246, 0.06)";
    ctx.fill();

    // Draw sides
    const sideData: {
      from: [number, number];
      to: [number, number];
      color: string;
      label: string;
    }[] = [
      { from: [Bx, By], to: [Cx, Cy], color: "#ef4444", label: `a=${sideA}` },
      { from: [Ax, Ay], to: [Cx, Cy], color: "#3b82f6", label: `b=${sideB}` },
      { from: [Ax, Ay], to: [Bx, By], color: "#22c55e", label: `c=${sideC}` },
    ];

    sideData.forEach(({ from, to, color, label }) => {
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      const mx = (from[0] + to[0]) / 2;
      const my = (from[1] + to[1]) / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = mx + (dx / dist) * 20;
      const oy = my + (dy / dist) * 20;

      ctx.fillStyle = color;
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, ox, oy);
    });

    // Draw angle arcs
    const vertices = [
      { x: Ax, y: Ay, v1: { x: Bx, y: By }, v2: { x: Cx, y: Cy }, angle: angleA, label: "A", isTarget: maxIdx === 0 },
      { x: Bx, y: By, v1: { x: Ax, y: Ay }, v2: { x: Cx, y: Cy }, angle: angleB, label: "B", isTarget: maxIdx === 1 },
      { x: Cx, y: Cy, v1: { x: Ax, y: Ay }, v2: { x: Bx, y: By }, angle: angleC, label: "C", isTarget: maxIdx === 2 },
    ];

    vertices.forEach(({ x, y, v1, v2, angle, label, isTarget }) => {
      const vec1 = { x: v1.x - x, y: v1.y - y };
      const vec2 = { x: v2.x - x, y: v2.y - y };
      const startAngle = Math.atan2(vec1.y, vec1.x);
      const endAngle = Math.atan2(vec2.y, vec2.x);

      // Draw arc
      const arcColor = isTarget ? (isObtuse ? "#ef4444" : "#6366f1") : "#94a3b8";
      const arcRadius = isTarget ? 28 : 18;
      ctx.beginPath();
      ctx.arc(x, y, arcRadius, startAngle, endAngle, false);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = isTarget ? 3 : 1.5;
      ctx.stroke();

      // Angle label
      const midAngle = (startAngle + endAngle) / 2;
      const labelDist = isTarget ? 42 : 30;
      const lx = x + labelDist * Math.cos(midAngle);
      const ly = y + labelDist * Math.sin(midAngle);
      ctx.fillStyle = arcColor;
      ctx.font = isTarget ? "bold 13px sans-serif" : "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${angle.toFixed(1)}°`, lx, ly);

      // Vertex dot and label
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const vlx = x + (dx / d) * 22;
      const vly = y + (dy / d) * 22;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = isTarget ? (isObtuse ? "#ef4444" : "#6366f1") : "#64748b";
      ctx.fill();

      ctx.fillStyle = isTarget ? (isObtuse ? "#ef4444" : "#6366f1") : "#64748b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, vlx, vly);
    });
  }, [sideA, sideB, sideC, angleA, angleB, angleC, maxIdx, targetAngle, valid]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={350}
          className="w-full max-w-[400px]"
        />
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">三辺の長さを調整</h3>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">辺 a = {sideA}</span>
          </div>
          <input
            type="range"
            min={1}
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
            min={1}
            max={20}
            step={1}
            value={sideB}
            onChange={(e) => setSideB(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-green-500">辺 c = {sideC}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={sideC}
            onChange={(e) => setSideC(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
        {!valid && (
          <p className="text-red-500 text-sm font-bold">
            三角不等式を満たしていません（三角形が作れません）
          </p>
        )}
      </div>

      {/* Calculation steps */}
      {valid && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">
            余弦定理の逆算（最大辺 {targetSideLabel} = {targetSide} に対する角 {targetLabel}）
          </h3>
          <div className="text-center text-sm space-y-3">
            <div>
              <MathDisplay
                tex={`\\cos ${targetLabel} = \\frac{${adj1SideLabel}^2 + ${adj2SideLabel}^2 - ${targetSideLabel}^2}{2 \\cdot ${adj1SideLabel} \\cdot ${adj2SideLabel}}`}
                displayMode
              />
            </div>
            <div>
              <MathDisplay
                tex={`\\cos ${targetLabel} = \\frac{${adj1}^2 + ${adj2}^2 - ${targetSide}^2}{2 \\cdot ${adj1} \\cdot ${adj2}}`}
                displayMode
              />
            </div>
            <div>
              <MathDisplay
                tex={`\\cos ${targetLabel} = \\frac{${adj1 ** 2} + ${adj2 ** 2} - ${targetSide ** 2}}{${2 * adj1 * adj2}}`}
                displayMode
              />
            </div>
            <div>
              <MathDisplay
                tex={`\\cos ${targetLabel} = \\frac{${adj1 ** 2 + adj2 ** 2 - targetSide ** 2}}{${2 * adj1 * adj2}} = ${cosValue.toFixed(4)}`}
                displayMode
              />
            </div>
            <div className="text-lg font-bold mt-2">
              <MathDisplay
                tex={`${targetLabel} = \\arccos(${cosValue.toFixed(4)}) = ${targetAngle.toFixed(1)}^\\circ`}
                displayMode
              />
            </div>
          </div>

          {/* Angle type */}
          {targetAngle > 90 && (
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4 border border-red-100 dark:border-red-900 mt-3">
              <p className="text-sm text-red-700 dark:text-red-300 font-bold mb-1">
                鈍角三角形
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                角{targetLabel} = {targetAngle.toFixed(1)}° &gt; 90° なので、この三角形は鈍角三角形です。
                cos {targetLabel} = {cosValue.toFixed(4)} &lt; 0 であることが特徴です。
              </p>
            </div>
          )}
          {Math.abs(targetAngle - 90) < 0.5 && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-100 dark:border-blue-900 mt-3">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-bold mb-1">
                直角三角形
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                角{targetLabel} ≈ 90° なので、この三角形はほぼ直角三角形です。
                cos {targetLabel} ≈ 0 であり、ピタゴラスの定理が成り立ちます。
              </p>
            </div>
          )}
          {targetAngle < 90 && Math.abs(targetAngle - 90) >= 0.5 && (
            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-100 dark:border-green-900 mt-3">
              <p className="text-sm text-green-700 dark:text-green-300 font-bold mb-1">
                鋭角三角形
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                すべての角が90°未満なので、この三角形は鋭角三角形です。
              </p>
            </div>
          )}
        </div>
      )}

      {/* All angles summary */}
      {valid && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-4">全角度の一覧</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "A", angle: angleA, color: maxIdx === 0 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-600 dark:text-slate-400" },
              { label: "B", angle: angleB, color: maxIdx === 1 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-600 dark:text-slate-400" },
              { label: "C", angle: angleC, color: maxIdx === 2 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-600 dark:text-slate-400" },
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-xl border ${maxIdx === labels.indexOf(item.label) ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"}`}>
                <p className={`text-lg font-bold ${item.color}`}>{item.label}</p>
                <p className={`text-xl font-mono ${item.color}`}>{item.angle.toFixed(1)}°</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
            <MathDisplay tex={`A + B + C = ${angleA.toFixed(1)}° + ${angleB.toFixed(1)}° + ${angleC.toFixed(1)}° = ${(angleA + angleB + angleC).toFixed(1)}°`} />
          </div>
        </div>
      )}

      {/* Key points */}
      <div className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">余弦定理の逆算 ポイント</h4>
        <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-2 list-disc list-inside">
          <li>
            <MathDisplay tex="\cos A = \dfrac{b^2 + c^2 - a^2}{2bc}" /> で cos A を求め、
            <MathDisplay tex="A = \arccos(\cos A)" /> で角度に変換する
          </li>
          <li>cos A &gt; 0 なら A は鋭角（0° &lt; A &lt; 90°）</li>
          <li>cos A = 0 なら A = 90°（直角）</li>
          <li>cos A &lt; 0 なら A は鈍角（90° &lt; A &lt; 180°）</li>
          <li>最大辺に対する角が最大角になる</li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: "cosA = (b²+c²-a²)/(2bc) に3辺を代入して cosA を計算しましょう" },
        { step: 2, text: "cosA の符号で角度の種類が分かります（正→鋭角、0→直角、負→鈍角）" },
        { step: 3, text: "A = arccos(cosA) で角度（度数）を求めます" },
      ]} />
    </div>
  );
}
