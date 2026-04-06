"use client";

import React, { useState, useEffect, useRef } from "react";
import katex from "katex";

/* ── KaTeX helpers ── */
const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
  }, [tex]);
  return <span ref={ref} className={className} />;
};

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
  }, [tex]);
  return <div ref={ref} />;
};

/* ── Proof by Contradiction tab ── */
function ContradictionTab() {
  const [step, setStep] = useState(0);
  const maxStep = 5;

  const steps = [
    {
      boxLabel: "1. 仮定する",
      boxColor: "border-red-300 bg-red-50",
      labelColor: "text-red-600",
      content: (
        <div className="space-y-3">
          <div className="text-center font-bold text-lg">
            目標: <MathComponent tex="\sqrt{2}" /> が無理数であることを示す
          </div>
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
            <span className="font-black">背理法の出発点:</span>
            <br />
            <MathComponent tex="\sqrt{2}" /> が有理数であると仮定する。
            <br />
            すなわち、互いに素な自然数 <MathComponent tex="p, q" /> を用いて
            <div className="mt-2 text-center">
              <MathComponent tex="\sqrt{2} = \dfrac{p}{q}" />
              <span className="ml-2 text-xs text-red-500">(p と q は共通因数をもたない)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      boxLabel: "2. 論理展開 (両辺を2乗)",
      boxColor: "border-blue-300 bg-blue-50",
      labelColor: "text-blue-600",
      content: (
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            両辺を2乗して分母を払います:
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
            <KBlock tex="2 = \frac{p^2}{q^2} \quad \Longrightarrow \quad p^2 = 2q^2" />
          </div>
          <div className="text-sm text-slate-600">
            左辺 <MathComponent tex="p^2" /> は <MathComponent tex="2 \times q^2" /> なので<span className="font-bold text-blue-700">偶数</span>。
            <br />
            <MathComponent tex="p^2" /> が偶数ならば <MathComponent tex="p" /> も<span className="font-bold text-blue-700">偶数</span>。
          </div>
        </div>
      ),
    },
    {
      boxLabel: "2. 論理展開 (p = 2m を代入)",
      boxColor: "border-blue-300 bg-blue-50",
      labelColor: "text-blue-600",
      content: (
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            <MathComponent tex="p" /> が偶数なので <MathComponent tex="p = 2m" /> とおいて代入:
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
            <KBlock tex="(2m)^2 = 2q^2 \quad \Longrightarrow \quad 4m^2 = 2q^2 \quad \Longrightarrow \quad q^2 = 2m^2" />
          </div>
          <div className="text-sm text-slate-600">
            <MathComponent tex="q^2 = 2m^2" /> なので <MathComponent tex="q^2" /> も<span className="font-bold text-purple-700">偶数</span>。
            <br />
            よって <MathComponent tex="q" /> も<span className="font-bold text-purple-700">偶数</span>。
          </div>
        </div>
      ),
    },
    {
      boxLabel: "3. 矛盾発見",
      boxColor: "border-amber-300 bg-amber-50",
      labelColor: "text-amber-700",
      content: (
        <div className="space-y-3">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 text-center">
            <div className="text-lg font-black text-amber-800 mb-2">矛盾!</div>
            <div className="text-sm text-amber-700">
              <MathComponent tex="p" /> も <MathComponent tex="q" /> も偶数となった。
              <br />
              これは「<MathComponent tex="p" /> と <MathComponent tex="q" /> は互いに素（共通因数をもたない）」
              という仮定に矛盾する。
            </div>
          </div>
        </div>
      ),
    },
    {
      boxLabel: "結論",
      boxColor: "border-green-300 bg-green-50",
      labelColor: "text-green-700",
      content: (
        <div className="space-y-3">
          <div className="bg-green-50 p-4 rounded-xl border border-green-300 text-center">
            <div className="text-lg font-black text-green-800 mb-2">証明完了</div>
            <div className="text-sm text-green-700">
              仮定「<MathComponent tex="\sqrt{2}" /> は有理数」から矛盾が導かれたので、
              <br />
              この仮定は誤りである。
            </div>
            <div className="mt-3 text-center font-bold text-lg text-green-800">
              <MathComponent tex="\therefore \sqrt{2}" /> は無理数である。
            </div>
          </div>
        </div>
      ),
    },
  ];

  // flow diagram
  const flowLabels = ["仮定する", "論理展開", "矛盾発見"];
  const flowColors = [
    { bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
    { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
    { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700" },
  ];
  const activeFlowIdx = step <= 0 ? 0 : step <= 2 ? 1 : step <= 3 ? 2 : -1;

  return (
    <div className="space-y-5">
      {/* Flow diagram */}
      <div className="flex items-center justify-center gap-2">
        {flowLabels.map((label, i) => (
          <React.Fragment key={i}>
            <div
              className={`px-4 py-2 rounded-xl border-2 text-xs font-black ${
                activeFlowIdx === i
                  ? `${flowColors[i].bg} ${flowColors[i].border} ${flowColors[i].text}`
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              {label}
            </div>
            {i < flowLabels.length - 1 && (
              <svg width="24" height="16" viewBox="0 0 24 16" className="flex-shrink-0">
                <path d="M0 8 L18 8 M14 3 L20 8 L14 13" stroke="#94a3b8" strokeWidth="2" fill="none" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step */}
      <div className={`p-5 rounded-2xl border-2 ${steps[step].boxColor}`}>
        <div className={`text-xs font-black mb-3 ${steps[step].labelColor}`}>{steps[step].boxLabel}</div>
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-40"
        >
          戻る
        </button>
        <div className="text-xs font-bold text-slate-400">
          Step {step + 1} / {maxStep + 1}
        </div>
        <button
          disabled={step === maxStep}
          onClick={() => setStep((s) => s + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-indigo-700"
        >
          次へ
        </button>
      </div>

      {/* Explanation */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-500 leading-relaxed">
        <span className="font-bold text-slate-700">背理法を使う理由:</span>{" "}
        ある性質を「直接証明」するのが難しいとき、その否定を仮定して矛盾を導くことで間接的に証明できます。
        無理数の証明のように「存在しないことを示す」場合に特に有効です。
      </div>
    </div>
  );
}

/* ── Contrapositive Proof tab ── */
function ContrapositiveTab() {
  const [step, setStep] = useState(0);
  const maxStep = 3;

  const steps = [
    {
      label: "元の命題",
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
            <div className="text-xs text-blue-400 font-bold mb-2">証明したい命題</div>
            <div className="font-bold text-lg">
              <MathComponent tex="n^2 \text{ が奇数} \;\Longrightarrow\; n \text{ が奇数}" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            直接証明しようとすると、<MathComponent tex="n^2" /> が奇数から <MathComponent tex="n" /> が奇数を
            導くのは少し面倒です。
          </div>
        </div>
      ),
    },
    {
      label: "対偶をとる",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center text-sm">
              <div className="text-[10px] text-blue-400 font-bold mb-1">元の命題</div>
              <MathComponent tex="p \Rightarrow q" />
            </div>
            <svg width="40" height="16" viewBox="0 0 40 16" className="flex-shrink-0">
              <path d="M0 8 L34 8 M28 3 L36 8 L28 13" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center text-sm">
              <div className="text-[10px] text-purple-400 font-bold mb-1">対偶 (同値)</div>
              <MathComponent tex="\neg q \Rightarrow \neg p" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-center mt-3">
            <div className="text-xs text-purple-400 font-bold mb-2">対偶の命題</div>
            <div className="font-bold text-lg">
              <MathComponent tex="n \text{ が偶数} \;\Longrightarrow\; n^2 \text{ が偶数}" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            元の命題とその対偶は<span className="font-bold text-purple-700">必ず同じ真偽</span>をもちます。
            対偶を証明すれば元の命題も証明されます。
          </div>
        </div>
      ),
    },
    {
      label: "対偶を証明する",
      content: (
        <div className="space-y-3">
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-xs text-green-500 font-bold mb-2">証明</div>
            <div className="text-sm text-slate-700 space-y-2">
              <div>
                <MathComponent tex="n" /> が偶数とする。すなわち、ある整数 <MathComponent tex="k" /> を用いて
              </div>
              <div className="text-center">
                <MathComponent tex="n = 2k" />
              </div>
              <div>このとき</div>
              <div className="text-center">
                <MathComponent tex="n^2 = (2k)^2 = 4k^2 = 2(2k^2)" />
              </div>
              <div>
                <MathComponent tex="2k^2" /> は整数なので、<MathComponent tex="n^2" /> は偶数である。
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "結論",
      content: (
        <div className="space-y-3">
          <div className="bg-green-50 p-4 rounded-xl border border-green-300 text-center">
            <div className="text-lg font-black text-green-800 mb-2">証明完了</div>
            <div className="text-sm text-green-700">
              対偶「<MathComponent tex="n" /> が偶数 <MathComponent tex="\Rightarrow" /> <MathComponent tex="n^2" /> が偶数」
              が示されたので、
              <br />
              元の命題「<MathComponent tex="n^2" /> が奇数 <MathComponent tex="\Rightarrow" /> <MathComponent tex="n" /> が奇数」も真。
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Visual: p -> q <=> not q -> not p */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="relative w-36 h-36 rounded-full border-4 border-blue-200 bg-blue-50/50 flex items-start justify-center pt-3">
          <span className="text-blue-500 font-bold text-xs">Q (奇数の2乗)</span>
          <div className="absolute bottom-3 w-20 h-20 rounded-full border-4 border-red-200 bg-red-50 flex items-center justify-center">
            <span className="text-red-500 font-bold text-xs">P (奇数)</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-bold text-center">
          P <MathComponent tex="\subset" /> Q
          <br />
          <MathComponent tex="\overline{Q} \subset \overline{P}" />
        </div>
      </div>

      {/* Current step */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white">
        <div className="text-xs font-black mb-3 text-slate-500">{steps[step].label}</div>
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-40"
        >
          戻る
        </button>
        <div className="text-xs font-bold text-slate-400">
          Step {step + 1} / {maxStep + 1}
        </div>
        <button
          disabled={step === maxStep}
          onClick={() => setStep((s) => s + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-indigo-700"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function ProofMethodViz() {
  const [tab, setTab] = useState<"contradiction" | "contrapositive">("contradiction");

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("contradiction")}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            tab === "contradiction"
              ? "bg-indigo-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          背理法
        </button>
        <button
          onClick={() => setTab("contrapositive")}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            tab === "contrapositive"
              ? "bg-indigo-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          対偶証明
        </button>
      </div>

      {tab === "contradiction" && <ContradictionTab />}
      {tab === "contrapositive" && <ContrapositiveTab />}
    </div>
  );
}
