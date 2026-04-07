"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import katex from "katex";
import HintButton from '../../components/HintButton';

/* ── KaTeX helpers ── */
const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
  }, [tex]);
  return <span ref={ref} />;
};
const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
  }, [tex]);
  return <div ref={ref} />;
};

/* ── math helpers ── */
function primeFactorize(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  if (n < 2) return factors;
  let val = n;
  for (let d = 2; d * d <= val; d++) {
    while (val % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      val = Math.floor(val / d);
    }
  }
  if (val > 1) factors.set(val, (factors.get(val) || 0) + 1);
  return factors;
}

function factorsToTex(factors: Map<number, number>): string {
  if (factors.size === 0) return "1";
  return Array.from(factors.entries())
    .sort(([a], [b]) => a - b)
    .map(([p, e]) => (e === 1 ? String(p) : `${p}^{${e}}`))
    .join(" \\times ");
}

function gcdFromFactors(fA: Map<number, number>, fB: Map<number, number>): Map<number, number> {
  const result = new Map<number, number>();
  for (const [p, eA] of fA) {
    const eB = fB.get(p);
    if (eB !== undefined) {
      result.set(p, Math.min(eA, eB));
    }
  }
  return result;
}

function lcmFromFactors(fA: Map<number, number>, fB: Map<number, number>): Map<number, number> {
  const result = new Map<number, number>(fA);
  for (const [p, eB] of fB) {
    result.set(p, Math.max(result.get(p) || 0, eB));
  }
  return result;
}

function evalFactors(factors: Map<number, number>): number {
  let val = 1;
  for (const [p, e] of factors) val *= Math.pow(p, e);
  return val;
}

/* ── Factor tree node type ── */
interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

function buildFactorTree(n: number): TreeNode {
  if (n < 2) return { value: n };
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      return {
        value: n,
        left: buildFactorTree(d),
        right: buildFactorTree(Math.floor(n / d)),
      };
    }
  }
  return { value: n }; // prime
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;
  }
  return true;
}

/* ── SVG factor tree ── */
const TREE_W = 420;
const TREE_H = 220;

function measureTree(node: TreeNode): { width: number; depth: number } {
  if (!node.left || !node.right) return { width: 1, depth: 1 };
  const l = measureTree(node.left);
  const r = measureTree(node.right);
  return { width: l.width + r.width, depth: 1 + Math.max(l.depth, r.depth) };
}

function renderTreeSVG(
  node: TreeNode,
  x: number,
  y: number,
  hSpan: number,
  vStep: number,
  elements: React.ReactElement[]
) {
  const radius = 18;
  const isLeaf = !node.left || !node.right;
  const fill = isLeaf && isPrime(node.value) ? "#dbeafe" : "#f8fafc";
  const stroke = isLeaf && isPrime(node.value) ? "#3b82f6" : "#94a3b8";
  const textColor = isLeaf && isPrime(node.value) ? "#1d4ed8" : "#334155";

  if (node.left && node.right) {
    const lx = x - hSpan / 2;
    const rx = x + hSpan / 2;
    const childY = y + vStep;
    const leftMeasure = measureTree(node.left);
    const rightMeasure = measureTree(node.right);
    const nextHSpanL = (hSpan / 2) * (leftMeasure.width / Math.max(leftMeasure.width, 1));
    const nextHSpanR = (hSpan / 2) * (rightMeasure.width / Math.max(rightMeasure.width, 1));

    elements.push(
      <line key={`l-${x}-${y}-l`} x1={x} y1={y + radius} x2={lx} y2={childY - radius} stroke="#cbd5e1" strokeWidth={2} />
    );
    elements.push(
      <line key={`l-${x}-${y}-r`} x1={x} y1={y + radius} x2={rx} y2={childY - radius} stroke="#cbd5e1" strokeWidth={2} />
    );

    renderTreeSVG(node.left, lx, childY, nextHSpanL, vStep, elements);
    renderTreeSVG(node.right, rx, childY, nextHSpanR, vStep, elements);
  }

  elements.push(
    <circle key={`c-${x}-${y}`} cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth={2} />
  );
  elements.push(
    <text key={`t-${x}-${y}`} x={x} y={y + 5} textAnchor="middle" fill={textColor} fontWeight="bold" fontSize={14}>
      {node.value}
    </text>
  );
}

/* ── Practice problems ── */
interface PracticePair {
  a: number;
  b: number;
}

const PRACTICE_PAIRS: PracticePair[] = [
  { a: 18, b: 30 },
  { a: 48, b: 60 },
  { a: 56, b: 42 },
];

/* ── Component ── */
export default function PrimeFactorizationViz() {
  const [inputA, setInputA] = useState(24);
  const [inputB, setInputB] = useState(36);
  const [step, setStep] = useState(0); // 0: factorize, 1: GCD, 2: LCM
  const [practiceIdx, setPracticeIdx] = useState<number | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<{ gcd: string; lcm: string }[]>(
    PRACTICE_PAIRS.map(() => ({ gcd: "", lcm: "" }))
  );
  const [practiceChecked, setPracticeChecked] = useState<boolean[]>(PRACTICE_PAIRS.map(() => false));

  const a = Math.max(2, Math.min(999, inputA));
  const b = Math.max(2, Math.min(999, inputB));

  const factorsA = useMemo(() => primeFactorize(a), [a]);
  const factorsB = useMemo(() => primeFactorize(b), [b]);
  const gcdFactors = useMemo(() => gcdFromFactors(factorsA, factorsB), [factorsA, factorsB]);
  const lcmFactors = useMemo(() => lcmFromFactors(factorsA, factorsB), [factorsA, factorsB]);
  const gcdVal = useMemo(() => evalFactors(gcdFactors), [gcdFactors]);
  const lcmVal = useMemo(() => evalFactors(lcmFactors), [lcmFactors]);

  const treeA = useMemo(() => buildFactorTree(a), [a]);
  const treeB = useMemo(() => buildFactorTree(b), [b]);

  const treeAElements: React.ReactElement[] = [];
  const treeBElements: React.ReactElement[] = [];
  const mA = measureTree(treeA);
  const mB = measureTree(treeB);
  const vStepA = Math.min(55, (TREE_H - 40) / Math.max(mA.depth, 1));
  const vStepB = Math.min(55, (TREE_H - 40) / Math.max(mB.depth, 1));
  const hSpanA = Math.min(160, TREE_W / 2 - 20);
  const hSpanB = Math.min(160, TREE_W / 2 - 20);
  renderTreeSVG(treeA, TREE_W / 4, 28, hSpanA, vStepA, treeAElements);
  renderTreeSVG(treeB, (TREE_W * 3) / 4, 28, hSpanB, vStepB, treeBElements);

  // GCD highlight: common prime factors with min exponent
  const allPrimes = new Set([...factorsA.keys(), ...factorsB.keys()]);
  const sortedPrimes = Array.from(allPrimes).sort((x, y) => x - y);

  const checkPractice = useCallback((idx: number) => {
    const pair = PRACTICE_PAIRS[idx];
    const fA = primeFactorize(pair.a);
    const fB = primeFactorize(pair.b);
    const correctGcd = evalFactors(gcdFromFactors(fA, fB));
    const correctLcm = evalFactors(lcmFromFactors(fA, fB));
    const ans = practiceAnswers[idx];
    const isCorrect = Number(ans.gcd) === correctGcd && Number(ans.lcm) === correctLcm;
    setPracticeChecked((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    return isCorrect;
  }, [practiceAnswers]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-bold text-slate-600">整数A:</label>
        <input
          type="number"
          min={2}
          max={999}
          value={inputA}
          onChange={(e) => { setInputA(Number(e.target.value)); setStep(0); }}
          className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono text-sm"
        />
        <label className="text-sm font-bold text-slate-600">整数B:</label>
        <input
          type="number"
          min={2}
          max={999}
          value={inputB}
          onChange={(e) => { setInputB(Number(e.target.value)); setStep(0); }}
          className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono text-sm"
        />
      </div>

      {/* Step navigation */}
      <div className="flex gap-2">
        {["素因数分解", "GCD (最大公約数)", "LCM (最小公倍数)"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              step === i
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step 0: Factor trees */}
      {step === 0 && (
        <div className="space-y-4">
          <svg
            viewBox={`0 0 ${TREE_W} ${TREE_H}`}
            className="w-full max-w-lg mx-auto border border-slate-100 rounded-xl bg-white"
            style={{ minHeight: 200 }}
          >
            {treeAElements}
            {treeBElements}
            <text x={TREE_W / 4} y={TREE_H - 4} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight="bold">
              {a} のファクターツリー
            </text>
            <text x={(TREE_W * 3) / 4} y={TREE_H - 4} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight="bold">
              {b} のファクターツリー
            </text>
            {/* separator */}
            <line x1={TREE_W / 2} y1={0} x2={TREE_W / 2} y2={TREE_H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-400 font-bold mb-1">素因数分解</div>
              <div className="text-center font-bold">
                <K tex={`${a} = ${factorsToTex(factorsA)}`} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="text-xs text-purple-400 font-bold mb-1">素因数分解</div>
              <div className="text-center font-bold">
                <K tex={`${b} = ${factorsToTex(factorsB)}`} />
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">
            ファクターツリーでは、各ノードを素因数で割っていきます。
            <span className="text-blue-600 font-bold">青い丸</span>が素数（これ以上分解できない数）です。
          </p>
        </div>
      )}

      {/* Step 1: GCD */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-400 font-bold mb-3">共通の素因数の最小指数を選ぶ</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 text-slate-500">素因数</th>
                    <th className="py-2 px-2 text-blue-600">{a} の指数</th>
                    <th className="py-2 px-2 text-purple-600">{b} の指数</th>
                    <th className="py-2 px-2 text-green-600 font-black">GCD の指数 (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrimes.map((p) => {
                    const eA = factorsA.get(p) || 0;
                    const eB = factorsB.get(p) || 0;
                    const eGcd = Math.min(eA, eB);
                    const isCommon = eA > 0 && eB > 0;
                    return (
                      <tr key={p} className={isCommon ? "bg-green-50" : ""}>
                        <td className="py-2 px-2 font-bold">{p}</td>
                        <td className="py-2 px-2 text-center text-blue-600">{eA}</td>
                        <td className="py-2 px-2 text-center text-purple-600">{eB}</td>
                        <td className="py-2 px-2 text-center font-black text-green-700">{eGcd > 0 ? eGcd : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <div className="text-xs text-green-500 font-bold mb-1">GCD (最大公約数)</div>
            <div className="font-bold text-lg">
              <K tex={`\\gcd(${a},\\,${b}) = ${gcdFactors.size > 0 ? factorsToTex(gcdFactors) : "1"} = ${gcdVal}`} />
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">
            GCD は「<span className="font-bold text-green-700">共通に含まれる素因数</span>を、<span className="font-bold">小さい方の指数</span>で掛け合わせた数」です。
          </p>
        </div>
      )}

      {/* Step 2: LCM */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-400 font-bold mb-3">各素因数の最大指数を選ぶ</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 text-slate-500">素因数</th>
                    <th className="py-2 px-2 text-blue-600">{a} の指数</th>
                    <th className="py-2 px-2 text-purple-600">{b} の指数</th>
                    <th className="py-2 px-2 text-amber-600 font-black">LCM の指数 (max)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrimes.map((p) => {
                    const eA = factorsA.get(p) || 0;
                    const eB = factorsB.get(p) || 0;
                    const eLcm = Math.max(eA, eB);
                    return (
                      <tr key={p} className="bg-amber-50/50">
                        <td className="py-2 px-2 font-bold">{p}</td>
                        <td className="py-2 px-2 text-center text-blue-600">{eA}</td>
                        <td className="py-2 px-2 text-center text-purple-600">{eB}</td>
                        <td className="py-2 px-2 text-center font-black text-amber-700">{eLcm}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
            <div className="text-xs text-amber-500 font-bold mb-1">LCM (最小公倍数)</div>
            <div className="font-bold text-lg">
              <K tex={`\\text{lcm}(${a},\\,${b}) = ${factorsToTex(lcmFactors)} = ${lcmVal}`} />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center text-sm">
            <K tex={`\\gcd \\times \\text{lcm} = ${gcdVal} \\times ${lcmVal} = ${gcdVal * lcmVal}`} />
            <span className="mx-2 text-slate-400">=</span>
            <K tex={`${a} \\times ${b} = ${a * b}`} />
            <span className="ml-2 text-green-600 font-bold">{gcdVal * lcmVal === a * b ? "(一致)" : ""}</span>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">
            LCM は「<span className="font-bold text-amber-700">全ての素因数</span>を、<span className="font-bold">大きい方の指数</span>で掛け合わせた数」です。
            GCD と LCM の積は元の2数の積に等しくなります。
          </p>
        </div>
      )}

      {/* Practice problems */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-bold text-slate-700 mb-3">練習問題</h3>
        <div className="space-y-4">
          {PRACTICE_PAIRS.map((pair, idx) => {
            const fA = primeFactorize(pair.a);
            const fB = primeFactorize(pair.b);
            const correctGcd = evalFactors(gcdFromFactors(fA, fB));
            const correctLcm = evalFactors(lcmFromFactors(fA, fB));
            const isChecked = practiceChecked[idx];
            const isCorrect = isChecked && Number(practiceAnswers[idx].gcd) === correctGcd && Number(practiceAnswers[idx].lcm) === correctLcm;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  isChecked
                    ? isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <div className="font-bold text-sm mb-2">
                  問{idx + 1}: <K tex={`${pair.a}`} /> と <K tex={`${pair.b}`} /> の GCD と LCM を求めよ
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-xs text-slate-500">GCD =</label>
                  <input
                    type="number"
                    value={practiceAnswers[idx].gcd}
                    onChange={(e) => {
                      const next = [...practiceAnswers];
                      next[idx] = { ...next[idx], gcd: e.target.value };
                      setPracticeAnswers(next);
                      setPracticeChecked((prev) => { const n = [...prev]; n[idx] = false; return n; });
                    }}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center font-mono text-sm"
                  />
                  <label className="text-xs text-slate-500">LCM =</label>
                  <input
                    type="number"
                    value={practiceAnswers[idx].lcm}
                    onChange={(e) => {
                      const next = [...practiceAnswers];
                      next[idx] = { ...next[idx], lcm: e.target.value };
                      setPracticeAnswers(next);
                      setPracticeChecked((prev) => { const n = [...prev]; n[idx] = false; return n; });
                    }}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center font-mono text-sm"
                  />
                  <button
                    onClick={() => checkPractice(idx)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
                  >
                    確認
                  </button>
                </div>
                {isChecked && (
                  <div className={`mt-2 text-xs font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {isCorrect
                      ? "正解!"
                      : `不正解。正解: GCD = ${correctGcd}, LCM = ${correctLcm}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "素因数分解とは、自然数を素数の積で表すことです。" },
        { step: 2, text: "最小の素数 2 から順に割り切れるか試していきます。" },
        { step: 3, text: "割り切れたら商に対して同じ操作を繰り返します。商が 1 になるまで続けます。" },
        { step: 4, text: "素因数分解の結果は一意（素因数分解の一意性）で、約数の個数や最大公約数の計算に活用できます。" }
      ]} />
    </div>
  );
}
