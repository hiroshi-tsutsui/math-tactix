"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface LogPropertiesVizProps {
  mode?: 'explore';
}

const LogPropertiesViz: React.FC<LogPropertiesVizProps> = () => {
  const [base, setBase] = useState(2);
  const [m, setM] = useState(4);
  const [nVal, setNVal] = useState(8);
  const [activeRule, setActiveRule] = useState(0);

  const logM = Math.log(m) / Math.log(base);
  const logN = Math.log(nVal) / Math.log(base);
  const logMN = Math.log(m * nVal) / Math.log(base);
  const logMdivN = Math.log(m / nVal) / Math.log(base);

  const rules = [
    {
      title: '積の対数',
      formula: `\\log_{${base}} (${m} \\times ${nVal}) = \\log_{${base}} ${m} + \\log_{${base}} ${nVal}`,
      calc: `= ${logM.toFixed(3)} + ${logN.toFixed(3)} = ${logMN.toFixed(3)}`,
      general: `\\log_a MN = \\log_a M + \\log_a N`,
      color: '#3b82f6',
    },
    {
      title: '商の対数',
      formula: `\\log_{${base}} \\frac{${m}}{${nVal}} = \\log_{${base}} ${m} - \\log_{${base}} ${nVal}`,
      calc: `= ${logM.toFixed(3)} - ${logN.toFixed(3)} = ${logMdivN.toFixed(3)}`,
      general: `\\log_a \\frac{M}{N} = \\log_a M - \\log_a N`,
      color: '#8b5cf6',
    },
    {
      title: '累乗の対数',
      formula: `\\log_{${base}} ${m}^{${nVal}} = ${nVal} \\log_{${base}} ${m}`,
      calc: `= ${nVal} \\times ${logM.toFixed(3)} = ${(nVal * logM).toFixed(3)}`,
      general: `\\log_a M^k = k \\log_a M`,
      color: '#ec4899',
    },
  ];

  const rule = rules[activeRule];

  // Bar visualization: show log values
  const barData = useMemo(() => {
    if (activeRule === 0) {
      return [
        { label: `\\log_{${base}} ${m}`, value: logM, color: '#3b82f6' },
        { label: `\\log_{${base}} ${nVal}`, value: logN, color: '#60a5fa' },
        { label: `\\log_{${base}} ${m * nVal}`, value: logMN, color: '#1d4ed8' },
      ];
    } else if (activeRule === 1) {
      return [
        { label: `\\log_{${base}} ${m}`, value: logM, color: '#8b5cf6' },
        { label: `\\log_{${base}} ${nVal}`, value: logN, color: '#a78bfa' },
        { label: `\\log_{${base}} \\frac{${m}}{${nVal}}`, value: logMdivN, color: '#6d28d9' },
      ];
    } else {
      return [
        { label: `\\log_{${base}} ${m}`, value: logM, color: '#ec4899' },
        { label: `${nVal} \\cdot \\log_{${base}} ${m}`, value: nVal * logM, color: '#be185d' },
      ];
    }
  }, [activeRule, base, m, nVal, logM, logN, logMN, logMdivN]);

  const maxBar = Math.max(...barData.map((d) => Math.abs(d.value)), 0.1);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center flex-wrap">
        {rules.map((r, i) => (
          <button
            key={i}
            onClick={() => setActiveRule(i)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeRule === i
                ? 'text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            style={activeRule === i ? { backgroundColor: r.color } : {}}
          >
            {r.title}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-2">
          <div className="text-xs text-slate-400 mb-1">一般法則</div>
          <MathDisplay tex={rule.general} displayMode />
        </div>
        <div className="text-center mb-4">
          <div className="text-xs text-slate-400 mb-1">計算例</div>
          <MathDisplay tex={rule.formula} displayMode />
          <MathDisplay tex={rule.calc} displayMode />
        </div>

        {/* Bar chart */}
        <div className="space-y-3 mt-4">
          {barData.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 text-right">
                <MathDisplay tex={d.label} className="text-xs" />
              </div>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                {d.value >= 0 ? (
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(d.value / maxBar) * 100}%`,
                      backgroundColor: d.color,
                      opacity: 0.7,
                    }}
                  />
                ) : (
                  <div className="absolute right-0 h-full flex items-center">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(Math.abs(d.value) / maxBar) * 100}%`,
                        backgroundColor: d.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                )}
              </div>
              <span className="text-sm font-mono font-bold w-16 text-right" style={{ color: d.color }}>
                {d.value.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">底 a</span>
            <span className="font-bold text-blue-600">{base}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">M</span>
            <span className="font-bold text-purple-600">{m}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">N</span>
            <span className="font-bold text-pink-600">{nVal}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={nVal}
            onChange={(e) => setNVal(Number(e.target.value))}
            className="w-full accent-pink-600"
          />
        </div>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
        <p className="font-bold mb-1">覚えておくこと</p>
        <p>掛け算が足し算に、割り算が引き算に、べき乗が掛け算に変換されます。これが対数の最大の利点です。</p>
      </div>
    </div>
  );
};

export default LogPropertiesViz;
