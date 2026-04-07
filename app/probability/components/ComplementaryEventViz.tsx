"use client";

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

type Problem = {
  id: number;
  title: string;
  desc: string;
  n: number;          // number of trials
  sides: number;      // die sides
  targetValue: number; // target face
  // P(at least one targetValue in n rolls) = 1 - ((sides-1)/sides)^n
};

const problems: Problem[] = [
  {
    id: 1,
    title: 'サイコロ2回で「少なくとも1回6」',
    desc: 'サイコロを2回投げて、少なくとも1回は6の目が出る確率',
    n: 2, sides: 6, targetValue: 6,
  },
  {
    id: 2,
    title: 'サイコロ3回で「少なくとも1回6」',
    desc: 'サイコロを3回投げて、少なくとも1回は6の目が出る確率',
    n: 3, sides: 6, targetValue: 6,
  },
  {
    id: 3,
    title: 'サイコロ4回で「少なくとも1回1」',
    desc: 'サイコロを4回投げて、少なくとも1回は1の目が出る確率',
    n: 4, sides: 6, targetValue: 1,
  },
  {
    id: 4,
    title: 'コイン5回で「少なくとも1回表」',
    desc: 'コインを5回投げて、少なくとも1回は表が出る確率',
    n: 5, sides: 2, targetValue: 1,
  },
];

export default function ComplementaryEventViz() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [nTrials, setNTrials] = useState(2);
  const [sides, setSides] = useState(6);
  const [showComplement, setShowComplement] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const prob = problems[currentProblem];

  useEffect(() => {
    setNTrials(prob.n);
    setSides(prob.sides);
    setShowComplement(false);
    setShowAnswer(false);
  }, [currentProblem, prob.n, prob.sides]);

  // Complement probability: P(none) = ((sides-1)/sides)^n
  const pNone = Math.pow((sides - 1) / sides, nTrials);
  const pAtLeastOne = 1 - pNone;

  // For visualization: generate all outcomes (limited to manageable size)
  const totalOutcomes = Math.pow(sides, nTrials);
  const complementOutcomes = Math.pow(sides - 1, nTrials);
  const favorableOutcomes = totalOutcomes - complementOutcomes;

  // Fraction representation
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(favorableOutcomes, totalOutcomes);
  const fracNum = favorableOutcomes / g;
  const fracDen = totalOutcomes / g;
  const gComp = gcd(complementOutcomes, totalOutcomes);
  const fracNumComp = complementOutcomes / gComp;
  const fracDenComp = totalOutcomes / gComp;

  // Bar visualization dimensions
  const barWidth = 400;
  const barHeight = 40;
  const complementWidth = (complementOutcomes / totalOutcomes) * barWidth;
  const favorableWidth = barWidth - complementWidth;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">余事象の確率</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          「少なくとも1つは起こる」確率は、直接数えるより<strong>余事象（1つも起こらない）</strong>を使うと簡単に求められます。
        </p>
        <div className="mt-3 bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
          <MathComponent
            tex="P(\text{少なくとも1つ}) = 1 - P(\text{1つも起こらない})"
            className="text-lg"
          />
        </div>
      </div>

      {/* Problem selector */}
      <div className="flex gap-2 flex-wrap">
        {problems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentProblem(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              currentProblem === i
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
            }`}
          >
            問題 {p.id}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2">{prob.title}</h3>
        <p className="text-sm text-slate-600">{prob.desc}を求めよ。</p>
        <div className="mt-3 text-xs text-slate-400">
          試行回数: {nTrials}回 / {sides === 2 ? 'コイン' : `${sides}面サイコロ`}
        </div>
      </div>

      {/* Interactive slider for custom exploration */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            試行回数 (n): {nTrials}
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={nTrials}
            onChange={e => { setNTrials(Number(e.target.value)); setShowAnswer(false); }}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-500 cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Visualization: stacked bar showing complement vs favorable */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700">全 {totalOutcomes} 通りの内訳</h4>
        <svg viewBox={`0 0 ${barWidth + 20} ${barHeight + 60}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Complement (none) */}
          <rect x={10} y={10} width={complementWidth} height={barHeight} rx={4} fill="#fbbf24" opacity={0.8} />
          {/* Favorable (at least one) */}
          <rect x={10 + complementWidth} y={10} width={favorableWidth} height={barHeight} rx={4} fill="#3b82f6" opacity={0.8} />
          {/* Labels */}
          {complementWidth > 50 && (
            <text x={10 + complementWidth / 2} y={10 + barHeight / 2 + 4} textAnchor="middle" fontSize={11} fill="#92400e" fontWeight="bold">
              {complementOutcomes}通り
            </text>
          )}
          {favorableWidth > 50 && (
            <text x={10 + complementWidth + favorableWidth / 2} y={10 + barHeight / 2 + 4} textAnchor="middle" fontSize={11} fill="white" fontWeight="bold">
              {favorableOutcomes}通り
            </text>
          )}
          {/* Legend */}
          <rect x={10} y={barHeight + 25} width={12} height={12} rx={2} fill="#fbbf24" />
          <text x={28} y={barHeight + 35} fontSize={11} fill="#64748b">{prob.targetValue === 1 && sides === 2 ? '全部裏' : `${prob.targetValue}が0回`} ({complementOutcomes}通り)</text>
          <rect x={barWidth / 2} y={barHeight + 25} width={12} height={12} rx={2} fill="#3b82f6" />
          <text x={barWidth / 2 + 18} y={barHeight + 35} fontSize={11} fill="#64748b">少なくとも1回 ({favorableOutcomes}通り)</text>
        </svg>
      </div>

      {/* Step-by-step solution */}
      <div className="space-y-3">
        <button
          onClick={() => setShowComplement(!showComplement)}
          className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
        >
          {showComplement ? '余事象の計算を隠す' : '余事象で考える（ヒント）'}
        </button>

        {showComplement && (
          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 space-y-3">
            <p className="text-sm text-amber-900 font-bold">STEP 1: 余事象を考える</p>
            <p className="text-sm text-amber-800">
              「少なくとも1回 {prob.targetValue === 1 && sides === 2 ? '表' : prob.targetValue} が出る」の余事象は
              「1回も {prob.targetValue === 1 && sides === 2 ? '表' : prob.targetValue} が出ない」です。
            </p>
            <div className="bg-white p-3 rounded-lg text-center">
              <MathComponent
                tex={`P(\\text{1回も出ない}) = \\left(\\frac{${sides - 1}}{${sides}}\\right)^{${nTrials}} = \\frac{${complementOutcomes}}{${totalOutcomes}}`}
              />
            </div>
            <p className="text-sm text-amber-900 font-bold">STEP 2: 余事象から求める</p>
            <div className="bg-white p-3 rounded-lg text-center">
              <MathComponent
                tex={`P(\\text{少なくとも1回}) = 1 - \\frac{${complementOutcomes}}{${totalOutcomes}} = \\frac{${favorableOutcomes}}{${totalOutcomes}}${g > 1 ? ` = \\frac{${fracNum}}{${fracDen}}` : ''}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Show answer */}
      <div className="space-y-3">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          {showAnswer ? '答えを隠す' : '答えを表示'}
        </button>

        {showAnswer && (
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 text-center space-y-2">
            <p className="text-sm text-blue-800 font-bold">答え</p>
            <div className="text-2xl">
              <MathComponent tex={`\\frac{${fracNum}}{${fracDen}} \\approx ${pAtLeastOne.toFixed(4)}`} />
            </div>
            <p className="text-xs text-blue-600">
              約 {(pAtLeastOne * 100).toFixed(1)}% の確率で少なくとも1回は起こります。
            </p>
          </div>
        )}
      </div>

      {/* Key insight */}
      <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-700 font-bold mb-2">ポイント</p>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>「少なくとも1つ」は直接数えると場合分けが多くなる</li>
          <li>余事象（「1つも起こらない」）は各試行が独立なので掛け算だけで済む</li>
          <li>試行回数 n を増やすと、余事象の確率は急速に小さくなる</li>
        </ul>
      </div>

      <HintButton
        hints={[
          { step: 1, text: "「少なくとも1回起こる」の余事象は「1回も起こらない」です" },
          { step: 2, text: "1回の試行で起こらない確率は (面数-1)/面数 です" },
          { step: 3, text: "n回独立に試行するので、全て起こらない確率は ((面数-1)/面数)^n です" },
          { step: 4, text: "P(少なくとも1回) = 1 - P(1回も起こらない) で求まります" },
        ]}
      />
    </div>
  );
}
