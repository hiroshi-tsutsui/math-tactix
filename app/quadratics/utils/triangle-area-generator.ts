export function generateTriangleAreaProblem() {
  return {
    id: Date.now(),
    title: "放物線上の三角形の面積最大化",
    target: "Pのx座標 t",
    equation: "y = x^2, A(-1, 1), B(2, 4)",
    formula: "S = \\frac{1}{2} |x_A(y_B - y_P) + x_B(y_P - y_A) + x_P(y_A - y_B)|",
    hint: "Pにおける接線が直線ABと平行になるとき、高さが最大になります。",
    expected: ["1/2", "0.5"],
    options: ["1/2", "0", "1", "-1/2"],
    type: "triangle_area_optimization"
  };
}
