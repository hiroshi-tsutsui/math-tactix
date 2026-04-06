"use client";

import React, { useState, useEffect, useRef } from "react";
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

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  given: string;
  steps: { label: string; math: string }[];
  answer: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "問題1: 対辺を求める",
    description: "三角形ABCにおいて、a = 5, A = 30°, B = 60° のとき、辺 b の長さを求めよ。",
    given: "a = 5,\\; A = 30°,\\; B = 60°",
    steps: [
      {
        label: "Step 1: 正弦定理に代入",
        math: "\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} \\implies \\dfrac{5}{\\sin 30°} = \\dfrac{b}{\\sin 60°}",
      },
      {
        label: "Step 2: 各値を代入して計算",
        math: "\\dfrac{5}{\\frac{1}{2}} = \\dfrac{b}{\\frac{\\sqrt{3}}{2}} \\implies 10 = \\dfrac{2b}{\\sqrt{3}}",
      },
      {
        label: "Step 3: b を求める",
        math: "b = 10 \\times \\dfrac{\\sqrt{3}}{2} = 5\\sqrt{3}",
      },
    ],
    answer: "b = 5\\sqrt{3} \\approx 8.66",
  },
  {
    id: 2,
    title: "問題2: 外接円の半径 R を求める",
    description: "三角形ABCにおいて、A = 45°, B = 60°, C = 75°, a = 6 のとき、外接円の半径 R を求めよ。",
    given: "A = 45°,\\; B = 60°,\\; C = 75°,\\; a = 6",
    steps: [
      {
        label: "Step 1: 正弦定理 a/sinA = 2R に代入",
        math: "\\dfrac{a}{\\sin A} = 2R \\implies \\dfrac{6}{\\sin 45°} = 2R",
      },
      {
        label: "Step 2: sin 45° を代入して計算",
        math: "\\dfrac{6}{\\frac{\\sqrt{2}}{2}} = 2R \\implies \\dfrac{12}{\\sqrt{2}} = 2R",
      },
      {
        label: "Step 3: R を求める",
        math: "2R = 6\\sqrt{2} \\implies R = 3\\sqrt{2} \\approx 4.24",
      },
    ],
    answer: "R = 3\\sqrt{2} \\approx 4.24",
  },
  {
    id: 3,
    title: "問題3: 残りの辺と面積を求める",
    description: "三角形ABCにおいて、A = 30°, B = 105°, c = 4 のとき、辺 a と三角形の面積 S を求めよ。",
    given: "A = 30°,\\; B = 105°,\\; c = 4",
    steps: [
      {
        label: "Step 1: C を求める",
        math: "C = 180° - 30° - 105° = 45°",
      },
      {
        label: "Step 2: 正弦定理で a を求める",
        math: "\\dfrac{a}{\\sin 30°} = \\dfrac{4}{\\sin 45°} \\implies a = \\dfrac{4 \\times \\sin 30°}{\\sin 45°} = \\dfrac{4 \\times \\frac{1}{2}}{\\frac{\\sqrt{2}}{2}} = \\dfrac{2}{\\frac{\\sqrt{2}}{2}} = 2\\sqrt{2}",
      },
      {
        label: "Step 3: 面積 S を求める",
        math: "S = \\dfrac{1}{2} \\cdot a \\cdot c \\cdot \\sin B = \\dfrac{1}{2} \\cdot 2\\sqrt{2} \\cdot 4 \\cdot \\sin 105°",
      },
      {
        label: "Step 4: sin 105° を計算",
        math: "\\sin 105° = \\sin(60° + 45°) = \\dfrac{\\sqrt{6}+\\sqrt{2}}{4}",
      },
      {
        label: "Step 5: 面積を計算",
        math: "S = 4\\sqrt{2} \\cdot \\dfrac{\\sqrt{6}+\\sqrt{2}}{4} = \\sqrt{2}(\\sqrt{6}+\\sqrt{2}) = \\sqrt{12}+2 = 2\\sqrt{3}+2",
      },
    ],
    answer: "a = 2\\sqrt{2},\\; S = 2\\sqrt{3}+2 \\approx 5.46",
  },
];

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  angleA: number,
  angleB: number,
  highlightSide: "a" | "b" | "c" | null
) {
  const cx = W / 2;
  const cy = H / 2;
  const R = 100;
  const angleC = 180 - angleA - angleB;

  ctx.clearRect(0, 0, W, H);

  // Draw circumscribed circle
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Place vertices on circumscribed circle
  const startAngle = -Math.PI / 2;
  const cAng = startAngle;
  const aAng = cAng + 2 * toRad(angleC);
  const bAng = cAng - 2 * toRad(angleB);

  const Ax = cx + R * Math.cos(aAng);
  const Ay = cy + R * Math.sin(aAng);
  const Bx = cx + R * Math.cos(bAng);
  const By = cy + R * Math.sin(bAng);
  const Cx = cx + R * Math.cos(cAng);
  const Cy = cy + R * Math.sin(cAng);

  // Fill triangle
  ctx.beginPath();
  ctx.moveTo(Ax, Ay);
  ctx.lineTo(Bx, By);
  ctx.lineTo(Cx, Cy);
  ctx.closePath();
  ctx.fillStyle = "rgba(59, 130, 246, 0.05)";
  ctx.fill();

  // Draw sides
  const sides: { from: [number, number]; to: [number, number]; color: string; highlightColor: string; label: string; key: "a" | "b" | "c" }[] = [
    { from: [Bx, By], to: [Cx, Cy], color: "#94a3b8", highlightColor: "#ef4444", label: "a", key: "a" },
    { from: [Ax, Ay], to: [Cx, Cy], color: "#94a3b8", highlightColor: "#3b82f6", label: "b", key: "b" },
    { from: [Ax, Ay], to: [Bx, By], color: "#94a3b8", highlightColor: "#22c55e", label: "c", key: "c" },
  ];

  sides.forEach(({ from, to, color, highlightColor, label, key }) => {
    const isHighlight = highlightSide === key;
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.strokeStyle = isHighlight ? highlightColor : color;
    ctx.lineWidth = isHighlight ? 4 : 2;
    ctx.stroke();

    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ox = mx + (dx / dist) * 16;
    const oy = my + (dy / dist) * 16;

    ctx.fillStyle = isHighlight ? highlightColor : color;
    ctx.font = `${isHighlight ? "bold " : ""}14px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, ox, oy);
  });

  // Draw vertex labels
  const vertices = [
    { x: Ax, y: Ay, label: "A", color: "#ef4444" },
    { x: Bx, y: By, label: "B", color: "#3b82f6" },
    { x: Cx, y: Cy, label: "C", color: "#22c55e" },
  ];

  vertices.forEach(({ x, y, label, color }) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const lx = x + (dx / dist) * 18;
    const ly = y + (dy / dist) * 18;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, lx, ly);
  });
}

export default function SineLawApplicationViz() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const problem = PROBLEMS[currentProblem];

  // Draw triangle for the current problem
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const configs: { angleA: number; angleB: number; highlight: "a" | "b" | "c" }[] = [
      { angleA: 30, angleB: 60, highlight: "b" },
      { angleA: 45, angleB: 60, highlight: "a" },
      { angleA: 30, angleB: 105, highlight: "a" },
    ];

    const cfg = configs[currentProblem];
    drawTriangle(ctx, canvas.width, canvas.height, cfg.angleA, cfg.angleB, cfg.highlight);
  }, [currentProblem]);

  const handleNextStep = () => {
    if (revealedSteps < problem.steps.length) {
      setRevealedSteps((prev) => prev + 1);
    }
  };

  const handleProblemChange = (index: number) => {
    setCurrentProblem(index);
    setRevealedSteps(0);
  };

  return (
    <div className="space-y-6">
      {/* Differentiation from Level 9 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-2">Level 9 との違い</h4>
        <p className="text-sm text-amber-600 dark:text-amber-300">
          Level 9 では正弦定理の意味（a/sinA = b/sinB = c/sinC = 2R）をインタラクティブに確認しました。
          Level 14 では、実際の計算問題で正弦定理を使う練習をします。
        </p>
      </div>

      {/* Formula highlight */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800 text-center">
        <K tex="\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C} = 2R" display />
      </div>

      {/* Problem selector */}
      <div className="flex gap-2">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => handleProblemChange(i)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-colors ${
              currentProblem === i
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            問題{p.id}
          </button>
        ))}
      </div>

      {/* Triangle diagram */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={260}
          className="w-full max-w-[300px]"
        />
      </div>

      {/* Problem description */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-base mb-3">{problem.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{problem.description}</p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
          <K tex={problem.given} />
        </div>
      </div>

      {/* Step-by-step solution */}
      <div className="space-y-3">
        {problem.steps.map((step, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm transition-all duration-300 ${
              i < revealedSteps
                ? "border-blue-200 dark:border-blue-800 opacity-100"
                : "border-slate-200 dark:border-slate-700 opacity-30 pointer-events-none"
            }`}
          >
            <div className="text-xs font-bold text-blue-500 mb-2">{step.label}</div>
            {i < revealedSteps && (
              <div className="overflow-x-auto">
                <K tex={step.math} display />
              </div>
            )}
          </div>
        ))}

        {/* Reveal button */}
        {revealedSteps < problem.steps.length ? (
          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
          >
            次のステップを表示 ({revealedSteps + 1} / {problem.steps.length})
          </button>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
            <div className="text-xs font-bold text-green-500 mb-2">解答</div>
            <div className="text-center">
              <K tex={problem.answer} display />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
