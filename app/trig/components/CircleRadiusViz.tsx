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

export default function CircleRadiusViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sideA, setSideA] = useState(8);
  const [sideB, setSideB] = useState(6);
  const [sideC, setSideC] = useState(7);

  // Compute triangle properties
  // Using cosine rule to find angle A: cos A = (b² + c² - a²) / (2bc)
  const cosA = (sideB ** 2 + sideC ** 2 - sideA ** 2) / (2 * sideB * sideC);
  const angleA = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const sinA = Math.sin(angleA);

  // Check if triangle is valid
  const valid = sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA;

  // Semi-perimeter
  const s = (sideA + sideB + sideC) / 2;

  // Area by Heron's formula
  const areaSquared = s * (s - sideA) * (s - sideB) * (s - sideC);
  const area = areaSquared > 0 ? Math.sqrt(areaSquared) : 0;

  // Circumradius: R = a / (2 sin A)
  const circumR = sinA > 0.001 ? sideA / (2 * sinA) : 0;

  // Inradius: r = S / s
  const inR = s > 0 ? area / s : 0;

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
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("三角形の条件を満たしていません", cx, cy);
      ctx.fillText("(どの辺も他の2辺の和より短い必要があります)", cx, cy + 20);
      return;
    }

    // Scale factor: fit triangle in canvas
    const maxSide = Math.max(sideA, sideB, sideC);
    const scale = 140 / maxSide;

    // Place triangle: C at origin, B along x-axis at distance a
    // A is found from sides b and c
    const Cx_local = 0;
    const Cy_local = 0;
    const Bx_local = sideA;
    const By_local = 0;
    // A position: distance c from C, distance b from B (using angle C)
    const cosC = (sideA ** 2 + sideB ** 2 - sideC ** 2) / (2 * sideA * sideB);
    const sinC_val = Math.sqrt(Math.max(0, 1 - cosC ** 2));
    const Ax_local = sideB * cosC;
    const Ay_local = sideB * sinC_val;

    // Center triangle on canvas
    const centroidX = (Cx_local + Bx_local + Ax_local) / 3;
    const centroidY = (Cy_local + By_local + Ay_local) / 3;
    const offsetX = cx - centroidX * scale;
    const offsetY = cy + centroidY * scale; // flip y

    const toCanvas = (lx: number, ly: number): [number, number] => {
      return [lx * scale + offsetX, -ly * scale + offsetY];
    };

    const [Ax, Ay] = toCanvas(Ax_local, Ay_local);
    const [Bx, By] = toCanvas(Bx_local, By_local);
    const [Cxp, Cyp] = toCanvas(Cx_local, Cy_local);

    // Circumcenter (intersection of perpendicular bisectors)
    const D = 2 * (Ax_local * (By_local - Ay_local) +
                    Bx_local * (Ay_local - Cy_local) +
                    Cx_local * (Cy_local - By_local));

    let circumCx_local = 0;
    let circumCy_local = 0;
    if (Math.abs(D) > 0.0001) {
      circumCx_local = ((Ax_local ** 2 + Ay_local ** 2) * (By_local - Cy_local) +
                          (Bx_local ** 2 + By_local ** 2) * (Cy_local - Ay_local) +
                          (Cx_local ** 2 + Cy_local ** 2) * (Ay_local - By_local)) / D;
      circumCy_local = ((Ax_local ** 2 + Ay_local ** 2) * (Cx_local - Bx_local) +
                          (Bx_local ** 2 + By_local ** 2) * (Ax_local - Cx_local) +
                          (Cx_local ** 2 + Cy_local ** 2) * (Bx_local - Ax_local)) / D;
    }
    const [circumCxCanvas, circumCyCanvas] = toCanvas(circumCx_local, circumCy_local);
    const circumRCanvas = circumR * scale;

    // Incenter (weighted by side lengths)
    const incenterX_local = (sideA * Ax_local + sideB * Bx_local + sideC * Cx_local) / (sideA + sideB + sideC);
    const incenterY_local = (sideA * Ay_local + sideB * By_local + sideC * Cy_local) / (sideA + sideB + sideC);
    const [incenterXCanvas, incenterYCanvas] = toCanvas(incenterX_local, incenterY_local);
    const inRCanvas = inR * scale;

    // Draw circumscribed circle
    ctx.beginPath();
    ctx.arc(circumCxCanvas, circumCyCanvas, circumRCanvas, 0, 2 * Math.PI);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw inscribed circle
    ctx.beginPath();
    ctx.arc(incenterXCanvas, incenterYCanvas, inRCanvas, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill triangle
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cxp, Cyp);
    ctx.closePath();
    ctx.fillStyle = "rgba(99, 102, 241, 0.06)";
    ctx.fill();

    // Draw triangle sides
    const sides: { from: [number, number]; to: [number, number]; color: string; label: string; value: number }[] = [
      { from: [Bx, By], to: [Cxp, Cyp], color: "#ef4444", label: "a", value: sideA },
      { from: [Ax, Ay], to: [Cxp, Cyp], color: "#3b82f6", label: "b", value: sideB },
      { from: [Ax, Ay], to: [Bx, By], color: "#22c55e", label: "c", value: sideC },
    ];

    sides.forEach(({ from, to, color, label, value }) => {
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const mx = (from[0] + to[0]) / 2;
      const my = (from[1] + to[1]) / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = mx + (dx / dist) * 18;
      const oy = my + (dy / dist) * 18;

      ctx.fillStyle = color;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${label}=${value}`, ox, oy);
    });

    // Vertex labels
    const vertices: { x: number; y: number; label: string }[] = [
      { x: Ax, y: Ay, label: "A" },
      { x: Bx, y: By, label: "B" },
      { x: Cxp, y: Cyp, label: "C" },
    ];
    vertices.forEach(({ x, y, label }) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const lx = x + (dx / dist) * 18;
      const ly = y + (dy / dist) * 18;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#334155";
      ctx.fill();

      ctx.fillStyle = "#334155";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, lx, ly);
    });

    // Circumcenter dot and R label
    ctx.beginPath();
    ctx.arc(circumCxCanvas, circumCyCanvas, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(circumCxCanvas, circumCyCanvas);
    ctx.lineTo(Ax, Ay);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    const rmx = (circumCxCanvas + Ax) / 2;
    const rmy = (circumCyCanvas + Ay) / 2;
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("R", rmx + 10, rmy);

    // Incenter dot and r label
    ctx.beginPath();
    ctx.arc(incenterXCanvas, incenterYCanvas, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("r", incenterXCanvas + inRCanvas + 8, incenterYCanvas);
  }, [sideA, sideB, sideC, valid, circumR, inR, sinA, angleA, area, s]);

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
            <span className="font-bold text-red-500">辺 a = {sideA}</span>
          </div>
          <input type="range" min={2} max={15} step={0.5} value={sideA}
            onChange={(e) => setSideA(Number(e.target.value))}
            className="w-full accent-red-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">辺 b = {sideB}</span>
          </div>
          <input type="range" min={2} max={15} step={0.5} value={sideB}
            onChange={(e) => setSideB(Number(e.target.value))}
            className="w-full accent-blue-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-green-500">辺 c = {sideC}</span>
          </div>
          <input type="range" min={2} max={15} step={0.5} value={sideC}
            onChange={(e) => setSideC(Number(e.target.value))}
            className="w-full accent-green-500" />
        </div>
        {!valid && (
          <p className="text-red-500 text-xs font-bold">
            三角形の条件を満たしていません。辺の長さを調整してください。
          </p>
        )}
      </div>

      {/* Circumradius */}
      {valid && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-blue-700 mb-3">外接円の半径 R（正弦定理）</h3>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="text-sm text-blue-600 text-center">
              <K tex={`R = \\frac{a}{2\\sin A} = \\frac{${sideA}}{2 \\times ${sinA.toFixed(4)}} = ${circumR.toFixed(3)}`} />
            </div>
            <div className="text-center text-2xl font-black text-blue-700">
              R = {circumR.toFixed(3)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center">
            角A = {(angleA * 180 / Math.PI).toFixed(1)}°, sin A = {sinA.toFixed(4)}
          </div>
        </div>
      )}

      {/* Inradius */}
      {valid && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-red-700 mb-3">内接円の半径 r</h3>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-2">
            <div className="text-sm text-red-600 text-center">
              <K tex={`r = \\frac{S}{s} = \\frac{${area.toFixed(2)}}{${s.toFixed(2)}} = ${inR.toFixed(3)}`} />
            </div>
            <div className="text-center text-2xl font-black text-red-700">
              r = {inR.toFixed(3)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center">
            面積 S = {area.toFixed(2)}, 半周長 s = {s.toFixed(2)}
          </div>
        </div>
      )}

      {/* Key formulas */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">公式まとめ</h4>
        <ul className="text-sm text-indigo-600 space-y-2 list-disc list-inside">
          <li>
            外接円半径：<K tex="R = \dfrac{a}{2\sin A} = \dfrac{b}{2\sin B} = \dfrac{c}{2\sin C}" />
          </li>
          <li>
            内接円半径：<K tex="r = \dfrac{S}{s}" /> （S: 面積, s: 半周長）
          </li>
          <li>
            面積（ヘロンの公式）：<K tex="S = \sqrt{s(s-a)(s-b)(s-c)}" />
          </li>
          <li>
            半周長：<K tex="s = \dfrac{a+b+c}{2}" />
          </li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: "外接円半径は正弦定理から R = a/(2sinA) で求められます" },
        { step: 2, text: "内接円半径は r = S/s（面積÷半周長）で求められます" },
        { step: 3, text: "面積 S はヘロンの公式 S = √(s(s-a)(s-b)(s-c)) で計算できます" },
      ]} />
    </div>
  );
}
