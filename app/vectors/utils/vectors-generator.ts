// Vectors problem generators

export interface VectorProblem {
  type: 'components' | 'addition' | 'magnitude' | 'dotProduct' | 'angle' | 'perpendicular' | 'unit' | 'scalar';
  vector_a: [number, number];
  vector_b: [number, number];
  question: string;
  answer: number;
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

/** ベクトルの成分計算問題 */
export function generateComponentsProblem(): VectorProblem {
  const ax = randInt(-5, 5);
  const ay = randInt(-5, 5);
  const bx = randInt(-5, 5);
  const by = randInt(-5, 5);
  // 和の x 成分を求める
  const answer = ax + bx;

  return {
    type: 'components',
    vector_a: [ax, ay],
    vector_b: [bx, by],
    question: `\\vec{a} = (${ax}, ${ay}),\\; \\vec{b} = (${bx}, ${by}) のとき、\\vec{a} + \\vec{b} の x 成分を求めよ。`,
    answer,
    steps: [
      `\\vec{a} + \\vec{b} = (${ax} + ${bx >= 0 ? bx : `(${bx})`},\\; ${ay} + ${by >= 0 ? by : `(${by})`})`,
      `= (${ax + bx},\\; ${ay + by})`,
      `x \\text{ 成分} = ${answer}`,
    ],
    hint: '\\vec{a} + \\vec{b} = (a_1 + b_1,\\; a_2 + b_2)',
  };
}

/** ベクトルの和の y 成分を求める */
export function generateAdditionProblem(): VectorProblem {
  const ax = randInt(-5, 5);
  const ay = randInt(-5, 5);
  const bx = randInt(-5, 5);
  const by = randInt(-5, 5);
  const answer = ay + by;

  return {
    type: 'addition',
    vector_a: [ax, ay],
    vector_b: [bx, by],
    question: `\\vec{a} = (${ax}, ${ay}),\\; \\vec{b} = (${bx}, ${by}) のとき、\\vec{a} + \\vec{b} の y 成分を求めよ。`,
    answer,
    steps: [
      `\\vec{a} + \\vec{b} = (${ax + bx},\\; ${ay} + ${by >= 0 ? by : `(${by})`})`,
      `= (${ax + bx},\\; ${answer})`,
      `y \\text{ 成分} = ${answer}`,
    ],
    hint: '\\vec{a} + \\vec{b} = (a_1 + b_1,\\; a_2 + b_2)',
  };
}

/** ベクトルの大きさを求める問題 */
export function generateMagnitudeProblem(): VectorProblem {
  const ax = randInt(-5, 5);
  const ay = randInt(-5, 5);
  const magSq = ax * ax + ay * ay;
  const answer = parseFloat(Math.sqrt(magSq).toFixed(4));

  return {
    type: 'magnitude',
    vector_a: [ax, ay],
    vector_b: [0, 0],
    question: `\\vec{a} = (${ax}, ${ay}) の大きさ |\\vec{a}| を求めよ。（小数第4位まで）`,
    answer,
    steps: [
      `|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}`,
      `= \\sqrt{${ax}^2 + ${ay}^2}`,
      `= \\sqrt{${magSq}}`,
      `\\approx ${answer}`,
    ],
    hint: '|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}',
  };
}

/** 内積を求める問題 */
export function generateDotProductProblem(): VectorProblem {
  const ax = randInt(-5, 5);
  const ay = randInt(-5, 5);
  const bx = randInt(-5, 5);
  const by = randInt(-5, 5);
  const answer = ax * bx + ay * by;

  return {
    type: 'dotProduct',
    vector_a: [ax, ay],
    vector_b: [bx, by],
    question: `\\vec{a} = (${ax}, ${ay}),\\; \\vec{b} = (${bx}, ${by}) のとき、内積 \\vec{a} \\cdot \\vec{b} を求めよ。`,
    answer,
    steps: [
      `\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2`,
      `= ${ax} \\cdot ${bx >= 0 ? bx : `(${bx})`} + ${ay} \\cdot ${by >= 0 ? by : `(${by})`}`,
      `= ${ax * bx} + ${ay * by}`,
      `= ${answer}`,
    ],
    hint: '\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2',
  };
}

/** 内積から角度を求める問題（度数法） */
export function generateAngleProblem(): VectorProblem {
  // 特別な角度を出すように設計
  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
  const targetAngle = angles[randInt(0, angles.length - 1)];
  const rad = (targetAngle * Math.PI) / 180;

  // a = (1, 0), b = (cos θ, sin θ) を基本にスケール
  const scale = randNonZero(1, 3);
  const ax = scale;
  const ay = 0;
  const bx = parseFloat((scale * Math.cos(rad)).toFixed(0));
  const by = parseFloat((scale * Math.sin(rad)).toFixed(0));

  const dot = ax * bx + ay * by;
  const magA = Math.sqrt(ax * ax + ay * ay);
  const magB = Math.sqrt(bx * bx + by * by);
  const cosTheta = magB > 0 ? dot / (magA * magB) : 0;
  const answer = magB > 0 ? Math.round((Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) / Math.PI) : 0;

  return {
    type: 'angle',
    vector_a: [ax, ay],
    vector_b: [bx, by],
    question: `\\vec{a} = (${ax}, ${ay}),\\; \\vec{b} = (${bx}, ${by}) のなす角 \\theta（度）を求めよ。`,
    answer,
    steps: [
      `\\vec{a} \\cdot \\vec{b} = ${dot}`,
      `|\\vec{a}| = ${magA.toFixed(2)},\\; |\\vec{b}| = ${magB.toFixed(2)}`,
      `\\cos \\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{${dot}}{${(magA * magB).toFixed(2)}} = ${cosTheta.toFixed(4)}`,
      `\\theta = ${answer}°`,
    ],
    hint: '\\cos \\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}',
  };
}

/** 垂直条件: a・b = 0 となる成分を求める */
export function generatePerpendicularProblem(): VectorProblem {
  const ax = randNonZero(-5, 5);
  const ay = randNonZero(-5, 5);
  const bx = randNonZero(-5, 5);
  // a·b = 0 => ax*bx + ay*by = 0 => by = -ax*bx/ay
  const by = -(ax * bx) / ay;
  // 求める値: by（ベクトル b の y 成分）
  const answer = parseFloat(by.toFixed(4));

  return {
    type: 'perpendicular',
    vector_a: [ax, ay],
    vector_b: [bx, parseFloat(by.toFixed(4))],
    question: `\\vec{a} = (${ax}, ${ay}) \\perp \\vec{b} = (${bx}, t) となる t の値を求めよ。`,
    answer,
    steps: [
      `\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0`,
      `${ax} \\cdot ${bx >= 0 ? bx : `(${bx})`} + ${ay} \\cdot t = 0`,
      `${ax * bx} + ${ay}t = 0`,
      `t = \\frac{${-ax * bx}}{${ay}} = ${answer}`,
    ],
    hint: '\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0',
  };
}

/** スカラー倍の問題 */
export function generateScalarProblem(): VectorProblem {
  const ax = randInt(-5, 5);
  const ay = randInt(-5, 5);
  const k = randNonZero(-3, 3);
  const answer = k * ax; // x 成分を求める

  return {
    type: 'scalar',
    vector_a: [ax, ay],
    vector_b: [k, 0],
    question: `\\vec{a} = (${ax}, ${ay}) のとき、${k}\\vec{a} の x 成分を求めよ。`,
    answer,
    steps: [
      `k\\vec{a} = (k \\cdot a_1,\\; k \\cdot a_2)`,
      `${k}\\vec{a} = (${k} \\cdot ${ax >= 0 ? ax : `(${ax})`},\\; ${k} \\cdot ${ay >= 0 ? ay : `(${ay})`})`,
      `= (${k * ax},\\; ${k * ay})`,
      `x \\text{ 成分} = ${answer}`,
    ],
    hint: 'k\\vec{a} = (ka_1,\\; ka_2)',
  };
}
