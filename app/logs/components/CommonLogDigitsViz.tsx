"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';

interface CommonLogDigitsVizProps {
  mode?: 'explore';
}

const CommonLogDigitsViz: React.FC<CommonLogDigitsVizProps> = () => {
  const [nPower, setNPower] = useState(10);

  const value = Math.pow(2, nPower);
  const log10val = nPower * Math.log10(2);
  const digits = Math.floor(log10val) + 1;

  const examples = useMemo(() => {
    return Array.from({ length: Math.min(nPower, 20) }, (_, i) => {
      const p = i + 1;
      const val = Math.pow(2, p);
      const l = p * Math.log10(2);
      return {
        power: p,
        value: val,
        log10: l,
        digits: Math.floor(l) + 1,
      };
    });
  }, [nPower]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-4 space-y-2">
          <MathDisplay
            tex={`2^{${nPower}} = ${value <= 1e15 ? value.toLocaleString() : `\\approx ${value.toExponential(3)}`}`}
            displayMode
          />
          <MathDisplay
            tex={`\\log_{10} 2^{${nPower}} = ${nPower} \\log_{10} 2 = ${nPower} \\times 0.3010 \\approx ${log10val.toFixed(4)}`}
            displayMode
          />
          <div className="text-lg font-bold text-blue-600">
            → <MathDisplay tex={`2^{${nPower}}`} /> は <span className="text-2xl">{digits}</span> 桁の数
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 px-3 text-left text-slate-500 font-bold text-xs">n</th>
                <th className="py-2 px-3 text-right text-slate-500 font-bold text-xs">2^n</th>
                <th className="py-2 px-3 text-right text-slate-500 font-bold text-xs">log10(2^n)</th>
                <th className="py-2 px-3 text-right text-slate-500 font-bold text-xs">桁数</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex) => (
                <tr
                  key={ex.power}
                  className={`border-b border-slate-100 ${
                    ex.power === nPower ? 'bg-blue-50 font-bold' : ''
                  }`}
                >
                  <td className="py-1.5 px-3">{ex.power}</td>
                  <td className="py-1.5 px-3 text-right font-mono text-xs">
                    {ex.value <= 1e12 ? ex.value.toLocaleString() : ex.value.toExponential(2)}
                  </td>
                  <td className="py-1.5 px-3 text-right text-blue-600">{ex.log10.toFixed(3)}</td>
                  <td className="py-1.5 px-3 text-right font-bold text-pink-600">{ex.digits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">指数 n</span>
          <span className="font-bold text-blue-600">{nPower}</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={nPower}
          onChange={(e) => setNPower(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-900">
        <p className="font-bold mb-1">桁数の求め方</p>
        <MathDisplay
          tex={`N \\text{ の桁数} = \\lfloor \\log_{10} N \\rfloor + 1`}
          displayMode
        />
        <p className="mt-2">
          <MathDisplay tex="\\log_{10} 2 \\approx 0.3010" /> を覚えておくと、
          2 のべき乗の桁数がすぐに分かります。
        </p>
      </div>
    </div>
  );
};

export default CommonLogDigitsViz;
