export interface MovingDomainProblem {
  id: string;
  type: 'moving_domain';
  question: string;
  p: number; // Axis
  q: number; // Vertex Y
  width: number; // Domain width
  explanation?: string[];
  cases?: any[];
}

export function generateMovingDomainProblem(): MovingDomainProblem {
  // Pattern: y = (x - p)^2 + q
  // Domain: a <= x <= a + 2
  
  // Randomize p (axis) between 0 and 4
  const p = Math.floor(Math.random() * 5); // 0, 1, 2, 3, 4
  const q = Math.floor(Math.random() * 5) + 1; // 1 to 5
  
  const width = 2; // Fixed width for simplicity first

  // Question Text
  const signP = p >= 0 ? '-' : '+';
  const absP = Math.abs(p);
  const signQ = q >= 0 ? '+' : '-';
  const absQ = Math.abs(q);

  const equation = `y = (x ${signP} ${absP})^2 ${signQ} ${absQ}`;
  const domain = `a \\leqq x \\leqq a + ${width}`;
  
  const question = `2次関数 $${equation}$ ($${domain}$) の最大値・最小値を求めよ。`;

  // Explanation logic
  const explanation = [
    `この問題は、軸の位置 $x=${p}$ と定義域 $[a, a+${width}]$ の位置関係で場合分けが必要です。`,
    `動くのは「定義域」です。軸は固定されています。`,
    `3つのパターン（左・中・右）を考えましょう。`
  ];

  return {
    id: `md-${Date.now()}`,
    type: 'moving_domain',
    question,
    p,
    q,
    width,
    explanation
  };
}
