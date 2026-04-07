"use client";

import { useState } from 'react';
import SimultaneousLinearInequalitiesViz from '../components/math/SimultaneousLinearInequalitiesViz';
import ValueAbsoluteViz from './components/ValueAbsoluteViz';

import BackButton from '../components/BackButton';
import Link from 'next/link';
import SaltWaterInequalityViz from './components/SaltWaterInequalityViz';

import { BlockMath, InlineMath } from 'react-katex';
import AbsoluteInequalityCaseSplitViz from '@/components/math_i/numbers/AbsoluteInequalityCaseSplitViz';
import 'katex/dist/katex.min.css';
import GaussSymbolViz from './components/GaussSymbolViz';
import DoubleRadicalViz from '../components/math/DoubleRadicalViz';
import AbsoluteValueViz from '../components/math/AbsoluteValueViz';
import ExpansionGroupingViz from '../components/math/ExpansionGroupingViz';
import RootComparisonViz from './components/RootComparisonViz';
import IntegerSolutionsViz from '../components/math/IntegerSolutionsViz';
import TasukigakeViz from '../components/math/TasukigakeViz';
import SymmetricPolynomialsViz from '../components/math/SymmetricPolynomialsViz';
import RationalizationViz from '../components/math/RationalizationViz';
import RootAbsoluteViz from '../components/math/RootAbsoluteViz';
import RepeatingDecimalViz from '../components/math/RepeatingDecimalViz';
import IntegerFractionalPartViz from '../components/math/IntegerFractionalPartViz';
import ThreeTermsSquareViz from '../components/math/ThreeTermsSquareViz';
import BenchWordProblemViz from '../components/math/BenchWordProblemViz';
import FactoringLowestDegreeViz from './components/FactoringLowestDegreeViz';
import AbsoluteCaseSplitViz from './components/AbsoluteCaseSplitViz';
import ParametricLinearInequalityViz from './components/ParametricLinearInequalityViz';
import BiQuadraticFactoringViz from './components/BiQuadraticFactoringViz';
import ThreeTermsRationalizationViz from './components/ThreeTermsRationalizationViz';
import SumOfAbsoluteValuesViz from './components/SumOfAbsoluteValuesViz';
import ConditionForSimultaneousInequalitiesViz from './components/ConditionForSimultaneousInequalitiesViz';
import FactoringSubstitutionViz from './components/FactoringSubstitutionViz';
import IntegerSolutionsInequalityViz from './components/IntegerSolutionsInequalityViz';
import HigherDegreeValueViz from './components/HigherDegreeValueViz';
import LinearEquationCasesViz from './components/LinearEquationCasesViz';
import AlternatingPolynomialViz from './components/AlternatingPolynomialViz';
import RootAbsoluteSimplificationViz from './components/RootAbsoluteSimplificationViz';
import SymmetricThreeVariablesViz from './components/SymmetricThreeVariablesViz';
import IrrationalEqualityViz from './components/IrrationalEqualityViz';
import InequalityRangeViz from './components/InequalityRangeViz';
import FormulaValuesViz from './components/FormulaValuesViz';
import MaxIntegerSolutionViz from './components/MaxIntegerSolutionViz';
import ExpansionSubstitutionViz from './components/ExpansionSubstitutionViz';
import SpeedTimeInequalityViz from './components/SpeedTimeInequalityViz';
import DiscountInequalityViz from './components/DiscountInequalityViz';
import ReciprocalSymmetricViz from './components/ReciprocalSymmetricViz';
import TriangleInequalityViz from './components/TriangleInequalityViz';
import TwoAbsoluteValuesInequalityViz from './components/TwoAbsoluteValuesInequalityViz';
import PolynomialDivisionViz from './components/PolynomialDivisionViz';
import RationalExpressionViz from './components/RationalExpressionViz';
import NestedRadicalViz from './components/NestedRadicalViz';
import AbsoluteValueCasesViz from './components/AbsoluteValueCasesViz';
import PrimeFactorizationViz from './components/PrimeFactorizationViz';
import FractionSimplifyViz from './components/FractionSimplifyViz';
import FractionAdditionViz from './components/FractionAdditionViz';
import RationalizationAdvancedViz from './components/RationalizationAdvancedViz';
import NestedRadical2Viz from './components/NestedRadical2Viz';
import RemainderFactorViz from './components/RemainderFactorViz';
import IdentityCoefficientsViz from './components/IdentityCoefficientsViz';
import BinomialTheoremViz from './components/BinomialTheoremViz';
import MultinomialTheoremViz from './components/MultinomialTheoremViz';






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
    { id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' },
    { id: 10, title: '3項の平方の展開公式', type: 'three_terms_square' },
    { id: 11, title: '1次不等式の文章題 (過不足)', type: 'bench_word_problem' },
        { id: 12, title: '最低次数の文字で整理する因数分解', type: 'factoring_lowest_degree' },
        { id: 13, title: '絶対値を含む方程式 (場合分け)', type: 'absolute_case_split' },
        { id: 14, title: '文字係数の1次不等式', type: 'parametric_linear_inequality' },
        { id: 15, title: '複二次式の因数分解 (平方の差)', type: 'biquadratic_factoring' },
        { id: 16, title: '3項の分母の有理化', type: 'three_terms_rationalization' },
        { id: 17, title: '絶対値の和と最小値 (メジアン)', type: 'sum_of_absolute_values' },
        { id: 18, title: '連立不等式が解をもつ条件', type: 'condition_simultaneous' },
        { id: 19, title: '不等式の整数解の個数', type: 'integer_solutions_range' }
        , { id: 20, title: '絶対値を含む不等式 (場合分け)', type: 'absolute_inequality_case_split' }
        , { id: 21, title: '置き換えによる因数分解', type: 'factoring_substitution' }
        , { id: 22, title: '1次不等式の文章題 (食塩水・濃度)', type: 'salt_water_inequality' }
        , { id: 23, title: '次数下げによる高次式の値', type: 'higher_degree_value' }
        , { id: 24, title: '1次方程式 ax = b の解の分類', type: 'linear_equation_cases' }
        , { id: 25, title: '対称式と交代式 (因数分解)', type: 'alternating_polynomial' }
        , { id: 26, title: '平方根と絶対値 (文字式の簡約化)', type: 'root_absolute_simplification' },
  { id: 27, title: '不等式の性質と式の値の範囲', type: 'inequality_range' },
    { id: 28, title: '展開の工夫 (組み合わせ)', type: 'expansion_grouping' },
  { id: 29, title: '平方根の大小比較', type: 'root_comparison' },
  { id: 30, title: '式の値 (代入)', type: 'formula_values' },


  { id: 31, title: '展開の工夫 (置き換え)', type: 'expansion_substitution' },
  { id: 32, title: '最大整数解から定数の範囲を決定', type: 'max_integer_solution' },
        { id: 33, title: 'たすき掛けの応用 (2変数の因数分解)', type: 'tasukigake_twice' },
        { id: 34, title: '対称式と式の値 (3変数)', type: 'symmetric_three_variables' },
        { id: 35, title: '無理数の相等', type: 'irrational_equality' },
        { id: 36, title: '1次不等式の文章題 (道のりと時間)', type: 'speed_time_inequality' },
  
  { id: 37, title: '1次不等式の文章題 (損益分岐点・料金プラン)', type: 'discount_inequality' },
    { id: 38, title: '対称式の値 (分数型)', type: 'reciprocal_symmetric' },
        { id: 39, title: '絶対値の不等式 (三角不等式)', type: 'triangle_inequality' },
        { id: 40, title: 'ガウス記号 (Gauss Symbol)', type: 'gauss_symbol' },
        { id: 41, title: '2つの絶対値を含む方程式・不等式', type: 'two_absolute_values_inequality' },
        { id: 42, title: '整式の除法 (A = BQ + R)', type: 'polynomial_division' },
        { id: 43, title: '分数式・有理化', type: 'rational_expression' },
        { id: 44, title: '二重根号の変形', type: 'nested_radical' },
        { id: 45, title: '絶対値の場合分け計算', type: 'absolute_value_cases' },
        { id: 46, title: '整数の性質（素因数分解・GCD・LCM）', type: 'prime_factorization' },
        { id: 47, title: '分数式の約分', type: 'fraction_simplify' },
        { id: 48, title: '分数式の通分・加減算', type: 'fraction_addition' },
        { id: 49, title: '有理化（1次・2次）', type: 'rationalization_advanced' },
        { id: 50, title: '二重根号の変換（応用）', type: 'nested_radical_2' },
        { id: 51, title: '余りの定理・因数定理', type: 'remainder_factor' },
        { id: 52, title: '恒等式の係数決定', type: 'identity_coefficients' },
        { id: 53, title: '二項定理 (Binomial Theorem)', type: 'binomial_theorem' },
        { id: 54, title: '多項定理 (Multinomial Theorem)', type: 'multinomial_theorem' }
];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <BackButton href="/" label="ダッシュボードへ戻る" />
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
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <RepeatingDecimalViz />
              </div>
            )}
            {currentLevel === 9 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <IntegerFractionalPartViz />
              </div>
            )}
            {currentLevel === 10 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ThreeTermsSquareViz />
              </div>
            )}
            {currentLevel === 11 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">1次不等式の文章題 (過不足問題)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    生徒を長椅子に座らせるときの「余り」や「空席」から人数を推定する問題です。<br/>
                    「最後の長椅子に人が座っている」という条件は、<strong>1人以上から定員まで</strong>の幅があることに注意し、不等式を立てます。
                  </p>
                  <BenchWordProblemViz />
                </div>
              </div>
            )}

            {currentLevel === 12 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">最低次数の文字で整理する因数分解 (Factoring by Lowest Degree)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    複数の文字を含む複雑な式を因数分解する際の鉄則は、「最も次数の低い文字に着目して整理する」ことです。<br/>
                    これにより、式全体の見通しが良くなり、共通因数やたすき掛けの公式が見つけやすくなります。
                  </p>
                  <FactoringLowestDegreeViz />
                </div>
              </div>
            )}


            {currentLevel === 13 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値を含む方程式 (場合分け) (Absolute Value Case Splitting)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値記号を含む方程式を解く基本は、絶対値の中身の正負によって場合分け（Case Splitting）を行うことです。<br/>
                    また、求めた解が最初の「場合分けの条件」を満たしているか（不適でないか）を必ず確認する必要があります。
                  </p>
                  <AbsoluteCaseSplitViz />
                </div>
              </div>
            )}


            {currentLevel === 14 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">文字係数の1次不等式 (Parametric Linear Inequality)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式 <InlineMath math="ax > b" /> のように文字係数が含まれる場合、安易に <InlineMath math="a" /> で割ってはいけません。<br/>
                    <InlineMath math="a" /> が正の数か、負の数か、それとも0かによって、不等号の向きが変わったり、解の形が根本的に変わるため、3つの場合分けが必須です。
                  </p>
                  <ParametricLinearInequalityViz />
                </div>
              </div>
            )}


            {currentLevel === 15 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">複二次式の因数分解 (平方の差) (Bi-quadratic Factoring)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    x^4 + x^2 + 1 のように、単なる置き換えでは因数分解できない複二次式は、無理やり「平方の差（A^2 - B^2）」の形を作り出す必要があります。
                  </p>
                  <BiQuadraticFactoringViz />
                </div>
              </div>
            )}

            {currentLevel === 16 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">3項の分母の有理化 (Rationalizing 3-Term Denominator)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分母に3つの項がある場合、一度に有理化することはできません。2つの項を1つのグループとしてくくり、2回に分けて有理化を行います。
                  </p>
                  <ThreeTermsRationalizationViz />
                </div>
              </div>
            )}

            {currentLevel === 17 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値の和と最小値 (メジアン)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値の和が最小になるのは「中央値 (メジアン)」の部分です。グラフの形を見て確認しましょう。
                  </p>
                  <SumOfAbsoluteValuesViz />
                </div>
              </div>
            )}

            {currentLevel === 18 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">連立不等式が解をもつ条件</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    解をもつためには、不等式の範囲が重なる必要があります。境界が白丸か黒丸かに注意してください。
                  </p>
                  <ConditionForSimultaneousInequalitiesViz />
                </div>
              </div>
            )}

            {currentLevel === 19 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">不等式の整数解の個数</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    整数解が指定された個数になるように、範囲を調整します。「境界（白丸・黒丸）」の扱いがカギになります。
                  </p>
                  <IntegerSolutionsInequalityViz />
                </div>
              </div>
            )}

            {currentLevel === 20 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値を含む不等式 (場合分け)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値の場合分けと、最終的な解の適・不適を視覚的に理解します。
                  </p>
                  <AbsoluteInequalityCaseSplitViz />
                </div>
              </div>
            )}

            {currentLevel === 21 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">置き換えによる因数分解</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    共通部分をAと置いて因数分解し、元に戻すプロセスを視覚化します。
                  </p>
                  <FactoringSubstitutionViz />
                </div>
              </div>
            )}

            {currentLevel === 22 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">1次不等式の文章題 (食塩水・濃度)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    食塩水に水を追加したときの濃度変化と、それが不等式でどう表されるかを視覚的に理解します。
                  </p>
                  <SaltWaterInequalityViz />
                </div>
              </div>
            )}


            {currentLevel === 23 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">次数下げによる高次式の値</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    x = (1 + √5)/2 のような無理数の値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。
                  </p>
                  <HigherDegreeValueViz />
                </div>
              </div>
            )}


            {currentLevel === 24 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">1次方程式 ax = b の解の分類</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    単純に見える方程式でも、文字係数 a が 0 になる可能性がある場合、場合分けが必要です。
                  </p>
                  <LinearEquationCasesViz />
                </div>
              </div>
            )}

            {currentLevel === 25 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">対称式と交代式 (因数分解)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    数学Iの因数分解の最難関。文字の次数がすべて同じ場合は、1つの文字について整理することで道が開けます。
                  </p>
                  <AlternatingPolynomialViz />

                </div>
              </div>
            )}
            {currentLevel === 27 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">不等式の性質と式の値の範囲</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    xとyの範囲から、足し算、引き算、掛け算、割り算の結果の範囲を求めます。
                  </p>
                  <InequalityRangeViz />
                </div>
              </div>
            )}
            {currentLevel === 28 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">展開の工夫 (組み合わせ)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    4つの因数を展開するときは、掛ける順番を工夫して共通部分を作ります。
                  </p>
                  <ExpansionGroupingViz />
                </div>
              </div>
            )}
            {currentLevel === 29 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">平方根の大小比較</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    ルートの和の大小を比較するときは、平方して比較します。
                  </p>
                  <RootComparisonViz />
                </div>
              </div>
            )}
            {currentLevel === 30 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">式の値 (代入)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    負の数を代入するときは必ずカッコをつけましょう。
                  </p>
                  <FormulaValuesViz />
                </div>
              </div>
            )}

            
            {currentLevel === 32 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">最大整数解から定数の範囲を決定</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式を満たす最大の整数から、定数の範囲を視覚的に決定します。<br/>
                    定数aの値を動かして、条件が満たされる範囲（3 &lt; a ≦ 4）を確認しましょう。
                  </p>
                  <MaxIntegerSolutionViz />
                </div>
              </div>
            )}
{currentLevel === 31 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">展開の工夫 (置き換え)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    複雑な展開は共通の「カタマリ」を見つけて1つの文字に置き換えることで劇的に簡単になります。
                  </p>
                  <ExpansionSubstitutionViz />
                </div>
              </div>
            )}

            {currentLevel === 26 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">平方根と絶対値 (文字式の簡約化)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    ルートの中の平方を外すとき、中身が正か負かで絶対値の外れ方が変わります。<br/>
                    数直線上で x の位置を動かし、それぞれの項が「そのまま外れる」か「マイナスをつけて外れる」かを視覚的に確認しましょう。
                  </p>
                  <RootAbsoluteSimplificationViz />
                </div>
              </div>
            )}

            {currentLevel === 35 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">対称式と式の値 (3変数)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    a³+b³+c³-3abc の因数分解は、数学Iの最重要公式の1つです。丸暗記ではなく、自分で式を変形して「作る」方法を身につけましょう。
                  </p>
                  <SymmetricThreeVariablesViz />
                </div>
              </div>
            )}

            {currentLevel === 39 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値の不等式 (三角不等式)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    |a| + |b| ≧ |a + b| という絶対値の重要な性質（三角不等式）を視覚的に理解します。等号が成立する条件（同符号のとき）を確認しましょう。
                  </p>
                  <TriangleInequalityViz />
                </div>
              </div>
            )}

            {currentLevel === 40 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">ガウス記号 (Gauss Symbol)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    実数 <InlineMath math="x" /> を超えない最大の整数を <InlineMath math="[x]" /> と表します。<br/>
                    正の数では単に小数を切り捨てることになりますが、負の数では「数直線上で左側にある直近の整数」となることに注意が必要です。
                  </p>
                  <GaussSymbolViz />
                </div>
              </div>
            )}

            {currentLevel === 41 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">2つの絶対値を含む方程式・不等式</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値が2つある場合、それぞれの中身が0になる点で場合分けし、各区間で絶対値を外して解きます。
                  </p>
                  <TwoAbsoluteValuesInequalityViz />
                </div>
              </div>
            )}

            {currentLevel === 42 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">整式の除法 (Polynomial Division)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    整式A を整式B で割ると、商Q と余りR を用いて <InlineMath math="A = BQ + R" /> と表せます。<br/>
                    余りの次数は除式の次数より低くなります。筆算の手順をステップごとに確認しましょう。
                  </p>
                  <PolynomialDivisionViz />
                </div>
              </div>
            )}

            {currentLevel === 43 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">分数式・有理化 (Rational Expressions)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分数式の約分（共通因数で割る）、通分（分母を揃える）、有理化（分母の√を除く）をステップごとに学びます。
                  </p>
                  <RationalExpressionViz />
                </div>
              </div>
            )}

            {currentLevel === 44 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">二重根号の変形 (Nested Radicals)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="\sqrt{a + 2\sqrt{b}} = \sqrt{p} + \sqrt{q}" /> の変形手順をステップごとに学びます。<br/>
                    <InlineMath math="p + q = a,\; pq = b" /> を満たす p, q を見つけることがポイントです。
                  </p>
                  <NestedRadicalViz />
                </div>
              </div>
            )}

            {currentLevel === 45 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値の場合分け計算</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="|x - a|" /> の場合分けの境界を数直線で確認し、方程式・不等式を解きます。
                  </p>
                  <AbsoluteValueCasesViz />
                </div>
              </div>
            )}

            {currentLevel === 46 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">整数の性質（素因数分解・GCD・LCM）</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    整数をファクターツリーで素因数分解し、最大公約数（GCD）と最小公倍数（LCM）を視覚的に求めます。
                    共通の素因数の「最小指数」がGCD、「最大指数」がLCMになることを確認しましょう。
                  </p>
                  <PrimeFactorizationViz />
                </div>
              </div>
            )}

            {currentLevel === 47 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">分数式の約分 (Simplifying Rational Expressions)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分数式 <InlineMath math="\frac{P(x)}{Q(x)}" /> の分子・分母を因数分解し、共通因数で約分します。<br/>
                    約分で消した因数が 0 になる <InlineMath math="x" /> の値は定義域から除外する必要があります。
                  </p>
                  <FractionSimplifyViz />
                </div>
              </div>
            )}

            {currentLevel === 48 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">分数式の通分・加減算 (Adding/Subtracting Rational Expressions)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分母が異なる分数式を足したり引いたりするには、<strong>通分</strong>（LCD: 最小公倍式を求める）が必要です。<br/>
                    各分母を因数分解し、LCD を見つけてから分子を調整します。
                  </p>
                  <FractionAdditionViz />
                </div>
              </div>
            )}

            {currentLevel === 49 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">有理化（1次・2次）(Rationalization)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分母に無理数（平方根）を含む場合、分母を有理数にする操作を「有理化」と呼びます。<br/>
                    1次有理化では <InlineMath math="\frac{1}{\sqrt{a}}" /> の形、2次有理化では共役式 <InlineMath math="(\sqrt{a} - \sqrt{b})" /> を使います。
                  </p>
                  <RationalizationAdvancedViz />
                </div>
              </div>
            )}

            {currentLevel === 50 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">二重根号の変換（応用）(Nested Radical Conversion)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="\sqrt{a + 2\sqrt{b}}" /> や <InlineMath math="\sqrt{a - 2\sqrt{b}}" /> の形の二重根号を、
                    <InlineMath math="(\sqrt{p} + \sqrt{q})^2 = p + q + 2\sqrt{pq}" /> の関係を使って外します。<br/>
                    加法形と減法形の両方のパターンを段階的に学びます。
                  </p>
                  <NestedRadical2Viz />
                </div>
              </div>
            )}

            {currentLevel === 51 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">余りの定理・因数定理 (Remainder & Factor Theorem)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="P(x)" /> を <InlineMath math="(x - a)" /> で割ったときの余りは <InlineMath math="P(a)" /> です（余りの定理）。<br/>
                    特に <InlineMath math="P(a) = 0" /> のとき、<InlineMath math="(x - a)" /> は <InlineMath math="P(x)" /> の因数です（因数定理）。
                    スライダーで <InlineMath math="a" /> の値を変えて、余りがどう変化するか観察しましょう。
                  </p>
                  <RemainderFactorViz />
                </div>
              </div>
            )}

            {currentLevel === 52 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">恒等式の係数決定 (Identity Coefficients)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    恒等式（すべての <InlineMath math="x" /> について成り立つ等式）の両辺の係数を比較して、
                    未知定数 <InlineMath math="a, b, c" /> を決定します。
                    ステップごとに展開・比較の過程を確認しましょう。
                  </p>
                  <IdentityCoefficientsViz />
                </div>
              </div>
            )}

            {currentLevel === 53 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">二項定理 (Binomial Theorem)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="(a + b)^n" /> の展開公式と、パスカルの三角形の関係を学びます。
                    二項係数 <InlineMath math="\binom{n}{k}" /> の意味と数値検証を通じて理解を深めましょう。
                  </p>
                  <BinomialTheoremViz />
                </div>
              </div>
            )}

            {currentLevel === 54 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">多項定理 (Multinomial Theorem)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="(a + b + c)^n" /> の展開公式と多項係数を学びます。
                    二項定理の拡張として、<InlineMath math="\frac{n!}{p!\,q!\,r!}" /> の意味を理解しましょう。
                  </p>
                  <MultinomialTheoremViz />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
