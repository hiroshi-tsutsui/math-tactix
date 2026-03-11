"use client";

import { useState } from 'react';
import { ArrowLeft, Check, Play, Pause, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import DoubleRadicalViz from '../components/math/DoubleRadicalViz';
import AbsoluteValueViz from '../components/math/AbsoluteValueViz';
import IntegerSolutionsViz from '../components/math/IntegerSolutionsViz';
import TasukigakeViz from '../components/math/TasukigakeViz';
import SymmetricPolynomialsViz from '../components/math/SymmetricPolynomialsViz';
import RationalizationViz from '../components/math/RationalizationViz';
import RootAbsoluteViz from '../components/math/RootAbsoluteViz';
import RepeatingDecimalViz from '../components/math/RepeatingDecimalViz';
import IntegerFractionalPartViz from '../components/math/IntegerFractionalPartViz';

export default function MathINumbers() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const levels = [
    { id: 1, title: '二重根号を外す', type: 'double_radical' },
    { id: 2, title: '絶対値を含む方程式・不等式', type: 'absolute_value' },
    { id: 3, title: '1次不等式の整数解の個数', type: 'integer_solutions' },
    { id: 4, title: 'たすき掛け (因数分解)', type: 'tasukigake' },
    { id: 5, title: '対称式の値 (基本定理)', type: 'symmetric_polynomials' },
    { id: 6, title: '分母の有理化', type: 'rationalization' },
    { id: 7, title: '平方根と絶対値 (√a² = |a|)', type: 'root_absolute' },
    { id: 8, title: '循環小数と分数', type: 'repeating_decimal' },
    { id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' }
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

            {currentLevel === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">1次不等式の整数解の個数 (Number of Integer Solutions)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式を満たす最大の整数が条件の個数と一致するように、境界となる文字 <InlineMath math="a" /> の範囲を絞り込みます。<br/>
                    特に、不等号が「<InlineMath math="<" />（含まない）」か「<InlineMath math="\le" />（含む）」かによって、境界上での判定が変わる点に注意してください。
                  </p>
                  <IntegerSolutionsViz />
                </div>
              </div>
            )}

            {currentLevel === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">たすき掛け (Cross Multiplication Method)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    2次式 <InlineMath math="ax^2 + bx + c" /> を因数分解する際、<InlineMath math="a = pr, c = qs, b = ps + qr" /> となるような整数 <InlineMath math="p, q, r, s" /> を見つける手法です。<br/>
                    斜め（たすき）に掛けて足し合わせることで、中央の係数 <InlineMath math="b" /> に一致するかを視覚的に確認します。
                  </p>
                  <TasukigakeViz />
                </div>
              </div>
            )}

            {currentLevel === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">対称式の値 (Symmetric Polynomials)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="x" /> と <InlineMath math="y" /> を入れ替えても値が変わらない式を「対称式」と呼びます。<br/>
                    すべての対称式は、基本対称式である和 <InlineMath math="x+y" /> と積 <InlineMath math="xy" /> だけで表すことができます。<br/>
                    ここでは、最もよく使われる <InlineMath math="x^2 + y^2 = (x+y)^2 - 2xy" /> の公式を、面積モデルで直感的に理解しましょう。
                  </p>
                  <SymmetricPolynomialsViz />
                </div>
              </div>
            )}

            {currentLevel === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">分母の有理化 (Rationalizing the Denominator)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分母にルートが含まれる場合、計算を簡単にするために分母からルートをなくす操作を「分母の有理化」と呼びます。<br/>
                    和と差の積の展開公式 <InlineMath math="(x+y)(x-y) = x^2 - y^2" /> を用いて、共役な無理数を分母と分子に掛けます。
                  </p>
                  <RationalizationViz />
                </div>
              </div>
            )}

            {currentLevel === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">平方根と絶対値 (Square Roots and Absolute Values)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    数学Iの頻出トラップ問題です。<InlineMath math="\sqrt{a^2}" /> を計算するとき、そのまま <InlineMath math="a" /> としてしまうミスが多発します。<br/>
                    ルートの記号 <InlineMath math="\sqrt{\quad}" /> は常に「<strong>0以上</strong>」の数（正の平方根）を表します。そのため、中身が負の数の場合はマイナスをつけて正の数にする必要があります。<br/>
                    これは絶対値の定義 <InlineMath math="|a|" /> と完全に一致するため、<InlineMath math="\sqrt{a^2} = |a|" /> が成り立ちます。
                  </p>
                  <RootAbsoluteViz />
                </div>
              </div>
            )}

                        {currentLevel === 8 && (
              <div className="animate-fade-in">
                <RepeatingDecimalViz />
              </div>
            )}
            {currentLevel === 9 && (
              <div className="animate-fade-in">
                <IntegerFractionalPartViz />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
