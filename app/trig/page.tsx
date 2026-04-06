"use client";

import React, { useState, useReducer } from 'react';
import { GeistSans } from 'geist/font/sans';
import {
  ChevronLeft, Zap, Target,
  Compass, Activity,
  Trophy, Star, Circle, TrendingUp
} from 'lucide-react';
import BackButton from '../components/BackButton';
import 'katex/dist/katex.min.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import SineLawViz from './components/SineLawViz';
import CosineLawViz from './components/CosineLawViz';
import TriangleAreaViz from './components/TriangleAreaViz';
import TrigCanvas from './components/TrigCanvas';
import TrigOverlay from './components/TrigOverlay';
import TrigExplanation from './components/TrigExplanation';
import TrigQuiz, { QUIZ_DATA } from './components/TrigQuiz';
import TrigIdentityPractice from './components/TrigIdentityPractice';
import SurveyingViz from './components/SurveyingViz';
import CircleRadiusViz from './components/CircleRadiusViz';

// --- Types ---
type State = {
  level: number;
  angle: number;
  step: number;
  quizIndex: number;
  score: number;
  feedback: 'idle' | 'correct' | 'wrong';
};

type Action =
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_ANGLE'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'NEXT_QUIZ' }
  | { type: 'SUBMIT_ANSWER'; payload: string }
  | { type: 'RESET_LEVEL' }
  | { type: 'RESET_ALL' };

const FAMOUS_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

function trigReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LEVEL': return { ...state, level: action.payload, step: 0, angle: 30, quizIndex: 0, score: 0, feedback: 'idle' };
    case 'SET_ANGLE': {
      let angle = action.payload;
      const snapTarget = FAMOUS_ANGLES.find(fa => Math.abs(fa - angle) < 3);
      if (snapTarget !== undefined) angle = snapTarget;
      return { ...state, angle };
    }
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'NEXT_QUIZ': return { ...state, quizIndex: state.quizIndex + 1, feedback: 'idle' };
    case 'SUBMIT_ANSWER': {
      const isCorrect = action.payload === QUIZ_DATA[state.quizIndex].answer;
      return { ...state, score: isCorrect ? state.score + 1 : state.score, feedback: isCorrect ? 'correct' : 'wrong' };
    }
    case 'RESET_LEVEL': return { ...state, step: 0, angle: 30, quizIndex: 0, score: 0, feedback: 'idle' };
    case 'RESET_ALL': return { level: 0, angle: 30, step: 0, quizIndex: 0, score: 0, feedback: 'idle' };
    default: return state;
  }
}

export default function TrigPage() {
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();

  const [state, dispatch] = useReducer(trigReducer, {
    level: 0,
    angle: 30,
    step: 0,
    quizIndex: 0,
    score: 0,
    feedback: 'idle'
  });
  const { level, angle } = state;

  // --- Computed values ---
  const sinVal = Math.sin((angle * Math.PI) / 180).toFixed(3);
  const cosVal = Math.cos((angle * Math.PI) / 180).toFixed(3);
  const sinSq = (Math.sin((angle * Math.PI) / 180) ** 2).toFixed(3);
  const cosSq = (Math.cos((angle * Math.PI) / 180) ** 2).toFixed(3);

  // Sine Rule (Level 4)
  const radiusVal = 10;
  const sideA = (2 * radiusVal * Math.sin(angle * Math.PI / 180)).toFixed(1);
  const diameter = (2 * radiusVal).toFixed(0);
  const ratioCalc = (Number(sideA) / Math.sin(angle * Math.PI / 180)).toFixed(1);

  // Cosine Rule (Level 5)
  const sideB_val = 10;
  const sideC_val = 14;
  const cosA = Math.cos(angle * Math.PI / 180);
  const aSquared = (sideB_val**2 + sideC_val**2 - 2 * sideB_val * sideC_val * cosA).toFixed(1);
  const sideA_val = Math.sqrt(Number(aSquared)).toFixed(2);

  // Area (Level 6)
  const area_b = 10;
  const area_c = 14;
  const area_sinA = Math.sin(angle * Math.PI / 180);
  const area_h = (area_b * area_sinA).toFixed(2);
  const area_S = (0.5 * area_b * area_c * area_sinA).toFixed(1);

  return (
    <div className={`h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col ${GeistSans.className} overflow-hidden`}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
            {level === 0 ? (
                <BackButton href="/" />
            ) : (
                <button onClick={() => dispatch({type: 'RESET_ALL'})} className="p-2 -ml-2 text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
                {level === 0 ? "MATHEMATICS I" : `LEVEL ${level}`}
            </div>
        </div>
        <div className="font-bold text-sm">
            {level === 0 ? "三角比 (Trigonometry)" :
             level === 1 ? "直角三角形 (Right Triangle)" :
             level === 2 ? "単位円 (Unit Circle)" :
             level === 3 ? "相互関係 (Identities)" :
             level === 4 ? "正弦定理 (Sine Rule)" :
             level === 5 ? "余弦定理 (Cosine Rule)" :
             level === 6 ? "三角形の面積 (Triangle Area)" :
             level === 7 ? "実践演習 (Quiz)" :
             level === 9 ? "正弦定理 詳細 (Sine Rule Detail)" :
             level === 10 ? "余弦定理 詳細 (Cosine Rule Detail)" :
             level === 11 ? "三角形の面積公式 (Triangle Area)" :
             level === 12 ? "測量問題 (Surveying)" :
             level === 13 ? "外接円・内接円 (Circumscribed/Inscribed)" :
             "相互関係の計算 (Identity Practice)"}
        </div>
        <div className="w-10" />
      </header>

      {/* Level Selection Menu */}
      {level === 0 && (
          <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-md mx-auto space-y-4">
                  <h1 className="text-2xl font-black mb-8 text-center">Select Module</h1>

                  {[
                      { id: 1, title: "Level 1: 直角三角形", desc: "sin, cos, tanの定義 (0° < θ < 90°)", icon: Compass },
                      { id: 2, title: "Level 2: 単位円", desc: "鈍角への拡張 (90° <= θ <= 180°)", icon: Circle },
                      { id: 3, title: "Level 3: 相互関係", desc: "sin²θ + cos²θ = 1 の視覚的証明", icon: Zap },
                      { id: 4, title: "Level 4: 正弦定理", desc: "a/sinA = 2R の視覚的理解", icon: Activity },
                      { id: 5, title: "Level 5: 余弦定理", desc: "三辺から角度を知る力", icon: Target },
                      { id: 6, title: "Level 6: 三角形の面積", desc: "高さ = b sinA の視覚化", icon: TrendingUp },
                      { id: 7, title: "Level 7: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy },
                      { id: 8, title: "Level 8: 相互関係の計算", desc: "sinθからcosθ, tanθを求める応用", icon: Star },
                      { id: 9, title: "Level 9: 正弦定理（詳細）", desc: "a/sinA = 2R をインタラクティブに確認", icon: Activity },
                      { id: 10, title: "Level 10: 余弦定理（詳細）", desc: "a² = b² + c² - 2bc cosA の視覚化", icon: Target },
                      { id: 11, title: "Level 11: 三角形の面積公式", desc: "S = (1/2)ab sinC の導出と計算", icon: TrendingUp },
                      { id: 12, title: "Level 12: 測量問題", desc: "仰角・俯角から高さを求める", icon: Target },
                      { id: 13, title: "Level 13: 外接円・内接円", desc: "R = a/(2sinA), r = S/s の視覚化", icon: Circle }
                  ].map((item) => (
                      <button key={item.id} onClick={() => dispatch({type: 'SET_LEVEL', payload: item.id})}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500 dark:hover:border-blue-400 transition-all group text-left shadow-sm hover:shadow-md">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                              <div className="font-bold text-lg">{item.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                          </div>
                      </button>
                  ))}
              </div>
          </main>
      )}

      {/* Level 1-6: Visualization Mode */}
      {level > 0 && level <= 6 && (
          <>
            <section className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 relative h-[400px]">
                <div className="w-full max-w-md aspect-square bg-white dark:bg-slate-950 rounded-[48px] border border-slate-200/60 dark:border-slate-800 shadow-inner overflow-hidden relative">
                    <TrigCanvas angle={angle} level={level} />

                    <TrigOverlay
                      level={level}
                      angle={angle}
                      sinVal={sinVal}
                      cosVal={cosVal}
                      sinSq={sinSq}
                      cosSq={cosSq}
                      sideA={sideA}
                      radiusVal={radiusVal}
                      diameter={diameter}
                      ratioCalc={ratioCalc}
                      sideB_val={sideB_val}
                      sideC_val={sideC_val}
                      sideA_val={sideA_val}
                      area_b={area_b}
                      area_c={area_c}
                      area_sinA={area_sinA}
                      area_S={area_S}
                    />

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-white text-sm">
                            {level === 4 ? `A = ${angle}°` : `θ = ${angle}°`}
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
                <div className="max-w-md mx-auto space-y-6">
                    {/* Controls */}
                    <div>
                        <input type="range" min={level === 4 ? 10 : 0} max={level === 1 ? 89 : 170} step="1" value={angle}
                            onChange={e => dispatch({type: 'SET_ANGLE', payload: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-black dark:accent-white cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                            <span>{level === 4 ? "10°" : "0°"}</span>
                            <span>{level === 1 ? "90°" : level === 4 ? "170°" : "180°"}</span>
                        </div>
                    </div>

                    {/* Explanations */}
                    <TrigExplanation
                      level={level}
                      angle={angle}
                      sinVal={sinVal}
                      cosVal={cosVal}
                      sideA={sideA}
                      radiusVal={radiusVal}
                      diameter={diameter}
                      ratioCalc={ratioCalc}
                      sideB_val={sideB_val}
                      sideC_val={sideC_val}
                      aSquared={aSquared}
                      sideA_val={sideA_val}
                      area_b={area_b}
                      area_c={area_c}
                      area_sinA={area_sinA}
                      area_h={area_h}
                      area_S={area_S}
                    />
                </div>
            </main>
          </>
      )}

      {/* Level 7: Quiz */}
      {level === 7 && (
        <TrigQuiz
          quizIndex={state.quizIndex}
          score={state.score}
          feedback={state.feedback}
          onSubmitAnswer={(answer) => dispatch({type: 'SUBMIT_ANSWER', payload: answer})}
          onNextQuiz={() => dispatch({type: 'NEXT_QUIZ'})}
          onResetLevel={() => dispatch({type: 'RESET_LEVEL'})}
          onResetAll={() => dispatch({type: 'RESET_ALL'})}
        />
      )}

      {/* Level 8: Identity Practice */}
      {level === 8 && (
          <TrigIdentityPractice onBack={() => dispatch({type: 'RESET_ALL'})} />
      )}

      {/* Level 9: Sine Law Detail */}
      {level === 9 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
              <div className="max-w-md mx-auto">
                  <SineLawViz />
              </div>
          </main>
      )}

      {/* Level 10: Cosine Law Detail */}
      {level === 10 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
              <div className="max-w-md mx-auto">
                  <CosineLawViz />
              </div>
          </main>
      )}

      {/* Level 11: Triangle Area */}
      {level === 11 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
              <div className="max-w-md mx-auto">
                  <TriangleAreaViz />
              </div>
          </main>
      )}

      {/* Level 12: Surveying */}
      {level === 12 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
              <div className="max-w-md mx-auto">
                  <SurveyingViz />
              </div>
          </main>
      )}

      {/* Level 13: Circumscribed/Inscribed Circle */}
      {level === 13 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
              <div className="max-w-md mx-auto">
                  <CircleRadiusViz />
              </div>
          </main>
      )}
    </div>
  );
}
