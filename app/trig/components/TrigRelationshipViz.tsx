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

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

interface TrigRelationshipProblem {
  label: string;
  /** Condition given */
  conditionTex: string;
  /** Angle in radians for unit circle display */
  thetaRad: number;
  /** sin, cos, tan values as exact tex */
  sinTex: string;
  cosTex: string;
  tanTex: string;
  /** sin, cos, tan numerical values */
  sinVal: number;
  cosVal: number;
  tanVal: number;
  /** Expression to evaluate */
  expressionTex: string;
  /** Answer */
  answerTex: string;
  /** Step-by-step derivation */
  steps: { description: string; mathTex: string }[];
}

const PROBLEMS: TrigRelationshipProblem[] = [
  {
    label: "問1",
    conditionTex: "\\sin\\theta = \\dfrac{3}{5},\\quad 0 < \\theta < \\dfrac{\\pi}{2}",
    thetaRad: Math.asin(3 / 5),
    sinTex: "\\dfrac{3}{5}",
    cosTex: "\\dfrac{4}{5}",
    tanTex: "\\dfrac{3}{4}",
    sinVal: 3 / 5,
    cosVal: 4 / 5,
    tanVal: 3 / 4,
    expressionTex: "\\cos\\theta,\\; \\tan\\theta",
    answerTex: "\\cos\\theta = \\dfrac{4}{5},\\quad \\tan\\theta = \\dfrac{3}{4}",
    steps: [
      {
        description: "sin²θ + cos²θ = 1 に代入",
        mathTex: "\\left(\\dfrac{3}{5}\\right)^2 + \\cos^2\\theta = 1",
      },
      {
        description: "cos²θ を求める",
        mathTex: "\\cos^2\\theta = 1 - \\dfrac{9}{25} = \\dfrac{16}{25}",
      },
      {
        description: "0 < θ < π/2 より cosθ > 0",
        mathTex: "\\cos\\theta = \\dfrac{4}{5}",
      },
      {
        description: "tanθ = sinθ / cosθ",
        mathTex: "\\tan\\theta = \\dfrac{3/5}{4/5} = \\dfrac{3}{4}",
      },
    ],
  },
  {
    label: "問2",
    conditionTex: "\\cos\\theta = -\\dfrac{5}{13},\\quad \\dfrac{\\pi}{2} < \\theta < \\pi",
    thetaRad: Math.acos(-5 / 13),
    sinTex: "\\dfrac{12}{13}",
    cosTex: "-\\dfrac{5}{13}",
    tanTex: "-\\dfrac{12}{5}",
    sinVal: 12 / 13,
    cosVal: -5 / 13,
    tanVal: -12 / 5,
    expressionTex: "\\sin\\theta,\\; \\tan\\theta",
    answerTex: "\\sin\\theta = \\dfrac{12}{13},\\quad \\tan\\theta = -\\dfrac{12}{5}",
    steps: [
      {
        description: "sin²θ + cos²θ = 1 に代入",
        mathTex: "\\sin^2\\theta + \\left(-\\dfrac{5}{13}\\right)^2 = 1",
      },
      {
        description: "sin²θ を求める",
        mathTex: "\\sin^2\\theta = 1 - \\dfrac{25}{169} = \\dfrac{144}{169}",
      },
      {
        description: "π/2 < θ < π より sinθ > 0",
        mathTex: "\\sin\\theta = \\dfrac{12}{13}",
      },
      {
        description: "tanθ = sinθ / cosθ",
        mathTex: "\\tan\\theta = \\dfrac{12/13}{-5/13} = -\\dfrac{12}{5}",
      },
    ],
  },
  {
    label: "問3",
    conditionTex: "\\tan\\theta = 2,\\quad 0 < \\theta < \\dfrac{\\pi}{2}",
    thetaRad: Math.atan(2),
    sinTex: "\\dfrac{2\\sqrt{5}}{5}",
    cosTex: "\\dfrac{\\sqrt{5}}{5}",
    tanTex: "2",
    sinVal: 2 / Math.sqrt(5),
    cosVal: 1 / Math.sqrt(5),
    tanVal: 2,
    expressionTex: "\\sin\\theta + \\cos\\theta",
    answerTex: "\\sin\\theta + \\cos\\theta = \\dfrac{3\\sqrt{5}}{5}",
    steps: [
      {
        description: "1 + tan²θ = 1/cos²θ を使う",
        mathTex: "1 + 4 = \\dfrac{1}{\\cos^2\\theta} \\quad \\Rightarrow \\quad \\cos^2\\theta = \\dfrac{1}{5}",
      },
      {
        description: "0 < θ < π/2 より cosθ > 0",
        mathTex: "\\cos\\theta = \\dfrac{1}{\\sqrt{5}} = \\dfrac{\\sqrt{5}}{5}",
      },
      {
        description: "sinθ = tanθ × cosθ",
        mathTex: "\\sin\\theta = 2 \\times \\dfrac{\\sqrt{5}}{5} = \\dfrac{2\\sqrt{5}}{5}",
      },
      {
        description: "sinθ + cosθ を計算",
        mathTex: "\\sin\\theta + \\cos\\theta = \\dfrac{2\\sqrt{5}}{5} + \\dfrac{\\sqrt{5}}{5} = \\dfrac{3\\sqrt{5}}{5}",
      },
    ],
  },
  {
    label: "問4",
    conditionTex: "\\sin\\theta = \\dfrac{\\sqrt{3}}{2},\\quad 0 < \\theta < \\dfrac{\\pi}{2}",
    thetaRad: Math.PI / 3,
    sinTex: "\\dfrac{\\sqrt{3}}{2}",
    cosTex: "\\dfrac{1}{2}",
    tanTex: "\\sqrt{3}",
    sinVal: Math.sqrt(3) / 2,
    cosVal: 1 / 2,
    tanVal: Math.sqrt(3),
    expressionTex: "\\sin^2\\theta + \\cos^2\\theta \\text{ の検証}",
    answerTex: "\\sin^2\\theta + \\cos^2\\theta = \\dfrac{3}{4} + \\dfrac{1}{4} = 1",
    steps: [
      {
        description: "sin²θ を計算",
        mathTex: "\\sin^2\\theta = \\left(\\dfrac{\\sqrt{3}}{2}\\right)^2 = \\dfrac{3}{4}",
      },
      {
        description: "cos²θ を sin²θ + cos²θ = 1 から",
        mathTex: "\\cos^2\\theta = 1 - \\dfrac{3}{4} = \\dfrac{1}{4} \\quad \\Rightarrow \\quad \\cos\\theta = \\dfrac{1}{2}",
      },
      {
        description: "sin²θ + cos²θ を確認",
        mathTex: "\\dfrac{3}{4} + \\dfrac{1}{4} = 1 \\quad \\checkmark",
      },
      {
        description: "tanθ = sinθ / cosθ",
        mathTex: "\\tan\\theta = \\dfrac{\\sqrt{3}/2}{1/2} = \\sqrt{3}",
      },
    ],
  },
  {
    label: "問5",
    conditionTex: "\\tan\\theta = -1,\\quad \\dfrac{\\pi}{2} < \\theta < \\pi",
    thetaRad: (3 * Math.PI) / 4,
    sinTex: "\\dfrac{\\sqrt{2}}{2}",
    cosTex: "-\\dfrac{\\sqrt{2}}{2}",
    tanTex: "-1",
    sinVal: Math.sqrt(2) / 2,
    cosVal: -Math.sqrt(2) / 2,
    tanVal: -1,
    expressionTex: "\\sin\\theta - \\cos\\theta",
    answerTex: "\\sin\\theta - \\cos\\theta = \\sqrt{2}",
    steps: [
      {
        description: "1 + tan²θ = 1/cos²θ を使う",
        mathTex: "1 + 1 = \\dfrac{1}{\\cos^2\\theta} \\quad \\Rightarrow \\quad \\cos^2\\theta = \\dfrac{1}{2}",
      },
      {
        description: "π/2 < θ < π より cosθ < 0",
        mathTex: "\\cos\\theta = -\\dfrac{1}{\\sqrt{2}} = -\\dfrac{\\sqrt{2}}{2}",
      },
      {
        description: "sinθ = tanθ × cosθ",
        mathTex: "\\sin\\theta = (-1) \\times \\left(-\\dfrac{\\sqrt{2}}{2}\\right) = \\dfrac{\\sqrt{2}}{2}",
      },
      {
        description: "sinθ - cosθ を計算",
        mathTex: "\\dfrac{\\sqrt{2}}{2} - \\left(-\\dfrac{\\sqrt{2}}{2}\\right) = \\sqrt{2}",
      },
    ],
  },
];

export default function TrigRelationshipViz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const problem = PROBLEMS[selectedIdx];

  const handleChange = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentStep(0);
    setShowAnswer(false);
  };

  // SVG dimensions
  const W = 340;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2;
  const R = 120;

  // Point on unit circle
  const px = cx + R * Math.cos(problem.thetaRad);
  const py = cy - R * Math.sin(problem.thetaRad);

  // sin line (vertical from point to x-axis)
  const sinLineY1 = py;
  const sinLineY2 = cy;

  // cos line (horizontal from origin to projection on x-axis)
  const cosLineX1 = cx;
  const cosLineX2 = px;

  // tan line (from origin along radius to the tangent line at x=R)
  const tanLineEndY = problem.cosVal !== 0 ? cy - R * (problem.sinVal / problem.cosVal) : cy;
  const showTanLine = Math.abs(problem.cosVal) > 0.01;

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleChange(idx)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
              selectedIdx === idx
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Problem statement */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm mb-3">条件</h4>
        <div className="text-center mb-3">
          <KBlock tex={problem.conditionTex} />
        </div>
        <h4 className="font-bold text-sm mb-2">求めるもの</h4>
        <div className="text-center">
          <KBlock tex={problem.expressionTex} />
        </div>
      </div>

      {/* Unit circle SVG */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px]">
          {/* Grid */}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />

          {/* Unit circle */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={W - 10} y={cy - 8} fontSize={11} fill="#94a3b8" textAnchor="end">x</text>
          <text x={cx + 8} y={14} fontSize={11} fill="#94a3b8">y</text>
          <text x={cx + R + 4} y={cy + 14} fontSize={10} fill="#94a3b8">1</text>
          <text x={cx - R - 4} y={cy + 14} fontSize={10} fill="#94a3b8" textAnchor="end">-1</text>

          {/* cos line (blue, horizontal) */}
          <line
            x1={cosLineX1} y1={cy}
            x2={cosLineX2} y2={cy}
            stroke="#3b82f6" strokeWidth={3} opacity={0.8}
          />
          <text
            x={(cosLineX1 + cosLineX2) / 2}
            y={cy + 18}
            fontSize={11} fill="#3b82f6" fontWeight="bold" textAnchor="middle"
          >
            cos θ
          </text>

          {/* sin line (red, vertical) */}
          <line
            x1={px} y1={sinLineY1}
            x2={px} y2={sinLineY2}
            stroke="#ef4444" strokeWidth={3} opacity={0.8}
          />
          <text
            x={px + (problem.cosVal >= 0 ? 12 : -12)}
            y={(sinLineY1 + sinLineY2) / 2}
            fontSize={11} fill="#ef4444" fontWeight="bold"
            textAnchor={problem.cosVal >= 0 ? "start" : "end"}
          >
            sin θ
          </text>

          {/* tan line (green, on tangent at x=1) */}
          {showTanLine && (
            <>
              <line
                x1={cx + R} y1={cy}
                x2={cx + R} y2={tanLineEndY}
                stroke="#22c55e" strokeWidth={3} opacity={0.7}
              />
              <text
                x={cx + R + 8}
                y={(cy + tanLineEndY) / 2}
                fontSize={11} fill="#22c55e" fontWeight="bold"
              >
                tan θ
              </text>
            </>
          )}

          {/* Radius line */}
          <line
            x1={cx} y1={cy}
            x2={px} y2={py}
            stroke="#1e293b" strokeWidth={2} opacity={0.6}
          />

          {/* Dashed projection */}
          <line
            x1={px} y1={py}
            x2={px} y2={cy}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" opacity={0.5}
          />

          {/* Point on circle */}
          <circle cx={px} cy={py} r={5} fill="#6366f1" stroke="white" strokeWidth={2} />
          <text
            x={px + (problem.cosVal >= 0 ? 10 : -10)}
            y={py - 10}
            fontSize={10} fill="#6366f1" fontWeight="bold"
            textAnchor={problem.cosVal >= 0 ? "start" : "end"}
          >
            (cos θ, sin θ)
          </text>

          {/* Angle arc */}
          {(() => {
            const arcR = 30;
            const numSeg = 20;
            const step = problem.thetaRad / numSeg;
            const pts: string[] = [];
            for (let i = 0; i <= numSeg; i++) {
              const a = step * i;
              const ax = cx + arcR * Math.cos(a);
              const ay = cy - arcR * Math.sin(a);
              pts.push(`${i === 0 ? "M" : "L"} ${ax.toFixed(2)} ${ay.toFixed(2)}`);
            }
            return <path d={pts.join(" ")} fill="none" stroke="#6366f1" strokeWidth={1.5} />;
          })()}
          <text
            x={cx + 38 * Math.cos(problem.thetaRad / 2)}
            y={cy - 38 * Math.sin(problem.thetaRad / 2)}
            fontSize={11} fill="#6366f1" fontWeight="bold"
          >
            θ
          </text>

          {/* Origin */}
          <circle cx={cx} cy={cy} r={3} fill="#1e293b" />
        </svg>
      </div>

      {/* Values display */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800 text-center">
          <div className="text-[10px] text-red-400 font-bold mb-1">sin θ</div>
          <div className="text-sm"><K tex={problem.sinTex} /></div>
          <div className="text-[10px] text-red-300 font-mono mt-1">≈ {problem.sinVal.toFixed(4)}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 text-center">
          <div className="text-[10px] text-blue-400 font-bold mb-1">cos θ</div>
          <div className="text-sm"><K tex={problem.cosTex} /></div>
          <div className="text-[10px] text-blue-300 font-mono mt-1">≈ {problem.cosVal.toFixed(4)}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800 text-center">
          <div className="text-[10px] text-green-400 font-bold mb-1">tan θ</div>
          <div className="text-sm"><K tex={problem.tanTex} /></div>
          <div className="text-[10px] text-green-300 font-mono mt-1">≈ {problem.tanVal.toFixed(4)}</div>
        </div>
      </div>

      {/* Step-by-step solution */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-sm">解法ステップ</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30"
            >
              ← 戻る
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(problem.steps.length, currentStep + 1))}
              disabled={currentStep >= problem.steps.length}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white disabled:opacity-30"
            >
              次へ →
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {problem.steps.map((step, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                i < currentStep
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                  i < currentStep ? "bg-green-500 text-white" : "bg-slate-300 dark:bg-slate-600 text-white"
                }`}>
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-medium mb-2">{step.description}</div>
                  <KBlock tex={step.mathTex} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show answer button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setShowAnswer(!showAnswer);
            if (!showAnswer) setCurrentStep(problem.steps.length);
          }}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
            showAnswer
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {showAnswer ? "解答を隠す" : "解答を表示"}
        </button>
      </div>

      {/* Answer */}
      {showAnswer && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
          <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-3">答え</h4>
          <div className="text-center">
            <KBlock tex={problem.answerTex} />
          </div>
        </div>
      )}

      {/* Key formulas */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-3">三角比の相互関係（公式）</h4>
        <div className="space-y-3">
          <div className="text-center"><KBlock tex="\\sin^2\\theta + \\cos^2\\theta = 1" /></div>
          <div className="text-center"><KBlock tex="\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}" /></div>
          <div className="text-center"><KBlock tex="1 + \\tan^2\\theta = \\dfrac{1}{\\cos^2\\theta}" /></div>
        </div>
        <ul className="text-sm text-indigo-600 dark:text-indigo-300 space-y-1 list-disc list-inside mt-3">
          <li>sinθ が与えられたら sin²θ + cos²θ = 1 で cosθ を求める</li>
          <li>tanθ が与えられたら 1 + tan²θ = 1/cos²θ で cosθ を求める</li>
          <li>象限（θ の範囲）から正負の符号を決定する</li>
        </ul>
      </div>
    </div>
  );
}
