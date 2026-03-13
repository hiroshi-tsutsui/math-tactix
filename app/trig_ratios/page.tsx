"use client";

import TetrahedronViz from "../../components/TetrahedronViz";
import ConeShortestPathViz from '../../components/ConeShortestPathViz';
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { GeistSans } from 'geist/font/sans';
import { 
  ChevronLeft, ChevronRight, Zap, Target, 
  RefreshCw, CheckCircle2, HelpCircle, 
  TrendingUp, Circle, Compass, Activity,
  Trophy, Star, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { useTheme } from '../contexts/ThemeContext';

// --- Components ---
const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
    }
  }, [tex]);
  return <span ref={containerRef} className={className} />;
};

// --- Types ---
type QuizItem = { 
  type: 'sin' | 'cos' | 'tan' | 'identity', 
  question: string, 
  options: string[], 
  answer: string 
};

type State = {
  level: number; // 0: Select, 1: Triangle, 2: Unit Circle, 3: Identities, 4: Tactics
  angle: number; 
  step: number; 
  quizIndex: number;
  score: number;
  feedback: 'idle' | 'correct' | 'wrong';
};

type Action = 
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_ANGLE'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'NEXT_QUIZ' }
  | { type: 'SUBMIT_ANSWER'; payload: string }
  | { type: 'RESET_LEVEL' }
  | { type: 'RESET_ALL' };

const FAMOUS_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

const QUIZ_DATA: QuizItem[] = [
  { type: 'sin', question: "\\sin 30^\\circ の値は？", options: ["1/2", "\\sqrt{3}/2", "1", "0"], answer: "1/2" },
  { type: 'cos', question: "\\cos 120^\\circ の値は？", options: ["1/2", "-1/2", "-\\sqrt{3}/2", "0"], answer: "-1/2" },
  { type: 'tan', question: "\\tan 45^\\circ の値は？", options: ["1", "\\sqrt{3}", "1/\\sqrt{3}", "0"], answer: "1" },
  { type: 'identity', question: "\\sin^2 \\theta + \\cos^2 \\theta = ?", options: ["0", "1", "2", "\\tan \\theta"], answer: "1" },
  { type: 'identity', question: "\\tan \\theta = ?", options: ["\\sin/\\cos", "\\cos/\\sin", "1/\\sin", "1/\\cos"], answer: "\\sin/\\cos" },
];

function trigReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LEVEL': return { ...state, level: action.payload, step: 0, angle: 30, quizIndex: 0, score: 0, feedback: 'idle' };
    case 'SET_ANGLE': {
      let angle = action.payload;
      const snapTarget = FAMOUS_ANGLES.find(fa => Math.abs(fa - angle) < 3);
      if (snapTarget !== undefined) angle = snapTarget;
      return { ...state, angle };
    }
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'NEXT_QUIZ': return { ...state, quizIndex: state.quizIndex + 1, feedback: 'idle' };
    case 'SUBMIT_ANSWER': 
      const isCorrect = action.payload === QUIZ_DATA[state.quizIndex].answer;
      return { ...state, score: isCorrect ? state.score + 1 : state.score, feedback: isCorrect ? 'correct' : 'wrong' };
    case 'RESET_LEVEL': return { ...state, step: 0, angle: 30, quizIndex: 0, score: 0, feedback: 'idle' };
    case 'RESET_ALL': return { level: 0, angle: 30, step: 0, quizIndex: 0, score: 0, feedback: 'idle' };
    default: return state;
  }
}


// --- Trigonometric Equations & Inequalities (Level 9) ---
const TrigEqIneqViz = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [funcType, setFuncType] = useState<'sin' | 'cos'>('sin');
    const [compType, setCompType] = useState<'eq' | 'gt' | 'lt'>('eq');
    const [kValue, setKValue] = useState<number>(0.5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width, h = canvas.height;
        const ox = w / 2, oy = h / 2 + 30; // shift down to center the semi-circle
        const r = 140;

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
        for(let i=-200; i<=200; i+=20) {
            ctx.beginPath(); ctx.moveTo(ox + i, 0); ctx.lineTo(ox + i, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, oy + i); ctx.lineTo(w, oy + i); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif';
        ctx.fillText('x', w - 15, oy - 10);
        ctx.fillText('y', ox + 10, 15);

        // Unit Semi-Circle
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ox, oy, r, Math.PI, 0); ctx.stroke();

        // Target Line (k)
        const kPos = funcType === 'sin' ? oy - kValue * r : ox + kValue * r;
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        if (funcType === 'sin') {
            ctx.moveTo(0, kPos); ctx.lineTo(w, kPos);
            ctx.fillStyle = '#ef4444'; ctx.fillText('y = ' + kValue.toFixed(2), 10, kPos - 10);
        } else {
            ctx.moveTo(kPos, 0); ctx.lineTo(kPos, h);
            ctx.fillStyle = '#ef4444'; ctx.fillText('x = ' + kValue.toFixed(2), kPos + 10, 20);
        }
        ctx.stroke(); ctx.setLineDash([]);

        // Highlight valid arc (0 to 180 degrees)
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 6;
        let validPoints = [];
        let firstAngle = null;
        let lastAngle = null;
        
        for (let angle = 0; angle <= 180; angle++) {
            const rad = angle * Math.PI / 180;
            const val = funcType === 'sin' ? Math.sin(rad) : Math.cos(rad);
            let isValid = false;
            if (compType === 'eq' && Math.abs(val - kValue) < 0.01) isValid = true;
            if (compType === 'gt' && val >= kValue) isValid = true;
            if (compType === 'lt' && val <= kValue) isValid = true;
            
            if (isValid) {
                validPoints.push({angle, rad});
                if (firstAngle === null) firstAngle = angle;
                lastAngle = angle;
            } else {
                if (firstAngle !== null && lastAngle !== null) {
                    ctx.beginPath();
                    ctx.arc(ox, oy, r, -lastAngle * Math.PI / 180, -firstAngle * Math.PI / 180, false);
                    ctx.stroke();
                }
                firstAngle = null;
                lastAngle = null;
            }
        }
        if (firstAngle !== null && lastAngle !== null) {
            ctx.beginPath();
            ctx.arc(ox, oy, r, -lastAngle * Math.PI / 180, -firstAngle * Math.PI / 180, false);
            ctx.stroke();
        }

        // Draw Intersections and Labels
        ctx.fillStyle = '#1e293b'; ctx.font = 'bold 16px monospace';
        let tolerance = 0.02;
        for (let angle = 0; angle <= 180; angle++) {
            const rad = angle * Math.PI / 180;
            const val = funcType === 'sin' ? Math.sin(rad) : Math.cos(rad);
            if (Math.abs(val - kValue) <= tolerance) {
                const px = ox + Math.cos(rad) * r;
                const py = oy - Math.sin(rad) * r;
                
                ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([]);
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, py); ctx.stroke();

                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
                
                ctx.fillStyle = '#1e293b';
                ctx.fillText(`${angle}°`, px + 10, py - 10);
            }
        }
    }, [funcType, compType, kValue]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto h-full overflow-y-auto">
            <div className="w-full aspect-square bg-white dark:bg-slate-950 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden relative mb-6 shrink-0">
                <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm font-mono text-sm">
                    {funcType === 'sin' ? '\\sin \\theta' : '\\cos \\theta'} 
                    {compType === 'eq' ? ' = ' : compType === 'gt' ? ' \\ge ' : ' \\le '} 
                    {kValue.toFixed(2)}
                </div>
            </div>

            <div className="space-y-6 w-full pb-10">
                <div className="flex gap-2">
                    <button onClick={() => setFuncType('sin')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${funcType === 'sin' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>sin θ</button>
                    <button onClick={() => setFuncType('cos')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${funcType === 'cos' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>cos θ</button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setCompType('eq')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${compType === 'eq' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>= k</button>
                    <button onClick={() => setCompType('gt')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${compType === 'gt' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>≥ k</button>
                    <button onClick={() => setCompType('lt')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${compType === 'lt' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>≤ k</button>
                </div>
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 font-mono">
                        <span>k = {kValue.toFixed(2)}</span>
                    </div>
                    <input type="range" min="-1" max="1" step="0.05" value={kValue} onChange={e => setKValue(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-3xl border border-purple-100 dark:border-purple-800/50">
                    <p className="font-bold mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> 三角方程式・不等式の解法</p>
                    <p className="text-sm text-purple-900 dark:text-purple-300 leading-relaxed">
                        <MathComponent tex="\sin" /> は <b>y座標</b>、<MathComponent tex="\cos" /> は <b>x座標</b>。<br/>
                        直線を動かして、単位円上の該当する角度の範囲（紫色の弧）を視覚的に確認しましょう。範囲は <MathComponent tex="0^\circ \le \theta \le 180^\circ" /> です。
                    </p>
                </div>
            </div>
        </div>
    );
};



// --- Heron's Formula Viz (Level 12) ---
const HeronsFormulaViz = () => {
  const [a, setA] = useState(13);
  const [b, setB] = useState(14);
  const [c, setC] = useState(15);
  
  const s = (a + b + c) / 2;
  const areaSq = s * (s - a) * (s - b) * (s - c);
  const area = areaSq > 0 ? Math.sqrt(areaSq) : 0;
  
  const isValid = a + b > c && a + c > b && b + c > a;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
      <section className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 relative h-[300px]">
        <div className="w-full max-w-md aspect-video bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-inner overflow-hidden relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <defs>
              <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
                <circle cx="5" cy="5" r="5" fill="#3B82F6" />
              </marker>
            </defs>
            {isValid ? (() => {
               // Draw a triangle given 3 side lengths
               // A at origin (0, 0), B at (c, 0), C at (x, y)
               const scale = 180 / Math.max(a, b, c);
               const visualC = c * scale;
               const visualA = a * scale;
               const visualB = b * scale;
               
               const cosA = (visualB * visualB + visualC * visualC - visualA * visualA) / (2 * visualB * visualC);
               const sinA = Math.sqrt(1 - cosA * cosA);
               
               const cx = visualB * cosA;
               const cy = visualB * sinA;
               
               const offsetX = (400 - visualC) / 2;
               const offsetY = 200 - (200 - cy) / 2; // Center vertically somewhat
               
               return (
                 <g transform={`translate(${offsetX}, ${offsetY})`}>
                    <path d={`M 0 0 L ${visualC} 0 L ${cx} ${-cy} Z`} fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
                    
                    <text x={visualC/2} y={15} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">c = {c}</text>
                    <text x={cx/2 - 10} y={-cy/2} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">b = {b}</text>
                    <text x={(cx + visualC)/2 + 10} y={-cy/2} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">a = {a}</text>
                 </g>
               );
            })() : (
               <text x="200" y="100" fontSize="14" fill="#ef4444" textAnchor="middle">三角形が成立しません</text>
            )}
          </svg>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 a: {a}</label>
              <input type="range" min="1" max="30" value={a} onChange={e => setA(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 b: {b}</label>
              <input type="range" min="1" max="30" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 c: {c}</label>
              <input type="range" min="1" max="30" value={c} onChange={e => setC(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-blue-500" /> ヘロンの公式 (Heron's Formula)</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">s = (a + b + c) / 2</span>
                <span className="font-bold text-blue-600">s = {s}</span>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 mb-1">S = √[s(s-a)(s-b)(s-c)]</span>
                {isValid ? (
                  <span className="font-bold text-blue-600">S = √[{s}({s-a})({s-b})({s-c})] = {area % 1 === 0 ? area : area.toFixed(2)}</span>
                ) : (
                  <span className="font-bold text-red-500">三角形不成立</span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              三辺の長さから直接面積を求める公式です。「半周」である <MathComponent tex="s" /> を使うことで、シンプルに計算できます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};


// --- Angle Bisector Viz (Level 11) ---

const SurveyingViz = () => {
  const [distance, setDistance] = useState(100);
  const [alpha, setAlpha] = useState(30);
  const [beta, setBeta] = useState(45);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const safeBeta = Math.max(alpha + 5, beta);

    const radA = (alpha * Math.PI) / 180;
    const radB = (safeBeta * Math.PI) / 180;

    const tanA = Math.tan(radA);
    const tanB = Math.tan(radB);
    const h = distance / ((1 / tanA) - (1 / tanB));

    const scale = Math.min((width * 0.7) / (distance + h / tanB), (height * 0.7) / h);
    const originX = 50;
    const originY = height - 50;

    const pxA = originX;
    const pxB = originX + distance * scale;
    const pxTower = pxB + (h / tanB) * scale;
    const pyTop = originY - h * scale;

    ctx.beginPath();
    ctx.moveTo(10, originY);
    ctx.lineTo(width - 10, originY);
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pxTower, originY);
    ctx.lineTo(pxTower, pyTop);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pxA, originY);
    ctx.lineTo(pxTower, pyTop);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pxB, originY);
    ctx.lineTo(pxTower, pyTop);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f3f4f6';
    ctx.font = '14px sans-serif';
    ctx.fillText(`A (${alpha}°)`, pxA - 10, originY + 20);
    ctx.fillText(`B (${safeBeta}°)`, pxB - 10, originY + 20);
    ctx.fillText(`Tower (h = ${h.toFixed(1)}m)`, pxTower - 40, pyTop - 10);
    ctx.fillText(`d = ${distance}m`, (pxA + pxB)/2 - 20, originY + 20);
  }, [distance, alpha, beta]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="bg-gray-900 rounded-lg w-full max-w-2xl"
        />
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-2 flex justify-between">
              <span>距離 $d$ (AとBの間)</span>
              <span className="text-blue-400 font-mono">{distance} m</span>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="accent-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-2 flex justify-between">
              <span>仰角 $\alpha$ (地点A)</span>
              <span className="text-emerald-400 font-mono">{alpha}°</span>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="accent-emerald-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-2 flex justify-between">
              <span>仰角 $\beta$ (地点B)</span>
              <span className="text-purple-400 font-mono">{beta}°</span>
            </label>
            <input
              type="range"
              min="15"
              max="80"
              step="1"
              value={beta}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBeta(Math.max(val, alpha + 5));
              }}
              className="accent-purple-500"
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg text-gray-300">
        <h3 className="text-lg font-bold text-white mb-4">測量の原理：高さを求める</h3>
        <p className="mb-4">
          地点Aから塔の先端を見上げた角度（仰角）が $\alpha$、そこから塔に向かって $d$ メートル進んだ地点Bでの仰角が $\beta$ のとき、塔の高さ $h$ は以下の関係から求まります。
        </p>
        <div className="bg-gray-900 p-4 rounded-lg font-mono text-center text-blue-300 mb-4 overflow-x-auto">
          <MathComponent tex="\\frac{h}{\\tan \\alpha} - \\frac{h}{\\tan \\beta} = d" />
        </div>
        <p className="mb-4 text-sm text-gray-400">
          ※ 塔の根元までの距離を $x$ とすると、$h = x \tan \beta$、そして $h = (x + d) \tan \alpha$ となります。ここから $x$ を消去すると上の式が導かれます。
        </p>
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800">
          <p className="text-blue-200">
            <strong>公式として覚えるのではなく、図を描くことが重要です。</strong> スライダーを動かして、角度や距離が変わると塔の高さがどう変化するかを視覚的に確認しましょう。
          </p>
        </div>
      </div>
    </div>
  );
};

const AngleBisectorViz = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sideB, setSideB] = useState(6); // AC
    const [sideC, setSideC] = useState(4); // AB
    const [angleA, setAngleA] = useState(60);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const ox = w / 2 - 20;
        const oy = h / 2 + 80;
        const scale = 20;

        const bLength = sideB * scale;
        const cLength = sideC * scale;
        const aRad = angleA * Math.PI / 180;
        const halfRad = aRad / 2;

        // A is at origin
        const ax = ox;
        const ay = oy;

        // B is on positive x-axis (wait, let's put C on x-axis and B rotated, or vice versa)
        // Let's put B on x-axis: length c
        const bx = ax + cLength;
        const by = ay;

        // C is rotated by angleA
        const cx = ax + bLength * Math.cos(aRad);
        const cy = ay - bLength * Math.sin(aRad);

        // Bisector AD length x: x = (2bc cos(A/2)) / (b+c)
        const xLen = (2 * sideB * sideC * Math.cos(halfRad)) / (sideB + sideC);
        const adLength = xLen * scale;
        const dx = ax + adLength * Math.cos(halfRad);
        const dy = ay - adLength * Math.sin(halfRad);

        // Areas (just for display if needed)
        const sABD = 0.5 * sideC * xLen * Math.sin(halfRad);
        const sACD = 0.5 * sideB * xLen * Math.sin(halfRad);
        const sABC = 0.5 * sideB * sideC * Math.sin(aRad);

        // Draw Triangle
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(dx, dy); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); ctx.lineTo(dx, dy); ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.closePath(); ctx.stroke();

        // Bisector AD
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); ctx.stroke();

        // Points
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(ax, ay, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI*2); ctx.fill();

        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('A', ax - 20, ay + 10);
        ctx.fillText('B', bx + 10, by + 10);
        ctx.fillText('C', cx - 10, cy - 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('D', dx + 10, dy - 5);

        // Angles
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ax, ay, 30, 0, -halfRad, true); ctx.stroke();
        ctx.beginPath(); ctx.arc(ax, ay, 35, -halfRad, -aRad, true); ctx.stroke();

    }, [sideB, sideC, angleA]);

    const halfAngle = angleA / 2;
    const xLen = (2 * sideB * sideC * Math.cos(halfAngle * Math.PI / 180)) / (sideB + sideC);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto h-full overflow-y-auto">
            <div className="w-full aspect-square bg-white dark:bg-slate-950 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden relative mb-6 shrink-0">
                <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm font-mono text-sm">
                    AD = {xLen.toFixed(2)}
                </div>
            </div>

            <div className="space-y-6 w-full pb-10">
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 font-mono">
                        <span>b (AC) = {sideB}</span>
                    </div>
                    <input type="range" min="2" max="10" step="1" value={sideB} onChange={e => setSideB(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 font-mono">
                        <span>c (AB) = {sideC}</span>
                    </div>
                    <input type="range" min="2" max="10" step="1" value={sideC} onChange={e => setSideC(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 font-mono">
                        <span>∠A = {angleA}°</span>
                    </div>
                    <input type="range" min="30" max="150" step="30" value={angleA} onChange={e => setAngleA(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                    <p className="font-bold mb-2 flex items-center gap-2">角の二等分線と面積比</p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed">
                        面積の等式： <b>△ABC = △ABD + △ACD</b> を用いて、線分ADの長さ <MathComponent tex="x" /> を求めます。<br/><br/>
                        <MathComponent tex="\frac{1}{2}bc \sin A = \frac{1}{2}cx \sin \frac{A}{2} + \frac{1}{2}bx \sin \frac{A}{2}" />
                    </p>
                </div>
            </div>
        </div>
    );
};



// --- Cyclic Quadrilateral Viz (Level 13) ---
const CyclicQuadrilateralViz = () => {
  const [angleA, setAngleA] = React.useState(210);
  const [angleB, setAngleB] = React.useState(150);
  const [angleC, setAngleC] = React.useState(30);
  const [angleD, setAngleD] = React.useState(330);
  
  const R = 100;
  const cx = 150;
  const cy = 150;

  const toRad = (deg: number) => deg * Math.PI / 180;
  
  const getPoint = (ang: number) => ({
    x: cx + R * Math.cos(toRad(ang)),
    y: cy - R * Math.sin(toRad(ang))
  });

  const ptA = getPoint(angleA);
  const ptB = getPoint(angleB);
  const ptC = getPoint(angleC);
  const ptD = getPoint(angleD);

  const dist = (p1: any, p2: any) => Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
  const a = dist(ptA, ptB);
  const b = dist(ptB, ptC);
  const c = dist(ptC, ptD);
  const d = dist(ptD, ptA);
  const diagAC = dist(ptA, ptC);

  const calcAngle = (p1: any, p2: any, p3: any) => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x**2 + v1.y**2);
    const mag2 = Math.sqrt(v2.x**2 + v2.y**2);
    const cosTheta = dot / (mag1 * mag2);
    return Math.acos(cosTheta) * 180 / Math.PI;
  };

  const intB = calcAngle(ptA, ptB, ptC);
  const intD = calcAngle(ptC, ptD, ptA);

  const formatSide = (val: number) => (val/50).toFixed(1);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 bg-white text-gray-800 rounded-lg shadow w-full max-w-4xl mx-auto space-y-6 md:space-y-0 md:space-x-8">
      
      <div className="relative border border-gray-300 bg-slate-50 w-[300px] h-[300px] flex-shrink-0">
        <svg width="300" height="300">
          <circle cx={cx} cy={cy} r={R} stroke="#cbd5e1" strokeWidth="2" fill="none" />
          
          <polygon points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptC.x},${ptC.y} ${ptD.x},${ptD.y}`} fill="#bfdbfe" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
          
          <line x1={ptA.x} y1={ptA.y} x2={ptC.x} y2={ptC.y} stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
          
          <circle cx={ptA.x} cy={ptA.y} r="5" fill="#1e40af" />
          <text x={ptA.x - 15} y={ptA.y - 10} fontSize="14" fontWeight="bold">A</text>
          
          <circle cx={ptB.x} cy={ptB.y} r="5" fill="#1e40af" />
          <text x={ptB.x - 15} y={ptB.y + 20} fontSize="14" fontWeight="bold">B</text>
          
          <circle cx={ptC.x} cy={ptC.y} r="5" fill="#1e40af" />
          <text x={ptC.x + 10} y={ptC.y + 15} fontSize="14" fontWeight="bold">C</text>
          
          <circle cx={ptD.x} cy={ptD.y} r="5" fill="#1e40af" />
          <text x={ptD.x + 10} y={ptD.y - 10} fontSize="14" fontWeight="bold">D</text>

          <text x={ptB.x + (cx - ptB.x)*0.2} y={ptB.y + (cy - ptB.y)*0.2} fontSize="12" fill="#d97706">{intB.toFixed(1)}°</text>
          <text x={ptD.x + (cx - ptD.x)*0.2} y={ptD.y + (cy - ptD.y)*0.2} fontSize="12" fill="#d97706">{intD.toFixed(1)}°</text>

          <text x={(ptA.x+ptB.x)/2 - 15} y={(ptA.y+ptB.y)/2} fontSize="12" fill="#059669">a={formatSide(a)}</text>
          <text x={(ptB.x+ptC.x)/2 + 5} y={(ptB.y+ptC.y)/2 + 15} fontSize="12" fill="#059669">b={formatSide(b)}</text>
          <text x={(ptC.x+ptD.x)/2 + 10} y={(ptC.y+ptD.y)/2 - 5} fontSize="12" fill="#059669">c={formatSide(c)}</text>
          <text x={(ptD.x+ptA.x)/2 - 15} y={(ptD.y+ptA.y)/2 - 10} fontSize="12" fill="#059669">d={formatSide(d)}</text>
        </svg>

        <div className="absolute top-2 left-2 flex flex-col space-y-1 bg-white/80 p-1 rounded text-xs">
          <label>A: <input type="range" min="180" max="270" value={angleA} onChange={(e)=>setAngleA(Number(e.target.value))} className="w-16"/></label>
          <label>B: <input type="range" min="90" max="179" value={angleB} onChange={(e)=>setAngleB(Number(e.target.value))} className="w-16"/></label>
          <label>C: <input type="range" min="0" max="89" value={angleC} onChange={(e)=>setAngleC(Number(e.target.value))} className="w-16"/></label>
          <label>D: <input type="range" min="271" max="359" value={angleD} onChange={(e)=>setAngleD(Number(e.target.value))} className="w-16"/></label>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h4 className="font-bold text-lg mb-2 text-blue-700">円に内接する四角形</h4>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4 text-sm">
          <p className="font-semibold text-orange-800 mb-1">向かい合う角の和は180°</p>
          <p>∠B + ∠D = {intB.toFixed(1)}° + {intD.toFixed(1)}° = <strong>{(intB + intD).toFixed(1)}°</strong></p>
          <p className="mt-1">これにより、<MathComponent tex="\cos D = \cos(180^\circ - B) = -\cos B" /></p>
          <p>面積では、<MathComponent tex="\sin D = \sin(180^\circ - B) = \sin B" /></p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-700 mb-1">対角線 AC を2通りで表す（余弦定理）</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>△ABC: <MathComponent tex="AC^2 = a^2 + b^2 - 2ab \cos B" /></li>
            <li>△ADC: <MathComponent tex="AC^2 = c^2 + d^2 - 2cd \cos D" /></li>
          </ul>
          <p className="text-blue-600 bg-blue-50 p-2 rounded">
            <MathComponent tex="a^2 + b^2 - 2ab \cos B = c^2 + d^2 + 2cd \cos B" />
          </p>
          <p className="mt-2 text-xs text-gray-500">この等式を解くことで cos B を求め、四角形の面積や対角線の長さを計算します。</p>
        </div>
      </div>
    </div>
  );
};

export default function TrigPage() {

  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const { resolvedTheme } = useTheme();
  
  const [symMode, setSymMode] = useState<'supp' | 'comp'>('supp');
  const [state, dispatch] = useReducer(trigReducer, { 
    level: 0,
    angle: 30, 
    step: 0,
    quizIndex: 0,
    score: 0,
    feedback: 'idle'
  });
  const { level, angle, step } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Visual Engine (Shared Logic) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width, h = canvas.height;
    const ox = w / 2, oy = h / 2;
    // Level 1 uses larger triangle, Level 2/3 uses unit circle, Level 4 uses circumcircle
    const radius = level === 1 ? 160 : level === 4 ? 140 : 120; 

    const isDark = resolvedTheme === 'dark';
    const colors = {
      grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      circle: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      axis: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
      snapFill: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 122, 255, 0.05)',
      primary: isDark ? '#60a5fa' : '#007AFF', // Blue-400 vs Blue-500
      secondary: isDark ? '#f87171' : '#FF3B30', // Red-400 vs Red-500
      text: isDark ? '#ffffff' : '#1D1D1F',
      line: isDark ? '#ffffff' : '#1D1D1F',
      hypotenuse: '#10B981', // Green
      sineRule: '#F59E0B' // Amber
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Grid
      ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
      for(let i=-200; i<=200; i+=50) {
        ctx.beginPath(); ctx.moveTo(ox + i, 0); ctx.lineTo(ox + i, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, oy + i); ctx.lineTo(w, oy + i); ctx.stroke();
      }

      // Axes
      if (level !== 4) {
        ctx.strokeStyle = colors.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
      }

      const rad = (angle * Math.PI) / 180;
      
      // Determine coordinates
      // Level 1: Triangle in 1st quadrant only (fixed hypotenuse visual)
      // Level 2/3: Unit Circle (full rotation)
      const targetX = ox + Math.cos(rad) * radius;
      const targetY = oy - Math.sin(rad) * radius; // Y is inverted in canvas

      if (level === 2 || level === 3) {
          // Unit Circle
          ctx.strokeStyle = colors.circle; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ox, oy, radius, 0, Math.PI * 2); ctx.stroke();
      }

      // Draw Triangle Components
      if (level === 1 || level === 2 || level === 3) {
        // Hypotenuse (Green)
        ctx.strokeStyle = colors.hypotenuse; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, targetY); ctx.stroke();

        // Adjacent / Cos (Blue)
        ctx.strokeStyle = colors.primary; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, oy); ctx.stroke();

        // Opposite / Sin (Red)
        ctx.strokeStyle = colors.secondary; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(targetX, oy); ctx.lineTo(targetX, targetY); ctx.stroke();
        
        // Point
        ctx.fillStyle = colors.line;
        ctx.beginPath(); ctx.arc(targetX, targetY, 6, 0, Math.PI * 2); ctx.fill();

        // Angle Arc
        ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ox, oy, 30, 0, -rad, true); ctx.stroke();
      }

      // Level 3 Specific: Identity Visualization (Pythagoras)
      if (level === 3) {
          // Highlight the right angle
          const size = 15;
          const signX = Math.cos(rad) >= 0 ? 1 : -1;
          const signY = Math.sin(rad) >= 0 ? 1 : -1;
          
          ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(targetX - (size * signX), oy);
          ctx.lineTo(targetX - (size * signX), oy - (size * signY));
          ctx.lineTo(targetX, oy - (size * signY));
          ctx.stroke();
      }
      
      // Level 4: Sine Rule Visualization
      if (level === 4) {
          // Circumcircle
          ctx.strokeStyle = colors.circle; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ox, oy, radius, 0, Math.PI * 2); ctx.stroke();
          
          // Fixed points B and C
          const bAngle = 210 * Math.PI / 180;
          const cAngle = 330 * Math.PI / 180;
          const bx = ox + Math.cos(bAngle) * radius;
          const by = oy - Math.sin(bAngle) * radius;
          const cx = ox + Math.cos(cAngle) * radius;
          const cy = oy - Math.sin(cAngle) * radius;
          
          // Moving point A (controlled by angle slider, mapped to top arc)
          // Map slider 0-180 to top arc angles (approx 30 to 150 visual)
          const aAngleVisual = (90 + (angle - 90)) * Math.PI / 180; 
          // Actually, let's just use angle as the vertex angle A directly?
          // No, Sine rule says a/sinA = 2R. Side a (BC) is fixed. So angle A should be constant on the arc?
          // Wait, if BC is fixed, angle A is constant on the major arc.
          // Let's make the visual interactive: User changes angle A by moving vertex A?
          // Or user changes side 'a' by moving B and C?
          
          // Let's stick to the log: "Visual proves that the ratio... is constant"
          // Let's fix side a (BC) and move A on the circle -> Angle A stays same?
          // No, let's fix the CIRCLE (R) and change Angle A. Then side 'a' must change length.
          
          // Mode: Fix R (radius). User changes Angle A. Calculate side a length.
          // Visual: A is top (90 deg position relative to center? No, let's put A at top).
          // B and C move symmetrically at bottom to subtend Angle A at circumference.
          // Center angle BOC = 2A.
          
          const angleRad = angle * Math.PI / 180;
          const centerAngle = 2 * angleRad; // Angle at center subtended by BC
          
          // Place A at top (90 deg visual, -90 in canvas coords?)
          // Let's place A at (0, -R) in canvas coords relative to center
          const ax = ox;
          const ay = oy - radius;
          
          // Place B and C symmetrically around bottom
          // Arc length from A to B? No.
          // Angle BOC = 2A.
          // So B is at angle (270 - A) and C is at (270 + A) in standard polar coords?
          // Let's verify: Triangle ABC. Angle at A is A.
          // If B and C are at 270-A and 270+A, the arc BC is 2A.
          // The angle subtended by arc BC at the circumference (point A) is half the center angle (2A/2 = A). Correct!
          
          // Standard polar: 0 is right, 90 is bottom (canvas), 270 is top.
          // Let's use: A at 270 (top).
          // B at 90 - A. C at 90 + A. (Bottom area).
          
          // Wait, if A=60, 2A=120. B at 90-60=30? C at 90+60=150?
          // Arc BC is 120. Angle at A (270) is... 
          // Angle subtended by arc BC at A?
          // This geometry is tricky to get right instantly.
          
          // Alternative: Fix A at top. Fix B at bottom left. Move C?
          // Let's use the "Fix R, change A" approach.
          
          // A at top (270 deg / -PI/2)
          const Ax = ox;
          const Ay = oy - radius;
          
          // We want angle BAC = angle.
          // Let's place B and C symmetrically across the vertical axis.
          // The angle subtended by chord BC at center is 2 * angle.
          // So angle(COB) = 2 * angle.
          // Since symmetric, angle(vertical, OC) = angle.
          // So C is at (90 - angle) from standard? No.
          // C is at angle 'angle' from the vertical bottom?
          // Vertical bottom is 90 deg (PI/2).
          // C at 90 - angle. B at 90 + angle.
          // Arc BC = 2*angle. Angle at circumference A = angle.
          // BUT: If angle > 90, 2*angle > 180.
          
          // Let's check coordinates.
          // C: angle from vertical down is 'angle'.
          // Cx = ox + R * sin(angle)
          // Cy = oy + R * cos(angle)
          // Bx = ox - R * sin(angle)
          // By = oy + R * cos(angle)
          
          // Draw Triangle ABC
          ctx.strokeStyle = colors.text; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(Ax, Ay); // A
          ctx.lineTo(ox - radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad)); // B
          ctx.lineTo(ox + radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad)); // C
          ctx.closePath();
          ctx.stroke();
          
          // Draw Diameter (Vertical) for reference?
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = colors.grid;
          ctx.beginPath(); ctx.moveTo(ox, oy-radius); ctx.lineTo(ox, oy+radius); ctx.stroke();
          ctx.setLineDash([]);
          
          // Highlight Side 'a' (BC)
          ctx.strokeStyle = colors.sineRule; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ox - radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
          ctx.lineTo(ox + radius * Math.sin(angleRad), oy + radius * Math.cos(angleRad));
          ctx.stroke();
          
          // Label A, B, C
          ctx.fillStyle = colors.text; ctx.font = "bold 16px Geist Sans";
          ctx.fillText("A", Ax, Ay - 15);
          ctx.fillText("B", ox - radius * Math.sin(angleRad) - 20, oy + radius * Math.cos(angleRad) + 20);
          ctx.fillText("C", ox + radius * Math.sin(angleRad) + 10, oy + radius * Math.cos(angleRad) + 20);
          
          // Label R
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(Ax, Ay); ctx.strokeStyle = colors.grid; ctx.stroke();
          ctx.fillStyle = colors.grid; ctx.font = "12px Geist Sans";
          ctx.fillText("R", ox + 5, oy - radius/2);
      }

      // Level 5: Cosine Rule Visualization
      if (level === 5) {
          const sideB = 100; // Visual length (scaled)
          const sideC = 140; // Visual length (scaled)
          
          // Position A slightly left-bottom
          const Ax = ox - 20;
          const Ay = oy + 50;
          
          // B is fixed horizontal to the right
          const Bx = Ax + sideC;
          const By = Ay;
          
          // C rotates around A based on angle
          // Canvas Y is inverted, so subtraction for Y
          const Cx = Ax + sideB * Math.cos(angle * Math.PI / 180);
          const Cy = Ay - sideB * Math.sin(angle * Math.PI / 180);
          
          // Draw Triangle
          ctx.lineWidth = 3;
          
          // Side c (AB) - Blue
          ctx.strokeStyle = colors.primary;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.stroke();
          
          // Side b (AC) - Green
          ctx.strokeStyle = colors.hypotenuse;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Cy); ctx.stroke();
          
          // Side a (BC) - Red
          ctx.strokeStyle = colors.secondary;
          ctx.beginPath(); ctx.moveTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.stroke();
          
          // Points
          ctx.fillStyle = colors.text;
          ctx.beginPath(); ctx.arc(Ax, Ay, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(Bx, By, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(Cx, Cy, 4, 0, Math.PI*2); ctx.fill();
          
          // Labels
          ctx.font = "bold 16px Geist Sans";
          ctx.fillText("A", Ax - 20, Ay + 10);
          ctx.fillText("B", Bx + 10, By + 10);
          ctx.fillText("C", Cx, Cy - 15);
          
          // Side Labels
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.primary;
          ctx.fillText("c=14", Ax + sideC/2, Ay + 20); // c = 14 (scaled 10)
          
          ctx.fillStyle = colors.hypotenuse;
          // Midpoint of AC
          ctx.fillText("b=10", (Ax+Cx)/2 - 20, (Ay+Cy)/2 - 10);
          
          ctx.fillStyle = colors.secondary;
          // Midpoint of BC
          ctx.fillText("a=?", (Bx+Cx)/2 + 10, (By+Cy)/2);

          // Angle Arc
          ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(Ax, Ay, 30, 0, -(angle * Math.PI / 180), true); ctx.stroke();
      }

      // Level 6: Triangle Area Visualization
      if (level === 6) {
          const sideB = 100; // Side AC (visual)
          const sideC = 140; // Side AB (visual)
          
          // Position A
          const Ax = ox - 50;
          const Ay = oy + 50;
          
          // Position B (Horizontal from A)
          const Bx = Ax + sideC;
          const By = Ay;
          
          // Position C (Rotated by angle A)
          const Cx = Ax + sideB * Math.cos(angle * Math.PI / 180);
          const Cy = Ay - sideB * Math.sin(angle * Math.PI / 180);
          
          // Height h (Perpendicular from C to AB extended)
          // Since AB is horizontal, h is just vertical distance
          const h = Ay - Cy; // Canvas Y is inverted
          const Hx = Cx;
          const Hy = Ay;
          
          // Fill Area
          ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
          ctx.beginPath();
          ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.closePath();
          ctx.fill();

          // Draw Height Line (Dashed)
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = colors.secondary; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(Cx, Cy); ctx.lineTo(Hx, Hy); ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw Triangle Sides
          ctx.lineWidth = 3;
          
          // Side c (AB) - Blue (Base)
          ctx.strokeStyle = colors.primary;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.stroke();
          
          // Side b (AC) - Green
          ctx.strokeStyle = colors.hypotenuse;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Cy); ctx.stroke();
          
          // Side a (BC) - Grey (Just connection)
          ctx.strokeStyle = colors.line; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.stroke();
          
          // Points
          ctx.fillStyle = colors.text;
          ctx.beginPath(); ctx.arc(Ax, Ay, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(Bx, By, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(Cx, Cy, 4, 0, Math.PI*2); ctx.fill();
          
          // Labels
          ctx.font = "bold 16px Geist Sans";
          ctx.fillText("A", Ax - 20, Ay + 10);
          ctx.fillText("B", Bx + 10, By + 10);
          ctx.fillText("C", Cx, Cy - 10);
          
          // Height Label
          ctx.fillStyle = colors.secondary;
          ctx.fillText("h", Hx + 5, (Cy + Hy) / 2);

          // Side Labels
          ctx.fillStyle = colors.primary;
          ctx.fillText("c", (Ax+Bx)/2, Ay + 20);
          
          ctx.fillStyle = colors.hypotenuse;
          ctx.fillText("b", (Ax+Cx)/2 - 15, (Ay+Cy)/2 - 5);
          
          // Angle Arc
          ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(Ax, Ay, 30, 0, -(angle * Math.PI / 180), true); ctx.stroke();
      }

      // Level 7: Inradius Visualization (Continued)
      if (level === 7) {
          const sideB = 100; // AC (visual scale)
          const sideC = 140; // AB (visual scale)
          
          // Position A (Origin for local calc)
          const Ax = ox - 50;
          const Ay = oy + 60; // Lower it a bit
          
          // B (Horizontal)
          const Bx = Ax + sideC;
          const By = Ay;
          
          // C (Rotated)
          // Canvas Y is inverted. y decreases upwards.
          const rad = angle * Math.PI / 180;
          const Cx = Ax + sideB * Math.cos(rad);
          const Cy = Ay - sideB * Math.sin(rad); 
          
          // Calculate Side 'a' (BC) length
          const sideA_len = Math.sqrt(sideB**2 + sideC**2 - 2 * sideB * sideC * Math.cos(rad));
          
          // Incenter Calculation
          // I = (aA + bB + cC) / (a+b+c)
          const P = sideA_len + sideB + sideC;
          const Ix = (sideA_len * Ax + sideB * Bx + sideC * Cx) / P;
          const Iy = (sideA_len * Ay + sideB * By + sideC * Cy) / P;
          
          // Inradius r (Visual)
          // Distance from I to AB (horizontal line y=Ay)
          // Since Cy < Ay (upwards), Iy < Ay. Distance is Ay - Iy.
          const r_visual = Math.abs(Ay - Iy);
          
          // Draw Incircle
          ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)';
          ctx.beginPath(); ctx.arc(Ix, Iy, r_visual, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = colors.sineRule; ctx.lineWidth = 2; // Amber
          ctx.beginPath(); ctx.arc(Ix, Iy, r_visual, 0, Math.PI*2); ctx.stroke();
          
          // Draw Radius to Side c (Vertical)
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = colors.text; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(Ix, Iy); ctx.lineTo(Ix, Ay); ctx.stroke();
          ctx.setLineDash([]);
          
          // Label r
          ctx.fillStyle = colors.sineRule; ctx.font = "bold 12px Geist Sans";
          ctx.fillText("r", Ix + 5, (Iy + Ay)/2);

          // Draw Triangle
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.strokeStyle = colors.primary;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.stroke(); // c
          
          ctx.strokeStyle = colors.hypotenuse;
          ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Cy); ctx.stroke(); // b
          
          ctx.strokeStyle = colors.secondary;
          ctx.beginPath(); ctx.moveTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.stroke(); // a
          
          // Labels
          ctx.font = "bold 16px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText("A", Ax - 20, Ay + 10);
          ctx.fillText("B", Bx + 10, By + 10);
          ctx.fillText("C", Cx, Cy - 15);
          
          // Side Labels
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.primary; ctx.fillText("c=14", (Ax+Bx)/2, Ay + 20);
          ctx.fillStyle = colors.hypotenuse; ctx.fillText("b=10", (Ax+Cx)/2 - 25, (Ay+Cy)/2 - 5);
          ctx.fillStyle = colors.secondary; ctx.fillText("a=?", (Bx+Cx)/2 + 10, (By+Cy)/2);

          // Angle Arc
          ctx.strokeStyle = colors.text; ctx.lineWidth = 1; ctx.setLineDash([]);
          ctx.beginPath(); ctx.arc(Ax, Ay, 25, 0, -rad, true); ctx.stroke();
      }

      if (level === 8) {
          ctx.strokeStyle = colors.circle; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ox, oy, radius, 0, Math.PI * 2); ctx.stroke();
          
          ctx.strokeStyle = colors.axis; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
          
          const rad = angle * Math.PI / 180;
          const targetX = ox + Math.cos(rad) * radius;
          const targetY = oy - Math.sin(rad) * radius;
          
          const targetAngle = symMode === 'supp' ? 180 - angle : 90 - angle;
          const radSym = targetAngle * Math.PI / 180;
          const targetXSym = ox + Math.cos(radSym) * radius;
          const targetYSym = oy - Math.sin(radSym) * radius;

          // y=x line for 90-theta
          if (symMode === 'comp') {
             ctx.strokeStyle = colors.grid; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
             ctx.beginPath(); ctx.moveTo(ox - radius, oy + radius); ctx.lineTo(ox + radius, oy - radius); ctx.stroke();
             ctx.setLineDash([]);
          }

          ctx.fillStyle = colors.snapFill;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, targetY); ctx.lineTo(targetX, oy); ctx.closePath(); ctx.fill();
          
          ctx.fillStyle = isDark ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.1)';
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetXSym, targetYSym); ctx.lineTo(targetXSym, oy); ctx.closePath(); ctx.fill();
          
          ctx.strokeStyle = colors.primary; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetX, targetY); ctx.stroke();
          ctx.strokeStyle = colors.secondary; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(targetXSym, targetYSym); ctx.stroke();
          
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = colors.hypotenuse; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(targetX, targetY); ctx.lineTo(targetX, oy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(targetXSym, targetYSym); ctx.lineTo(targetXSym, oy); ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.fillStyle = colors.text; ctx.font = "bold 14px Geist Sans";
          ctx.fillText("P", targetX + 5, targetY - 5);
          ctx.fillText("Q", targetXSym + (symMode==='supp'?-20:5), targetYSym - 5);
          
          ctx.strokeStyle = colors.primary; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ox, oy, 20, 0, -rad, true); ctx.stroke();
          ctx.strokeStyle = colors.secondary; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ox, oy, 30, 0, -radSym, true); ctx.stroke();
      }
    };
    render();
  }, [angle, level, resolvedTheme, symMode]);

  // --- Identity Logic (Level 3) ---
  const sinVal = Math.sin((angle * Math.PI) / 180).toFixed(3);
  const cosVal = Math.cos((angle * Math.PI) / 180).toFixed(3);
  const sinSq = (Math.sin((angle * Math.PI) / 180) ** 2).toFixed(3);
  const cosSq = (Math.cos((angle * Math.PI) / 180) ** 2).toFixed(3);
  
  // --- Sine Rule Logic (Level 4) ---
  // R = 1 (visually scaled). a = 2R sin A.
  // We display values assuming R=10.
  const radiusVal = 10;
  const sideA = (2 * radiusVal * Math.sin(angle * Math.PI / 180)).toFixed(1);
  const diameter = (2 * radiusVal).toFixed(0);
  const ratioCalc = (Number(sideA) / Math.sin(angle * Math.PI / 180)).toFixed(1);

  // --- Cosine Rule Logic (Level 5) ---
  const sideB_val = 10;
  const sideC_val = 14;
  const radA = angle * Math.PI / 180;
  const cosA = Math.cos(radA);
  const aSquared = (sideB_val**2 + sideC_val**2 - 2 * sideB_val * sideC_val * cosA).toFixed(1);
  const sideA_val = Math.sqrt(Number(aSquared)).toFixed(2);

  // --- Area Logic (Level 6 & 7) ---
  const area_b = 10;
  const area_c = 14;
  const area_sinA = Math.sin(angle * Math.PI / 180);
  const area_h = (area_b * area_sinA).toFixed(2);
  const area_S = (0.5 * area_b * area_c * area_sinA).toFixed(1);

  // --- Inradius Logic (Level 7) ---
  // Re-use logic from Level 5/6:
  // Side a from Cosine Rule
  const in_radA = angle * Math.PI / 180;
  const in_a = Math.sqrt(area_b**2 + area_c**2 - 2 * area_b * area_c * Math.cos(in_radA));
  const in_s = (area_b + area_c + in_a) / 2; // semi-perimeter
  // Area = sqrt(s(s-a)(s-b)(s-c)) -- Hero's formula check? No, just stick to 1/2bc sinA
  const in_r = (Number(area_S) / in_s).toFixed(2);
  const in_perimeter = (area_b + area_c + in_a).toFixed(1);

  return (
    <div className={`h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col ${GeistSans.className} overflow-hidden`}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
            {level > 0 && (
                <button onClick={() => dispatch({type: 'RESET_ALL'})} className="p-2 -ml-2 text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
                {level === 0 ? "MATHEMATICS I" : `LEVEL ${level}`}
            </div>
        </div>
        <div className="font-bold text-sm">
            {level === 0 ? "三角比 (Trigonometry)" : 
             level === 1 ? "直角三角形 (Right Triangle)" : 
             level === 2 ? "単位円 (Unit Circle)" : 
             level === 3 ? "相互関係 (Identities)" :
             level === 4 ? "正弦定理 (Sine Rule)" :
             level === 5 ? "余弦定理 (Cosine Rule)" :
             level === 6 ? "三角形の面積 (Triangle Area)" :
             level === 7 ? "内接円の半径 (Inradius)" :
             level === 8 ? "対称性と公式 (Symmetry)" : 
             level === 9 ? "方程式と不等式 (Eq & Ineq)" :
             level === 10 ? "角の二等分線 (Angle Bisector)" :
             level === 11 ? "空間図形・測量 (Surveying)" :
             level === 12 ? "ヘロンの公式 (Heron's Formula)" :
             level === 13 ? "円に内接する四角形 (Cyclic Quadrilateral)" :
             level === 14 ? "円錐の最短経路 (Cone Shortest Path)" :
             level === 15 ? "正四面体の計量 (Regular Tetrahedron)" :
             "実践演習 (Quiz)"}
        </div>
        <div className="w-10" />
      </header>

      {/* Level Selection Menu */}
      {level === 0 && (
          <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-md mx-auto space-y-4">
                  <h1 className="text-2xl font-black mb-8 text-center">Select Module</h1>
                  
                  {[
                      { id: 1, title: "Level 1: 直角三角形", desc: "sin, cos, tanの定義 (0° < θ < 90°)", icon: Compass },
                      { id: 2, title: "Level 2: 単位円", desc: "鈍角への拡張 (90° <= θ <= 180°)", icon: Circle },
                      { id: 3, title: "Level 3: 相互関係", desc: "sin²θ + cos²θ = 1 の視覚的証明", icon: Zap },
                      { id: 4, title: "Level 4: 正弦定理", desc: "a/sinA = 2R の視覚的理解", icon: Activity },
                      { id: 5, title: "Level 5: 余弦定理", desc: "三辺から角度を知る力", icon: Target },
                      { id: 6, title: "Level 6: 三角形の面積", desc: "高さ = b sinA の視覚化", icon: TrendingUp },
                      { id: 7, title: "Level 7: 内接円の半径", desc: "S = 1/2 r(a+b+c) の視覚化", icon: Circle },
                      { id: 8, title: "Level 8: 対称性と公式", desc: "180°-θ と 90°-θ の視覚化", icon: RefreshCw },
                      { id: 9, title: "Level 9: 方程式と不等式", desc: "sin/cosと単位円の交点", icon: Target },
                      { id: 10, title: "Level 10: 角の二等分線", desc: "面積比を用いた線分の長さ", icon: Target },
                      { id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },
                      { id: 12, title: "Level 12: ヘロンの公式", desc: "三辺から面積を直接求める", icon: Target },
                      { id: 13, title: "Level 13: 円に内接する四角形", desc: "向かい合う角と余弦定理", icon: Target },
                      { id: 14, title: "Level 14: 円錐の最短経路", desc: "展開図と余弦定理を用いた応用", icon: Target },
                      { id: 15, title: "Level 15: 正四面体の計量", desc: "高さ・内接球・外接球", icon: Target },
                      { id: 16, title: "Level 16: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }
                  ].map((item) => (
                      <button key={item.id} onClick={() => dispatch({type: 'SET_LEVEL', payload: item.id})}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500 dark:hover:border-blue-400 transition-all group text-left shadow-sm hover:shadow-md">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                              <div className="font-bold text-lg">{item.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                          </div>
                      </button>
                  ))}
              </div>
          </main>
      )}

      {/* Level 1-7: Visualization Mode */}
      {level > 0 && level <= 8 && (
          <>
            <section className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 relative h-[400px]">
                <div className="w-full max-w-md aspect-square bg-white dark:bg-slate-950 rounded-[48px] border border-slate-200/60 dark:border-slate-800 shadow-inner overflow-hidden relative">
                    <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
                    
                    {/* Level 3 Overlay: Pythagorean Identity */}
                    {level === 3 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Pythagorean Identity</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500 font-bold">cos²{angle}°</span>
                                    <span>+</span>
                                    <span className="text-red-500 font-bold">sin²{angle}°</span>
                                    <span>=</span>
                                    <span className="font-bold">1</span>
                                </div>
                                <div className="text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                                    {cosSq} + {sinSq} ≈ 1.000
                                </div>
                            </div>
                        </div>
                    )}
                    
                    
                    {level === 8 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{symMode === 'supp' ? "180° - θ" : "90° - θ"}</div>
                            <div className="flex flex-col gap-2 text-sm font-mono mt-2">
                                {symMode === 'supp' ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary font-bold">sin(180°-θ)</span>
                                            <span>=</span>
                                            <span className="text-primary font-bold">sin θ</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary font-bold">cos(180°-θ)</span>
                                            <span>=</span>
                                            <span className="font-bold">-</span>
                                            <span className="text-primary font-bold">cos θ</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary font-bold">sin(90°-θ)</span>
                                            <span>=</span>
                                            <span className="text-primary font-bold">cos θ</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-secondary font-bold">cos(90°-θ)</span>
                                            <span>=</span>
                                            <span className="text-primary font-bold">sin θ</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Level 4 Overlay: Sine Rule */}
                    {level === 4 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Sine Rule</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-amber-500 font-bold">a / sin A</span>
                                    <span>=</span>
                                    <span className="font-bold">2R</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                                    <div>a = {sideA}</div>
                                    <div>R = {radiusVal}</div>
                                    <div>sin A = {sinVal}</div>
                                    <div>2R = {diameter}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                                    {sideA} / {sinVal} ≈ {ratioCalc}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Level 5 Overlay: Cosine Rule */}
                    {level === 5 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Cosine Rule</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-secondary font-bold">a²</span>
                                    <span>=</span>
                                    <span className="font-bold">b² + c² - 2bc cosA</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                                    <div>b = {sideB_val}</div>
                                    <div>c = {sideC_val}</div>
                                    <div>cos {angle}° = {cosVal}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                                    a² = {sideB_val}² + {sideC_val}² - {2*sideB_val*sideC_val}({cosVal})
                                </div>
                                <div className="text-sm font-bold text-red-500 mt-1">
                                    a = {sideA_val}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Level 6 Overlay: Area */}
                    {level === 6 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Triangle Area</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-secondary font-bold">S</span>
                                    <span>=</span>
                                    <span className="font-bold">1/2 bc sin A</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                                    <div>b = {area_b}</div>
                                    <div>c = {area_c}</div>
                                    <div>sin A = {area_sinA.toFixed(2)}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                                    S = 1/2 × {area_b} × {area_c} × {area_sinA.toFixed(2)}
                                </div>
                                <div className="text-sm font-bold text-green-500 mt-1">
                                    Area = {area_S}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Level 7 Overlay: Inradius */}
                    {level === 7 && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Inradius Formula</div>
                            <div className="flex flex-col gap-1 text-sm font-mono">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-amber-500 font-bold">r</span>
                                    <span>=</span>
                                    <span className="font-bold">2S / (a+b+c)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                                    <div>S = {area_S}</div>
                                    <div>a+b+c = {in_perimeter}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                                    r = 2 × {area_S} / {in_perimeter}
                                </div>
                                <div className="text-sm font-bold text-amber-500 mt-1">
                                    r = {in_r}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-white text-sm">
                            {level === 4 ? `A = ${angle}°` : `θ = ${angle}°`}
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6">
                <div className="max-w-md mx-auto space-y-6">
                    {/* Controls */}
                    <div>
                        <input type="range" min={level === 4 ? 10 : 0} max={level === 1 || level === 8 ? 89 : 170} step="1" value={angle} 
                            onChange={e => dispatch({type: 'SET_ANGLE', payload: Number(e.target.value)})} 
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-black dark:accent-white cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                            <span>{level === 4 ? "10°" : "0°"}</span>
                            <span>{level === 1 ? "90°" : level === 4 ? "170°" : "180°"}</span>
                        </div>
                    </div>

                    {/* Explanations */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        {level === 1 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Compass className="w-4 h-4" /> 直角三角形による定義</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    直角三角形において、角度 <MathComponent tex="\theta" /> が決まれば、辺の比は一定になります。
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-red-500 font-bold mb-1">sin θ</div>
                                        <div>対辺/斜辺</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-blue-500 font-bold mb-1">cos θ</div>
                                        <div>底辺/斜辺</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-slate-500 font-bold mb-1">tan θ</div>
                                        <div>対辺/底辺</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {level === 2 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Circle className="w-4 h-4" /> 単位円による拡張</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    半径1の円周上の点 P(x, y) として定義を拡張します。<br/>
                                    これにより、90°以上の鈍角でも三角比を定義できます。
                                </p>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-center">
                                    P(x, y) = (\cos \theta, \sin \theta)
                                </div>
                            </div>
                        )}

                        {level === 3 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> 三角比の相互関係</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    単位円上の点は <MathComponent tex="x^2 + y^2 = 1" /> を満たします。<br/>
                                    <MathComponent tex="x=\cos\theta, y=\sin\theta" /> を代入すると、最も重要な公式が導かれます。
                                </p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
                                    <MathComponent tex="\sin^2\theta + \cos^2\theta = 1" className="text-xl font-bold text-blue-700 dark:text-blue-400" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    スライダーを動かして、常に和が1になることを確認しましょう。
                                </p>
                            </div>
                        )}
                        
                        {level === 4 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4" /> 正弦定理 (Sine Rule)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    三角形の外接円の半径を <MathComponent tex="R" /> とすると、以下の関係が成り立ちます。
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-center">
                                    <MathComponent tex="\frac{a}{\sin A} = 2R" className="text-xl font-bold text-amber-700 dark:text-amber-400" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    角度 <MathComponent tex="A" /> を変えると、対辺 <MathComponent tex="a" /> の長さも変わり、その比率は常に直径 <MathComponent tex="2R" /> に等しくなります。
                                </p>
                            </div>
                        )}

                        {level === 5 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4" /> 余弦定理 (Cosine Rule)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    三角形の2辺とその間の角が分かれば、残りの1辺の長さが求まります。<br/>
                                    三平方の定理 <MathComponent tex="a^2 = b^2 + c^2" /> の一般化です。
                                </p>
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 text-center">
                                    <MathComponent tex="a^2 = b^2 + c^2 - 2bc \cos A" className="text-xl font-bold text-red-700 dark:text-red-400" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    スライダーで角度を変えて、辺 <MathComponent tex="a" /> の長さの変化を確認しましょう。
                                </p>
                            </div>
                        )}

                        {level === 6 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 三角形の面積 (Area)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    底辺を <MathComponent tex="c" /> とすると、高さは <MathComponent tex="h = b \sin A" /> となります。<br/>
                                    したがって、面積 <MathComponent tex="S" /> は以下の公式で求まります。
                                </p>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 text-center">
                                    <MathComponent tex="S = \frac{1}{2}bc \sin A" className="text-xl font-bold text-green-700 dark:text-green-400" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    角度 <MathComponent tex="A" /> が90°に近づくと <MathComponent tex="\sin A" /> が最大(1)になり、面積も最大になります。
                                </p>
                            </div>
                        )}

                        {level === 7 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Circle className="w-4 h-4" /> 内接円の半径 (Inradius)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    三角形の面積 <MathComponent tex="S" /> は、内接円の半径 <MathComponent tex="r" /> と三辺の長さの和を用いても表せます。
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-center">
                                    <MathComponent tex="S = \frac{1}{2}r(a+b+c)" className="text-xl font-bold text-amber-700 dark:text-amber-400" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    ここから <MathComponent tex="r = \frac{2S}{a+b+c}" /> が導かれます。面積と周の長さから半径を決定できます。
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
          </>
      )}

      
                        {level === 8 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4" /> 対称性と公式 (180° - θ)</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    単位円をy軸で折り返したときの対称性を確認しましょう。<br/>
                                    角度が <MathComponent tex="180^\circ - \theta" /> の点Qは、点Pとy軸について対称になります。
                                </p>
                                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800 text-center">
                                    <MathComponent tex="\sin(180^\circ-\theta) = \sin\theta" className="text-xl font-bold text-rose-700 dark:text-rose-400 block mb-2" />
                                    <MathComponent tex="\cos(180^\circ-\theta) = -\cos\theta" className="text-xl font-bold text-rose-700 dark:text-rose-400 block" />
                                </div>
                                <p className="text-xs text-slate-400 text-center">
                                    公式を丸暗記するのではなく、単位円上の「高さ(sin)が同じ」「横幅(cos)が逆」という図のイメージを持ちましょう。
                                </p>
                            </div>
                        )}

      {/* Level 9: Equations & Inequalities */}
      {level === 9 && (
          <TrigEqIneqViz />
      )}

      {/* Level 10: Angle Bisector */}
      {level === 10 && (
          <AngleBisectorViz />
      )}

      {/* Level 11: Surveying */}
      {level === 11 && (
          <SurveyingViz />
      )}

      {/* Level 12: Heron's Formula */}
      {level === 12 && (
          <HeronsFormulaViz />
      )}

      {/* Level 13: Tactics Mode (Quiz) */}
      
      {/* Level 13: Cyclic Quadrilateral */}
      {level === 13 && (
          <CyclicQuadrilateralViz />
      )}

      
      {/* Level 14: Cone Shortest Path */}
      {level === 14 && (
          <ConeShortestPathViz />
      )}

      {/* Level 15: Tactics Mode (Quiz) */}
      {level === 15 && (
          <TetrahedronViz />
      )}

      {/* Level 16: Tactics Mode (Quiz) */}
      {level === 16 && (
          <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
              {state.quizIndex < QUIZ_DATA.length ? (
                  <div className="w-full max-w-md bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {state.quizIndex + 1} / {QUIZ_DATA.length}</span>
                          <div className="flex gap-1">
                              {[...Array(QUIZ_DATA.length)].map((_, i) => (
                                  <div key={i} className={`h-1.5 w-6 rounded-full ${i < state.quizIndex ? 'bg-green-500' : i === state.quizIndex ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                              ))}
                          </div>
                      </div>

                      <h2 className="text-2xl font-bold mb-8 text-center min-h-[60px] flex items-center justify-center">
                          <MathComponent tex={QUIZ_DATA[state.quizIndex].question} />
                      </h2>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                          {QUIZ_DATA[state.quizIndex].options.map((opt, i) => {
                              const isSelected = state.feedback !== 'idle';
                              const isCorrect = opt === QUIZ_DATA[state.quizIndex].answer;
                              const isWrongSelection = state.feedback === 'wrong'; // Simplified for this demo
                              
                              let btnClass = "p-6 rounded-2xl border-2 text-lg font-bold transition-all relative overflow-hidden ";
                              if (state.feedback === 'idle') {
                                  btnClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                              } else if (isCorrect) {
                                  btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                              } else {
                                  btnClass += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50";
                              }

                              return (
                                  <button key={i} 
                                      onClick={() => state.feedback === 'idle' && dispatch({type: 'SUBMIT_ANSWER', payload: opt})}
                                      className={btnClass}
                                  >
                                      <MathComponent tex={opt} />
                                      {state.feedback !== 'idle' && isCorrect && (
                                          <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                                      )}
                                  </button>
                              );
                          })}
                      </div>

                      {state.feedback !== 'idle' && (
                          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="text-center">
                              <button onClick={() => dispatch({type: 'NEXT_QUIZ'})} 
                                  className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:opacity-80 transition-opacity flex items-center gap-2 mx-auto">
                                  Next Question <ChevronRight className="w-4 h-4" />
                              </button>
                          </motion.div>
                      )}
                  </div>
              ) : (
                  <div className="text-center space-y-6">
                      <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} 
                          className="w-32 h-32 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg border-4 border-white dark:border-slate-900">
                          <Trophy className="w-16 h-16" />
                      </motion.div>
                      <div className="space-y-2">
                          <h2 className="text-3xl font-black">Score: {state.score} / {QUIZ_DATA.length}</h2>
                          <p className="text-slate-500">
                              {state.score === QUIZ_DATA.length ? "Perfect! Trigonometry Master!" : "Keep practicing!"}
                          </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                          <button onClick={() => dispatch({type: 'RESET_LEVEL'})} className="px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 transition-colors">
                              Retry
                          </button>
                          <button onClick={() => dispatch({type: 'RESET_ALL'})} className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-opacity">
                              Back to Menu
                          </button>
                      </div>
                  </div>
              )}
          </main>
      )}
    </div>
  );
}
