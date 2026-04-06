"use client";

import React, { useState } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';
import MathComponent from './MathComponent';

type IdentityProblem = {
  givenTex: string;
  givenValue: string;
  range: string;
  rangeTex: string;
  askTex: string;
  answer: string;
  options: string[];
  solutionSteps: string[];
};

function generateIdentityProblems(): IdentityProblem[] {
  return [
    {
      givenTex: "\\sin \\theta = \\frac{3}{5}",
      givenValue: "3/5",
      range: "acute",
      rangeTex: "0^\\circ < \\theta < 90^\\circ",
      askTex: "\\cos \\theta",
      answer: "4/5",
      options: ["4/5", "3/4", "-4/5", "5/3"],
      solutionSteps: [
        "\\sin^2 \\theta + \\cos^2 \\theta = 1",
        "\\left(\\frac{3}{5}\\right)^2 + \\cos^2 \\theta = 1",
        "\\cos^2 \\theta = 1 - \\frac{9}{25} = \\frac{16}{25}",
        "0^\\circ < \\theta < 90^\\circ \\text{ より } \\cos \\theta > 0",
        "\\cos \\theta = \\frac{4}{5}"
      ]
    },
    {
      givenTex: "\\sin \\theta = \\frac{3}{5}",
      givenValue: "3/5",
      range: "obtuse",
      rangeTex: "90^\\circ < \\theta < 180^\\circ",
      askTex: "\\cos \\theta",
      answer: "-4/5",
      options: ["4/5", "-4/5", "-3/4", "3/5"],
      solutionSteps: [
        "\\sin^2 \\theta + \\cos^2 \\theta = 1",
        "\\left(\\frac{3}{5}\\right)^2 + \\cos^2 \\theta = 1",
        "\\cos^2 \\theta = \\frac{16}{25}",
        "90^\\circ < \\theta < 180^\\circ \\text{ より } \\cos \\theta < 0",
        "\\cos \\theta = -\\frac{4}{5}"
      ]
    },
    {
      givenTex: "\\cos \\theta = -\\frac{5}{13}",
      givenValue: "-5/13",
      range: "obtuse",
      rangeTex: "90^\\circ < \\theta < 180^\\circ",
      askTex: "\\sin \\theta",
      answer: "12/13",
      options: ["12/13", "-12/13", "5/12", "-5/12"],
      solutionSteps: [
        "\\sin^2 \\theta + \\cos^2 \\theta = 1",
        "\\sin^2 \\theta + \\left(-\\frac{5}{13}\\right)^2 = 1",
        "\\sin^2 \\theta = 1 - \\frac{25}{169} = \\frac{144}{169}",
        "90^\\circ < \\theta < 180^\\circ \\text{ より } \\sin \\theta > 0",
        "\\sin \\theta = \\frac{12}{13}"
      ]
    },
    {
      givenTex: "\\sin \\theta = \\frac{3}{5}",
      givenValue: "3/5",
      range: "acute",
      rangeTex: "0^\\circ < \\theta < 90^\\circ",
      askTex: "\\tan \\theta",
      answer: "3/4",
      options: ["3/4", "4/3", "5/3", "3/5"],
      solutionSteps: [
        "\\cos \\theta = \\frac{4}{5} \\text{（前問より）}",
        "\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}",
        "\\tan \\theta = \\frac{3/5}{4/5} = \\frac{3}{4}"
      ]
    },
    {
      givenTex: "\\tan \\theta = 2",
      givenValue: "2",
      range: "acute",
      rangeTex: "0^\\circ < \\theta < 90^\\circ",
      askTex: "\\cos \\theta",
      answer: "1/\\sqrt{5}",
      options: ["1/\\sqrt{5}", "2/\\sqrt{5}", "\\sqrt{5}", "1/2"],
      solutionSteps: [
        "1 + \\tan^2 \\theta = \\frac{1}{\\cos^2 \\theta}",
        "1 + 4 = \\frac{1}{\\cos^2 \\theta}",
        "\\cos^2 \\theta = \\frac{1}{5}",
        "0^\\circ < \\theta < 90^\\circ \\text{ より } \\cos \\theta > 0",
        "\\cos \\theta = \\frac{1}{\\sqrt{5}}"
      ]
    }
  ];
}

export default function TrigIdentityPractice({ onBack }: { onBack: () => void }) {
  const [problems] = useState<IdentityProblem[]>(() => generateIdentityProblems());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = problems[currentIndex];

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === current.answer) {
      setScore(s => s + 1);
    }
    setShowSolution(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= problems.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowSolution(false);
    }
  };

  if (finished) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg border-4 border-white dark:border-slate-900">
            <Trophy className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black">Score: {score} / {problems.length}</h2>
            <p className="text-slate-500 dark:text-slate-400">
              {score === problems.length ? "Perfect! 三角比の相互関係マスター!" : score >= 3 ? "Good! もう少し練習しよう!" : "基礎を復習してから再挑戦!"}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setCurrentIndex(0); setSelected(null); setShowSolution(false); setScore(0); setFinished(false); }}
              className="px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 transition-colors">
              Retry
            </button>
            <button onClick={onBack}
              className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-opacity">
              Back to Menu
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md mx-auto space-y-6">
        {/* Progress */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Question {currentIndex + 1} / {problems.length}
          </span>
          <div className="flex gap-1">
            {problems.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            ))}
          </div>
        </div>

        {/* Problem Card */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-bold mb-2">条件</div>
              <div className="text-center text-lg font-bold">
                <MathComponent tex={current.givenTex} />
              </div>
              <div className="text-center text-sm text-slate-500 mt-2">
                （<MathComponent tex={current.rangeTex} />）
              </div>
            </div>

            <div className="text-center font-bold text-lg">
              <MathComponent tex={current.askTex} /> の値は？
            </div>

            <div className="grid grid-cols-2 gap-3">
              {current.options.map((opt, i) => {
                let btnClass = "p-4 rounded-2xl border-2 text-lg font-bold transition-all text-center ";
                if (selected === null) {
                  btnClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer";
                } else if (opt === current.answer) {
                  btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                } else if (opt === selected) {
                  btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                } else {
                  btnClass += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50";
                }
                return (
                  <button key={i} onClick={() => handleSelect(opt)} className={btnClass}>
                    <MathComponent tex={opt} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Solution Steps */}
        {showSolution && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-4">解法のステップ</h3>
            <div className="space-y-3">
              {current.solutionSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold text-xs mt-1">{i + 1}.</span>
                  <div className="text-sm">
                    <MathComponent tex={step} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button onClick={handleNext}
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:opacity-80 transition-opacity inline-flex items-center gap-2">
                {currentIndex + 1 < problems.length ? "Next" : "Result"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
