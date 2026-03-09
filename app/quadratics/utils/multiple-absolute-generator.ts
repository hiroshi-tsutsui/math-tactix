export function generateMultipleAbsoluteProblem() {
  return {
    type: 'multiple_absolute',
    questionText: '関数 y = |x - a| + |x - b| と直線 y = k の共有点の個数を視覚的に確認しましょう。',
    equation: 'y = |x - a| + |x - b|',
    options: ['確認した'],
    correctAnswer: '確認した',
    explanation: 'グラフの底の高さは |a - b| です。k の値によって共有点の個数が0個、無数、2個と変化します。'
  };
}
