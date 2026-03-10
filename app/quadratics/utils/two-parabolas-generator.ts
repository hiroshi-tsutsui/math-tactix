import { Problem } from '../types';

export function generateTwoParabolasProblem(): Problem {
  return {
    id: `two-parabolas-${Date.now()}`,
    type: 'two_parabolas',
    title: '放物線と放物線の位置関係',
    question: `2つの放物線 $y = x^2$ と $y = -x^2 + 2x + k$ が接するとき、定数 $k$ の値を求めよ。`,
    options: [
      '-1',
      '-1/2',
      '0',
      '1/2'
    ],
    answer: '-1/2',
    explanation: [
      `1. 2つの式を連立して、交点のx座標を求める方程式を作ります。`,
      `   $$ x^2 = -x^2 + 2x + k $$`,
      `2. 整理すると：`,
      `   $$ 2x^2 - 2x - k = 0 $$`,
      `3. 「接する」ということは、この2次方程式が重解を持つということです。`,
      `4. 判別式 $D/4$ を計算します。`,
      `   $$ D/4 = (-1)^2 - 2(-k) = 1 + 2k $$`,
      `5. $D = 0$ となる条件は $1 + 2k = 0$ なので、$$ k = -\\frac{1}{2} $$ となります。`,
      `視覚的には、上のグラフで $k = -0.5$ のときに2つの放物線が1点でピタッと触れることが確認できます。`
    ],
    difficulty: 3,
    level: 33
  };
}
