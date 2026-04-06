"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";

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

type Law = "and" | "or";
type Side = "left" | "right";

const TRUTH_ROWS: [boolean, boolean][] = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
];

export default function DeMorganViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [law, setLaw] = useState<Law>("and");
  const [side, setSide] = useState<Side>("left");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const r = 90;
    const offset = 50;
    const ax = cx - offset;
    const bx = cx + offset;

    // Universal set rectangle
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("U", 28, 38);

    // Determine which region to highlight
    // We need to fill the highlighted region first, then draw circle outlines

    // Helper: fill the universal set background
    const fillUniversal = (color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(20, 20, W - 40, H - 40);
      ctx.restore();
    };

    // Helper: clip to circle
    const clipCircle = (x: number, y: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clip();
    };

    if (law === "and") {
      // NOT(A AND B) vs (NOT A) OR (NOT B)
      if (side === "left") {
        // NOT(A AND B): Everything except A intersect B
        // Fill universal set
        fillUniversal("rgba(59, 130, 246, 0.15)");
        // Cut out intersection
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(bx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      } else {
        // (NOT A) OR (NOT B) = same region
        fillUniversal("rgba(59, 130, 246, 0.15)");
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(bx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    } else {
      // NOT(A OR B) vs (NOT A) AND (NOT B)
      if (side === "left") {
        // NOT(A OR B): Everything outside both A and B
        fillUniversal("rgba(239, 68, 68, 0.15)");
        // Clear A circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
        // Clear B circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(bx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      } else {
        // (NOT A) AND (NOT B) = same region
        fillUniversal("rgba(239, 68, 68, 0.15)");
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.arc(bx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    // Draw circle outlines
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(ax, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("A", ax - r / 2 - 10, cy - r / 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("B", bx + r / 2 - 5, cy - r / 2);

    // Outer rectangle again (to cover any overflow)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, W - 40, H - 40);
  }, [law, side]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Truth table computation
  const computeRow = (p: boolean, q: boolean): { leftVal: boolean; rightVal: boolean } => {
    if (law === "and") {
      return {
        leftVal: !(p && q),
        rightVal: !p || !q,
      };
    } else {
      return {
        leftVal: !(p || q),
        rightVal: !p && !q,
      };
    }
  };

  const lawTitle = law === "and"
    ? "\\neg(A \\wedge B) = \\neg A \\vee \\neg B"
    : "\\neg(A \\vee B) = \\neg A \\wedge \\neg B";

  const leftLabel = law === "and" ? "\\neg(A \\wedge B)" : "\\neg(A \\vee B)";
  const rightLabel = law === "and" ? "\\neg A \\vee \\neg B" : "\\neg A \\wedge \\neg B";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">ド・モルガンの法則（発展）</h2>
        <p className="text-sm text-slate-500">
          NOTの分配と真偽表の対応を視覚化
        </p>
      </div>

      {/* Law Selection Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setLaw("and")}
          className={`px-3 py-2 text-xs font-bold rounded-lg border ${law === "and" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          <K tex="\neg(A \wedge B)" />
        </button>
        <button
          onClick={() => setLaw("or")}
          className={`px-3 py-2 text-xs font-bold rounded-lg border ${law === "or" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          <K tex="\neg(A \vee B)" />
        </button>
      </div>

      {/* Formula */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
        <KBlock tex={lawTitle} />
      </div>

      {/* Side Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setSide("left")}
          className={`px-4 py-2 text-xs font-bold rounded-lg border ${side === "left" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          左辺: <K tex={leftLabel} />
        </button>
        <button
          onClick={() => setSide("right")}
          className={`px-4 py-2 text-xs font-bold rounded-lg border ${side === "right" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          右辺: <K tex={rightLabel} />
        </button>
      </div>

      {/* Venn Diagram */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={280}
          className="w-full"
          style={{ maxHeight: 280 }}
        />
        <p className="text-xs text-slate-400 text-center mt-2">
          色付きの領域が{side === "left" ? "左辺" : "右辺"}の集合を表します
          {" "}(左辺と右辺の領域は一致します)
        </p>
      </div>

      {/* Truth Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">真偽表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-2 px-2 text-slate-400">P(A)</th>
                <th className="py-2 px-2 text-slate-400">Q(B)</th>
                <th className="py-2 px-2 text-slate-400"><K tex={leftLabel} /></th>
                <th className="py-2 px-2 text-slate-400"><K tex={rightLabel} /></th>
                <th className="py-2 px-2 text-slate-400">一致</th>
              </tr>
            </thead>
            <tbody>
              {TRUTH_ROWS.map(([p, q], i) => {
                const { leftVal, rightVal } = computeRow(p, q);
                const match = leftVal === rightVal;
                return (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 px-2 font-mono font-bold">{p ? "T" : "F"}</td>
                    <td className="py-2 px-2 font-mono font-bold">{q ? "T" : "F"}</td>
                    <td className={`py-2 px-2 font-mono font-bold ${leftVal ? "text-green-600" : "text-red-500"}`}>
                      {leftVal ? "T" : "F"}
                    </td>
                    <td className={`py-2 px-2 font-mono font-bold ${rightVal ? "text-green-600" : "text-red-500"}`}>
                      {rightVal ? "T" : "F"}
                    </td>
                    <td className="py-2 px-2">
                      {match ? (
                        <span className="text-green-600 font-bold">OK</span>
                      ) : (
                        <span className="text-red-600 font-bold">NG</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-green-600 mt-3 text-center font-bold">
          すべての行で左辺と右辺が一致 → ド・モルガンの法則が成立
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          ド・モルガンの法則
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-slate-400 text-xs mb-1">第1法則 (ANDの否定)</div>
            <KBlock tex="\neg(A \wedge B) = \neg A \vee \neg B" />
            <p className="text-slate-300 text-xs mt-1">
              「AかつBでない」は「Aでない、またはBでない」と同じ
            </p>
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">第2法則 (ORの否定)</div>
            <KBlock tex="\neg(A \vee B) = \neg A \wedge \neg B" />
            <p className="text-slate-300 text-xs mt-1">
              「AまたはBでない」は「Aでない、かつBでない」と同じ
            </p>
          </div>
          <hr className="border-slate-700" />
          <div>
            <div className="text-slate-400 text-xs mb-1">覚え方</div>
            <p className="text-slate-300 text-xs">
              NOTが中に分配されるとき、ANDとORが入れ替わる。
              「かつ」と「または」がスイッチするのがポイント。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
