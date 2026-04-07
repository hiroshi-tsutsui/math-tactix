// Sequences problem generators

export interface SequenceProblem {
  type: 'arithmetic' | 'geometric' | 'sigma' | 'recurrence' | 'infinite';
  question: string;
  params: Record<string, number>;
  answer: number | string;
  steps: string[];
  hint: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

/** 等差数列の一般項を求める問題 */
export function generateArithmeticProblem(): SequenceProblem {
  const a1 = randInt(-5, 10);
  const d = randNonZero(-4, 4);
  const targetN = randInt(5, 20);
  const answer = a1 + (targetN - 1) * d;

  return {
    type: 'arithmetic',
    question: `初項 a_1 = ${a1}, 公差 d = ${d} の等差数列の第 ${targetN} 項 a_{${targetN}} を求めよ。`,
    params: { a1, d, n: targetN },
    answer,
    steps: [
      `a_n = a_1 + (n-1)d`,
      `a_{${targetN}} = ${a1} + (${targetN}-1) \\cdot ${d >= 0 ? d : `(${d})`}`,
      `= ${a1} + ${(targetN - 1) * d}`,
      `= ${answer}`,
    ],
    hint: '等差数列の一般項: a_n = a_1 + (n-1)d',
  };
}

/** 等差数列の和を求める問題 */
export function generateArithmeticSumProblem(): SequenceProblem {
  const a1 = randInt(1, 10);
  const d = randNonZero(1, 5);
  const n = randInt(5, 15);
  const an = a1 + (n - 1) * d;
  const sum = (n * (a1 + an)) / 2;

  return {
    type: 'arithmetic',
    question: `初項 ${a1}, 公差 ${d} の等差数列の初項から第 ${n} 項までの和 S_{${n}} を求めよ。`,
    params: { a1, d, n },
    answer: sum,
    steps: [
      `a_{${n}} = ${a1} + (${n}-1) \\cdot ${d} = ${an}`,
      `S_{${n}} = \\frac{${n}(${a1} + ${an})}{2}`,
      `= \\frac{${n} \\cdot ${a1 + an}}{2}`,
      `= ${sum}`,
    ],
    hint: '等差数列の和: S_n = n(a_1 + a_n) / 2',
  };
}

/** 等比数列の一般項を求める問題 */
export function generateGeometricProblem(): SequenceProblem {
  const a1 = randNonZero(1, 5);
  const r = randNonZero(-3, 3);
  const n = randInt(3, 8);
  const answer = a1 * Math.pow(r, n - 1);

  return {
    type: 'geometric',
    question: `初項 a_1 = ${a1}, 公比 r = ${r} の等比数列の第 ${n} 項 a_{${n}} を求めよ。`,
    params: { a1, r, n },
    answer,
    steps: [
      `a_n = a_1 \\cdot r^{n-1}`,
      `a_{${n}} = ${a1} \\cdot ${r >= 0 ? r : `(${r})`}^{${n - 1}}`,
      `= ${a1} \\cdot ${Math.pow(r, n - 1)}`,
      `= ${answer}`,
    ],
    hint: '等比数列の一般項: a_n = a_1 \\cdot r^{n-1}',
  };
}

/** 等比数列の和を求める問題 */
export function generateGeometricSumProblem(): SequenceProblem {
  const a1 = randNonZero(1, 5);
  const r = randNonZero(2, 3);
  const n = randInt(4, 8);

  const sum = r === 1 ? a1 * n : a1 * (Math.pow(r, n) - 1) / (r - 1);

  return {
    type: 'geometric',
    question: `初項 ${a1}, 公比 ${r} の等比数列の初項から第 ${n} 項までの和 S_{${n}} を求めよ。`,
    params: { a1, r, n },
    answer: sum,
    steps: [
      `S_n = \\frac{a_1(r^n - 1)}{r - 1} \\quad (r \\neq 1)`,
      `S_{${n}} = \\frac{${a1}(${r}^{${n}} - 1)}{${r} - 1}`,
      `= \\frac{${a1} \\cdot ${Math.pow(r, n) - 1}}{${r - 1}}`,
      `= ${sum}`,
    ],
    hint: '等比数列の和: S_n = a_1(r^n - 1) / (r - 1)',
  };
}

/** シグマの計算問題: Σ_{k=1}^{n} (ak + b) */
export function generateSigmaProblem(): SequenceProblem {
  const a = randNonZero(1, 5);
  const b = randInt(-3, 3);
  const n = randInt(5, 15);

  // Σ(ak+b) = a * n(n+1)/2 + bn
  const sum = a * n * (n + 1) / 2 + b * n;

  return {
    type: 'sigma',
    question: `\\sum_{k=1}^{${n}} (${a}k ${b >= 0 ? '+' : ''} ${b}) を計算せよ。`,
    params: { a, b, n },
    answer: sum,
    steps: [
      `\\sum_{k=1}^{${n}} (${a}k ${b >= 0 ? '+' : ''} ${b})`,
      `= ${a} \\sum_{k=1}^{${n}} k + ${b} \\cdot ${n}`,
      `= ${a} \\cdot \\frac{${n}(${n}+1)}{2} + ${b * n}`,
      `= ${a * n * (n + 1) / 2} + ${b * n}`,
      `= ${sum}`,
    ],
    hint: 'Σk = n(n+1)/2 を使って計算',
  };
}

/** 漸化式 a_{n+1} = p*a_n + q の一般項を求める問題 */
export function generateRecurrenceProblem(): SequenceProblem {
  const p = randInt(2, 3);
  const q = randNonZero(-4, 4);
  const a1 = randInt(1, 5);
  const targetN = randInt(3, 6);

  // Compute a_n iteratively
  const terms: number[] = [a1];
  for (let i = 1; i < targetN; i++) {
    terms.push(p * terms[i - 1] + q);
  }
  const answer = terms[targetN - 1];

  // Special solution: alpha = q / (1-p)
  const alpha = q / (1 - p);

  return {
    type: 'recurrence',
    question: `a_1 = ${a1}, \\; a_{n+1} = ${p}a_n ${q >= 0 ? '+' : ''} ${q} のとき、a_{${targetN}} を求めよ。`,
    params: { a1, p, q, n: targetN },
    answer,
    steps: [
      `a_{n+1} - \\alpha = ${p}(a_n - \\alpha), \\quad \\alpha = \\frac{${q}}{1 - ${p}} = ${alpha.toFixed(2)}`,
      `a_n - \\alpha = (a_1 - \\alpha) \\cdot ${p}^{n-1}`,
      ...terms.map((t, i) => `a_{${i + 1}} = ${t}`),
    ],
    hint: '特殊解 α = q/(1-p) を使って等比数列に帰着',
  };
}

/** 無限等比級数の収束値を求める問題 */
export function generateInfiniteSeriesProblem(): SequenceProblem {
  const a1 = randNonZero(1, 10);
  // r must have |r| < 1; use fractions like 1/2, 1/3, 2/3, -1/2
  const fracs: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];
  const signs = [1, -1];
  const sign = signs[randInt(0, 1)];
  const [rNum, rDen] = fracs[randInt(0, fracs.length - 1)];
  const r = sign * rNum / rDen;

  // S = a1 / (1 - r)
  const sum = a1 / (1 - r);

  return {
    type: 'infinite',
    question: `初項 ${a1}, 公比 ${sign < 0 ? '-' : ''}\\frac{${rNum}}{${rDen}} の無限等比級数の和を求めよ。`,
    params: { a1, rNum: sign * rNum, rDen },
    answer: parseFloat(sum.toFixed(6)),
    steps: [
      `|r| = \\frac{${rNum}}{${rDen}} < 1 \\text{ なので収束}`,
      `S = \\frac{a_1}{1 - r} = \\frac{${a1}}{1 - (${sign < 0 ? '-' : ''}\\frac{${rNum}}{${rDen}})}`,
      `= \\frac{${a1}}{\\frac{${rDen - sign * rNum}}{${rDen}}}`,
      `= ${sum.toFixed(4)}`,
    ],
    hint: '|r| < 1 のとき S = a_1 / (1 - r)',
  };
}
