"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

interface TrialResult {
  coin: "heads" | "tails";
  die: number;
}

interface SimulationState {
  results: TrialResult[];
  running: boolean;
}

export default function IndependentEventViz() {
  const [trials, setTrials] = useState(100);
  const [targetCoin, setTargetCoin] = useState<"heads" | "tails">("heads");
  const [targetDie, setTargetDie] = useState(6);
  const [sim, setSim] = useState<SimulationState>({ results: [], running: false });
  const [showComparison, setShowComparison] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Theoretical probabilities
  const pCoin = 0.5;
  const pDie = 1 / 6;
  const pBoth = pCoin * pDie;

  // Count results
  const countCoin = sim.results.filter((r) => r.coin === targetCoin).length;
  const countDie = sim.results.filter((r) => r.die === targetDie).length;
  const countBoth = sim.results.filter(
    (r) => r.coin === targetCoin && r.die === targetDie
  ).length;
  const total = sim.results.length;

  const expCoin = total > 0 ? countCoin / total : 0;
  const expDie = total > 0 ? countDie / total : 0;
  const expBoth = total > 0 ? countBoth / total : 0;
  const expProduct = expCoin * expDie;

  const runSimulation = useCallback(() => {
    const results: TrialResult[] = [];
    for (let i = 0; i < trials; i++) {
      results.push({
        coin: Math.random() < 0.5 ? "heads" : "tails",
        die: Math.floor(Math.random() * 6) + 1,
      });
    }
    setSim({ results, running: false });
  }, [trials]);

  // Draw convergence chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || sim.results.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Axes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const maxY = Math.max(0.3, pBoth * 3);
    for (let v = 0; v <= maxY; v += 0.05) {
      const y = padT + plotH - (v / maxY) * plotH;
      ctx.fillText(v.toFixed(2), padL - 5, y);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // X-axis label
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("試行回数", padL + plotW / 2, padT + plotH + 30);

    // Theoretical line
    const theoY = padT + plotH - (pBoth / maxY) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, theoY);
    ctx.lineTo(padL + plotW, theoY);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`理論値 ${pBoth.toFixed(4)}`, padL + plotW - 90, theoY - 8);

    // Running ratio
    let cumBoth = 0;
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    const n = sim.results.length;
    for (let i = 0; i < n; i++) {
      const r = sim.results[i];
      if (r.coin === targetCoin && r.die === targetDie) cumBoth++;
      const ratio = cumBoth / (i + 1);
      const x = padL + ((i + 1) / n) * plotW;
      const y = padT + plotH - (ratio / maxY) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legend
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("実験値", padL + 10, padT + 12);
  }, [sim.results, targetCoin, targetDie, pBoth]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className="space-y-6">
      {/* Definition panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 mb-3">独立試行の定義</h3>
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-center space-y-2">
          <p className="text-sm text-indigo-700">
            事象 A と事象 B が<strong>独立</strong>であるとき：
          </p>
          <div className="text-lg">
            <K tex="P(A \cap B) = P(A) \times P(B)" />
          </div>
          <p className="text-xs text-indigo-500">
            一方の結果が他方の結果に影響しない場合、2つの事象は独立です。
          </p>
        </div>
      </div>

      {/* Simulation controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700 mb-2">
          シミュレーション: コイン + サイコロ
        </h3>
        <p className="text-xs text-slate-500">
          コイン（表/裏）とサイコロ（1〜6）を同時に投げます。
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              コインの目標
            </label>
            <select
              value={targetCoin}
              onChange={(e) => setTargetCoin(e.target.value as "heads" | "tails")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="heads">表</option>
              <option value="tails">裏</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              サイコロの目標
            </label>
            <select
              value={targetDie}
              onChange={(e) => setTargetDie(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-slate-600">
              試行回数: {trials}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={trials}
            onChange={(e) => setTrials(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <button
          onClick={runSimulation}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
        >
          シミュレーション実行
        </button>
      </div>

      {/* Convergence chart */}
      {sim.results.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 mb-2 text-center">
            P(A∩B) の収束グラフ
          </h4>
          <canvas
            ref={canvasRef}
            width={400}
            height={250}
            className="w-full max-w-[400px] mx-auto"
          />
        </div>
      )}

      {/* Results */}
      {sim.results.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-700 mb-2">結果</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <div className="text-xs text-blue-400 font-bold mb-1">
                P(A): {targetCoin === "heads" ? "表" : "裏"}
              </div>
              <div className="text-sm">
                理論: <span className="font-bold text-blue-600">{pCoin.toFixed(4)}</span>
              </div>
              <div className="text-sm">
                実験: <span className="font-bold text-blue-800">{expCoin.toFixed(4)}</span>
                <span className="text-xs text-blue-400 ml-1">({countCoin}/{total})</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">
                P(B): サイコロ{targetDie}
              </div>
              <div className="text-sm">
                理論: <span className="font-bold text-green-600">{pDie.toFixed(4)}</span>
              </div>
              <div className="text-sm">
                実験: <span className="font-bold text-green-800">{expDie.toFixed(4)}</span>
                <span className="text-xs text-green-400 ml-1">({countDie}/{total})</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center space-y-1">
            <div className="text-xs text-amber-500 font-bold">P(A∩B): 両方が同時に起こる</div>
            <div className="text-sm">
              理論: <K tex={`P(A) \\times P(B) = ${pCoin.toFixed(2)} \\times ${pDie.toFixed(4)} = `} />
              <span className="font-bold text-amber-700">{pBoth.toFixed(4)}</span>
            </div>
            <div className="text-sm">
              実験: <span className="font-bold text-amber-800">{expBoth.toFixed(4)}</span>
              <span className="text-xs text-amber-400 ml-1">({countBoth}/{total})</span>
            </div>
            <div className="text-sm">
              P(A)の実験値 × P(B)の実験値 = <span className="font-bold text-amber-800">{expProduct.toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison: independent vs dependent */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full text-left flex items-center justify-between"
        >
          <h3 className="font-bold text-sm text-slate-700">
            独立 vs 独立でない事象
          </h3>
          <span className="text-slate-400 text-sm">{showComparison ? "▲" : "▼"}</span>
        </button>

        {showComparison && (
          <div className="mt-4 space-y-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h4 className="text-xs font-bold text-green-600 mb-2">独立な事象の例</h4>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>コイン投げとサイコロ投げ</li>
                <li>1回目のサイコロと2回目のサイコロ</li>
                <li>異なる袋からの取り出し</li>
              </ul>
              <div className="mt-2 text-center">
                <K tex="P(A \cap B) = P(A) \times P(B)" />
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h4 className="text-xs font-bold text-red-600 mb-2">独立でない事象の例</h4>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>同じ袋から玉を戻さずに取り出す（非復元抽出）</li>
                <li>トランプを引いて戻さず次を引く</li>
                <li>天気と気温（相関がある）</li>
              </ul>
              <div className="mt-2 text-center">
                <K tex="P(A \cap B) = P(A) \times P(B|A) \neq P(A) \times P(B)" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-600 mb-2">具体例</h4>
              <p className="text-sm text-slate-600">
                赤玉3個、白玉2個の袋から2個取り出す場合:
              </p>
              <div className="text-sm text-slate-700 mt-2 space-y-1">
                <p>
                  <strong>復元抽出（独立）:</strong>{" "}
                  <K tex="P(\text{赤,赤}) = \frac{3}{5} \times \frac{3}{5} = \frac{9}{25}" />
                </p>
                <p>
                  <strong>非復元抽出（非独立）:</strong>{" "}
                  <K tex="P(\text{赤,赤}) = \frac{3}{5} \times \frac{2}{4} = \frac{6}{20}" />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key points */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">独立試行のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside">
          <li>
            独立事象: <K tex="P(A \cap B) = P(A) \times P(B)" />
          </li>
          <li>試行回数を増やすと実験値は理論値に収束する（大数の法則）</li>
          <li>
            n回の独立試行で事象Aがちょうどr回起こる確率:{" "}
            <K tex="_nC_r \cdot p^r (1-p)^{n-r}" />
          </li>
          <li>独立かどうかは「一方の結果が他方に影響するか」で判断</li>
        </ul>
      </div>

      <HintButton
        hints={[
          { step: 1, text: "2つの事象が独立とは、一方の結果が他方の確率に影響しないことです" },
          { step: 2, text: "独立のとき P(A∩B) = P(A)×P(B) が成り立ちます" },
          { step: 3, text: "復元抽出（元に戻す）は独立、非復元抽出（戻さない）は非独立です" },
          { step: 4, text: "シミュレーション回数を増やすと、実験結果は理論値に近づきます（大数の法則）" },
        ]}
      />
    </div>
  );
}
