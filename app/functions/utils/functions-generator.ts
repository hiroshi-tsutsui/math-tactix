export interface FunctionProblem {
  type: 'linear' | 'quadratic' | 'rational' | 'radical' | 'composite' | 'inverse' | 'domain';
  expression: string;
  domain?: string;
  question: string;
  answer: string | number;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function insertCorrectOption(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const opts = shuffle([correct, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correct) };
}

export function generateLinearProblem(): FunctionProblem {
  const a = randInt(-5, 5);
  const b = randInt(-5, 5);
  const x = randInt(-3, 3);
  const answer = a * x + b;
  const sign = b >= 0 ? '+' : '';
  const expr = `${a}x ${sign}${b}`;

  const correct = `${answer}`;
  const dist = [
    `${answer + randInt(1, 3)}`,
    `${answer - randInt(1, 3)}`,
    `${a * (x + 1) + b}`,
  ];
  const { options, correctIndex } = insertCorrectOption(correct, dist);

  return {
    type: 'linear',
    expression: expr,
    question: `f(x) = ${expr} のとき、f(${x}) の値は？`,
    answer,
    options,
    correctIndex,
    explanation: `f(${x}) = ${a}\u00D7${x} ${sign}${b} = ${answer}`,
  };
}

export function generateRationalProblem(): FunctionProblem {
  const k = randInt(1, 6);
  const h = randInt(-3, 3);

  const hStr = h === 0 ? 'x' : h > 0 ? `x - ${h}` : `x + ${-h}`;
  const expr = `${k}/(${hStr})`;
  const question = `f(x) = ${expr} の垂直漸近線は x = ?`;
  const correct = `${h}`;
  const dist = [`${h + 1}`, `${h - 1}`, `${-h}`];
  const { options, correctIndex } = insertCorrectOption(correct, dist);

  return {
    type: 'rational',
    expression: expr,
    question,
    answer: h,
    options,
    correctIndex,
    explanation: `分母が0になるのは ${hStr} = 0 のとき、x = ${h}。`,
  };
}

export function generateCompositeProblem(): FunctionProblem {
  const a1 = randInt(1, 3);
  const b1 = randInt(-3, 3);
  const a2 = randInt(1, 3);
  const b2 = randInt(-3, 3);
  const x = randInt(0, 3);

  // f(x) = a1*x + b1, g(x) = a2*x + b2
  const gx = a2 * x + b2;
  const fgx = a1 * gx + b1;

  const sign1 = b1 >= 0 ? '+' : '';
  const sign2 = b2 >= 0 ? '+' : '';

  const question = `f(x) = ${a1}x ${sign1}${b1}, g(x) = ${a2}x ${sign2}${b2} のとき、(f\u2218g)(${x}) = f(g(${x})) の値は？`;
  const correct = `${fgx}`;
  const dist = [`${fgx + randInt(1, 3)}`, `${fgx - randInt(1, 3)}`, `${a1 * x + b1}`];
  const { options, correctIndex } = insertCorrectOption(correct, dist);

  return {
    type: 'composite',
    expression: `f(g(x))`,
    question,
    answer: fgx,
    options,
    correctIndex,
    explanation: `g(${x}) = ${a2}\u00D7${x} ${sign2}${b2} = ${gx}。f(${gx}) = ${a1}\u00D7${gx} ${sign1}${b1} = ${fgx}。`,
  };
}

export function generateInverseProblem(): FunctionProblem {
  const a = randInt(2, 5);
  const b = randInt(-4, 4);
  // f(x) = a*x + b -> f^{-1}(x) = (x - b) / a
  const sign = b >= 0 ? '+' : '';
  const expr = `${a}x ${sign}${b}`;

  const bSign = -b >= 0 ? '+' : '';
  const correct = `(x ${bSign}${-b})/${a}`;
  const dist = [
    `(x ${sign}${b})/${a}`,
    `${a}x ${bSign}${-b}`,
    `x/${a} ${sign}${b}`,
  ];
  const { options, correctIndex } = insertCorrectOption(correct, dist);

  return {
    type: 'inverse',
    expression: expr,
    question: `f(x) = ${expr} の逆関数 f\u207B\u00B9(x) は？`,
    answer: correct,
    options,
    correctIndex,
    explanation: `y = ${expr} から x について解く: x = (y ${bSign}${-b})/${a}。よって f\u207B\u00B9(x) = ${correct}。`,
  };
}

export function generateDomainProblem(): FunctionProblem {
  const patterns = [
    {
      expr: '\u221A(x - 2)',
      correct: 'x \u2265 2',
      dist: ['x > 2', 'x \u2264 2', 'x \u2265 -2'],
      explanation: '\u221A の中身が0以上: x - 2 \u2265 0 \u21D2 x \u2265 2。',
    },
    {
      expr: '1/(x + 3)',
      correct: 'x \u2260 -3',
      dist: ['x \u2265 -3', 'x > -3', 'x \u2260 3'],
      explanation: '分母が0でない: x + 3 \u2260 0 \u21D2 x \u2260 -3。',
    },
    {
      expr: '\u221A(9 - x\u00B2)',
      correct: '-3 \u2264 x \u2264 3',
      dist: ['x \u2265 3', 'x \u2264 3', '-9 \u2264 x \u2264 9'],
      explanation: '9 - x\u00B2 \u2265 0 \u21D2 x\u00B2 \u2264 9 \u21D2 -3 \u2264 x \u2264 3。',
    },
    {
      expr: '1/\u221Ax',
      correct: 'x > 0',
      dist: ['x \u2265 0', 'x \u2260 0', 'x > 1'],
      explanation: '\u221Ax の中身が正 かつ 分母が0でない: x > 0。',
    },
  ];

  const p = patterns[randInt(0, patterns.length - 1)];
  const { options, correctIndex } = insertCorrectOption(p.correct, p.dist);

  return {
    type: 'domain',
    expression: p.expr,
    question: `f(x) = ${p.expr} の定義域は？`,
    answer: p.correct,
    options,
    correctIndex,
    explanation: p.explanation,
  };
}

export function generateRandomProblem(): FunctionProblem {
  const generators = [
    generateLinearProblem,
    generateRationalProblem,
    generateCompositeProblem,
    generateInverseProblem,
    generateDomainProblem,
  ];
  return generators[randInt(0, generators.length - 1)]();
}
