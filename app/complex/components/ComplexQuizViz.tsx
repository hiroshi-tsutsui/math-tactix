"use client";

import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
import {
  generateAdditionProblem,
  generateSubtractionProblem,
  generateMultiplicationProblem,
  generateDivisionProblem,
  generateConjugateProblem,
  generateModulusProblem,
  generatePolarProblem,
  generatePowerProblem,
  type ComplexProblem
} from '../utils/complex-generator';

type GeneratorKey = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'conjugate' | 'modulus' | 'polar' | 'powers' | 'random';

const generators: Record<Exclude<GeneratorKey, 'random'>, () => ComplexProblem> = {
  addition: generateAdditionProblem,
  subtraction: generateSubtractionProblem,
  multiplication: generateMultiplicationProblem,
  division: generateDivisionProblem,
  conjugate: generateConjugateProblem,
  modulus: generateModulusProblem,
  polar: generatePolarProblem,
  powers: generatePowerProblem,
};

const categoryLabels: Record<string, string> = {
  addition: '加法',
  subtraction: '減法',
  multiplication: '乗法',
  division: '除法',
  conjugate: '共役',
  modulus: '絶対値',
  argument: '偏角',
  polar: '極形式',
  powers: 'べき乗',
  random: 'ランダム',
};

const categoryNames: Record<GeneratorKey, string> = {
  addition: '加法',
  subtraction: '減法',
  multiplication: '乗法',
  division: '除法',
  conjugate: '共役',
  modulus: '絶対値',
  polar: '極形式',
  powers: 'べき乗',
  random: 'ランダム',
};

function getRandomGenerator(): () => ComplexProblem {
  const keys = Object.keys(generators) as Array<Exclude<GeneratorKey, 'random'>>;
  const key = keys[Math.floor(Math.random() * keys.length)];
  return generators[key];
}

export default function ComplexQuizViz() {
  const [category, setCategory] = useState<GeneratorKey>('random');
  const [problem, setProblem] = useState<ComplexProblem | null>(null);
  const [ansRe, setAnsRe] = useState('');
  const [ansIm, setAnsIm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [stats, setStats] = useState({ total: 0, correct: 0 });

  const generateNewProblem = useCallback(() => {
    const gen = category === 'random' ? getRandomGenerator() : generators[category];
    setProblem(gen());
    setAnsRe('');
    setAnsIm('');
    setSubmitted(false);
    setCorrect(false);
    setShowSteps(false);
  }, [category]);

  const handleSubmit = () => {
    if (!problem) return;
    const userRe = parseFloat(ansRe) || 0;
    const userIm = parseFloat(ansIm) || 0;

    const tolerance = 0.15;
    let isCorrect = false;

    if (problem.type === 'modulus') {
      isCorrect = Math.abs(userRe - (problem.answer.modulus ?? 0)) < tolerance;
    } else {
      isCorrect = Math.abs(userRe - problem.answer.re) < tolerance && Math.abs(userIm - problem.answer.im) < tolerance;
    }

    setCorrect(isCorrect);
    setSubmitted(true);
    setStats(prev => ({ total: prev.total + 1, correct: prev.correct + (isCorrect ? 1 : 0) }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          複素数クイズ
        </h3>

        {/* Category selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(categoryNames) as GeneratorKey[]).map(key => (
            <button key={key} onClick={() => setCategory(key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${category === key ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {categoryNames[key]}
            </button>
          ))}
        </div>

        {!problem ? (
          <div className="text-center py-12">
            <button onClick={generateNewProblem} className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition">
              問題を生成
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Problem display */}
            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <div className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-2">{categoryLabels[problem.type] ?? problem.type}</div>
              <MathDisplay tex={problem.questionTex} displayMode className="text-white text-lg" />
            </div>

            {/* Answer input */}
            {!submitted ? (
              <div className="space-y-4">
                <div className="text-xs text-slate-500 italic">{problem.hint}</div>
                <div className="grid grid-cols-2 gap-4">
                  {problem.type === 'modulus' ? (
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-400 block mb-1">絶対値</label>
                      <input type="number" step="0.1" value={ansRe} onChange={e => setAnsRe(e.target.value)} placeholder="例: 5" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">実部 (Re)</label>
                        <input type="number" step="0.5" value={ansRe} onChange={e => setAnsRe(e.target.value)} placeholder="例: 3" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">虚部 (Im)</label>
                        <input type="number" step="0.5" value={ansIm} onChange={e => setAnsIm(e.target.value)} placeholder="例: -2" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </>
                  )}
                </div>
                <button onClick={handleSubmit} className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition">
                  回答する
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`rounded-xl p-4 text-center font-bold text-lg ${correct ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  {correct ? '正解!' : '不正解'}
                </div>

                {!correct && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-sm font-bold text-slate-700 mb-2">正解:</div>
                    {problem.type === 'modulus' ? (
                      <MathDisplay tex={`|z| \\approx ${(problem.answer.modulus ?? 0).toFixed(3)}`} />
                    ) : (
                      <MathDisplay tex={`${problem.answer.re} ${problem.answer.im >= 0 ? '+' : '-'} ${Math.abs(problem.answer.im)}i`} />
                    )}
                  </div>
                )}

                <button onClick={() => setShowSteps(!showSteps)} className="text-sm text-blue-600 font-bold hover:underline">
                  {showSteps ? '解法を隠す' : '解法を表示'}
                </button>

                {showSteps && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2">
                    {problem.steps.map((s, i) => (
                      <div key={i} className="text-sm text-blue-800 font-mono">{i + 1}. {s}</div>
                    ))}
                  </div>
                )}

                <button onClick={generateNewProblem} className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition">
                  次の問題
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-slate-500">問題数: <strong>{stats.total}</strong></span>
              <span className="text-green-600">正解: <strong>{stats.correct}</strong></span>
              <span className="text-slate-500">
                正答率: <strong>{stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0}%</strong>
              </span>
            </div>
          </div>
        )}

        <HintButton hints={[
          { step: 1, text: '複素数の四則演算: 加減は成分ごと、乗除は分配法則と i² = -1 を使います。' },
          { step: 2, text: '極形式では乗法は「絶対値の積、偏角の和」、除法は「絶対値の商、偏角の差」です。' },
          { step: 3, text: '共役複素数を使った除法や、ド・モアブルの定理も確認しましょう。' },
        ]} />
      </div>
    </div>
  );
}
