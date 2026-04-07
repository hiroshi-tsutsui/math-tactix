"use client";

import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';
import {
  generateAdditionProblem,
  generateMultiplicationProblem,
  generateDeterminantProblem,
  generateInverseProblem,
  generateScalarMulProblem,
  generateSubtractionProblem,
  type MatrixProblem,
} from '../utils/matrices-generator';

type QuizCategory = 'addition' | 'subtraction' | 'scalarMul' | 'matMul' | 'determinant' | 'inverse';

interface CategoryInfo {
  label: string;
  generator: () => MatrixProblem;
}

const CATEGORIES: Record<QuizCategory, CategoryInfo> = {
  addition: { label: '加法', generator: generateAdditionProblem },
  subtraction: { label: '減法', generator: generateSubtractionProblem },
  scalarMul: { label: 'スカラー倍', generator: generateScalarMulProblem },
  matMul: { label: '行列の積', generator: generateMultiplicationProblem },
  determinant: { label: '行列式', generator: generateDeterminantProblem },
  inverse: { label: '逆行列', generator: generateInverseProblem },
};

const MatricesQuizViz: React.FC = () => {
  const [category, setCategory] = useState<QuizCategory>('addition');
  const [problem, setProblem] = useState<MatrixProblem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [userInput, setUserInput] = useState('');

  const generateNewProblem = useCallback(() => {
    const cat = CATEGORIES[category];
    setProblem(cat.generator());
    setShowAnswer(false);
    setUserInput('');
  }, [category]);

  const handleCheck = () => {
    if (!problem) return;
    setShowAnswer(true);
    setTotal(t => t + 1);

    // Simple check: for determinant, compare number; otherwise show correct answer
    if (problem.type === 'determinant') {
      const userNum = parseFloat(userInput);
      if (!isNaN(userNum) && userNum === problem.answer) {
        setScore(s => s + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">行列クイズ</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          カテゴリを選んでランダム問題に挑戦しましょう。
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.entries(CATEGORIES) as [QuizCategory, CategoryInfo][]).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => { setCategory(key); setProblem(null); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              category === key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex justify-center gap-6 text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          出題数: <span className="font-bold text-slate-800 dark:text-white">{total}</span>
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          正解数: <span className="font-bold text-green-600 dark:text-green-400">{score}</span>
        </span>
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <button
          onClick={generateNewProblem}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-md"
        >
          {problem ? '次の問題' : '問題を生成'}
        </button>
      </div>

      {/* Problem display */}
      {problem && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">問題</p>
            <MathDisplay tex={problem.question} displayMode />
          </div>

          {/* User input for determinant */}
          {problem.type === 'determinant' && !showAnswer && (
            <div className="flex justify-center items-center gap-3">
              <input
                type="number"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="答えを入力"
                className="w-32 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
              />
              <button
                onClick={handleCheck}
                className="px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
              >
                確認
              </button>
            </div>
          )}

          {/* Show answer button for non-determinant */}
          {problem.type !== 'determinant' && !showAnswer && (
            <div className="flex justify-center">
              <button
                onClick={() => { setShowAnswer(true); setTotal(t => t + 1); }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-colors"
              >
                解答を表示
              </button>
            </div>
          )}

          {/* Answer */}
          {showAnswer && (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800 text-center">
                <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">解答</p>
                <MathDisplay tex={problem.answerTex} displayMode />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">解法ステップ</p>
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {problem.steps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-blue-400 font-bold">{i + 1}.</span>
                      <MathDisplay tex={step} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-700 text-center text-sm text-amber-700 dark:text-amber-400">
                <span className="font-bold">ヒント:</span> {problem.hint}
              </div>
            </div>
          )}
        </div>
      )}

      <HintButton hints={[
        { step: 1, text: '行列の積は「行 × 列の内積」。(AB)ᵢⱼ は A の第i行と B の第j列を対応する成分同士掛けて足します。' },
        { step: 2, text: '行列式 det[[a,b],[c,d]] = ad - bc。逆行列の存在判定に使います。' },
        { step: 3, text: '逆行列 A⁻¹ = (1/det A)[[d,-b],[-c,a]]。det A = 0 なら逆行列は存在しません。' },
      ]} />
    </div>
  );
};

export default MatricesQuizViz;
