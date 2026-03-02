// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, Timer, BarChart3, HelpCircle, Info } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: "Q-001",
    category: "微分・積分",
    query: "f(x) = x² の導関数を求めてください。",
    options: ["x", "2x", "x²", "2"],
    answer: "2x",
    explanation: "べき乗の微分公式 (x^n)' = n*x^(n-1) を適用します。"
  },
  {
    id: "Q-002",
    category: "データと相関",
    query: "標準偏差 (σ) が表す指標として最も適切なものはどれですか？",
    options: ["データの個数", "データの平均値", "データの散らばり具合", "データの最大値"],
    answer: "データの散らばり具合",
    explanation: "標準偏差は、各データが平均値からどれくらい離れているか（散らばり）を数値化したものです。"
  },
  {
    id: "Q-003",
    category: "二次関数",
    query: "y = (x - 2)² + 1 のグラフの頂点を求めてください。",
    options: ["(2, 1)", "(-2, 1)", "(2, -1)", "(-2, -1)"],
    answer: "(2, 1)",
    explanation: "y = a(x - p)² + q の形において、頂点は (p, q) となります。"
  },
  {
    id: "Q-004",
    category: "ベクトル",
    query: "垂直に交わる2つのベクトルの内積の値はどうなりますか？",
    options: ["1", "-1", "0", "不定"],
    answer: "0",
    explanation: "ベクトルの内積は |a||b|cosθ で定義され、垂直（θ=90°）のとき cos90°=0 となります。"
  },
  {
    id: "Q-005",
    category: "複素数",
    query: "虚数単位 i について、i² の値を求めてください。",
    options: ["1", "-1", "i", "-i"],
    answer: "-1",
    explanation: "虚数単位 i は、2乗すると -1 になる数として定義されています。"
  }
];

export default function QuizPage() {
  const { completeCalibration } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(100); 
  const [stability, setStability] = useState(100); // Progress/Health
  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "FAILED">("ACTIVE");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string) => {
    setLog(prev => [message, ...prev].slice(0, 5));
  };

  useEffect(() => {
    if (status === "ACTIVE") {
      addLog("実力判定テストを開始しました。");
      timerRef.current = setInterval(() => {
        setStability(prev => {
          if (prev <= 0) {
            setStatus("FAILED");
            return 0;
          }
          return prev - 0.5; // Slow decay as a timer
        });
      }, 500);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleOptionClick = (option: string) => {
    if (selectedOption || status !== "ACTIVE") return; 
    setSelectedOption(option);

    const isCorrect = option === questions[currentIndex].answer;

    if (isCorrect) {
      addLog(`問題 ${currentIndex + 1}: 正解しました。`);
      setStability(prev => Math.min(100, prev + 10));
    } else {
      addLog(`問題 ${currentIndex + 1}: 不正解です。`);
      setScore(prev => Math.max(0, prev - 20));
      setStability(prev => Math.max(0, prev - 15));
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setStatus("COMPLETED");
        completeCalibration(score);
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> 中止
          </Link>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Timer className={`w-4 h-4 ${stability < 30 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${stability < 30 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${stability}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">精度</span>
              <span className="text-sm font-mono font-bold">{score}%</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode='wait'>
          {status === "ACTIVE" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {questions[currentIndex].category}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">#{questions[currentIndex].id}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
                    {questions[currentIndex].query}
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentIndex].options.map((option, idx) => (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group
                          ${selectedOption === option 
                            ? option === questions[currentIndex].answer 
                              ? 'bg-green-50 border-green-200 text-green-700' 
                              : 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                          }
                          ${selectedOption !== null && option !== selectedOption ? 'opacity-40 grayscale-[0.5]' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                              ${selectedOption === option ? 'bg-white/50' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}
                            `}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-medium">{option}</span>
                          </div>
                          {selectedOption === option && (
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {option === questions[currentIndex].answer ? "Correct" : "Incorrect"}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedOption && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-slate-100"
                    >
                      <div className="flex gap-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">解説</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{questions[currentIndex].explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                   <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">判定ステータス</h3>
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">進捗</span>
                        <span className="font-bold">{currentIndex + 1} / {questions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">推定精度</span>
                        <span className="font-bold text-blue-400">{score}%</span>
                      </div>
                   </div>
                 </div>

                 <div className="bg-white rounded-3xl border border-slate-200 p-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">判定ログ</h3>
                    <div className="space-y-2 font-mono text-[11px]">
                      {log.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          ) : status === "COMPLETED" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white border border-slate-200 p-16 rounded-[40px] text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">実力判定完了</h2>
              <p className="text-slate-500 font-medium mb-12">現在の数学的な習熟度が測定されました。</p>
              
              <div className="grid grid-cols-2 gap-8 mb-16">
                <div className="p-6 bg-slate-50 rounded-3xl">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">スコア</div>
                   <div className="text-4xl font-black text-slate-900">{score}%</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">判定ランク</div>
                   <div className="text-2xl font-black text-blue-600">
                    {score >= 90 ? 'OMEGA' : score >= 70 ? 'ARCHITECT' : score >= 50 ? 'OPERATOR' : 'LEARNER'}
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  学習をはじめる
                </Link>
                <button onClick={() => window.location.reload()} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  もう一度判定する
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white border border-red-100 p-16 rounded-[40px] text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">中断されました</h2>
              <p className="text-slate-500 mb-12">安定性が低下したため判定を停止しました。</p>
              <button onClick={() => window.location.reload()} className="px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                最初からやり直す
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
