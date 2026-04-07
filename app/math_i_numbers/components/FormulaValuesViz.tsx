import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import HintButton from '../../components/HintButton';

const FormulaValuesViz = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-3);

  // Expressions to calculate
  const expr1 = a * a - b;
  const expr2 = a + b * b;
  const expr3 = a * a + b * b;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">Level 30</span>
        式の値 (式の代入)
      </h3>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
        <h4 className="font-bold text-slate-700 mb-4">文字に数値を代入して式の値を求めよう</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <InlineMath math="a" /> の値: {a}
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <InlineMath math="b" /> の値: {b}
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={b}
                onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
             <div className="text-lg mb-2">
               現在の値: <InlineMath math={`a = ${a}, \\; b = ${b}`} />
             </div>
             <p className="text-sm text-slate-500 text-center">
               ※ 負の数を代入するときは<span className="font-bold text-red-500">必ずカッコをつける</span>こと！
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
           <div className="font-bold text-slate-700"><InlineMath math="a^2 - b" /> の値</div>
           <div className="text-lg bg-slate-50 p-3 rounded text-center overflow-x-auto">
             <BlockMath math={`${a < 0 ? `(${a})` : a}^2 - ${b < 0 ? `(${b})` : b} = ${a*a} ${b < 0 ? '+' : '-'} ${Math.abs(b)} = ${expr1}`} />
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
           <div className="font-bold text-slate-700"><InlineMath math="a + b^2" /> の値</div>
           <div className="text-lg bg-slate-50 p-3 rounded text-center overflow-x-auto">
             <BlockMath math={`${a} + ${b < 0 ? `(${b})` : b}^2 = ${a} + ${b*b} = ${expr2}`} />
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
           <div className="font-bold text-slate-700"><InlineMath math="a^2 + b^2" /> の値</div>
           <div className="text-lg bg-slate-50 p-3 rounded text-center overflow-x-auto">
             <BlockMath math={`${a < 0 ? `(${a})` : a}^2 + ${b < 0 ? `(${b})` : b}^2 = ${a*a} + ${b*b} = ${expr3}`} />
           </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          💡 学習のポイント
        </h4>
        <p className="text-blue-700 text-sm leading-relaxed">
          式の代入では、特に<strong>負の数</strong>を代入するときの計算ミスが頻発します。<br/>
          例えば <InlineMath math="b = -3" /> のとき、<InlineMath math="-b" /> は <InlineMath math="-(-3) = +3" /> になり、<InlineMath math="b^2" /> は <InlineMath math="(-3)^2 = 9" /> になります。<br/>
          スライダーを動かして、<InlineMath math="b" /> が負の数のときにカッコがどのように機能するか視覚的に確認しましょう。
        </p>
      </div>
      <HintButton hints={[
        { step: 1, text: "対称式の基本は s = a + b（和）と p = ab（積）です。" },
        { step: 2, text: "a² + b² = s² - 2p、a³ + b³ = s³ - 3sp などの公式を使います。" },
        { step: 3, text: "与えられた条件から s と p の値を求め、目的の式に代入しましょう。" },
        { step: 4, text: "分数式 1/a + 1/b = s/p のように、すべて s, p で表現できます。" }
      ]} />
    </div>
  );
};

export default FormulaValuesViz;
