"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

export default function BayesTheoremViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // P(A) = prior (prevalence)
  const [pA, setPa] = useState(0.01);
  // P(B|A) = sensitivity (true positive rate)
  const [pBA, setPba] = useState(0.99);
  // P(B|~A) = false positive rate
  const [pBNotA, setPbNotA] = useState(0.05);

  // Bayes calculation
  const pNotA = 1 - pA;
  const pB = pBA * pA + pBNotA * pNotA;
  const pAB = pB > 0 ? (pBA * pA) / pB : 0; // P(A|B)

  const drawTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const startX = 30;
    const startY = H / 2;
    const branchLen1 = 110;
    const branchLen2 = 110;
    const vertSpacing1 = 100;
    const vertSpacing2 = 45;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Root node
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();

    // --- Branch 1: Disease (A) ---
    const aX = startX + branchLen1;
    const aY = startY - vertSpacing1;

    // Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(aX, aY);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Label
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(`P(A)=${pA.toFixed(3)}`, (startX + aX) / 2 - 15, (startY + aY) / 2 - 14);

    // Node
    ctx.beginPath();
    ctx.arc(aX, aY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillText("病気", aX, aY - 16);

    // --- Branch 1: No Disease (~A) ---
    const naX = startX + branchLen1;
    const naY = startY + vertSpacing1;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(naX, naY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.fillText(`P(A')=${pNotA.toFixed(3)}`, (startX + naX) / 2 - 15, (startY + naY) / 2 + 14);

    ctx.beginPath();
    ctx.arc(naX, naY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();
    ctx.fillText("健康", naX, naY + 16);

    // --- From Disease: Positive (B|A) ---
    const abX = aX + branchLen2;
    const abY = aY - vertSpacing2;

    // This is the highlighted path
    ctx.beginPath();
    ctx.moveTo(aX, aY);
    ctx.lineTo(abX, abY);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(`P(B|A)=${pBA.toFixed(2)}`, (aX + abX) / 2 + 5, (aY + abY) / 2 - 12);

    ctx.beginPath();
    ctx.arc(abX, abY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#7c3aed";
    ctx.fill();

    // Highlight box for this path
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("陽性", abX + 22, abY - 5);
    ctx.font = "10px sans-serif";
    const pPath1 = pA * pBA;
    ctx.fillText(`= ${pPath1.toFixed(5)}`, abX + 22, abY + 10);

    // Highlight glow around this endpoint
    ctx.beginPath();
    ctx.arc(abX, abY, 12, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(124, 58, 237, 0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // --- From Disease: Negative (~B|A) ---
    const anbX = aX + branchLen2;
    const anbY = aY + vertSpacing2;

    ctx.beginPath();
    ctx.moveTo(aX, aY);
    ctx.lineTo(anbX, anbY);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${(1 - pBA).toFixed(2)}`, (aX + anbX) / 2 + 5, (aY + anbY) / 2 + 10);

    ctx.beginPath();
    ctx.arc(anbX, anbY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("陰性", anbX + 22, anbY);

    // --- From No Disease: Positive (B|~A) ---
    const nabX = naX + branchLen2;
    const nabY = naY - vertSpacing2;

    ctx.beginPath();
    ctx.moveTo(naX, naY);
    ctx.lineTo(nabX, nabY);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(`P(B|A')=${pBNotA.toFixed(2)}`, (naX + nabX) / 2 + 5, (naY + nabY) / 2 - 12);

    ctx.beginPath();
    ctx.arc(nabX, nabY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();
    ctx.fillText("陽性(偽)", nabX + 28, nabY - 5);
    ctx.font = "10px sans-serif";
    const pPath2 = pNotA * pBNotA;
    ctx.fillText(`= ${pPath2.toFixed(5)}`, nabX + 28, nabY + 10);

    // --- From No Disease: Negative (~B|~A) ---
    const nanbX = naX + branchLen2;
    const nanbY = naY + vertSpacing2;

    ctx.beginPath();
    ctx.moveTo(naX, naY);
    ctx.lineTo(nanbX, nanbY);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${(1 - pBNotA).toFixed(2)}`, (naX + nanbX) / 2 + 5, (naY + nanbY) / 2 + 10);

    ctx.beginPath();
    ctx.arc(nanbX, nanbY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("陰性", nanbX + 22, nanbY);
  }, [pA, pBA, pBNotA, pNotA]);

  useEffect(() => {
    drawTree();
  }, [drawTree]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-slate-800">ベイズの定理</h3>
        <p className="text-sm text-slate-500 mt-1">
          「陽性」と出たとき、本当に病気である確率は？
        </p>
      </div>

      {/* Main result */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-sm text-center">
        <div className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">
          P(A|B) -- 陽性時の罹患確率
        </div>
        <div className="text-5xl font-black text-purple-700 mb-2">
          {(pAB * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-purple-500">
          <K tex={`P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{${pBA.toFixed(2)} \\times ${pA.toFixed(3)}}{${pB.toFixed(5)}} = ${pAB.toFixed(4)}`} />
        </div>
      </div>

      {/* Insight callout */}
      {pA < 0.05 && pAB < 0.5 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
          <p className="text-sm text-amber-700 font-bold">
            驚きの結果: 感度 {(pBA * 100).toFixed(0)}% の検査でも、有病率が {(pA * 100).toFixed(1)}% なら、
            陽性者が本当に病気である確率はわずか <strong>{(pAB * 100).toFixed(1)}%</strong>
          </p>
        </div>
      )}

      {/* Tree diagram */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={340}
          className="w-full max-w-[400px]"
        />
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        {/* P(A) - prior */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">
              P(A) = {(pA * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">有病率（事前確率）</span>
          </div>
          <input
            type="range"
            min={0.001}
            max={0.5}
            step={0.001}
            value={pA}
            onChange={(e) => setPa(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0.1%</span>
            <span>50%</span>
          </div>
        </div>

        {/* P(B|A) - sensitivity */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-purple-500">
              P(B|A) = {(pBA * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400">感度（真陽性率）</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={0.99}
            step={0.01}
            value={pBA}
            onChange={(e) => setPba(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>

        {/* P(B|~A) - false positive rate */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-amber-500">
              P(B|A&apos;) = {(pBNotA * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400">偽陽性率</span>
          </div>
          <input
            type="range"
            min={0.01}
            max={0.3}
            step={0.01}
            value={pBNotA}
            onChange={(e) => setPbNotA(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>
      </div>

      {/* Step-by-step calculation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h4 className="font-bold text-sm text-slate-700 mb-4">段階的な計算</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center mt-0.5">1</span>
            <div>
              <span className="text-slate-500">分子: 病気かつ陽性 </span>
              <K tex={`P(B|A) \\times P(A) = ${pBA.toFixed(2)} \\times ${pA.toFixed(3)} = ${(pBA * pA).toFixed(5)}`} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center mt-0.5">2</span>
            <div>
              <span className="text-slate-500">健康だが陽性（偽陽性）</span>
              <K tex={`P(B|A') \\times P(A') = ${pBNotA.toFixed(2)} \\times ${pNotA.toFixed(3)} = ${(pBNotA * pNotA).toFixed(5)}`} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center mt-0.5">3</span>
            <div>
              <span className="text-slate-500">分母: 全体の陽性率 </span>
              <K tex={`P(B) = ${(pBA * pA).toFixed(5)} + ${(pBNotA * pNotA).toFixed(5)} = ${pB.toFixed(5)}`} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center mt-0.5">4</span>
            <div>
              <span className="text-slate-500">ベイズの定理を適用 </span>
              <K tex={`P(A|B) = \\frac{${(pBA * pA).toFixed(5)}}{${pB.toFixed(5)}} = ${pAB.toFixed(4)}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Formula box */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-3">ベイズの定理のポイント</h4>
        <div className="text-center mb-4">
          <K tex="P(A|B) = \dfrac{P(B|A) \cdot P(A)}{P(B|A) \cdot P(A) + P(B|A') \cdot P(A')}" display />
        </div>
        <ul className="text-sm text-indigo-600 space-y-2 list-disc list-inside">
          <li>
            <strong>事前確率</strong> P(A) が低い場合、検査が高感度でも P(A|B) は低くなる
          </li>
          <li>
            偽陽性率 P(B|A&apos;) が高いほど、陽性結果の信頼性は下がる
          </li>
          <li>
            条件付き確率 (Level 15) の発展：
            <K tex="P(A|B) = \dfrac{P(A \cap B)}{P(B)}" /> を全確率の定理で展開
          </li>
          <li>
            有病率 1% + 感度 99% + 偽陽性率 5% のとき、
            陽性者の約 <strong>83%</strong> は実は健康（偽陽性）
          </li>
        </ul>
      </div>
    </div>
  );
}
