import { Problem } from '../types';

export function generateOneRealRootCondition(): Problem {
  // Let's create a problem exactly like the viz.
  // Equation 1: x^2 + px + 1 = 0
  // Equation 2: x^2 + x + p = 0
  // D1 = p^2 - 4, D2 = 1 - 4p
  // We want D1 >= 0 and D2 < 0  => (p <= -2, p >= 2) and (p > 1/4) => p >= 2
  // OR D1 < 0 and D2 >= 0 => (-2 < p < 2) and (p <= 1/4) => -2 < p <= 1/4
  // Solution: -2 < p <= 1/4 or p >= 2.
  
  return {
    id: `one-real-root-${Date.now()}`,
    type: 'one_real_root',
    difficulty: 3,
    question: `2つの2次方程式 \\( x^2 + px + 1 = 0 \\) と \\( x^2 + x + p = 0 \\) があります。これらのうち、一方だけが実数解をもつような定数 \\( p \\) の値の範囲を求めなさい。`,
    options: [
      `\\( -2 < p \\le \\frac{1}{4}, \\quad p \\ge 2 \\)`,
      `\\( -2 \\le p < \\frac{1}{4}, \\quad p > 2 \\)`,
      `\\( p < -2, \\quad \\frac{1}{4} < p < 2 \\)`,
      `\\( p \\le -2, \\quad p \\ge 2 \\)`
    ],
    answer: "\\( -2 < p \\le \\frac{1}{4}, \\quad p \\ge 2 \\)",
    explanation: `方程式①：\\( x^2 + px + 1 = 0 \\) の判別式を \\( D_1 \\) とすると、
\\( D_1 = p^2 - 4 \\)
方程式②：\\( x^2 + x + p = 0 \\) の判別式を \\( D_2 \\) とすると、
\\( D_2 = 1 - 4p \\)

実数解をもつ条件は \\( D \\ge 0 \\) です。
(ア) ①が実数解をもち、②がもたない場合
\\( D_1 \\ge 0 \\) かつ \\( D_2 < 0 \\)
\\( p^2 - 4 \\ge 0 \\Rightarrow p \\le -2, 2 \\le p \\)
\\( 1 - 4p < 0 \\Rightarrow p > 1/4 \\)
共通範囲をとると、\\( p \\ge 2 \\)

(イ) ①が実数解をもたず、②がもつ場合
\\( D_1 < 0 \\) かつ \\( D_2 \\ge 0 \\)
\\( p^2 - 4 < 0 \\Rightarrow -2 < p < 2 \\)
\\( 1 - 4p \\ge 0 \\Rightarrow p \\le 1/4 \\)
共通範囲をとると、\\( -2 < p \\le 1/4 \\)

(ア), (イ) より、求める範囲は \\( -2 < p \\le \\frac{1}{4}, \\quad p \\ge 2 \\) です。`
  };
}
