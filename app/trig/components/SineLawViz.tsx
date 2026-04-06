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

export default function SineLawViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angleA, setAngleA] = useState(50);
  const [angleB, setAngleB] = useState(70);

  // angle C is derived
  const angleC = 180 - angleA - angleB;
  const valid = angleC > 5 && angleC < 170;

  // Compute triangle using sine rule: a/sinA = b/sinB = c/sinC = 2R
  // Fix circumradius R = 120 pixels
  const R = 120;
  const diameter = 2 * R;

  const sinA = Math.sin(toRad(angleA));
  const sinB = Math.sin(toRad(angleB));
  const sinC = Math.sin(toRad(valid ? angleC : 60));

  const a = diameter * sinA;
  const b = diameter * sinB;
  const c = diameter * sinC;

  const ratioA = sinA > 0.001 ? (a / sinA).toFixed(1) : "---";
  const ratioB = sinB > 0.001 ? (b / sinB).toFixed(1) : "---";
  const ratioC = sinC > 0.001 ? (c / sinC).toFixed(1) : "---";

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    if (!valid) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("角度の合計が180°になるように調整してください", cx, cy);
      return;
    }

    // Draw circumscribed circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Place vertices on the circumscribed circle
    // Vertex A at angle alpha on circle, B at beta, C at gamma
    // Using inscribed angle theorem: central angle = 2 * inscribed angle
    // Place C at top, then A and B determined by angles
    const startAngle = -Math.PI / 2; // top
    const cAngle = startAngle;
    const aAngle = cAngle + 2 * toRad(angleC);
    const bAngle = cAngle - 2 * toRad(angleB);

    const Ax = cx + R * Math.cos(aAngle);
    const Ay = cy + R * Math.sin(aAngle);
    const Bx = cx + R * Math.cos(bAngle);
    const By = cy + R * Math.sin(bAngle);
    const Cx = cx + R * Math.cos(cAngle);
    const Cy = cy + R * Math.sin(cAngle);

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.06)";
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw sides with colors
    const sides: { from: [number, number]; to: [number, number]; color: string; label: string }[] = [
      { from: [Bx, By], to: [Cx, Cy], color: "#ef4444", label: "a" },  // side a opposite A
      { from: [Ax, Ay], to: [Cx, Cy], color: "#3b82f6", label: "b" },  // side b opposite B
      { from: [Ax, Ay], to: [Bx, By], color: "#22c55e", label: "c" },  // side c opposite C
    ];

    sides.forEach(({ from, to, color, label }) => {
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label at midpoint
      const mx = (from[0] + to[0]) / 2;
      const my = (from[1] + to[1]) / 2;
      // Offset label away from center
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = mx + (dx / dist) * 16;
      const oy = my + (dy / dist) * 16;

      ctx.fillStyle = color;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, ox, oy);
    });

    // Draw vertex labels
    const vertices: { x: number; y: number; label: string; color: string }[] = [
      { x: Ax, y: Ay, label: "A", color: "#ef4444" },
      { x: Bx, y: By, label: "B", color: "#3b82f6" },
      { x: Cx, y: Cy, label: "C", color: "#22c55e" },
    ];

    vertices.forEach(({ x, y, label, color }) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const lx = x + (dx / dist) * 20;
      const ly = y + (dy / dist) * 20;

      // Draw vertex dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = color;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, lx, ly);
    });

    // Draw center dot and R
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();

    // Draw radius line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(Cx, Cy);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    const rmx = (cx + Cx) / 2;
    const rmy = (cy + Cy) / 2;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("R", rmx + 12, rmy);
  }, [angleA, angleB, valid, angleC]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full max-w-[400px] aspect-square"
        />
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">
              角A = {angleA}°
            </span>
            <span className="text-slate-400">sin A = {sinA.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={160}
            step={1}
            value={angleA}
            onChange={(e) => setAngleA(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">
              角B = {angleB}°
            </span>
            <span className="text-slate-400">sin B = {sinB.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={160}
            step={1}
            value={angleB}
            onChange={(e) => setAngleB(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold text-green-500">
            角C = {valid ? angleC : "---"}°
          </span>
          <span className="text-slate-400">
            sin C = {valid ? sinC.toFixed(4) : "---"}
          </span>
        </div>
        {!valid && (
          <p className="text-red-500 text-xs font-bold">
            角の合計が180°になるように調整してください (現在: 角C = {angleC}°)
          </p>
        )}
      </div>

      {/* Sine rule values */}
      {valid && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-slate-700 mb-4">
            <K tex="\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C} = 2R" />
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
              <div className="text-xs text-red-400 font-bold mb-1">a / sin A</div>
              <div className="text-lg font-black text-red-600">{ratioA}</div>
              <div className="text-xs text-red-400 mt-1">
                {a.toFixed(1)} / {sinA.toFixed(3)}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <div className="text-xs text-blue-400 font-bold mb-1">b / sin B</div>
              <div className="text-lg font-black text-blue-600">{ratioB}</div>
              <div className="text-xs text-blue-400 mt-1">
                {b.toFixed(1)} / {sinB.toFixed(3)}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">c / sin C</div>
              <div className="text-lg font-black text-green-600">{ratioC}</div>
              <div className="text-xs text-green-400 mt-1">
                {c.toFixed(1)} / {sinC.toFixed(3)}
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-500">
              2R = {diameter.toFixed(1)}（すべての比が一致）
            </span>
          </div>
        </div>
      )}

      {/* Key point */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">正弦定理のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            <K tex="\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C} = 2R" />
          </li>
          <li>角が大きいほど、対辺も長くなる</li>
          <li>外接円の半径 R が分かれば辺の長さが、辺が分かれば R が求まる</li>
          <li>直角三角形では 2R = 斜辺（直径）となる</li>
        </ul>
      </div>
    </div>
  );
}
