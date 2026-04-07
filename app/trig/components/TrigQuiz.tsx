"use client";

import React from 'react';
import { ChevronRight, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import MathComponent from './MathComponent';
import HintButton from '../../components/HintButton';

type QuizItem = {
  type: 'sin' | 'cos' | 'tan' | 'identity';
  question: string;
  options: string[];
  answer: string;
};

const QUIZ_DATA: QuizItem[] = [
  { type: 'sin', question: "\\sin 30^\\circ の値は？", options: ["1/2", "\\sqrt{3}/2", "1", "0"], answer: "1/2" },
  { type: 'cos', question: "\\cos 120^\\circ の値は？", options: ["1/2", "-1/2", "-\\sqrt{3}/2", "0"], answer: "-1/2" },
  { type: 'tan', question: "\\tan 45^\\circ の値は？", options: ["1", "\\sqrt{3}", "1/\\sqrt{3}", "0"], answer: "1" },
  { type: 'identity', question: "\\sin^2 \\theta + \\cos^2 \\theta = ?", options: ["0", "1", "2", "\\tan \\theta"], answer: "1" },
  { type: 'identity', question: "\\tan \\theta = ?", options: ["\\sin/\\cos", "\\cos/\\sin", "1/\\sin", "1/\\cos"], answer: "\\sin/\\cos" },
];

interface TrigQuizProps {
  quizIndex: number;
  score: number;
  feedback: 'idle' | 'correct' | 'wrong';
  onSubmitAnswer: (answer: string) => void;
  onNextQuiz: () => void;
  onResetLevel: () => void;
  onResetAll: () => void;
}

export { QUIZ_DATA };

export default function TrigQuiz({
  quizIndex,
  score,
  feedback,
  onSubmitAnswer,
  onNextQuiz,
  onResetLevel,
  onResetAll,
}: TrigQuizProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      {quizIndex < QUIZ_DATA.length ? (
        <div className="w-full max-w-md bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {quizIndex + 1} / {QUIZ_DATA.length}</span>
            <div className="flex gap-1">
              {[...Array(QUIZ_DATA.length)].map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full ${i < quizIndex ? 'bg-green-500' : i === quizIndex ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center min-h-[60px] flex items-center justify-center">
            <MathComponent tex={QUIZ_DATA[quizIndex].question} />
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {QUIZ_DATA[quizIndex].options.map((opt, i) => {
              const isCorrect = opt === QUIZ_DATA[quizIndex].answer;

              let btnClass = "p-6 rounded-2xl border-2 text-lg font-bold transition-all relative overflow-hidden ";
              if (feedback === 'idle') {
                btnClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
              } else if (isCorrect) {
                btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
              } else {
                btnClass += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50";
              }

              return (
                <button key={i}
                  onClick={() => feedback === 'idle' && onSubmitAnswer(opt)}
                  className={btnClass}
                >
                  <MathComponent tex={opt} />
                  {feedback !== 'idle' && isCorrect && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          {feedback !== 'idle' && (
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="text-center">
              <button onClick={onNextQuiz}
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto">
                Next Question <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6">
          <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}}
            className="w-32 h-32 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg border-4 border-white dark:border-slate-900">
            <Trophy className="w-16 h-16" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black">Score: {score} / {QUIZ_DATA.length}</h2>
            <p className="text-slate-500">
              {score === QUIZ_DATA.length ? "Perfect! Trigonometry Master!" : "Keep practicing!"}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={onResetLevel} className="px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 transition-colors">
              Retry
            </button>
            <button onClick={onResetAll} className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-opacity">
              Back to Menu
            </button>
          </div>
        </div>
      )}

      <HintButton hints={[
        { step: 1, text: "特殊角（30°, 45°, 60°）の三角比の値を思い出しましょう" },
        { step: 2, text: "sin30° = 1/2, cos60° = 1/2, tan45° = 1 などが基本です" },
        { step: 3, text: "単位円上の座標 (cosθ, sinθ) をイメージすると覚えやすくなります" },
      ]} />
    </main>
  );
}
