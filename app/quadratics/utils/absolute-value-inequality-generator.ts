import { Problem } from '../types';

interface AbsoluteValueInequalityProblem extends Problem {
  type: 'absolute_value_inequality';
  params: {
    a: number; // For |x^2 - a^2|
    m: number; // Slope of line
    n: number; // Y-intercept of line
  };
}

export const generateAbsoluteValueInequalityProblem = (): AbsoluteValueInequalityProblem => {
  // Pattern: |x^2 - a^2| < mx + n
  const a = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
  const a2 = a * a;
  
  // Let's pick a line that intersects the graph reasonably
  const m = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const n = Math.floor(Math.random() * 5) + 1; // 1 to 5
  
  return {
    id: `abs-ineq-${Date.now()}`,
    type: 'absolute_value_inequality',
    question: `不等式 $|x^2 - ${a2}| < ${m === 1 ? '' : m}x + ${n}$ を解け。`,
    equation: `|x^2 - ${a2}| < ${m === 1 ? '' : m}x + ${n}`,
    params: { a, m, n },
    explanation: [
      `$y = |x^2 - ${a2}|$ のグラフ（V字・W字型）と、直線 $y = ${m === 1 ? '' : m}x + ${n}$ の上下関係を考えます。`,
      `絶対値のグラフが直線より「下」にあるような $x$ の範囲を求める問題です。`,
      `代数的には、連立不等式 $-( ${m === 1 ? '' : m}x + ${n} ) < x^2 - ${a2} < ${m === 1 ? '' : m}x + ${n}$ を解くことと同じです。`
    ]
  };
};
