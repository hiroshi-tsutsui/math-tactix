"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

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

interface DataSet {
  label: string;
  description: string;
  x: number[];
  y: number[];
}

const DATA_SETS: DataSet[] = [
  {
    label: "データ1: 正の相関（強）",
    description: "勉強時間と試験得点",
    x: [2, 4, 6, 8, 10],
    y: [35, 50, 65, 75, 90],
  },
  {
    label: "データ2: 正の相関（中）",
    description: "身長と体重",
    x: [155, 160, 165, 170, 175, 180],
    y: [50, 55, 62, 58, 70, 72],
  },
  {
    label: "データ3: 負の相関",
    description: "気温とコート販売数",
    x: [5, 10, 15, 20, 25, 30],
    y: [80, 65, 50, 40, 20, 10],
  },
  {
    label: "データ4: 弱い相関",
    description: "年齢と靴のサイズ（成人）",
    x: [20, 25, 30, 35, 40, 45, 50],
    y: [26, 27, 25, 28, 26, 27, 25],
  },
];

interface CalcResult {
  n: number;
  xBar: number;
  yBar: number;
  dxs: number[];
  dys: number[];
  dxdy: number[];
  dx2: number[];
  dy2: number[];
  sumDxDy: number;
  sumDx2: number;
  sumDy2: number;
  r: number;
}

function computeCorrelation(xs: number[], ys: number[]): CalcResult {
  const n = xs.length;
  const xBar = xs.reduce((s, v) => s + v, 0) / n;
  const yBar = ys.reduce((s, v) => s + v, 0) / n;
  const dxs = xs.map((x) => x - xBar);
  const dys = ys.map((y) => y - yBar);
  const dxdy = dxs.map((dx, i) => dx * dys[i]);
  const dx2 = dxs.map((dx) => dx * dx);
  const dy2 = dys.map((dy) => dy * dy);
  const sumDxDy = dxdy.reduce((s, v) => s + v, 0);
  const sumDx2 = dx2.reduce((s, v) => s + v, 0);
  const sumDy2 = dy2.reduce((s, v) => s + v, 0);
  const denominator = Math.sqrt(sumDx2 * sumDy2);
  const r = denominator === 0 ? 0 : sumDxDy / denominator;
  return { n, xBar, yBar, dxs, dys, dxdy, dx2, dy2, sumDxDy, sumDx2, sumDy2, r };
}

function fmt(v: number, dp: number = 2): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(dp);
}

export default function CorrelationCoefficientCalcViz({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [dataIdx, setDataIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const ds = DATA_SETS[dataIdx];
  const calc = useMemo(() => computeCorrelation(ds.x, ds.y), [ds]);

  const scatterData = useMemo(
    () => ds.x.map((x, i) => ({ x, y: ds.y[i] })),
    [ds]
  );

  useEffect(() => {
    if (hasInteracted && onComplete) {
      onComplete();
    }
  }, [hasInteracted, onComplete]);

  const handleDataChange = (idx: number) => {
    setDataIdx(idx);
    setStep(0);
    setHasInteracted(true);
  };

  const maxStep = 5;

  const rColor =
    calc.r > 0.7
      ? "text-red-600"
      : calc.r > 0.3
      ? "text-orange-600"
      : calc.r > -0.3
      ? "text-slate-600"
      : calc.r > -0.7
      ? "text-blue-600"
      : "text-indigo-600";

  const rInterpretation =
    Math.abs(calc.r) >= 0.9
      ? "非常に強い"
      : Math.abs(calc.r) >= 0.7
      ? "強い"
      : Math.abs(calc.r) >= 0.4
      ? "中程度の"
      : Math.abs(calc.r) >= 0.2
      ? "弱い"
      : "ほぼ無い";

  const rDirection = calc.r > 0 ? "正の" : calc.r < 0 ? "負の" : "";

  return (
    <div className="space-y-6">
      {/* Data set selector */}
      <div className="flex flex-wrap gap-2">
        {DATA_SETS.map((d, idx) => (
          <button
            key={idx}
            onClick={() => handleDataChange(idx)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
              dataIdx === idx
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Formula */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h4 className="font-bold text-sm text-slate-800 mb-3">相関係数の公式</h4>
        <KBlock tex="r = \\frac{\\displaystyle\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\displaystyle\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\times \\displaystyle\\sum_{i=1}^{n}(y_i - \\bar{y})^2}}" />
      </div>

      {/* Step controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-bold">
          ステップ {step} / {maxStep}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 disabled:opacity-30"
          >
            ← 戻る
          </button>
          <button
            onClick={() => {
              setStep(Math.min(maxStep, step + 1));
              setHasInteracted(true);
            }}
            disabled={step >= maxStep}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white disabled:opacity-30"
          >
            次へ →
          </button>
          <button
            onClick={() => {
              setStep(maxStep);
              setHasInteracted(true);
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-green-500 text-white"
          >
            全表示
          </button>
        </div>
      </div>

      {/* Step 1: Raw data */}
      {step >= 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            Step 1: データと平均値
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-1 text-left text-slate-500">i</th>
                  <th className="px-2 py-1 text-right"><K tex="x_i" /></th>
                  <th className="px-2 py-1 text-right"><K tex="y_i" /></th>
                </tr>
              </thead>
              <tbody>
                {ds.x.map((x, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-1 text-slate-400">{i + 1}</td>
                    <td className="px-2 py-1 text-right font-mono">{x}</td>
                    <td className="px-2 py-1 text-right font-mono">{ds.y[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-4 justify-center text-sm">
            <span>
              <K tex={`\\bar{x} = ${fmt(calc.xBar)}`} />
            </span>
            <span>
              <K tex={`\\bar{y} = ${fmt(calc.yBar)}`} />
            </span>
          </div>
        </div>
      )}

      {/* Step 2: Deviations table */}
      {step >= 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            Step 2: 偏差の計算
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-1 text-left text-slate-500">i</th>
                  <th className="px-2 py-1 text-right"><K tex="x_i - \bar{x}" /></th>
                  <th className="px-2 py-1 text-right"><K tex="y_i - \bar{y}" /></th>
                </tr>
              </thead>
              <tbody>
                {calc.dxs.map((dx, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-1 text-slate-400">{i + 1}</td>
                    <td className="px-2 py-1 text-right font-mono">{fmt(dx)}</td>
                    <td className="px-2 py-1 text-right font-mono">{fmt(calc.dys[i])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 3: Products and squares */}
      {step >= 3 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            Step 3: 偏差の積と2乗
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-1 text-left text-slate-500">i</th>
                  <th className="px-2 py-1 text-right"><K tex="(x_i-\bar{x})(y_i-\bar{y})" /></th>
                  <th className="px-2 py-1 text-right"><K tex="(x_i-\bar{x})^2" /></th>
                  <th className="px-2 py-1 text-right"><K tex="(y_i-\bar{y})^2" /></th>
                </tr>
              </thead>
              <tbody>
                {calc.dxdy.map((v, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-1 text-slate-400">{i + 1}</td>
                    <td className={`px-2 py-1 text-right font-mono ${v >= 0 ? "text-red-500" : "text-blue-500"}`}>
                      {fmt(v)}
                    </td>
                    <td className="px-2 py-1 text-right font-mono">{fmt(calc.dx2[i])}</td>
                    <td className="px-2 py-1 text-right font-mono">{fmt(calc.dy2[i])}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-300 font-bold">
                  <td className="px-2 py-1 text-slate-500">合計</td>
                  <td className="px-2 py-1 text-right font-mono">{fmt(calc.sumDxDy)}</td>
                  <td className="px-2 py-1 text-right font-mono">{fmt(calc.sumDx2)}</td>
                  <td className="px-2 py-1 text-right font-mono">{fmt(calc.sumDy2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 4: Final calculation */}
      {step >= 4 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            Step 4: 相関係数の計算
          </h4>
          <div className="space-y-3">
            <KBlock
              tex={`r = \\frac{${fmt(calc.sumDxDy)}}{\\sqrt{${fmt(calc.sumDx2)} \\times ${fmt(calc.sumDy2)}}}`}
            />
            <KBlock
              tex={`= \\frac{${fmt(calc.sumDxDy)}}{\\sqrt{${fmt(calc.sumDx2 * calc.sumDy2)}}} = \\frac{${fmt(calc.sumDxDy)}}{${fmt(Math.sqrt(calc.sumDx2 * calc.sumDy2))}}`}
            />
            <div className="text-center mt-2">
              <span className={`text-2xl font-bold ${rColor}`}>
                <K tex={`r \\approx ${calc.r.toFixed(4)}`} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Scatter plot */}
      {step >= 5 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            Step 5: 散布図と相関係数
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="x"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="y"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <Tooltip />
                <ReferenceLine
                  x={calc.xBar}
                  stroke="#f59e0b"
                  strokeDasharray="4 3"
                  label={{ value: "x\u0304", position: "top", fontSize: 11 }}
                />
                <ReferenceLine
                  y={calc.yBar}
                  stroke="#f59e0b"
                  strokeDasharray="4 3"
                  label={{ value: "y\u0304", position: "right", fontSize: 11 }}
                />
                <Scatter data={scatterData} fill="#6366f1" r={5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-3">
            <span className={`text-lg font-bold ${rColor}`}>
              {rDirection}{rInterpretation}相関 (r = {calc.r.toFixed(4)})
            </span>
          </div>
          <p className="text-sm text-slate-500 text-center mt-1">{ds.description}</p>
        </div>
      )}

      {/* Hint */}
      <HintButton hints={[
        { step: 1, text: "相関係数 r は「x と y の偏差の積の平均」を「それぞれの標準偏差の積」で割った値です。" },
        { step: 2, text: "まず各データから平均を引いて偏差 dx, dy を求め、dx・dy の合計を計算します。" },
        { step: 3, text: "r = Σ(dx・dy) / √(Σdx²・Σdy²) で求まります。-1 ≤ r ≤ 1 の範囲になります。" },
      ]} />

      {/* Interpretation guide */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
        <h4 className="font-bold text-indigo-700 text-sm mb-3">相関係数 r の解釈</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded-lg p-2 border border-indigo-100">
            <span className="text-red-600 font-bold">0.7 &le; r &le; 1.0</span>
            <span className="text-slate-500 ml-2">強い正の相関</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-indigo-100">
            <span className="text-orange-600 font-bold">0.4 &le; r &lt; 0.7</span>
            <span className="text-slate-500 ml-2">中程度の正の相関</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-indigo-100">
            <span className="text-slate-600 font-bold">-0.4 &lt; r &lt; 0.4</span>
            <span className="text-slate-500 ml-2">ほぼ無相関</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-indigo-100">
            <span className="text-indigo-600 font-bold">-1.0 &le; r &le; -0.7</span>
            <span className="text-slate-500 ml-2">強い負の相関</span>
          </div>
        </div>
        <ul className="text-sm text-indigo-600 space-y-1 list-disc list-inside mt-3">
          <li>r = 1 のとき全点が正の傾きの直線上に並ぶ</li>
          <li>r = -1 のとき全点が負の傾きの直線上に並ぶ</li>
          <li>r = 0 は線形な関係がないことを意味する（非線形な関係はありうる）</li>
        </ul>
      </div>
    </div>
  );
}
