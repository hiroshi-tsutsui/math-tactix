"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";

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

interface PracticeQuestion {
  question: string;
  pA: number;
  pB: number;
  pAB: number;
  answer: number;
  explanation: string;
}

const QUESTIONS: PracticeQuestion[] = [
  {
    question:
      "52枚のトランプから1枚引くとき「2の倍数」または「3の倍数」である確率を求めよ。",
    pA: 26 / 52,
    pB: 16 / 52,
    pAB: 8 / 52,
    answer: 34 / 52,
    explanation:
      "2の倍数は26枚、3の倍数は16枚（3,6,9,12を各4枚）、6の倍数は8枚（6,12を各4枚）。P(A∪B)=26/52+16/52-8/52=34/52=17/26",
  },
  {
    question:
      "1から20までの整数から1つ選ぶとき「4の倍数」または「6の倍数」である確率を求めよ。",
    pA: 5 / 20,
    pB: 3 / 20,
    pAB: 1 / 20,
    answer: 7 / 20,
    explanation:
      "4の倍数は{4,8,12,16,20}の5個、6の倍数は{6,12,18}の3個、12の倍数（共通）は{12}の1個。P(A∪B)=5/20+3/20-1/20=7/20",
  },
];

export default function AdditionRuleViz() {
  const [pA, setPA] = useState(0.4);
  const [pB, setPB] = useState(0.35);
  const [overlap, setOverlap] = useState(0.15);
  const [isMutuallyExclusive, setIsMutuallyExclusive] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const effectiveOverlap = isMutuallyExclusive ? 0 : Math.min(overlap, Math.min(pA, pB));
  const pUnion = pA + pB - effectiveOverlap;

  // Venn diagram dimensions
  const W = 400;
  const H = 280;
  const cx = W / 2;
  const cy = H / 2;
  const baseR = 80;

  // Circle separation based on overlap
  const maxSep = baseR * 2.2;
  const minSep = 0;
  const overlapRatio =
    Math.min(pA, pB) > 0 ? effectiveOverlap / Math.min(pA, pB) : 0;
  const separation = maxSep - overlapRatio * (maxSep - minSep);

  const rA = baseR;
  const rB = baseR;
  const cxA = cx - separation / 2;
  const cxB = cx + separation / 2;

  const handleCheckAnswer = useCallback(() => {
    setShowResult(true);
  }, []);

  const isCorrect = useCallback(
    (qIndex: number) => {
      const q = QUESTIONS[qIndex];
      const parsed = parseFloat(userAnswer);
      if (isNaN(parsed)) {
        // Try fraction format
        const parts = userAnswer.split("/");
        if (parts.length === 2) {
          const num = parseFloat(parts[0]);
          const den = parseFloat(parts[1]);
          if (!isNaN(num) && !isNaN(den) && den !== 0) {
            return Math.abs(num / den - q.answer) < 0.001;
          }
        }
        return false;
      }
      return Math.abs(parsed - q.answer) < 0.001;
    },
    [userAnswer]
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">確率の加法定理</h2>
        <div className="text-sm text-slate-500">
          <KBlock tex="P(A \cup B) = P(A) + P(B) - P(A \cap B)" />
        </div>
      </div>

      {/* Venn Diagram */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ maxHeight: 280 }}
        >
          {/* Universe rectangle */}
          <rect
            x={10}
            y={10}
            width={W - 20}
            height={H - 20}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={2}
            rx={12}
          />
          <text x={25} y={30} fontSize={12} fill="#94a3b8" fontWeight="bold">
            U (全体)
          </text>

          {/* Circle A - only A part */}
          <clipPath id="onlyA">
            <circle cx={cxA} cy={cy} r={rA} />
          </clipPath>
          <clipPath id="notB">
            <rect x={0} y={0} width={W} height={H} />
          </clipPath>

          {/* A circle */}
          <circle
            cx={cxA}
            cy={cy}
            r={rA}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#3b82f6"
            strokeWidth={2}
          />

          {/* B circle */}
          <circle
            cx={cxB}
            cy={cy}
            r={rB}
            fill="rgba(239, 68, 68, 0.25)"
            stroke="#ef4444"
            strokeWidth={2}
          />

          {/* Intersection highlight */}
          {!isMutuallyExclusive && effectiveOverlap > 0 && (
            <>
              <clipPath id="clipA">
                <circle cx={cxA} cy={cy} r={rA} />
              </clipPath>
              <circle
                cx={cxB}
                cy={cy}
                r={rB}
                fill="rgba(139, 92, 246, 0.4)"
                clipPath="url(#clipA)"
              />
            </>
          )}

          {/* Labels */}
          <text
            x={cxA - rA / 2}
            y={cy - rA - 8}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#3b82f6"
          >
            A
          </text>
          <text
            x={cxB + rB / 2}
            y={cy - rB - 8}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#ef4444"
          >
            B
          </text>

          {/* Values inside circles */}
          <text
            x={cxA - separation / 4}
            y={cy + 5}
            textAnchor="middle"
            fontSize={11}
            fill="#1e40af"
          >
            P(A)={pA.toFixed(2)}
          </text>
          <text
            x={cxB + separation / 4}
            y={cy + 5}
            textAnchor="middle"
            fontSize={11}
            fill="#b91c1c"
          >
            P(B)={pB.toFixed(2)}
          </text>
          {!isMutuallyExclusive && effectiveOverlap > 0.01 && (
            <text
              x={cx}
              y={cy + 25}
              textAnchor="middle"
              fontSize={10}
              fill="#6d28d9"
              fontWeight="bold"
            >
              P(A∩B)={effectiveOverlap.toFixed(2)}
            </text>
          )}
          {isMutuallyExclusive && (
            <text
              x={cx}
              y={cy + rA + 20}
              textAnchor="middle"
              fontSize={11}
              fill="#6d28d9"
              fontWeight="bold"
            >
              排反: P(A∩B)=0
            </text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>
              P(A) = <span className="text-blue-600">{pA.toFixed(2)}</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={pA}
            onChange={(e) => setPA(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>
              P(B) = <span className="text-red-600">{pB.toFixed(2)}</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={pB}
            onChange={(e) => setPB(parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        {!isMutuallyExclusive && (
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>
                P(A∩B) ={" "}
                <span className="text-purple-600">
                  {effectiveOverlap.toFixed(2)}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(pA, pB)}
              step={0.01}
              value={overlap}
              onChange={(e) => setOverlap(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isMutuallyExclusive}
            onChange={(e) => setIsMutuallyExclusive(e.target.checked)}
            className="rounded accent-purple-600"
          />
          <span className="font-bold text-slate-700">
            排反事象（A∩B = ∅）
          </span>
        </label>
      </div>

      {/* Result display */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          計算結果
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <K tex="P(A)" />
            <span className="font-mono">{pA.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <K tex="P(B)" />
            <span className="font-mono">{pB.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <K tex="P(A \cap B)" />
            <span className="font-mono">{effectiveOverlap.toFixed(4)}</span>
          </div>
          <hr className="border-slate-700" />
          <div className="flex justify-between text-lg font-bold">
            <K tex="P(A \cup B)" />
            <span className="font-mono text-green-400">
              {Math.min(pUnion, 1).toFixed(4)}
            </span>
          </div>
          {pUnion > 1 && (
            <p className="text-xs text-amber-400 mt-1">
              注意: P(A∪B) &gt; 1 になっています。P(A∩B) の値を確認してください。
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700">
          {isMutuallyExclusive ? (
            <div className="text-xs text-slate-400">
              <K tex="P(A \cup B) = P(A) + P(B)" /> （排反事象の場合）
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              <K tex={`P(A \\cup B) = ${pA.toFixed(2)} + ${pB.toFixed(2)} - ${effectiveOverlap.toFixed(2)} = ${Math.min(pUnion, 1).toFixed(2)}`} />
            </div>
          )}
        </div>
      </div>

      {/* Practice Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-4">練習問題</h3>
        <div className="space-y-3">
          {QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveQuestion(activeQuestion === i ? null : i);
                setUserAnswer("");
                setShowResult(false);
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                activeQuestion === i
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="text-xs font-bold text-slate-400 mb-1">
                問題 {i + 1}
              </div>
              <div className="text-sm text-slate-700">{q.question}</div>
            </button>
          ))}
        </div>

        {activeQuestion !== null && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-sm text-slate-600">
              <K tex="P(A \cup B)" /> の値を入力してください（分数 例: 17/26 も可）
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setShowResult(false);
                }}
                placeholder="例: 17/26"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCheckAnswer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
              >
                確認
              </button>
            </div>
            {showResult && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  isCorrect(activeQuestion)
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {isCorrect(activeQuestion) ? (
                  <div className="font-bold">正解!</div>
                ) : (
                  <div>
                    <div className="font-bold mb-1">不正解</div>
                    <div>{QUESTIONS[activeQuestion].explanation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
