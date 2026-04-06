"use client";

import React from 'react';
import { Compass, Circle, Zap, Activity, Target, TrendingUp } from 'lucide-react';
import MathComponent from './MathComponent';

interface TrigExplanationProps {
  level: number;
  angle: number;
  sinVal: string;
  cosVal: string;
  // Level 4 (Sine Rule)
  sideA: string;
  radiusVal: number;
  diameter: string;
  ratioCalc: string;
  // Level 5 (Cosine Rule)
  sideB_val: number;
  sideC_val: number;
  aSquared: string;
  sideA_val: string;
  // Level 6 (Area)
  area_b: number;
  area_c: number;
  area_sinA: number;
  area_h: string;
  area_S: string;
}

export default function TrigExplanation({
  level,
  angle,
  sinVal,
  cosVal,
  sideA,
  radiusVal,
  diameter,
  ratioCalc,
  sideB_val,
  sideC_val,
  aSquared,
  sideA_val,
  area_b,
  area_c,
  area_sinA,
  area_h,
  area_S,
}: TrigExplanationProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
      {level === 1 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Compass className="w-4 h-4" /> 直角三角形による定義</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            直角三角形において、角度 <MathComponent tex="\theta" /> が決まれば、辺の比は一定になります。
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-red-500 font-bold mb-1">sin θ</div>
              <div>対辺/斜辺</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-blue-500 font-bold mb-1">cos θ</div>
              <div>底辺/斜辺</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 font-bold mb-1">tan θ</div>
              <div>対辺/底辺</div>
            </div>
          </div>
        </div>
      )}

      {level === 2 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Circle className="w-4 h-4" /> 単位円による拡張</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            半径1の円周上の点 P(x, y) として定義を拡張します。<br/>
            これにより、90°以上の鈍角でも三角比を定義できます。
          </p>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-center">
            P(x, y) = (\cos \theta, \sin \theta)
          </div>
        </div>
      )}

      {level === 3 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> 三角比の相互関係</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            単位円上の点は <MathComponent tex="x^2 + y^2 = 1" /> を満たします。<br/>
            <MathComponent tex="x=\cos\theta, y=\sin\theta" /> を代入すると、最も重要な公式が導かれます。
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
            <MathComponent tex="\sin^2\theta + \cos^2\theta = 1" className="text-xl font-bold text-blue-700 dark:text-blue-400" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            スライダーを動かして、常に和が1になることを確認しましょう。
          </p>
        </div>
      )}

      {level === 4 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4" /> 正弦定理 (Sine Rule)</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            三角形の外接円の半径を <MathComponent tex="R" /> とすると、以下の関係が成り立ちます。
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-center">
            <MathComponent tex="\frac{a}{\sin A} = 2R" className="text-xl font-bold text-amber-700 dark:text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            角度 <MathComponent tex="A" /> を変えると、対辺 <MathComponent tex="a" /> の長さも変わり、その比率は常に直径 <MathComponent tex="2R" /> に等しくなります。
          </p>
        </div>
      )}

      {level === 5 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4" /> 余弦定理 (Cosine Rule)</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            三角形の2辺とその間の角が分かれば、残りの1辺の長さが求まります。<br/>
            三平方の定理 <MathComponent tex="a^2 = b^2 + c^2" /> の一般化です。
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 text-center">
            <MathComponent tex="a^2 = b^2 + c^2 - 2bc \cos A" className="text-xl font-bold text-red-700 dark:text-red-400" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            スライダーで角度を変えて、辺 <MathComponent tex="a" /> の長さの変化を確認しましょう。
          </p>
        </div>
      )}

      {level === 6 && (
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 三角形の面積 (Area)</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            底辺を <MathComponent tex="c" /> とすると、高さは <MathComponent tex="h = b \sin A" /> となります。<br/>
            したがって、面積 <MathComponent tex="S" /> は以下の公式で求まります。
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 text-center">
            <MathComponent tex="S = \frac{1}{2}bc \sin A" className="text-xl font-bold text-green-700 dark:text-green-400" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            角度 <MathComponent tex="A" /> が90°に近づくと <MathComponent tex="\sin A" /> が最大(1)になり、面積も最大になります。
          </p>
        </div>
      )}
    </div>
  );
}
