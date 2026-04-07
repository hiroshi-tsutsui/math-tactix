// Logs problem generators

export interface LogProblem {
  type: 'definition' | 'properties' | 'equation' | 'inequality' | 'comparison';
  question: string;
  base: number;
  value: number;
  answer: number | string;
  steps: string[];
  hint: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 対数の定義問題: log_a(b) を求める */
export function generateLogDefinitionProblem(): LogProblem {
  const bases = [2, 3, 4, 5, 10];
  const base = bases[randInt(0, bases.length - 1)];
  const exp = randInt(1, 5);
  const value = Math.pow(base, exp);

  return {
    type: 'definition',
    question: `\\log_{${base}} ${value} の値を求めよ。`,
    base,
    value,
    answer: exp,
    steps: [
      `${base}^? = ${value}`,
      `${base}^{${exp}} = ${value}`,
      `\\therefore \\log_{${base}} ${value} = ${exp}`,
    ],
    hint: `log_a M = p は「a を p 乗すると M になる」という意味`,
  };
}

/** 対数の性質を使う計算問題 */
export function generateLogPropertiesProblem(): LogProblem {
  const base = randInt(2, 5);
  const m = randInt(2, 5);
  const n = randInt(2, 5);
  const type = randInt(1, 3);

  let question: string;
  let answer: string;
  let steps: string[];

  if (type === 1) {
    // log_a(m * n)
    question = `\\log_{${base}} ${m} + \\log_{${base}} ${n} を簡約せよ。`;
    answer = `\\log_{${base}} ${m * n}`;
    steps = [
      `\\log_{${base}} ${m} + \\log_{${base}} ${n}`,
      `= \\log_{${base}} (${m} \\cdot ${n})`,
      `= \\log_{${base}} ${m * n}`,
    ];
  } else if (type === 2) {
    // log_a(m / n)
    question = `\\log_{${base}} ${m * n} - \\log_{${base}} ${n} を簡約せよ。`;
    answer = `\\log_{${base}} ${m}`;
    steps = [
      `\\log_{${base}} ${m * n} - \\log_{${base}} ${n}`,
      `= \\log_{${base}} \\frac{${m * n}}{${n}}`,
      `= \\log_{${base}} ${m}`,
    ];
  } else {
    // n * log_a(m)
    const k = randInt(2, 4);
    question = `${k} \\log_{${base}} ${m} を簡約せよ。`;
    answer = `\\log_{${base}} ${Math.pow(m, k)}`;
    steps = [
      `${k} \\log_{${base}} ${m}`,
      `= \\log_{${base}} ${m}^{${k}}`,
      `= \\log_{${base}} ${Math.pow(m, k)}`,
    ];
  }

  return {
    type: 'properties',
    question,
    base,
    value: m,
    answer,
    steps,
    hint: '対数の性質: log(MN) = logM + logN, log(M/N) = logM - logN, k logM = logM^k',
  };
}

/** 対数方程式: log_a(x) = k を解く */
export function generateLogEquationProblem(): LogProblem {
  const base = randInt(2, 5);
  const k = randInt(1, 4);
  const answer = Math.pow(base, k);

  return {
    type: 'equation',
    question: `\\log_{${base}} x = ${k} を解け。`,
    base,
    value: k,
    answer,
    steps: [
      `\\log_{${base}} x = ${k}`,
      `x = ${base}^{${k}}`,
      `x = ${answer}`,
    ],
    hint: 'log_a x = k ならば x = a^k',
  };
}

/** 対数方程式（応用）: log_a(2x+b) = k */
export function generateLogEquationAdvancedProblem(): LogProblem {
  const base = randInt(2, 4);
  const k = randInt(1, 3);
  const b = randInt(-3, 5);
  const rhs = Math.pow(base, k);
  // 2x + b = base^k => x = (base^k - b) / 2
  const xAnswer = (rhs - b) / 2;

  return {
    type: 'equation',
    question: `\\log_{${base}} (2x ${b >= 0 ? '+' : ''} ${b}) = ${k} を解け。`,
    base,
    value: k,
    answer: xAnswer,
    steps: [
      `\\log_{${base}} (2x ${b >= 0 ? '+' : ''} ${b}) = ${k}`,
      `2x ${b >= 0 ? '+' : ''} ${b} = ${base}^{${k}} = ${rhs}`,
      `2x = ${rhs - b}`,
      `x = ${xAnswer}`,
      `真数条件: 2x ${b >= 0 ? '+' : ''} ${b} > 0 \\Rightarrow x > ${(-b / 2).toFixed(1)}`,
    ],
    hint: 'まず対数を外して指数形に変換、その後真数条件を確認',
  };
}

/** 底の変換公式 */
export function generateChangeOfBaseProblem(): LogProblem {
  const a = randInt(2, 5);
  let b = randInt(2, 5);
  while (b === a) b = randInt(2, 5);
  const c = 10; // 常用対数に変換

  const logA = Math.log10(a);
  const logB = Math.log10(b);
  const answer = logB / logA;

  return {
    type: 'properties',
    question: `\\log_{${a}} ${b} の値を常用対数を用いて計算せよ。(log_{10} ${a} = ${logA.toFixed(4)}, log_{10} ${b} = ${logB.toFixed(4)})`,
    base: a,
    value: b,
    answer: parseFloat(answer.toFixed(4)),
    steps: [
      `\\log_{${a}} ${b} = \\frac{\\log_{${c}} ${b}}{\\log_{${c}} ${a}}`,
      `= \\frac{${logB.toFixed(4)}}{${logA.toFixed(4)}}`,
      `= ${answer.toFixed(4)}`,
    ],
    hint: '底の変換公式: log_a b = log_c b / log_c a',
  };
}

/** 対数不等式: log_a(x) > k を解く */
export function generateLogInequalityProblem(): LogProblem {
  const base = randInt(2, 4);
  const k = randInt(1, 3);
  const bound = Math.pow(base, k);
  // base > 1 の場合: log_a x > k  <=>  x > a^k
  const answer = `x > ${bound}`;

  return {
    type: 'inequality',
    question: `\\log_{${base}} x > ${k} を解け。（ただし底 ${base} > 1）`,
    base,
    value: k,
    answer,
    steps: [
      `\\log_{${base}} x > ${k}`,
      `底 ${base} > 1 なので対数関数は単調増加`,
      `x > ${base}^{${k}} = ${bound}`,
      `真数条件 x > 0 と合わせて: x > ${bound}`,
    ],
    hint: '底 > 1 のとき log_a x > k ⟺ x > a^k',
  };
}

/** 対数の大小比較 */
export function generateLogComparisonProblem(): LogProblem {
  const base = randInt(2, 4);
  const m = randInt(2, 10);
  let n = randInt(2, 10);
  while (n === m) n = randInt(2, 10);

  const logM = Math.log(m) / Math.log(base);
  const logN = Math.log(n) / Math.log(base);
  const answer = logM > logN ? `\\log_{${base}} ${m} > \\log_{${base}} ${n}` : `\\log_{${base}} ${m} < \\log_{${base}} ${n}`;

  return {
    type: 'comparison',
    question: `\\log_{${base}} ${m} と \\log_{${base}} ${n} の大小を比較せよ。`,
    base,
    value: m,
    answer,
    steps: [
      `底 ${base} > 1 なので対数関数は単調増加`,
      `${m} ${m > n ? '>' : '<'} ${n}`,
      `\\therefore \\log_{${base}} ${m} ${m > n ? '>' : '<'} \\log_{${base}} ${n}`,
    ],
    hint: '底 > 1 のとき、真数が大きいほど対数も大きい',
  };
}
