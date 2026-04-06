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

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

interface TwoPointProblem {
  label: string;
  description: string;
  alpha: number;
  beta: number;
  distanceBetween: number;
  solutionSteps: string[];
  answerTex: string;
}

const TWO_POINT_PROBLEMS: TwoPointProblem[] = [
  {
    label: "練習1: 2地点からの観測",
    description: "地点Aから建物の頂点を見上げた仰角が30°、地点Bから見上げた仰角が45°。A, B間の距離は50mで、A, Bは同一直線上にある。建物の高さhを求めよ。",
    alpha: 30,
    beta: 45,
    distanceBetween: 50,
    solutionSteps: [
      "h = d_A \\tan 30°,\\quad h = d_B \\tan 45°",
      "d_A = d_B + 50 \\quad (\\text{Aのほうが遠い})",
      "d_B \\tan 45° = (d_B + 50) \\tan 30°",
      "d_B = \\frac{50 \\tan 30°}{\\tan 45° - \\tan 30°} \\approx 68.3\\,\\text{m}",
      "h = d_B \\tan 45° \\approx 68.3\\,\\text{m}",
    ],
    answerTex: "h \\approx 68.3\\,\\text{m}",
  },
  {
    label: "練習2: 川の幅の測量",
    description: "川の手前の地点Aから対岸の木の頂点を見上げた仰角が60°、20m後退した地点Bでの仰角が30°。木の高さhを求めよ。",
    alpha: 60,
    beta: 30,
    distanceBetween: 20,
    solutionSteps: [
      "h = d_A \\tan 60°,\\quad h = (d_A + 20) \\tan 30°",
      "d_A \\tan 60° = (d_A + 20) \\tan 30°",
      "d_A(\\tan 60° - \\tan 30°) = 20 \\tan 30°",
      "d_A = \\frac{20 \\tan 30°}{\\tan 60° - \\tan 30°} = 10\\,\\text{m}",
      "h = 10 \\tan 60° = 10\\sqrt{3} \\approx 17.3\\,\\text{m}",
    ],
    answerTex: "h = 10\\sqrt{3} \\approx 17.3\\,\\text{m}",
  },
];

export default function SurveyingViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theta, setTheta] = useState(45);
  const [distance, setDistance] = useState(30);
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);

  const height = distance * Math.tan(toRad(theta));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Layout constants
    const groundY = H - 60;
    const margin = 40;
    const personX = margin + 40;
    const buildingBaseX = W - margin - 60;
    const buildingTopY = 60;

    // Scale building height proportional to tan(theta)
    const maxVisualH = groundY - buildingTopY;
    const normalizedH = Math.min(height / 80, 1);
    const visualH = normalizedH * maxVisualH;
    const buildingTopYActual = groundY - visualH;

    // Ground line
    ctx.beginPath();
    ctx.moveTo(margin, groundY);
    ctx.lineTo(W - margin, groundY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Building
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fillRect(buildingBaseX - 20, buildingTopYActual, 40, visualH);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(buildingBaseX - 20, buildingTopYActual, 40, visualH);

    // Person icon (simple stick figure)
    const personTopY = groundY - 30;
    ctx.beginPath();
    ctx.arc(personX, personTopY - 10, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(personX, personTopY - 4);
    ctx.lineTo(personX, personTopY + 16);
    ctx.moveTo(personX - 8, personTopY + 6);
    ctx.lineTo(personX + 8, personTopY + 6);
    ctx.moveTo(personX, personTopY + 16);
    ctx.lineTo(personX - 6, personTopY + 26);
    ctx.moveTo(personX, personTopY + 16);
    ctx.lineTo(personX + 6, personTopY + 26);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Line of sight (person eye to building top)
    const eyeX = personX;
    const eyeY = personTopY - 4;
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.lineTo(buildingBaseX, buildingTopYActual);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Horizontal reference line from eye
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.lineTo(buildingBaseX, eyeY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle arc (elevation angle)
    const angleStartX = eyeX;
    const angleStartY = eyeY;
    const arcRadius = 40;
    const startAngle = 0;
    const endAngle = -toRad(Math.min(theta, 80));
    ctx.beginPath();
    ctx.arc(angleStartX, angleStartY, arcRadius, startAngle, endAngle, true);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle label
    const labelAngle = endAngle / 2;
    const labelX = angleStartX + (arcRadius + 16) * Math.cos(labelAngle);
    const labelY = angleStartY + (arcRadius + 16) * Math.sin(labelAngle);
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`θ=${theta}°`, labelX, labelY);

    // Height label (h)
    const hLabelX = buildingBaseX + 30;
    const hLabelY = (buildingTopYActual + groundY) / 2;
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`h`, hLabelX, hLabelY);

    // Height arrow
    ctx.beginPath();
    ctx.moveTo(buildingBaseX + 25, groundY - 4);
    ctx.lineTo(buildingBaseX + 25, buildingTopYActual + 4);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(buildingBaseX + 22, buildingTopYActual + 10);
    ctx.lineTo(buildingBaseX + 25, buildingTopYActual + 4);
    ctx.lineTo(buildingBaseX + 28, buildingTopYActual + 10);
    ctx.strokeStyle = "#3b82f6";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(buildingBaseX + 22, groundY - 10);
    ctx.lineTo(buildingBaseX + 25, groundY - 4);
    ctx.lineTo(buildingBaseX + 28, groundY - 10);
    ctx.stroke();

    // Distance label (d)
    const dLabelX = (personX + buildingBaseX) / 2;
    const dLabelY = groundY + 20;
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`d = ${distance}m`, dLabelX, dLabelY);

    // Distance arrow
    ctx.beginPath();
    ctx.moveTo(personX + 10, groundY + 12);
    ctx.lineTo(buildingBaseX - 22, groundY + 12);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(buildingBaseX - 28, groundY + 9);
    ctx.lineTo(buildingBaseX - 22, groundY + 12);
    ctx.lineTo(buildingBaseX - 28, groundY + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(personX + 16, groundY + 9);
    ctx.lineTo(personX + 10, groundY + 12);
    ctx.lineTo(personX + 16, groundY + 15);
    ctx.stroke();

    // "仰角" label near arc
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("仰角", angleStartX + arcRadius + 4, angleStartY + 14);
  }, [theta, distance, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
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
            <span className="font-bold text-red-500">仰角 θ = {theta}°</span>
            <span className="text-slate-400">tan θ = {Math.tan(toRad(theta)).toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            step={1}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-green-500">観測距離 d = {distance}m</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={1}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      {/* Calculation result */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-slate-700 mb-3">計算結果</h3>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center space-y-2">
          <div className="text-sm text-blue-600">
            <K tex={`h = d \\times \\tan\\theta = ${distance} \\times \\tan ${theta}°`} />
          </div>
          <div className="text-2xl font-black text-blue-700">
            <K tex={`h = ${height.toFixed(2)}\\,\\text{m}`} />
          </div>
        </div>
        <div className="mt-3 text-center text-xs text-slate-400">
          <K tex="h = d \\tan\\theta" /> の公式で建物の高さが分かる
        </div>
      </div>

      {/* Key formula */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h4 className="font-bold text-indigo-700 text-sm mb-2">仰角・俯角のポイント</h4>
        <ul className="text-sm text-indigo-600 space-y-2 list-disc list-inside">
          <li><strong>仰角</strong>：水平線より上を見上げる角度</li>
          <li><strong>俯角</strong>：水平線より下を見下ろす角度</li>
          <li>
            建物の高さ：<K tex="h = d \tan\theta" />
          </li>
          <li>
            2地点から観測した場合は連立方程式で解く
          </li>
        </ul>
      </div>

      {/* Two-point observation problems */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-700 mb-2">2地点からの観測問題</h3>
        {TWO_POINT_PROBLEMS.map((prob, idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedProblem(expandedProblem === idx ? null : idx)}
              className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="font-bold text-sm text-slate-700">{prob.label}</div>
              <div className="text-xs text-slate-500 mt-1">{prob.description}</div>
            </button>
            {expandedProblem === idx && (
              <div className="px-4 py-3 space-y-3 bg-white">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">解法ステップ</div>
                {prob.solutionSteps.map((step, si) => (
                  <div key={si} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {si + 1}
                    </span>
                    <div className="text-sm text-slate-600">
                      <K tex={step} />
                    </div>
                  </div>
                ))}
                <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
                  <span className="text-sm font-bold text-green-700">答え：</span>{" "}
                  <K tex={prob.answerTex} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
