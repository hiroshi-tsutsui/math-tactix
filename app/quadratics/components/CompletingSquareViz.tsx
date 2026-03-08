import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { fraction, format } from 'mathjs';

interface CompletingSquareVizProps {
  equation?: string; // Expecting "y = ax^2 + bx + c"
}

const CompletingSquareViz: React.FC<CompletingSquareVizProps> = ({ equation = "" }) => {
  const [step, setStep] = useState(0);

  // Helper to format numbers as fractions in KaTeX
  const toTex = (num: number, showSign: boolean = false) => {
    if (num === 0) return showSign ? "+ 0" : "0";
    if (Number.isInteger(num)) {
      const sign = num > 0 && showSign ? "+" : "";
      return `${sign}${num}`;
    }
    
    const f = fraction(num) as any;
    const sign = Number(f.s) === 1 ? (showSign ? "+" : "") : "-";
    return `${sign}\\frac{${f.n}}{${f.d}}`;
  };

  // Parse equation "y = ax^2 + bx + c"
  const parseEquation = (eq: string) => {
    const match = eq.replace(/\s+/g, '').match(/y=([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d*)/);
    
    let a = 1, b = 0, c = 0;
    
    if (match) {
      a = match[1] === "" || match[1] === "+" ? 1 : (match[1] === "-" ? -1 : parseInt(match[1]));
      b = match[2] === "" || match[2] === "+" ? 1 : (match[2] === "-" ? -1 : parseInt(match[2]));
      c = match[3] === "" || match[3] === "+" ? 0 : parseInt(match[3]);
    } else {
       const match2 = eq.replace(/\s+/g, '').match(/y=x\^2([+-]?\d*)x([+-]?\d*)/);
       if (match2) {
         a = 1;
         b = match2[1] === "" || match2[1] === "+" ? 1 : (match2[1] === "-" ? -1 : parseInt(match2[1]));
         c = match2[2] === "" || match2[2] === "+" ? 0 : parseInt(match2[2]);
       }
    }
    
    return { a, b, c };
  };

  const { a, b, c } = parseEquation(equation);

  const h = b / (2 * a);
  const k = c - (a * h * h);
  const b_a = b / a;

  const getStepContent = () => {
    switch (step) {
      case 0:
        return {
          formula: `y = ${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${toTex(b, true)}x ${toTex(c, true)}`,
          description: <>元の一般形です。</>
        };
      case 1:
        return {
          formula: `y = ${a === 1 ? "" : a === -1 ? "-" : a}(x^2 ${toTex(b_a, true)}x) ${toTex(c, true)}`,
          description: <>$x^2$ の係数 <InlineMath math={String(a)} /> で $x$ の項までをくくります。</>
        };
      case 2:
        const half_b_a = b / (2 * a);
        const square = Math.pow(half_b_a, 2); // Ensure positive
        return {
          formula: `y = ${a === 1 ? "" : a === -1 ? "-" : a}(x^2 ${toTex(b_a, true)}x + ${toTex(square)} - ${toTex(square)}) ${toTex(c, true)}`,
          description: <>$x$ の係数の半分の2乗 <InlineMath math={toTex(square)} /> を足して引きます。</>
        };
      case 3:
        return {
          formula: `y = ${a === 1 ? "" : a === -1 ? "-" : a}((x ${toTex(h, true)})^2 - ${toTex(h*h)}) ${toTex(c, true)}`,
          description: <>カッコ内を完全平方式にまとめます。</>
        };
      case 4:
        return {
          formula: `y = ${a === 1 ? "" : a === -1 ? "-" : a}(x ${toTex(h, true)})^2 ${toTex(k, true)}`,
          description: <>定数項を整理して、標準形の完成です！</>
        };
      default:
        return { formula: "", description: <></> };
    }
  };

  const current = getStepContent();

  return (
    <div className="p-6 bg-white border border-blue-200 rounded-xl shadow-sm">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-800">平方完成のステップ解析</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">Step {step} / 4</span>
       </div>
       
       <div className="flex flex-col items-center justify-center min-h-[140px] bg-gray-50 rounded-lg p-6 mb-6">
          <BlockMath math={current.formula} />
       </div>

       <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
          <p className="text-blue-900 leading-relaxed font-medium">{current.description}</p>
       </div>

       <div className="flex gap-4">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))} 
            disabled={step === 0}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
              step === 0 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            ← 前のステップ
          </button>
          <button 
            onClick={() => setStep(Math.min(4, step + 1))} 
            disabled={step === 4}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
              step === 4 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            次のステップ →
          </button>
       </div>
    </div>
  );
};

export default CompletingSquareViz;
