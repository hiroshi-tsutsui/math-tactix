import { Problem } from '../types';

export const generateSubstitutionMaxMinProblem = (): Problem => {
  // Let y = (x^2 - 2px)^2 - 2a(x^2 - 2px) + b
  // We simplify it to:
  // t = x^2 - 2x  (Domain: 0 <= x <= 3)
  // Vertex of t is at x=1, t = -1.
  // When x=0, t=0. When x=3, t=3.
  // So range of t is -1 <= t <= 3.
  
  // Let y = t^2 - 4t + 3
  // Vertex of y is at t=2, y = -1.
  // When t=-1, y = 1+4+3=8. When t=3, y = 9-12+3=0.
  // So max y=8, min y=-1.

  // To make it dynamic:
  // t = x^2 - 2ax
  const a = Math.floor(Math.random() * 2) + 1; // 1 or 2
  // Domain 0 <= x <= 3 (or 4)
  const x_max = a + 2; 

  // t_min = -a^2. t_max = x_max^2 - 2*a*x_max.
  const t_min = -a*a;
  const t_max = x_max*x_max - 2*a*x_max;

  // y = t^2 - 2bt + c
  const b = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const c = Math.floor(Math.random() * 5); // 0 to 4

  // Min of y:
  // Is vertex of y in [t_min, t_max]?
  // t_vertex = b.
  
  const question = `関数 $y = (x^2 - ${2*a}x)^2 - ${2*b}(x^2 - ${2*a}x) + ${c}$ ($0 \\le x \\le ${x_max}$) の最大値と最小値を求めよ。`;

  return {
    id: `substitution-max-min-${Date.now()}`,
    type: 'substitution_max_min',
    question,
    params: {
      a, b, c, x_max, t_min, t_max
    }
  };
};