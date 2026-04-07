"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import HintButton from '../../components/HintButton';

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

interface ProblemType {
  title: string;
  description: string;
  recurrenceTex: string;
  initialCondition: string;
  compute: (nMax: number) => number[];
  sumCheck: (probs: number[]) => number;
  stateLabel: (n: number) => string;
}

const PROBLEMS: ProblemType[] = [
  {
    title: "コイン投げ：表の確率",
    description:
      "コインを繰り返し投げ、「表が出たら終了」とする。n回目に初めて表が出る確率 p_n を求める。",
    recurrenceTex:
      "p_n = \\left(\\frac{1}{2}\\right)^n \\quad (n \\geq 1)",
    initialCondition: "p_1 = \\frac{1}{2}",
    compute: (nMax: number) => {
      const probs: number[] = [];
      for (let n = 1; n <= nMax; n++) {
        probs.push(Math.pow(0.5, n));
      }
      return probs;
    },
    sumCheck: (probs: number[]) => probs.reduce((s, v) => s + v, 0),
    stateLabel: (n: number) => `p_{${n}}`,
  },
  {
    title: "酔歩問題（ランダムウォーク）",
    description:
      "原点から出発し、各ステップで確率1/2で+1、確率1/2で-1移動する。n回後に原点に戻る確率 p_n を求める。",
    recurrenceTex:
      "p_n = \\begin{cases} \\binom{n}{n/2} \\left(\\frac{1}{2}\\right)^n & (n \\text{ が偶数}) \\\\ 0 & (n \\text{ が奇数}) \\end{cases}",
    initialCondition: "p_0 = 1 \\text{ (出発点にいる)}",
    compute: (nMax: number) => {
      const probs: number[] = [];
      const comb = (n: number, k: number): number => {
        if (k < 0 || k > n) return 0;
        let result = 1;
        for (let i = 0; i < k; i++) {
          result = (result * (n - i)) / (i + 1);
        }
        return result;
      };
      for (let n = 0; n <= nMax; n++) {
        if (n % 2 === 0) {
          probs.push(comb(n, n / 2) * Math.pow(0.5, n));
        } else {
          probs.push(0);
        }
      }
      return probs;
    },
    sumCheck: (probs: number[]) => probs.reduce((s, v) => s + v, 0),
    stateLabel: (n: number) => `p_{${n}}`,
  },
  {
    title: "赤白2球の取り出し",
    description:
      "袋に赤球1個と白球1個がある。1個取り出して色を確認し戻す操作を繰り返す。n回目に赤球を取り出す確率 p_n を求める。",
    recurrenceTex:
      "p_n = \\frac{1}{2} \\quad (\\text{毎回独立})",
    initialCondition: "p_1 = \\frac{1}{2}",
    compute: (nMax: number) => {
      const probs: number[] = [];
      for (let n = 1; n <= nMax; n++) {
        probs.push(0.5);
      }
      return probs;
    },
    sumCheck: (_probs: number[]) => _probs.length * 0.5,
    stateLabel: (n: number) => `p_{${n}}`,
  },
];

export default function RecurrenceViz() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [nStep, setNStep] = useState(5);
  const [showDetail, setShowDetail] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const problem = PROBLEMS[problemIndex];
  const maxN = 10;

  const probabilities = useMemo(
    () => problem.compute(maxN),
    [problemIndex, problem]
  );

  const visibleProbs = probabilities.slice(0, nStep + (problemIndex === 1 ? 1 : 0));

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Find max probability for y-scale
    const maxProb = Math.max(...probabilities, 0.01);
    const yMax = Math.min(1, Math.ceil(maxProb * 10) / 10 + 0.1);

    const toX = (i: number) => padL + (i / maxN) * plotW;
    const toY = (v: number) => padT + plotH - (v / yMax) * plotH;

    // Grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for (let y = 0; y <= yMax; y += 0.1) {
      const py = toY(y);
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(w - padR, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(w - padR, padT + plotH);
    ctx.stroke();

    // X labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    const startN = problemIndex === 1 ? 0 : 1;
    for (let i = startN; i <= maxN; i++) {
      ctx.fillText(i.toString(), toX(i - startN), padT + plotH + 18);
    }
    ctx.fillText("n", w - padR + 5, padT + plotH + 18);

    // Y labels
    ctx.textAlign = "right";
    for (let y = 0; y <= yMax + 0.001; y += 0.1) {
      ctx.fillText(y.toFixed(1), padL - 8, toY(y) + 4);
    }

    // All points (grey)
    ctx.fillStyle = "#e2e8f0";
    for (let i = 0; i < probabilities.length; i++) {
      const x = toX(i);
      const y = toY(probabilities[i]);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Visible line
    if (visibleProbs.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < visibleProbs.length; i++) {
        const x = toX(i);
        const y = toY(visibleProbs[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Visible points (blue)
    for (let i = 0; i < visibleProbs.length; i++) {
      const x = toX(i);
      const y = toY(visibleProbs[i]);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Value label
      ctx.fillStyle = "#1e40af";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      const label = visibleProbs[i].toFixed(4);
      ctx.fillText(label, x, y - 12);
    }

    // Partial sum bar
    const partialSum = visibleProbs.reduce((s, v) => s + v, 0);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(w - 140, padT, 130, 40);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(w - 140, padT, 130, 40);
    ctx.fillStyle = "#475569";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("累積確率:", w - 132, padT + 16);
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = partialSum > 0.999 ? "#16a34a" : "#3b82f6";
    ctx.fillText(partialSum.toFixed(6), w - 132, padT + 34);
  }, [probabilities, visibleProbs, nStep, problemIndex]);

  return (
    <div className="space-y-4">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setProblemIndex(i);
              setNStep(5);
              setShowDetail(false);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              problemIndex === i
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-1">{problem.title}</h3>
        <p className="text-xs text-slate-600">{problem.description}</p>
      </div>

      {/* Recurrence formula */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          漸化式
        </h4>
        <KBlock tex={problem.recurrenceTex} />
        <div className="text-xs text-blue-500 text-center">
          初期条件: <K tex={problem.initialCondition} />
        </div>
      </div>

      {/* Slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            ステップ数
          </span>
          <span className="text-sm font-mono font-bold text-blue-600">
            n = {nStep}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={maxN}
          value={nStep}
          onChange={(e) => setNStep(Number(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1</span>
          <span>{maxN}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-2 text-xs text-slate-400">
          確率の推移グラフ（<K tex={`p_n`} /> vs <K tex="n" />）
        </div>
        <canvas ref={canvasRef} className="w-full" style={{ height: 260 }} />
      </div>

      {/* Step-by-step detail */}
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="w-full text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 py-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        {showDetail ? "計算過程を隠す" : "計算過程を表示"}
      </button>

      {showDetail && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-1 px-2 text-left text-slate-400">n</th>
                <th className="py-1 px-2 text-right text-slate-400">
                  <K tex="p_n" />
                </th>
                <th className="py-1 px-2 text-right text-slate-400">分数表記</th>
                <th className="py-1 px-2 text-right text-slate-400">累積和</th>
              </tr>
            </thead>
            <tbody>
              {visibleProbs.map((p, i) => {
                const cumSum = visibleProbs
                  .slice(0, i + 1)
                  .reduce((s, v) => s + v, 0);
                const startN = problemIndex === 1 ? 0 : 1;
                const n = startN + i;
                return (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1.5 px-2 font-mono font-bold">{n}</td>
                    <td className="py-1.5 px-2 text-right font-mono text-blue-600">
                      {p.toFixed(6)}
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {problemIndex === 0 ? (
                        <K tex={`\\frac{1}{${Math.pow(2, n)}}`} />
                      ) : (
                        p.toFixed(4)
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono text-slate-500">
                      {cumSum.toFixed(6)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <HintButton hints={[
        { step: 1, text: '確率の漸化式とは、n 回目の確率 p_n を p_(n-1) などの前の項を使って表す式です。' },
        { step: 2, text: '初期条件（p_1 や p_0 の値）を設定し、漸化式を繰り返し適用して各項を求めます。' },
        { step: 3, text: '確率の総和は必ず 1 になります（Σ p_n = 1）。累積和が 1 に近づくことを確認しましょう。' },
      ]} />

      {/* Sum property */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
        <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">
          確率の重要な性質
        </h4>
        <KBlock tex="\\sum_{n} p_n = 1 \\quad (\\text{確率の総和は1})" />
        <p className="text-xs text-green-600 text-center">
          {problemIndex === 0
            ? "n→+∞ で累積和は 1 に収束します（等比級数の和）"
            : problemIndex === 1
            ? "原点に戻る確率の総和（全nについて）"
            : "各試行は独立なので、赤球の確率は常に 1/2"}
        </p>
      </div>
    </div>
  );
}
