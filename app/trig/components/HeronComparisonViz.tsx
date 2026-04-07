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

/** Given sides a, b, c compute angle C (opposite c) via cosine rule */
function angleByCosineRule(a: number, b: number, c: number): number {
  const cosC = (a * a + b * b - c * c) / (2 * a * b);
  return (Math.acos(Math.max(-1, Math.min(1, cosC))) * 180) / Math.PI;
}

/** Check triangle inequality */
function isValidTriangle(a: number, b: number, c: number): boolean {
  return a + b > c && b + c > a && a + c > b;
}

export default function HeronComparisonViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 420, height: 320 });
  const [sideA, setSideA] = useState(8);
  const [sideB, setSideB] = useState(10);
  const [sideC, setSideC] = useState(12);

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

  const valid = isValidTriangle(sideA, sideB, sideC);

  // Angles via cosine rule
  const angleA = valid ? angleByCosineRule(sideB, sideC, sideA) : 0;
  const angleB = valid ? angleByCosineRule(sideA, sideC, sideB) : 0;
  const angleC = valid ? angleByCosineRule(sideA, sideB, sideC) : 0;

  // Method 1: Trig formula S = (1/2)ab sinC
  const sinC = Math.sin(toRad(angleC));
  const areaTrig = valid ? 0.5 * sideA * sideB * sinC : 0;

  // Method 2: Heron's formula
  const s = (sideA + sideB + sideC) / 2;
  const heronInside = valid ? s * (s - sideA) * (s - sideB) * (s - sideC) : 0;
  const areaHeron = valid ? Math.sqrt(Math.max(0, heronInside)) : 0;

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
      ctx.fillText("三角形が成立しません", W / 2, H / 2);
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("(三角不等式を満たしていません)", W / 2, H / 2 + 24);
      return;
    }

    const maxSide = Math.max(sideA, sideB, sideC);
    const scale = Math.min(W - 80, H - 100) / (maxSide * 1.3);
    const padBottom = 50;
    const baseY = H - padBottom;

    // Place C at left, A at right along base (side a = BC is not used as base; use side c = AB as base)
    // Actually: let's place vertex A at bottom-left, vertex B at bottom-right (side c = AB),
    // and vertex C above.
    const Ax = 50;
    const Ay = baseY;
    const Bx = Ax + sideC * scale;
    const By = baseY;

    // C: distance b from A, distance a from B
    // angle at A = angleA
    const Cx = Ax + sideB * scale * Math.cos(toRad(angleA));
    const Cy = Ay - sideB * scale * Math.sin(toRad(angleA));

    // Fill triangle
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
    ctx.fill();

    // Draw sides
    const sides: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; value: number }[] = [
      { x1: Ax, y1: Ay, x2: Bx, y2: By, color: "#ef4444", label: "c", value: sideC },
      { x1: Ax, y1: Ay, x2: Cx, y2: Cy, color: "#3b82f6", label: "b", value: sideB },
      { x1: Bx, y1: By, x2: Cx, y2: Cy, color: "#10b981", label: "a", value: sideA },
    ];

    sides.forEach(({ x1, y1, x2, y2, color, label, value }) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      // Offset label away from center
      const cx = (Ax + Bx + Cx) / 3;
      const cy = (Ay + By + Cy) / 3;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = (dx / dist) * 18;
      const oy = (dy / dist) * 18;

      ctx.fillStyle = color;
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${label}=${value}`, mx + ox, my + oy);
    });

    // Angle arcs
    const drawAngle = (vx: number, vy: number, fromDeg: number, toDeg: number, label: string, angleDeg: number) => {
      ctx.beginPath();
      ctx.arc(vx, vy, 22, -toRad(toDeg), -toRad(fromDeg), false);
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const midDeg = (fromDeg + toDeg) / 2;
      const lx = vx + 34 * Math.cos(toRad(midDeg));
      const ly = vy - 34 * Math.sin(toRad(midDeg));
      ctx.fillStyle = "#6366f1";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${label}=${angleDeg.toFixed(1)}°`, lx, ly);
    };

    // Angle at A
    drawAngle(Ax, Ay, 0, angleA, "A", angleA);
    // Angle at B
    const angleBStart = 180 - angleB;
    drawAngle(Bx, By, angleBStart, 180, "B", angleB);

    // Vertex dots
    const verts = [
      { x: Ax, y: Ay, label: "A", dx: -14, dy: 16 },
      { x: Bx, y: By, label: "B", dx: 14, dy: 16 },
      { x: Cx, y: Cy, label: "C", dx: 0, dy: -16 },
    ];
    verts.forEach(({ x, y, label, dx, dy }) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#334155";
      ctx.fill();
      ctx.fillStyle = "#334155";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + dx, y + dy);
    });
  }, [sideA, sideB, sideC, valid, angleA, angleB]);

  useEffect(() => {
    draw();
  }, [draw]);

  const diff = Math.abs(areaTrig - areaHeron);
  const isMatch = valid && diff < 0.01;

  return (
    <div className="space-y-6">
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
            <span className="font-bold text-emerald-600">辺 a = {sideA}</span>
          </div>
          <input type="range" min={2} max={20} step={1} value={sideA}
            onChange={(e) => setSideA(Number(e.target.value))}
            className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">辺 b = {sideB}</span>
          </div>
          <input type="range" min={2} max={20} step={1} value={sideB}
            onChange={(e) => setSideB(Number(e.target.value))}
            className="w-full accent-blue-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">辺 c = {sideC}</span>
          </div>
          <input type="range" min={2} max={20} step={1} value={sideC}
            onChange={(e) => setSideC(Number(e.target.value))}
            className="w-full accent-red-500" />
        </div>
        {!valid && (
          <p className="text-red-500 text-xs font-bold">
            三角不等式を満たしていません。辺の長さを調整してください。
          </p>
        )}
      </div>

      {valid && (
        <>
          {/* Angles */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">内角（余弦定理で算出）</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">角 A</div>
                <div className="font-bold">{angleA.toFixed(1)}°</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">角 B</div>
                <div className="font-bold">{angleB.toFixed(1)}°</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">角 C</div>
                <div className="font-bold">{angleC.toFixed(1)}°</div>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">
              合計: {(angleA + angleB + angleC).toFixed(1)}°
            </div>
          </div>

          {/* Two formulas side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trig formula */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-sm text-blue-700 dark:text-blue-300 mb-3">方法1: 三角比の公式</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <K tex={`S = \\dfrac{1}{2} ab \\sin C`} />
                </p>
                <p>
                  <K tex={`= \\dfrac{1}{2} \\cdot ${sideA} \\cdot ${sideB} \\cdot \\sin ${angleC.toFixed(1)}^\\circ`} />
                </p>
                <p>
                  <K tex={`= \\dfrac{1}{2} \\cdot ${sideA} \\cdot ${sideB} \\cdot ${sinC.toFixed(4)}`} />
                </p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300 text-center pt-2">
                  <K tex={`S = ${areaTrig.toFixed(2)}`} />
                </p>
              </div>
            </div>

            {/* Heron's formula */}
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-sm text-amber-700 dark:text-amber-300 mb-3">方法2: ヘロンの公式</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <K tex={`s = \\dfrac{a+b+c}{2} = \\dfrac{${sideA}+${sideB}+${sideC}}{2} = ${s.toFixed(1)}`} />
                </p>
                <p>
                  <K tex={`S = \\sqrt{s(s{-}a)(s{-}b)(s{-}c)}`} />
                </p>
                <p>
                  <K tex={`= \\sqrt{${s.toFixed(1)} \\cdot ${(s - sideA).toFixed(1)} \\cdot ${(s - sideB).toFixed(1)} \\cdot ${(s - sideC).toFixed(1)}}`} />
                </p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-300 text-center pt-2">
                  <K tex={`S = ${areaHeron.toFixed(2)}`} />
                </p>
              </div>
            </div>
          </div>

          {/* Match indicator */}
          <div className={`rounded-2xl p-5 border text-center ${
            isMatch
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
          }`}>
            <div className="text-lg font-bold mb-1">
              {isMatch ? (
                <span className="text-green-700 dark:text-green-300">両公式の結果が一致しています</span>
              ) : (
                <span className="text-red-700 dark:text-red-300">計算誤差: {diff.toFixed(4)}</span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              三角比の公式: {areaTrig.toFixed(4)} ／ ヘロンの公式: {areaHeron.toFixed(4)}
            </p>
          </div>

          {/* Key points */}
          <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">ポイント</h4>
            <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-2 list-disc list-inside">
              <li>
                <K tex="S = \dfrac{1}{2} ab \sin C" /> は2辺とその挟角が分かっているときに使える
              </li>
              <li>
                ヘロンの公式は3辺の長さだけで面積を求められる（角度不要）
              </li>
              <li>
                どちらの公式でも結果は必ず一致する
              </li>
              <li>
                ヘロンの公式では <K tex="s = \dfrac{a+b+c}{2}" /> (半周長) を先に計算する
              </li>
            </ul>
          </div>
        </>
      )}

      <HintButton hints={[
        { step: 1, text: "ヘロンの公式では、まず半周長 s = (a+b+c)/2 を計算します" },
        { step: 2, text: "面積 S = √(s(s-a)(s-b)(s-c)) に代入して計算します" },
        { step: 3, text: "S = (1/2)ab sinC の公式でも同じ結果が得られることを確認しましょう" },
      ]} />
    </div>
  );
}
