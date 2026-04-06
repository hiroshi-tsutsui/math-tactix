"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

function binomialProbability(n: number, k: number, p: number): number {
  return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function fmt(v: number, digits: number = 4): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(digits);
}

interface SimResult {
  trials: boolean[];
  successes: number;
}

export default function BinomialTrialViz() {
  const [n, setN] = useState(5);
  const [p, setP] = useState(0.5);
  const [k, setK] = useState(2);
  const [simResults, setSimResults] = useState<SimResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Clamp k when n changes
  useEffect(() => {
    if (k > n) setK(n);
  }, [n, k]);

  const currentProb = useMemo(() => binomialProbability(n, k, p), [n, k, p]);
  const distribution = useMemo(() => {
    const dist: { k: number; prob: number }[] = [];
    for (let i = 0; i <= n; i++) {
      dist.push({ k: i, prob: binomialProbability(n, i, p) });
    }
    return dist;
  }, [n, p]);

  const cnk = comb(n, k);
  const pk = Math.pow(p, k);
  const qnk = Math.pow(1 - p, n - k);

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    const results: SimResult[] = [];
    for (let i = 0; i < 20; i++) {
      const trials: boolean[] = [];
      for (let j = 0; j < n; j++) {
        trials.push(Math.random() < p);
      }
      results.push({ trials, successes: trials.filter(Boolean).length });
    }
    setSimResults(results);
    setTimeout(() => setIsSimulating(false), 300);
  }, [n, p]);

  // Frequency from simulation
  const simFrequency = useMemo(() => {
    if (simResults.length === 0) return null;
    const freq: Record<number, number> = {};
    for (let i = 0; i <= n; i++) freq[i] = 0;
    simResults.forEach((r) => { freq[r.successes] = (freq[r.successes] || 0) + 1; });
    return freq;
  }, [simResults, n]);

  const renderBarChart = () => {
    const W = 380;
    const H = 180;
    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const maxProb = Math.max(...distribution.map((d) => d.prob), 0.01);
    const barCount = distribution.length;
    const barW = Math.min(30, plotW / barCount - 4);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {/* Axis */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#cbd5e1" strokeWidth={1} />

        {/* Bars */}
        {distribution.map((d, i) => {
          const x = padL + (i / barCount) * plotW + (plotW / barCount - barW) / 2;
          const h = (d.prob / maxProb) * plotH;
          const y = H - padB - h;
          const isSelected = d.k === k;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill={isSelected ? "#3b82f6" : "#94a3b8"}
                rx={2}
                opacity={isSelected ? 1 : 0.4}
              />
              {/* Probability label */}
              <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize={7} fill={isSelected ? "#3b82f6" : "#94a3b8"} fontWeight="bold">
                {(d.prob * 100).toFixed(1)}%
              </text>
              {/* k label */}
              <text x={x + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={isSelected ? "bold" : "normal"}>
                {d.k}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={W / 2} y={H - 3} textAnchor="middle" fontSize={9} fill="#94a3b8">
          成功回数 k
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">反復試行の確率</h2>
        <p className="text-sm text-slate-500">
          二項分布 <K tex="P = {}_nC_k \cdot p^k \cdot (1-p)^{n-k}" />
        </p>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        {/* n */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-700">試行回数 n</label>
            <span className="text-sm font-mono font-bold text-blue-600">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1</span><span>10</span>
          </div>
        </div>

        {/* p */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-700">成功確率 p</label>
            <span className="text-sm font-mono font-bold text-blue-600">{p.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.1}
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.1</span><span>0.9</span>
          </div>
        </div>

        {/* k */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-slate-700">成功回数 k</label>
            <span className="text-sm font-mono font-bold text-blue-600">{k}</span>
          </div>
          <input
            type="range"
            min={0}
            max={n}
            step={1}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0</span><span>{n}</span>
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h3 className="font-bold text-slate-800 mb-2">計算ステップ</h3>

        {/* Step 1: C(n,k) */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold mb-1">Step 1: 組合せの数</div>
          <KBlock tex={`{}_${n}C_{${k}} = \\frac{${n}!}{${k}!\\cdot${n - k}!} = ${cnk}`} />
        </div>

        {/* Step 2: p^k */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold mb-1">Step 2: 成功確率の k 乗</div>
          <KBlock tex={`p^k = ${p.toFixed(1)}^{${k}} = ${fmt(pk)}`} />
        </div>

        {/* Step 3: (1-p)^(n-k) */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold mb-1">Step 3: 失敗確率の (n-k) 乗</div>
          <KBlock tex={`(1-p)^{n-k} = ${(1 - p).toFixed(1)}^{${n - k}} = ${fmt(qnk)}`} />
        </div>

        {/* Step 4: Product */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-[10px] text-blue-400 font-bold mb-1">Step 4: 全体の確率</div>
          <KBlock tex={`P(X = ${k}) = ${cnk} \\times ${fmt(pk)} \\times ${fmt(qnk)} = ${fmt(currentProb)}`} />
          <div className="text-center mt-2">
            <span className="text-lg font-bold text-blue-600">{(currentProb * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <h3 className="font-bold text-slate-700 text-sm mb-2 text-center">
          二項分布 <K tex={`B(${n},\\,${p.toFixed(1)})`} />
        </h3>
        {renderBarChart()}
        <p className="text-[10px] text-slate-400 text-center mt-1">
          青色のバーが現在選択中の k={k}
        </p>
      </div>

      {/* Simulation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">コイン投げシミュレーション</h3>
        <p className="text-xs text-slate-500 mb-3">
          n={n} 回の試行を20セット実行して、理論値と比較します。
        </p>
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSimulating ? "実行中..." : "シミュレーション実行"}
        </button>

        {simResults.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* Trial results grid */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {simResults.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-slate-400 font-mono text-right">#{i + 1}</span>
                  <div className="flex gap-1">
                    {r.trials.map((success, j) => (
                      <div
                        key={j}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                        }`}
                      >
                        {success ? "O" : "X"}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-600 font-bold ml-auto">{r.successes}回</span>
                </div>
              ))}
            </div>

            {/* Frequency comparison */}
            {simFrequency && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-[10px] text-slate-400 font-bold mb-2">理論値 vs シミュレーション</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="text-slate-400 font-bold">成功回数</div>
                  <div className="text-slate-400 font-bold text-right">理論 / 実測</div>
                  {distribution.map((d) => (
                    <React.Fragment key={d.k}>
                      <div className={`font-mono ${d.k === k ? "text-blue-600 font-bold" : "text-slate-600"}`}>
                        k={d.k}
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-500">{(d.prob * 100).toFixed(1)}%</span>
                        {" / "}
                        <span className="text-blue-600 font-bold">
                          {((simFrequency[d.k] / simResults.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Formula Reference */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          反復試行の確率公式
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-slate-400 text-xs mb-1">反復試行の確率</div>
            <KBlock tex="P(X = k) = {}_nC_k \cdot p^k \cdot (1-p)^{n-k}" />
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">各項の意味</div>
            <p className="text-slate-300 text-xs">
              <K tex="{}_nC_k" />: n回中k回を選ぶ組合せの数
            </p>
            <p className="text-slate-300 text-xs mt-1">
              <K tex="p^k" />: k回成功する確率
            </p>
            <p className="text-slate-300 text-xs mt-1">
              <K tex="(1-p)^{n-k}" />: 残り(n-k)回失敗する確率
            </p>
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">期待値と分散</div>
            <KBlock tex="E(X) = np,\quad V(X) = np(1-p)" />
          </div>
        </div>
      </div>
    </div>
  );
}
