"use client";

import React, { useState, useEffect, useRef, useReducer } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { 
  ChevronLeft, 
  ChevronRight, 
  Target,
  Lightbulb,
  FileText,
  CheckCircle,
  XCircle,
  ArrowDown,
  Maximize2,
  Minimize2,
  Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';

import { generateVertexFormProblem } from './utils/vertex-form-generator';
import { generateMaxMinProblem } from './utils/max-min-generator';
import { generateInequalityProblem, InequalityProblem } from './utils/inequality-generator';
import QuadraticGraph from '../components/math/QuadraticGraph';

// --- Types ---
type Mode = 'LEARN' | 'TACTICS';
type Status = 'idle' | 'correct' | 'wrong';

interface State {
  mode: Mode;
  level: number;
  step: number;
}

type Action = 
  | { type: 'SWITCH_MODE'; payload: Mode }
  | { type: 'NEXT_STEP' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET' };

interface TacticsQuestion {
  generalForm: string;
  standardForm?: string;
  answer: string;
  vertex?: [number, number];
  instruction: string;
  options: string[];
  hint?: string;
  explanation?: string[];
  type?: 'max-min';
  domain?: [number, number];
  target?: 'max' | 'min';
}

// --- Components ---
const MathComponent = ({ tex, className = "", display = false }: { tex: string; className?: string; display?: boolean }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode: display });
    }
  }, [tex, display]);
  return <span ref={containerRef} className={className} />;
};

// --- Reducer ---
function curriculumReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SWITCH_MODE': return { mode: action.payload, level: 0, step: 0 };
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'NEXT_LEVEL': return { ...state, level: state.level + 1, step: 0 };
    case 'RESET': return { mode: 'LEARN', level: 0, step: 0 };
    default: return state;
  }
}

export default function QuadraticsModule() {
  const { t } = useLanguage();
  const { unlockBadge } = useGamification();
  const [state, dispatch] = useReducer(curriculumReducer, { mode: 'LEARN', level: 0, step: 0 });
  const { mode, level, step } = state;
  
  const [a, setA] = useState(1);
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  const [b, setB] = useState(0); 
  const [c, setC] = useState(0); 
  
  // Level 5: Domain
  const [domainStart, setDomainStart] = useState(-1);
  const [domainEnd, setDomainEnd] = useState(2);
  const [axisPos, setAxisPos] = useState(1); // p for level 5

  // Level 6: Inequalities
  const [ineqType, setIneqType] = useState<'gt' | 'lt'>('gt'); // gt: > 0, lt: < 0
  const [ineqProb, setIneqProb] = useState<InequalityProblem | null>(null);

  useEffect(() => {
    if (level === 6 && !ineqProb) {
       setIneqProb(generateInequalityProblem());
    }
  }, [level, ineqProb]);

  // Level 7: Intersection (Line & Parabola)
  const [m, setM] = useState(1); // slope
  const [k, setK] = useState(0); // intercept

  // Level 8: Determination (Find 'a')
  const [detA, setDetA] = useState(0.5); // Initial 'a' for level 8 (Target is 1.0)

  // Level 9: Parallel Translation
  const [transP, setTransP] = useState(0);
  const [transQ, setTransQ] = useState(0);

  // Level 10: Coefficient Analysis
  const [signs, setSigns] = useState<{a: string, b: string, c: string, D: string}>({a: '', b: '', c: '', D: ''});
  const [showSignFeedback, setShowSignFeedback] = useState(false);

  const [userX, setUserX] = useState(0);
  
  // Tactics Engine
  const [tacticsIdx, setTacticsIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{status: Status, msg: string}>({status: 'idle', msg: ''});

  const QUESTIONS: TacticsQuestion[] = React.useMemo(() => {
    // Generate 3 random vertex form problems + 3 max/min problems
    const vertexQs = Array.from({ length: 3 }, () => generateVertexFormProblem());
    const maxMinQs = Array.from({ length: 3 }, () => generateMaxMinProblem());

    return [
    ...vertexQs,
    ...maxMinQs,
    {
      generalForm: "y = 2x^2 - 20x + 44",
      standardForm: "y = 2(x - 5)^2 - 6",
      answer: "(5, -6)",
      options: ["(5, -6)", "(-5, 6)", "(10, 44)", "(5, 6)"],
      vertex: [5, -6],
      instruction: t('modules.quadratics.tactics.q1_inst')
    },
    {
      generalForm: "y = -x^2 - 4x + 1",
      standardForm: "y = -(x + 2)^2 + 5",
      answer: "(-2, 5)",
      options: ["(-2, 5)", "(2, 1)", "(-2, 1)", "(2, -5)"],
      vertex: [-2, 5],
      instruction: t('modules.quadratics.tactics.q2_inst')
    },
    {
      generalForm: "y = x^2 - 3x + 2",
      standardForm: "y = (x - 1.5)^2 - 0.25",
      answer: "(1.5, -0.25)",
      options: ["(1.5, -0.25)", "(3, 2)", "(-1.5, 0.25)", "(1.5, 0.25)"],
      vertex: [1.5, -0.25],
      instruction: t('modules.quadratics.tactics.q3_inst')
    },
    {
      generalForm: "y = x^2 - 4x + 3",
      standardForm: "D = 16 - 12 = 4 > 0",
      answer: "2",
      options: ["2", "1", "0", "3"],
      vertex: [2, -1],
      instruction: t('modules.quadratics.tactics.q4_inst')
    },
    {
      generalForm: "x^2 - 4 > 0",
      standardForm: "(x+2)(x-2) > 0",
      answer: "x < -2, 2 < x",
      options: ["x < -2, 2 < x", "-2 < x < 2", "x > 2", "x < -2"],
      vertex: [0, -4],
      instruction: t('modules.quadratics.tactics.q5_inst')
    },
    {
      generalForm: "y = (x-1)^2, 0 <= x <= 3",
      standardForm: "x=3 (Farthest from axis x=1)",
      answer: "4",
      options: ["0", "1", "4", "9"],
      vertex: [1, 0],
      instruction: t('modules.quadratics.tactics.q6_inst')
    },
    {
      generalForm: "y = x^2 - 4x + 5",
      answer: "0個",
      options: ["2個", "1個", "0個", "解なし"],
      instruction: t('modules.quadratics.tactics.q4_inst'),
      hint: t('modules.quadratics.tactics.hint_discriminant')
    },
    {
      generalForm: "x^2 - 3x - 10 < 0",
      answer: "-2 < x < 5",
      options: ["x < -2, 5 < x", "-2 < x < 5", "x < -5, 2 < x", "-5 < x < 2"],
      instruction: t('modules.quadratics.tactics.q5_inst'),
      hint: t('modules.quadratics.tactics.hint_graph')
    },
    {
      generalForm: "y = -(x-1)^2 + 4",
      answer: "4",
      options: ["4", "3", "0", "-5"],
      instruction: t('modules.quadratics.tactics.q6_inst'),
      hint: t('modules.quadratics.tactics.hint_graph')
    }
  ];
  }, [t]);

  const currentQ = QUESTIONS[tacticsIdx % QUESTIONS.length];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Visual Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const scale = 40, ox = w / 2, oy = h / 2 + 50;

    const render = () => {
      // Clear
      ctx.clearRect(0, 0, w, h);
      
      // Level 5 Domain Shading
      if (mode === 'LEARN' && level === 5) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        const x1 = ox + domainStart * scale;
        const x2 = ox + domainEnd * scale;
        ctx.fillRect(x1, 0, x2 - x1, h);
        
        ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, h); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Grid
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 1;
      for(let x=-10; x<=10; x++) { ctx.beginPath(); ctx.moveTo(ox + x*scale, 0); ctx.lineTo(ox + x*scale, h); ctx.stroke(); }
      for(let y=-10; y<=10; y++) { ctx.beginPath(); ctx.moveTo(0, oy - y*scale); ctx.lineTo(w, oy - y*scale); ctx.stroke(); }
      
      // Axes
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();

      // Parabola logic
      ctx.strokeStyle = mode === 'TACTICS' ? '#1D1D1F' : (level >= 2 ? '#FF3B30' : '#007AFF');
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      
      // Function calc
      const getY = (x: number) => {
        if (mode === 'LEARN') {
          if (level === 0) return a * x * x;
          else if (level === 1) return (x - p)*(x - p) + q;
          else if (level === 2 || level === 3) return (x - 2)*(x - 2) - 1; 
          else if (level === 4) return a*x*x + b*x + c; 
          else if (level === 5) return (x - axisPos)*(x - axisPos) - 2; // Fixed shape, moving axis
          else if (level === 6) return x*x - 4; // y = x^2 - 4 for inequalities
          else if (level === 7) return 0.5 * x * x; // y = 0.5x^2 for intersection demo
          else if (level === 8) return detA * (x - 2)*(x - 2) + 1; // y = a(x-2)^2 + 1. Target: a=1, passes (4,5)
          else if (level === 9) return 2 * (x - transP)*(x - transP) + transQ; // Moving graph y = 2(x-p)^2 + q
          else if (level === 10) return (x - 2)*(x - 2) - 1;
        } else {
          if (currentQ.vertex) {
            const cA = currentQ.vertex[0] > 0 ? 1 : -1; // Heuristic from previous logic
            const cP = currentQ.vertex[0];
            const cQ = currentQ.vertex[1];
            return cA * (x - cP) * (x - cP) + cQ;
          } else {
             // Fallback visualization for new questions
             // Q4: y = x^2 - 4x + 5 -> (x-2)^2 + 1
             if (currentQ.generalForm.includes("x^2 - 4x + 5")) return (x-2)*(x-2) + 1;
             // Q5: x^2 - 3x - 10 -> (x-1.5)^2 - 12.25
             if (currentQ.generalForm.includes("x^2 - 3x - 10")) return (x-1.5)*(x-1.5) - 12.25;
             // Q6: y = -(x-1)^2 + 4
             if (currentQ.generalForm.includes("-(x-1)^2 + 4")) return -1*(x-1)*(x-1) + 4;
             return x*x;
          }
        }
        return 0;
      };

      for (let px = 0; px <= w; px++) {
        const x = (px - ox) / scale;
        const y = getY(x);
        const py = oy - y * scale;
        
        // Prevent infinite drawing
        if (Math.abs(y) > 20) continue;

        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Level 9: Target Graph for Translation
      if (mode === 'LEARN' && level === 9) {
          // Draw target graph: y = 2(x - 1)^2 + 1 (Red dashed)
          ctx.strokeStyle = '#EF4444'; // Red-500
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 3;
          ctx.beginPath();
          const getTargetY = (x: number) => 2 * (x - 1)**2 + 1;
          for (let px = 0; px <= w; px++) {
             const x = (px - ox) / scale;
             const y = getTargetY(x);
             const py = oy - y * scale;
             if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw Target Vertex (1, 1)
          ctx.fillStyle = '#EF4444';
          ctx.beginPath(); ctx.arc(ox + 1*scale, oy - 1*scale, 5, 0, Math.PI*2); ctx.fill();
      }

      // Level 7: Line y = mx + k
      if (mode === 'LEARN' && level === 7) {
        ctx.strokeStyle = '#10B981'; // Emerald Green
        ctx.lineWidth = 3;
        ctx.beginPath();
        const getLineY = (x: number) => m * x + k;
        
        // Draw line across screen
        const xMin = -10, xMax = 10;
        const yMin = getLineY(xMin);
        const yMax = getLineY(xMax);
        ctx.moveTo(ox + xMin * scale, oy - yMin * scale);
        ctx.lineTo(ox + xMax * scale, oy - yMax * scale);
        ctx.stroke();

        const disc = m*m + 2*k;
        if (disc >= 0) {
            const r1 = m - Math.sqrt(disc);
            const r2 = m + Math.sqrt(disc);
            const pts = disc === 0 ? [r1] : [r1, r2];
            
            ctx.fillStyle = '#F59E0B'; // Amber for intersection
            pts.forEach(rx => {
                const ry = getLineY(rx);
                ctx.beginPath(); ctx.arc(ox + rx*scale, oy - ry*scale, 6, 0, Math.PI*2); ctx.fill();
            });
        }
      }

      // Level 8: Target Point & Vertex
      if (mode === 'LEARN' && level === 8) {
        // Vertex (2, 1)
        ctx.fillStyle = '#6366F1'; // Indigo
        ctx.beginPath(); ctx.arc(ox + 2*scale, oy - 1*scale, 4, 0, Math.PI*2); ctx.fill();
        
        // Target Point (4, 5)
        ctx.fillStyle = '#EC4899'; // Pink
        ctx.beginPath(); ctx.arc(ox + 4*scale, oy - 5*scale, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText("A", ox + 4*scale - 4, oy - 5*scale + 3);

        // Dashed line from Parabola to Point (Visual feedback)
        const currentYat4 = detA * (4-2)**2 + 1; // = 4a + 1
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox + 4*scale, oy - currentYat4*scale);
        ctx.lineTo(ox + 4*scale, oy - 5*scale);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Level 5 Highlights (Max/Min)
      if (mode === 'LEARN' && level === 5) {
         // Calculate values at domain boundaries and vertex
         const yStart = getY(domainStart);
         const yEnd = getY(domainEnd);
         const yVertex = -2; // Fixed q for this level
         const xVertex = axisPos;

         // Determine Min
         let minX = domainStart, minY = yStart;
         // If vertex is inside domain, it's the min (since a=1 > 0)
         if (xVertex >= domainStart && xVertex <= domainEnd) {
             minX = xVertex;
             minY = yVertex;
         } else {
             // Otherwise closer boundary
             if (yEnd < yStart) { minX = domainEnd; minY = yEnd; }
         }

         // Determine Max
         // Furthest boundary from axis
         let maxX = domainStart, maxY = yStart;
         if (yEnd > yStart) { maxX = domainEnd; maxY = yEnd; }

         // Draw Min (Blue)
         ctx.fillStyle = '#2563EB'; 
         ctx.beginPath(); ctx.arc(ox + minX*scale, oy - minY*scale, 6, 0, Math.PI*2); ctx.fill();
         // Draw Max (Red)
         ctx.fillStyle = '#DC2626';
         ctx.beginPath(); ctx.arc(ox + maxX*scale, oy - maxY*scale, 6, 0, Math.PI*2); ctx.fill();
      }

      // Level 6: Inequalities (y = x^2 - 4)
      if (mode === 'LEARN' && level === 6) {
         // Roots are -2 and 2
         const x1 = -2;
         const x2 = 2;
         const isGt = ineqType === 'gt'; // > 0
         
         ctx.fillStyle = isGt ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
         
         // Highlight on X-axis
         const h = 6;
         if (isGt) {
             // x < -2
             ctx.fillRect(0, oy - h/2, ox + x1*scale, h);
             // x > 2
             ctx.fillRect(ox + x2*scale, oy - h/2, w - (ox + x2*scale), h);
         } else {
             // -2 < x < 2
             ctx.fillRect(ox + x1*scale, oy - h/2, (x2 - x1)*scale, h);
         }

         // Draw roots
         ctx.fillStyle = '#000';
         ctx.beginPath(); ctx.arc(ox + x1*scale, oy, 4, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.arc(ox + x2*scale, oy, 4, 0, Math.PI*2); ctx.fill();
      }

      // Discriminant Roots (Level 4)
      if (mode === 'LEARN' && level === 4) {
         const dVal = b*b - 4*a*c;
         if (dVal >= 0 && a !== 0) {
            const x1 = (-b - Math.sqrt(dVal)) / (2*a);
            const x2 = (-b + Math.sqrt(dVal)) / (2*a);
            ctx.fillStyle = '#10B981'; 
            [[x1, 0], [x2, 0]].forEach(([rx, ry]) => {
               ctx.beginPath(); ctx.arc(ox + rx*scale, oy - ry*scale, 5, 0, Math.PI*2); ctx.fill();
            });
         }
      }
    };
    render();
  }, [a, b, c, p, q, level, mode, tacticsIdx, currentQ, domainStart, domainEnd, axisPos, m, k, ineqType, detA, transP, transQ]);

  const checkTacticsAnswer = (opt: string) => {
    setSelectedOption(opt);
    if (opt === currentQ.answer) {
      const correctMsg = currentQ.standardForm 
        ? t('modules.quadratics.tactics.correct') + " " + opt + " " + t('modules.quadratics.tactics.correct_suffix_2')
        : t('modules.quadratics.tactics.correct'); // Simple success for non-vertex Qs

      setFeedback({
        status: 'correct', 
        msg: correctMsg
      });
      
      if (currentQ.vertex) {
        setUserX(currentQ.vertex[0]);
      }
      
      if (tacticsIdx % QUESTIONS.length === QUESTIONS.length - 1) {
        unlockBadge('gravity_master');
      }
    } else {
      const wrongMsg = currentQ.hint 
        ? t('modules.quadratics.tactics.wrong') + " " + currentQ.hint
        : t('modules.quadratics.tactics.wrong');
        
      setFeedback({status: 'wrong', msg: wrongMsg});
    }
  };

  const nextTactics = () => {
    setTacticsIdx(i => i + 1);
    setSelectedOption(null);
    setFeedback({status: 'idle', msg: ''});
    setUserX(0);
  };

  return (
    <div className={`h-screen bg-white text-black flex flex-col ${GeistSans.className} selection:bg-blue-100 overflow-hidden`}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-slate-100 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-black transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <div className="text-sm font-bold text-slate-600">
          {mode === 'LEARN' ? t('modules.quadratics.title') : t('modules.quadratics.tactics.header')}
        </div>
        <div className="w-10" />
      </header>

      {/* Visual Viewport */}
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md aspect-video bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative flex items-center justify-center">
          {mode === 'TACTICS' && currentQ.vertex ? (
             <QuadraticGraph 
                a={currentQ.generalForm.includes("y = -") || currentQ.generalForm.includes("=-") ? -1 : 1} // Simplified heuristic for now
                p={currentQ.vertex[0]} 
                q={currentQ.vertex[1]} 
                width={400} 
                height={220} 
                highlightVertex={feedback.status === 'correct'}
                domain={currentQ.domain}
                target={currentQ.target}
             />
          ) : (
             <canvas ref={canvasRef} width={400} height={220} className="w-full h-full" />
          )}
          
          <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
            <motion.div key={mode + level + currentQ.generalForm} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 text-blue-600 font-bold text-sm">
              {mode === 'LEARN' ? (
                level === 0 ? <MathComponent tex={`y = ${a.toFixed(1)}x^2`} /> : 
                level === 1 ? <MathComponent tex={`y = (x - ${p.toFixed(1)})^2 + ${q.toFixed(1)}`} /> :
                level === 5 ? <MathComponent tex={`y = (x - ${axisPos.toFixed(1)})^2 - 2`} /> :
                level === 7 ? <MathComponent tex={`y = ${m.toFixed(1)}x + ${k.toFixed(1)}`} /> :
                level === 8 ? <MathComponent tex={`y = ${detA.toFixed(1)}(x - 2)^2 + 1`} /> :
                level === 9 ? <MathComponent tex={`y = 2(x - ${transP.toFixed(1)})^2 + ${transQ.toFixed(1)}`} /> :
                <MathComponent tex="y = x^2 - 4x + 3" />
              ) : <MathComponent tex={currentQ.generalForm} />}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-lg mx-auto px-6 py-8 pb-32">
          <AnimatePresence mode="wait">
            
            {/* LEVEL 0 */}
            {mode === 'LEARN' && level === 0 && (
              <motion.div key="lvl0" className="space-y-8 text-center">
                {step === 0 ? (
                   <div className="space-y-6">
                     <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('modules.quadratics.levels.0.title')}</h1>
                     <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.0.desc')}} />
                     <button onClick={() => dispatch({type: 'NEXT_STEP'})} className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">{t('modules.quadratics.levels.0.start')}</button>
                   </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">{a >= 0 ? t('modules.quadratics.levels.0.shape_pos') : t('modules.quadratics.levels.0.shape_neg')}</h2>
                    <div className="space-y-4 pt-4 bg-slate-50 p-6 rounded-xl">
                       <div className="flex justify-between items-center px-1"><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('modules.quadratics.levels.0.coeff_a')}</span><span className="font-mono font-bold text-blue-600">{a.toFixed(1)}</span></div>
                       <input type="range" min="-3" max="3" step="0.1" value={a} onChange={e => setA(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    {Math.abs(a) > 2.5 && <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">{t('modules.quadratics.levels.0.next_lesson')}</button>}
                  </div>
                )}
              </motion.div>
            )}

            {/* LEVEL 1 */}
            {mode === 'LEARN' && level === 1 && (
              <motion.div key="lvl1" className="space-y-8">
                {step === 0 ? (
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.1.title')}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{t('modules.quadratics.levels.1.desc')}</p>
                    <button onClick={() => dispatch({type: 'NEXT_STEP'})} className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">{t('modules.quadratics.levels.1.start')}</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 space-y-2">
                      <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4" /> {t('modules.quadratics.levels.1.why_title')}</h3>
                      <p className="text-xs text-blue-700 leading-relaxed" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.1.why_desc')}} />
                    </div>
                    <div className="space-y-6 bg-slate-50 p-6 rounded-xl">
                       <div className="space-y-2"><span className="text-xs font-bold text-slate-500">{t('modules.quadratics.levels.1.move_p')}</span><input type="range" min="-4" max="4" step="0.1" value={p} onChange={e => setP(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" /></div>
                       <div className="space-y-2"><span className="text-xs font-bold text-slate-500">{t('modules.quadratics.levels.1.move_q')}</span><input type="range" min="-4" max="4" step="0.1" value={q} onChange={e => setQ(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" /></div>
                    </div>
                    {Math.abs(p - 2) < 0.2 && Math.abs(q - (-1)) < 0.2 && (
                      <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-colors">{t('modules.quadratics.levels.1.next_lesson')}</button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* LEVEL 2 & 3 */}
            {mode === 'LEARN' && (level === 2 || level === 3) && (
              <motion.div key={`lvl${level}`} className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-6 flex flex-col items-center">
                   <div className="text-center pb-4 border-b border-white/10 w-full">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('modules.quadratics.levels.2_3.target_eq')}</p>
                      <MathComponent tex={level === 2 ? "y = x^2 - 4x + 3" : "y = 2x^2 - 20x + 44"} className="text-xl font-mono" />
                   </div>
                   
                   <div className="w-full space-y-6 flex flex-col items-center">
                      {step === 0 && <button onClick={() => dispatch({type: 'NEXT_STEP'})} className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">{t('modules.quadratics.levels.2_3.start_process')}</button>}
                      
                      {step >= 1 && (
                        <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <div className="flex flex-col items-center gap-2">
                              <MathComponent tex={level === 2 ? "x^2 - 4x" : "2(x^2 - 10x)"} className="text-slate-400 text-lg" />
                              <ArrowDown className="w-4 h-4 text-blue-500" />
                              <MathComponent tex={level === 2 ? "(x - 2)^2" : "2(x - 5)^2"} className="text-blue-400 text-xl font-bold" />
                           </div>
                           {step >= 2 && (
                             <>
                                <ArrowDown className="w-4 h-4 text-amber-500" />
                                <div className="text-center">
                                   <MathComponent tex={level === 2 ? "(x - 2)^2 - 4 + 3" : "2(x - 5)^2 - 50 + 44"} className="text-amber-400 text-lg font-bold" />
                                   <p className="text-slate-400 text-[10px] mt-1">
                                      {level === 2 ? t('modules.quadratics.levels.2_3.adjust_desc_2') : t('modules.quadratics.levels.2_3.adjust_desc_3')}
                                   </p>
                                </div>
                             </>
                           )}
                           {step === 3 && (
                             <>
                                <ArrowDown className="w-4 h-4 text-emerald-500" />
                                <div className="text-center">
                                   <div className="text-emerald-400 text-2xl font-mono font-bold">
                                      <MathComponent tex={level === 2 ? "y = (x - 2)^2 - 1" : "y = 2(x - 5)^2 - 6"} />
                                   </div>
                                </div>
                             </>
                           )}
                           <button onClick={() => step < 3 ? dispatch({type: 'NEXT_STEP'}) : dispatch({type: 'NEXT_LEVEL'})} className={`w-full py-3 mt-4 rounded-xl font-bold transition-colors ${step < 3 ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                              {step < 3 ? t('modules.quadratics.levels.2_3.next_step') : (level === 2 ? t('modules.quadratics.levels.2_3.next_lesson_4') : t('modules.quadratics.levels.2_3.next_lesson_5'))}
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {/* LEVEL 4: DISCRIMINANT */}
            {mode === 'LEARN' && level === 4 && (
              <motion.div key="lvl4" className="space-y-6">
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.4.title')}</h2>
                    <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg text-sm font-mono text-slate-600">{t('modules.quadratics.levels.4.formula')}</div>
                 </div>

                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500">a = {a}</span>
                       <input type="range" min="-3" max="3" step="1" value={a} onChange={e => setA(Number(e.target.value))} className="w-32 h-2 bg-slate-200 rounded-lg accent-blue-600" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500">b = {b}</span>
                       <input type="range" min="-5" max="5" step="1" value={b} onChange={e => setB(Number(e.target.value))} className="w-32 h-2 bg-slate-200 rounded-lg accent-blue-600" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500">c = {c}</span>
                       <input type="range" min="-5" max="5" step="1" value={c} onChange={e => setC(Number(e.target.value))} className="w-32 h-2 bg-slate-200 rounded-lg accent-blue-600" />
                    </div>
                 </div>

                 <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${b*b - 4*a*c > 0 ? 'bg-emerald-50 border-emerald-200' : (b*b - 4*a*c === 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200')}`}>
                    <div className="text-xs uppercase font-bold text-slate-400">Status</div>
                    <div className="text-2xl font-bold font-mono">D = {(b*b - 4*a*c).toFixed(0)}</div>
                    <div className="text-sm font-bold">
                       {b*b - 4*a*c > 0 ? t('modules.quadratics.levels.4.d_pos') : (b*b - 4*a*c === 0 ? t('modules.quadratics.levels.4.d_zero') : t('modules.quadratics.levels.4.d_neg'))}
                    </div>
                 </div>

                 <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">
                    {t('modules.quadratics.levels.4.next_lesson')}
                 </button>
              </motion.div>
            )}

            {/* LEVEL 5: DOMAIN & RANGE */}
            {mode === 'LEARN' && level === 5 && (
              <motion.div key="lvl5" className="space-y-6">
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.5.title')}</h2>
                    <p className="text-xs text-slate-500">{t('modules.quadratics.levels.5.desc')}</p>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-6">
                     <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold text-slate-500">
                             <span>{t('modules.quadratics.levels.5.vertex_pos')}</span>
                             <span>x = {axisPos.toFixed(1)}</span>
                         </div>
                         <input type="range" min="-3" max="3" step="0.1" value={axisPos} onChange={e => setAxisPos(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-black" />
                     </div>

                     <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold text-blue-500">
                             <span>{t('modules.quadratics.levels.5.domain_label')}</span>
                             <span>{domainStart} ≤ x ≤ {domainEnd}</span>
                         </div>
                         <div className="flex gap-4">
                            <input type="range" min="-5" max="0" step="0.5" value={domainStart} onChange={e => setDomainStart(Number(e.target.value))} className="flex-1 h-2 bg-blue-100 rounded-lg accent-blue-600" />
                            <input type="range" min="0" max="5" step="0.5" value={domainEnd} onChange={e => setDomainEnd(Number(e.target.value))} className="flex-1 h-2 bg-blue-100 rounded-lg accent-blue-600" />
                         </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col items-center">
                         <Maximize2 className="w-5 h-5 text-red-500 mb-2" />
                         <span className="text-xs font-bold text-red-400 uppercase">{t('modules.quadratics.levels.5.max_val')}</span>
                         <span className="text-xl font-bold text-red-700">
                            {Math.max((domainStart - axisPos)**2 - 2, (domainEnd - axisPos)**2 - 2).toFixed(1)}
                         </span>
                     </div>
                     <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center">
                         <Minimize2 className="w-5 h-5 text-blue-500 mb-2" />
                         <span className="text-xs font-bold text-blue-400 uppercase">{t('modules.quadratics.levels.5.min_val')}</span>
                         <span className="text-xl font-bold text-blue-700">
                            {((axisPos >= domainStart && axisPos <= domainEnd) ? -2 : Math.min((domainStart - axisPos)**2 - 2, (domainEnd - axisPos)**2 - 2)).toFixed(1)}
                         </span>
                     </div>
                 </div>

                 <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">
                    {t('modules.quadratics.levels.5.next_lesson')}
                 </button>
              </motion.div>
            )}

            {/* LEVEL 6: INEQUALITIES */}
            {mode === 'LEARN' && level === 6 && (
              <motion.div key="lvl6" className="space-y-6">
                <div className="text-center space-y-2">
                   <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.6.title')}</h2>
                   <p className="text-xs text-slate-500">{t('modules.quadratics.levels.6.desc')}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                   <div className="flex justify-between items-center mb-4">
                      <button 
                        onClick={() => setIneqProb(generateInequalityProblem())}
                        className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                         <Move className="w-3 h-3" /> {t('modules.quadratics.ui.new_problem') || "新しい問題"}
                      </button>
                      <div className="font-mono font-bold text-lg text-slate-800">
                        {ineqProb && (
                          <MathComponent tex={`${ineqProb.a === 1 ? '' : (ineqProb.a === -1 ? '-' : ineqProb.a)}x^2 ${ineqProb.b < 0 ? '-' : '+'} ${Math.abs(ineqProb.b)}x ${ineqProb.c < 0 ? '-' : '+'} ${Math.abs(ineqProb.c)} ${ineqProb.sign} 0`} />
                        )}
                      </div>
                   </div>

                   {ineqProb && (
                      <QuadraticGraph 
                        {...ineqProb.graphProps}
                        width={320}
                        height={200}
                        showAxis={true}
                        highlightVertex={true}
                      />
                   )}
                   
                   <div className={`p-4 rounded-xl border text-center font-bold ${
                      ineqProb?.graphProps.inequality.solutionType === 'between' 
                      ? 'bg-blue-50 border-blue-100 text-blue-800' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                   }`}>
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-widest">Solution</div>
                      <div className="text-lg">
                        {ineqProb && <MathComponent tex={ineqProb.solutionText} />}
                      </div>
                   </div>
                </div>

                <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">
                   {t('modules.quadratics.levels.6.next_lesson')}
                </button>
              </motion.div>
            )}

            {/* LEVEL 7: INTERSECTION */}
            {mode === 'LEARN' && level === 7 && (
              <motion.div key="lvl7" className="space-y-6">
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.7.title')}</h2>
                    <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.7.desc')}} />
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>{t('modules.quadratics.levels.7.slope')}</span>
                          <span>m = {m.toFixed(1)}</span>
                       </div>
                       <input type="range" min="-2" max="2" step="0.1" value={m} onChange={e => setM(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-emerald-600" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>{t('modules.quadratics.levels.7.intercept')}</span>
                          <span>k = {k.toFixed(1)}</span>
                       </div>
                       <input type="range" min="-4" max="2" step="0.1" value={k} onChange={e => setK(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-emerald-600" />
                    </div>
                 </div>

                 <div className={`p-4 rounded-xl border text-center font-bold ${
                    (m*m + 2*k) > 0.01 ? 'bg-blue-50 border-blue-100 text-blue-800' : 
                    (m*m + 2*k) < -0.01 ? 'bg-slate-100 border-slate-200 text-slate-500' : 
                    'bg-amber-50 border-amber-100 text-amber-800'
                 }`}>
                    {(m*m + 2*k) > 0.01 ? t('modules.quadratics.levels.7.status_2') : 
                     (m*m + 2*k) < -0.01 ? t('modules.quadratics.levels.7.status_0') : 
                     t('modules.quadratics.levels.7.status_1')}
                 </div>

                 <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">
                    {t('modules.quadratics.levels.7.next_lesson')}
                 </button>
              </motion.div>
            )}

            {/* LEVEL 8: DETERMINATION */}
            {mode === 'LEARN' && level === 8 && (
              <motion.div key="lvl8" className="space-y-6">
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.8.title')}</h2>
                    <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.8.desc')}} />
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-6">
                    <div className="flex justify-center gap-8 mb-2">
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Vertex</div>
                            <div className="font-mono font-bold text-slate-700">(2, 1)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-pink-400 font-bold uppercase">{t('modules.quadratics.levels.8.target_point')}</div>
                            <div className="font-mono font-bold text-pink-600">A(4, 5)</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>{t('modules.quadratics.levels.0.coeff_a')}</span>
                          <span>a = {detA.toFixed(1)}</span>
                       </div>
                       <input type="range" min="0.1" max="2.0" step="0.1" value={detA} onChange={e => setDetA(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-indigo-600" />
                    </div>
                 </div>

                 {Math.abs(detA - 1.0) < 0.05 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t('modules.quadratics.levels.8.match')}
                    </motion.div>
                 )}

                 {Math.abs(detA - 1.0) < 0.05 && (
                    <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">
                        {t('modules.quadratics.levels.8.next_lesson')}
                    </button>
                 )}
              </motion.div>
            )}

             {/* LEVEL 9: GRAPH TRANSLATION (NEW) */}
             {mode === 'LEARN' && level === 9 && (
              <motion.div key="lvl9" className="space-y-6">
                 <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.9.title')}</h2>
                    <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.9.desc')}} />
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-6">
                    <div className="flex justify-center gap-2 mb-2">
                         <div className="text-sm font-bold text-blue-600">y - {transQ.toFixed(1)} = 2(x - {transP.toFixed(1)})²</div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-2">
                           <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>{t('modules.quadratics.levels.9.move_p')}</span>
                              <span>p = {transP.toFixed(1)}</span>
                           </div>
                           <input type="range" min="-3" max="3" step="0.5" value={transP} onChange={e => setTransP(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-blue-600" />
                       </div>
                       
                       <div className="space-y-2">
                           <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>{t('modules.quadratics.levels.9.move_q')}</span>
                              <span>q = {transQ.toFixed(1)}</span>
                           </div>
                           <input type="range" min="-3" max="3" step="0.5" value={transQ} onChange={e => setTransQ(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg accent-blue-600" />
                       </div>
                    </div>
                 </div>

                 {Math.abs(transP - 1.0) < 0.1 && Math.abs(transQ - 1.0) < 0.1 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t('modules.quadratics.levels.9.match')}
                    </motion.div>
                 )}

                 {Math.abs(transP - 1.0) < 0.1 && Math.abs(transQ - 1.0) < 0.1 && (
                    <button onClick={() => dispatch({type: 'NEXT_LEVEL'})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors">
                        {t('modules.quadratics.levels.9.next_lesson')}
                    </button>
                 )}
              </motion.div>
            )}

            {/* LEVEL 10: COEFFICIENT ANALYSIS */}
            {mode === 'LEARN' && level === 10 && (
              <motion.div key="lvl10" className="space-y-6">
                <div className="text-center space-y-2">
                   <h2 className="text-xl font-bold text-slate-900">{t('modules.quadratics.levels.10.title')}</h2>
                   <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{__html: t('modules.quadratics.levels.10.desc')}} />
                </div>

                <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                   {[
                     { k: 'a', label: 'a (開き)', options: ['+', '0', '-'], ans: '+' },
                     { k: 'b', label: 'b (軸)', options: ['+', '0', '-'], ans: '-' },
                     { k: 'c', label: 'c (切片)', options: ['+', '0', '-'], ans: '+' },
                     { k: 'D', label: 'D (交点)', options: ['+', '0', '-'], ans: '+' },
                   ].map((item) => (
                      <div key={item.k} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                         <span className="font-bold text-slate-700 w-24 text-sm font-mono">{item.k}</span>
                         <div className="flex gap-2">
                            {['+', '0', '-'].map(opt => (
                               <button 
                                 key={opt}
                                 onClick={() => { 
                                     setSigns(prev => ({...prev, [item.k]: opt})); 
                                     setShowSignFeedback(false); 
                                 }}
                                 className={`w-10 h-8 rounded-lg font-bold text-xs transition-all ${
                                     signs[item.k as keyof typeof signs] === opt 
                                     ? 'bg-blue-600 text-white shadow-md scale-105' 
                                     : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-200 hover:text-blue-500'
                                 }`}
                               >
                                 {opt}
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>

                <AnimatePresence>
                {showSignFeedback && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                     animate={{ opacity: 1, y: 0, scale: 1 }} 
                     className={`p-5 rounded-xl border shadow-sm text-center font-bold text-sm ${
                      signs.a === '+' && signs.b === '-' && signs.c === '+' && signs.D === '+' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                      : 'bg-red-50 text-red-800 border-red-100'
                   }`}>
                      {signs.a === '+' && signs.b === '-' && signs.c === '+' && signs.D === '+' 
                        ? (
                          <div className="flex flex-col items-center gap-3">
                             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle className="w-6 h-6" /> <span className="text-lg">{t('modules.quadratics.levels.10.correct')}</span></div>
                             <p className="text-xs font-normal text-emerald-700 leading-relaxed max-w-xs">
                                Correct! The graph opens up (a+), axis is positive x (b-), y-intercept is positive (c+), and it intersects twice (D+).
                             </p>
                             <button onClick={() => { dispatch({type: 'SWITCH_MODE', payload: 'TACTICS'}); nextTactics(); }} className="mt-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                {t('modules.quadratics.levels.10.next_lesson')} <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                        )
                        : (
                          <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-2 text-red-600"><XCircle className="w-6 h-6" /> <span className="text-lg">{t('modules.quadratics.levels.10.wrong')}</span></div>
                             <p className="text-xs font-normal text-red-600">Hint: Check the y-intercept (c) and the axis position (b).</p>
                          </div>
                        )
                      }
                   </motion.div>
                )}
                </AnimatePresence>
                
                {!showSignFeedback && (
                   <button 
                     onClick={() => setShowSignFeedback(true)} 
                     disabled={Object.values(signs).some(v => v === '')} 
                     className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                   >
                      {t('modules.quadratics.ui.check_answer') || "判定を実行"}
                   </button>
                )}
              </motion.div>
            )}

            {/* TACTICS MODE */}
            {mode === 'TACTICS' && (
              <motion.div key={currentQ.generalForm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest"><FileText className="w-4 h-4" /> {t('modules.quadratics.tactics.drill_label')}</div>
                    <h3 className="text-sm font-medium leading-relaxed text-slate-800"><MathComponent tex={currentQ.instruction} /></h3>
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100"><MathComponent tex={currentQ.generalForm} className="text-xl font-bold text-slate-900" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    {currentQ.options.map((opt) => (
                       <button key={opt} onClick={() => checkTacticsAnswer(opt)} disabled={feedback.status === 'correct'} className={`py-4 rounded-xl font-mono font-bold border transition-all ${selectedOption === opt ? (opt === currentQ.answer ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-red-50 border-red-500 text-red-700 shadow-sm') : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'}`}>
                          {opt}
                       </button>
                    ))}
                 </div>
                 <AnimatePresence>
                    {feedback.status !== 'idle' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-xl border ${feedback.status === 'correct' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                          <div className="flex items-center gap-2 mb-2">
                             {feedback.status === 'correct' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                             <span className={`font-bold ${feedback.status === 'correct' ? 'text-emerald-800' : 'text-red-800'}`}>{feedback.msg}</span>
                          </div>
                          {feedback.status === 'correct' && (
                             <>
                                <div className="text-xs text-emerald-700 leading-relaxed pl-7 space-y-2">
                                    {currentQ.explanation ? (
                                        <div className="bg-emerald-100/50 p-3 rounded-lg border border-emerald-100">
                                            <div className="font-bold mb-1 text-emerald-800">解説:</div>
                                            {currentQ.explanation.map((step, idx) => (
                                                <div key={idx} className="mb-1">
                                                    <MathComponent tex={step} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        currentQ.standardForm ? (
                                          <>
                                            {t('modules.quadratics.tactics.correct')} <MathComponent tex={currentQ.standardForm} /> {t('modules.quadratics.tactics.correct_suffix')} <MathComponent tex={currentQ.answer} /> {t('modules.quadratics.tactics.correct_suffix_2')}
                                          </>
                                        ) : (
                                          <>
                                            {t('modules.quadratics.tactics.correct')} <MathComponent tex={currentQ.answer} />
                                          </>
                                        )
                                    )}
                                </div>
                                <button onClick={nextTactics} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">{t('modules.quadratics.tactics.next_q')}</button>
                             </>
                          )}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 bg-white border-t border-slate-100 flex items-center justify-around px-6 shrink-0 z-50">
        <button onClick={() => dispatch({type: 'SWITCH_MODE', payload: 'LEARN'})} className={`flex flex-col items-center gap-1 transition-all ${mode === 'LEARN' ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}>
          <div className="w-10 h-1 rounded-full bg-blue-600 mb-1" />
          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{t('modules.quadratics.ui.learn_mode')}</span>
        </button>
        <button onClick={() => { dispatch({type: 'SWITCH_MODE', payload: 'TACTICS'}); nextTactics(); }} className={`flex flex-col items-center gap-1 transition-all ${mode === 'TACTICS' ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}>
          <div className="w-10 h-1 rounded-full bg-slate-900 mb-1" />
          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{t('modules.quadratics.ui.tactics_mode')}</span>
        </button>
      </footer>
    </div>
  );
}
