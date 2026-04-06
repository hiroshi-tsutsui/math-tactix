"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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

type TrigFunc = "sin" | "cos" | "tan";
type InequalityOp = ">=" | "<=" | ">" | "<";

interface InequalityProblem {
  func: TrigFunc;
  op: InequalityOp;
  kTex: string;
  kValue: number;
  /** Solution intervals as [start, end] in radians within [0, 2pi) */
  intervals: [number, number][];
  solutionTex: string;
  explanation: string;
}

const PI = Math.PI;

const PROBLEMS: InequalityProblem[] = [
  {
    func: "sin",
    op: ">=",
    kTex: "\\dfrac{1}{2}",
    kValue: 0.5,
    intervals: [[PI / 6, 5 * PI / 6]],
    solutionTex: "\\frac{\\pi}{6} \\leq \\theta \\leq \\frac{5\\pi}{6}",
    explanation:
      "sin θ = 1/2 の解は θ = π/6, 5π/6。sin θ は π/6 から 5π/6 の間で 1/2 以上になる。",
  },
  {
    func: "sin",
    op: ">",
    kTex: "\\dfrac{\\sqrt{3}}{2}",
    kValue: Math.sqrt(3) / 2,
    intervals: [[PI / 3, 2 * PI / 3]],
    solutionTex: "\\frac{\\pi}{3} < \\theta < \\frac{2\\pi}{3}",
    explanation:
      "sin θ = √3/2 の解は θ = π/3, 2π/3。厳密不等号なので端点は含まない。",
  },
  {
    func: "cos",
    op: "<=",
    kTex: "\\dfrac{1}{2}",
    kValue: 0.5,
    intervals: [[PI / 3, 5 * PI / 3]],
    solutionTex: "\\frac{\\pi}{3} \\leq \\theta \\leq \\frac{5\\pi}{3}",
    explanation:
      "cos θ = 1/2 の解は θ = π/3, 5π/3。cos θ はこの区間で 1/2 以下になる。",
  },
  {
    func: "cos",
    op: "<",
    kTex: "-\\dfrac{\\sqrt{2}}{2}",
    kValue: -Math.sqrt(2) / 2,
    intervals: [[3 * PI / 4, 5 * PI / 4]],
    solutionTex: "\\frac{3\\pi}{4} < \\theta < \\frac{5\\pi}{4}",
    explanation:
      "cos θ = -√2/2 の解は θ = 3π/4, 5π/4。この間で cos θ < -√2/2 になる。",
  },
  {
    func: "tan",
    op: ">",
    kTex: "1",
    kValue: 1,
    intervals: [
      [PI / 4, PI / 2],
      [PI + PI / 4, 3 * PI / 2],
    ],
    solutionTex:
      "\\frac{\\pi}{4} < \\theta < \\frac{\\pi}{2},\\quad \\frac{5\\pi}{4} < \\theta < \\frac{3\\pi}{2}",
    explanation:
      "tan θ = 1 の解は θ = π/4, 5π/4。tan θ は π/4 < θ < π/2 と 5π/4 < θ < 3π/2 で 1 より大きい（漸近線に注意）。",
  },
  {
    func: "tan",
    op: "<=",
    kTex: "-\\sqrt{3}",
    kValue: -Math.sqrt(3),
    intervals: [
      [PI / 2, 2 * PI / 3],
      [3 * PI / 2, 5 * PI / 3],
    ],
    solutionTex:
      "\\frac{\\pi}{2} < \\theta \\leq \\frac{2\\pi}{3},\\quad \\frac{3\\pi}{2} < \\theta \\leq \\frac{5\\pi}{3}",
    explanation:
      "tan θ = -√3 の解は θ = 2π/3, 5π/3。漸近線の直後から解の端点までが解の区間。",
  },
];

const OP_LABELS: Record<InequalityOp, string> = {
  ">=": "\\geq",
  "<=": "\\leq",
  ">": ">",
  "<": "<",
};

export default function TrigInequalityViz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const problem = PROBLEMS[selectedIdx];

  const handleChange = (idx: number) => {
    setSelectedIdx(idx);
    setShowAnswer(false);
  };

  // SVG dimensions
  const W = 340;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2;
  const R = 130;

  // Build arc path for solution intervals
  const arcPaths = useMemo(() => {
    return problem.intervals.map(([start, end]) => {
      // SVG uses clockwise y-down, math uses counter-clockwise y-up
      // In SVG: angle 0 = right, going clockwise
      // We need to convert math angles to SVG angles
      const toSvgCoord = (rad: number): [number, number] => [
        cx + R * Math.cos(rad),
        cy - R * Math.sin(rad),
      ];

      const numSegments = 60;
      const step = (end - start) / numSegments;
      const points: string[] = [];
      for (let i = 0; i <= numSegments; i++) {
        const angle = start + step * i;
        const [px, py] = toSvgCoord(angle);
        points.push(`${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
      }
      return points.join(" ");
    });
  }, [problem, cx, cy, R]);

  // Boundary points
  const boundaryPoints = useMemo(() => {
    const pts: { x: number; y: number; label: string }[] = [];
    problem.intervals.forEach(([start, end]) => {
      const sx = cx + R * Math.cos(start);
      const sy = cy - R * Math.sin(start);
      const ex = cx + R * Math.cos(end);
      const ey = cy - R * Math.sin(end);
      const startLabel = radToLabel(start);
      const endLabel = radToLabel(end);
      pts.push({ x: sx, y: sy, label: startLabel });
      pts.push({ x: ex, y: ey, label: endLabel });
    });
    return pts;
  }, [problem, cx, cy, R]);

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleChange(idx)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
              selectedIdx === idx
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <K tex={`\\${p.func}\\theta ${OP_LABELS[p.op]} ${p.kTex}`} />
          </button>
        ))}
      </div>

      {/* Unit circle SVG */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px]">
          {/* Grid lines */}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />

          {/* Unit circle */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={W - 10} y={cy - 8} fontSize={11} fill="#94a3b8" textAnchor="end">x</text>
          <text x={cx + 8} y={14} fontSize={11} fill="#94a3b8">y</text>
          <text x={cx + R + 4} y={cy + 14} fontSize={10} fill="#94a3b8">1</text>
          <text x={cx - R - 4} y={cy + 14} fontSize={10} fill="#94a3b8" textAnchor="end">-1</text>
          <text x={cx + 8} y={cy - R + 4} fontSize={10} fill="#94a3b8">1</text>
          <text x={cx + 8} y={cy + R + 14} fontSize={10} fill="#94a3b8">-1</text>

          {/* Angle labels */}
          <text x={cx + R + 8} y={cy + 4} fontSize={10} fill="#64748b">0</text>
          <text x={cx + 4} y={cy - R - 6} fontSize={10} fill="#64748b">π/2</text>
          <text x={cx - R - 20} y={cy + 4} fontSize={10} fill="#64748b">π</text>
          <text x={cx + 4} y={cy + R + 18} fontSize={10} fill="#64748b">3π/2</text>

          {/* k reference line */}
          {problem.func === "sin" && (
            <line
              x1={cx - R - 10} y1={cy - problem.kValue * R}
              x2={cx + R + 10} y2={cy - problem.kValue * R}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.7}
            />
          )}
          {problem.func === "cos" && (
            <line
              x1={cx + problem.kValue * R} y1={cy - R - 10}
              x2={cx + problem.kValue * R} y2={cy + R + 10}
              stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.7}
            />
          )}

          {/* Solution arc (colored) */}
          {showAnswer && arcPaths.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="#22c55e"
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.6}
            />
          ))}

          {/* Boundary points */}
          {showAnswer && boundaryPoints.map((pt, i) => {
            const isClosed = problem.op === ">=" || problem.op === "<=";
            return (
              <g key={i}>
                <circle
                  cx={pt.x} cy={pt.y} r={5}
                  fill={isClosed ? "#22c55e" : "white"}
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <text
                  x={pt.x + (pt.x > cx ? 10 : -10)}
                  y={pt.y + (pt.y > cy ? 16 : -10)}
                  fontSize={10}
                  fontWeight="bold"
                  fill="#22c55e"
                  textAnchor={pt.x > cx ? "start" : "end"}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Problem statement */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm mb-3">問題</h4>
        <div className="text-center text-lg mb-4">
          <K
            tex={`0 \\leq \\theta < 2\\pi \\text{ のとき、} \\${problem.func}\\theta ${OP_LABELS[problem.op]} ${problem.kTex} \\text{ を解け}`}
            display
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setShowAnswer((prev) => !prev)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
              showAnswer
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {showAnswer ? "解答を隠す" : "解答を表示"}
          </button>
        </div>
      </div>

      {/* Solution */}
      {showAnswer && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800 space-y-3">
          <h4 className="font-bold text-green-700 dark:text-green-400 text-sm">解</h4>
          <div className="text-center">
            <K tex={problem.solutionTex} display />
          </div>
          <p className="text-sm text-green-600 dark:text-green-300">{problem.explanation}</p>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-2">三角不等式の解き方</h4>
        <ul className="text-sm text-indigo-600 dark:text-indigo-300 space-y-1 list-disc list-inside">
          <li>まず対応する方程式（= k）を解いて境界角を求める</li>
          <li>単位円上で、その関数値が k より大きい（小さい）範囲を特定する</li>
          <li>sin θ: y 座標が k の水平線の上（下）を見る</li>
          <li>cos θ: x 座標が k の垂直線の右（左）を見る</li>
          <li>tan θ: 漸近線（π/2, 3π/2）に注意しながら各周期で判断</li>
          <li>等号の有無（≥ vs &gt;）で端点を含むか含まないかが変わる</li>
        </ul>
      </div>
    </div>
  );
}

function radToLabel(rad: number): string {
  const known: Record<string, string> = {
    "0": "0",
    [String(PI / 6)]: "π/6",
    [String(PI / 4)]: "π/4",
    [String(PI / 3)]: "π/3",
    [String(PI / 2)]: "π/2",
    [String(2 * PI / 3)]: "2π/3",
    [String(3 * PI / 4)]: "3π/4",
    [String(5 * PI / 6)]: "5π/6",
    [String(PI)]: "π",
    [String(PI + PI / 4)]: "5π/4",
    [String(PI + PI / 3)]: "4π/3",
    [String(3 * PI / 2)]: "3π/2",
    [String(5 * PI / 3)]: "5π/3",
    [String(7 * PI / 4)]: "7π/4",
    [String(11 * PI / 6)]: "11π/6",
  };
  // Try exact match first
  for (const [key, label] of Object.entries(known)) {
    if (Math.abs(Number(key) - rad) < 0.0001) return label;
  }
  return (rad / PI).toFixed(2) + "π";
}
