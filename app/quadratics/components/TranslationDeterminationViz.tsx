
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HintButton from '../../components/HintButton';

export default function TranslationDeterminationViz() {
  const [p, setP] = useState(0); // x-translation
  const [q, setQ] = useState(0); // y-translation

  // Parabola 1: y = x^2 - 4x + 5 (Vertex: (2, 1))
  // Parabola 2: y = x^2 + 2x - 1 (Vertex: (-1, -2))
  // Target translation: p = -3, q = -3

  const isMatched = p === -3 && q === -3;

  // Render parabolas
  const renderParabola = (offsetX: number, offsetY: number, color: string) => {
    let path = '';
    for (let x = -6; x <= 6; x += 0.2) {
      // Base is y = x^2
      const cx = x - offsetX;
      const cy = Math.pow(cx, 2) + offsetY;
      const svgX = 150 + x * 20;
      const svgY = 150 - cy * 20;
      if (x === -6) path += `M ${svgX} ${svgY} `;
      else path += `L ${svgX} ${svgY} `;
    }
    return <path d={path} fill="none" stroke={color} strokeWidth="2" />;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl w-full max-w-2xl mx-auto shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-800">放物線の平行移動の決定</h3>
      
      <div className="w-full h-72 border border-gray-300 rounded-lg relative overflow-hidden bg-white mb-6">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Grid and Axes */}
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1={0} y1={i * 20} x2={300} y2={i * 20} stroke="#e5e7eb" strokeWidth="1" />
              <line x1={i * 20} y1={0} x2={i * 20} y2={300} stroke="#e5e7eb" strokeWidth="1" />
            </React.Fragment>
          ))}
          <line x1={150} y1={0} x2={150} y2={300} stroke="#9ca3af" strokeWidth="2" />
          <line x1={0} y1={150} x2={300} y2={150} stroke="#9ca3af" strokeWidth="2" />
          
          {/* Target Parabola 2 */}
          {renderParabola(-1, -2, '#d1d5db')}
          
          {/* Original Parabola 1 moving */}
          {renderParabola(2 + p, 1 + q, isMatched ? '#10b981' : '#3b82f6')}
          
          {/* Vertices */}
          <circle cx={150 + (-1) * 20} cy={150 - (-2) * 20} r="4" fill="#6b7280" />
          <circle cx={150 + (2 + p) * 20} cy={150 - (1 + q) * 20} r="4" fill={isMatched ? '#10b981' : '#2563eb'} />
          
          {/* Translation Vector */}
          <path d={`M ${150 + 2 * 20} ${150 - 1 * 20} L ${150 + (2 + p) * 20} ${150 - (1 + q) * 20}`} stroke="red" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="text-center text-sm text-gray-700 font-mono mb-2">
          移動前: y = x² - 4x + 5 (頂点: 2, 1) <br/>
          移動後: y = x² + 2x - 1 (頂点: -1, -2)
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>x軸方向の平行移動 (p)</span>
              <span>{p}</span>
            </div>
            <input type="range" min="-6" max="6" step="1" value={p} onChange={(e) => setP(Number(e.target.value))} className="w-full mt-2 accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>y軸方向の平行移動 (q)</span>
              <span>{q}</span>
            </div>
            <input type="range" min="-6" max="6" step="1" value={q} onChange={(e) => setQ(Number(e.target.value))} className="w-full mt-2 accent-blue-600" />
          </div>
        </div>

        {isMatched && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm font-medium text-center">
            正解！ 頂点を比較すると、x軸方向に -3、y軸方向に -3 移動すれば一致することが視覚的に分かります。
          </motion.div>
        )}
      
      <HintButton hints={[
        { step: 1, text: "2つの放物線の頂点を比較して、平行移動の量を求めます。" },
        { step: 2, text: "頂点が (p₁, q₁) から (p₂, q₂) に移動するので、移動量は (p₂-p₁, q₂-q₁) です。" },
        { step: 3, text: "x 軸方向に p₂-p₁、y 軸方向に q₂-q₁ だけ平行移動すれば一致します。" },
      ]} />
    </div>
    </div>
  );
}
