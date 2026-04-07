"use client";

import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import {
  generateArithmeticProblem,
  generateArithmeticSumProblem,
  generateGeometricProblem,
  generateGeometricSumProblem,
  generateSigmaProblem,
  generateRecurrenceProblem,
  generateInfiniteSeriesProblem,
  SequenceProblem,
} from '../utils/sequences-generator';

type ProblemType = 'arithmetic' | 'arithmeticSum' | 'geometric' | 'geometricSum' | 'sigma' | 'recurrence' | 'infinite' | 'random';

interface GeneratorEntry {
  label: string;
  fn: () => SequenceProblem;
}

const generators: Record<Exclude<ProblemType, 'random'>, GeneratorEntry> = {
  arithmetic: { label: '等差数列の一般項', fn: generateArithmeticProblem },
  arithmeticSum: { label: '等差数列の和', fn: generateArithmeticSumProblem },
  geometric: { label: '等比数列の一般項', fn: generateGeometricProblem },
  geometricSum: { label: '等比数列の和', fn: generateGeometricSumProblem },
  sigma: { label: 'シグマ計算', fn: generateSigmaProblem },
  recurrence: { label: '漸化式', fn: generateRecurrenceProblem },
  infinite: { label: '無限等比級数', fn: generateInfiniteSeriesProblem },
};

const generatorKeys = Object.keys(generators) as Exclude<ProblemType, 'random'>[];

function pickRandom(): SequenceProblem {
  const key = generatorKeys[Math.floor(Math.random() * generatorKeys.length)];
  return generators[key].fn();
}

function generateByType(type: ProblemType): SequenceProblem {
  if (type === 'random') return pickRandom();
  return generators[type].fn();
}

const SequencesQuizViz: React.FC = () => {
  const [problemType, setProblemType] = useState<ProblemType>('random');
  const [problem, setProblem] = useState<SequenceProblem>(() => generateByType('random'));
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

    const expected = typeof problem.answer === 'number' ? problem.answer : parseFloat(String(problem.answer));
    const isCorrect = Math.abs(parsed - expected) < 0.01;

    setResult(isCorrect ? 'correct' : 'incorrect');
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [userAnswer, problem.answer]);

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

        {/* Hint */}
        <div className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-2">
          <span className="font-bold">ヒント:</span> <MathDisplay tex={problem.hint} />
        </div>
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
          {result === 'correct' ? (
            '正解！'
          ) : (
            <span>
              不正解。正解は{' '}
              <MathDisplay
                tex={
                  typeof problem.answer === 'number'
                    ? String(problem.answer)
                    : String(problem.answer)
                }
              />{' '}
              です。
            </span>
          )}
        </div>
      )}

      {/* Steps toggle */}
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

      {/* Stats */}
      <div className="text-xs text-slate-400 text-right">
        正答率: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%（{stats.correct}/{stats.total}）
      </div>
    </div>
  );
};

export default SequencesQuizViz;
