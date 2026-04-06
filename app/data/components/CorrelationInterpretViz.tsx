"use client";

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

type Pattern = 'positive' | 'negative' | 'none' | 'nonlinear';

type QuizItem = {
  pattern: Pattern;
  points: { x: number; y: number }[];
  correctR: number;
};

function generatePattern(pattern: Pattern): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const n = 20;
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * 80 + 10;
    let x: number, y: number;
    switch (pattern) {
      case 'positive': {
        x = t + (Math.random() - 0.5) * 10;
        y = t * 0.8 + 10 + (Math.random() - 0.5) * 12;
        break;
      }
      case 'negative': {
        x = t + (Math.random() - 0.5) * 10;
        y = 90 - t * 0.8 + (Math.random() - 0.5) * 12;
        break;
      }
      case 'none': {
        x = Math.random() * 80 + 10;
        y = Math.random() * 80 + 10;
        break;
      }
      case 'nonlinear': {
        x = t + (Math.random() - 0.5) * 8;
        const mid = 50;
        y = 0.02 * (t - mid) * (t - mid) + 20 + (Math.random() - 0.5) * 8;
        break;
      }
    }
    pts.push({ x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) });
  }
  return pts;
}

function computeR(pts: { x: number; y: number }[]): number {
  const n = pts.length;
  if (n < 2) return 0;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
  for (const p of pts) {
    sx += p.x; sy += p.y; sxy += p.x * p.y;
    sx2 += p.x * p.x; sy2 += p.y * p.y;
  }
  const num = n * sxy - sx * sy;
  const den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
  return den === 0 ? 0 : num / den;
}

function makeQuiz(): QuizItem[] {
  const patterns: Pattern[] = ['positive', 'negative', 'none', 'nonlinear'];
  const shuffled = patterns.sort(() => Math.random() - 0.5);
  return shuffled.map(p => {
    const points = generatePattern(p);
    return { pattern: p, points, correctR: computeR(points) };
  });
}

const patternLabel: Record<Pattern, string> = {
  positive: '強い正の相関',
  negative: '強い負の相関',
  none: '相関なし',
  nonlinear: '非線形の関係（相関係数は弱い）',
};

const patternColor: Record<Pattern, string> = {
  positive: 'text-blue-600',
  negative: 'text-red-600',
  none: 'text-slate-500',
  nonlinear: 'text-amber-600',
};

export default function CorrelationInterpretViz({ onComplete }: { onComplete?: () => void }) {
  const [quiz, setQuiz] = useState<QuizItem[]>(() => makeQuiz());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = quiz[currentIdx];

  const svgWidth = 500;
  const svgHeight = 400;
  const margin = 40;

  const xScale = (v: number) => margin + (v / 100) * (svgWidth - margin * 2);
  const yScale = (v: number) => margin + ((100 - v) / 100) * (svgHeight - margin * 2);

  const handleAnswer = (answer: Pattern) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === current.pattern) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      if (score >= 3 && onComplete) {
        onComplete();
      }
    }
  };

  const handleRetry = () => {
    setQuiz(makeQuiz());
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const choices: { value: Pattern; label: string }[] = [
    { value: 'positive', label: '強い正の相関 (r ≈ 1)' },
    { value: 'negative', label: '強い負の相関 (r ≈ -1)' },
    { value: 'none', label: '相関なし (r ≈ 0)' },
    { value: 'nonlinear', label: '非線形の関係' },
  ];

  if (completed) {
    return (
      <div className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">結果</h2>
        <p className="text-5xl font-black text-blue-600">{score} / {quiz.length}</p>
        <p className="text-slate-500">
          {score >= 3
            ? '素晴らしい！相関係数の意味を正しく理解しています。'
            : 'もう少し練習しましょう。散布図のパターンと r の関係を確認してください。'}
        </p>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 inline-block">
          <MathComponent tex="r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \cdot \sum (y_i - \bar{y})^2}}" className="text-lg" />
        </div>
        <div>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            もう一度挑戦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          問題 {currentIdx + 1} / {quiz.length}
        </h2>
        <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          スコア: {score}
        </div>
      </div>

      <p className="text-sm text-slate-600">
        下の散布図を見て、相関のパターンを選んでください。
      </p>

      {/* Scatter plot */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line x1={xScale(v)} y1={margin} x2={xScale(v)} y2={svgHeight - margin} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={margin} y1={yScale(v)} x2={svgWidth - margin} y2={yScale(v)} stroke="#f1f5f9" strokeWidth={1} />
            </g>
          ))}
          {/* Axes */}
          <line x1={margin} y1={svgHeight - margin} x2={svgWidth - margin} y2={svgHeight - margin} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={margin} y1={margin} x2={margin} y2={svgHeight - margin} stroke="#94a3b8" strokeWidth={1.5} />
          {/* Points */}
          {current.points.map((p, i) => (
            <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={5} fill="#3b82f6" opacity={0.7} />
          ))}
          {/* Labels */}
          <text x={svgWidth / 2} y={svgHeight - 8} textAnchor="middle" fontSize={12} fill="#64748b">x</text>
          <text x={12} y={svgHeight / 2} textAnchor="middle" fontSize={12} fill="#64748b" transform={`rotate(-90, 12, ${svgHeight / 2})`}>y</text>
        </svg>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map(ch => {
          let bg = 'bg-white border-slate-200 hover:border-blue-400';
          if (showResult) {
            if (ch.value === current.pattern) {
              bg = 'bg-green-50 border-green-400';
            } else if (ch.value === selectedAnswer && ch.value !== current.pattern) {
              bg = 'bg-red-50 border-red-400';
            } else {
              bg = 'bg-slate-50 border-slate-200 opacity-60';
            }
          }
          return (
            <button
              key={ch.value}
              onClick={() => handleAnswer(ch.value)}
              disabled={showResult}
              className={`p-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${bg}`}
            >
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showResult && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${selectedAnswer === current.pattern ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className="text-sm font-bold mb-1">
              {selectedAnswer === current.pattern ? '正解！' : '不正解'}
            </p>
            <p className="text-sm text-slate-600">
              この散布図は<span className={`font-bold ${patternColor[current.pattern]}`}>{patternLabel[current.pattern]}</span>を示しています。
              実際の相関係数は <span className="font-mono font-bold">r = {current.correctR.toFixed(3)}</span> です。
            </p>
            {current.pattern === 'nonlinear' && (
              <p className="text-xs text-amber-700 mt-2">
                相関係数は直線的な関係の強さを測る指標です。非線形の関係がある場合でも r は小さくなります。
              </p>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            {currentIdx < quiz.length - 1 ? '次の問題へ' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
}
