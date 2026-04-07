"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface ChangeOfBaseVizProps {
  mode?: 'explore';
}

const ChangeOfBaseViz: React.FC<ChangeOfBaseVizProps> = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(8);
  const [c, setC] = useState(10);

  const logAB = Math.log(b) / Math.log(a);
  const logCB = Math.log(b) / Math.log(c);
  const logCA = Math.log(a) / Math.log(c);
  const ratio = logCB / logCA;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-6 space-y-3">
          <div className="text-sm text-slate-500">底の変換公式</div>
          <MathDisplay
            tex={`\\log_{${a}} ${b} = \\frac{\\log_{${c}} ${b}}{\\log_{${c}} ${a}} = \\frac{${logCB.toFixed(4)}}{${logCA.toFixed(4)}} = ${ratio.toFixed(4)}`}
            displayMode
          />
        </div>

        {/* Visual: stacked bar comparison */}
        <div className="flex items-end justify-center gap-12 h-48 mt-4">
          {/* log_c b */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 bg-blue-500 rounded-t-lg transition-all duration-300 flex items-center justify-center"
              style={{ height: `${Math.min(Math.abs(logCB) * 40, 180)}px` }}
            >
              <span className="text-white text-xs font-bold rotate-[-90deg]">
                {logCB.toFixed(3)}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 text-center">
              <MathDisplay tex={`\\log_{${c}} ${b}`} />
            </div>
          </div>

          <div className="text-2xl text-slate-300 font-bold self-center">/</div>

          {/* log_c a */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 bg-purple-500 rounded-t-lg transition-all duration-300 flex items-center justify-center"
              style={{ height: `${Math.min(Math.abs(logCA) * 40, 180)}px` }}
            >
              <span className="text-white text-xs font-bold rotate-[-90deg]">
                {logCA.toFixed(3)}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 text-center">
              <MathDisplay tex={`\\log_{${c}} ${a}`} />
            </div>
          </div>

          <div className="text-2xl text-slate-300 font-bold self-center">=</div>

          {/* log_a b */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 bg-pink-500 rounded-t-lg transition-all duration-300 flex items-center justify-center"
              style={{ height: `${Math.min(Math.abs(logAB) * 40, 180)}px` }}
            >
              <span className="text-white text-xs font-bold rotate-[-90deg]">
                {logAB.toFixed(3)}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 text-center">
              <MathDisplay tex={`\\log_{${a}} ${b}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">底 a</span>
            <span className="font-bold text-blue-600">{a}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">真数 b</span>
            <span className="font-bold text-purple-600">{b}</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">変換先の底 c</span>
            <span className="font-bold text-pink-600">{c}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full accent-pink-600"
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-900">
        <p className="font-bold mb-1">底の変換公式</p>
        <MathDisplay
          tex={`\\log_a b = \\frac{\\log_c b}{\\log_c a} \\quad (a, c > 0,\\; a \\neq 1,\\; c \\neq 1)`}
          displayMode
        />
        <p className="mt-2">
          どんな底の対数でも、常用対数（底10）や自然対数（底e）に変換して計算できます。
          電卓に <MathDisplay tex="\\log_{${a}}" /> ボタンがなくても計算可能です。
        </p>
      </div>
    </div>
  );
};

export default ChangeOfBaseViz;
