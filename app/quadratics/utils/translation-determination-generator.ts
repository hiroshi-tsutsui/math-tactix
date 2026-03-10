
export function generateTranslationDeterminationProblem() {
  return {
    id: Date.now(),
    title: "放物線の平行移動の決定",
    questionText: "放物線 y = x² - 4x + 5 を平行移動して、放物線 y = x² + 2x - 1 に重ねるには、x軸方向、y軸方向にそれぞれどれだけ平行移動すればよいか視覚的に確認せよ。",
    explanationSteps: [
      "移動前の放物線の頂点を求める: y = (x - 2)² + 1 より 頂点(2, 1)",
      "移動後の放物線の頂点を求める: y = (x + 1)² - 2 より 頂点(-1, -2)",
      "頂点の移動量を計算する: x軸方向に -1 - 2 = -3、y軸方向に -2 - 1 = -3"
    ],
    expected: ["-3", "-3"],
    options: ["-3", "-3", "3", "3", "-1", "-2"],
    type: "translation_determination"
  };
}
