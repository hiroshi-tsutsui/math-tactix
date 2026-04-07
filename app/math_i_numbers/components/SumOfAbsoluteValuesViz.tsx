"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import HintButton from '../../components/HintButton';

export default function SumOfAbsoluteValuesViz() {
  const [numTerms, setNumTerms] = useState(3);
  const [points, setPoints] = useState<number[]>([-3, 0, 2, 4, -1]);
  const [hoverX, setHoverX] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get active points sorted
  const activePoints = useMemo(() => {
    return points.slice(0, numTerms).sort((a, b) => a - b);
  }, [numTerms, points]);

  // Calculate y for a given x
  const f = (x: number) => {
    return activePoints.reduce((sum, a) => sum + Math.abs(x - a), 0);
  };

  // Find min Y and the range of X where it occurs
  const minInfo = useMemo(() => {
    if (numTerms === 0) return { minX: [0], minY: 0 };
    if (numTerms % 2 === 1) {
      const median = activePoints[Math.floor(numTerms / 2)];
      return { minX: [median], minY: f(median) };
    } else {
      const m1 = activePoints[numTerms / 2 - 1];
      const m2 = activePoints[numTerms / 2];
      return { minX: [m1, m2], minY: f(m1) };
    }
  }, [activePoints, numTerms]);

  // Render Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid config
    const rangeX = 12; // -6 to 6
    const rangeY = 20; // -2 to 18
    const scaleX = width / rangeX;
    const scaleY = height / rangeY;
    const originX = width / 2;
    const originY = height - (2 * scaleY); // y=0 is 2 units from bottom

    const toScrX = (x: number) => originX + x * scaleX;
    const toScrY = (y: number) => originY - y * scaleY;

    // Draw Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let x = -6; x <= 6; x++) {
      ctx.beginPath();
      ctx.moveTo(toScrX(x), 0);
      ctx.lineTo(toScrX(x), height);
      ctx.stroke();
    }
    for (let y = -2; y <= 18; y+=2) {
      ctx.beginPath();
      ctx.moveTo(0, toScrY(y));
      ctx.lineTo(width, toScrY(y));
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw Function
    ctx.strokeStyle = '#3b82f6'; // Blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    let isFirst = true;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / scaleX;
      const mathY = f(mathX);
      const py = toScrY(mathY);
      if (isFirst) {
        ctx.moveTo(px, py);
        isFirst = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Minimum Highlight
    ctx.strokeStyle = '#ef4444'; // Red
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (minInfo.minX.length === 1) {
      // Point min
      const mx = toScrX(minInfo.minX[0]);
      const my = toScrY(minInfo.minY);
      ctx.arc(mx, my, 5, 0, 2*Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    } else {
      // Segment min
      const mx1 = toScrX(minInfo.minX[0]);
      const mx2 = toScrX(minInfo.minX[1]);
      const my = toScrY(minInfo.minY);
      ctx.moveTo(mx1, my);
      ctx.lineTo(mx2, my);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mx1, my, 5, 0, 2*Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx2, my, 5, 0, 2*Math.PI);
      ctx.fill();
    }

    // Draw Active Points on X-axis
    activePoints.forEach((a, i) => {
      const px = toScrX(a);
      const py = originY;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981'; // Green
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#065f46';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`a${i+1}`, px, py + 20);
    });

  }, [activePoints, minInfo]);

  // Handle Dragging
  const handleCanvasDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const mathX = (x - canvas.width / 2) / (canvas.width / 12);
    
    // Find closest point to drag
    let closestIdx = -1;
    let minDist = Infinity;
    activePoints.forEach((a, i) => {
      const dist = Math.abs(a - mathX);
      if (dist < 0.5 && dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    if (closestIdx !== -1) {
      const newActive = [...activePoints];
      newActive[closestIdx] = Math.max(-5, Math.min(5, Math.round(mathX * 2) / 2));
      
      // Reconstruct points array to maintain non-active points
      const newPoints = [...points];
      // Find the original index of this point
      const origVal = activePoints[closestIdx];
      const origIdx = points.findIndex(p => p === origVal);
      if (origIdx !== -1) {
         newPoints[origIdx] = newActive[closestIdx];
         setPoints(newPoints);
      }
    }
  };

  const exprStr = activePoints.map(a => `|x ${a < 0 ? '+' : '-'} ${Math.abs(a)}|`).join(' + ');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">絶対値の和のグラフと最小値</h3>
        <p className="text-gray-600 text-sm">
          複数の絶対値の和 <InlineMath math={"y = \\sum |x - a_i|"} /> のグラフは、バケツ型（折れ線）になります。<br/>
          項数（絶対値の数）が奇数か偶数かで、最小値をとる <InlineMath math="x" /> の位置が変わることを視覚的に確認しましょう。
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full max-w-md">
          <label className="text-gray-700 font-semibold whitespace-nowrap">項数 (n): {numTerms}</label>
          <input 
            type="range" 
            min="1" max="5" step="1" 
            value={numTerms} 
            onChange={(e) => setNumTerms(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        
        <div className="text-lg text-gray-800">
          <BlockMath math={`y = ${exprStr}`} />
        </div>
      </div>

      <div className="flex justify-center relative">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="bg-white border border-gray-200 rounded-xl shadow-inner cursor-pointer"
          onMouseMove={handleCanvasDrag}
          onMouseDown={handleCanvasDrag}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-xl text-gray-700">
        <h4 className="font-bold text-gray-900 mb-2">💡 視覚的アプローチのポイント</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <strong>各区間の傾き:</strong> 折れ線の傾きは、各絶対値の中身が正か負かで決まります。<br/>
            すべての <InlineMath math="a_i" /> より右側では傾きは <InlineMath math={`+${numTerms}`} />、左側では <InlineMath math={`-${numTerms}`} /> になります。
          </li>
          <li>
            <strong>奇数個の場合 (n=1, 3, 5):</strong> 傾きが <InlineMath math="-1" /> から <InlineMath math="+1" /> に切り替わる点（＝<strong>中央値（メジアン）</strong>）で必ず最小になります。
          </li>
          <li>
            <strong>偶数個の場合 (n=2, 4):</strong> 傾きが <InlineMath math="0" /> になる区間が存在します。中央の2つの値の間では、グラフが水平になり、その<strong>区間全体</strong>で最小値をとります。
          </li>
          <li>
            緑の点（<InlineMath math="a_i" />）をドラッグして動かし、最小値の場所（赤）がどう追従するか確認してみましょう。
          </li>
        </ul>
      </div>
      <HintButton hints={[
        { step: 1, text: "|x - a| は数直線上で x と a の距離を表します。" },
        { step: 2, text: "|x - a| + |x - b| は、x から a, b までの距離の和です。" },
        { step: 3, text: "距離の和が最小になるのは、x が a と b の間にあるときです。" },
        { step: 4, text: "最小値は |a - b|（2点間の距離）となり、a ≤ x ≤ b のとき達成されます。" }
      ]} />
    </div>
  );
}
