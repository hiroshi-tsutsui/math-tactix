"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import HintButton from '../../components/HintButton';

export default function SaltWaterInequalityViz() {
  const [x, setX] = useState(100);

  // Constants
  const massA = 200;
  const concA = 0.10;
  const saltA = massA * concA;

  const concB = 0.20;
  const saltB = x * concB;

  const totalMass = massA + x;
  const totalSalt = saltA + saltB;
  const currentConc = totalSalt / totalMass;
  const currentConcPercent = (currentConc * 100).toFixed(1);

  // Conditions
  const minConc = 0.12;
  const maxConc = 0.15;
  const isOK = currentConc >= minConc && currentConc <= maxConc;

  const getStatusColor = () => {
    if (currentConc < minConc) return "text-blue-500 border-blue-500";
    if (currentConc > maxConc) return "text-red-500 border-red-500";
    return "text-green-500 border-green-500";
  };

  const getStatusBg = () => {
    if (currentConc < minConc) return "bg-blue-50";
    if (currentConc > maxConc) return "bg-red-50";
    return "bg-green-50";
  };

  const Beaker = ({ label, mass, salt, conc, maxHeight = 160 }: { label: string, mass: number, salt: number, conc: number, maxHeight?: number }) => {
    const waterHeight = Math.min((mass / 500) * maxHeight, maxHeight); // scale to max 500g
    const saltHeight = (salt / mass) * waterHeight;
    const waterOnlyHeight = waterHeight - saltHeight;

    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-semibold mb-2">{label}</div>
        <div 
          className="relative w-24 border-x-4 border-b-4 border-slate-300 rounded-b-lg overflow-hidden flex flex-col justify-end bg-slate-50"
          style={{ height: maxHeight + 10 }}
        >
          {/* Water part */}
          <motion.div 
            className="bg-cyan-200/60 w-full relative"
            animate={{ height: waterOnlyHeight }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          {/* Salt part (visual representation at bottom) */}
          <motion.div 
            className="bg-white/80 w-full relative border-t border-cyan-100 flex items-center justify-center text-[10px] text-slate-500"
            animate={{ height: Math.max(saltHeight, 20) }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            塩
          </motion.div>
        </div>
        <div className="mt-3 text-center text-sm">
          <div className="font-medium text-slate-700">{mass}g</div>
          <div className="text-slate-500 text-xs">濃度: {(conc * 100).toFixed(1)}%</div>
          <div className="text-slate-500 text-xs">塩: {salt.toFixed(1)}g</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🧪</span> 食塩水の混合と濃度の範囲
      </h3>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
        <p className="text-sm text-slate-700 leading-relaxed mb-2">
          <strong>問題:</strong> 10%の食塩水200gに、20%の食塩水を混ぜて、濃度を <strong className="text-slate-900">12%以上15%以下</strong> にしたい。
          20%の食塩水は何g混ぜればよいか。
        </p>
        <p className="text-sm text-slate-600">
          追加する20%の食塩水を <InlineMath math="x" /> gとして、シミュレーションしてみよう。
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-8 mb-8">
        <Beaker label="元の食塩水 (10%)" mass={massA} salt={saltA} conc={concA} />
        <div className="text-3xl text-slate-300 pb-16">+</div>
        <Beaker label={`追加する食塩水 (20%)`} mass={x} salt={saltB} conc={concB} />
        <div className="text-3xl text-slate-300 pb-16">=</div>
        <div className={`p-4 rounded-xl border-2 transition-colors ${getStatusBg()} ${getStatusColor()}`}>
          <Beaker label="混合後の食塩水" mass={totalMass} salt={totalSalt} conc={currentConc} maxHeight={200} />
          <div className="mt-4 text-center font-bold">
            判定: {isOK ? "合格範囲 ✅" : "範囲外 ❌"}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-slate-700">
            追加する20%の食塩水 <InlineMath math="x" /> : {x} g
          </label>
          <span className="text-sm font-medium text-slate-500">
            目標濃度: 12% 〜 15% (現在: {currentConcPercent}%)
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={300}
          step={10}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0g</span>
          <span>50g (12%)</span>
          <span>100g</span>
          <span>200g (15%)</span>
          <span>300g</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-3 text-sm">数学的な立式と解法</h4>
        <div className="text-sm text-slate-600 space-y-4">
          <p>
            混ぜた後の全体の重さは <InlineMath math="200 + x" /> (g)、
            含まれる塩の重さは <InlineMath math="200 \times 0.10 + x \times 0.20 = 20 + 0.2x" /> (g) です。
          </p>
          <div className="overflow-x-auto pb-2">
            <BlockMath math="0.12 \le \frac{20 + 0.2x}{200 + x} \le 0.15" />
          </div>
          <p>各辺に <InlineMath math="200 + x" /> (正の数) を掛けて、連立不等式に分解します。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="font-semibold mb-2 border-b pb-1 text-slate-700">① 12%以上の条件</div>
              <BlockMath math="0.12(200 + x) \le 20 + 0.2x" />
              <BlockMath math="24 + 0.12x \le 20 + 0.2x" />
              <BlockMath math="4 \le 0.08x \implies x \ge 50" />
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="font-semibold mb-2 border-b pb-1 text-slate-700">② 15%以下の条件</div>
              <BlockMath math="20 + 0.2x \le 0.15(200 + x)" />
              <BlockMath math="20 + 0.2x \le 30 + 0.15x" />
              <BlockMath math="0.05x \le 10 \implies x \le 200" />
            </div>
          </div>
          <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-emerald-800 text-center font-bold">
            結論: <InlineMath math="50 \le x \le 200" /> (g)
          </div>
        </div>
      </div>
      <HintButton hints={[
        { step: 1, text: "食塩水の濃度 = 食塩の量 ÷ 食塩水の量 × 100（%）です。" },
        { step: 2, text: "混ぜた後の濃度の条件を不等式で表しましょう。" },
        { step: 3, text: "食塩の量と食塩水の量をそれぞれ文字で表し、不等式を立てます。" },
        { step: 4, text: "不等式を解いて、条件を満たす範囲を求めましょう。" }
      ]} />
    </div>
  );
}
