"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

interface TwoSetProblem {
  type: "two";
  id: number;
  title: string;
  description: string;
  nA: number;
  nB: number;
  nAB: number;
  total: number;
  question: string;
  answerTex: string;
  explanation: string[];
}

interface ThreeSetProblem {
  type: "three";
  id: number;
  title: string;
  description: string;
  nA: number;
  nB: number;
  nC: number;
  nAB: number;
  nBC: number;
  nCA: number;
  nABC: number;
  total: number;
  question: string;
  answerTex: string;
  explanation: string[];
}

type ProblemData = TwoSetProblem | ThreeSetProblem;

const PROBLEMS: ProblemData[] = [
  {
    type: "two",
    id: 1,
    title: "2集合の包除原理（基本）",
    description: "40人のクラスで、数学が好きな人は25人、英語が好きな人は20人、両方好きな人は10人いる。",
    nA: 25,
    nB: 20,
    nAB: 10,
    total: 40,
    question: "どちらかが好きな人は何人か。また、どちらも好きでない人は何人か。",
    answerTex: "|A \\cup B| = 35,\\quad \\text{どちらも好きでない} = 5",
    explanation: [
      "|A \\cup B| = |A| + |B| - |A \\cap B|",
      "= 25 + 20 - 10 = 35 \\text{ 人}",
      "\\text{どちらも好きでない} = 40 - 35 = 5 \\text{ 人}",
    ],
  },
  {
    type: "two",
    id: 2,
    title: "2集合の包除原理（逆算）",
    description: "100人に調査したところ、スポーツをする人は60人、音楽をする人は45人、どちらもしない人は15人いた。",
    nA: 60,
    nB: 45,
    nAB: 20,
    total: 100,
    question: "両方する人は何人か。",
    answerTex: "|A \\cap B| = 20",
    explanation: [
      "どちらかをする人 = 100 - 15 = 85 \\text{ 人}",
      "|A \\cup B| = |A| + |B| - |A \\cap B|",
      "85 = 60 + 45 - |A \\cap B|",
      "|A \\cap B| = 105 - 85 = 20 \\text{ 人}",
    ],
  },
  {
    type: "three",
    id: 3,
    title: "3集合の包除原理",
    description: "50人のクラスで、数学好き30人、理科好き25人、英語好き20人。数学と理科10人、理科と英語8人、数学と英語7人、3つとも好き3人。",
    nA: 30,
    nB: 25,
    nC: 20,
    nAB: 10,
    nBC: 8,
    nCA: 7,
    nABC: 3,
    total: 50,
    question: "少なくとも1教科が好きな人は何人か。どれも好きでない人は何人か。",
    answerTex: "|A \\cup B \\cup C| = 53 \\text{ (注意: 全員が50人なので矛盾しない確認が必要)}",
    explanation: [
      "|A \\cup B \\cup C| = |A|+|B|+|C| - |A \\cap B| - |B \\cap C| - |C \\cap A| + |A \\cap B \\cap C|",
      "= 30 + 25 + 20 - 10 - 8 - 7 + 3",
      "= 75 - 25 + 3 = 53",
      "\\text{全員50人なので、少なくとも1教科好き} = \\min(53, 50) = 50 \\text{ (全員がいずれか好き)}",
      "\\text{どれも好きでない} = 50 - 50 = 0 \\text{ 人}",
    ],
  },
  {
    type: "three",
    id: 4,
    title: "3集合の包除原理（応用）",
    description: "80人にA,B,Cの3つの雑誌の購読を調査した。A:40人, B:35人, C:30人, AかつB:15人, BかつC:12人, CかつA:10人, 3誌とも:5人。",
    nA: 40,
    nB: 35,
    nC: 30,
    nAB: 15,
    nBC: 12,
    nCA: 10,
    nABC: 5,
    total: 80,
    question: "少なくとも1誌を読む人は何人か。どれも読まない人は何人か。",
    answerTex: "|A \\cup B \\cup C| = 73,\\quad \\text{どれも読まない} = 7",
    explanation: [
      "|A \\cup B \\cup C| = 40 + 35 + 30 - 15 - 12 - 10 + 5",
      "= 105 - 37 + 5 = 73 \\text{ 人}",
      "\\text{どれも読まない} = 80 - 73 = 7 \\text{ 人}",
    ],
  },
];

export default function InclusionExclusionViz() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const problem = PROBLEMS[currentProblem];
  const isThreeSet = problem.type === "three";

  // 2-set Venn diagram regions
  const twoSetRegions = useMemo(() => {
    if (problem.type !== "two") return null;
    const onlyA = problem.nA - problem.nAB;
    const onlyB = problem.nB - problem.nAB;
    const neither = problem.total - (onlyA + problem.nAB + onlyB);
    const union = onlyA + problem.nAB + onlyB;
    return { onlyA, onlyB, intersection: problem.nAB, neither, union };
  }, [problem]);

  // 3-set Venn diagram regions
  const threeSetRegions = useMemo(() => {
    if (problem.type !== "three") return null;
    const abc = problem.nABC;
    const abOnly = problem.nAB - abc;
    const bcOnly = problem.nBC - abc;
    const caOnly = problem.nCA - abc;
    const onlyA = problem.nA - abOnly - caOnly - abc;
    const onlyB = problem.nB - abOnly - bcOnly - abc;
    const onlyC = problem.nC - bcOnly - caOnly - abc;
    const union = onlyA + onlyB + onlyC + abOnly + bcOnly + caOnly + abc;
    const neither = problem.total - union;
    return { onlyA, onlyB, onlyC, abOnly, bcOnly, caOnly, abc, union, neither };
  }, [problem]);

  const W = 340;
  const H = 280;
  const cx = W / 2;
  const cy = isThreeSet ? H / 2 + 10 : H / 2;

  // Circle parameters for 2-set
  const r2 = 80;
  const d2 = 50;

  // Circle parameters for 3-set
  const r3 = 65;
  const d3 = 40;

  const getRegionColor = (region: string) => {
    if (hoveredRegion === region) return "rgba(59, 130, 246, 0.5)";
    return "rgba(59, 130, 246, 0.15)";
  };
  const getRegionTextColor = (region: string) => {
    return hoveredRegion === region ? "#1d4ed8" : "#475569";
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setCurrentProblem(i); setShowAnswer(false); setHoveredRegion(null); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              i === currentProblem ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Q{p.id} {p.type === "three" ? "(3集合)" : "(2集合)"}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="font-bold text-blue-900 mb-1 text-sm">{problem.title}</div>
        <p className="text-sm text-slate-700 mb-2">{problem.description}</p>
        <p className="text-sm font-bold text-blue-800">{problem.question}</p>
      </div>

      {/* Venn Diagram SVG */}
      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Universal set boundary */}
          <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#94a3b8" strokeWidth={2} rx={8} />
          <text x={22} y={30} fontSize={14} fontWeight="bold" fill="#64748b">U ({problem.total})</text>

          {!isThreeSet && twoSetRegions && (
            <>
              {/* Circle A */}
              <circle
                cx={cx - d2}
                cy={cy}
                r={r2}
                fill={getRegionColor("A")}
                stroke="#3b82f6"
                strokeWidth={2}
                onMouseEnter={() => setHoveredRegion("A")}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              />
              {/* Circle B */}
              <circle
                cx={cx + d2}
                cy={cy}
                r={r2}
                fill={getRegionColor("B")}
                stroke="#ef4444"
                strokeWidth={2}
                onMouseEnter={() => setHoveredRegion("B")}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              />

              {/* Labels */}
              <text x={cx - d2 - 35} y={cy - 10} fontSize={14} fontWeight="bold" fill="#3b82f6">A</text>
              <text x={cx - d2 - 35} y={cy + 10} fontSize={12} fill={getRegionTextColor("onlyA")}
                onMouseEnter={() => setHoveredRegion("onlyA")}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              >
                {twoSetRegions.onlyA}
              </text>

              <text x={cx + d2 + 20} y={cy - 10} fontSize={14} fontWeight="bold" fill="#ef4444">B</text>
              <text x={cx + d2 + 20} y={cy + 10} fontSize={12} fill={getRegionTextColor("onlyB")}
                onMouseEnter={() => setHoveredRegion("onlyB")}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              >
                {twoSetRegions.onlyB}
              </text>

              {/* Intersection label */}
              <text x={cx - 5} y={cy + 5} fontSize={14} fontWeight="bold" fill={getRegionTextColor("AB")} textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("AB")}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              >
                {twoSetRegions.intersection}
              </text>

              {/* Neither */}
              <text x={W - 50} y={H - 25} fontSize={11} fill="#64748b">
                外: {twoSetRegions.neither}
              </text>
            </>
          )}

          {isThreeSet && threeSetRegions && (
            <>
              {/* Circle A (top) */}
              <circle cx={cx} cy={cy - d3} r={r3} fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth={2} />
              {/* Circle B (bottom-left) */}
              <circle cx={cx - d3} cy={cy + d3 * 0.6} r={r3} fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth={2} />
              {/* Circle C (bottom-right) */}
              <circle cx={cx + d3} cy={cy + d3 * 0.6} r={r3} fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth={2} />

              {/* Labels */}
              <text x={cx} y={cy - d3 - r3 + 15} fontSize={13} fontWeight="bold" fill="#3b82f6" textAnchor="middle">
                A ({(problem as ThreeSetProblem).nA})
              </text>
              <text x={cx - d3 - r3 + 15} y={cy + d3 * 0.6 + r3 - 5} fontSize={13} fontWeight="bold" fill="#ef4444" textAnchor="middle">
                B ({(problem as ThreeSetProblem).nB})
              </text>
              <text x={cx + d3 + r3 - 15} y={cy + d3 * 0.6 + r3 - 5} fontSize={13} fontWeight="bold" fill="#22c55e" textAnchor="middle">
                C ({(problem as ThreeSetProblem).nC})
              </text>

              {/* Region numbers */}
              {/* Only A */}
              <text x={cx} y={cy - d3 - 15} fontSize={12} fontWeight="bold" fill="#475569" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("onlyA")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.onlyA}
              </text>
              {/* Only B */}
              <text x={cx - d3 - 20} y={cy + d3 * 0.6 + 15} fontSize={12} fontWeight="bold" fill="#475569" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("onlyB")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.onlyB}
              </text>
              {/* Only C */}
              <text x={cx + d3 + 20} y={cy + d3 * 0.6 + 15} fontSize={12} fontWeight="bold" fill="#475569" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("onlyC")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.onlyC}
              </text>
              {/* A∩B only */}
              <text x={cx - d3 / 2} y={cy - 5} fontSize={11} fontWeight="bold" fill="#8b5cf6" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("AB")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.abOnly}
              </text>
              {/* B∩C only */}
              <text x={cx} y={cy + d3 * 0.6 + 5} fontSize={11} fontWeight="bold" fill="#f59e0b" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("BC")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.bcOnly}
              </text>
              {/* C∩A only */}
              <text x={cx + d3 / 2} y={cy - 5} fontSize={11} fontWeight="bold" fill="#ec4899" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("CA")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.caOnly}
              </text>
              {/* A∩B∩C */}
              <text x={cx} y={cy + 10} fontSize={13} fontWeight="bold" fill="#dc2626" textAnchor="middle"
                onMouseEnter={() => setHoveredRegion("ABC")} onMouseLeave={() => setHoveredRegion(null)} className="cursor-pointer">
                {threeSetRegions.abc}
              </text>

              {/* Neither */}
              <text x={W - 50} y={H - 25} fontSize={11} fill="#64748b">
                外: {threeSetRegions.neither}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Hover info */}
      {hoveredRegion && (
        <div className="bg-slate-100 p-3 rounded-lg text-sm text-center font-bold text-slate-700">
          {hoveredRegion === "A" && `集合A全体: ${problem.nA}人`}
          {hoveredRegion === "B" && `集合B全体: ${problem.type === "two" ? (problem as TwoSetProblem).nB : (problem as ThreeSetProblem).nB}人`}
          {hoveredRegion === "onlyA" && `Aのみ: ${problem.type === "two" ? twoSetRegions?.onlyA : threeSetRegions?.onlyA}人`}
          {hoveredRegion === "onlyB" && `Bのみ: ${problem.type === "two" ? twoSetRegions?.onlyB : threeSetRegions?.onlyB}人`}
          {hoveredRegion === "onlyC" && `Cのみ: ${threeSetRegions?.onlyC}人`}
          {hoveredRegion === "AB" && `A∩B${isThreeSet ? "のみ" : ""}: ${problem.type === "two" ? twoSetRegions?.intersection : threeSetRegions?.abOnly}人`}
          {hoveredRegion === "BC" && `B∩Cのみ: ${threeSetRegions?.bcOnly}人`}
          {hoveredRegion === "CA" && `C∩Aのみ: ${threeSetRegions?.caOnly}人`}
          {hoveredRegion === "ABC" && `A∩B∩C: ${threeSetRegions?.abc}人`}
        </div>
      )}

      {/* Formula display */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-2">
        <div className="text-xs font-bold text-slate-400 mb-2">包除原理</div>
        {!isThreeSet ? (
          <K tex="|A \cup B| = |A| + |B| - |A \cap B|" display />
        ) : (
          <K tex="|A \cup B \cup C| = |A|+|B|+|C| - |A \cap B| - |B \cap C| - |C \cap A| + |A \cap B \cap C|" display />
        )}
      </div>

      {/* Computed values */}
      <div className="grid grid-cols-2 gap-2">
        {!isThreeSet && twoSetRegions && (
          <>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-blue-500 font-bold">|A|</div>
              <div className="font-bold text-blue-700">{problem.nA}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
              <div className="text-xs text-red-500 font-bold">|B|</div>
              <div className="font-bold text-red-700">{(problem as TwoSetProblem).nB}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
              <div className="text-xs text-purple-500 font-bold"><K tex="|A \cap B|" /></div>
              <div className="font-bold text-purple-700">{(problem as TwoSetProblem).nAB}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <div className="text-xs text-green-500 font-bold"><K tex="|A \cup B|" /></div>
              <div className="font-bold text-green-700">{twoSetRegions.union}</div>
            </div>
          </>
        )}
        {isThreeSet && threeSetRegions && (
          <>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center col-span-2">
              <div className="text-xs text-green-500 font-bold"><K tex="|A \cup B \cup C|" /></div>
              <div className="font-bold text-green-700">{threeSetRegions.union}</div>
            </div>
          </>
        )}
      </div>

      {/* Answer */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {showAnswer ? "解説を隠す" : "解説を見る"}
      </button>

      {showAnswer && (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-2">
          <div className="font-bold text-yellow-800 text-sm mb-2">解答</div>
          <div className="text-center mb-3">
            <K tex={problem.answerTex} display />
          </div>
          {problem.explanation.map((step, i) => (
            <div key={i} className="text-sm">
              <K tex={step} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
