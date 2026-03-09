import { Problem } from '../types';

export const generateConditionalMaxMinProblem = (): Problem => {
  return {
    id: `cond-max-min-${Date.now()}`,
    type: 'conditional_max_min',
    question: "実数 x, y が x + y = 4 を満たすとき、x² + y² の最小値を求めよ。また、そのときの x, y の値を求めよ。",
    equation: "x + y = 4 \\implies x^2 + y^2 \\text{ の最小値}",
    explanation: [
      "条件式 $x + y = 4$ より、$y = 4 - x$ と変形できます。",
      "これを $x^2 + y^2$ に代入すると、$x^2 + (4-x)^2 = 2x^2 - 8x + 16$ となります。",
      "平方完成すると、$2(x-2)^2 + 8$ となります。",
      "よって、$x = 2$ のとき、最小値 $8$ をとります。",
      "このとき $y = 4 - x = 2$ です。",
      "【図形的意味】",
      "直線 $x+y=4$ 上の点 $(x, y)$ のうち、原点 $(0,0)$ からの距離の2乗 $x^2+y^2=k$ が最小になる点を探す問題です。",
      "円 $x^2+y^2=k$ を膨らませていき、直線と最初に「接する」瞬間が最小値になります。"
    ]
  };
};
