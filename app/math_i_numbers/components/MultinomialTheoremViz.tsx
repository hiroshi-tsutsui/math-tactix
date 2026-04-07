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

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function multinomialCoeff(n: number, p: number, q: number, r: number): number {
  return factorial(n) / (factorial(p) * factorial(q) * factorial(r));
}

interface Term {
  p: number;
  q: number;
  r: number;
  coeff: number;
  numericalValue: number;
}

function generateTerms(n: number, aVal: number, bVal: number, cVal: number): Term[] {
  const terms: Term[] = [];
  for (let p = n; p >= 0; p--) {
    for (let q = n - p; q >= 0; q--) {
      const r = n - p - q;
      const coeff = multinomialCoeff(n, p, q, r);
      const numericalValue = coeff * Math.pow(aVal, p) * Math.pow(bVal, q) * Math.pow(cVal, r);
      terms.push({ p, q, r, coeff, numericalValue });
    }
  }
  return terms;
}

function formatTermTex(t: Term): string {
  let s = "";
  if (t.coeff !== 1) {
    s += String(t.coeff);
  }
  if (t.p > 0) {
    s += "a";
    if (t.p > 1) s += `^{${t.p}}`;
  }
  if (t.q > 0) {
    s += "b";
    if (t.q > 1) s += `^{${t.q}}`;
  }
  if (t.r > 0) {
    s += "c";
    if (t.r > 1) s += `^{${t.r}}`;
  }
  if (t.p === 0 && t.q === 0 && t.r === 0) {
    s = String(t.coeff);
  }
  return s;
}

export default function MultinomialTheoremViz() {
  const [n, setN] = useState(2);
  const [aVal, setAVal] = useState(1);
  const [bVal, setBVal] = useState(1);
  const [cVal, setCVal] = useState(1);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  const terms = useMemo(() => generateTerms(n, aVal, bVal, cVal), [n, aVal, bVal, cVal]);

  const totalExpansion = useMemo(() => terms.reduce((sum, t) => sum + t.numericalValue, 0), [terms]);
  const totalDirect = Math.pow(aVal + bVal + cVal, n);

  // Symbolic expansion string
  const symbolicExpansion = useMemo(() => {
    return terms.map((t, i) => {
      const prefix = i > 0 ? " + " : "";
      return prefix + formatTermTex(t);
    }).join("");
  }, [terms]);

  // Multinomial coefficient notation expansion
  const coeffExpansion = useMemo(() => {
    return terms.map((t, i) => {
      const prefix = i > 0 ? " + " : "";
      return `${prefix}\\frac{${n}!}{${t.p}!${t.q}!${t.r}!}${t.p > 0 ? `a${t.p > 1 ? `^{${t.p}}` : ""}` : ""}${t.q > 0 ? `b${t.q > 1 ? `^{${t.q}}` : ""}` : ""}${t.r > 0 ? `c${t.r > 1 ? `^{${t.r}}` : ""}` : ""}`;
    }).join("");
  }, [terms, n]);

  // Numerical expansion
  const numericalExpansion = useMemo(() => {
    return terms.map((t, i) => {
      const prefix = i > 0 ? " + " : "";
      return prefix + String(t.numericalValue);
    }).join("");
  }, [terms]);

  // Count total number of terms
  const termCount = terms.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
          多項定理 (Multinomial Theorem)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          (a + b + c)^n の展開と多項係数を学びます
        </p>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
          多項定理
        </div>
        <KBlock tex="(a + b + c)^n = \sum_{\substack{p+q+r=n \\ p,q,r \geq 0}} \frac{n!}{p!\, q!\, r!}\, a^p\, b^q\, c^r" />
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div>
            <K tex="\frac{n!}{p!\, q!\, r!}" />
            <span className="ml-2">を<strong>多項係数</strong>という（p + q + r = n）</span>
          </div>
          <div>
            <span>二項定理 </span>
            <K tex="\binom{n}{k} = \frac{n!}{k!(n-k)!}" />
            <span> は c = 0 の特殊ケース</span>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
          パラメータ
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>n = {n}</span>
            <span className="text-slate-400">2 ~ 4</span>
          </div>
          <input
            type="range"
            min={2}
            max={4}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">a = {aVal}</div>
            <input
              type="number"
              value={aVal}
              onChange={(e) => setAVal(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
            />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">b = {bVal}</div>
            <input
              type="number"
              value={bVal}
              onChange={(e) => setBVal(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
            />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">c = {cVal}</div>
            <input
              type="number"
              value={cVal}
              onChange={(e) => setCVal(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Expansion display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            展開式
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
            全 {termCount} 項
          </span>
        </div>

        {/* Multinomial coefficient notation */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 mb-1">多項係数の形</div>
          <div className="overflow-x-auto">
            <KBlock tex={`(a+b+c)^{${n}} = ${coeffExpansion}`} />
          </div>
        </div>

        {/* Symbolic */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 mb-1">係数を計算</div>
          <div className="overflow-x-auto">
            <KBlock tex={`(a+b+c)^{${n}} = ${symbolicExpansion}`} />
          </div>
        </div>

        {/* Detailed terms table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                <th className="py-2 px-1 text-center">(p, q, r)</th>
                <th className="py-2 px-1 text-center">
                  <K tex="\frac{n!}{p!q!r!}" />
                </th>
                <th className="py-2 px-1 text-center">項</th>
                <th className="py-2 px-1 text-right">
                  数値
                </th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${
                    highlightIdx === idx
                      ? "bg-indigo-50 dark:bg-indigo-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  onMouseLeave={() => setHighlightIdx(null)}
                >
                  <td className="py-2 px-1 text-center font-mono text-slate-600 dark:text-slate-400">
                    ({t.p}, {t.q}, {t.r})
                  </td>
                  <td className="py-2 px-1 text-center">
                    <K tex={`\\frac{${n}!}{${t.p}!\\cdot${t.q}!\\cdot${t.r}!} = ${t.coeff}`} />
                  </td>
                  <td className="py-2 px-1 text-center">
                    <K tex={formatTermTex(t)} />
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-indigo-600 dark:text-indigo-400">
                    {t.numericalValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Highlighted term detail */}
      {highlightIdx !== null && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800 space-y-2">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">
            選択した項の詳細
          </div>
          <KBlock
            tex={`\\frac{${n}!}{${terms[highlightIdx].p}! \\cdot ${terms[highlightIdx].q}! \\cdot ${terms[highlightIdx].r}!} = \\frac{${factorial(n)}}{${factorial(terms[highlightIdx].p)} \\cdot ${factorial(terms[highlightIdx].q)} \\cdot ${factorial(terms[highlightIdx].r)}} = ${terms[highlightIdx].coeff}`}
          />
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            {n} 個の文字を {terms[highlightIdx].p} 個の a, {terms[highlightIdx].q} 個の b, {terms[highlightIdx].r} 個の c に分ける場合の数 = {terms[highlightIdx].coeff} 通り
          </p>
        </div>
      )}

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
            <K tex={`(${aVal} + ${bVal} + ${cVal})^{${n}} = ${aVal + bVal + cVal}^{${n}} = ${totalDirect}`} />
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

      {/* Relationship to binomial theorem */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 space-y-2">
        <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-2">
          二項定理との関係
        </div>
        <div className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
          <p>
            二項定理 <K tex="(a+b)^n" /> は多項定理で c = 0 とした特殊ケースです。
          </p>
          <KBlock tex="\binom{n}{k} = \frac{n!}{k!(n-k)!} = \frac{n!}{k!\, (n-k)!\, 0!}" />
          <p>
            同様に、4項以上の展開 <K tex="(a+b+c+d)^n" /> も多項定理で一般化できます。
          </p>
        </div>
      </div>

      {/* HintButton */}
      <HintButton
        hints={[
          {
            step: 1,
            text: "p+q+r=n を満たす非負整数 (p,q,r) の組を全て列挙します",
          },
          {
            step: 2,
            text: "各組 (p,q,r) に対する係数は n!/(p!q!r!) で求まります（多項係数）",
          },
          {
            step: 3,
            text: "これは n 個の文字を p個のa, q個のb, r個のcに分ける場合の数と同じです",
          },
          {
            step: 4,
            text: "全ての項を足し合わせると (a+b+c)^n の完全な展開式になります",
          },
        ]}
      />
    </div>
  );
}
