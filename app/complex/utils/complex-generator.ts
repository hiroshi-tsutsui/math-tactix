// app/complex/utils/complex-generator.ts

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface ComplexProblem {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'conjugate' | 'modulus' | 'argument' | 'polar' | 'powers';
  z1: ComplexNumber;
  z2?: ComplexNumber;
  question: string;
  questionTex: string;
  answer: ComplexNumber & { modulus?: number; argument?: number };
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

function formatComplex(re: number, im: number): string {
  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }
  const imStr = im === 1 ? 'i' : im === -1 ? '-i' : `${im}i`;
  return `${re} ${im > 0 ? '+' : '-'} ${Math.abs(im) === 1 ? 'i' : Math.abs(im) + 'i'}`;
}

function formatComplexTex(re: number, im: number): string {
  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }
  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imPart = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imPart}`;
}

export function generateAdditionProblem(): ComplexProblem {
  const z1 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  const z2 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  const ansRe = z1.re + z2.re;
  const ansIm = z1.im + z2.im;

  return {
    type: 'addition',
    z1, z2,
    question: `(${formatComplex(z1.re, z1.im)}) + (${formatComplex(z2.re, z2.im)})`,
    questionTex: `(${formatComplexTex(z1.re, z1.im)}) + (${formatComplexTex(z2.re, z2.im)})`,
    answer: { re: ansRe, im: ansIm },
    steps: [
      `実部同士: ${z1.re} + ${z2.re} = ${ansRe}`,
      `虚部同士: ${z1.im} + ${z2.im} = ${ansIm}`,
      `結果: ${formatComplex(ansRe, ansIm)}`
    ],
    hint: '実部と虚部をそれぞれ加えます。'
  };
}

export function generateSubtractionProblem(): ComplexProblem {
  const z1 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  const z2 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  const ansRe = z1.re - z2.re;
  const ansIm = z1.im - z2.im;

  return {
    type: 'subtraction',
    z1, z2,
    question: `(${formatComplex(z1.re, z1.im)}) - (${formatComplex(z2.re, z2.im)})`,
    questionTex: `(${formatComplexTex(z1.re, z1.im)}) - (${formatComplexTex(z2.re, z2.im)})`,
    answer: { re: ansRe, im: ansIm },
    steps: [
      `実部: ${z1.re} - ${z2.re} = ${ansRe}`,
      `虚部: ${z1.im} - ${z2.im} = ${ansIm}`,
      `結果: ${formatComplex(ansRe, ansIm)}`
    ],
    hint: '実部と虚部をそれぞれ引きます。'
  };
}

export function generateMultiplicationProblem(): ComplexProblem {
  const z1 = { re: randInt(-4, 4), im: randNonZero(-4, 4) };
  const z2 = { re: randInt(-4, 4), im: randNonZero(-4, 4) };
  // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
  const ansRe = z1.re * z2.re - z1.im * z2.im;
  const ansIm = z1.re * z2.im + z1.im * z2.re;

  return {
    type: 'multiplication',
    z1, z2,
    question: `(${formatComplex(z1.re, z1.im)}) × (${formatComplex(z2.re, z2.im)})`,
    questionTex: `(${formatComplexTex(z1.re, z1.im)})(${formatComplexTex(z2.re, z2.im)})`,
    answer: { re: ansRe, im: ansIm },
    steps: [
      `(a+bi)(c+di) = (ac-bd) + (ad+bc)i`,
      `実部: ${z1.re}×${z2.re} - ${z1.im}×${z2.im} = ${z1.re * z2.re} - ${z1.im * z2.im} = ${ansRe}`,
      `虚部: ${z1.re}×${z2.im} + ${z1.im}×${z2.re} = ${z1.re * z2.im} + ${z1.im * z2.re} = ${ansIm}`,
      `結果: ${formatComplex(ansRe, ansIm)}`
    ],
    hint: '(a+bi)(c+di) = (ac-bd) + (ad+bc)i を使います。'
  };
}

export function generateDivisionProblem(): ComplexProblem {
  const z2 = { re: randNonZero(-3, 3), im: randNonZero(-3, 3) };
  // Make z1 such that division gives clean numbers
  const ansRe = randInt(-3, 3);
  const ansIm = randInt(-3, 3);
  // z1 = answer * z2
  const z1re = ansRe * z2.re - ansIm * z2.im;
  const z1im = ansRe * z2.im + ansIm * z2.re;
  const z1 = { re: z1re, im: z1im };
  const denom = z2.re * z2.re + z2.im * z2.im;

  return {
    type: 'division',
    z1, z2,
    question: `(${formatComplex(z1.re, z1.im)}) ÷ (${formatComplex(z2.re, z2.im)})`,
    questionTex: `\\frac{${formatComplexTex(z1.re, z1.im)}}{${formatComplexTex(z2.re, z2.im)}}`,
    answer: { re: ansRe, im: ansIm },
    steps: [
      `分母の共役 ${formatComplex(z2.re, -z2.im)} を分子・分母に掛ける`,
      `分母: ${z2.re}² + ${z2.im}² = ${denom}`,
      `分子: (${formatComplex(z1.re, z1.im)})(${formatComplex(z2.re, -z2.im)})`,
      `結果: ${formatComplex(ansRe, ansIm)}`
    ],
    hint: '分母の共役を分子・分母に掛けて実数化します。'
  };
}

export function generateConjugateProblem(): ComplexProblem {
  const z1 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  return {
    type: 'conjugate',
    z1,
    question: `${formatComplex(z1.re, z1.im)} の共役複素数`,
    questionTex: `\\overline{${formatComplexTex(z1.re, z1.im)}}`,
    answer: { re: z1.re, im: -z1.im },
    steps: [
      `共役複素数: 虚部の符号を反転`,
      `${formatComplex(z1.re, z1.im)} → ${formatComplex(z1.re, -z1.im)}`
    ],
    hint: '虚部の符号を反転させます。'
  };
}

export function generateModulusProblem(): ComplexProblem {
  const z1 = { re: randInt(-5, 5), im: randNonZero(-5, 5) };
  const mod = Math.sqrt(z1.re * z1.re + z1.im * z1.im);
  return {
    type: 'modulus',
    z1,
    question: `|${formatComplex(z1.re, z1.im)}|`,
    questionTex: `|${formatComplexTex(z1.re, z1.im)}|`,
    answer: { re: mod, im: 0, modulus: mod },
    steps: [
      `|a + bi| = √(a² + b²)`,
      `= √(${z1.re}² + ${z1.im}²)`,
      `= √(${z1.re * z1.re} + ${z1.im * z1.im})`,
      `= √${z1.re * z1.re + z1.im * z1.im}`,
      `≈ ${mod.toFixed(3)}`
    ],
    hint: '|a+bi| = √(a² + b²) を使います。'
  };
}

export function generateArgumentProblem(): ComplexProblem {
  // Use nice angles
  const angles = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2,
    2 * Math.PI / 3, 3 * Math.PI / 4, 5 * Math.PI / 6, Math.PI,
    -Math.PI / 6, -Math.PI / 4, -Math.PI / 3, -Math.PI / 2,
    -2 * Math.PI / 3, -3 * Math.PI / 4, -5 * Math.PI / 6];
  const r = randInt(1, 3);
  const theta = angles[randInt(0, angles.length - 1)];
  const re = Math.round(r * Math.cos(theta) * 1000) / 1000;
  const im = Math.round(r * Math.sin(theta) * 1000) / 1000;
  const z1 = { re, im };
  const arg = Math.atan2(im, re);

  return {
    type: 'argument',
    z1,
    question: `arg(${formatComplex(re, im)})`,
    questionTex: `\\arg(${formatComplexTex(re, im)})`,
    answer: { re: 0, im: 0, argument: arg },
    steps: [
      `arg(a + bi) = atan2(b, a)`,
      `= atan2(${im}, ${re})`,
      `≈ ${(arg * 180 / Math.PI).toFixed(1)}°`,
      `= ${arg.toFixed(4)} rad`
    ],
    hint: 'arg(a+bi) = atan2(b, a) を使います。'
  };
}

export function generatePolarProblem(): ComplexProblem {
  const r = randInt(1, 5);
  const angleDeg = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330][randInt(0, 14)];
  const theta = angleDeg * Math.PI / 180;
  const re = Math.round(r * Math.cos(theta) * 1000) / 1000;
  const im = Math.round(r * Math.sin(theta) * 1000) / 1000;

  return {
    type: 'polar',
    z1: { re, im },
    question: `${formatComplex(re, im)} を極形式に変換`,
    questionTex: `${formatComplexTex(re, im)}`,
    answer: { re, im, modulus: r, argument: theta },
    steps: [
      `r = |z| = √(${re}² + ${im}²) = ${r}`,
      `θ = arg(z) = ${angleDeg}° = ${(theta).toFixed(4)} rad`,
      `z = ${r}(cos ${angleDeg}° + i sin ${angleDeg}°)`
    ],
    hint: 'r = |z|, θ = arg(z) を求め、r(cosθ + i sinθ) と書きます。'
  };
}

export function generatePowerProblem(): ComplexProblem {
  // De Moivre: (cosθ + i sinθ)^n = cos(nθ) + i sin(nθ)
  const r = randInt(1, 2);
  const angleDeg = [30, 45, 60, 90, 120, 150][randInt(0, 5)];
  const n = randInt(2, 4);
  const theta = angleDeg * Math.PI / 180;
  const resultR = Math.pow(r, n);
  const resultTheta = n * theta;
  const ansRe = Math.round(resultR * Math.cos(resultTheta) * 1000) / 1000;
  const ansIm = Math.round(resultR * Math.sin(resultTheta) * 1000) / 1000;

  const z1re = Math.round(r * Math.cos(theta) * 1000) / 1000;
  const z1im = Math.round(r * Math.sin(theta) * 1000) / 1000;

  return {
    type: 'powers',
    z1: { re: z1re, im: z1im },
    question: `(${formatComplex(z1re, z1im)})^${n}`,
    questionTex: `(${formatComplexTex(z1re, z1im)})^{${n}}`,
    answer: { re: ansRe, im: ansIm, modulus: resultR, argument: resultTheta },
    steps: [
      `極形式: z = ${r}(cos ${angleDeg}° + i sin ${angleDeg}°)`,
      `ド・モアブル: z^${n} = ${r}^${n}(cos ${n}×${angleDeg}° + i sin ${n}×${angleDeg}°)`,
      `= ${resultR}(cos ${n * angleDeg}° + i sin ${n * angleDeg}°)`,
      `≈ ${formatComplex(ansRe, ansIm)}`
    ],
    hint: 'ド・モアブルの定理: [r(cosθ + i sinθ)]^n = r^n(cos nθ + i sin nθ)'
  };
}
