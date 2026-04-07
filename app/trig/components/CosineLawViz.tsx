"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

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

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

type PracticeState = {
  sideA: number;
  sideB: number;
  sideC: number;
  userAnswer: string;
  revealed: boolean;
};

export default function CosineLawViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sideB, setSideB] = useState(8);
  const [sideC, setSideC] = useState(10);
  const [angleA, setAngleA] = useState(60);

  // Practice problem state
  const [practice, setPractice] = useState<PracticeState>({
    sideA: 7,
    sideB: 5,
    sideC: 8,
    userAnswer: "",
    revealed: false,
  });

  const cosA = Math.cos(toRad(angleA));
  const aSquared = sideB ** 2 + sideC ** 2 - 2 * sideB * sideC * cosA;
  const sideA = Math.sqrt(Math.max(0, aSquared));
  const correction = 2 * sideB * sideC * cosA;
  const isObtuse = angleA > 90;

  // For canvas: compute triangle vertices
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const scale = Math.min(W, H) / (Math.max(sideB, sideC, sideA) * 2.8 + 1);
    const cx = W / 2;
    const cy = H / 2 + 20;

    // Place B at left, C at right, A above
    const Bx = cx - (sideC * scale) / 2;
    const By = cy + 40;
    const Cx = cx + (sideC * scale) / 2;
    const Cy = By;

    // A is at angle A from vertex A. We place A based on side b and angle A at vertex A.
    // Actually, angle A is at vertex A. Let's compute via B.
    // Using: A is positioned such that AB = c, BC = a, CA = b
    // Place B and C on horizontal line, then find A
    // angle at A = angleA
    // side opposite A = a = BC
    // side b = CA, side c = AB

    // Use law of cosines to find angle B
    const cosB_val =
      (sideA ** 2 + sideC ** 2 - sideB ** 2) / (2 * sideA * sideC);
    const angleBrad = Math.acos(Math.max(-1, Math.min(1, cosB_val)));

    const Ax = Bx + sideC * scale * Math.cos(-angleBrad);
    const Ay = By + sideC * scale * Math.sin(-angleBrad);

    // Draw triangle fill
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.closePath();
    ctx.fillStyle = isObtuse ? "rgba(239, 68, 68, 0.06)" : "rgba(59, 130, 246, 0.06)";
    ctx.fill();

    // Draw sides
    const sides: { from: [number, number]; to: [number, number]; color: string; label: string }[] = [
      { from: [Bx, By], to: [Cx, Cy], color: "#ef4444", label: `a=${sideA.toFixed(1)}` },
      { from: [Ax, Ay], to: [Cx, Cy], color: "#3b82f6", label: `b=${sideB}` },
      { from: [Ax, Ay], to: [Bx, By], color: "#22c55e", label: `c=${sideC}` },
    ];

    sides.forEach(({ from, to, color, label }) => {
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
      const ox = mx + (dx / dist) * 18;
      const oy = my + (dy / dist) * 18;

      ctx.fillStyle = color;
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, ox, oy);
    });

    // Draw angle arc at A
    const vecAB = { x: Bx - Ax, y: By - Ay };
    const vecAC = { x: Cx - Ax, y: Cy - Ay };
    const startAngle = Math.atan2(vecAB.y, vecAB.x);
    const endAngle = Math.atan2(vecAC.y, vecAC.x);

    ctx.beginPath();
    ctx.arc(Ax, Ay, 22, startAngle, endAngle, false);
    ctx.strokeStyle = isObtuse ? "#ef4444" : "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertex labels
    const vertices: { x: number; y: number; label: string; color: string }[] = [
      { x: Ax, y: Ay, label: "A", color: isObtuse ? "#ef4444" : "#6366f1" },
      { x: Bx, y: By, label: "B", color: "#3b82f6" },
      { x: Cx, y: Cy, label: "C", color: "#22c55e" },
    ];

    vertices.forEach(({ x, y, label, color }) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const lx = x + (dx / dist) * 20;
      const ly = y + (dy / dist) * 20;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = color;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, lx, ly);
    });

    // Angle label
    const midAngle = (startAngle + endAngle) / 2;
    const angleLabelX = Ax + 36 * Math.cos(midAngle);
    const angleLabelY = Ay + 36 * Math.sin(midAngle);
    ctx.fillStyle = isObtuse ? "#ef4444" : "#6366f1";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${angleA}°`, angleLabelX, angleLabelY);
  }, [sideB, sideC, angleA, sideA, isObtuse]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Practice: compute angle A from three sides
  const practiceAngle = (() => {
    const { sideA: pa, sideB: pb, sideC: pc } = practice;
    const cosVal = (pb ** 2 + pc ** 2 - pa ** 2) / (2 * pb * pc);
    return toDeg(Math.acos(Math.max(-1, Math.min(1, cosVal))));
  })();

  const generatePractice = () => {
    const a = Math.floor(Math.random() * 8) + 3;
    const b = Math.floor(Math.random() * 8) + 3;
    const c = Math.floor(Math.random() * 8) + 3;
    // Ensure triangle inequality
    if (a < b + c && b < a + c && c < a + b) {
      setPractice({ sideA: a, sideB: b, sideC: c, userAnswer: "", revealed: false });
    } else {
      generatePractice();
    }
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
            <span className={`font-bold ${isObtuse ? "text-red-500" : "text-indigo-500"}`}>
              角A = {angleA}° {isObtuse && "(鈍角)"}
            </span>
            <span className="text-slate-400">cos A = {cosA.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={170}
            step={1}
            value={angleA}
            onChange={(e) => setAngleA(Number(e.target.value))}
            className={`w-full ${isObtuse ? "accent-red-500" : "accent-indigo-500"}`}
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">辺 b = {sideB}</span>
          </div>
          <input
            type="range"
            min={3}
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
            min={3}
            max={20}
            step={1}
            value={sideC}
            onChange={(e) => setSideC(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      {/* Cosine law computation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700 mb-2">余弦定理の計算</h3>
        <div className="text-center text-sm space-y-2">
          <div>
            <K tex={`a^2 = b^2 + c^2 - 2bc\\cos A`} />
          </div>
          <div>
            <K tex={`a^2 = ${sideB}^2 + ${sideC}^2 - 2 \\cdot ${sideB} \\cdot ${sideC} \\cdot \\cos ${angleA}^\\circ`} />
          </div>
          <div>
            <K tex={`a^2 = ${sideB ** 2} + ${sideC ** 2} - ${(2 * sideB * sideC).toFixed(0)} \\times (${cosA.toFixed(4)})`} />
          </div>
          <div>
            <K tex={`a^2 = ${(sideB ** 2 + sideC ** 2).toFixed(0)} ${correction >= 0 ? "-" : "+"} ${Math.abs(correction).toFixed(1)} = ${aSquared.toFixed(1)}`} />
          </div>
          <div className="text-lg font-bold">
            <K tex={`a = \\sqrt{${aSquared.toFixed(1)}} = ${sideA.toFixed(2)}`} />
          </div>
        </div>

        {/* Obtuse angle highlight */}
        {isObtuse && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-100 mt-3">
            <p className="text-sm text-red-700 font-bold mb-1">
              鈍角のポイント (cos A &lt; 0)
            </p>
            <p className="text-xs text-red-600">
              角Aが鈍角 ({angleA}°) のとき、cos A = {cosA.toFixed(4)} &lt; 0 となり、
              <K tex={`-2bc\\cos A = ${(-correction).toFixed(1)}`} /> は<strong>正</strong>になります。
              つまり <K tex="a^2 > b^2 + c^2" /> となり、対辺 a は最長辺になります。
            </p>
          </div>
        )}
      </div>

      {/* Practice: inverse cosine law */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700 mb-2">
          練習：第二余弦定理（三辺 → 角度）
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          三辺が分かっているとき、角Aを求めましょう。
        </p>
        <div className="text-center text-sm mb-3">
          <K tex={`\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}`} />
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-sm font-bold text-slate-700 mb-2">
            a = {practice.sideA}, b = {practice.sideB}, c = {practice.sideC} のとき、角Aは？
          </p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={practice.userAnswer}
              onChange={(e) =>
                setPractice((prev) => ({ ...prev, userAnswer: e.target.value }))
              }
              placeholder="角度 (°)"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={() => setPractice((prev) => ({ ...prev, revealed: true }))}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors"
            >
              答え
            </button>
            <button
              onClick={generatePractice}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
            >
              次へ
            </button>
          </div>
          {practice.revealed && (
            <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <p className="text-sm text-indigo-700">
                <K
                  tex={`\\cos A = \\dfrac{${practice.sideB}^2 + ${practice.sideC}^2 - ${practice.sideA}^2}{2 \\cdot ${practice.sideB} \\cdot ${practice.sideC}} = ${(
                    (practice.sideB ** 2 +
                      practice.sideC ** 2 -
                      practice.sideA ** 2) /
                    (2 * practice.sideB * practice.sideC)
                  ).toFixed(4)}`}
                />
              </p>
              <p className="text-sm font-bold text-indigo-800 mt-1">
                <K tex={`A = ${practiceAngle.toFixed(1)}^\\circ`} />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">余弦定理のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            <K tex="a^2 = b^2 + c^2 - 2bc\cos A" />
          </li>
          <li>A = 90° のとき cos A = 0 となり、ピタゴラスの定理に一致</li>
          <li>A が鈍角のとき 2bc cos A &lt; 0 なので a² &gt; b² + c²</li>
          <li>
            逆算: <K tex="\cos A = \dfrac{b^2 + c^2 - a^2}{2bc}" /> で角度を求められる
          </li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: "余弦定理は a² = b² + c² - 2bc cosA の形をしています" },
        { step: 2, text: "2辺とその挟角が分かれば残りの辺を求められます" },
        { step: 3, text: "3辺が分かれば cosA = (b²+c²-a²)/(2bc) で角度を逆算できます" },
      ]} />
    </div>
  );
}
