export const generateVertexLocusProblem = () => {
  return {
    id: Date.now().toString(),
    type: 'vertex_locus',
    question: '放物線 $y = x^2 - 2px + p$ の頂点は、$p$ の値が変化するとき、どのような図形を描くか。',
    explanation: [
      '放物線の方程式を平方完成して頂点の座標を求めます。',
      '$y = (x - p)^2 - p^2 + p$',
      'よって、頂点の座標を $(X, Y)$ とおくと、',
      '$X = p$ ... ①',
      '$Y = -p^2 + p$ ... ②',
      '①を②に代入して $p$ を消去すると、',
      '$Y = -X^2 + X$',
      'したがって、頂点は放物線 $y = -x^2 + x$ 上を動きます。'
    ]
  };
};