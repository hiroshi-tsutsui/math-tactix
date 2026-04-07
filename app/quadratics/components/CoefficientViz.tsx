import React from 'react';
import HintButton from '../../components/HintButton';

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface CoefficientVizProps {
  params: {
    points: Point[];
    vertex?: { x: number; y: number };
    a: number;
    b: number;
    c: number;
  };
}

const CoefficientViz: React.FC<CoefficientVizProps> = ({ params }) => {
  const { points, vertex, a, b, c } = params;

  // Scale settings
  const width = 400;
  const height = 300;
  const scaleX = 30; // 1 unit = 30px
  const scaleY = 30;
  const originX = width / 2;
  const originY = height / 2;

  // Coordinate conversion
  const toScreenX = (x: number) => originX + x * scaleX;
  const toScreenY = (y: number) => originY - y * scaleY;

  // Generate path data for parabola
  const generatePath = () => {
    let d = '';
    const startX = -6;
    const endX = 6;
    const step = 0.1;
    
    for (let x = startX; x <= endX; x += step) {
      // y = a(x-p)^2 + q OR ax^2 + bx + c
      // We have a, b, c directly available (calculated in generator)
      const y = a * x * x + b * x + c;
      
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      
      if (x === startX) d += `M ${sx} ${sy}`;
      else d += ` L ${sx} ${sy}`;
    }
    return d;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative border border-gray-300 rounded bg-white shadow-sm overflow-hidden" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid */}
          <defs>
            <pattern id="grid" width={scaleX} height={scaleY} patternUnits="userSpaceOnUse">
              <path d={`M ${scaleX} 0 L 0 0 0 ${scaleY}`} fill="none" stroke="#eee" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1="0" y1={originY} x2={width} y2={originY} stroke="#666" strokeWidth="2" />
          <line x1={originX} y1="0" x2={originX} y2={height} stroke="#666" strokeWidth="2" />
          
          {/* Parabola */}
          <path d={generatePath()} fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.8" />
          
          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={toScreenX(p.x)} cy={toScreenY(p.y)} r="5" fill="#ef4444" stroke="white" strokeWidth="2" />
              <text x={toScreenX(p.x) + 8} y={toScreenY(p.y) - 8} fontSize="12" fill="#ef4444" fontWeight="bold">
                ({p.x}, {p.y})
              </text>
            </g>
          ))}
          
          {/* Vertex (if provided) */}
          {vertex && (
            <g>
              <circle cx={toScreenX(vertex.x)} cy={toScreenY(vertex.y)} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
              <text x={toScreenX(vertex.x) + 8} y={toScreenY(vertex.y) + 20} fontSize="12" fill="#10b981" fontWeight="bold">
                Vertex ({vertex.x}, {vertex.y})
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        赤: 通る点 / 緑: 頂点 (Vertex)
      </p>
      <HintButton hints={[
        { step: 1, text: "2次関数 y = ax² + bx + c は3つの係数 a, b, c で決まります。3つの条件があれば係数を決定できます。" },
        { step: 2, text: "通る点の座標を代入すると、a, b, c に関する連立方程式が得られます。" },
        { step: 3, text: "頂点が与えられている場合は y = a(x - p)² + q の形を使うと効率的です。" },
      ]} />
    </div>
  );
};

export default CoefficientViz;
