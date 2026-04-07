"use client";

import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import {
  generateComponentsProblem,
  generateAdditionProblem,
  generateMagnitudeProblem,
  generateDotProductProblem,
  generateAngleProblem,
  generatePerpendicularProblem,
  generateScalarProblem,
  VectorProblem,
} from '../utils/vectors-generator';

type ProblemType = 'components' | 'addition' | 'magnitude' | 'dotProduct' | 'angle' | 'perpendicular' | 'scalar' | 'random';

interface GeneratorEntry {
  label: string;
  fn: () => VectorProblem;
}

const generators: Record<Exclude<ProblemType, 'random'>, GeneratorEntry> = {
  components: { label: '成分計算（和の x 成分）', fn: generateComponentsProblem },
  addition: { label: '成分計算（和の y 成分）', fn: generateAdditionProblem },
  scalar: { label: 'スカラー倍', fn: generateScalarProblem },
  magnitude: { label: 'ベクトルの大きさ', fn: generateMagnitudeProblem },
  dotProduct: { label: '内積', fn: generateDotProductProblem },
  angle: { label: 'なす角', fn: generateAngleProblem },
  perpendicular: { label: '垂直条件', fn: generatePerpendicularProblem },
};

const generatorKeys = Object.keys(generators) as Exclude<ProblemType, 'random'>[];

function pickRandom(): VectorProblem {
  const key = generatorKeys[Math.floor(Math.random() * generatorKeys.length)];
  return generators[key].fn();
}

function generateByType(type: ProblemType): VectorProblem {
  if (type === 'random') return pickRandom();
  return generators[type].fn();
}

const VectorsQuizViz: React.FC = () => {
  const [problemType, setProblemType] = useState<ProblemType>('random');
  const [problem, setProblem] = useState<VectorProblem>(() => generateByType('random'));
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const handleGenerate = useCallback(() => {
    setProblem(generateByType(problemType));
    setUserAnswer('');
    setResult(null);
    setShowSteps(false);
  }, [problemType]);

  const handleCheck = useCallback(() => {
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) return;

    const tolerance = problem.type === 'magnitude' || problem.type === 'perpendicular' ? 0.01 : 0.5;
    const isCorrect = Math.abs(parsed - problem.answer) < tolerance;

    setResult(isCorrect ? 'correct' : 'incorrect');
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [userAnswer, problem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCheck();
    },
    [handleCheck]
  );

  return (
    <div className="space-y-6">
      {/* Problem type selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-sm font-bold text-slate-500">出題タイプ:</label>
        <select
          value={problemType}
          onChange={(e) => setProblemType(e.target.value as ProblemType)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="random">ランダム</option>
          {generatorKeys.map((key) => (
            <option key={key} value={key}>
              {generators[key].label}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          className="ml-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          新しい問題
        </button>
      </div>

      {/* Problem display */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">問題</div>
        <div className="text-center py-4">
          <MathDisplay tex={problem.question} displayMode />
        </div>
        <div className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-2">
          <span className="font-bold">ヒント:</span> <MathDisplay tex={problem.hint} />
        </div>
      </div>

      {/* Vector visualization */}
      <div className="bg-white rounded-xl border border-slate-100 p-2">
        <svg viewBox="-6 -6 12 12" className="w-full max-w-xs mx-auto" style={{ aspectRatio: '1' }}>
          {Array.from({ length: 11 }, (_, i) => {
            const v = i - 5;
            return (
              <g key={i}>
                <line x1={-5} y1={v} x2={5} y2={v} stroke="#e2e8f0" strokeWidth={0.04} />
                <line x1={v} y1={-5} x2={v} y2={5} stroke="#e2e8f0" strokeWidth={0.04} />
              </g>
            );
          })}
          <line x1={-5} y1={0} x2={5} y2={0} stroke="#94a3b8" strokeWidth={0.08} />
          <line x1={0} y1={-5} x2={0} y2={5} stroke="#94a3b8" strokeWidth={0.08} />

          <defs>
            <marker id="arrow-quiz-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-quiz-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>

          <line x1={0} y1={0} x2={problem.vector_a[0]} y2={-problem.vector_a[1]} stroke="#3b82f6" strokeWidth={0.12} markerEnd="url(#arrow-quiz-a)" />
          {(problem.vector_b[0] !== 0 || problem.vector_b[1] !== 0) && (
            <line x1={0} y1={0} x2={problem.vector_b[0]} y2={-problem.vector_b[1]} stroke="#f59e0b" strokeWidth={0.12} markerEnd="url(#arrow-quiz-b)" />
          )}
        </svg>
      </div>

      {/* Answer input */}
      <div className="flex gap-3 items-center">
        <input
          type="number"
          step="any"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="答えを入力…"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <button
          onClick={handleCheck}
          disabled={!userAnswer}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          判定
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-xl p-4 text-sm font-bold ${
            result === 'correct'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {result === 'correct' ? '正解！' : <span>不正解。正解は {problem.answer} です。</span>}
        </div>
      )}

      {/* Steps */}
      {result && (
        <div>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="text-sm text-blue-600 font-bold hover:underline"
          >
            {showSteps ? '解説を閉じる' : '解説を見る'}
          </button>
          {showSteps && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              {problem.steps.map((step, i) => (
                <div key={i} className="text-sm text-blue-800">
                  <MathDisplay tex={step} displayMode />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-slate-400 text-right">
        正答率: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%（{stats.correct}/{stats.total}）
      </div>
    </div>
  );
};

export default VectorsQuizViz;
