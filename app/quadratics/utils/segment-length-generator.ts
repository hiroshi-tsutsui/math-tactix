export function generateSegmentLengthProblem() {
  return {
    id: `segment_length_${Date.now()}`,
    type: 'segment_length',
    question: "放物線 $y = x^2 - 4x + c$ が $x$ 軸から切り取る線分の長さが $6$ となるとき、定数 $c$ の値を求めよ。",
    equation: "y = x^2 - 4x + c",
    explanation: [
      "放物線が $x$ 軸と交わる $2$ 点の $x$ 座標を $\\alpha, \\beta$ ($\\alpha < \\beta$) とすると、切り取る線分の長さ $L$ は $L = \\beta - \\alpha$ と表せる。",
      "$x^2 - 4x + c = 0$ の解は、解の公式より $x = 2 \\pm \\sqrt{4-c}$",
      "よって、$L = (2 + \\sqrt{4-c}) - (2 - \\sqrt{4-c}) = 2\\sqrt{4-c}$",
      "条件より $2\\sqrt{4-c} = 6$ なので、$\\sqrt{4-c} = 3$",
      "両辺を2乗して $4-c = 9$",
      "ゆえに、$c = -5$"
    ]
  };
}
