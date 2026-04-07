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

type PropositionForm = "original" | "converse" | "inverse" | "contrapositive";

interface Example {
  label: string;
  p: string;
  q: string;
  /** truth table rows: [pTrue, qTrue, originalTrue] */
  truthRows: [boolean, boolean][];
  /** which forms are true for this example */
  trueForms: PropositionForm[];
  explanation: string;
}

const EXAMPLES: Example[] = [
  {
    label: "例1: 整数の性質",
    p: "x > 2",
    q: "x > 1",
    truthRows: [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ],
    trueForms: ["original", "contrapositive"],
    explanation:
      "x > 2 ならば x > 1 は真。対偶「x ≤ 1 ならば x ≤ 2」も真。しかし逆「x > 1 ならば x > 2」は偽（反例: x = 1.5）。裏「x ≤ 2 ならば x ≤ 1」も偽（反例: x = 1.5）。",
  },
  {
    label: "例2: 正三角形",
    p: "\\triangle ABC は正三角形",
    q: "\\triangle ABC は二等辺三角形",
    truthRows: [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ],
    trueForms: ["original", "contrapositive"],
    explanation:
      "正三角形 → 二等辺三角形は真。対偶も真。逆「二等辺三角形 → 正三角形」は偽。裏も偽。",
  },
  {
    label: "例3: 平方と絶対値",
    p: "x^2 = 4",
    q: "|x| = 2",
    truthRows: [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ],
    trueForms: ["original", "converse", "inverse", "contrapositive"],
    explanation:
      "x² = 4 と |x| = 2 は同値（必要十分条件）なので、4つの命題すべてが真になります。",
  },
  {
    label: "例4: 偶数と4の倍数",
    p: "n は4の倍数",
    q: "n は偶数",
    truthRows: [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ],
    trueForms: ["original", "contrapositive"],
    explanation:
      "4の倍数 → 偶数は真。対偶「奇数 → 4の倍数でない」も真。逆「偶数 → 4の倍数」は偽（反例: 6）。",
  },
];

const FORM_INFO: Record<PropositionForm, { name: string; symbol: string; desc: string }> = {
  original: { name: "元の命題", symbol: "P \\Rightarrow Q", desc: "P ならば Q" },
  converse: { name: "逆", symbol: "Q \\Rightarrow P", desc: "Q ならば P" },
  inverse: { name: "裏", symbol: "\\neg P \\Rightarrow \\neg Q", desc: "¬P ならば ¬Q" },
  contrapositive: { name: "対偶", symbol: "\\neg Q \\Rightarrow \\neg P", desc: "¬Q ならば ¬P" },
};

const FORMS: PropositionForm[] = ["original", "converse", "inverse", "contrapositive"];

export default function ConditionalPropositionViz() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [selectedForm, setSelectedForm] = useState<PropositionForm>("original");

  const example = EXAMPLES[exampleIndex];
  const isTrue = example.trueForms.includes(selectedForm);

  const getFormTex = (form: PropositionForm): string => {
    switch (form) {
      case "original":
        return `${example.p} \\Rightarrow ${example.q}`;
      case "converse":
        return `${example.q} \\Rightarrow ${example.p}`;
      case "inverse":
        return `\\neg(${example.p}) \\Rightarrow \\neg(${example.q})`;
      case "contrapositive":
        return `\\neg(${example.q}) \\Rightarrow \\neg(${example.p})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Example selector */}
      <div className="flex gap-2 flex-wrap">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setExampleIndex(i);
              setSelectedForm("original");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              exampleIndex === i
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Proposition display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-center mb-4">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
            元の命題
          </div>
          <div className="text-lg font-bold">
            <K tex={`${example.p} \\Rightarrow ${example.q}`} />
          </div>
        </div>

        {/* 4 forms grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {FORMS.map((form) => {
            const info = FORM_INFO[form];
            const formIsTrue = example.trueForms.includes(form);
            const isSelected = selectedForm === form;

            return (
              <button
                key={form}
                onClick={() => setSelectedForm(form)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? formIsTrue
                      ? "border-green-500 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400">{info.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      formIsTrue
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {formIsTrue ? "真" : "偽"}
                  </span>
                </div>
                <div className="text-sm font-bold mt-1">
                  <K tex={info.symbol} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equivalence diagram */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="font-bold text-sm text-slate-700 mb-4">同値関係の構造</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-28 h-16 rounded-xl border-2 flex items-center justify-center text-sm font-bold ${
                example.trueForms.includes("original")
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-600"
              }`}
            >
              元の命題
            </div>
            <div className="text-xs text-slate-400 font-bold">常に同値</div>
            <div className="w-0.5 h-4 bg-slate-300" />
            <div
              className={`w-28 h-16 rounded-xl border-2 flex items-center justify-center text-sm font-bold ${
                example.trueForms.includes("contrapositive")
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-600"
              }`}
            >
              対偶
            </div>
          </div>

          <div className="text-slate-300 text-2xl font-bold mx-4">≠</div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-28 h-16 rounded-xl border-2 flex items-center justify-center text-sm font-bold ${
                example.trueForms.includes("converse")
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-600"
              }`}
            >
              逆
            </div>
            <div className="text-xs text-slate-400 font-bold">常に同値</div>
            <div className="w-0.5 h-4 bg-slate-300" />
            <div
              className={`w-28 h-16 rounded-xl border-2 flex items-center justify-center text-sm font-bold ${
                example.trueForms.includes("inverse")
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-600"
              }`}
            >
              裏
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          元の命題と対偶は常に真偽が一致し、逆と裏も常に真偽が一致します。
          <br />
          ただし、元の命題と逆（または裏）は真偽が一致するとは限りません。
        </div>
      </div>

      {/* Selected form detail */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-slate-700">
            {FORM_INFO[selectedForm].name}:
          </span>
          <span className="text-base font-bold">
            <K tex={getFormTex(selectedForm)} />
          </span>
          <span
            className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${
              isTrue
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isTrue ? "真 (True)" : "偽 (False)"}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
          {example.explanation}
        </p>
      </div>

      {/* Key takeaway */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">重要ポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            元の命題 <K tex="P \Rightarrow Q" /> と対偶{" "}
            <K tex="\neg Q \Rightarrow \neg P" /> は常に同値
          </li>
          <li>
            逆 <K tex="Q \Rightarrow P" /> と裏 <K tex="\neg P \Rightarrow \neg Q" />{" "}
            は常に同値
          </li>
          <li>元の命題が真でも、逆や裏が真とは限らない</li>
          <li>4つすべてが真のとき、P と Q は必要十分条件（同値）</li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: '条件付き命題「P → Q」は、P が真で Q が偽のときのみ偽になります。' },
        { step: 2, text: '対偶「¬Q → ¬P」は元の命題と常に同値です。直接証明が難しいとき対偶で証明します。' },
        { step: 3, text: '逆「Q → P」と裏「¬P → ¬Q」は互いに同値ですが、元の命題とは独立です。' },
      ]} />
    </div>
  );
}
