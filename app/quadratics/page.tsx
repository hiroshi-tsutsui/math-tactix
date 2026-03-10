'use client';

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

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Problem Type Definitions
interface Problem {
  id: string;
  type: string;
  question: string;
  equation?: string;
  equations?: string[]; // For simultaneous inequalities
  params?: any;
  explanation?: string | string[];
  
  // Roots Location specific
  conditions?: any;
  parameters?: any;
  
  // Parametric Inequality specific
  fixedRoot?: number;
  variableRootExpr?: string;
  inequalitySign?: '<' | '>' | '<=' | '>=';
  cases?: any[];
  
  // Definite Inequality specific
  inequality?: string;
  condition?: string;
  k_val?: number;

  // Completing Square specific
  expansion?: string;

  // Simultaneous Inequality specific
  ranges?: any[];

  // Moving Domain specific
  p?: number;
  q?: number;
  width?: number;

  // Moving Axis specific
  domain?: any;

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
}

// Level Configuration
const LEVELS = [
  { id: 1, title: '平方完成', type: 'completing_square' },
  { id: 2, title: '解の配置', type: 'roots_location' },
  { id: 3, title: '定義域が動く最大・最小', type: 'moving_domain' },
  { id: 4, title: '軸が動く最大・最小', type: 'moving_axis' },
  { id: 5, title: '絶対不等式', type: 'definite_inequality' },
  { id: 6, title: '係数決定', type: 'coefficient_determination' },
  { id: 7, title: '文字係数の2次不等式', type: 'parametric_inequality' },
  { id: 8, title: 'グラフの移動', type: 'graph_transformation' },
  { id: 9, title: '二次不等式の解き方', type: 'quadratic_inequality' },
  { id: 10, title: '放物線と直線の共有点', type: 'intersection' },
  { id: 11, title: '連立二次不等式', type: 'simultaneous_inequality' },
  { id: 12, title: '絶対値グラフ', type: 'absolute_value_graph' },
  { id: 13, title: '文章題（最大・最小）', type: 'shape_optimization' },
  { id: 14, title: '絶対値方程式の解の個数', type: 'absolute_value_equation' },
  { id: 15, title: '解の存在範囲', type: 'solutions_in_range' },
  { id: 16, title: '二次関数の決定', type: 'determination' },
  { id: 17, title: '共通解問題', type: 'common_roots' },
  { id: 18, title: '絶対値関数の最大・最小', type: 'absolute_value_max_min' },
  { id: 19, title: '判別式とグラフの共有点', type: 'discriminant' },
  { id: 20, title: '二次関数の最大・最小 (基礎)', type: 'max_min' },
  { id: 21, title: '条件付き最大・最小', type: 'conditional_max_min' },
  { id: 22, title: '置き換えによる最大・最小', type: 'substitution_max_min' },
  { id: 23, title: 'x軸から切り取る線分の長さ', type: 'segment_length' },
  { id: 24, title: '2次不等式の決定', type: 'inequality_coefficient' },
  { id: 25, title: '常に成り立つ2次不等式', type: 'absolute_inequality' },
  { id: 26, title: '絶対値を含む不等式', type: 'absolute_value_inequality' },
  { id: 27, title: '2次方程式の実数解の符号', type: 'sign_of_roots' },
  { id: 28, title: '絶対値グラフと直線の共有点', type: 'absolute_graph_line' },
  { id: 29, title: '複数の絶対値を含む関数', type: 'multiple_absolute' },
  { id: 30, title: '係数の符号とグラフ', type: 'coefficient_signs' },
  { id: 31, title: '放物線と直線の交点間の距離', type: 'intersection_distance' },
  { id: 32, title: '放物線の頂点の軌跡', type: 'vertex_locus' },
  { id: 33, title: '2つの放物線の位置関係と接線', type: 'two_parabolas' },
  { id: 34, title: '放物線上の三角形の面積最大化', type: 'triangle_area_optimization' },
  { id: 35, title: '放物線外の点から引いた接線', type: 'external_tangent' },
  { id: 36, title: '2つの2次関数の大小', type: 'two_parabolas_size' },
  { id: 37, title: '2つのグラフの差の関数', type: 'difference_function' },
  { id: 38, title: '定義域の右端が動く最大・最小', type: 'moving_right_edge' },
  { id: 39, title: '2変数関数の最大・最小 (独立変数)', type: 'independent_variables' },
  { id: 40, title: '少なくとも1つの正の解をもつ条件', type: 'at_least_one_positive_root' },
  { id: 41, title: '放物線の平行移動の決定', type: 'translation_determination' },
  { id: 42, title: '異符号の解', type: 'different_signs' },
  { id: 43, title: '利益の最大化 (文章題)', type: 'profit_maximization' },




];

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
        case 'independent_variables':
          newProblem = generateIndependentVariablesProblem();
          break;
        case 'moving_right_edge':
          newProblem = generateMovingRightEdgeProblem();
          break;
        case 'two_parabolas_size':
          newProblem = generateTwoParabolasSizeProblem();
          break;
        case "external_tangent":
          newProblem = generateExternalTangentProblem();
          break;
      }
      setProblem(newProblem as any);
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
                {problem.question || (problem as any).questionText}
              </p>
              
              <div className="bg-white p-6 rounded shadow-inner border border-blue-100 flex justify-center items-center my-4">
                {problem.equation ? (
                  <BlockMath math={problem.equation} />
                ) : (problem.equations ? (
                  <div className="flex flex-col gap-2">
                     <BlockMath math={`\\begin{cases} ${problem.equations[0]} \\\\ ${problem.equations[1]} \\end{cases}`} />
                  </div>
                ) : (
                  <BlockMath math={(problem as any).inequality || (problem as any).questionText || ""} />
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
                     <RootsLocationViz type={problem.type as any} m={mValue} />
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

                {currentLevel === 4 && (problem as any).domain && (
                  <MovingAxisViz 
                    domain={(problem as any).domain} 
                    q={3} 
                    initialMode={(problem as any).problemType || 'min'}
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
                  <CoefficientViz params={problem.params} />
                )}

                {currentLevel === 7 && problem.fixedRoot !== undefined && (
                  <ParametricInequalityViz 
                    fixedRoot={problem.fixedRoot} 
                    inequalitySign={problem.inequalitySign || '<'} 
                  />
                )}

                {currentLevel === 8 && problem && (
                  <GraphTransformationViz 
                     initialParams={(problem as any).original}
                     targetParams={showExplanation ? (problem as any).answer : undefined}
                     transformationType={(problem as any).transformation?.type}
                  />
                )}
                
                {currentLevel === 9 && (
                  <QuadraticInequalityViz 
                    a={(problem as any).params.a} 
                    b={(problem as any).params.b} 
                    c={(problem as any).params.c} 
                    inequalitySign={(problem as any).params.inequalitySign}
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

                {currentLevel === 13 && (problem as any).params?.totalLength && (
                  <ShapeOptimizationViz 
                    totalLength={(problem as any).params.totalLength}
                  />
                )}

                {currentLevel === 14 && (problem as any).params?.a && (
                  <AbsoluteValueEquationViz 
                    a={(problem as any).params.a}
                    initialK={(problem as any).params.k || 2}
                    mode={(problem as any).params.mode}
                  />
                )}

                {currentLevel === 14 && (problem as any).a_val && (
                  <AbsoluteValueEquationViz 
                    a={(problem as any).a_val}
                  />
                )}

                {currentLevel === 15 && (
                  <SolutionsInRangeViz problem={problem} />
                )}

                {currentLevel === 16 && (
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
                  <AbsoluteValueInequalityViz a={(problem as any).params?.a || 2} initialM={(problem as any).params?.m || 1} initialN={(problem as any).params?.n || 1} />
                )}
                {currentLevel === 27 && problem && (
                
                  <SignOfRootsViz problem={problem} />
                )}
                {currentLevel === 28 && problem && (
                  <AbsoluteGraphLineViz problem={problem as any} />
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
                {currentLevel === 20 && (problem as any).domain && (problem as any).vertex && (
                  <MaxMinViz 
                    a={(problem as any).generalForm.includes('-') && !(problem as any).generalForm.startsWith('y = x') && !(problem as any).generalForm.startsWith('y = (x') ? -1 : 1} 
                    p={(problem as any).vertex[0]} 
                    q={(problem as any).vertex[1]} 
                    domain={(problem as any).domain as [number, number]} 
                    target={(problem as any).target as 'max' | 'min'} 
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
                             index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
                           )}
                        </p>
                      ))
                    : (problem.explanation ? (
                        <p className="leading-relaxed">
                          {(problem.explanation as string).split('$').map((part, index) => 
                            index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
                          )}
                        </p>
                      ) : (
                        // Fallback logic
                        currentLevel === 7 ? (
                          <div>
                            <p>この問題はグラフを描いて定数 <InlineMath math="a" /> の位置による場合分けが必要です。</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {(problem as any).cases?.map((c: any, i: number) => (
                                <li key={i}>
                                  <strong><InlineMath math={c.condition} /></strong> のとき: <InlineMath math={c.solution} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : currentLevel === 5 ? (
                          <div>
                             <p>条件: <InlineMath math={(problem as any).condition} /></p>
                             <p className="mt-2 font-bold">答え: <InlineMath math={(problem as any).answer} /></p>
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
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
        &copy; 2026 Math Tactix | Visual & Intuitive Math Learning
      </footer>
    </div>
  );
}
