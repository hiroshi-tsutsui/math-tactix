import React, { useState, useEffect, useRef } from 'react';
import HintButton from '../../components/HintButton';

export const ExternalTangentViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointX, setPointX] = useState(1);
  const [pointY, setPointY] = useState(-2);
  const [currentSlope, setCurrentSlope] = useState(0);
  const [isTangent, setIsTangent] = useState(false);
  const [slope1, setSlope1] = useState<number | null>(null);
  const [slope2, setSlope2] = useState<number | null>(null);

  // Parabola: y = x^2
  const a = 1;
  const b = 0;
  const c = 0;

  useEffect(() => {
    // Calculate exact tangent slopes using D = 0
    // Line: y - q = m(x - p) => y = mx - mp + q
    // Intersection: x^2 = mx - mp + q => x^2 - mx + (mp - q) = 0
    // D = m^2 - 4(mp - q) = 0 => m^2 - 4pm + 4q = 0
    // m = (4p +- sqrt(16p^2 - 16q)) / 2 = 2p +- 2*sqrt(p^2 - q)
    const discriminant_m = 16 * pointX * pointX - 16 * pointY;
    if (discriminant_m >= 0) {
      const s1 = (4 * pointX + Math.sqrt(discriminant_m)) / 2;
      const s2 = (4 * pointX - Math.sqrt(discriminant_m)) / 2;
      setSlope1(s1);
      setSlope2(s2);
    } else {
      setSlope1(null);
      setSlope2(null);
    }
  }, [pointX, pointY]);

  useEffect(() => {
    if (slope1 !== null && slope2 !== null) {
      const isTang1 = Math.abs(currentSlope - slope1) < 0.1;
      const isTang2 = Math.abs(currentSlope - slope2) < 0.1;
      setIsTangent(isTang1 || isTang2);
    } else {
      setIsTangent(false);
    }
  }, [currentSlope, slope1, slope2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 50; // Shift down a bit
    const scale = 40;

    const toScreenX = (x: number) => centerX + x * scale;
    const toScreenY = (y: number) => centerY - y * scale;

    ctx.clearRect(0, 0, width, height);

    // Draw grid and axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(0, toScreenY(i)); ctx.lineTo(width, toScreenY(i)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(toScreenX(i), 0); ctx.lineTo(toScreenX(i), height); ctx.stroke();
    }
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke(); // X
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke(); // Y

    // Draw Parabola y = x^2
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -5; x <= 5; x += 0.1) {
      const y = a * x * x + b * x + c;
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (x === -5) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Draw Line y = m(x - p) + q
    // m = currentSlope
    ctx.strokeStyle = isTangent ? '#eab308' : '#ef4444'; // Yellow if tangent, else red
    ctx.lineWidth = isTangent ? 4 : 2;
    ctx.beginPath();
    const xLeft = -10;
    const yLeft = currentSlope * (xLeft - pointX) + pointY;
    const xRight = 10;
    const yRight = currentSlope * (xRight - pointX) + pointY;
    ctx.moveTo(toScreenX(xLeft), toScreenY(yLeft));
    ctx.lineTo(toScreenX(xRight), toScreenY(yRight));
    ctx.stroke();

    // Draw external point
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(toScreenX(pointX), toScreenY(pointY), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(`P(${pointX}, ${pointY})`, toScreenX(pointX) + 10, toScreenY(pointY) - 10);

  }, [pointX, pointY, currentSlope, isTangent]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
        <canvas ref={canvasRef} width={500} height={400} className="w-full h-auto" />
      </div>

      <div className="w-full max-w-md p-4 bg-gray-50 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            定点 P のx座標 (p: {pointX})
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.5"
            value={pointX}
            onChange={(e) => setPointX(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            定点 P のy座標 (q: {pointY})
          </label>
          <input
            type="range"
            min="-4"
            max="0"
            step="0.5"
            value={pointY}
            onChange={(e) => setPointY(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            直線の傾き (m: {currentSlope.toFixed(1)})
          </label>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            value={currentSlope}
            onChange={(e) => setCurrentSlope(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">解析 (D = 0)</p>
          <p className="text-xs text-gray-600 font-mono">
            直線: y = m(x - {pointX}) + ({pointY})<br />
            放物線: y = x²<br />
            {slope1 !== null && slope2 !== null ? (
              <span className="text-green-600 font-bold">
                接線の傾きの理論値: m = {slope1.toFixed(2)}, {slope2.toFixed(2)}
              </span>
            ) : (
              <span className="text-red-600 font-bold">
                接線は存在しません (放物線の内側)
              </span>
            )}
          </p>
          {isTangent && (
            <p className="mt-2 text-sm text-yellow-600 font-bold flex items-center">
              <span className="mr-1">✨</span> 接線になりました！ (D = 0)
            </p>
          )}
        </div>
      
      <HintButton hints={[
        { step: 1, text: "外部の点から放物線に引いた接線は、一般に2本存在します。" },
        { step: 2, text: "接線 y - q = m(x - p) と放物線の連立方程式の判別式 D = 0 から m を求めます。" },
        { step: 3, text: "D = 0 の条件から m の2次方程式が得られ、その2解が2本の接線の傾きです。" },
      ]} />
    </div>
    </div>
  );
};
