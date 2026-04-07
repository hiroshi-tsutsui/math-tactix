"use client";

import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { generateRandomProblem, type FunctionProblem } from '../utils/functions-generator';

export default function FunctionQuizViz() {
  const [problem, setProblem] = useState<FunctionProblem>(() => generateRandomProblem());
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    setTotal(prev => prev + 1);
    if (idx === problem.correctIndex) {
      setCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [selected, problem.correctIndex]);

  const nextProblem = useCallback(() => {
    setProblem(generateRandomProblem());
    setSelected(null);
    setShowExplanation(false);
  }, []);

  const isCorrect = selected === problem.correctIndex;

  return (
    <div className="space-y-4">
      {/* Score bar */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
        <div className="flex gap-4 text-xs font-bold">
          <span className="text-slate-500">正解: <span className="text-blue-600">{correct}/{total}</span></span>
          <span className="text-slate-500">連続: <span className="text-amber-600">{streak}</span></span>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {problem.type}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <p className="text-sm font-bold text-slate-900 leading-relaxed">{problem.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {problem.options.map((opt, i) => {
          let bgClass = 'bg-white hover:bg-slate-50 border-slate-200';
          if (selected !== null) {
            if (i === problem.correctIndex) bgClass = 'bg-green-50 border-green-300';
            else if (i === selected) bgClass = 'bg-red-50 border-red-300';
            else bgClass = 'bg-slate-50 border-slate-200 opacity-50';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all ${bgClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {selected !== null && i === problem.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                )}
                {selected !== null && i === selected && i !== problem.correctIndex && (
                  <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '正解!' : '不正解'}
          </p>
          <p className="text-sm text-slate-700">{problem.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={nextProblem}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          次の問題
        </button>
      )}
    </div>
  );
}
