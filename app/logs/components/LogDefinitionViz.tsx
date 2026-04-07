"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

interface LogDefinitionVizProps {
  mode?: 'explore';
}

const LogDefinitionViz: React.FC<LogDefinitionVizProps> = () => {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);

  const value = Math.pow(base, exponent);
  const logResult = exponent; // log_base(value) = exponent by definition

  const svgW = 500;
  const svgH = 220;
  const centerY = svgH / 2;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="text-center mb-6 space-y-4">
          <div className="text-sm text-slate-500">対数の定義</div>
          <MathDisplay
            tex={`\\log_{${base}} ${value} = ${logResult} \\quad \\Longleftrightarrow \\quad ${base}^{${logResult}} = ${value}`}
            displayMode
          />
        </div>

        {/* Visual relationship */}
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto">
          {/* Boxes */}
          <rect x={40} y={centerY - 40} width={120} height={80} rx={16} fill="#3b82f6" opacity={0.15} stroke="#3b82f6" strokeWidth={2} />
          <text x={100} y={centerY - 8} textAnchor="middle" fontSize={14} fill="#3b82f6" fontWeight="bold">底 (base)</text>
          <text x={100} y={centerY + 18} textAnchor="middle" fontSize={24} fill="#1e40af" fontWeight="bold">{base}</text>

          <rect x={190} y={centerY - 40} width={120} height={80} rx={16} fill="#8b5cf6" opacity={0.15} stroke="#8b5cf6" strokeWidth={2} />
          <text x={250} y={centerY - 8} textAnchor="middle" fontSize={14} fill="#8b5cf6" fontWeight="bold">指数 (exp)</text>
          <text x={250} y={centerY + 18} textAnchor="middle" fontSize={24} fill="#6d28d9" fontWeight="bold">{exponent}</text>

          <rect x={340} y={centerY - 40} width={120} height={80} rx={16} fill="#ec4899" opacity={0.15} stroke="#ec4899" strokeWidth={2} />
          <text x={400} y={centerY - 8} textAnchor="middle" fontSize={14} fill="#ec4899" fontWeight="bold">真数 (arg)</text>
          <text x={400} y={centerY + 18} textAnchor="middle" fontSize={24} fill="#be185d" fontWeight="bold">{value}</text>

          {/* Arrows */}
          <path d="M165,70 L185,70" stroke="#64748b" strokeWidth={2} markerEnd="url(#arrowLog)" />
          <path d="M315,70 L335,70" stroke="#64748b" strokeWidth={2} markerEnd="url(#arrowLog)" />

          {/* Top arc: a^p = M */}
          <path d={`M100,${centerY - 45} Q250,${centerY - 100} 400,${centerY - 45}`}
            fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="6,3"
            markerEnd="url(#arrowLogGreen)" />
          <text x={250} y={centerY - 85} textAnchor="middle" fontSize={12} fill="#10b981" fontWeight="bold">
            a^p = M (指数形)
          </text>

          {/* Bottom arc: log_a M = p */}
          <path d={`M400,${centerY + 45} Q250,${centerY + 100} 100,${centerY + 45}`}
            fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,3"
            markerEnd="url(#arrowLogAmber)" />
          <text x={250} y={centerY + 105} textAnchor="middle" fontSize={12} fill="#f59e0b" fontWeight="bold">
            log_a M = p (対数形)
          </text>

          <defs>
            <marker id="arrowLog" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#64748b" />
            </marker>
            <marker id="arrowLogGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#10b981" />
            </marker>
            <marker id="arrowLogAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <span className="text-slate-500">指数 p</span>
            <span className="font-bold text-purple-600">{exponent}</span>
          </div>
          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={exponent}
            onChange={(e) => setExponent(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-1">対数の定義</p>
        <MathDisplay
          tex={`a > 0, \\; a \\neq 1, \\; M > 0 \\text{ のとき } \\log_a M = p \\iff a^p = M`}
          displayMode
        />
        <p className="mt-2">
          「底 <MathDisplay tex="a" /> を何乗すると <MathDisplay tex="M" /> になるか？」
          その答えが <MathDisplay tex="\\log_a M" /> です。
        </p>
      </div>

      <HintButton hints={[
        { step: 1, text: 'log_a b = x とは a^x = b のことです（a > 0, a ≠ 1, b > 0）。' },
        { step: 2, text: '「底 a を何乗すると b になるか」がその答え x = log_a b です。' },
        { step: 3, text: '特別な値: log_a 1 = 0（a⁰ = 1）、log_a a = 1（a¹ = a）を覚えておきましょう。' },
      ]} />
    </div>
  );
};

export default LogDefinitionViz;
