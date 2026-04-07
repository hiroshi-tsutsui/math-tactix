"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface ArithGeometricJudgeVizProps {
  mode?: 'practice';
}

const ArithGeometricJudgeViz: React.FC<ArithGeometricJudgeVizProps> = () => {
  const generateProblem = () => {
    const type = Math.random() < 0.5 ? 'arithmetic' : 'geometric';
    let terms: number[];
    let answer: string;
    let explanation: string;

    if (type === 'arithmetic') {
      const a1 = Math.floor(Math.random() * 10) - 3;
      const d = Math.floor(Math.random() * 7) - 3;
      terms = Array.from({ length: 5 }, (_, i) => a1 + i * d);
      answer = '等差数列';
      explanation = `公差 d = ${d}（隣接する項の差が一定）`;
    } else {
      const a1 = [1, 2, 3, -1, -2][Math.floor(Math.random() * 5)];
      const r = [2, 3, -2, 0.5][Math.floor(Math.random() * 4)];
      terms = Array.from({ length: 5 }, (_, i) => a1 * Math.pow(r, i));
      answer = '等比数列';
      explanation = `公比 r = ${r}（隣接する項の比が一定）`;
    }

    return { terms, answer, explanation };
  };

  const [problem, setProblem] = useState(generateProblem);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleAnswer = (ans: string) => {
    setUserAnswer(ans);
    setShowResult(true);
    setAttempts((prev) => prev + 1);
    if (ans === problem.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setProblem(generateProblem());
    setUserAnswer(null);
    setShowResult(false);
  };

  const differences = problem.terms.slice(1).map((t, i) => t - problem.terms[i]);
  const ratios = problem.terms.slice(1).map((t, i) =>
    problem.terms[i] !== 0 ? t / problem.terms[i] : NaN
  );

  const svgW = 500;
  const svgH = 200;
  const padding = 40;
  const maxVal = Math.max(...problem.terms.map(Math.abs), 1);

  const toX = (i: number) => padding + (i / 4) * (svgW - 2 * padding);
  const toY = (val: number) => {
    const minV = Math.min(0, ...problem.terms);
    const maxV = Math.max(...problem.terms, 1);
    const range = maxV - minV || 1;
    return svgH - padding - ((val - minV) / range) * (svgH - 2 * padding);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          スコア: <span className="font-bold text-blue-600">{score}/{attempts}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-slate-500 mb-2">この数列は等差数列？等比数列？</p>
          <div className="flex gap-4 justify-center text-2xl font-mono font-bold text-slate-800">
            {problem.terms.map((t, i) => (
              <span key={i}>
                {t}
                {i < problem.terms.length - 1 && <span className="text-slate-300">,</span>}
              </span>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto my-4">
          <line
            x1={padding}
            y1={svgH - padding}
            x2={svgW - padding}
            y2={svgH - padding}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          <polyline
            points={problem.terms
              .map((val, i) => `${toX(i)},${toY(val)}`)
              .join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth={2}
            opacity={0.5}
          />
          {problem.terms.map((val, i) => (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(val)}
              r={5}
              fill="#6366f1"
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </svg>

        {!showResult ? (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleAnswer('等差数列')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              等差数列
            </button>
            <button
              onClick={() => handleAnswer('等比数列')}
              className="px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all"
            >
              等比数列
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl text-center font-bold ${
                userAnswer === problem.answer
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {userAnswer === problem.answer ? '正解！' : `不正解。正解は「${problem.answer}」です。`}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
              <p className="font-bold mb-2">{problem.explanation}</p>
              <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
                <div>
                  <span className="text-slate-400">差:</span>{' '}
                  {differences.map((d) => d.toFixed(1)).join(', ')}
                  <span className={differences.every((d) => d === differences[0]) ? ' text-green-600 font-bold' : ' text-slate-400'}>
                    {differences.every((d) => d === differences[0]) ? ' (一定)' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">比:</span>{' '}
                  {ratios.map((r) => (isNaN(r) ? '-' : r.toFixed(2))).join(', ')}
                  <span className={ratios.every((r) => !isNaN(r) && Math.abs(r - ratios[0]) < 0.001) ? ' text-green-600 font-bold' : ' text-slate-400'}>
                    {ratios.every((r) => !isNaN(r) && Math.abs(r - ratios[0]) < 0.001) ? ' (一定)' : ''}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
            >
              次の問題
            </button>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900">
        <p className="font-bold mb-1">判別のポイント</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>隣接する項の<strong>差</strong>が一定 → 等差数列</li>
          <li>隣接する項の<strong>比</strong>が一定 → 等比数列</li>
        </ul>
      </div>

      <HintButton hints={[
        { step: 1, text: '隣接する項の差 aₙ₊₁ - aₙ を計算してみましょう。差が一定なら等差数列です。' },
        { step: 2, text: '隣接する項の比 aₙ₊₁ / aₙ を計算してみましょう。比が一定なら等比数列です。' },
        { step: 3, text: '等差数列なら一般項 aₙ = a₁ + (n-1)d、等比数列なら aₙ = a₁ × rⁿ⁻¹ です。' },
      ]} />
    </div>
  );
};

export default ArithGeometricJudgeViz;
