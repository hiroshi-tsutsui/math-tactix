"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
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

type RelationType = "sufficient" | "necessary" | "iff" | "neither";

interface Problem {
  p: string;
  q: string;
  pTex: string;
  qTex: string;
  answer: RelationType;
  pSet: string;
  qSet: string;
  explanation: string;
}

const PROBLEMS: Problem[] = [
  {
    p: "x = 2",
    q: "x^2 = 4",
    pTex: "x = 2",
    qTex: "x^2 = 4",
    answer: "sufficient",
    pSet: "\\{2\\}",
    qSet: "\\{-2, 2\\}",
    explanation:
      "x=2 ならば x^2=4 は真（十分）。しかし x^2=4 ならば x=2 は偽（x=-2 が反例）。よって十分条件だが必要条件ではない。",
  },
  {
    p: "x^2 = 4",
    q: "|x| = 2",
    pTex: "x^2 = 4",
    qTex: "|x| = 2",
    answer: "iff",
    pSet: "\\{-2, 2\\}",
    qSet: "\\{-2, 2\\}",
    explanation:
      "x^2=4 ⇔ |x|=2。両方向とも真なので必要十分条件。集合として P = Q = {-2, 2}。",
  },
  {
    p: "x > 2",
    q: "x^2 > 4",
    pTex: "x > 2",
    qTex: "x^2 > 4",
    answer: "sufficient",
    pSet: "(2, \\infty)",
    qSet: "(-\\infty, -2) \\cup (2, \\infty)",
    explanation:
      "x>2 ならば x^2>4 は真。しかし x^2>4 ならば x>2 は偽（x=-3 が反例）。P は Q の真部分集合。",
  },
  {
    p: "x^2 - 3x + 2 = 0",
    q: "x = 1",
    pTex: "x^2 - 3x + 2 = 0",
    qTex: "x = 1",
    answer: "necessary",
    pSet: "\\{1, 2\\}",
    qSet: "\\{1\\}",
    explanation:
      "x=1 ⟹ x^2-3x+2=0 は真。x^2-3x+2=0 ⟹ x=1 は偽（x=2が反例）。q⊂p なので p は q の必要条件。",
  },
  {
    p: "x > 0",
    q: "x > 5",
    pTex: "x > 0",
    qTex: "x > 5",
    answer: "necessary",
    pSet: "(0, \\infty)",
    qSet: "(5, \\infty)",
    explanation:
      "x>5 ⟹ x>0 は真。しかし x>0 ⟹ x>5 は偽（x=1が反例）。Q⊂P なので p は q の必要条件。",
  },
  {
    p: "x は偶数",
    q: "x は3の倍数",
    pTex: "x \\text{ は偶数}",
    qTex: "x \\text{ は3の倍数}",
    answer: "neither",
    pSet: "\\{\\ldots, -4, -2, 0, 2, 4, \\ldots\\}",
    qSet: "\\{\\ldots, -3, 0, 3, 6, \\ldots\\}",
    explanation:
      "x=2（偶数だが3の倍数でない）、x=3（3の倍数だが偶数でない）。どちらの方向も偽。",
  },
  {
    p: "x^2 + y^2 = 0",
    q: "x = 0 \\text{ かつ } y = 0",
    pTex: "x^2 + y^2 = 0",
    qTex: "x = 0 \\text{ かつ } y = 0",
    answer: "iff",
    pSet: "\\{(0,0)\\}",
    qSet: "\\{(0,0)\\}",
    explanation:
      "実数の範囲で x^2+y^2=0 ⟺ x=0 かつ y=0。両方向とも真なので必要十分条件。",
  },
  {
    p: "xy = 0",
    q: "x = 0",
    pTex: "xy = 0",
    qTex: "x = 0",
    answer: "necessary",
    pSet: "\\{(x,y) \\mid x=0 \\text{ or } y=0\\}",
    qSet: "\\{(x,y) \\mid x=0\\}",
    explanation:
      "x=0 ⟹ xy=0 は真。xy=0 ⟹ x=0 は偽（y=0 の場合が反例）。Q⊂P なので p は q の必要条件。",
  },
];

const CHOICES: { key: RelationType; label: string; tex: string }[] = [
  { key: "sufficient", label: "十分条件（必要条件ではない）", tex: "p \\Rightarrow q \\text{ (真)}, \\quad q \\Rightarrow p \\text{ (偽)}" },
  { key: "necessary", label: "必要条件（十分条件ではない）", tex: "p \\Rightarrow q \\text{ (偽)}, \\quad q \\Rightarrow p \\text{ (真)}" },
  { key: "iff", label: "必要十分条件", tex: "p \\Leftrightarrow q" },
  { key: "neither", label: "どちらでもない", tex: "p \\Rightarrow q \\text{ (偽)}, \\quad q \\Rightarrow p \\text{ (偽)}" },
];

export default function NecessarySufficientConditionViz() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<RelationType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const problem = PROBLEMS[problemIndex];

  const handleSelect = (choice: RelationType) => {
    if (showResult) return;
    setSelected(choice);
    setShowResult(true);
    setTotalAnswered((prev) => prev + 1);
    if (choice === problem.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setProblemIndex((prev) => (prev + 1) % PROBLEMS.length);
    setSelected(null);
    setShowResult(false);
  };

  // Draw Venn diagram
  const drawVenn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const answer = problem.answer;

    // Universal set
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 10, w - 40, h - 20);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("U", 28, 28);

    if (answer === "iff") {
      // P = Q: single circle
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 92, 246, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = "#7c3aed";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("P = Q", cx, cy + 5);
    } else if (answer === "sufficient") {
      // P ⊂ Q: P is inside Q
      const rQ = 70;
      const rP = 40;
      ctx.beginPath();
      ctx.arc(cx, cy, rQ, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - 10, cy, rP, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#2563eb";
      ctx.fillText("P", cx - 10, cy + 5);
      ctx.fillStyle = "#d97706";
      ctx.fillText("Q", cx + 45, cy - 45);
    } else if (answer === "necessary") {
      // Q ⊂ P: Q is inside P
      const rP = 70;
      const rQ = 40;
      ctx.beginPath();
      ctx.arc(cx, cy, rP, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + 10, cy, rQ, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#2563eb";
      ctx.fillText("P", cx - 45, cy - 45);
      ctx.fillStyle = "#d97706";
      ctx.fillText("Q", cx + 10, cy + 5);
    } else {
      // Neither: P and Q overlap partially or are separate
      const rP = 50;
      const rQ = 50;
      const pX = cx - 35;
      const qX = cx + 35;

      ctx.beginPath();
      ctx.arc(pX, cy, rP, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(qX, cy, rQ, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#2563eb";
      ctx.fillText("P", pX - 25, cy);
      ctx.fillStyle = "#d97706";
      ctx.fillText("Q", qX + 25, cy);
    }
  }, [problem]);

  useEffect(() => {
    drawVenn();
    const handleResize = () => drawVenn();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawVenn]);

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400">
          問題 {problemIndex + 1} / {PROBLEMS.length}
        </span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          正解数: {score} / {totalAnswered}
        </span>
      </div>

      {/* Problem statement */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <p className="text-sm font-bold text-slate-700">
          条件 p, q について、p は q の何条件か？
        </p>
        <div className="flex gap-4 items-center justify-center py-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-xs text-blue-400 block">条件 p</span>
            <K tex={problem.pTex} />
          </div>
          <span className="text-slate-400 font-bold">と</span>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            <span className="text-xs text-amber-400 block">条件 q</span>
            <K tex={problem.qTex} />
          </div>
        </div>
      </div>

      {/* Venn diagram */}
      {showResult && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="text-xs text-center text-slate-400 pt-2">集合の包含関係</div>
          <canvas ref={canvasRef} className="w-full" style={{ height: 180 }} />
        </div>
      )}

      {/* Choices */}
      <div className="grid grid-cols-2 gap-2">
        {CHOICES.map((c) => {
          const isCorrect = c.key === problem.answer;
          const isSelected = c.key === selected;
          let style =
            "border-slate-200 bg-white text-slate-700 hover:border-blue-400";
          if (showResult) {
            if (isCorrect) {
              style = "border-green-500 bg-green-50 text-green-700";
            } else if (isSelected && !isCorrect) {
              style = "border-red-500 bg-red-50 text-red-700";
            } else {
              style = "border-slate-100 bg-slate-50 text-slate-400";
            }
          }
          return (
            <button
              key={c.key}
              onClick={() => handleSelect(c.key)}
              disabled={showResult}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${style} ${
                showResult ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <div className="text-xs font-bold mb-1">{c.label}</div>
              <div className="text-[10px]">
                <K tex={c.tex} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-xl text-sm ${
              selected === problem.answer
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="font-bold mb-1">
              {selected === problem.answer ? "正解!" : "不正解"}
            </p>
            <p>{problem.explanation}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <div>
              <K tex={`P = ${problem.pSet}`} />
            </div>
            <div>
              <K tex={`Q = ${problem.qSet}`} />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            次の問題
          </button>
        </div>
      )}

      {/* Reference */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          判定方法のまとめ
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold shrink-0">1.</span>
            <span>
              <K tex="p \Rightarrow q" /> が真かつ <K tex="q \Rightarrow p" /> が偽{" "}
              → p は q の<strong>十分条件</strong>（<K tex="P \subset Q" />）
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold shrink-0">2.</span>
            <span>
              <K tex="p \Rightarrow q" /> が偽かつ <K tex="q \Rightarrow p" /> が真{" "}
              → p は q の<strong>必要条件</strong>（<K tex="Q \subset P" />）
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold shrink-0">3.</span>
            <span>
              両方真 → <strong>必要十分条件</strong>（<K tex="P = Q" />）
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold shrink-0">4.</span>
            <span>
              両方偽 → <strong>どちらでもない</strong>
            </span>
          </div>
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: 'p → q が真 ⇒ p は q の十分条件、q は p の必要条件です。' },
        { step: 2, text: 'q → p が真 ⇒ p は q の必要条件、q は p の十分条件です。' },
        { step: 3, text: '両方が真（p ⟺ q）のとき、p は q の必要十分条件です。集合では P = Q に対応します。' },
      ]} />
    </div>
  );
}
