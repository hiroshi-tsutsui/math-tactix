"use client";

import React, { useState, useRef, useEffect } from "react";
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

/* ── Types ── */
interface CompoundProblem {
  label: string;
  /** 元の命題 p -> q */
  propositionTex: string;
  /** p の記述 */
  pTex: string;
  /** q の記述 */
  qTex: string;
  /** ¬p */
  notPTex: string;
  /** ¬q */
  notQTex: string;
  /** p -> q の否定 */
  negationTex: string;
  /** 対偶: ¬q -> ¬p */
  contrapositiveTex: string;
  /** p(x,y) の評価関数 */
  evalP: (p: boolean, q: boolean) => boolean;
  /** q(x,y) の評価関数 */
  evalQ: (p: boolean, q: boolean) => boolean;
  explanation: string;
}

const PROBLEMS: CompoundProblem[] = [
  {
    label: "問題 1: AND の否定",
    propositionTex: "(x > 0 \\text{ かつ } y > 0) \\Rightarrow x + y > 0",
    pTex: "x > 0 \\text{ かつ } y > 0",
    qTex: "x + y > 0",
    notPTex: "x \\leq 0 \\text{ または } y \\leq 0",
    notQTex: "x + y \\leq 0",
    negationTex: "\\neg(p \\Rightarrow q) : p \\text{ かつ } \\neg q",
    contrapositiveTex: "(x + y \\leq 0) \\Rightarrow (x \\leq 0 \\text{ または } y \\leq 0)",
    evalP: (p, q) => p && q,
    evalQ: (p, _q) => p, // Here p represents "x+y > 0" in truth table context
    explanation:
      '「p かつ q」の否定は「¬p または ¬q」(ド・モルガン)。対偶は元の命題と真偽が一致する。',
  },
  {
    label: "問題 2: OR の否定",
    propositionTex: "(x = 0 \\text{ または } y = 0) \\Rightarrow xy = 0",
    pTex: "x = 0 \\text{ または } y = 0",
    qTex: "xy = 0",
    notPTex: "x \\neq 0 \\text{ かつ } y \\neq 0",
    notQTex: "xy \\neq 0",
    negationTex: "\\neg(p \\lor q) = \\neg p \\land \\neg q",
    contrapositiveTex: "(xy \\neq 0) \\Rightarrow (x \\neq 0 \\text{ かつ } y \\neq 0)",
    evalP: (p, q) => p || q,
    evalQ: (_p, q) => q,
    explanation:
      '「p または q」の否定は「¬p かつ ¬q」(ド・モルガン)。',
  },
  {
    label: "問題 3: 複合対偶",
    propositionTex: "(x^2 + y^2 = 0) \\Rightarrow (x = 0 \\text{ かつ } y = 0)",
    pTex: "x^2 + y^2 = 0",
    qTex: "x = 0 \\text{ かつ } y = 0",
    notPTex: "x^2 + y^2 \\neq 0",
    notQTex: "x \\neq 0 \\text{ または } y \\neq 0",
    negationTex: "\\neg(p \\land q) = \\neg p \\lor \\neg q",
    contrapositiveTex: "(x \\neq 0 \\text{ または } y \\neq 0) \\Rightarrow (x^2 + y^2 \\neq 0)",
    evalP: (p, q) => p && q,
    evalQ: (p, q) => p && q,
    explanation:
      "結論が「かつ」の場合、対偶の仮定は「または」になる（ド・モルガン）。",
  },
  {
    label: "問題 4: 否定の否定",
    propositionTex: "(a > 1 \\text{ かつ } b > 1) \\Rightarrow ab > 1",
    pTex: "a > 1 \\text{ かつ } b > 1",
    qTex: "ab > 1",
    notPTex: "a \\leq 1 \\text{ または } b \\leq 1",
    notQTex: "ab \\leq 1",
    negationTex: "\\neg(p \\Rightarrow q) : p \\text{ かつ } \\neg q",
    contrapositiveTex: "(ab \\leq 1) \\Rightarrow (a \\leq 1 \\text{ または } b \\leq 1)",
    evalP: (p, q) => p && q,
    evalQ: (p, _q) => p,
    explanation:
      "対偶を取ると、仮定と結論が入れ替わり、それぞれ否定される。",
  },
];

export default function CompoundConditionViz() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [pVal, setPVal] = useState(true);
  const [qVal, setQVal] = useState(true);

  const problem = PROBLEMS[selectedIdx];

  const handleChange = (idx: number) => {
    setSelectedIdx(idx);
    setPVal(true);
    setQVal(true);
  };

  // Truth table values
  const rows: { p: boolean; q: boolean; pAndQ: boolean; pOrQ: boolean; notP: boolean; notQ: boolean; notPAndQ: boolean; notPOrQ: boolean; implication: boolean; contrapositive: boolean }[] = [
    { p: true, q: true },
    { p: true, q: false },
    { p: false, q: true },
    { p: false, q: false },
  ].map(({ p, q }) => {
    const notP = !p;
    const notQ = !q;
    return {
      p,
      q,
      pAndQ: p && q,
      pOrQ: p || q,
      notP,
      notQ,
      notPAndQ: !(p && q),
      notPOrQ: !(p || q),
      implication: !p || q, // p -> q = ¬p ∨ q
      contrapositive: q || !p, // ¬q -> ¬p = q ∨ ¬p (same as implication)
    };
  });

  const boolStr = (v: boolean) => (v ? "T" : "F");
  const boolColor = (v: boolean) => (v ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50");

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleChange(idx)}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
              selectedIdx === idx
                ? "bg-indigo-100 border-indigo-300 text-indigo-700 border"
                : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Proposition display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700">元の命題</h3>
        <div className="text-center">
          <K tex={problem.propositionTex} display />
        </div>
      </div>

      {/* Three-column display: Original / Negation / Contrapositive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* p */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="text-xs font-bold text-blue-600 mb-2">条件 p</h4>
          <div className="text-sm text-center">
            <K tex={problem.pTex} />
          </div>
        </div>
        {/* q */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="text-xs font-bold text-blue-600 mb-2">条件 q</h4>
          <div className="text-sm text-center">
            <K tex={problem.qTex} />
          </div>
        </div>
        {/* p -> q */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="text-xs font-bold text-blue-600 mb-2">命題 p → q</h4>
          <div className="text-sm text-center">
            <K tex="p \\Rightarrow q" />
          </div>
        </div>
      </div>

      {/* Negation and Contrapositive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-600 mb-2">¬p（p の否定）</h4>
          <div className="text-sm text-center">
            <K tex={problem.notPTex} />
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-600 mb-2">¬q（q の否定）</h4>
          <div className="text-sm text-center">
            <K tex={problem.notQTex} />
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <h4 className="text-xs font-bold text-green-600 mb-2">対偶: ¬q → ¬p</h4>
        <div className="text-sm text-center">
          <K tex={problem.contrapositiveTex} />
        </div>
      </div>

      {/* Interactive truth table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700">真理値表（インタラクティブ）</h3>

        {/* Interactive toggle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">p:</span>
            <button
              onClick={() => setPVal(!pVal)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                pVal ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {pVal ? "True" : "False"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">q:</span>
            <button
              onClick={() => setQVal(!qVal)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                qVal ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {qVal ? "True" : "False"}
            </button>
          </div>
        </div>

        {/* Current evaluation */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <K tex="p \land q" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(pVal && qVal)}`}>
                {boolStr(pVal && qVal)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <K tex="p \lor q" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(pVal || qVal)}`}>
                {boolStr(pVal || qVal)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <K tex="\neg(p \land q)" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(!(pVal && qVal))}`}>
                {boolStr(!(pVal && qVal))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <K tex="\neg p \lor \neg q" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(!pVal || !qVal)}`}>
                {boolStr(!pVal || !qVal)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <K tex="\neg(p \lor q)" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(!(pVal || qVal))}`}>
                {boolStr(!(pVal || qVal))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <K tex="\neg p \land \neg q" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(!pVal && !qVal)}`}>
                {boolStr(!pVal && !qVal)}
              </span>
            </div>
          </div>

          {/* Highlight De Morgan equality */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <K tex="p \Rightarrow q" />
              <span className="text-xs text-slate-400">=</span>
              <K tex="\neg p \lor q" />
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${boolColor(!pVal || qVal)}`}>
                {boolStr(!pVal || qVal)}
              </span>
            </div>
          </div>
        </div>

        {/* Full truth table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 px-2 text-center font-bold text-slate-500">p</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">q</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">p∧q</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">p∨q</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">¬(p∧q)</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">¬p∨¬q</th>
                <th className="py-2 px-2 text-center font-bold text-slate-500">p→q</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isCurrentRow = row.p === pVal && row.q === qVal;
                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 ${isCurrentRow ? "bg-indigo-50 font-bold" : ""}`}
                  >
                    <td className={`py-2 px-2 text-center ${boolColor(row.p)}`}>{boolStr(row.p)}</td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.q)}`}>{boolStr(row.q)}</td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.pAndQ)}`}>{boolStr(row.pAndQ)}</td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.pOrQ)}`}>{boolStr(row.pOrQ)}</td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.notPAndQ)}`}>{boolStr(row.notPAndQ)}</td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.notPOrQ)}`}>
                      {boolStr(!row.p || !row.q)}
                    </td>
                    <td className={`py-2 px-2 text-center ${boolColor(row.implication)}`}>{boolStr(row.implication)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 text-center">
          ¬(p∧q) と ¬p∨¬q の列が常に一致することを確認してください（ド・モルガンの法則）
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-3">ド・モルガンの法則と対偶</h4>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 border border-indigo-200 text-center">
            <K tex="\neg(p \land q) = \neg p \lor \neg q" display />
          </div>
          <div className="bg-white rounded-xl p-3 border border-indigo-200 text-center">
            <K tex="\neg(p \lor q) = \neg p \land \neg q" display />
          </div>
          <div className="bg-white rounded-xl p-3 border border-indigo-200 text-center">
            <K tex="(p \Rightarrow q) \text{ の対偶: } (\neg q \Rightarrow \neg p)" display />
          </div>
        </div>
        <p className="text-sm text-indigo-600 mt-3">{problem.explanation}</p>
      </div>
    </div>
  );
}
