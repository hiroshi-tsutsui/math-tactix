import fs from 'fs';

const newContent = `import React, { useState, useEffect, useRef } from 'react';

interface DeterminationVizProps {
  params: any;
}

const DeterminationViz: React.FC<DeterminationVizProps> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userA, setUserA] = useState(1);
  const [userB, setUserB] = useState(0); // Also used as 'p' or 'alpha'
  const [userC, setUserC] = useState(0); // Also used as 'q' or 'beta'

  useEffect(() => {
    // Reset sliders when problem changes
    setUserA(1);
    if (params.type === 'vertex_point') {
        setUserB(0); // p
        setUserC(0); // q
    } else if (params.type === 'intercepts_point') {
        setUserB(-2); // alpha
        setUserC(2);  // beta
    } else if (params.type === 'axis_points') {
        setUserB(0); // axis
        setUserC(0); // q
    } else {
        setUserB(0); // b
        setUserC(0); // c
    }
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30; // Pixels per unit

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y
    ctx.stroke();

    // Helper: Plot Point
    const plotPoint = (x: number, y: number, color: string, label?: string) => {
      const px = centerX + x * scale;
      const py = centerY - y * scale;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (label) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(label, px + 8, py - 8);
      }
    };

    // Helper: Draw Parabola
    const drawParabola = (a: number, b: number, c: number, color: string, isDashed: boolean = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = isDashed ? 2 : 3;
      if (isDashed) ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);
      
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= width; px+=2) {
        const x = (px - centerX) / scale;
        const y = a * x * x + b * x + c;
        const py = centerY - y * scale;
        
        if (py >= -500 && py <= height + 500) {
          if (!started) {
               ctx.moveTo(px, py);
               started = true;
          } else {
               ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset
    };

    // Draw Target Points based on type
    if (params.type === 'vertex_point') {
      const { p, q, x1, y1, a } = params;
      plotPoint(p, q, '#dc2626', "頂点");
      plotPoint(x1, y1, '#059669', "点");
      
      // Target equation: y = a(x-p)^2 + q
      // drawParabola(a, -2*a*p, a*p*p + q, '#9ca3af', true); // Optional: hint
      
      // User equation: y = userA(x-userB)^2 + userC
      drawParabola(userA, -2*userA*userB, userA*userB*userB + userC, '#2563eb');

    } else if (params.type === 'axis_points') {
      const { axis, p1, p2, a, q } = params;
      
      // Draw Target Axis
      const pAxis = centerX + axis * scale;
      ctx.strokeStyle = '#fca5a5';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pAxis, 0); ctx.lineTo(pAxis, height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      plotPoint(p1.x, p1.y, '#059669', "点1");
      plotPoint(p2.x, p2.y, '#059669', "点2");

      // User equation: y = userA(x-userB)^2 + userC  (userB is axis)
      // Draw User Axis
      const userAxisX = centerX + userB * scale;
      ctx.strokeStyle = '#93c5fd';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(userAxisX, 0); ctx.lineTo(userAxisX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      drawParabola(userA, -2*userA*userB, userA*userB*userB + userC, '#2563eb');

    } else if (params.type === 'intercepts_point') {
      const { alpha, beta, p1, a } = params;
      plotPoint(alpha, 0, '#dc2626', "α");
      plotPoint(beta, 0, '#dc2626', "β");
      plotPoint(p1.x, p1.y, '#059669', "点");

      // User equation: y = userA(x-userB)(x-userC) = userA(x^2 - (B+C)x + BC)
      const b = -userA * (userB + userC);
      const c = userA * userB * userC;
      drawParabola(userA, b, c, '#2563eb');

    } else if (params.type === 'three_points') {
      const { p1, p2, p3, a, b, c } = params;
      plotPoint(p1.x, p1.y, '#059669', "A");
      plotPoint(p2.x, p2.y, '#059669', "B");
      plotPoint(p3.x, p3.y, '#059669', "C");
      
      // User equation: y = userA x^2 + userB x + userC
      drawParabola(userA, userB, userC, '#2563eb');
    }

  }, [params, userA, userB, userC]);

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border mt-4">
      <h4 className="font-bold text-gray-700 mb-2 text-sm border-b pb-1 w-full text-center">視覚的イメージ（係数を調整して点を通らせよう）</h4>
      
      <div className="flex flex-col lg:flex-row gap-6 w-full items-center justify-center mb-4 mt-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="border border-gray-200 rounded-lg bg-white shadow-inner"
        />
        
        <div className="flex flex-col gap-4 w-full max-w-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="text-center font-bold text-blue-600 bg-blue-50 py-2 rounded mb-2 font-mono text-lg">
            {params.type === 'vertex_point' || params.type === 'axis_points' ? (
              \`y = \${userA}(x - (\${userB}))² + (\${userC})\`
            ) : params.type === 'intercepts_point' ? (
              \`y = \${userA}(x - (\${userB}))(x - (\${userC}))\`
            ) : (
              \`y = \${userA}x² + (\${userB})x + (\${userC})\`
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 flex justify-between">
              <span>a の値（開き具合）</span>
              <span className="text-blue-600 font-mono">{userA}</span>
            </label>
            <input type="range" min="-5" max="5" step="1" value={userA} onChange={(e) => setUserA(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 flex justify-between">
              <span>
                {params.type === 'vertex_point' ? 'p の値（頂点x）' : 
                 params.type === 'axis_points' ? '軸の位置' : 
                 params.type === 'intercepts_point' ? 'α の値（x切片1）' : 'b の値'}
              </span>
              <span className="text-blue-600 font-mono">{userB}</span>
            </label>
            <input type="range" min="-5" max="5" step="1" value={userB} onChange={(e) => setUserB(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600 flex justify-between">
              <span>
                {params.type === 'vertex_point' ? 'q の値（頂点y）' : 
                 params.type === 'axis_points' ? 'q の値（頂点y）' : 
                 params.type === 'intercepts_point' ? 'β の値（x切片2）' : 'c の値'}
              </span>
              <span className="text-blue-600 font-mono">{userC}</span>
            </label>
            <input type="range" min="-5" max="5" step="1" value={userC} onChange={(e) => setUserC(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex gap-6">
        <div className="flex items-center gap-1">
            <span className="w-4 h-1 bg-blue-600 inline-block rounded"></span>
            <span>あなたの放物線</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 inline-block rounded-full"></span>
            <span>条件 (頂点・切片)</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-600 inline-block rounded-full"></span>
            <span>通るべき点</span>
        </div>
      </div>
    </div>
  );
};

export default DeterminationViz;
`;
fs.writeFileSync('app/quadratics/components/DeterminationViz.tsx', newContent);
