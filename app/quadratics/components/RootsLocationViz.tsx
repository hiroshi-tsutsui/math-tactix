import React, { useRef, useEffect } from 'react';
import HintButton from '../../components/HintButton';

interface RootsLocationVizProps {
  type: 'positive' | 'negative' | 'different';
  m: number; // Current value of m from slider
  width?: number;
  height?: number;
}

const RootsLocationViz: React.FC<RootsLocationVizProps> = ({ type, m, width = 320, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const ox = w / 2;
    const oy = h / 2 + 20;
    const scale = 20;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let x = -10; x <= 10; x++) {
      ctx.beginPath();
      ctx.moveTo(ox + x * scale, 0);
      ctx.lineTo(ox + x * scale, h);
      ctx.stroke();
    }
    for (let y = -5; y <= 10; y++) {
      ctx.beginPath();
      ctx.moveTo(0, oy - y * scale);
      ctx.lineTo(w, oy - y * scale);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke(); // X-axis
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, h);
    ctx.stroke(); // Y-axis

    // Conditions Visualization (Regions on Axis)
    // Positive Roots: x > 0 region highlight
    if (type === 'positive') {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'; // Green-500
      ctx.fillRect(ox, 0, w / 2, h);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    } else if (type === 'negative') {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.fillRect(0, 0, ox, h);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    }

    // Graph f(x)
    // Type Positive: y = x^2 - 2mx + m + 2
    // Type Negative: y = x^2 + 2mx + m + 6
    // Type Different: y = x^2 - 2mx + m - 3
    
    let func = (x: number) => 0;
    let axisX = 0;
    let interceptY = 0;

    if (type === 'positive') {
      func = (x) => x * x - 2 * m * x + m + 2;
      axisX = m;
      interceptY = m + 2;
    } else if (type === 'negative') {
      func = (x) => x * x + 2 * m * x + m + 6;
      axisX = -m;
      interceptY = m + 6;
    } else {
      func = (x) => x * x - 2 * m * x + m - 3;
      axisX = m;
      interceptY = m - 3;
    }

    // Draw Parabola
    ctx.strokeStyle = '#3b82f6'; // Blue-500
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= w; px++) {
      const x = (px - ox) / scale;
      const y = func(x);
      const py = oy - y * scale;
      if (Math.abs(py) > h + 100) {
          if (!first) ctx.stroke();
          first = true;
          continue;
      }
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Axis Line (Dashed)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#ef4444'; // Red-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + axisX * scale, 0);
    ctx.lineTo(ox + axisX * scale, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Y-intercept Point (f(0))
    ctx.fillStyle = '#f59e0b'; // Amber-500
    ctx.beginPath();
    ctx.arc(ox, oy - interceptY * scale, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Roots if they exist (Real)
    // Solve f(x) = 0
    // Quadratic Formula: x = (-B +/- sqrt(D)) / 2A
    // Here A=1.
    // Positive: B = -2m, C = m+2 => D = 4m^2 - 4(m+2)
    // Negative: B = 2m, C = m+6 => D = 4m^2 - 4(m+6)
    // Different: B = -2m, C = m-3 => D = 4m^2 - 4(m-3)
    
    let D = 0;
    let B = 0;
    if (type === 'positive') { B = -2 * m; D = B * B - 4 * (m + 2); }
    else if (type === 'negative') { B = 2 * m; D = B * B - 4 * (m + 6); }
    else { B = -2 * m; D = B * B - 4 * (m - 3); }

    if (D >= 0) {
      const x1 = (-B - Math.sqrt(D)) / 2;
      const x2 = (-B + Math.sqrt(D)) / 2;
      
      ctx.fillStyle = '#ef4444'; // Red for roots
      [x1, x2].forEach(rx => {
        ctx.beginPath();
        ctx.arc(ox + rx * scale, oy, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

  }, [m, type, width, height]);

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} className="rounded-lg border border-slate-200 bg-white" />
      <HintButton hints={[
        { step: 1, text: "解の配置問題では、D ≧ 0、軸の位置、境界値 f(p) の3条件を調べます。" },
        { step: 2, text: "2解とも正: D ≧ 0、軸 > 0、f(0) > 0。2解とも負: D ≧ 0、軸 < 0、f(0) > 0。" },
        { step: 3, text: "異符号の解: f(0) < 0 だけで十分です（D > 0 は自動的に成立）。" },
      ]} />
    </div>
  );
};

export default RootsLocationViz;
