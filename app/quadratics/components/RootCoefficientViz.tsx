"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import HintButton from "../../components/HintButton";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

interface ProblemData {
  id: number;
  title: string;
  question: string;
  questionTex: string;
  answer: string;
  answerTex: string;
  steps: string[];
}

const PROBLEMS: ProblemData[] = [
  {
    id: 1,
    title: "解と係数の関係（基本）",
    question: "二次方程式 x^2 - 5x + 6 = 0 の2つの解を α, β とするとき、α+β と αβ の値を求めよ。",
    questionTex: "x^2 - 5x + 6 = 0",
    answer: "α+β = 5, αβ = 6",
    answerTex: "\\alpha + \\beta = 5,\\quad \\alpha\\beta = 6",
    steps: [
      "ax^2 + bx + c = 0 の解と係数の関係: \\alpha + \\beta = -\\frac{b}{a},\\quad \\alpha\\beta = \\frac{c}{a}",
      "a=1, b=-5, c=6 より",
      "\\alpha + \\beta = -\\frac{-5}{1} = 5",
      "\\alpha\\beta = \\frac{6}{1} = 6",
      "実際に解くと x=2, 3 で確認: 2+3=5, 2 \\times 3=6 \\checkmark",
    ],
  },
  {
    id: 2,
    title: "和と積から方程式を逆算",
    question: "2つの解の和が 7、積が 10 である二次方程式を求めよ。",
    questionTex: "\\alpha + \\beta = 7,\\quad \\alpha\\beta = 10",
    answer: "x^2 - 7x + 10 = 0",
    answerTex: "x^2 - 7x + 10 = 0",
    steps: [
      "解の和 = \\alpha+\\beta = -\\frac{b}{a} より b = -a(\\alpha+\\beta)",
      "解の積 = \\alpha\\beta = \\frac{c}{a} より c = a \\cdot \\alpha\\beta",
      "a=1 とすると b = -7,\\, c = 10",
      "よって x^2 - 7x + 10 = 0",
      "検算: (x-2)(x-5)=0 → 和 7, 積 10 \\checkmark",
    ],
  },
  {
    id: 3,
    title: "対称式 α²+β² の計算",
    question: "二次方程式 x^2 - 3x + 1 = 0 の2つの解を α, β とするとき、α²+β² の値を求めよ。",
    questionTex: "x^2 - 3x + 1 = 0 \\quad\\Rightarrow\\quad \\alpha^2 + \\beta^2 = ?",
    answer: "α²+β² = 7",
    answerTex: "\\alpha^2 + \\beta^2 = 7",
    steps: [
      "\\alpha + \\beta = 3,\\quad \\alpha\\beta = 1",
      "\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta",
      "= 3^2 - 2 \\times 1 = 9 - 2 = 7",
    ],
  },
  {
    id: 4,
    title: "対称式 α³+β³ の計算",
    question: "二次方程式 x^2 - 4x + 2 = 0 の2つの解を α, β とするとき、α³+β³ の値を求めよ。",
    questionTex: "x^2 - 4x + 2 = 0 \\quad\\Rightarrow\\quad \\alpha^3 + \\beta^3 = ?",
    answer: "α³+β³ = 40",
    answerTex: "\\alpha^3 + \\beta^3 = 40",
    steps: [
      "\\alpha + \\beta = 4,\\quad \\alpha\\beta = 2",
      "\\alpha^3 + \\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta)",
      "= 4^3 - 3 \\times 2 \\times 4 = 64 - 24 = 40",
    ],
  },
  {
    id: 5,
    title: "|α-β| の計算（判別式との関連）",
    question: "二次方程式 x^2 - 6x + 7 = 0 の2つの解を α, β とするとき、|α-β| の値を求めよ。",
    questionTex: "x^2 - 6x + 7 = 0 \\quad\\Rightarrow\\quad |\\alpha - \\beta| = ?",
    answer: "|α-β| = 2√2",
    answerTex: "|\\alpha - \\beta| = 2\\sqrt{2}",
    steps: [
      "\\alpha + \\beta = 6,\\quad \\alpha\\beta = 7",
      "(\\alpha - \\beta)^2 = (\\alpha+\\beta)^2 - 4\\alpha\\beta",
      "= 6^2 - 4 \\times 7 = 36 - 28 = 8",
      "|\\alpha - \\beta| = \\sqrt{8} = 2\\sqrt{2}",
      "判別式 D = b^2 - 4ac = 36-28 = 8 と一致: |\\alpha-\\beta| = \\frac{\\sqrt{D}}{|a|}",
    ],
  },
];

export default function RootCoefficientViz() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  // Vieta's formulas
  const sum = -b / a;
  const prod = c / a;
  const disc = b * b - 4 * a * c;

  // Derived symmetric expressions
  const alpha2beta2 = sum * sum - 2 * prod;
  const alpha3beta3 = sum * sum * sum - 3 * prod * sum;
  const absDiff = disc >= 0 ? Math.sqrt(disc) / Math.abs(a) : 0;

  // Roots (for visualization)
  const roots = useMemo(() => {
    if (disc < 0) return [];
    if (Math.abs(disc) < 1e-9) return [{ x: -b / (2 * a), y: 0 }];
    const sqrtD = Math.sqrt(disc);
    return [
      { x: (-b - sqrtD) / (2 * a), y: 0 },
      { x: (-b + sqrtD) / (2 * a), y: 0 },
    ];
  }, [a, b, c, disc]);

  // SVG graph parameters
  const W = 360;
  const H = 260;
  const pad = 40;
  const gW = W - 2 * pad;
  const gH = H - 2 * pad;

  // Dynamic range
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const xMin = vertexX - 6;
  const xMax = vertexX + 6;
  const yMin = Math.min(vertexY - 2, -2);
  const yMax = Math.max(vertexY + 8, 8);

  const toSx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * gW;
  const toSy = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * gH;

  // Parabola path
  const parabolaPath = useMemo(() => {
    const pts: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = a * x * x + b * x + c;
      if (y >= yMin - 5 && y <= yMax + 5) {
        pts.push(`${toSx(x).toFixed(2)},${toSy(y).toFixed(2)}`);
      }
    }
    return pts.length > 0 ? `M${pts.join("L")}` : "";
  }, [a, b, c, xMin, xMax, yMin, yMax]);

  const problem = PROBLEMS[currentProblem];

  const fmtNum = (n: number) => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  };

  return (
    <div className="space-y-4 w-full">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap mb-2">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setCurrentProblem(i); setShowSteps(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              i === currentProblem ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Q{p.id}
          </button>
        ))}
      </div>

      {/* Problem display */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="font-bold text-blue-900 mb-2 text-sm">{problem.title}</div>
        <p className="text-sm text-slate-700 mb-2">{problem.question}</p>
        <div className="text-center">
          <K tex={problem.questionTex} display />
        </div>
      </div>

      {/* Interactive SVG Graph */}
      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Grid */}
          {Array.from({ length: 13 }, (_, i) => xMin + i).map((gx) => (
            <line key={`gx${gx}`} x1={toSx(gx)} y1={pad} x2={toSx(gx)} y2={H - pad} stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {Array.from({ length: Math.ceil(yMax - yMin) + 1 }, (_, i) => Math.floor(yMin) + i).map((gy) => (
            <line key={`gy${gy}`} x1={pad} y1={toSy(gy)} x2={W - pad} y2={toSy(gy)} stroke="#f1f5f9" strokeWidth={1} />
          ))}

          {/* Axes */}
          <line x1={pad} y1={toSy(0)} x2={W - pad} y2={toSy(0)} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={toSx(0)} y1={pad} x2={toSx(0)} y2={H - pad} stroke="#94a3b8" strokeWidth={1.5} />

          {/* Parabola */}
          <path d={parabolaPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />

          {/* Vertex */}
          <circle cx={toSx(vertexX)} cy={toSy(vertexY)} r={4} fill="#8b5cf6" />

          {/* Axis of symmetry */}
          <line x1={toSx(vertexX)} y1={pad} x2={toSx(vertexX)} y2={H - pad} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />

          {/* Roots on x-axis */}
          {roots.map((r, i) => (
            <g key={`root${i}`}>
              <circle cx={toSx(r.x)} cy={toSy(0)} r={6} fill="#ef4444" />
              <text x={toSx(r.x)} y={toSy(0) + 18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#ef4444">
                {i === 0 ? "α" : "β"}
              </text>
              <text x={toSx(r.x)} y={toSy(0) + 30} textAnchor="middle" fontSize={9} fill="#64748b">
                {fmtNum(r.x)}
              </text>
            </g>
          ))}

          {/* Sum bracket */}
          {roots.length === 2 && (
            <>
              <line x1={toSx(roots[0].x)} y1={toSy(0) - 14} x2={toSx(roots[1].x)} y2={toSy(0) - 14} stroke="#16a34a" strokeWidth={2} markerStart="url(#arrowL)" markerEnd="url(#arrowR)" />
              <text x={toSx((roots[0].x + roots[1].x) / 2)} y={toSy(0) - 20} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#16a34a">
                α+β={fmtNum(sum)}
              </text>
            </>
          )}

          {disc < 0 && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={14} fill="#ef4444" fontWeight="bold">
              D &lt; 0 (虚数解)
            </text>
          )}

          <defs>
            <marker id="arrowL" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M6,0 L0,3 L6,6" fill="none" stroke="#16a34a" strokeWidth={1} />
            </marker>
            <marker id="arrowR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#16a34a" strokeWidth={1} />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Sliders */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">係数を変えて確認</div>
        {[
          { label: "a", value: a, set: setA, min: -3, max: 3, step: 0.5 },
          { label: "b", value: b, set: setB, min: -10, max: 10, step: 1 },
          { label: "c", value: c, set: setC, min: -10, max: 10, step: 1 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm w-8 text-right">{label}=</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer"
            />
            <span className="font-mono text-sm w-10 text-right">{value}</span>
          </div>
        ))}
        {a === 0 && (
          <div className="text-xs text-red-500 font-bold">a=0 は二次方程式ではありません</div>
        )}
      </div>

      {/* Real-time Vieta's formulas */}
      {a !== 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">解と係数の関係</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <div className="text-xs text-green-600 font-bold mb-1">解の和</div>
              <K tex={`\\alpha+\\beta = -\\frac{${b}}{${a}} = ${fmtNum(sum)}`} />
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
              <div className="text-xs text-amber-600 font-bold mb-1">解の積</div>
              <K tex={`\\alpha\\beta = \\frac{${c}}{${a}} = ${fmtNum(prod)}`} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
              <div className="text-[10px] text-purple-500 font-bold">α²+β²</div>
              <div className="text-sm font-bold text-purple-700">{fmtNum(alpha2beta2)}</div>
            </div>
            <div className="bg-pink-50 p-2 rounded-lg border border-pink-200">
              <div className="text-[10px] text-pink-500 font-bold">α³+β³</div>
              <div className="text-sm font-bold text-pink-700">{fmtNum(alpha3beta3)}</div>
            </div>
            <div className="bg-sky-50 p-2 rounded-lg border border-sky-200">
              <div className="text-[10px] text-sky-500 font-bold">|α-β|</div>
              <div className="text-sm font-bold text-sky-700">
                {disc >= 0 ? fmtNum(absDiff) : "虚数"}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 space-y-1">
            <K tex={`\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = ${fmtNum(sum)}^2 - 2 \\times ${fmtNum(prod)} = ${fmtNum(alpha2beta2)}`} />
            <br />
            <K tex={`\\alpha^3+\\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta) = ${fmtNum(alpha3beta3)}`} />
            <br />
            <K tex={`|\\alpha-\\beta| = \\sqrt{(\\alpha+\\beta)^2-4\\alpha\\beta} = \\sqrt{${fmtNum(disc >= 0 ? disc : 0)}} ${disc >= 0 ? "= " + fmtNum(absDiff) : ""}`} />
          </div>
        </div>
      )}

      {/* Hint */}
      <HintButton hints={[
        { step: 1, text: "解と係数の関係: ax² + bx + c = 0 の2解 α, β について α+β = -b/a, αβ = c/a が成り立ちます。" },
        { step: 2, text: "対称式は基本対称式（和と積）で表せます。例: α²+β² = (α+β)² - 2αβ" },
        { step: 3, text: "α³+β³ = (α+β)³ - 3αβ(α+β) と因数分解できます。(α+β) と αβ に代入しましょう。" },
        { step: 4, text: "|α-β| = √((α+β)² - 4αβ) = √D/|a| と判別式に関連します。" },
      ]} />

      {/* Solution steps */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {showSteps ? "解説を隠す" : "解説を見る"}
        </button>
      </div>

      {showSteps && (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3">
          <div className="font-bold text-yellow-800 text-sm mb-2">解答</div>
          <div className="text-center mb-3">
            <K tex={problem.answerTex} display />
          </div>
          <div className="space-y-2">
            {problem.steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start text-sm">
                <span className="text-yellow-600 font-bold shrink-0">{i + 1}.</span>
                <K tex={step} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
