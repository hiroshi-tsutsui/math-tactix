"use client";

import React, { useState, useEffect, useRef } from "react";
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

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

type PatternKey = "sufficient" | "necessary" | "iff" | "neither";

interface PatternData {
  label: string;
  shortLabel: string;
  description: string;
  formula: string;
  example: {
    p: string;
    q: string;
    pSet: string;
    qSet: string;
    explanation: string;
  };
}

const PATTERNS: Record<PatternKey, PatternData> = {
  sufficient: {
    label: "十分条件だが必要条件でない",
    shortLabel: "十分",
    description:
      "p ⇒ q は真だが、q ⇒ p は偽。条件 p を満たすものの集合が、条件 q を満たすものの集合に真に含まれる。",
    formula: "P \\subsetneq Q",
    example: {
      p: "x = 2",
      q: "x^2 = 4",
      pSet: "\\{2\\}",
      qSet: "\\{-2, 2\\}",
      explanation:
        "x=2 ならば x²=4 は成り立つ（十分条件）。しかし x²=4 のとき x=-2 もありうるので、x=2 とは限らない（必要条件ではない）。",
    },
  },
  necessary: {
    label: "必要条件だが十分条件でない",
    shortLabel: "必要",
    description:
      "q ⇒ p は真だが、p ⇒ q は偽。条件 q を満たすものの集合が、条件 p を満たすものの集合に真に含まれる。",
    formula: "Q \\subsetneq P",
    example: {
      p: "x^2 > 0",
      q: "x > 0",
      pSet: "\\{x \\mid x \\neq 0\\}",
      qSet: "\\{x \\mid x > 0\\}",
      explanation:
        "x>0 ならば x²>0 は成り立つ（q ⇒ p は真）。しかし x²>0 のとき x=-1 もありうるので p ⇒ q は偽。よって p は q の必要条件。",
    },
  },
  iff: {
    label: "必要十分条件（同値）",
    shortLabel: "必要十分",
    description:
      "p ⇒ q も q ⇒ p も真。条件 p を満たすものの集合と条件 q を満たすものの集合が完全に一致する。",
    formula: "P = Q",
    example: {
      p: "x^2 = 1",
      q: "|x| = 1",
      pSet: "\\{-1, 1\\}",
      qSet: "\\{-1, 1\\}",
      explanation:
        "x²=1 ⇔ x=±1 ⇔ |x|=1。どちらからどちらも導けるので必要十分条件（同値）。",
    },
  },
  neither: {
    label: "必要条件でも十分条件でもない",
    shortLabel: "どちらでもない",
    description:
      "p ⇒ q も q ⇒ p も偽。条件 p の集合と条件 q の集合がどちらにも含まれない部分をもつ。",
    formula: "P \\not\\subset Q \\text{ かつ } Q \\not\\subset P",
    example: {
      p: "x > 0",
      q: "x < 3",
      pSet: "\\{x \\mid x > 0\\}",
      qSet: "\\{x \\mid x < 3\\}",
      explanation:
        "x=5 は x>0 を満たすが x<3 を満たさない（p ⇒ q は偽）。x=-1 は x<3 を満たすが x>0 を満たさない（q ⇒ p は偽）。",
    },
  },
};

const PATTERN_KEYS: PatternKey[] = ["sufficient", "necessary", "iff", "neither"];

// SVG Venn diagram for each pattern
function VennDiagram({ pattern }: { pattern: PatternKey }) {
  const W = 360;
  const H = 240;
  const cx = W / 2;
  const cy = H / 2;

  if (pattern === "sufficient") {
    // P ⊂ Q: smaller P inside larger Q
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
        <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#cbd5e1" strokeWidth={2} rx={12} />
        <text x={25} y={30} fontSize={11} fill="#94a3b8" fontWeight="bold">U</text>
        <circle cx={cx} cy={cy} r={90} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth={2} />
        <text x={cx + 55} y={cy - 70} fontSize={14} fontWeight="bold" fill="#3b82f6">Q</text>
        <circle cx={cx - 15} cy={cy + 10} r={45} fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth={2} />
        <text x={cx - 15} y={cy + 15} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#ef4444">P</text>
        <text x={cx} y={H - 18} textAnchor="middle" fontSize={12} fill="#6d28d9" fontWeight="bold">P ⊂ Q</text>
      </svg>
    );
  }

  if (pattern === "necessary") {
    // Q ⊂ P: smaller Q inside larger P
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
        <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#cbd5e1" strokeWidth={2} rx={12} />
        <text x={25} y={30} fontSize={11} fill="#94a3b8" fontWeight="bold">U</text>
        <circle cx={cx} cy={cy} r={90} fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth={2} />
        <text x={cx + 55} y={cy - 70} fontSize={14} fontWeight="bold" fill="#ef4444">P</text>
        <circle cx={cx + 15} cy={cy + 10} r={45} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth={2} />
        <text x={cx + 15} y={cy + 15} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#3b82f6">Q</text>
        <text x={cx} y={H - 18} textAnchor="middle" fontSize={12} fill="#6d28d9" fontWeight="bold">Q ⊂ P</text>
      </svg>
    );
  }

  if (pattern === "iff") {
    // P = Q: same circle
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
        <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#cbd5e1" strokeWidth={2} rx={12} />
        <text x={25} y={30} fontSize={11} fill="#94a3b8" fontWeight="bold">U</text>
        <circle cx={cx} cy={cy} r={70} fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth={3} />
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#7c3aed">P = Q</text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize={11} fill="#6d28d9">(完全一致)</text>
        <text x={cx} y={H - 18} textAnchor="middle" fontSize={12} fill="#6d28d9" fontWeight="bold">P = Q</text>
      </svg>
    );
  }

  // neither: partial overlap
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
      <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#cbd5e1" strokeWidth={2} rx={12} />
      <text x={25} y={30} fontSize={11} fill="#94a3b8" fontWeight="bold">U</text>
      <circle cx={cx - 45} cy={cy} r={70} fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth={2} />
      <text x={cx - 80} y={cy - 55} fontSize={14} fontWeight="bold" fill="#ef4444">P</text>
      <circle cx={cx + 45} cy={cy} r={70} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth={2} />
      <text x={cx + 80} y={cy - 55} fontSize={14} fontWeight="bold" fill="#3b82f6">Q</text>
      {/* Intersection highlight */}
      <clipPath id="clipPNeither">
        <circle cx={cx - 45} cy={cy} r={70} />
      </clipPath>
      <circle cx={cx + 45} cy={cy} r={70} fill="rgba(139, 92, 246, 0.2)" clipPath="url(#clipPNeither)" />
      <text x={cx} y={H - 18} textAnchor="middle" fontSize={12} fill="#6d28d9" fontWeight="bold">
        P ⊄ Q かつ Q ⊄ P
      </text>
    </svg>
  );
}

export default function NecessarySufficientViz() {
  const [activePattern, setActivePattern] = useState<PatternKey>("sufficient");

  const data = PATTERNS[activePattern];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">必要条件・十分条件</h2>
        <p className="text-sm text-slate-500">
          <K tex="p \Rightarrow q" /> が真 ⇔ <K tex="P \subset Q" /> （集合の包含関係）
        </p>
      </div>

      {/* Pattern selector */}
      <div className="grid grid-cols-2 gap-2">
        {PATTERN_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActivePattern(key)}
            className={`px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
              activePattern === key
                ? "border-slate-800 bg-slate-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] text-slate-400 mb-1">{PATTERNS[key].shortLabel}</div>
            {PATTERNS[key].label}
          </button>
        ))}
      </div>

      {/* Venn Diagram */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <VennDiagram pattern={activePattern} />
      </div>

      {/* Formula */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="text-center mb-3">
          <KBlock tex={data.formula} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{data.description}</p>
      </div>

      {/* Truth table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">命題の真偽</h3>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-xl border text-center ${
              activePattern === "sufficient" || activePattern === "iff"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="text-xs text-slate-400 mb-1">
              <K tex="p \Rightarrow q" />
            </div>
            <div
              className={`font-bold ${
                activePattern === "sufficient" || activePattern === "iff"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {activePattern === "sufficient" || activePattern === "iff" ? "真" : "偽"}
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border text-center ${
              activePattern === "necessary" || activePattern === "iff"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="text-xs text-slate-400 mb-1">
              <K tex="q \Rightarrow p" />
            </div>
            <div
              className={`font-bold ${
                activePattern === "necessary" || activePattern === "iff"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {activePattern === "necessary" || activePattern === "iff" ? "真" : "偽"}
            </div>
          </div>
        </div>
      </div>

      {/* Concrete Example */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          具体例
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
            <div className="text-center flex-1">
              <div className="text-[10px] text-slate-400 mb-1">条件 p</div>
              <div className="font-bold text-red-400">
                <K tex={data.example.p} />
              </div>
            </div>
            <div className="text-slate-500 font-bold mx-2">
              <K tex="\Rightarrow" />
            </div>
            <div className="text-center flex-1">
              <div className="text-[10px] text-slate-400 mb-1">条件 q</div>
              <div className="font-bold text-blue-400">
                <K tex={data.example.q} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded-lg">
              <span className="text-slate-400">P = </span>
              <K tex={data.example.pSet} />
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">
              <span className="text-slate-400">Q = </span>
              <K tex={data.example.qSet} />
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {data.example.explanation}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
        <h3 className="font-bold text-blue-800 mb-2">まとめ</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <K tex="p \Rightarrow q" /> が真 ⇒ p は q の<strong>十分条件</strong>、q は p の<strong>必要条件</strong>
          </p>
          <p>
            <K tex="q \Rightarrow p" /> が真 ⇒ p は q の<strong>必要条件</strong>、q は p の<strong>十分条件</strong>
          </p>
          <p>両方真 ⇒ <strong>必要十分条件</strong>（同値）</p>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: '「十分」= 条件を満たせば結論が保証される。「必要」= 結論が成り立つには条件が不可欠。' },
        { step: 2, text: '集合で判定: 条件 p の真理集合 P と条件 q の真理集合 Q の包含関係を調べます。' },
        { step: 3, text: 'P ⊂ Q ⇒ 十分条件、P ⊃ Q ⇒ 必要条件、P = Q ⇒ 必要十分条件です。' },
      ]} />
    </div>
  );
}
