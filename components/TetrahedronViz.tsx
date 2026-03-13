import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TetrahedronViz() {
  const [a, setA] = useState(6); // Side length
  const [step, setStep] = useState(1); // 1: Height, 2: Volume & Inradius, 3: Circumradius
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Geometric calculations
  const heightAH = (Math.sqrt(6) / 3) * a;
  const baseAreaS = (Math.sqrt(3) / 4) * a * a;
  const volumeV = (1 / 3) * baseAreaS * heightAH; // = √2/12 a^3
  const inradiusR = heightAH / 4; // = √6/12 a
  const circumradiusR = (3 * heightAH) / 4; // = √6/4 a

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 600;
    const height = canvas.height = 400;
    ctx.clearRect(0, 0, width, height);

    // 3D Isometric projection of a tetrahedron
    const cx = width / 2;
    const cy = height / 2 + 50;
    const scale = 30; // Scale factor for side length 'a'
    const L = a * scale;

    // Define 3D coordinates relative to center of base
    // Base triangle BCD in XZ plane. Edge CD parallel to X.
    const B3 = { x: 0, y: 0, z: (L * Math.sqrt(3)) / 3 };
    const C3 = { x: L / 2, y: 0, z: -(L * Math.sqrt(3)) / 6 };
    const D3 = { x: -L / 2, y: 0, z: -(L * Math.sqrt(3)) / 6 };
    // Apex A
    const H3 = { x: 0, y: 0, z: 0 }; // Base center
    const A3 = { x: 0, y: -heightAH * scale, z: 0 }; // Height is in negative Y direction for canvas

    // Simple isometric projection
    const project = (p3: {x: number, y: number, z: number}) => {
      // Rotate around X slightly to look down
      const rx = 0.5; // pitch
      const ry = 0.3; // yaw
      
      // Yaw
      const x1 = p3.x * Math.cos(ry) - p3.z * Math.sin(ry);
      const z1 = p3.x * Math.sin(ry) + p3.z * Math.cos(ry);
      const y1 = p3.y;
      
      // Pitch
      const x2 = x1;
      const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
      
      return { x: cx + x2, y: cy + y2 };
    };

    const A = project(A3);
    const B = project(B3);
    const C = project(C3);
    const D = project(D3);
    const H = project(H3);

    const drawLine = (p1: {x: number, y: number}, p2: {x: number, y: number}, color: string, dash = false, width = 2) => {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      if (dash) ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);
      ctx.stroke();
    };

    const drawText = (text: string, p: {x: number, y: number}, offset = {x:0, y:0}) => {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(text, p.x + offset.x, p.y + offset.y);
    };

    // Fill Base BCD
    ctx.beginPath();
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
    ctx.fill();

    // Draw solid edges (A-B, A-C, B-C, C-D)
    drawLine(A, B, '#334155');
    drawLine(A, C, '#334155');
    drawLine(B, C, '#334155');
    drawLine(C, D, '#334155');

    // Draw dashed edges (hidden: A-D, B-D)
    drawLine(A, D, '#94a3b8', true);
    drawLine(B, D, '#94a3b8', true);

    // Labels
    drawText('A', A, {x: -5, y: -10});
    drawText('B', B, {x: -20, y: 15});
    drawText('C', C, {x: 10, y: 15});
    drawText('D', D, {x: -20, y: -10});

    if (step >= 1) {
      // Draw Height AH
      drawLine(A, H, '#ef4444', true, 3);
      drawText('H', H, {x: 5, y: 15});
      // Highlight Right Triangle ABH
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(H.x, H.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fill();
      drawLine(B, H, '#ef4444', true, 2);
    }

    if (step === 2) {
      // Inscribed Sphere Center (O)
      const O3 = { x: 0, y: -(inradiusR * scale), z: 0 };
      const O = project(O3);
      ctx.beginPath();
      ctx.arc(O.x, O.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      drawText('O', O, {x: 10, y: 5});
      // Radius OH
      drawLine(O, H, '#3b82f6', false, 3);
      
      // Draw a subtle circle for the inscribed sphere
      ctx.beginPath();
      ctx.arc(O.x, O.y, inradiusR * scale * Math.cos(0.5), 0, 2 * Math.PI); // rough projection
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();
    }

    if (step === 3) {
      // Circumscribed Sphere Center (O') is actually same point O because it's a regular tetrahedron!
      const O3 = { x: 0, y: -(inradiusR * scale), z: 0 };
      const O = project(O3);
      ctx.beginPath();
      ctx.arc(O.x, O.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
      drawText('O', O, {x: 10, y: 5});
      
      // Radius OA
      drawLine(O, A, '#8b5cf6', false, 3);

      // Draw a subtle larger circle
      ctx.beginPath();
      ctx.arc(O.x, O.y, circumradiusR * scale * Math.cos(0.5), 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();
    }

  }, [a, step, heightAH, inradiusR, circumradiusR]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">正四面体の計量 (Regular Tetrahedron)</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-video bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 flex gap-2">
              <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">3D View</span>
              {step === 1 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">高さ (Height)</span>}
              {step === 2 && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">内接球 (Inradius)</span>}
              {step === 3 && <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded">外接球 (Circumradius)</span>}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">1辺の長さ a = {a}</label>
              <input 
                type="range" 
                min="2" max="12" step="1" 
                value={a} 
                onChange={(e) => setA(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setStep(1)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded ${step === 1 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}
              >
                1. 高さ・体積
              </button>
              <button 
                onClick={() => setStep(2)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded ${step === 2 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'}`}
              >
                2. 内接球
              </button>
              <button 
                onClick={() => setStep(3)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded ${step === 3 ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-600'}`}
              >
                3. 外接球
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[160px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h4 className="font-bold text-red-700 mb-2 border-b border-red-200 pb-1">高さと体積の求め方</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>・頂点Aから底面BCDに下ろした垂線の足Hは、△BCDの<strong>重心</strong>（外心）に一致する。</li>
                    <li>・BHの長さは、正三角形の高さの2/3: <span className="font-mono bg-white px-1 border border-slate-200 rounded">√3/3 a</span> = {((Math.sqrt(3)/3)*a).toFixed(2)}</li>
                    <li>・直角三角形△ABHで三平方の定理より: <span className="font-mono bg-white px-1 border border-slate-200 rounded">AH = √(a² - BH²) = √6/3 a</span> = {heightAH.toFixed(2)}</li>
                    <li>・体積 V = 1/3 × (√3/4 a²) × AH = <span className="font-mono font-bold bg-white px-1 border border-slate-200 rounded">√2/12 a³</span> = {volumeV.toFixed(2)}</li>
                  </ul>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h4 className="font-bold text-blue-700 mb-2 border-b border-blue-200 pb-1">内接球の半径 (r)</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>・内接球の中心Oから、正四面体を4つの小さな三角錐に分割する。</li>
                    <li>・各三角錐の高さが r になる。</li>
                    <li>・全体の体積 V = 4 × (1/3 × 底面積S × r)</li>
                    <li>・整理すると <strong>r = AH / 4 = √6/12 a</strong> = {inradiusR.toFixed(2)}</li>
                    <li className="text-xs text-blue-600 font-bold bg-blue-50 p-1 rounded">※ 重心は高さを 3:1 に内分する！</li>
                  </ul>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h4 className="font-bold text-purple-700 mb-2 border-b border-purple-200 pb-1">外接球の半径 (R)</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>・外接球の中心は内接球の中心Oと一致する。</li>
                    <li>・頂点Aまでの距離が外接球の半径 R となる。</li>
                    <li>・AH = R + r であるため、残りの <strong>R = 3/4 AH</strong> となる。</li>
                    <li>・計算すると <strong>R = √6/4 a</strong> = {circumradiusR.toFixed(2)}</li>
                    <li className="text-xs text-purple-600 font-bold bg-purple-50 p-1 rounded">※ 外接球の半径は内接球の半径のちょうど3倍！</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
