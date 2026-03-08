import { Problem } from '../types';

export function generateAbsoluteValueMaxMinProblem(): Problem {
  // We want to find max/min of y = |x^2 - (a+b)x + ab|
  const roots = [
    [1, 3],
    [2, 4],
    [0, 2],
    [-1, 1],
    [-2, 0]
  ];
  
  const rootPair = roots[Math.floor(Math.random() * roots.length)];
  const alpha = rootPair[0];
  const beta = rootPair[1];
  
  const b = -(alpha + beta);
  const c = alpha * beta;
  
  // Interval [a, d]
  const a = alpha - 1;
  const d = beta + 1;
  
  const bStr = b === 0 ? "" : b > 0 ? `+${b}x` : `${b}x`;
  const cStr = c === 0 ? "" : c > 0 ? `+${c}` : `${c}`;
  const funcStr = `|x^2 ${bStr} ${cStr}|`;
  
  // Calculate max/min
  const vertexX = -b / 2;
  const vertexY = Math.abs(vertexX * vertexX + b * vertexX + c);
  
  const yA = Math.abs(a * a + b * a + c);
  const yD = Math.abs(d * d + b * d + c);
  
  const values = [yA, yD, 0, 0, vertexY];
  const max = Math.max(...values);
  const min = Math.min(...values);

  return {
    id: `abs-maxmin-${Date.now()}`,
    type: 'absolute_value_max_min',
    question: `関数 $y = ${funcStr}$ ( $${a} \\le x \\le ${d}$ ) の最大値と最小値を求めよ。`,
    equation: `y = ${funcStr}`,
    answer: `最大値 ${max}, 最小値 ${min}`,
    explanation: `区間の両端、頂点、および $x$ 軸との交点での $y$ の値を比較します。\n\n・$x = ${a}$ のとき $y = ${yA}$\n・$x = ${vertexX}$ のとき $y = ${vertexY}$\n・$x = ${d}$ のとき $y = ${yD}$\n・$x = ${alpha}, ${beta}$ のとき $y = 0$\n\nよって、最大値 ${max}、最小値 ${min} となります。`,
    params: {
      b,
      c,
      domain: [a, d],
      max,
      min
    }
  };
}
