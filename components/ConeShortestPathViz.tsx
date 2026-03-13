import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ConeShortestPathViz() {
  const [r, setR] = useState(2); // Base radius
  const [l, setL] = useState(6); // Slant height
  const [targetType, setTargetType] = useState('same'); // 'same' for back to A, 'mid' for midpoint of opposite side
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const width = canvas.width = 600;
    const height = canvas.height = 400;
    ctx.clearRect(0, 0, width, height);

    // Math
    const thetaDeg = 360 * (r / l);
    const thetaRad = thetaDeg * (Math.PI / 180);
    
    // Unfolded Sector settings
    const cx = 300;
    const cy = 200;
    const drawRadius = 150; // Scaled for drawing
    
    // Draw Sector
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const startAngle = -Math.PI / 2 - thetaRad / 2;
    const endAngle = -Math.PI / 2 + thetaRad / 2;
    ctx.arc(cx, cy, drawRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = '#f0f9ff';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    const p1x = cx + drawRadius * Math.cos(startAngle);
    const p1y = cy + drawRadius * Math.sin(startAngle);
    
    let p2x, p2y, calcLen;
    if (targetType === 'same') {
      p2x = cx + drawRadius * Math.cos(endAngle);
      p2y = cy + drawRadius * Math.sin(endAngle);
      calcLen = Math.sqrt(l*l + l*l - 2*l*l*Math.cos(thetaRad)); // Cosine Rule
    } else {
      // Opposite generator line is exactly at 0 (bisector of the sector)
      const targetRadius = drawRadius / 2; // Midpoint
      const targetAngle = -Math.PI / 2; // Middle
      p2x = cx + targetRadius * Math.cos(targetAngle);
      p2y = cy + targetRadius * Math.sin(targetAngle);
      const thetaHalf = thetaRad / 2;
      calcLen = Math.sqrt(l*l + (l/2)*(l/2) - 2*l*(l/2)*Math.cos(thetaHalf));
    }

    // Draw Shortest Path Line
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#0f172a';
    ctx.font = '14px Arial';
    ctx.fillText('O', cx - 5, cy - 10);
    ctx.fillText('A', p1x - 10, p1y + 20);
    if (targetType === 'same') {
      ctx.fillText("A'", p2x + 5, p2y + 20);
    } else {
      ctx.fillText("M (中点)", p2x + 10, p2y - 10);
    }
    
    // Angle Arc
    ctx.beginPath();
    ctx.arc(cx, cy, 30, startAngle, endAngle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw calculated length text in canvas
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';
    const midX = (p1x + p2x) / 2;
    const midY = (p1y + p2y) / 2;
    ctx.fillText('最短距離 (直線)', midX, midY - 10);
    
  }, [r, l, targetType]);

  const thetaDeg = 360 * (r / l);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">円錐の展開図と最短距離</h3>
      
      <div className="w-full flex justify-between gap-4 mb-6">
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-semibold text-slate-700 mb-1">
            母線の長さ (l): {l}
          </label>
          <input 
            type="range" 
            min={r + 1} 
            max="12" 
            step="1" 
            value={l} 
            onChange={(e) => setL(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-semibold text-slate-700 mb-1">
            底面の半径 (r): {r}
          </label>
          <input 
            type="range" 
            min="1" 
            max={l - 1} 
            step="1" 
            value={r} 
            onChange={(e) => setR(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setTargetType('same')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${targetType === 'same' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          1周して戻る (A → A')
        </button>
        <button 
          onClick={() => setTargetType('mid')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${targetType === 'mid' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          反対側の中点へ (A → M)
        </button>
      </div>

      <div className="flex items-center justify-center bg-slate-50 w-full rounded-lg border border-slate-200 p-4">
        <canvas ref={canvasRef} className="max-w-full" style={{ width: '600px', height: '400px' }} />
      </div>

      <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mt-6 text-sm">
        <div className="font-bold mb-2">展開図の中心角 θ</div>
        <p className="mb-2">
          底面の円周と展開図の弧の長さは等しいため、<br/>
          {"$2\\pi r = 2\\pi l \\times \\frac{\\theta}{360^\\circ}$ より、"}
          <strong>{"$\\theta = 360^\\circ \\times \\frac{r}{l} = " + thetaDeg.toFixed(1) + "^\\circ$"}</strong>
        </p>
        
        <div className="font-bold mt-4 mb-2">最短距離の求め方</div>
        {targetType === 'same' ? (
          <p>
            出発点Aから一周して戻る最短経路は、展開図上では <strong>AとA'を結ぶ直線</strong> になります。<br/>
            △OAA' において余弦定理を用いると：<br/>
            {"$AA'^2 = " + l + "^2 + " + l + "^2 - 2 \\cdot " + l + " \\cdot " + l + " \\cos(" + thetaDeg.toFixed(1) + "^\\circ)$"}
          </p>
        ) : (
          <p>
            反対側の母線の中点Mへの最短経路は、展開図上では <strong>AとMを結ぶ直線</strong> になります。<br/>
            {"Mは中心角を二等分する直線上にあるため、間の角は $\\frac{\\theta}{2} = " + (thetaDeg / 2).toFixed(1) + "^\\circ$ となります。"}<br/>
            △OAM において余弦定理を用いると：<br/>
            {"$AM^2 = " + l + "^2 + " + (l/2).toFixed(1) + "^2 - 2 \\cdot " + l + " \\cdot " + (l/2).toFixed(1) + " \\cos(" + (thetaDeg / 2).toFixed(1) + "^\\circ)$"}
          </p>
        )}
      </div>
    </div>
  );
}
