export interface ShapeOptimizationProblem {
  id: string;
  type: 'shape_optimization';
  question: string;
  equation: string;
  params: {
    totalLength: number; // L in L - 2x
  };
  explanation: string[];
}

export const generateShapeOptimizationProblem = (): ShapeOptimizationProblem => {
  // Classic Fence Problem: Maximize Area of Rectangular Pen against a wall
  // Area A = x * (L - 2x)
  // A = -2x^2 + Lx
  // Vertex x = -L / (2 * -2) = L / 4
  
  const lengths = [12, 16, 20, 24, 32, 40];
  const L = lengths[Math.floor(Math.random() * lengths.length)];
  
  const question = `長さ ${L}m の金網を使って、壁に接する長方形の花壇を作ります。花壇の面積 $S$ を最大にするには、縦の長さ $x$ を何mにすればよいですか？`;
  
  const x_vertex = L / 4;
  const max_area = x_vertex * (L - 2 * x_vertex);
  
  const explanation = [
    `長方形の縦の長さを $x$ (m) とすると、横の長さは $( ${L} - 2x )$ (m) となります。`,
    `面積 $S$ は次のように表せます。`,
    `$S = x(${L} - 2x) = -2x^2 + ${L}x$`,
    `これを平方完成して頂点を求めます。`,
    `$S = -2(x^2 - ${L/2}x)$`,
    `$S = -2(x - ${L/4})^2 + ${max_area}$`,
    `よって、$x = ${x_vertex}$ のとき、最大値 $S = ${max_area}$ をとります。`,
    `答え: 縦の長さ ${x_vertex}m`
  ];

  return {
    id: `shape-opt-${Date.now()}`,
    type: 'shape_optimization',
    question,
    equation: `S = -2x^2 + ${L}x`,
    params: {
      totalLength: L,
    },
    explanation
  };
};
