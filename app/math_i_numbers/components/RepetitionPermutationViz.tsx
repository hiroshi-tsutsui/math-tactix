"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
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

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function permutation(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function repetitionPermutation(n: number, r: number): number {
  return Math.pow(n, r);
}

function repetitionCombination(n: number, r: number): number {
  // H(n, r) = C(n + r - 1, r)
  return combination(n + r - 1, r);
}

const BALL_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
];

/** Generate all divider-bar arrangements for repetition combination */
function generateDividerPatterns(n: number, r: number): string[] {
  if (n <= 0 || r < 0) return [];
  if (n === 1) return [Array(r).fill("★").join("")];
  if (r === 0) return [Array(n - 1).fill("｜").join("")];

  const results: string[] = [];
  const total = r + (n - 1); // total positions: r stars + (n-1) bars

  // Too many to enumerate
  if (total > 12) return [];

  // Generate all ways to choose (n-1) bar positions from total positions
  const chooseBars = (pos: number, barsLeft: number, chosen: number[]): void => {
    if (barsLeft === 0) {
      const pattern: string[] = [];
      for (let i = 0; i < total; i++) {
        pattern.push(chosen.includes(i) ? "｜" : "★");
      }
      results.push(pattern.join(""));
      return;
    }
    if (pos >= total) return;
    if (total - pos < barsLeft) return;
    // choose this position as bar
    chooseBars(pos + 1, barsLeft - 1, [...chosen, pos]);
    // skip this position
    chooseBars(pos + 1, barsLeft, chosen);
  };

  chooseBars(0, n - 1, []);
  return results;
}

export default function RepetitionPermutationViz() {
  const [n, setN] = useState(3);
  const [r, setR] = useState(2);
  const [mode, setMode] = useState<"rep_perm" | "rep_comb">("rep_perm");

  const nPow = useMemo(() => repetitionPermutation(n, r), [n, r]);
  const nHr = useMemo(() => repetitionCombination(n, r), [n, r]);
  const nPr = useMemo(() => permutation(n, r), [n, r]);
  const nCr = useMemo(() => combination(n, r), [n, r]);

  const dividerPatterns = useMemo(() => {
    if (mode !== "rep_comb") return [];
    return generateDividerPatterns(n, r);
  }, [n, r, mode]);

  // Tree depth limited for display
  const showTree = r <= 4 && n <= 4;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">
            n（種類数）: <span className="text-indigo-600 font-bold">{n}</span>
          </label>
          <input
            type="range"
            min={1}
            max={6}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">
            r（選ぶ個数）: <span className="text-indigo-600 font-bold">{r}</span>
          </label>
          <input
            type="range"
            min={0}
            max={5}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("rep_perm")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "rep_perm"
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          重複順列
        </button>
        <button
          onClick={() => setMode("rep_comb")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "rep_comb"
              ? "bg-pink-100 text-pink-700 border border-pink-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          重複組み合わせ
        </button>
      </div>

      {/* Visualization */}
      {mode === "rep_perm" ? (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            重複順列: 同じものを繰り返し選べる並べ方
          </h3>

          {/* Ball types display */}
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2">使える{n}種類</p>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: n }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-full font-bold text-white text-sm shadow-md"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: BALL_COLORS[i % BALL_COLORS.length],
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
          </div>

          {/* Tree visualization */}
          {showTree && r > 0 ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-3">
                ツリー構造（各段で{n}種類すべてから選択可能）
              </p>
              <TreeVisualization n={n} r={r} />
            </div>
          ) : r === 0 ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">r=0: 何も選ばない方法は 1 通り（空の選択）</p>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                n={n}, r={r} の場合、ツリーが大きすぎるため省略します。
                結果: <K tex={`${n}^{${r}} = ${nPow}`} /> 通り
              </p>
            </div>
          )}

          {/* Comparison with normal permutation */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400 mb-2">通常の順列との比較</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <p className="text-[10px] text-slate-400 mb-1">重複順列</p>
                <p className="text-sm text-slate-700">
                  各段で <K tex={`${n}`} /> 種類すべてから選べる
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  <K tex={`\\underbrace{${n} \\times ${n} \\times \\cdots}_{${r}\\text{回}} = ${n}^{${r}}`} />
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">通常の順列</p>
                <p className="text-sm text-slate-700">
                  各段で選択肢が1つずつ減る
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {r <= n ? (
                    <K tex={`${Array.from({ length: r }, (_, i) => n - i).join(" \\times ")} = {}_{${n}}\\mathrm{P}_{${r}} = ${nPr}`} />
                  ) : (
                    <K tex={`{}_{${n}}\\mathrm{P}_{${r}} = 0 \\;(r > n)`} />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            重複組み合わせ: 仕切り棒モデル
          </h3>

          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2">
              {n}種類から重複を許して{r}個選ぶ（順序は区別しない）
            </p>
            <p className="text-sm text-slate-600 mb-3">
              ★（選んだもの: {r}個）と ｜（仕切り: {n - 1}本）を一列に並べる方法 ={" "}
              <K tex={`\\mathrm{H}(${n},${r}) = {}_{${n + r - 1}}\\mathrm{C}_{${r}} = ${nHr}`} /> 通り
            </p>
          </div>

          {/* Divider patterns */}
          {dividerPatterns.length > 0 && dividerPatterns.length <= 30 ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-2">
                全{dividerPatterns.length}パターン
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {dividerPatterns.map((pat, idx) => (
                  <div
                    key={idx}
                    className="bg-white px-3 py-1.5 rounded-lg border border-pink-100 text-sm font-mono tracking-wider"
                  >
                    {pat}
                  </div>
                ))}
              </div>
              <p className="text-xs text-pink-600 mt-2">
                各仕切り ｜ が種類の区切り。左から種類 {Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)).join(", ")} の個数を表す
              </p>
            </div>
          ) : dividerPatterns.length > 30 ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                パターンが多すぎるため省略（{nHr}通り）
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Formula display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-xl p-5 border transition-all ${
          mode === "rep_perm"
            ? "bg-indigo-50 border-indigo-200 shadow-sm"
            : "bg-slate-50 border-slate-100"
        }`}>
          <h4 className="text-sm font-bold text-slate-700 mb-3">重複順列</h4>
          <KBlock tex={`n^r = ${n}^{${r}} = ${nPow}`} />
          <p className="text-xs text-slate-500 mt-2">
            {n}種類から重複を許して{r}個選んで<strong>並べる</strong>
          </p>
        </div>
        <div className={`rounded-xl p-5 border transition-all ${
          mode === "rep_comb"
            ? "bg-pink-50 border-pink-200 shadow-sm"
            : "bg-slate-50 border-slate-100"
        }`}>
          <h4 className="text-sm font-bold text-slate-700 mb-3">重複組み合わせ</h4>
          <KBlock tex={`\\mathrm{H}(${n},${r}) = {}_{${n + r - 1}}\\mathrm{C}_{${r}} = \\frac{${factorial(n + r - 1)}}{${factorial(r)} \\times ${factorial(n - 1)}} = ${nHr}`} />
          <p className="text-xs text-slate-500 mt-2">
            {n}種類から重複を許して{r}個<strong>選ぶ</strong>（順序なし）
          </p>
        </div>
      </div>

      {/* 4-value comparison */}
      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
        <h4 className="text-sm font-bold text-amber-800 mb-3">4つの値の比較</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-200">
                <th className="text-left py-2 pr-4 text-amber-700">種類</th>
                <th className="text-left py-2 pr-4 text-amber-700">式</th>
                <th className="text-right py-2 text-amber-700">値</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-amber-100">
                <td className="py-2 pr-4 text-slate-700">重複順列</td>
                <td className="py-2 pr-4"><K tex={`n^r = ${n}^{${r}}`} /></td>
                <td className="py-2 text-right font-bold text-indigo-600">{nPow}</td>
              </tr>
              <tr className="border-b border-amber-100">
                <td className="py-2 pr-4 text-slate-700">通常の順列</td>
                <td className="py-2 pr-4"><K tex={`{}_{${n}}\\mathrm{P}_{${r}}`} /></td>
                <td className="py-2 text-right font-bold text-blue-600">{nPr}</td>
              </tr>
              <tr className="border-b border-amber-100">
                <td className="py-2 pr-4 text-slate-700">重複組み合わせ</td>
                <td className="py-2 pr-4"><K tex={`\\mathrm{H}(${n},${r})`} /></td>
                <td className="py-2 text-right font-bold text-pink-600">{nHr}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-700">通常の組み合わせ</td>
                <td className="py-2 pr-4"><K tex={`{}_{${n}}\\mathrm{C}_{${r}}`} /></td>
                <td className="py-2 text-right font-bold text-slate-600">{nCr}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {r <= n && r > 0 && n > 1 && (
          <p className="text-xs text-amber-700 mt-3">
            一般に <K tex={`n^r \\geq {}_{n}\\mathrm{P}_{r} \\geq \\mathrm{H}(n,r) \\geq {}_{n}\\mathrm{C}_{r}`} />
          </p>
        )}
      </div>

      {/* Concrete example */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-2">具体例</h4>
        {mode === "rep_perm" ? (
          <p className="text-sm text-slate-600 leading-relaxed">
            {n === 6 && r === 3 ? (
              <>1〜6のサイコロを3回振る場合の目の出方: <K tex={`6^3 = 216`} /> 通り</>
            ) : (
              <>{n}種類のカードから重複を許して{r}枚選んで並べる: <K tex={`${n}^{${r}} = ${nPow}`} /> 通り</>
            )}
          </p>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed">
            {n === 3 && r === 2 ? (
              <>3種類のアイスから重複ありで2個選ぶ: <K tex={`\\mathrm{H}(3,2) = {}_{4}\\mathrm{C}_{2} = 6`} /> 通り</>
            ) : (
              <>{n}種類の果物から重複ありで{r}個選ぶ: <K tex={`\\mathrm{H}(${n},${r}) = {}_{${n + r - 1}}\\mathrm{C}_{${r}} = ${nHr}`} /> 通り</>
            )}
          </p>
        )}
      </div>

      {/* Hints */}
      <HintButton
        hints={[
          { step: 1, text: "重複順列: 各回で全n種類から選べる（前回の選択に関係なく）→ n×n×...×n = n^r" },
          { step: 2, text: "重複組み合わせ: 順序を区別しないで重複ありで選ぶ" },
          { step: 3, text: "仕切り棒モデル: ★（選んだもの）と｜（仕切り）を並べる → C(n+r-1, r)" },
          { step: 4, text: "まとめ: n^r（重複順列）≧ nPr ≧ H(n,r)（重複組み合わせ）≧ nCr の大小関係" },
        ]}
      />
    </div>
  );
}

/** Simple tree visualization for repetition permutation */
function TreeVisualization({ n, r }: { n: number; r: number }) {
  const svgWidth = 600;
  const svgHeight = Math.min(300, 60 + r * 70);
  const levelHeight = (svgHeight - 40) / r;

  // Only render if manageable
  const totalNodes = Math.pow(n, r);
  if (totalNodes > 64) {
    return (
      <p className="text-sm text-slate-500">
        ノード数 {totalNodes} が多いためツリーは省略します。
      </p>
    );
  }

  const nodes: Array<{ x: number; y: number; level: number; label: string; parentX: number; parentY: number }> = [];

  const buildTree = (level: number, parentX: number, parentY: number, xStart: number, xEnd: number) => {
    if (level > r) return;
    const width = xEnd - xStart;
    const segWidth = width / n;

    for (let i = 0; i < n; i++) {
      const x = xStart + segWidth * (i + 0.5);
      const y = 20 + level * levelHeight;
      nodes.push({
        x, y, level,
        label: String.fromCharCode(65 + i),
        parentX, parentY,
      });
      buildTree(level + 1, x, y, xStart + segWidth * i, xStart + segWidth * (i + 1));
    }
  };

  buildTree(0, svgWidth / 2, 10, 0, svgWidth);

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-h-72">
      {/* Root node */}
      <circle cx={svgWidth / 2} cy={10} r={6} fill="#94a3b8" />
      {/* Edges */}
      {nodes.map((node, idx) => (
        <line
          key={`edge-${idx}`}
          x1={node.parentX}
          y1={node.parentY}
          x2={node.x}
          y2={node.y}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, idx) => (
        <g key={`node-${idx}`}>
          <circle
            cx={node.x}
            cy={node.y}
            r={totalNodes <= 16 ? 10 : 6}
            fill={BALL_COLORS[node.label.charCodeAt(0) - 65]}
          />
          {totalNodes <= 16 && (
            <text
              x={node.x}
              y={node.y + 3.5}
              textAnchor="middle"
              fill="white"
              fontSize={8}
              fontWeight="bold"
            >
              {node.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
