export type CoefficientProblemType = 'vertex_point' | 'three_points';

export interface CoefficientProblem {
  id: string;
  type: CoefficientProblemType;
  question: string;
  equation: string; // The answer equation
  params: {
    points: { x: number; y: number; label?: string }[];
    vertex?: { x: number; y: number };
    a: number;
    b: number;
    c: number;
  };
  answer: string;
  explanation: string;
}

export const generateCoefficientProblem = (): CoefficientProblem => {
  const type: CoefficientProblemType = Math.random() > 0.5 ? 'vertex_point' : 'three_points';
  
  // Common coefficients (small integers)
  const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1); // ±1, ±2
  
  if (type === 'vertex_point') {
    // Vertex form: y = a(x-p)^2 + q
    const p = Math.floor(Math.random() * 6) - 3; // -3 to 2
    const q = Math.floor(Math.random() * 6) - 3;
    
    // Pick another x for the point (x ≠ p)
    let x1 = p;
    while (x1 === p) x1 = Math.floor(Math.random() * 8) - 4;
    const y1 = a * Math.pow(x1 - p, 2) + q;
    
    // Expand for standard form if needed, but vertex form is usually the answer
    const equation = `y = ${a}(x - ${p})^2 ${q >= 0 ? '+' : ''}${q}`;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: `頂点が点(${p}, ${q})で、点(${x1}, ${y1})を通る二次関数を求めよ。`,
      equation,
      params: {
        points: [{ x: x1, y: y1, label: 'A' }],
        vertex: { x: p, y: q },
        a,
        b: -2 * a * p,
        c: a * p * p + q
      },
      answer: equation,
      explanation: `頂点が(${p}, ${q})なので、求める二次関数は\ny = a(x - ${p})^2 ${q >= 0 ? '+' : ''}${q}\nと置けます。\nこれが点(${x1}, ${y1})を通るから、\n${y1} = a(${x1} - ${p})^2 ${q >= 0 ? '+' : ''}${q}\n${y1} = ${Math.pow(x1-p, 2)}a ${q >= 0 ? '+' : ''}${q}\n${Math.pow(x1-p, 2)}a = ${y1 - q}\na = ${a}\nよって、y = ${a}(x - ${p})^2 ${q >= 0 ? '+' : ''}${q}`
    };
  } else {
    // Three points form: y = ax^2 + bx + c
    // Start with integer roots or vertex to keep numbers nice?
    // Let's stick to small integers for a, b, c
    const b = Math.floor(Math.random() * 7) - 3; // -3 to 3
    const c = Math.floor(Math.random() * 7) - 3;
    
    // Pick 3 distinct x values
    const xs = [-2, -1, 0, 1, 2].sort(() => Math.random() - 0.5).slice(0, 3).sort((a,b) => a-b);
    const points = xs.map(x => ({
      x,
      y: a * x * x + b * x + c,
      label: `P${x+3}` // P1, P2...
    }));
    
    const equation = `y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: `3点 A(${points[0].x}, ${points[0].y}), B(${points[1].x}, ${points[1].y}), C(${points[2].x}, ${points[2].y}) を通る二次関数を求めよ。`,
      equation,
      params: {
        points,
        a, b, c
      },
      answer: equation,
      explanation: `求める二次関数を y = ax^2 + bx + c と置きます。\n3点の座標を代入して連立方程式を作ります。\n1) ${points[0].y} = ${points[0].x * points[0].x}a ${points[0].x >= 0 ? '+' : ''}${points[0].x}b + c\n2) ${points[1].y} = ${points[1].x * points[1].x}a ${points[1].x >= 0 ? '+' : ''}${points[1].x}b + c\n3) ${points[2].y} = ${points[2].x * points[2].x}a ${points[2].x >= 0 ? '+' : ''}${points[2].x}b + c\n\nこれを解くと、a=${a}, b=${b}, c=${c} となります。`
    };
  }
};
