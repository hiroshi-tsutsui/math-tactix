import { Problem } from '../types';

export function generateIndependentVariablesProblem() {
  return {
    id: Date.now(),
    title: "2変数関数の最大・最小（独立変数）",
    target: "最小値と、そのときのx, yの値",
    equation: "z = x^2 - 4x + y^2 + 6y",
    formula: "z = (x - 2)^2 - 4 + (y + 3)^2 - 9",
    hint: "互いに影響を与えない独立な変数の場合、それぞれ個別に平方完成して最小値を求めます。それぞれの最小値を足したものが全体の最小値になります。",
    expected: ["-13", "2", "-3"],
    options: ["-13", "-4", "-9", "2", "-3", "13", "5"],
    type: "independent_variables"
  };
}
