import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Info } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Props {
  onComplete?: () => void;
}

export default function VarianceShortcutViz({ onComplete }: Props) {
  const [data, setData] = useState([2, 4, 6, 8, 10]);

  const handleDrag = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[idx] = parseInt(e.target.value, 10);
    setData(newData);
  };

  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const squareOfMean = mean * mean;
  
  const meanOfSquares = data.reduce((a, b) => a + b * b, 0) / n;
  const varianceShortcut = meanOfSquares - squareOfMean;

  // Verify by standard variance
  const varianceStandard = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;

  // Trigger completion check
  useEffect(() => {
    if (varianceShortcut > 0 && Math.abs(varianceShortcut - varianceStandard) < 0.001) {
      if (onComplete) {
        onComplete();
      }
    }
  }, [data, onComplete, varianceShortcut, varianceStandard]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">分散の計算公式 (2乗の平均 - 平均の2乗)</h3>
        <button
          onClick={() => setData([2, 4, 6, 8, 10])}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold"
        >
          <RefreshCw className="w-4 h-4" /> リセット
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              データを動かして公式を確認しよう
            </h4>
            
            <div className="space-y-4">
              {data.map((val, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-slate-500 w-6">x{idx+1}</span>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={val}
                    onChange={(e) => handleDrag(idx, e)}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="w-8 text-right font-mono font-bold text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 flex flex-col justify-center">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-blue-600 mb-1">平均の計算</p>
            <div className="text-lg text-slate-800">
              <InlineMath math={`\\overline{x} = ${mean.toFixed(2)}`} />
            </div>
            <div className="text-sm text-slate-600 mt-2">
              <InlineMath math={`(\\overline{x})^2 = ${squareOfMean.toFixed(2)}`} />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-emerald-600 mb-1">2乗の平均</p>
            <div className="text-lg text-slate-800">
              <InlineMath math={`\\overline{x^2} = \\frac{${data.map(d => d + '^2').join('+')}}{${n}}`} />
            </div>
            <div className="text-sm text-slate-600 mt-2">
              <InlineMath math={`\\overline{x^2} = ${meanOfSquares.toFixed(2)}`} />
            </div>
          </div>

          <motion.div
            key={varianceShortcut}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-purple-50 border border-purple-200 p-4 rounded-xl"
          >
            <p className="text-xs font-bold text-purple-600 mb-1">分散のショートカット公式</p>
            <div className="text-lg font-bold text-slate-800">
              <BlockMath math={`s^2 = \\overline{x^2} - (\\overline{x})^2`} />
            </div>
            <div className="text-center font-mono text-xl text-purple-700 font-bold mt-2">
              {meanOfSquares.toFixed(2)} - {squareOfMean.toFixed(2)} = {varianceShortcut.toFixed(2)}
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed">
        <p className="font-bold mb-2">💡 なぜこの公式が便利なのか？</p>
        <p>通常の分散の定義は <InlineMath math="s^2 = \frac{1}{n}\sum (x_i - \overline{x})^2" /> ですが、平均 <InlineMath math="\overline{x}" /> が小数になると、偏差 <InlineMath math="(x_i - \overline{x})" /> の2乗の計算が非常に複雑になります。</p>
        <p className="mt-2">このショートカット公式 <InlineMath math="s^2 = \overline{x^2} - (\overline{x})^2" /> を使えば、元のデータ <InlineMath math="x_i" /> を2乗して平均を出し、最後に平均の2乗を引くだけで済むため、計算ミスを大幅に減らすことができます。</p>
      </div>
    </div>
  );
}
