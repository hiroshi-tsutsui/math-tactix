"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface LogComparisonVizProps {
  mode?: 'explore';
}

const LogComparisonViz: React.FC<LogComparisonVizProps> = () => {
  const [base, setBase] = useState(2);
  const [valA, setValA] = useState(3);
  const [valB, setValB] = useState(5);

  const logA = Math.log(valA) / Math.log(base);
  const logB = Math.log(valB) / Math.log(base);

  const comparison = logA > logB ? '>' : logA < logB ? '<' : '=';

  const generateProblem = () => {
    const bases = [2, 3, 5, 10];
    const b = bases[Math.floor(Math.random() * bases.length)];
    const a = Math.floor(Math.random() * 20) + 2;
    const c = Math.floor(Math.random() * 20) + 2;
    return { base: b, a, b: c };
  };

  const [quizProblem, setQuizProblem] = useState(generateProblem);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  const quizLogA = Math.log(quizProblem.a) / Math.log(quizProblem.base);
  const quizLogB = Math.log(quizProblem.b) / Math.log(quizProblem.base);
  const quizCorrect = quizLogA > quizLogB ? '>' : quizLogA < quizLogB ? '<' : '=';

  const handleQuizAnswer = (ans: string) => {
    setQuizAnswer(ans);
    setQuizResult(ans === quizCorrect);
  };

  // Number line visualization
  const svgW = 500;
  const svgH = 120;
  const padding = 40;
  const lineY = svgH / 2;
  const minLog = Math.min(logA, logB, 0) - 0.5;
  const maxLog = Math.max(logA, logB, 1) + 0.5;
  const logRange = maxLog - minLog || 1;

  const toX = (v: number) => padding + ((v - minLog) / logRange) * (svgW - 2 * padding);

  return (
    <div className="space-y-6">
      {/* Explorer */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`\\log_{${base}} ${valA} ${comparison} \\log_{${base}} ${valB}`}
            displayMode
          />
          <div className="text-sm text-slate-500">
            <MathDisplay tex={`\\log_{${base}} ${valA} \\approx ${logA.toFixed(4)}`} />
            {' , '}
            <MathDisplay tex={`\\log_{${base}} ${valB} \\approx ${logB.toFixed(4)}`} />
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto">
          {/* Number line */}
          <line x1={padding} y1={lineY} x2={svgW - padding} y2={lineY} stroke="#94a3b8" strokeWidth={2} />

          {/* Zero mark */}
          <line x1={toX(0)} y1={lineY - 8} x2={toX(0)} y2={lineY + 8} stroke="#94a3b8" strokeWidth={2} />
          <text x={toX(0)} y={lineY + 24} textAnchor="middle" fontSize={10} fill="#94a3b8">0</text>

          {/* Value A */}
          <circle cx={toX(logA)} cy={lineY} r={8} fill="#3b82f6" stroke="white" strokeWidth={2} />
          <text x={toX(logA)} y={lineY - 16} textAnchor="middle" fontSize={11} fill="#3b82f6" fontWeight="bold">
            log_{base}({valA}) = {logA.toFixed(2)}
          </text>

          {/* Value B */}
          <circle cx={toX(logB)} cy={lineY} r={8} fill="#ec4899" stroke="white" strokeWidth={2} />
          <text x={toX(logB)} y={lineY + 30} textAnchor="middle" fontSize={11} fill="#ec4899" fontWeight="bold">
            log_{base}({valB}) = {logB.toFixed(2)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">底</span>
            <span className="font-bold text-blue-600">{base}</span>
          </div>
          <input type="range" min={2} max={10} step={1} value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">値 A</span>
            <span className="font-bold text-blue-600">{valA}</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={valA} onChange={(e) => setValA(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">値 B</span>
            <span className="font-bold text-pink-600">{valB}</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={valB} onChange={(e) => setValB(Number(e.target.value))} className="w-full accent-pink-600" />
        </div>
      </div>

      {/* Quiz */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="font-bold text-sm mb-4">練習: 大小を比較しよう</h4>
        <div className="text-center mb-4">
          <MathDisplay
            tex={`\\log_{${quizProblem.base}} ${quizProblem.a} \\quad \\boxed{?} \\quad \\log_{${quizProblem.base}} ${quizProblem.b}`}
            displayMode
          />
        </div>

        {quizAnswer === null ? (
          <div className="flex gap-3 justify-center">
            {['<', '=', '>'].map((sym) => (
              <button
                key={sym}
                onClick={() => handleQuizAnswer(sym)}
                className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-lg hover:bg-blue-100 transition-all"
              >
                {sym}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl text-center font-bold text-sm ${
              quizResult ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {quizResult ? '正解！' : `不正解。正解は「${quizCorrect}」です。`}
              <div className="font-normal text-xs mt-1">
                <MathDisplay tex={`\\log_{${quizProblem.base}} ${quizProblem.a} \\approx ${quizLogA.toFixed(3)}`} />
                {', '}
                <MathDisplay tex={`\\log_{${quizProblem.base}} ${quizProblem.b} \\approx ${quizLogB.toFixed(3)}`} />
              </div>
            </div>
            <button
              onClick={() => {
                setQuizProblem(generateProblem());
                setQuizAnswer(null);
                setQuizResult(null);
              }}
              className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all"
            >
              次の問題
            </button>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900">
        <p className="font-bold mb-1">大小比較のポイント</p>
        <p className="mt-1">
          底 <MathDisplay tex="a > 1" /> のとき、<MathDisplay tex="\\log_a" /> は単調増加なので
          真数の大小がそのまま対数の大小になります。底が異なる場合は底の変換公式で統一します。
        </p>
      </div>
    </div>
  );
};

export default LogComparisonViz;
