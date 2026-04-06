"use client";
import BackButton from "../components/BackButton";
import RightTriangleRectangleViz from "./components/RightTriangleRectangleViz";
import MovingPointAreaViz from "./components/MovingPointAreaViz";
import VertexOnLineViz from "./components/VertexOnLineViz";
import ChordLengthViz from "./components/ChordLengthViz";
import ThreePointsDeterminationViz from "./components/ThreePointsDeterminationViz";
import XInterceptsDeterminationViz from "./components/XInterceptsDeterminationViz";
import AbsoluteInequalityAllRealsViz from "./components/AbsoluteInequalityAllRealsViz";
import RootsPlacementViz from "./components/RootsPlacementViz";
import VerticalSegmentMaxViz from "./components/VerticalSegmentMaxViz";
import CommonTangentViz from "./components/CommonTangentViz";
import { IntersectionParabolasViz } from "./components/IntersectionParabolasViz";
import IntegerSolutionsQuadraticViz from "./components/IntegerSolutionsQuadraticViz";
import TangentCoefficientDeterminationViz from "./components/TangentCoefficientDeterminationViz";
import VertexAxisDeterminationViz from "./components/VertexAxisDeterminationViz";
import TranslationQuadraticViz from "./components/TranslationQuadraticViz";
import MaxMinCoefficientDeterminationViz from "./components/MaxMinCoefficientDeterminationViz";
import QuadraticInequalityGraphViz from "./components/QuadraticInequalityGraphViz";
import BothRootsBetweenViz from './components/BothRootsBetweenViz';
import FenceEnclosureViz from './components/FenceEnclosureViz';
import WireSquaresViz from './components/WireSquaresViz';

import DomainAlwaysPositiveViz from './components/DomainAlwaysPositiveViz';

import React, { useState, useEffect } from 'react';
import { generateRootsLocationProblem } from './utils/roots-location-generator';
import { generateDefiniteInequalityProblem } from './utils/definite-inequality-generator';
import { generateParametricInequalityProblem } from './utils/parametric-inequality-generator';
import { generateMovingDomainProblem } from './utils/moving-domain-generator';
import { generateCoefficientProblem } from './utils/coefficient-determination-generator';
import { generateGraphTransformationProblem } from './utils/graph-transformation-generator';
import { generateCompletingSquareProblem } from './utils/completing-square-generator';
import { generateSimultaneousInequalityProblem } from './utils/simultaneous-inequality-generator';
import { generateIntersectionProblem } from './utils/intersection-generator';
import { generateQuadraticInequalityProblem } from './utils/quadratic-inequality-generator';
import { generateAbsoluteValueProblem } from './utils/absolute-value-graph-generator';
import { generateMovingAxisProblem } from './utils/moving-axis-generator';
import { generateShapeOptimizationProblem } from './utils/shape-optimization-generator';
import { generateAbsoluteValueEquationProblem } from './utils/absolute-value-equation-generator';
import { generateSolutionsInRangeProblem } from './utils/solutions-in-range-generator';
import { generateDeterminationProblem } from './utils/determination-generator';
import { generateCommonRootsProblem } from './utils/common-roots-generator';
import { generateAbsoluteValueMaxMinProblem } from './utils/absolute-value-max-min-generator';
import { generateDiscriminantProblem } from './utils/discriminant-generator';
import { generateMaxMinProblem } from './utils/max-min-generator';
import { generateSubstitutionMaxMinProblem } from './utils/substitution-max-min-generator';
import { generateTwoParabolasProblem } from './utils/two-parabolas-generator';
import TwoParabolasSizeViz from './components/TwoParabolasSizeViz';
import { generateTwoParabolasSizeProblem } from './utils/two-parabolas-size-generator';
import TwoParabolasViz from './components/TwoParabolasViz';
import { generateDifferenceFunctionProblem } from './utils/difference-function-generator';
import DifferenceFunctionViz from './components/DifferenceFunctionViz';

import RootsLocationViz from './components/RootsLocationViz';
import DefiniteInequalityViz from './components/DefiniteInequalityViz';
import ParametricInequalityViz from './components/ParametricInequalityViz';
import MovingDomainViz from './components/MovingDomainViz';
import CoefficientViz from './components/CoefficientViz';
import GraphTransformationViz from './components/GraphTransformationViz';
import CompletingSquareViz from './components/CompletingSquareViz';
import SimultaneousInequalityViz from './components/SimultaneousInequalityViz';
import IntersectionViz from './components/IntersectionViz';
import QuadraticInequalityViz from './components/QuadraticInequalityViz';
import AbsoluteValueGraphViz from './components/AbsoluteValueGraphViz';
import MovingAxisViz from './components/MovingAxisViz';
import MovingRightEdgeViz from './components/MovingRightEdgeViz';
import { generateMovingRightEdgeProblem } from './utils/moving-right-edge-generator';

import { generateIndependentVariablesProblem } from './utils/independent-variables-generator';
import IndependentVariablesViz from './components/IndependentVariablesViz';
import QuadraticFormulaViz from './components/QuadraticFormulaViz';
import InscribedPerimeterViz from './components/InscribedPerimeterViz';
import TranslationDeterminationViz from './components/TranslationDeterminationViz';
import { generateTranslationDeterminationProblem } from './utils/translation-determination-generator';
import ShapeOptimizationViz from './components/ShapeOptimizationViz';
import AbsoluteValueEquationViz from './components/AbsoluteValueEquationViz';
import SolutionsInRangeViz from './components/SolutionsInRangeViz';
import DeterminationViz from './components/DeterminationViz';
import CommonRootsViz from './components/CommonRootsViz';
import AtLeastOnePositiveRootViz from './components/AtLeastOnePositiveRootViz';
import { AbsoluteValueMaxMinViz } from './components/AbsoluteValueMaxMinViz';
import { IntersectionDistanceViz } from './components/IntersectionDistanceViz';
import DiscriminantViz from './components/DiscriminantViz';
import MaxMinViz from './components/MaxMinViz';
import ConditionalMaxMinViz from './components/ConditionalMaxMinViz';
import SubstitutionMaxMinViz from './components/SubstitutionMaxMinViz';
import { generateInequalityCoefficientProblem } from './utils/inequality-coefficient-generator';
import { generateSegmentLengthProblem } from './utils/segment-length-generator';
import { generateConditionalMaxMinProblem } from './utils/conditional-max-min-generator';
import { generateAbsoluteInequalityProblem } from './utils/absolute-inequality-generator';
import InequalityCoefficientViz from './components/InequalityCoefficientViz';
import AbsoluteValueInequalityViz from './components/AbsoluteValueInequalityViz';
import { generateAbsoluteValueInequalityProblem } from './utils/absolute-value-inequality-generator';
import SegmentLengthViz from './components/SegmentLengthViz';
import AbsoluteInequalityViz from './components/AbsoluteInequalityViz';
import SignOfRootsViz from './components/SignOfRootsViz';
import { generateSignOfRootsProblem } from './utils/sign-of-roots-generator';
import { generateCoefficientSignsProblem } from './utils/coefficient-signs-generator';

import AbsoluteGraphLineViz from './components/AbsoluteGraphLineViz';
import MultipleAbsoluteViz from './components/MultipleAbsoluteViz';
import CoefficientSignsViz from './components/CoefficientSignsViz';
import VertexLocusViz from './components/VertexLocusViz';
import TriangleAreaViz from './components/TriangleAreaViz';
import { generateVertexLocusProblem } from './utils/vertex-locus-generator';
import { generateTriangleAreaProblem } from './utils/triangle-area-generator';


import { generateAbsoluteGraphLineProblem } from './utils/absolute-graph-line-generator';
import { generateMultipleAbsoluteProblem } from './utils/multiple-absolute-generator';




// LaTeX Support
import { generateExternalTangentProblem } from "./utils/external-tangent-generator";
import { ExternalTangentViz } from "./components/ExternalTangentViz";
import DifferentSignsViz from './components/DifferentSignsViz';
import ProfitMaximizationViz from './components/ProfitMaximizationViz';
import { generateDifferentSignsProblem } from './utils/different-signs-generator';
import OneRealRootConditionViz from './components/OneRealRootConditionViz';
import { generateOneRealRootCondition } from './utils/one-real-root-generator';

import 'katex/dist/katex.min.css';
import IntegerRootsQuadraticViz from "./components/IntegerRootsQuadraticViz";
import ParametricRootsViz from "./components/ParametricRootsViz";
import ParabolaLineViz from "./components/ParabolaLineViz";
import MovingDomainMaxMinViz from "./components/MovingDomainMaxMinViz";

import { LEVELS } from './data/levels';
import MathDisplay from '@/app/lib/components/MathDisplay';

// Problem Type Definitions
interface Problem {
  id: string;
  type: string;
  question: string;
  equation?: string;
  equations?: string[]; // For simultaneous inequalities
  params?: Record<string, unknown>;
  explanation?: string | string[];

  // Roots Location specific
  conditions?: { discriminant: string; axis: string; boundary?: string; endpoints?: string };
  parameters?: { m_coeff: number; constant_m: number; constant_val: number };

  // Parametric Inequality specific
  fixedRoot?: number;
  variableRootExpr?: string;
  inequalitySign?: '<' | '>' | '<=' | '>=';
  cases?: { condition: string; solution: string }[];

  // Definite Inequality specific
  inequality?: string;
  condition?: string;
  k_val?: number;

  // Completing Square specific
  expansion?: string;

  // Simultaneous Inequality specific
  ranges?: { min: number; max: number; type: 'inside' | 'outside' }[];

  // Moving Domain specific
  p?: number;
  q?: number;
  width?: number;

  // Moving Axis specific
  domain?: { start: number; end: number } | [number, number];

  // Shape Optimization specific
  totalLength?: number;

  // Absolute Value Equation specific
  a_val?: number;
  k_param?: string;

  // Solutions In Range specific
  k?: number;
  rangeStart?: number;
  rangeEnd?: number;
  vertex?: [number, number];
  target?: 'max' | 'min';
  generalForm?: string;

  // Graph Transformation specific
  original?: { a: number; p: number; q: number };
  transformation?: { type: 'translation' | 'symmetry_x' | 'symmetry_y' | 'symmetry_origin'; dx?: number; dy?: number };
  answer?: string;

  // Moving Axis specific
  problemType?: 'min' | 'max';

  // Parametric Inequality / Multiple Absolute specific
  questionText?: string;

  // Translation specific
  shift?: { dx: number; dy: number };
  answerString?: string;

}

export default function QuadraticPage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Visualization State
  const [mValue, setMValue] = useState(0); // For RootsLocationViz
  const [kValue, setKValue] = useState(0); // For DefiniteInequalityViz
  
  // Reset values when problem changes
  useEffect(() => {
    setMValue(0);
    setKValue(0);
    setShowExplanation(false);
  }, [problem, currentLevel]);

  const generateProblem = () => {
    let newProblem;
    const levelConfig = LEVELS.find(l => l.id === currentLevel);
    if (!levelConfig) return;

    try {
      switch (levelConfig.type) {
        case 'completing_square':
          newProblem = generateCompletingSquareProblem();
          break;
        case 'roots_location':
          newProblem = generateRootsLocationProblem();
          break;
        case 'definite_inequality':
          newProblem = generateDefiniteInequalityProblem();
          break;
        case 'parametric_inequality':
          newProblem = generateParametricInequalityProblem();
          break;
        case 'moving_domain':
          newProblem = generateMovingDomainProblem();
          break;
        case 'moving_axis':
          newProblem = generateMovingAxisProblem();
          break;
        case 'coefficient_determination':
          newProblem = generateCoefficientProblem();
          break;
        case 'graph_transformation':
          newProblem = generateGraphTransformationProblem();
          break;
        case 'quadratic_inequality':
          newProblem = generateQuadraticInequalityProblem();
          break;
        case 'simultaneous_inequality':
          newProblem = generateSimultaneousInequalityProblem();
          break;
        case 'intersection':
          newProblem = generateIntersectionProblem();
          break;
        case 'absolute_value_graph':
          newProblem = generateAbsoluteValueProblem();
          break;
        case 'shape_optimization':
          newProblem = generateShapeOptimizationProblem();
          break;
        case 'absolute_value_equation':
          newProblem = generateAbsoluteValueEquationProblem();
          break;
        case 'solutions_in_range':
          newProblem = generateSolutionsInRangeProblem();
          break;
        case 'determination':
          newProblem = generateDeterminationProblem();
          break;
        case 'common_roots':
          newProblem = generateCommonRootsProblem();
          break;
        case 'absolute_value_max_min':
          newProblem = generateAbsoluteValueMaxMinProblem();
          break;
        case 'discriminant':
          newProblem = generateDiscriminantProblem();
          break;
        case 'max_min':
          newProblem = generateMaxMinProblem();
          break;
        case 'conditional_max_min':
          newProblem = generateConditionalMaxMinProblem();
          break;
        case 'substitution_max_min':
          newProblem = generateSubstitutionMaxMinProblem();
          break;
        case 'segment_length':
          newProblem = generateSegmentLengthProblem();
          break;
        case 'inequality_coefficient':
          newProblem = generateInequalityCoefficientProblem();
          break;
        case 'absolute_inequality':
          newProblem = generateAbsoluteInequalityProblem();
          break;
        case 'absolute_value_inequality':
          newProblem = generateAbsoluteValueInequalityProblem();
          break;
        case 'sign_of_roots':
          newProblem = generateSignOfRootsProblem();
          break;
        case 'absolute_graph_line':
          newProblem = generateAbsoluteGraphLineProblem();
          break;
        case 'multiple_absolute':
          newProblem = generateMultipleAbsoluteProblem();
          break;
        case 'coefficient_signs':
          newProblem = generateCoefficientSignsProblem();
          break;
        case 'intersection_distance':
          newProblem = { id: Date.now(), title: "放物線と直線の交点間の距離", target: "距離 L", equation: "", formula: "", hint: "スライダーを動かして交点間の距離が変わる様子を確認しましょう。", expected: [], options: [], type: "intersection_distance" };
          break;
        case 'vertex_locus':
          newProblem = generateVertexLocusProblem();
          break;
        case 'triangle_area_optimization':
          newProblem = generateTriangleAreaProblem();
          break;
        case 'two_parabolas':
          newProblem = generateTwoParabolasProblem();
          break;
        case 'difference_function':
          newProblem = generateDifferenceFunctionProblem();
          break;
        case 'at_least_one_positive_root':
          newProblem = { id: Date.now(), title: '少なくとも1つの正の解', questionText: '方程式 x² - 2mx + m + 2 = 0 が少なくとも1つの正の解をもつような定数mの範囲を視覚的に確認せよ。', explanationSteps: ['D/4 ≥ 0', '軸 > 0', 'f(0) の符号で場合分け'] };
          break;
        case 'translation_determination':
          newProblem = generateTranslationDeterminationProblem();
          break;
        case 'different_signs':
          newProblem = generateDifferentSignsProblem();
          break;
        case 'profit_maximization':
          newProblem = { id: Date.now(), title: '利益の最大化', questionText: 'ある商品を100円で売ると、1日に1000個売れる。10円値上げするごとに売上個数は50個減る。利益を最大にするには、価格をいくらにすればよいか。', explanationSteps: ['価格を100+10xとする', '個数を1000-50xとする', '利益 y = (100+10x)(1000-50x) を最大化する'] };
          break;
        case 'one_real_root':
          newProblem = { id: Date.now(), title: '一方だけが実数解をもつ条件', type: 'one_real_root' };
          break;
        
        case 'quadratic_formula':
          newProblem = { id: Date.now(), title: '解の公式の視覚化', type: 'quadratic_formula' };
          break;
        case 'both_roots_between':
          newProblem = { 
            id: Date.now(), 
            title: '2つの解が特定の区間にある条件', 
            type: 'both_roots_between',
            questionText: '2次方程式 x² - 2ax + a + 2 = 0 の2つの解がともに 0 < x < 3 の範囲にあるような定数aの値の範囲を視覚的に求めよ。',
            explanationSteps: ['D ≥ 0', '0 < 軸 < 3', 'f(0) > 0 かつ f(3) > 0']
          };
          break;

        
      case 'quadratic_formula':
          newProblem = { id: Date.now(), title: '解の公式の視覚化', type: 'quadratic_formula' };
          break;
      case 'both_roots_between':
          newProblem = { id: Date.now(), title: '2つの解が特定の区間にある条件', type: 'both_roots_between' };
          break;
      case 'domain_always_positive':
          newProblem = { id: Date.now(), title: '特定の区間で常に正・負となる条件', type: 'domain_always_positive' };
          break;

        case 'independent_variables':
          newProblem = generateIndependentVariablesProblem();
          break;
        case 'moving_right_edge':
          newProblem = generateMovingRightEdgeProblem();
          break;
        case 'two_parabolas_size':
          newProblem = generateTwoParabolasSizeProblem();
          break;
        case "quadratic_inequality_graph":
          newProblem = { id: Date.now(), title: "2次不等式の解とグラフの関係", type: "quadratic_inequality_graph" };
          break;
        case "right_triangle_rectangle":
          newProblem = { id: Date.now(), title: "直角三角形に内接する長方形の面積の最大値", type: "right_triangle_rectangle" };
          break;
        case "moving_point_area":
          newProblem = { id: Date.now(), title: "2次関数の最大・最小の応用 (動点と面積)", type: "moving_point_area" };
          break;
        case "vertical_segment_max":
          newProblem = { id: Date.now(), title: "放物線と直線の間の線分の長さの最大値", type: "vertical_segment_max" };
          break;
        case "common_tangent":
          newProblem = { id: Date.now(), title: "2つの放物線の共通接線", type: "common_tangent" };
          break;
        case "fence_enclosure":
          newProblem = { id: Date.now(), title: "壁を利用した長方形の面積の最大化", type: "fence_enclosure" };
          break;
        case "wire_squares":
          newProblem = { id: Date.now(), title: "針金を切って作る正方形の面積の和の最小化", type: "wire_squares" };
          break;
        case "intersection_parabolas":
          newProblem = { id: Date.now(), title: "2つの放物線の交点を通る図形", type: "intersection_parabolas" };
          break;
        case "integer_solutions_quadratic":
          newProblem = { id: Date.now(), title: "2次不等式の整数解の個数", type: "integer_solutions_quadratic" };
          break;
        case "max_min_coefficient_determination":
          newProblem = { id: Date.now(), title: "2次関数の決定 (最大・最小から係数決定)", type: "max_min_coefficient_determination" };
          break;
        case "vertex_on_line":
          newProblem = { id: Date.now(), title: "2次関数の決定 (頂点が直線上にある)", type: "vertex_on_line" };
          break;
        case "chord_length":
          newProblem = { id: Date.now(), title: "放物線の弦の長さ", type: "chord_length" };
          break;
        case "x_intercepts_determination":
          newProblem = { id: Date.now(), title: "x軸との交点から2次関数を決定", type: "x_intercepts_determination" };
          break;
        case "tangent_coefficient_determination":
          newProblem = { id: Date.now(), title: "接する条件から係数を決定", type: "tangent_coefficient_determination" };
          break;

        case "integer_roots_quadratic":
          newProblem = { id: Date.now(), title: "2次方程式の整数解と係数の決定", type: "integer_roots_quadratic" };
          break;

        case "three_points_determination":
          newProblem = { id: Date.now(), title: "3点から2次関数を決定", type: "three_points_determination" };
          break;

        case "external_tangent":
          newProblem = generateExternalTangentProblem();
          break;
        case "roots_placement":
          newProblem = { id: Date.now(), title: '解の配置（受験頻出パターン）', type: 'roots_placement' };
          break;
        case "moving_domain_max_min":
          newProblem = { id: Date.now(), title: '定義域が動く最大・最小（総合演習）', type: 'moving_domain_max_min' };
          break;
      }
      setProblem(newProblem as Problem);
    } catch (e) {
      console.error("Error generating problem:", e);
    }
  };

  useEffect(() => {
    generateProblem();
  }, [currentLevel]);

  const nextProblem = () => {
    generateProblem();
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="mb-8 border-b pb-4">
        <div className="mb-4">
          <BackButton href="/" />
        </div>
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Math Tactix: 数学I - 二次関数</h1>
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setCurrentLevel(level.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentLevel === level.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {level.id}. {level.title}
            </button>
          ))}
        </div>
      </header>

      <main className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {problem ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-lg font-bold text-blue-900 mb-2">問題</h2>
              <p className="text-xl mb-4 text-gray-800 font-medium">
                {problem.question || problem.questionText}
              </p>
              
              <div className="bg-white p-6 rounded shadow-inner border border-blue-100 flex justify-center items-center my-4">
                {problem.equation ? (
                  <MathDisplay tex={problem.equation} displayMode />
                ) : (problem.equations ? (
                  <div className="flex flex-col gap-2">
                     <MathDisplay tex={`\\begin{cases} ${problem.equations[0]} \\\\ ${problem.equations[1]} \\end{cases}`} displayMode />
                  </div>
                ) : (
                  <MathDisplay tex={problem.inequality || problem.questionText || ""} displayMode />
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">
                視覚的理解 (Interactive Visualization)
              </h3>
              
              <div className="min-h-[300px] flex flex-col justify-center">
                {currentLevel === 1 && problem.equation && (
                   <CompletingSquareViz equation={problem.equation} />
                )}

                {currentLevel === 31 && (
                  <IntersectionDistanceViz />
                )}
                {currentLevel === 32 && (
                  <VertexLocusViz />
                )}
                {currentLevel === 33 && (
                  <TwoParabolasViz />
                )}
                {currentLevel === 34 && (
                  <TriangleAreaViz problem={problem} />
                )}
                {currentLevel === 35 && (
                  <ExternalTangentViz />
                )}
                {currentLevel === 37 && (
                  <DifferenceFunctionViz />
                )}

                {currentLevel === 43 && (
                  <ProfitMaximizationViz />
                )}


                {currentLevel === 36 && (
                  <TwoParabolasSizeViz />
                )}
                {currentLevel === 37 && (
                  <DifferenceFunctionViz />
                )}
                


                {currentLevel === 2 && (
                  <div className="space-y-4 w-full">
                     <RootsLocationViz type={problem.type as 'positive' | 'negative' | 'different'} m={mValue} />
                     <div className="flex flex-col gap-2 bg-white p-3 rounded border">
                        <label className="font-bold text-gray-700 flex justify-between">
                          <span>パラメータ m</span>
                          <span className="text-blue-600 font-mono">{mValue.toFixed(1)}</span>
                        </label>
                        <input 
                          type="range" 
                          min="-5" max="5" step="0.1" 
                          value={mValue} 
                          onChange={(e) => setMValue(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                     </div>
                  </div>
                )}

                {currentLevel === 3 && (
                  <MovingDomainViz 
                    p={problem.p} 
                    q={problem.q} 
                    width={problem.width} 
                  />
                )}

                {currentLevel === 4 && problem.domain && (
                  <MovingAxisViz
                    domain={problem.domain as { start: number; end: number }}
                    q={3}
                    initialMode={problem.problemType || 'min'}
                  />
                )}

                {currentLevel === 5 && (
                  <div className="space-y-4 w-full">
                    <DefiniteInequalityViz k={kValue} />
                    <div className="flex flex-col gap-2 bg-white p-3 rounded border">
                        <label className="font-bold text-gray-700 flex justify-between">
                          <span>定数 k</span>
                          <span className="text-blue-600 font-mono">{kValue.toFixed(1)}</span>
                        </label>
                        <input 
                          type="range" 
                          min="-2" max="5" step="0.1" 
                          value={kValue} 
                          onChange={(e) => setKValue(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                     </div>
                  </div>
                )}

                {currentLevel === 6 && problem.params && (
                  <CoefficientViz params={problem.params as { points: { x: number; y: number; label?: string }[]; vertex?: { x: number; y: number }; a: number; b: number; c: number }} />
                )}

                {currentLevel === 7 && problem.fixedRoot !== undefined && (
                  <ParametricInequalityViz 
                    fixedRoot={problem.fixedRoot} 
                    inequalitySign={problem.inequalitySign || '<'} 
                  />
                )}

                {currentLevel === 8 && problem && (
                  <GraphTransformationViz
                     initialParams={problem.original}
                     transformationType={problem.transformation?.type}
                  />
                )}
                
                {currentLevel === 9 && (
                  <QuadraticInequalityViz
                    a={problem.params?.a as number}
                    b={problem.params?.b as number}
                    c={problem.params?.c as number}
                    inequalitySign={problem.params?.inequalitySign as string}
                  />
                )}
                
                {currentLevel === 10 && (
                  <IntersectionViz />
                )}

                {currentLevel === 11 && problem.ranges && (
                  <SimultaneousInequalityViz initialRanges={problem.ranges} />
                )}
                
                {currentLevel === 12 && (
                  <AbsoluteValueGraphViz />
                )}

                {currentLevel === 13 && (problem.params?.totalLength != null) && (
                  <ShapeOptimizationViz
                    totalLength={problem.params.totalLength as number}
                  />
                )}

                {currentLevel === 14 && (problem.params?.a != null) && (
                  <AbsoluteValueEquationViz
                    a={problem.params.a as number}
                    initialK={(problem.params.k as number) || 2}
                    mode={problem.params.mode as 'count' | 'range'}
                  />
                )}

                {currentLevel === 14 && problem.a_val && (
                  <AbsoluteValueEquationViz
                    a={problem.a_val}
                  />
                )}

                {currentLevel === 15 && (
                  <SolutionsInRangeViz problem={problem} />
                )}

                {currentLevel === 16 && problem.params && (
                  <DeterminationViz params={problem.params} />
                )}

                {currentLevel === 17 && (
                  <CommonRootsViz />
                )}
                {currentLevel === 18 && (
                  <AbsoluteValueMaxMinViz problem={problem} isCorrect={false} />
                )}
                {currentLevel === 19 && (
                  <DiscriminantViz />
                )}
                {currentLevel === 21 && (
                  <ConditionalMaxMinViz />
                )}
                {currentLevel === 23 && (
                  <SegmentLengthViz />
                )}
                {currentLevel === 24 && (
                  <InequalityCoefficientViz levelParams={problem} onSuccess={() => {}} />
                )}
                {currentLevel === 25 && (
                  <AbsoluteInequalityViz />
                )}
                {currentLevel === 26 && (
                  <AbsoluteValueInequalityViz a={(problem.params?.a as number) || 2} initialM={(problem.params?.m as number) || 1} initialN={(problem.params?.n as number) || 1} />
                )}
                {currentLevel === 27 && problem && (
                
                  <SignOfRootsViz problem={problem} />
                )}
                {currentLevel === 28 && problem && (
                  <AbsoluteGraphLineViz problem={problem as unknown as { description: string; explanation: string; a: number; b: number; c: number }} />
                )}
                {currentLevel === 29 && problem && (
                  <MultipleAbsoluteViz />
                )}
                {currentLevel === 30 && problem && (
                  <CoefficientSignsViz />
                )}
                {currentLevel === 22 && problem && (
                  <SubstitutionMaxMinViz problem={problem} />
                )}
                {currentLevel === 20 && problem.domain && problem.vertex && (
                  <MaxMinViz
                    a={problem.generalForm?.includes('-') && !problem.generalForm?.startsWith('y = x') && !problem.generalForm?.startsWith('y = (x') ? -1 : 1}
                    p={problem.vertex[0]}
                    q={problem.vertex[1]}
                    domain={problem.domain as [number, number]}
                    target={problem.target || 'min'}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={toggleExplanation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{showExplanation ? '解説を隠す' : '解説を見る'}</span>
              </button>
              <button
                onClick={nextProblem}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>次の問題 &rarr;</span>
              </button>
            </div>

            {showExplanation && (
              <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200 animate-fadeIn shadow-sm">
                <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <span>💡 解説</span>
                </h3>
                <div className="prose text-gray-800 max-w-none">
                  {Array.isArray(problem.explanation) 
                    ? problem.explanation.map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                           {line.split('$').map((part, index) => 
                             index % 2 === 1 ? <MathDisplay key={index} tex={part} /> : part
                           )}
                        </p>
                      ))
                    : (problem.explanation ? (
                        <p className="leading-relaxed">
                          {(problem.explanation as string).split('$').map((part, index) => 
                            index % 2 === 1 ? <MathDisplay key={index} tex={part} /> : part
                          )}
                        </p>
                      ) : (
                        // Fallback logic
                        currentLevel === 7 ? (
                          <div>
                            <p>この問題はグラフを描いて定数 <MathDisplay tex="a" /> の位置による場合分けが必要です。</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {problem.cases?.map((c, i) => (
                                <li key={i}>
                                  <strong><MathDisplay tex={c.condition} /></strong> のとき: <MathDisplay tex={c.solution} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : currentLevel === 5 ? (
                          <div>
                             <p>条件: <MathDisplay tex={problem.condition || ""} /></p>
                             <p className="mt-2 font-bold">答え: <MathDisplay tex={problem.answer || ""} /></p>
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">解説は準備中です。視覚化ツールを使って確認してみましょう。</div>
                        )
                      )
                    )
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <div className="animate-pulse">問題を生成中...</div>
          </div>
        )}
        {currentLevel === 40 && <AtLeastOnePositiveRootViz />}
        {currentLevel === 38 && <MovingRightEdgeViz />}
        {currentLevel === 39 && <IndependentVariablesViz />}
        {currentLevel === 41 && <TranslationDeterminationViz />}
        {currentLevel === 42 && <DifferentSignsViz />}
        {currentLevel === 43 && <ProfitMaximizationViz />}
        {currentLevel === 44 && <OneRealRootConditionViz />}
              {currentLevel === 45 && <DomainAlwaysPositiveViz />}
        {currentLevel === 46 && <BothRootsBetweenViz />}
        {currentLevel === 47 && <QuadraticFormulaViz />}
        {currentLevel === 48 && <InscribedPerimeterViz />}
        {currentLevel === 49 && <QuadraticInequalityGraphViz />}
        {currentLevel === 50 && <RightTriangleRectangleViz />}
        {currentLevel === 51 && <MovingPointAreaViz />}
        {currentLevel === 52 && <VerticalSegmentMaxViz />}
        {currentLevel === 53 && <FenceEnclosureViz />}
        {currentLevel === 54 && <WireSquaresViz />}
        {currentLevel === 55 && <CommonTangentViz />}
        {currentLevel === 56 && <IntersectionParabolasViz />}
        {currentLevel === 57 && <IntegerSolutionsQuadraticViz />}
        {currentLevel === 58 && <MaxMinCoefficientDeterminationViz />}
        {currentLevel === 59 && <VertexOnLineViz />}
        {currentLevel === 60 && <ChordLengthViz />}
        {currentLevel === 61 && <ThreePointsDeterminationViz />}
        {currentLevel === 62 && <XInterceptsDeterminationViz />}
        {currentLevel === 63 && <TangentCoefficientDeterminationViz />}
        {currentLevel === 64 && <VertexAxisDeterminationViz />}
        {currentLevel === 65 && <TranslationQuadraticViz />}
        {currentLevel === 66 && <IntegerRootsQuadraticViz />}
        {currentLevel === 67 && <AbsoluteInequalityAllRealsViz />}
        {currentLevel === 68 && <RootsPlacementViz />}
        {currentLevel === 69 && <ParametricRootsViz />}
        {currentLevel === 70 && <ParabolaLineViz />}
        {currentLevel === 71 && <MovingDomainMaxMinViz />}




      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
        &copy; 2026 Math Tactix | Visual & Intuitive Math Learning
      </footer>
    </div>
  );
}
