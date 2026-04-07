"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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

interface Proposition {
  label: string;
  p: string;
  q: string;
  negP: string;
  negQ: string;
  originalTrue: boolean;
  converseTrue: boolean;
  explanation: string;
}

const PROPOSITIONS: Proposition[] = [
  {
    label: "自然数の性質",
    p: "n \\text{ は } 6 \\text{ の倍数}",
    q: "n \\text{ は } 3 \\text{ の倍数}",
    negP: "n \\text{ は } 6 \\text{ の倍数でない}",
    negQ: "n \\text{ は } 3 \\text{ の倍数でない}",
    originalTrue: true,
    converseTrue: false,
    explanation:
      "6の倍数は必ず3の倍数（真）。対偶も真。逆「3の倍数 → 6の倍数」は偽（反例: 9）。裏も偽。",
  },
  {
    label: "二次方程式の解",
    p: "x = 3",
    q: "x^2 = 9",
    negP: "x \\neq 3",
    negQ: "x^2 \\neq 9",
    originalTrue: true,
    converseTrue: false,
    explanation:
      "x=3 → x²=9 は真。対偶も真。逆「x²=9 → x=3」は偽（反例: x=-3）。裏も偽。",
  },
  {
    label: "四角形の分類",
    p: "\\text{四角形が正方形}",
    q: "\\text{四角形が長方形}",
    negP: "\\text{四角形が正方形でない}",
    negQ: "\\text{四角形が長方形でない}",
    originalTrue: true,
    converseTrue: false,
    explanation:
      "正方形 → 長方形は真。対偶も真。逆「長方形 → 正方形」は偽（反例: 縦横異なる長方形）。裏も偽。",
  },
  {
    label: "絶対値と等式",
    p: "a = b",
    q: "|a| = |b|",
    negP: "a \\neq b",
    negQ: "|a| \\neq |b|",
    originalTrue: true,
    converseTrue: false,
    explanation:
      "a=b → |a|=|b| は真。対偶も真。逆「|a|=|b| → a=b」は偽（反例: a=2, b=-2）。裏も偽。",
  },
  {
    label: "同値な条件",
    p: "x > 0 \\text{ かつ } y > 0",
    q: "xy > 0 \\text{ かつ } x + y > 0",
    negP: "x \\leq 0 \\text{ または } y \\leq 0",
    negQ: "xy \\leq 0 \\text{ または } x + y \\leq 0",
    originalTrue: true,
    converseTrue: true,
    explanation:
      "x>0 かつ y>0 と「xy>0 かつ x+y>0」は同値（必要十分条件）。4つの命題すべて真。",
  },
  {
    label: "三角形の角",
    p: "\\triangle ABC \\text{ が鋭角三角形}",
    q: "\\triangle ABC \\text{ の最大角が } 90° \\text{ 未満}",
    negP: "\\triangle ABC \\text{ が鋭角三角形でない}",
    negQ: "\\triangle ABC \\text{ の最大角が } 90° \\text{ 以上}",
    originalTrue: true,
    converseTrue: true,
    explanation:
      "鋭角三角形の定義は「すべての角が90°未満」であり、これは最大角が90°未満と同値。4命題すべて真。",
  },
  {
    label: "不等式の関係",
    p: "a^2 + b^2 = 0",
    q: "a = 0 \\text{ かつ } b = 0",
    negP: "a^2 + b^2 \\neq 0",
    negQ: "a \\neq 0 \\text{ または } b \\neq 0",
    originalTrue: true,
    converseTrue: true,
    explanation:
      "実数の2乗の和が0 ⇔ 各々が0。同値なので4命題すべて真。",
  },
  {
    label: "整数の偶奇",
    p: "n^2 \\text{ が偶数}",
    q: "n \\text{ が偶数}",
    negP: "n^2 \\text{ が奇数}",
    negQ: "n \\text{ が奇数}",
    originalTrue: true,
    converseTrue: true,
    explanation:
      "n²が偶数 ⇔ nが偶数。対偶「nが奇数→n²が奇数」で証明可能。同値なので4命題すべて真。",
  },
];

type FormType = "original" | "contrapositive" | "converse" | "inverse";

interface QuizState {
  propositionIndex: number;
  selectedAnswer: FormType | null;
  targetForm: FormType;
  isCorrect: boolean | null;
  questionsAnswered: number;
  correctCount: number;
}

const FORM_LABELS: Record<FormType, { ja: string; symbol: string }> = {
  original: { ja: "元の命題", symbol: "P \\Rightarrow Q" },
  contrapositive: { ja: "対偶", symbol: "\\neg Q \\Rightarrow \\neg P" },
  converse: { ja: "逆", symbol: "Q \\Rightarrow P" },
  inverse: { ja: "裏", symbol: "\\neg P \\Rightarrow \\neg Q" },
};

const ALL_FORMS: FormType[] = ["original", "contrapositive", "converse", "inverse"];

function getFormTruth(prop: Proposition, form: FormType): boolean {
  // original and contrapositive always share truth value
  // converse and inverse always share truth value
  if (form === "original" || form === "contrapositive") {
    return prop.originalTrue;
  }
  return prop.converseTrue;
}

function getFormExpression(prop: Proposition, form: FormType): string {
  switch (form) {
    case "original":
      return `${prop.p} \\Rightarrow ${prop.q}`;
    case "contrapositive":
      return `${prop.negQ} \\Rightarrow ${prop.negP}`;
    case "converse":
      return `${prop.q} \\Rightarrow ${prop.p}`;
    case "inverse":
      return `${prop.negP} \\Rightarrow ${prop.negQ}`;
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ConditionalPatternViz() {
  const [mode, setMode] = useState<"explore" | "quiz">("explore");
  const [exploreIndex, setExploreIndex] = useState(0);
  const [highlightedForm, setHighlightedForm] = useState<FormType>("original");

  const [quiz, setQuiz] = useState<QuizState>({
    propositionIndex: Math.floor(Math.random() * PROPOSITIONS.length),
    selectedAnswer: null,
    targetForm: ALL_FORMS[Math.floor(Math.random() * 4)],
    isCorrect: null,
    questionsAnswered: 0,
    correctCount: 0,
  });

  const exploreProp = PROPOSITIONS[exploreIndex];
  const quizProp = PROPOSITIONS[quiz.propositionIndex];

  const nextQuizQuestion = useCallback(() => {
    const newPropIndex = Math.floor(Math.random() * PROPOSITIONS.length);
    const newForm = ALL_FORMS[Math.floor(Math.random() * 4)];
    setQuiz((prev) => ({
      ...prev,
      propositionIndex: newPropIndex,
      targetForm: newForm,
      selectedAnswer: null,
      isCorrect: null,
    }));
  }, []);

  const handleQuizAnswer = useCallback(
    (answer: boolean) => {
      const correct = getFormTruth(quizProp, quiz.targetForm) === answer;
      setQuiz((prev) => ({
        ...prev,
        selectedAnswer: quiz.targetForm,
        isCorrect: correct,
        questionsAnswered: prev.questionsAnswered + 1,
        correctCount: prev.correctCount + (correct ? 1 : 0),
      }));
    },
    [quiz.targetForm, quizProp]
  );

  // Venn diagram canvas for explore mode
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode !== "explore") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Universal set
    const pad = 16;
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, w - 2 * pad, h - 2 * pad);
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("U", pad + 6, pad + 18);

    const cx1 = w / 2 - 36;
    const cx2 = w / 2 + 36;
    const cy = h / 2;
    const r = 70;

    const inP = (x: number, y: number) => (x - cx1) ** 2 + (y - cy) ** 2 <= r * r;
    const inQ = (x: number, y: number) => (x - cx2) ** 2 + (y - cy) ** 2 <= r * r;

    // Highlight based on form
    let condition: (x: number, y: number) => boolean;
    let highlightColor: string;

    const isTrue = getFormTruth(exploreProp, highlightedForm);

    if (highlightedForm === "original") {
      // P => Q: highlight P \ Q (where P is true but Q false) as error, or P subset in Q
      condition = (x, y) => inP(x, y) && !inQ(x, y);
      highlightColor = isTrue ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)";
      // If original is true, P is subset of Q, so P\Q should be empty
      // Show P in green if true
      if (isTrue) {
        condition = (x, y) => inP(x, y);
        highlightColor = "rgba(34,197,94,0.3)";
      }
    } else if (highlightedForm === "contrapositive") {
      // ~Q => ~P: same as original
      condition = (x, y) => !inQ(x, y) && !(!inP(x, y));
      highlightColor = isTrue ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)";
      if (isTrue) {
        condition = (x, y) => !inQ(x, y);
        highlightColor = "rgba(129,140,248,0.3)";
      } else {
        condition = (x, y) => !inQ(x, y) && inP(x, y);
        highlightColor = "rgba(239,68,68,0.3)";
      }
    } else if (highlightedForm === "converse") {
      // Q => P
      if (isTrue) {
        condition = (x, y) => inQ(x, y);
        highlightColor = "rgba(59,130,246,0.3)";
      } else {
        condition = (x, y) => inQ(x, y) && !inP(x, y);
        highlightColor = "rgba(239,68,68,0.3)";
      }
    } else {
      // inverse: ~P => ~Q
      if (isTrue) {
        condition = (x, y) => !inP(x, y);
        highlightColor = "rgba(168,85,247,0.3)";
      } else {
        condition = (x, y) => !inP(x, y) && inQ(x, y);
        highlightColor = "rgba(239,68,68,0.3)";
      }
    }

    // Fill highlighted region
    for (let y = pad; y < h - pad; y += 2) {
      for (let x = pad; x < w - pad; x += 2) {
        if (condition(x, y)) {
          ctx.fillStyle = highlightColor;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Draw circles
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx1, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx2, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("P", cx1 - 46, cy - 46);
    ctx.fillText("Q", cx2 + 30, cy - 46);
  }, [mode, exploreIndex, highlightedForm, exploreProp]);

  if (mode === "explore") {
    return (
      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("explore")}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white"
          >
            探索モード
          </button>
          <button
            onClick={() => setMode("quiz")}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            演習モード
          </button>
        </div>

        {/* Proposition selector */}
        <div className="flex gap-2 flex-wrap">
          {PROPOSITIONS.map((prop, i) => (
            <button
              key={i}
              onClick={() => {
                setExploreIndex(i);
                setHighlightedForm("original");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                exploreIndex === i
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {prop.label}
            </button>
          ))}
        </div>

        {/* Current proposition */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
            元の命題
          </div>
          <div className="text-lg font-bold text-center mb-4">
            <K tex={`${exploreProp.p} \\Rightarrow ${exploreProp.q}`} />
          </div>

          {/* Venn diagram */}
          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="rounded-xl border border-slate-100 bg-slate-50"
            />
          </div>

          {/* 4 forms */}
          <div className="grid grid-cols-2 gap-3">
            {ALL_FORMS.map((form) => {
              const isTrue = getFormTruth(exploreProp, form);
              const isSelected = highlightedForm === form;
              return (
                <button
                  key={form}
                  onClick={() => setHighlightedForm(form)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? isTrue
                        ? "border-green-500 bg-green-50"
                        : "border-red-400 bg-red-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">
                      {FORM_LABELS[form].ja}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isTrue ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isTrue ? "真" : "偽"}
                    </span>
                  </div>
                  <div className="text-sm mt-1">
                    <K tex={getFormExpression(exploreProp, form)} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{exploreProp.explanation}</p>
        </div>

        {/* Relationship diagram */}
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
          <h4 className="font-bold text-indigo-700 text-sm mb-3">4つの命題の関係</h4>
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="space-y-1">
              <div className="font-bold text-slate-700">元の命題</div>
              <div className="text-xs text-slate-400">常に同値</div>
              <div className="font-bold text-slate-700">対偶</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-slate-700">逆</div>
              <div className="text-xs text-slate-400">常に同値</div>
              <div className="font-bold text-slate-700">裏</div>
            </div>
          </div>
          <p className="text-xs text-indigo-600 mt-3 text-center">
            元の命題と対偶は真偽が一致。逆と裏も真偽が一致。ただし元の命題と逆の真偽は独立。
          </p>
        </div>
      </div>
    );
  }

  // Quiz mode
  const formExpression = getFormExpression(quizProp, quiz.targetForm);
  const correctAnswer = getFormTruth(quizProp, quiz.targetForm);

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("explore")}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          探索モード
        </button>
        <button
          onClick={() => setMode("quiz")}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white"
        >
          演習モード
        </button>
      </div>

      {/* Score */}
      {quiz.questionsAnswered > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">
            正答率: {quiz.correctCount}/{quiz.questionsAnswered} (
            {Math.round((quiz.correctCount / quiz.questionsAnswered) * 100)}%)
          </span>
        </div>
      )}

      {/* Quiz card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          {quizProp.label}
        </div>
        <div className="text-center mb-6">
          <div className="text-xs text-slate-500 mb-2">
            次の{FORM_LABELS[quiz.targetForm].ja}の真偽を判定してください
          </div>
          <div className="text-lg font-bold mb-2">
            <K tex={formExpression} />
          </div>
          <div className="text-xs text-slate-400">
            （元の命題: <K tex={`${quizProp.p} \\Rightarrow ${quizProp.q}`} />）
          </div>
        </div>

        {quiz.isCorrect === null ? (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleQuizAnswer(true)}
              className="px-8 py-3 rounded-xl font-bold text-green-700 bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all"
            >
              真 (True)
            </button>
            <button
              onClick={() => handleQuizAnswer(false)}
              className="px-8 py-3 rounded-xl font-bold text-red-600 bg-red-50 border-2 border-red-200 hover:bg-red-100 transition-all"
            >
              偽 (False)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`text-center text-lg font-bold p-4 rounded-xl ${
                quiz.isCorrect
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {quiz.isCorrect ? "正解!" : "不正解..."}
              <div className="text-sm font-normal mt-1">
                正解は「{correctAnswer ? "真" : "偽"}」です
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
              {quizProp.explanation}
            </div>
            <div className="text-center">
              <button
                onClick={nextQuizQuestion}
                className="px-6 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                次の問題へ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <h4 className="font-bold text-slate-700 text-sm mb-2">クイックリファレンス</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          {ALL_FORMS.map((form) => (
            <div key={form} className="flex items-center gap-2">
              <span className="font-bold">{FORM_LABELS[form].ja}:</span>
              <K tex={FORM_LABELS[form].symbol} />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          元の命題と対偶は常に同値。逆と裏は常に同値。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: '「p → q」の逆は「q → p」、裏は「¬p → ¬q」、対偶は「¬q → ¬p」です。' },
        { step: 2, text: '元の命題と対偶は常に同値（真偽が一致）。逆と裏も互いに同値です。' },
        { step: 3, text: '4つすべてが真のとき、p と q は必要十分条件（同値）です。' },
      ]} />
    </div>
  );
}
