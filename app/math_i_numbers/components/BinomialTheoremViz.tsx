"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
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

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export default function BinomialTheoremViz() {
  const [n, setN] = useState(3);
  const [aVal, setAVal] = useState(2);
  const [bVal, setBVal] = useState(1);
  const [highlightRow, setHighlightRow] = useState(-1);

  // Pascal's triangle rows
  const pascalRows = useMemo(() => {
    const rows: number[][] = [];
    for (let i = 0; i <= n; i++) {
      const row: number[] = [];
      for (let j = 0; j <= i; j++) {
        row.push(comb(i, j));
      }
      rows.push(row);
    }
    return rows;
  }, [n]);

  // Expansion terms
  const terms = useMemo(() => {
    const result: { coeff: number; aPow: number; bPow: number; combVal: number; numericalValue: number }[] = [];
    for (let k = 0; k <= n; k++) {
      const combVal = comb(n, k);
      const aPow = n - k;
      const bPow = k;
      const numericalValue = combVal * Math.pow(aVal, aPow) * Math.pow(bVal, bPow);
      result.push({ coeff: combVal, aPow, bPow, combVal, numericalValue });
    }
    return result;
  }, [n, aVal, bVal]);

  // Total value
  const totalExpansion = terms.reduce((sum, t) => sum + t.numericalValue, 0);
  const totalDirect = Math.pow(aVal + bVal, n);

  // Generate KaTeX for the expansion formula (symbolic)
  const symbolicExpansion = useMemo(() => {
    const parts = terms.map((t, k) => {
      let termStr = "";
      if (k > 0) termStr += " + ";

      // C(n,k) part
      if (t.coeff !== 1) {
        termStr += String(t.coeff);
      }

      // a^(n-k)
      if (t.aPow > 0) {
        termStr += "a";
        if (t.aPow > 1) termStr += `^{${t.aPow}}`;
      }

      // b^k
      if (t.bPow > 0) {
        termStr += "b";
        if (t.bPow > 1) termStr += `^{${t.bPow}}`;
      }

      // Handle case where both powers are 0
      if (t.aPow === 0 && t.bPow === 0) {
        termStr += String(t.coeff);
      }

      return termStr;
    });
    return parts.join("");
  }, [terms, n]);

  // Generate KaTeX for the expansion with C notation
  const combExpansion = useMemo(() => {
    const parts = terms.map((t, k) => {
      let termStr = "";
      if (k > 0) termStr += " + ";
      termStr += `\\binom{${n}}{${k}}`;
      if (t.aPow > 0) {
        termStr += "a";
        if (t.aPow > 1) termStr += `^{${t.aPow}}`;
      }
      if (t.bPow > 0) {
        termStr += "b";
        if (t.bPow > 1) termStr += `^{${t.bPow}}`;
      }
      return termStr;
    });
    return parts.join("");
  }, [terms, n]);

  // Generate numerical expansion
  const numericalExpansion = useMemo(() => {
    const parts = terms.map((t, k) => {
      let termStr = "";
      if (k > 0) termStr += " + ";
      termStr += String(t.numericalValue);
      return termStr;
    });
    return parts.join("");
  }, [terms]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
          二項定理 (Binomial Theorem)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          (a + b)^n の展開とパスカルの三角形の関係を学びます
        </p>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          二項定理
        </div>
        <KBlock tex="(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k" />
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <K tex={`\\binom{n}{k} = \\frac{n!}{k!(n-k)!}`} />
          <span className="ml-2">（二項係数）</span>
        </div>
      </div>

      {/* n slider */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
          パラメータ
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>n = {n}</span>
            <span className="text-slate-400">1 ~ 6</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>a = {aVal}</span>
            </div>
            <input
              type="number"
              value={aVal}
              onChange={(e) => setAVal(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>b = {bVal}</span>
            </div>
            <input
              type="number"
              value={bVal}
              onChange={(e) => setBVal(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Pascal's Triangle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
          パスカルの三角形 (n = {n} まで)
        </div>
        <div className="flex flex-col items-center space-y-1">
          {pascalRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex items-center gap-1 transition-all duration-200 ${
                rowIdx === n
                  ? "scale-105"
                  : ""
              }`}
              onMouseEnter={() => setHighlightRow(rowIdx)}
              onMouseLeave={() => setHighlightRow(-1)}
            >
              <span className="text-[10px] text-slate-400 w-8 text-right mr-2">
                n={rowIdx}
              </span>
              {row.map((val, colIdx) => (
                <div
                  key={colIdx}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                    rowIdx === n
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-600 shadow-sm"
                      : highlightRow === rowIdx
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                      : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          各値は上の2つの値の和: <K tex="\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}" />
        </p>
      </div>

      {/* Expansion display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          展開式
        </div>

        {/* C notation */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 mb-1">二項係数の形</div>
          <div className="overflow-x-auto">
            <KBlock tex={`(a+b)^{${n}} = ${combExpansion}`} />
          </div>
        </div>

        {/* Symbolic */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 mb-1">係数を計算</div>
          <div className="overflow-x-auto">
            <KBlock tex={`(a+b)^{${n}} = ${symbolicExpansion}`} />
          </div>
        </div>

        {/* Detailed terms table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                <th className="py-2 px-2 text-left">k</th>
                <th className="py-2 px-2 text-center">
                  <K tex="\binom{n}{k}" />
                </th>
                <th className="py-2 px-2 text-center">項</th>
                <th className="py-2 px-2 text-right">
                  数値 (a={aVal}, b={bVal})
                </th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t, k) => (
                <tr
                  key={k}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-2 px-2 font-mono font-bold text-slate-600 dark:text-slate-400">
                    {k}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <K
                      tex={`\\frac{${n}!}{${k}! \\cdot ${n - k}!} = ${t.combVal}`}
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <K
                      tex={`${t.combVal}${t.aPow > 0 ? `a${t.aPow > 1 ? `^{${t.aPow}}` : ""}` : ""}${t.bPow > 0 ? `b${t.bPow > 1 ? `^{${t.bPow}}` : ""}` : ""}`}
                    />
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-indigo-600 dark:text-indigo-400">
                    {t.numericalValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Numerical verification */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800 space-y-3">
        <div className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mb-2">
          数値検証
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-700 dark:text-green-300 font-bold">
              直接計算
            </span>
            <K tex={`(${aVal} + ${bVal})^{${n}} = ${aVal + bVal}^{${n}} = ${totalDirect}`} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-700 dark:text-green-300 font-bold">
              展開式の合計
            </span>
            <K tex={`${numericalExpansion} = ${totalExpansion}`} />
          </div>
          <div className="text-center pt-2 border-t border-green-200 dark:border-green-700">
            <span
              className={`text-xs font-bold ${
                totalDirect === totalExpansion
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500"
              }`}
            >
              {totalDirect === totalExpansion
                ? "一致 (Perfect Match)"
                : "不一致"}
            </span>
          </div>
        </div>
      </div>

      {/* HintButton */}
      <HintButton
        hints={[
          {
            step: 1,
            text: "(a+b)^n の展開の各項の係数は、パスカルの三角形の n 行目に対応します",
          },
          {
            step: 2,
            text: "C(n,k) = n! / (k!(n-k)!) は「n 個から k 個を選ぶ組み合わせ」の数と同じです",
          },
          {
            step: 3,
            text: "C(n,k) = C(n-1,k-1) + C(n-1,k) の関係から、パスカルの三角形の各値は上の2つの和です",
          },
          {
            step: 4,
            text: "(a+b)^n の k 番目の項（k=0 から始まる）は C(n,k) × a^(n-k) × b^k です",
          },
        ]}
      />
    </div>
  );
}
