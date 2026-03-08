export interface AbsoluteValueProblem {
  id: string;
  type: string;
  question: string;
  equation: string;
  explanation: string[];
}

export function generateAbsoluteValueProblem(): AbsoluteValueProblem {
  // Currently focusing on y = |x^2 - a^2|
  // Randomly select a base value for 'a' to make the problem slightly different each time
  const a = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  const constant = a * a;
  
  return {
    id: `abs-1-${Date.now()}`,
    type: 'absolute_value_graph',
    question: `次の関数のグラフを描け。また、グラフの形状がどのように変化するか確認せよ。`,
    equation: `y = |x^2 - ${constant}|`,
    explanation: [
      `1. まず、絶対値の中身 $y = x^2 - ${constant}$ のグラフを描く。`,
      `2. $x$軸より下にある部分（$y < 0$ の部分）を、$x$軸に関して対称に折り返す。`,
      `3. $x^2 - ${constant} = 0$ となる点（$x = \\pm ${a}$）でグラフが折れ曲がることに注目しよう。`,
      `この操作は「全体に絶対値がついたグラフ」の基本手順です。`
    ]
  };
}
