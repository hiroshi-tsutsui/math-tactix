// Discriminant Generator

export interface DiscriminantProblem {
  id: string;
  type: 'discriminant';
  question: string;
  equation: string;
  a: number;
  b: number;
  c: number;
  discriminant: number;
  options: string[];
  answer: string;
  explanation: string;
}

export const generateDiscriminantProblem = (): DiscriminantProblem => {
  // Generate parameters for y = ax^2 + bx + c
  // Keep coefficients small for mental math
  const a = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
  const b = Math.floor(Math.random() * 9) - 4; // -4 to 4
  const c = Math.floor(Math.random() * 9) - 4; // -4 to 4

  const discriminant = b * b - 4 * a * c;
  let answerCount = 0;
  if (discriminant > 0) answerCount = 2;
  else if (discriminant === 0) answerCount = 1;
  else answerCount = 0;

  const equation = `y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`;

  return {
    id: `disc-${Date.now()}`,
    type: 'discriminant',
    question: `次の二次関数のグラフとx軸の共有点の個数を求めよ。\n\n${equation}`,
    equation,
    a, b, c,
    discriminant,
    options: ['0個', '1個', '2個', '解なし'],
    answer: `${answerCount}個`,
    explanation: `判別式 D = b^2 - 4ac を計算します。\n\na = ${a}, b = ${b}, c = ${c}\nD = (${b})^2 - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${discriminant}\n\nD ${discriminant > 0 ? '>' : discriminant < 0 ? '<' : '='} 0 なので、共有点は ${answerCount}個 です。`
  };
};
