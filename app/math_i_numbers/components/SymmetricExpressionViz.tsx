"use client";

import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

interface DerivationItem {
  label: string;
  formula: string;
  derivation: string;
  value: number;
}

export default function SymmetricExpressionViz() {
  const [s, setS] = useState(5);   // a + b
  const [p, setP] = useState(6);   // ab
  const [showDerivation, setShowDerivation] = useState<Record<string, boolean>>({});

  const discriminant = s * s - 4 * p;
  const realRoots = discriminant >= 0;

  const items: DerivationItem[] = useMemo(() => [
    {
      label: "a² + b²",
      formula: "(a+b)^2 - 2ab = s^2 - 2p",
      derivation: `a^2 + b^2 = (a+b)^2 - 2ab = ${s}^2 - 2 \\times ${p} = ${s * s} - ${2 * p} = ${s * s - 2 * p}`,
      value: s * s - 2 * p,
    },
    {
      label: "(a - b)²",
      formula: "(a+b)^2 - 4ab = s^2 - 4p",
      derivation: `(a-b)^2 = (a+b)^2 - 4ab = ${s}^2 - 4 \\times ${p} = ${s * s} - ${4 * p} = ${s * s - 4 * p}`,
      value: s * s - 4 * p,
    },
    {
      label: "a³ + b³",
      formula: "(a+b)^3 - 3ab(a+b) = s^3 - 3ps",
      derivation: `a^3 + b^3 = (a+b)^3 - 3ab(a+b) = ${s}^3 - 3 \\times ${p} \\times ${s} = ${s * s * s} - ${3 * p * s} = ${s * s * s - 3 * p * s}`,
      value: s * s * s - 3 * p * s,
    },
    {
      label: "a³ - b³",
      formula: "(a-b)(a^2+ab+b^2) = (a-b)\\{(a+b)^2 - ab\\}",
      derivation: discriminant >= 0
        ? `a^3 - b^3 = (a-b)(a^2+ab+b^2)、\\quad (a-b)^2 = ${s * s - 4 * p} なので |a-b| = \\sqrt{${s * s - 4 * p}}`
        : `(a-b)^2 = ${s * s - 4 * p} < 0 のため、実数の範囲では計算不可`,
      value: discriminant >= 0 ? Math.sqrt(discriminant) * (s * s - p) : NaN,
    },
    {
      label: "1/a + 1/b",
      formula: "\\frac{a+b}{ab} = \\frac{s}{p}",
      derivation: p !== 0
        ? `\\frac{1}{a} + \\frac{1}{b} = \\frac{a+b}{ab} = \\frac{${s}}{${p}} ${Number.isInteger(s / p) ? `= ${s / p}` : ''}`
        : `ab = 0 のため、定義されません`,
      value: p !== 0 ? s / p : NaN,
    },
    {
      label: "a⁴ + b⁴",
      formula: "(a^2+b^2)^2 - 2(ab)^2 = (s^2-2p)^2 - 2p^2",
      derivation: `a^4 + b^4 = (a^2+b^2)^2 - 2a^2b^2 = (${s * s - 2 * p})^2 - 2 \\times ${p}^2 = ${(s * s - 2 * p) ** 2} - ${2 * p * p} = ${(s * s - 2 * p) ** 2 - 2 * p * p}`,
      value: (s * s - 2 * p) ** 2 - 2 * p * p,
    },
  ], [s, p, discriminant]);

  const toggleDerivation = (label: string) => {
    setShowDerivation(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const formatValue = (v: number): string => {
    if (isNaN(v)) return "—";
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-indigo-800">
              <InlineMath math="s = a + b" />
            </span>
            <span className="text-lg font-black text-indigo-700 tabular-nums">{s}</span>
          </label>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={s}
            onChange={(e) => setS(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-indigo-400 mt-1">
            <span>-10</span><span>0</span><span>10</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-emerald-800">
              <InlineMath math="p = ab" />
            </span>
            <span className="text-lg font-black text-emerald-700 tabular-nums">{p}</span>
          </label>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-emerald-400 mt-1">
            <span>-10</span><span>0</span><span>10</span>
          </div>
        </div>
      </div>

      {/* Discriminant info */}
      <div className={`rounded-xl p-3 text-sm border ${realRoots
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-orange-50 border-orange-200 text-orange-800'
      }`}>
        <InlineMath math={`s^2 - 4p = ${s * s} - ${4 * p} = ${discriminant}`} />
        {realRoots
          ? <span className="ml-2 font-bold">≥ 0 → a, b は実数として存在</span>
          : <span className="ml-2 font-bold">&lt; 0 → a, b は虚数（複素数）</span>
        }
      </div>

      {/* Result table */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700 w-24">
                  <InlineMath math={item.label.replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4')} />
                </span>
                <span className="text-xs text-slate-400">
                  <InlineMath math={`= ${item.formula}`} />
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-indigo-700 tabular-nums min-w-[60px] text-right">
                  {formatValue(item.value)}
                </span>
                <button
                  onClick={() => toggleDerivation(item.label)}
                  className="px-3 py-1 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {showDerivation[item.label] ? '閉じる' : '導出'}
                </button>
              </div>
            </div>

            {showDerivation[item.label] && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                <BlockMath math={item.derivation} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key formulas summary */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <h4 className="font-bold text-indigo-900 mb-3 text-sm">基本公式まとめ</h4>
        <div className="space-y-2 text-sm">
          <BlockMath math="a^2 + b^2 = (a+b)^2 - 2ab" />
          <BlockMath math="(a-b)^2 = (a+b)^2 - 4ab" />
          <BlockMath math="a^3 + b^3 = (a+b)^3 - 3ab(a+b)" />
          <BlockMath math="\frac{1}{a} + \frac{1}{b} = \frac{a+b}{ab}" />
          <BlockMath math="a^4 + b^4 = (a^2+b^2)^2 - 2(ab)^2" />
        </div>
      </div>

      <HintButton hints={[
        { step: 1, text: "対称式は a+b（和）と ab（積）の2つの基本対称式ですべて表現できます。" },
        { step: 2, text: "a² + b² を求めるには (a+b)² = a² + 2ab + b² を変形して a² + b² = (a+b)² - 2ab とします。" },
        { step: 3, text: "a³ + b³ は (a+b)³ を展開して整理すると (a+b)³ - 3ab(a+b) = s³ - 3ps で求められます。" },
        { step: 4, text: "分数式 1/a + 1/b も通分すれば (a+b)/ab = s/p と基本対称式で表せます。" },
      ]} />
    </div>
  );
}
