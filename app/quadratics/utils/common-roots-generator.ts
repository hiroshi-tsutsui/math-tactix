import { Problem } from '../types';

export interface CommonRootsProblem extends Problem {
  type: 'common_roots';
  params: {
    m: number;
    commonRoot: number;
  };
}

export const generateCommonRootsProblem = (): CommonRootsProblem => {
  return {
    id: `common-roots-${Date.now()}`,
    type: 'common_roots',
    question: `2つの2次方程式 $x^2 + mx + 1 = 0$ と $x^2 + x + m = 0$ がただ1つの共通の実数解をもつとき、定数 $m$ の値とその共通解を求めよ。`,
    equation: `\\text{共通解問題}`,
    params: {
      m: -2,
      commonRoot: 1
    },
    answer: `m = -2, 共通解 x = 1`,
    explanation: [
      `共通解を $\\alpha$ とおくと、`,
      `$\\alpha^2 + m\\alpha + 1 = 0$ ・・・①`,
      `$\\alpha^2 + \\alpha + m = 0$ ・・・②`,
      `① - ② より、$(m - 1)\\alpha + 1 - m = 0$`,
      `$(m - 1)(\\alpha - 1) = 0$`,
      `よって $m = 1$ または $\\alpha = 1$`,
      `[1] $m = 1$ のとき、2つの方程式はともに $x^2 + x + 1 = 0$ となるが、判別式 $D = 1^2 - 4 \\cdot 1 \\cdot 1 = -3 < 0$ より実数解をもたない。これは不適。`,
      `[2] $\\alpha = 1$ のとき、②に代入して $1^2 + 1 + m = 0 \\implies m = -2$`,
      `このとき、①は $x^2 - 2x + 1 = 0$ より $x = 1$`,
      `②は $x^2 + x - 2 = 0$ より $x = 1, -2$ となり、確かにただ1つの共通の実数解 $x = 1$ をもつ。`,
      `したがって、$m = -2$、共通解は $x = 1$ である。`
    ]
  };
};