"use client";

import { useState } from 'react';
import { ArrowLeft, Check, Play, Pause, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import DoubleRadicalViz from '../components/math/DoubleRadicalViz';
import AbsoluteValueViz from '../components/math/AbsoluteValueViz';

export default function MathINumbers() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const levels = [
    { id: 1, title: '二重根号を外す', type: 'double_radical' },
    { id: 2, title: '絶対値を含む方程式・不等式', type: 'absolute_value' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium tracking-wide">ダッシュボードへ戻る</span>
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">数と式 (数学I)</h1>
            <p className="text-sm text-slate-500 tracking-wider">Numbers and Algebraic Expressions</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Levels</h3>
              <div className="space-y-1">
                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setCurrentLevel(lvl.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentLevel === lvl.id
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
                        currentLevel === lvl.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {lvl.id}
                      </span>
                      <span className="truncate">{lvl.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            {currentLevel === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">二重根号を外す (Removing Double Radicals)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    ルートの中にあるルート（二重根号）を外すには、展開の公式 <InlineMath math="(a+b)^2 = a^2 + 2ab + b^2" /> を逆向きに使います。<br/>
                    <InlineMath math="\sqrt{(a+b) + 2\sqrt{ab}} = \sqrt{a} + \sqrt{b}" /> （ただし <InlineMath math="a > 0, b > 0" />）
                  </p>
                  <DoubleRadicalViz />
                </div>
              </div>
            )}
            
            {currentLevel === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値を含む方程式・不等式 (Absolute Value)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値 <InlineMath math="|x - a|" /> は、数直線上で <InlineMath math="x" /> と基準点 <InlineMath math="a" /> の<strong>距離</strong>を表します。<br/>
                    たとえば、<InlineMath math="|x - 2| < 3" /> は、「点 <InlineMath math="2" /> からの距離が <InlineMath math="3" /> より小さい範囲」です。
                  </p>
                  <AbsoluteValueViz />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
