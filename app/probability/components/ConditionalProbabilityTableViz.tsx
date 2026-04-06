"use client";

import React, { useState, useMemo } from "react";
import MathDisplay from "@/app/lib/components/MathDisplay";

/* ── Types ── */
interface TableProblem {
  title: string;
  rowLabel: string;        // e.g. "病気"
  colLabel: string;        // e.g. "検査結果"
  rowCategories: [string, string];  // e.g. ["あり", "なし"]
  colCategories: [string, string];  // e.g. ["陽性", "陰性"]
  /** data[row][col]: counts */
  data: [[number, number], [number, number]];
  /** Which conditional probability to ask */
  questionTex: string;
  /** Target: P(row=targetRow | col=targetCol) */
  targetRow: 0 | 1;
  targetCol: 0 | 1;
}

const PROBLEMS: TableProblem[] = [
  {
    title: "医療検査と病気",
    rowLabel: "病気",
    colLabel: "検査結果",
    rowCategories: ["あり", "なし"],
    colCategories: ["陽性", "陰性"],
    data: [[35, 5], [10, 50]],
    questionTex: "P(\\text{病気あり} \\mid \\text{陽性})",
    targetRow: 0,
    targetCol: 0,
  },
  {
    title: "合格と勉強時間",
    rowLabel: "合格",
    colLabel: "勉強時間",
    rowCategories: ["合格", "不合格"],
    colCategories: ["3時間以上", "3時間未満"],
    data: [[40, 10], [20, 30]],
    questionTex: "P(\\text{合格} \\mid \\text{3時間以上})",
    targetRow: 0,
    targetCol: 0,
  },
  {
    title: "天気と傘の持参",
    rowLabel: "天気",
    colLabel: "傘の持参",
    rowCategories: ["雨", "晴れ"],
    colCategories: ["持参", "未持参"],
    data: [[25, 5], [15, 55]],
    questionTex: "P(\\text{雨} \\mid \\text{傘持参})",
    targetRow: 0,
    targetCol: 0,
  },
  {
    title: "欠陥品と工場",
    rowLabel: "品質",
    colLabel: "工場",
    rowCategories: ["欠陥品", "良品"],
    colCategories: ["工場A", "工場B"],
    data: [[6, 4], [54, 36]],
    questionTex: "P(\\text{欠陥品} \\mid \\text{工場A})",
    targetRow: 0,
    targetCol: 0,
  },
];

type HighlightTarget = "none" | "intersection" | "condition" | "result";

export default function ConditionalProbabilityTableViz() {
  const [problemIdx, setProblemIdx] = useState(0);
  const [highlight, setHighlight] = useState<HighlightTarget>("none");
  const [showSteps, setShowSteps] = useState(false);

  const prob = PROBLEMS[problemIdx];
  const { data, targetRow, targetCol } = prob;

  // Calculate totals
  const totals = useMemo(() => {
    const rowTotals = [data[0][0] + data[0][1], data[1][0] + data[1][1]];
    const colTotals = [data[0][0] + data[1][0], data[0][1] + data[1][1]];
    const total = rowTotals[0] + rowTotals[1];
    return { rowTotals, colTotals, total };
  }, [data]);

  // P(A|B) calculation
  const pIntersection = data[targetRow][targetCol];
  const pCondition = totals.colTotals[targetCol];
  const pResult = pIntersection / pCondition;

  // GCD for fraction simplification
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(pIntersection, pCondition);
  const simplifiedNum = pIntersection / g;
  const simplifiedDen = pCondition / g;

  // Cell highlight logic
  const getCellStyle = (r: number, c: number): string => {
    if (highlight === "intersection" && r === targetRow && c === targetCol) {
      return "bg-purple-200 border-purple-400 font-bold";
    }
    if (highlight === "condition" && c === targetCol) {
      return "bg-blue-100 border-blue-300";
    }
    if (highlight === "result") {
      if (r === targetRow && c === targetCol) return "bg-purple-200 border-purple-400 font-bold";
      if (c === targetCol) return "bg-blue-100 border-blue-300";
    }
    return "bg-white";
  };

  const getColTotalStyle = (c: number): string => {
    if ((highlight === "condition" || highlight === "result") && c === targetCol) {
      return "bg-blue-200 border-blue-400 font-bold";
    }
    return "bg-slate-100";
  };

  const handleProblemChange = (idx: number) => {
    setProblemIdx(idx);
    setHighlight("none");
    setShowSteps(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-slate-800">条件付き確率の応用（分割表）</h2>
      <p className="text-sm text-slate-500">
        2x2 のクロス集計表を使って条件付き確率を計算します。セルをクリックして、計算に使う値をハイライトしましょう。
      </p>

      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleProblemChange(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              problemIdx === i
                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <div className="text-xs text-blue-500 uppercase tracking-widest font-bold mb-2">求めたい値</div>
        <MathDisplay tex={prob.questionTex} displayMode />
      </div>

      {/* Contingency table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-200 px-4 py-2 text-slate-600">
                {prob.rowLabel} ＼ {prob.colLabel}
              </th>
              {prob.colCategories.map((cat, c) => (
                <th
                  key={c}
                  className={`border border-slate-300 px-4 py-2 cursor-pointer transition-colors ${
                    (highlight === "condition" || highlight === "result") && c === targetCol
                      ? "bg-blue-200 text-blue-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                  onClick={() => setHighlight(highlight === "condition" ? "none" : "condition")}
                >
                  {cat}
                </th>
              ))}
              <th className="border border-slate-300 bg-slate-200 px-4 py-2 text-slate-600">計</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map((r) => (
              <tr key={r}>
                <td className="border border-slate-300 bg-slate-100 px-4 py-2 font-medium text-slate-700">
                  {prob.rowCategories[r]}
                </td>
                {[0, 1].map((c) => (
                  <td
                    key={c}
                    className={`border border-slate-300 px-4 py-3 text-center cursor-pointer transition-colors ${getCellStyle(r, c)}`}
                    onClick={() => {
                      if (r === targetRow && c === targetCol) {
                        setHighlight(highlight === "intersection" ? "none" : "intersection");
                      }
                    }}
                  >
                    {data[r][c]}
                  </td>
                ))}
                <td className="border border-slate-300 bg-slate-50 px-4 py-3 text-center font-medium">
                  {totals.rowTotals[r]}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-slate-300 bg-slate-100 px-4 py-2 font-medium text-slate-700">計</td>
              {[0, 1].map((c) => (
                <td
                  key={c}
                  className={`border border-slate-300 px-4 py-3 text-center font-medium cursor-pointer transition-colors ${getColTotalStyle(c)}`}
                  onClick={() => setHighlight(highlight === "condition" ? "none" : "condition")}
                >
                  {totals.colTotals[c]}
                </td>
              ))}
              <td className="border border-slate-300 bg-slate-200 px-4 py-3 text-center font-bold">
                {totals.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Highlight controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setHighlight("intersection")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            highlight === "intersection"
              ? "bg-purple-100 text-purple-700 border border-purple-200"
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          A∩B をハイライト
        </button>
        <button
          onClick={() => setHighlight("condition")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            highlight === "condition"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          B (条件) をハイライト
        </button>
        <button
          onClick={() => setHighlight("result")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            highlight === "result"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          計算結果を表示
        </button>
      </div>

      {/* Show calculation steps */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
      >
        {showSteps ? "計算ステップを隠す" : "計算ステップを表示"}
      </button>

      {showSteps && (
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-700">公式を確認する</div>
              <MathDisplay tex="P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{n(A \\cap B)}{n(B)}" displayMode />
            </div>
          </div>

          <div className="flex justify-center text-slate-300 text-xl">↓</div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-700">
                A∩B の人数を表から読む（{prob.rowCategories[targetRow]} かつ {prob.colCategories[targetCol]}）
              </div>
              <MathDisplay tex={`n(A \\cap B) = ${pIntersection}`} displayMode />
            </div>
          </div>

          <div className="flex justify-center text-slate-300 text-xl">↓</div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-700">
                B（条件: {prob.colCategories[targetCol]}）の合計人数
              </div>
              <MathDisplay tex={`n(B) = ${data[0][targetCol]} + ${data[1][targetCol]} = ${pCondition}`} displayMode />
            </div>
          </div>

          <div className="flex justify-center text-slate-300 text-xl">↓</div>

          {/* Step 4: Result */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
            <div className="text-xs text-green-600 uppercase tracking-widest font-bold">計算結果</div>
            <MathDisplay
              tex={`${prob.questionTex} = \\frac{${pIntersection}}{${pCondition}} = \\frac{${simplifiedNum}}{${simplifiedDen}} ${simplifiedDen === 1 ? `= ${simplifiedNum}` : `\\approx ${pResult.toFixed(3)}`}`}
              displayMode
            />
          </div>
        </div>
      )}

      {/* Formula reference */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">条件付き確率の公式</div>
        <MathDisplay tex="P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{n(A \\cap B)}{n(B)}" displayMode />
        <p className="text-xs text-slate-500 mt-2">
          事象 B が起こったという条件の下で、事象 A が起こる確率。
          分割表では、B の列（または行）の合計に対する、A∩B のセルの割合として求められる。
        </p>
      </div>
    </div>
  );
}
