export const generateTwoParabolasSizeProblem = () => {
  return {
    id: `two-parabolas-size-${Date.now()}`,
    type: 'two_parabolas_size',
    question: "2つの2次関数 f(x), g(x) について、2種類の大小関係を視覚的に理解しましょう。",
    explanation: [
      "①【任意のxについて f(x) > g(x)】：",
      "これは「同じx」において常にf(x)がg(x)より上にあることを意味します。グラフが交わらなければOKです。",
      "式としては f(x) - g(x) > 0 がすべてのxで成り立つ（判別式D < 0）ことになります。",
      "",
      "②【任意のx₁, x₂について f(x₁) > g(x₂)】：",
      "これは「どんなxの組み合わせ」でもf(x)がg(x)より上にあること、つまり",
      "「f(x)の最小値 > g(x)の最大値」であることを意味します。",
      "グラフ全体の水平な境界線が重ならないことが条件です。"
    ]
  };
};
