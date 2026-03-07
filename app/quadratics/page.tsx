'use client';

import React, { useState, useEffect } from 'react';
import { generateRootsLocationProblem } from './utils/roots-location-generator';
import { generateDefiniteInequalityProblem } from './utils/definite-inequality-generator';
import { generateParametricInequalityProblem } from './utils/parametric-inequality-generator';
import { generateCoefficientProblem, CoefficientProblem } from './utils/coefficient-determination-generator';
import RootsLocationViz from './components/RootsLocationViz';
import DefiniteInequalityViz from './components/DefiniteInequalityViz';
import ParametricInequalityViz from './components/ParametricInequalityViz';
import CoefficientViz from './components/CoefficientViz';

type ProblemType = 'roots_location' | 'definite_inequality' | 'parametric_inequality' | 'coefficient_determination';

interface Problem {
  id: string;
  type: string; // Relaxed type to allow specific subtypes
  question: string; // Normalized property name? Generators might use questionText
  equation?: string;
  params?: any; // For coefficient
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
}

const LEVELS = [
  { id: 13, title: '解の配置 (Location of Roots)', type: 'roots_location' },
  { id: 14, title: '定義域が動く最大・最小 (Moving Domain)', type: 'parametric_inequality' },
  { id: 15, title: '絶対不等式 (Definite Inequality)', type: 'definite_inequality' },
  { id: 16, title: '係数決定 (Coefficient Determination)', type: 'coefficient_determination' },
];

export default function QuadraticPage() {
  const [currentLevel, setCurrentLevel] = useState(13);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [mValue, setMValue] = useState(0); // For RootsLocationViz
  const [kValue, setKValue] = useState(0); // For DefiniteInequalityViz
  const [aValue, setAValue] = useState(0); // For ParametricInequalityViz (param 'a')
  
  // Reset values when problem changes
  useEffect(() => {
    setMValue(0);
    setKValue(0);
    setAValue(0);
  }, [problem]);

  const generateProblem = () => {
    let newProblem;
    const levelConfig = LEVELS.find(l => l.id === currentLevel);
    if (!levelConfig) return;

    switch (levelConfig.type) {
      case 'roots_location':
        newProblem = generateRootsLocationProblem();
        break;
      case 'definite_inequality':
        newProblem = generateDefiniteInequalityProblem();
        break;
      case 'parametric_inequality':
        newProblem = generateParametricInequalityProblem();
        break;
      case 'coefficient_determination':
        newProblem = generateCoefficientProblem();
        break;
    }
    setProblem(newProblem as any);
    setShowExplanation(false);
  };

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
              Level {level.id}: {level.title}
            </button>
          ))}
        </div>
      </header>

      <main className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {problem ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-lg font-bold text-blue-900 mb-2">問題</h2>
              <p className="text-xl mb-2">{problem.question || (problem as any).questionText}</p>
              <div className="font-mono text-2xl bg-white p-3 rounded border border-blue-100 inline-block">
                {problem.equation || (problem as any).inequality || (problem as any).questionText}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-bold text-gray-700 mb-3">視覚的理解 (Interactive Visualization)</h3>
              
              {currentLevel === 13 && (
                <div className="space-y-4">
                   <RootsLocationViz 
                      type={problem.type as any} 
                      m={mValue} 
                   />
                   <div className="flex flex-col gap-2">
                      <label className="font-bold text-gray-700">パラメータ m: {mValue.toFixed(1)}</label>
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

              {currentLevel === 14 && problem.fixedRoot !== undefined && (
                <ParametricInequalityViz 
                  fixedRoot={problem.fixedRoot} 
                  inequalitySign={problem.inequalitySign || '<'} 
                />
              )}

              {currentLevel === 15 && (
                <div className="space-y-4">
                  <DefiniteInequalityViz k={kValue} />
                  <div className="flex flex-col gap-2">
                      <label className="font-bold text-gray-700">定数 k: {kValue.toFixed(1)}</label>
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

              {currentLevel === 16 && problem.params && (
                <CoefficientViz params={problem.params} />
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleExplanation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-transform active:scale-95"
              >
                {showExplanation ? '解説を隠す' : '解説を見る'}
              </button>
              <button
                onClick={nextProblem}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg shadow transition-transform active:scale-95"
              >
                次の問題
              </button>
            </div>

            {showExplanation && (
              <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200 animate-fadeIn">
                <h3 className="text-lg font-bold text-yellow-800 mb-3">解説</h3>
                <div className="prose text-gray-800 whitespace-pre-wrap">
                  {Array.isArray(problem.explanation) 
                    ? problem.explanation.map((line, i) => <p key={i}>{line}</p>)
                    : problem.explanation || (
                      // Fallback for problems without explicit explanation field
                      currentLevel === 14 ? (
                        <div>
                          <p>この問題はグラフを描いて定数 $a$ の位置による場合分けが必要です。</p>
                          <ul className="list-disc pl-5 mt-2">
                            {(problem as any).cases?.map((c: any, i: number) => (
                              <li key={i}><strong>{c.condition}</strong> のとき: {c.solution}</li>
                            ))}
                          </ul>
                        </div>
                      ) : currentLevel === 15 ? (
                        <div>
                           <p>条件: {(problem as any).condition}</p>
                           <p>答え: {(problem as any).answer}</p>
                        </div>
                      ) : "解説準備中"
                    )
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            問題を生成中...
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        Math Tactix v1.3 - Visual & Intuitive Math Learning
      </footer>
    </div>
  );
}
