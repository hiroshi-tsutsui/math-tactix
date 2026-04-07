"use client";
import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import HintButton from '../../components/HintButton';

export default function ShortestPathViz() {
  const [w, setW] = useState(4);
  const [h, setH] = useState(3);
  const [obstacle, setObstacle] = useState<{x: number, y: number} | null>(null);

  const paths = useMemo(() => {
    let dp: number[][] = Array(w + 1).fill(0).map(() => Array(h + 1).fill(0));
    dp[0][0] = 1;
    for (let x = 0; x <= w; x++) {
      for (let y = 0; y <= h; y++) {
        if (x === 0 && y === 0) continue;
        if (obstacle && obstacle.x === x && obstacle.y === y) {
          dp[x][y] = 0;
          continue;
        }
        let top = y > 0 ? dp[x][y - 1] : 0;
        let left = x > 0 ? dp[x - 1][y] : 0;
        dp[x][y] = top + left;
      }
    }
    return dp;
  }, [w, h, obstacle]);

  const totalPaths = paths[w][h];
  const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
  const totalWithoutObstacle = factorial(w + h) / (factorial(w) * factorial(h));

  const handleGridClick = (x: number, y: number) => {
    if ((x === 0 && y === 0) || (x === w && y === h)) return;
    if (obstacle && obstacle.x === x && obstacle.y === y) {
      setObstacle(null);
    } else {
      setObstacle({x, y});
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-center font-bold text-slate-800 text-lg mb-4">最短経路の数 (Shortest Paths)</h3>
        
        <p className="text-sm text-slate-600 text-center mb-6">
          スタート(S)からゴール(G)まで、右か上のみに進む最短経路は何通りあるでしょうか？<br/>
          交差点をクリックすると「通れない道(障害物)」を設置できます。
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <div className="flex flex-col items-center">
            <label className="text-sm font-bold text-slate-700 mb-2">横のブロック数: {w}</label>
            <input 
              type="range" min="1" max="6" value={w} 
              onChange={(e) => {
                setW(parseInt(e.target.value));
                setObstacle(null);
              }}
              className="accent-indigo-600"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm font-bold text-slate-700 mb-2">縦のブロック数: {h}</label>
            <input 
              type="range" min="1" max="6" value={h} 
              onChange={(e) => {
                setH(parseInt(e.target.value));
                setObstacle(null);
              }}
              className="accent-indigo-600"
            />
          </div>
        </div>

        {/* Dynamic Grid Rendering */}
        <div className="relative w-full overflow-x-auto flex justify-center pb-6">
          <svg width={(w + 1) * 60 + 40} height={(h + 1) * 60 + 40} className="bg-white rounded-lg shadow-sm border border-slate-200">
            <g transform={`translate(20, 20)`}>
              {/* Draw grid lines */}
              {Array.from({length: w + 1}).map((_, x) => (
                <line key={`v${x}`} x1={x * 60} y1={0} x2={x * 60} y2={h * 60} stroke="#cbd5e1" strokeWidth="2" />
              ))}
              {Array.from({length: h + 1}).map((_, y) => (
                <line key={`h${y}`} x1={0} y1={y * 60} x2={w * 60} y2={y * 60} stroke="#cbd5e1" strokeWidth="2" />
              ))}

              {/* Draw intersections and numbers */}
              {Array.from({length: w + 1}).map((_, x) => 
                Array.from({length: h + 1}).map((_, y) => {
                  const renderY = h - y; 
                  const isObstacle = obstacle && obstacle.x === x && obstacle.y === y;
                  const isStart = x === 0 && y === 0;
                  const isEnd = x === w && y === h;
                  const val = paths[x][y];

                  return (
                    <g key={`${x}-${y}`} transform={`translate(${x * 60}, ${renderY * 60})`} onClick={() => handleGridClick(x, y)} className="cursor-pointer">
                      <circle 
                        r={isObstacle ? 12 : 16} 
                        fill={isStart ? "#22c55e" : isEnd ? "#ef4444" : isObstacle ? "#334155" : "white"} 
                        stroke={isObstacle ? "none" : "#94a3b8"} 
                        strokeWidth="2" 
                      />
                      {!isObstacle && (
                        <text 
                          x="0" y="4" 
                          textAnchor="middle" 
                          className={`text-xs font-bold ${isStart || isEnd ? "fill-white" : "fill-slate-700"} select-none`}
                        >
                          {isStart ? "S" : isEnd ? "G" : val > 0 ? val : ""}
                        </text>
                      )}
                      {isObstacle && (
                        <text x="0" y="4" textAnchor="middle" className="text-xs font-bold fill-white select-none">×</text>
                      )}
                    </g>
                  );
                })
              )}
            </g>
          </svg>
        </div>

        {/* Feedback Panel */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-4 rounded-r-lg flex flex-col items-center">
          <div className="text-indigo-900 font-bold text-lg mb-2">総経路数: {totalPaths} 通り</div>
          {obstacle ? (
            <div className="text-sm text-indigo-800 text-center">
              交差点ごとに「左からの経路数 ＋ 下からの経路数」を足し合わせることで求まります。<br/>
              障害物がある点は 0 通りとして計算されます。
            </div>
          ) : (
            <div className="text-sm text-indigo-800 text-center">
              右に <InlineMath math={`${w}`} /> 回、上に <InlineMath math={`${h}`} /> 回進むため、合計 <InlineMath math={`${w+h}`} /> 回の移動のうち、右に進む <InlineMath math={`${w}`} /> 回を選ぶ組み合わせになります。<br/>
              <BlockMath math={`_{${w+h}}\\mathrm{C}_{${w}} = \\frac{${w+h}!}{${w}! ${h}!} = ${totalWithoutObstacle}`} />
            </div>
          )}
        </div>
      </div>

      <HintButton
        hints={[
          { step: 1, text: "右に w 回、上に h 回の計 (w+h) 回の移動から、右に進む w 回を選ぶ組み合わせです" },
          { step: 2, text: "各交差点の経路数は「左からの経路数 + 下からの経路数」で求まります（動的計画法）" },
          { step: 3, text: "障害物がある点は経路数を 0 とし、そこを通る経路は全て除外されます" },
          { step: 4, text: "障害物なしの場合: C(w+h, w) = (w+h)! / (w! × h!) で計算できます" },
        ]}
      />
    </div>
  );
}
