export const generateDifferenceFunctionProblem = () => {
  return {
    id: Date.now(),
    title: "2つのグラフの差の関数",
    type: "difference_function",
    target: "差の関数 h(x) = f(x) - g(x) を視覚化",
    equation: "",
    formula: "",
    hint: "上段の f(x) と g(x) の交点のx座標が、下段の h(x) の x軸との交点と一致することを確認しましょう。",
    expected: [],
    options: []
  };
};
