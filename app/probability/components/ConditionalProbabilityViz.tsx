"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={ref} />;
};

type ViewMode = "venn" | "tree";

export default function ConditionalProbabilityViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pA, setPa] = useState(0.5);
  const [pB, setPb] = useState(0.4);
  const [pAB, setPab] = useState(0.2);
  const [viewMode, setViewMode] = useState<ViewMode>("venn");
  const [showExample, setShowExample] = useState(false);

  // Ensure P(A∩B) <= min(P(A), P(B))
  const maxPAB = Math.min(pA, pB);
  const effectivePAB = Math.min(pAB, maxPAB);

  // Conditional probability
  const pBA = pA > 0 ? effectivePAB / pA : 0;
  const pAB_given = pB > 0 ? effectivePAB / pB : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (viewMode === "venn") {
      drawVenn(ctx, W, H);
    } else {
      drawTree(ctx, W, H);
    }
  }, [pA, pB, effectivePAB, pBA, viewMode]);

  const drawVenn = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const cx = W / 2;
    const cy = H / 2 - 10;
    const rA = 90;
    const rB = 90;
    const overlap = 50;
    const xA = cx - overlap / 2;
    const xB = cx + overlap / 2;

    // Universe box
    ctx.beginPath();
    ctx.roundRect(cx - 170, cy - 130, 340, 260, 12);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("U (全体)", cx - 160, cy - 110);

    // Draw A circle (dimmed if showing conditional)
    ctx.beginPath();
    ctx.arc(xA, cy, rA, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, 0.15)`;
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw B circle
    ctx.beginPath();
    ctx.arc(xB, cy, rB, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239, 68, 68, 0.10)`;
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight intersection (A∩B)
    ctx.save();
    ctx.beginPath();
    ctx.arc(xA, cy, rA, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(xB, cy, rB, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
    ctx.fill();
    ctx.restore();

    // Highlight A circle with stronger border to show "conditional on A"
    ctx.beginPath();
    ctx.arc(xA, cy, rA + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("A", xA - 40, cy - 30);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("B", xB + 40, cy - 30);

    // Intersection label
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("A∩B", cx, cy);

    // Probability labels
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(`P(A)=${pA.toFixed(2)}`, xA - 30, cy + rA + 25);
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`P(B)=${pB.toFixed(2)}`, xB + 30, cy + rA + 25);
    ctx.fillStyle = "#7c3aed";
    ctx.fillText(`P(A∩B)=${effectivePAB.toFixed(2)}`, cx, cy + 20);

    // Conditional probability annotation
    ctx.fillStyle = "#334155";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`P(B|A) = P(A∩B)/P(A) = ${pBA.toFixed(3)}`, cx, cy + rA + 50);
  };

  const drawTree = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const startX = 40;
    const startY = H / 2;
    const branchLen = 100;
    const vertSpacing = 80;

    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Root
    ctx.beginPath();
    ctx.arc(startX, startY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();

    // Branch: A occurs
    const aY = startY - vertSpacing;
    const aX = startX + branchLen;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(aX, aY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`P(A)=${pA.toFixed(2)}`, (startX + aX) / 2 - 10, (startY + aY) / 2 - 12);

    ctx.beginPath();
    ctx.arc(aX, aY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("A", aX, aY - 15);

    // Branch: A does not occur
    const naY = startY + vertSpacing;
    const naX = startX + branchLen;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(naX, naY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.fillText(`P(Ā)=${(1 - pA).toFixed(2)}`, (startX + naX) / 2 - 10, (startY + naY) / 2 + 12);

    ctx.beginPath();
    ctx.arc(naX, naY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();
    ctx.fillText("Ā", naX, naY - 15);

    // From A: B occurs (this is P(B|A))
    const abX = aX + branchLen;
    const abY = aY - vertSpacing / 2;
    ctx.beginPath();
    ctx.moveTo(aX, aY);
    ctx.lineTo(abX, abY);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`P(B|A)=${pBA.toFixed(3)}`, (aX + abX) / 2 + 5, (aY + abY) / 2 - 12);

    ctx.beginPath();
    ctx.arc(abX, abY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#7c3aed";
    ctx.fill();
    ctx.fillText("A∩B", abX + 25, abY);

    // From A: B does not occur
    const anbX = aX + branchLen;
    const anbY = aY + vertSpacing / 2;
    ctx.beginPath();
    ctx.moveTo(aX, aY);
    ctx.lineTo(anbX, anbY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.fillText(`P(B̄|A)=${(1 - pBA).toFixed(3)}`, (aX + anbX) / 2 + 5, (aY + anbY) / 2 + 12);

    ctx.beginPath();
    ctx.arc(anbX, anbY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();
    ctx.fillText("A∩B̄", anbX + 25, anbY);

    // Final probabilities on right
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#7c3aed";
    ctx.textAlign = "left";
    ctx.fillText(`= ${(pA * pBA).toFixed(3)}`, abX + 50, abY);
    ctx.fillStyle = "#64748b";
    ctx.fillText(`= ${(pA * (1 - pBA)).toFixed(3)}`, anbX + 50, anbY);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  // When pAB slider moves, ensure constraint
  const handlePABChange = (val: number) => {
    setPab(Math.min(val, Math.min(pA, pB)));
  };

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("venn")}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-colors ${
            viewMode === "venn"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          ベン図
        </button>
        <button
          onClick={() => setViewMode("tree")}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-colors ${
            viewMode === "tree"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          樹形図
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={350}
          className="w-full max-w-[400px]"
        />
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-500">P(A) = {pA.toFixed(2)}</span>
          </div>
          <input type="range" min={0.05} max={1} step={0.01} value={pA}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPa(v);
              if (pAB > Math.min(v, pB)) setPab(Math.min(v, pB));
            }}
            className="w-full accent-blue-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-red-500">P(B) = {pB.toFixed(2)}</span>
          </div>
          <input type="range" min={0.05} max={1} step={0.01} value={pB}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPb(v);
              if (pAB > Math.min(pA, v)) setPab(Math.min(pA, v));
            }}
            className="w-full accent-red-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-purple-500">
              P(A∩B) = {effectivePAB.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">
              max: {maxPAB.toFixed(2)}
            </span>
          </div>
          <input type="range" min={0} max={maxPAB} step={0.01} value={effectivePAB}
            onChange={(e) => handlePABChange(Number(e.target.value))}
            className="w-full accent-purple-500" />
        </div>
      </div>

      {/* Calculation result */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 mb-3">条件付き確率の計算</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
            <div className="text-xs text-purple-400 font-bold mb-1">P(B|A)</div>
            <div className="text-xl font-black text-purple-700">{pBA.toFixed(3)}</div>
            <div className="text-xs text-purple-400 mt-1">
              <K tex={`\\frac{${effectivePAB.toFixed(2)}}{${pA.toFixed(2)}}`} />
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
            <div className="text-xs text-indigo-400 font-bold mb-1">P(A|B)</div>
            <div className="text-xl font-black text-indigo-700">{pAB_given.toFixed(3)}</div>
            <div className="text-xs text-indigo-400 mt-1">
              <K tex={`\\frac{${effectivePAB.toFixed(2)}}{${pB.toFixed(2)}}`} />
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-slate-500">
          <K tex="P(B|A) = \dfrac{P(A \cap B)}{P(A)}" /> は「Aで絞った世界でのBの割合」
        </div>
      </div>

      {/* Key formula */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">条件付き確率のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-2 list-disc list-inside">
          <li>
            <K tex="P(B|A) = \dfrac{P(A \cap B)}{P(A)}" /> : 事象Aが起きた条件の下でBが起きる確率
          </li>
          <li>
            「全体」を A だけに絞り、その中で A∩B が占める割合
          </li>
          <li>
            乗法定理：<K tex="P(A \cap B) = P(A) \cdot P(B|A)" />
          </li>
          <li>
            A と B が独立ならば <K tex="P(B|A) = P(B)" />
          </li>
        </ul>
      </div>

      {/* Concrete example */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <button
          onClick={() => setShowExample(!showExample)}
          className="w-full text-left"
        >
          <h3 className="font-bold text-sm text-slate-700">
            具体例：カードの条件付き確率
            <span className="text-xs text-slate-400 ml-2">{showExample ? "▲" : "▼"}</span>
          </h3>
        </button>
        {showExample && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600">
              1〜12のカードから1枚引く。
              <strong>A：偶数が出る</strong>（2,4,6,8,10,12）、
              <strong>B：4の倍数が出る</strong>（4,8,12）
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center mt-0.5">1</span>
                <span><K tex="P(A) = \frac{6}{12} = \frac{1}{2}" /></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center mt-0.5">2</span>
                <span><K tex="P(A \cap B) = \frac{3}{12} = \frac{1}{4}" />（4の倍数は全て偶数なので A∩B = B）</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center mt-0.5">3</span>
                <span>
                  <K tex="P(B|A) = \frac{P(A \cap B)}{P(A)} = \frac{1/4}{1/2} = \frac{1}{2}" />
                </span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-sm text-green-700">
                偶数が出たと分かった時点で候補は {"{2,4,6,8,10,12}"} の6枚。
                そのうち4の倍数は {"{4,8,12}"} の3枚。
                よって <K tex="P(B|A) = \frac{3}{6} = \frac{1}{2}" />
              </p>
            </div>
          </div>
        )}
      </div>

      <HintButton
        hints={[
          { step: 1, text: "条件付き確率 P(B|A) は「A が起こった条件のもとで B が起こる確率」です" },
          { step: 2, text: "公式: P(B|A) = P(A∩B) / P(A) で計算します" },
          { step: 3, text: "P(A∩B) ≤ min(P(A), P(B)) の制約があります" },
          { step: 4, text: "ベン図では、A の円の内部だけに注目し、その中で A∩B が占める割合が P(B|A) です" },
        ]}
      />
    </div>
  );
}
