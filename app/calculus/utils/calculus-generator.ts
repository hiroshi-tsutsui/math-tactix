// Calculus problem generators

export interface CalculusProblem {
  type: string;
  expression: string;
  coefficients: number[];
  answer: string;
  steps: string[];
  hint: string;
}

/** Random integer in [min, max] */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a nonzero random integer in [min, max] */
function randNonZero(min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

// ─── Derivative problems ───────────────────────────────────────────

/** Power rule: d/dx [a x^n] */
export function generatePowerRuleProblem(): CalculusProblem {
  const a = randNonZero(-5, 5);
  const n = randInt(2, 6);
  const da = a * n;
  const dn = n - 1;
  return {
    type: 'power_rule',
    expression: `${a}x^{${n}}`,
    coefficients: [a, n],
    answer: `${da}x^{${dn}}`,
    steps: [
      `f(x) = ${a}x^{${n}}`,
      `f'(x) = ${a} \\cdot ${n} \\, x^{${n}-1}`,
      `f'(x) = ${da}x^{${dn}}`,
    ],
    hint: `べき乗の微分: \\frac{d}{dx}[ax^n] = anx^{n-1}`,
  };
}

/** Polynomial derivative: d/dx [ax^3 + bx^2 + cx + d] */
export function generatePolynomialDerivativeProblem(): CalculusProblem {
  const a = randNonZero(-3, 3);
  const b = randInt(-5, 5);
  const c = randInt(-5, 5);
  const d = randInt(-5, 5);
  const da = 3 * a;
  const db = 2 * b;

  const fmtTerm = (coef: number, varPart: string, first: boolean): string => {
    if (coef === 0) return '';
    const sign = coef > 0 ? (first ? '' : '+') : '-';
    const abs = Math.abs(coef);
    if (varPart === '') return `${sign}${abs}`;
    if (abs === 1) return `${sign}${varPart}`;
    return `${sign}${abs}${varPart}`;
  };

  const expr = `${fmtTerm(a, 'x^3', true)}${fmtTerm(b, 'x^2', false)}${fmtTerm(c, 'x', false)}${fmtTerm(d, '', false)}`;
  const ans = `${fmtTerm(da, 'x^2', true)}${fmtTerm(db, 'x', false)}${fmtTerm(c, '', false)}`;

  return {
    type: 'polynomial_derivative',
    expression: expr || '0',
    coefficients: [a, b, c, d],
    answer: ans || '0',
    steps: [
      `f(x) = ${expr}`,
      `f'(x) = 3 \\cdot ${a}x^2 + 2 \\cdot ${b}x + ${c}`,
      `f'(x) = ${ans}`,
    ],
    hint: '各項を個別に微分して足し合わせます',
  };
}

/** Tangent line at x = p for f(x) = ax^2 + bx + c */
export function generateTangentLineProblem(): CalculusProblem {
  const a = randNonZero(-3, 3);
  const b = randInt(-4, 4);
  const c = randInt(-5, 5);
  const p = randInt(-3, 3);

  const fp = a * p * p + b * p + c;
  const slope = 2 * a * p + b;
  // y - fp = slope(x - p)  =>  y = slope*x + (fp - slope*p)
  const intercept = fp - slope * p;

  return {
    type: 'tangent_line',
    expression: `${a}x^2 + ${b}x + ${c}`,
    coefficients: [a, b, c, p],
    answer: `y = ${slope}x + ${intercept}`,
    steps: [
      `f(x) = ${a}x^2 + ${b}x + ${c}`,
      `f'(x) = ${2 * a}x + ${b}`,
      `f'(${p}) = ${slope}`,
      `f(${p}) = ${fp}`,
      `y - ${fp} = ${slope}(x - ${p})`,
      `y = ${slope}x + ${intercept}`,
    ],
    hint: '接線の方程式: y - f(a) = f\'(a)(x - a)',
  };
}

/** Increase / decrease intervals for f(x) = ax^3 + bx^2 + cx */
export function generateIncreaseDecreaseProblem(): CalculusProblem {
  // Keep it simple: f(x) = ax^2 + bx + c
  const a = randNonZero(-3, 3);
  const b = randInt(-6, 6);
  const c = randInt(-5, 5);
  const vertex = -b / (2 * a);

  const increasing = a > 0
    ? `x > ${vertex.toFixed(2)}`
    : `x < ${vertex.toFixed(2)}`;
  const decreasing = a > 0
    ? `x < ${vertex.toFixed(2)}`
    : `x > ${vertex.toFixed(2)}`;

  return {
    type: 'increase_decrease',
    expression: `${a}x^2 + ${b}x + ${c}`,
    coefficients: [a, b, c],
    answer: `増加: ${increasing}, 減少: ${decreasing}`,
    steps: [
      `f(x) = ${a}x^2 + ${b}x + ${c}`,
      `f'(x) = ${2 * a}x + ${b}`,
      `f'(x) = 0 \\Rightarrow x = ${vertex.toFixed(2)}`,
      `f'(x) > 0 のとき増加、f'(x) < 0 のとき減少`,
    ],
    hint: 'f\'(x) の符号で増減を判定します',
  };
}

/** Max / min of f(x) = ax^3 + bx on [-R, R] (cubic) */
export function generateMaxMinProblem(): CalculusProblem {
  const a = randNonZero(-2, 2);
  const b = randNonZero(-4, 4);
  const c = randInt(-5, 5);
  const vertex_x = -b / (2 * a);
  const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;
  const type = a > 0 ? '極小' : '極大';

  return {
    type: 'max_min',
    expression: `${a}x^2 + ${b}x + ${c}`,
    coefficients: [a, b, c],
    answer: `${type}値 ${vertex_y.toFixed(2)} (x = ${vertex_x.toFixed(2)})`,
    steps: [
      `f(x) = ${a}x^2 + ${b}x + ${c}`,
      `f'(x) = ${2 * a}x + ${b} = 0`,
      `x = ${vertex_x.toFixed(2)}`,
      `f(${vertex_x.toFixed(2)}) = ${vertex_y.toFixed(2)}`,
    ],
    hint: 'f\'(x) = 0 の点で極値をとります',
  };
}

// ─── Integral problems ─────────────────────────────────────────────

/** Antiderivative: ∫ ax^n dx */
export function generateAntiderivativeProblem(): CalculusProblem {
  const a = randNonZero(-5, 5);
  const n = randInt(1, 5);
  const newCoef = a / (n + 1);
  const newExp = n + 1;

  return {
    type: 'antiderivative',
    expression: `${a}x^{${n}}`,
    coefficients: [a, n],
    answer: `\\frac{${a}}{${newExp}}x^{${newExp}} + C`,
    steps: [
      `\\int ${a}x^{${n}} \\, dx`,
      `= \\frac{${a}}{${n}+1} x^{${n}+1} + C`,
      `= \\frac{${a}}{${newExp}} x^{${newExp}} + C`,
    ],
    hint: `\\int ax^n \\, dx = \\frac{a}{n+1}x^{n+1} + C`,
  };
}

/** Definite integral: ∫_a^b (px^2 + qx + r) dx */
export function generateDefiniteIntegralProblem(): CalculusProblem {
  const p = randNonZero(-2, 2);
  const q = randInt(-3, 3);
  const r = randInt(-3, 3);
  const lo = randInt(-2, 0);
  const hi = randInt(1, 3);

  const F = (x: number) => (p * x ** 3) / 3 + (q * x ** 2) / 2 + r * x;
  const result = F(hi) - F(lo);

  return {
    type: 'definite_integral',
    expression: `\\int_{${lo}}^{${hi}} (${p}x^2 + ${q}x + ${r}) \\, dx`,
    coefficients: [p, q, r, lo, hi],
    answer: result.toFixed(4),
    steps: [
      `F(x) = \\frac{${p}}{3}x^3 + \\frac{${q}}{2}x^2 + ${r}x`,
      `F(${hi}) = ${F(hi).toFixed(4)}`,
      `F(${lo}) = ${F(lo).toFixed(4)}`,
      `F(${hi}) - F(${lo}) = ${result.toFixed(4)}`,
    ],
    hint: '原始関数 F(x) を求めて F(b) - F(a) を計算',
  };
}

/** Area between two curves: f(x) - g(x) on [a, b] */
export function generateAreaBetweenCurvesProblem(): CalculusProblem {
  // f(x) = -x^2 + c,  g(x) = mx + d  with intersection points
  const c = randInt(2, 6);
  const m = randInt(-2, 2);
  const d = randInt(-2, 2);

  // f-g = -x^2 - mx + (c - d)
  const A = -1;
  const B = -m;
  const C = c - d;
  const disc = B * B - 4 * A * C;

  let area = 0;
  let x1 = 0;
  let x2 = 1;

  if (disc > 0) {
    x1 = (-B - Math.sqrt(disc)) / (2 * A);
    x2 = (-B + Math.sqrt(disc)) / (2 * A);
    if (x1 > x2) [x1, x2] = [x2, x1];
    // Area = ∫_{x1}^{x2} |f(x) - g(x)| dx
    const F = (x: number) => (A * x ** 3) / 3 + (B * x ** 2) / 2 + C * x;
    area = Math.abs(F(x2) - F(x1));
  }

  return {
    type: 'area_between_curves',
    expression: `f(x) = -x^2 + ${c}, \\; g(x) = ${m}x + ${d}`,
    coefficients: [c, m, d],
    answer: area.toFixed(4),
    steps: [
      `f(x) - g(x) = -x^2 ${m >= 0 ? '-' : '+'} ${Math.abs(m)}x + ${C}`,
      `交点: x = ${x1.toFixed(2)}, ${x2.toFixed(2)}`,
      `S = \\int_{${x1.toFixed(2)}}^{${x2.toFixed(2)}} |f(x) - g(x)| \\, dx = ${area.toFixed(4)}`,
    ],
    hint: '2つの曲線の交点を求めてから面積を計算',
  };
}
