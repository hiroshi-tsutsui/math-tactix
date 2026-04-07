"use client";
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintStep {
  step: number;
  text: string;
}

interface HintButtonProps {
  hints: HintStep[];
  className?: string;
}

export default function HintButton({ hints, className = '' }: HintButtonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleShowHint = () => {
    if (!isOpen) {
      setIsOpen(true);
      setCurrentStep(1);
    } else if (currentStep < hints.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  return (
    <div className={`mt-4 ${className}`}>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleShowHint}
          disabled={isOpen && currentStep >= hints.length}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/40"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {!isOpen ? 'ヒントを見る' : currentStep < hints.length ? '次のヒント' : 'これ以上のヒントはありません'}
        </button>
        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-bold text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ヒントを隠す
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {hints.slice(0, currentStep).map((hint) => (
            <div key={hint.step} className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl dark:bg-amber-900/20 dark:border-amber-800">
              <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-black dark:bg-amber-700 dark:text-amber-200">
                {hint.step}
              </span>
              <p className="text-xs text-amber-800 leading-relaxed dark:text-amber-300">{hint.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
