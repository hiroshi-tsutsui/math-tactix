/**
 * matrices-generator.ts
 * 行列の各種問題を生成するユーティリティ
 */

export interface MatrixProblem {
  type: 'addition' | 'subtraction' | 'scalarMul' | 'matMul' | 'determinant' | 'inverse' | 'system';
  matA: number[][];
  matB?: number[][];
  scalar?: number;
  question: string;
  answer: number[][] | number;
  answerTex: string;
  steps: string[];
  hint: string;
}

/** -5〜5 の整数をランダムに返す（0含む） */
function randInt(min = -5, max = 5): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 0を除く -5〜5 の整数 */
function randNonZero(min = -5, max = 5): number {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

/** 2x2行列をKaTeX文字列に変換 */
export function matToTex(m: number[][]): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;
}

/** 2x2行列の加算 */
function addMat(a: number[][], b: number[][]): number[][] {
  return [
    [a[0][0] + b[0][0], a[0][1] + b[0][1]],
    [a[1][0] + b[1][0], a[1][1] + b[1][1]],
  ];
}

/** 2x2行列の減算 */
function subMat(a: number[][], b: number[][]): number[][] {
  return [
    [a[0][0] - b[0][0], a[0][1] - b[0][1]],
    [a[1][0] - b[1][0], a[1][1] - b[1][1]],
  ];
}

/** 2x2行列のスカラー倍 */
function scalarMulMat(k: number, m: number[][]): number[][] {
  return [
    [k * m[0][0], k * m[0][1]],
    [k * m[1][0], k * m[1][1]],
  ];
}

/** 2x2行列の積 */
function mulMat(a: number[][], b: number[][]): number[][] {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1],
    ],
  ];
}

/** 2x2行列式 */
function det2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/** 2x2逆行列（detが0でないこと前提） */
function inv2(m: number[][]): number[][] {
  const d = det2(m);
  return [
    [m[1][1] / d, -m[0][1] / d],
    [-m[1][0] / d, m[0][0] / d],
  ];
}

/** ランダム2x2行列生成 */
function randMat(): number[][] {
  return [
    [randInt(-4, 4), randInt(-4, 4)],
    [randInt(-4, 4), randInt(-4, 4)],
  ];
}

/** det!=0 のランダム2x2行列 */
function randInvertibleMat(): number[][] {
  let m = randMat();
  while (det2(m) === 0) {
    m = randMat();
  }
  return m;
}

// ─── 問題生成関数 ───

export function generateAdditionProblem(): MatrixProblem {
  const a = randMat();
  const b = randMat();
  const ans = addMat(a, b);
  return {
    type: 'addition',
    matA: a,
    matB: b,
    question: `${matToTex(a)} + ${matToTex(b)}`,
    answer: ans,
    answerTex: matToTex(ans),
    steps: [
      `A + B の各成分を足す`,
      `(1,1): ${a[0][0]} + ${b[0][0]} = ${ans[0][0]}`,
      `(1,2): ${a[0][1]} + ${b[0][1]} = ${ans[0][1]}`,
      `(2,1): ${a[1][0]} + ${b[1][0]} = ${ans[1][0]}`,
      `(2,2): ${a[1][1]} + ${b[1][1]} = ${ans[1][1]}`,
    ],
    hint: '同じ位置の成分どうしを足します。',
  };
}

export function generateSubtractionProblem(): MatrixProblem {
  const a = randMat();
  const b = randMat();
  const ans = subMat(a, b);
  return {
    type: 'subtraction',
    matA: a,
    matB: b,
    question: `${matToTex(a)} - ${matToTex(b)}`,
    answer: ans,
    answerTex: matToTex(ans),
    steps: [
      `A - B の各成分を引く`,
      `(1,1): ${a[0][0]} - ${b[0][0]} = ${ans[0][0]}`,
      `(1,2): ${a[0][1]} - ${b[0][1]} = ${ans[0][1]}`,
      `(2,1): ${a[1][0]} - ${b[1][0]} = ${ans[1][0]}`,
      `(2,2): ${a[1][1]} - ${b[1][1]} = ${ans[1][1]}`,
    ],
    hint: '同じ位置の成分どうしを引きます。',
  };
}

export function generateScalarMulProblem(): MatrixProblem {
  const k = randNonZero(-5, 5);
  const m = randMat();
  const ans = scalarMulMat(k, m);
  return {
    type: 'scalarMul',
    matA: m,
    scalar: k,
    question: `${k} \\cdot ${matToTex(m)}`,
    answer: ans,
    answerTex: matToTex(ans),
    steps: [
      `各成分を ${k} 倍する`,
      `(1,1): ${k} \\times ${m[0][0]} = ${ans[0][0]}`,
      `(1,2): ${k} \\times ${m[0][1]} = ${ans[0][1]}`,
      `(2,1): ${k} \\times ${m[1][0]} = ${ans[1][0]}`,
      `(2,2): ${k} \\times ${m[1][1]} = ${ans[1][1]}`,
    ],
    hint: 'すべての成分にスカラーをかけます。',
  };
}

export function generateMultiplicationProblem(): MatrixProblem {
  const a = randMat();
  const b = randMat();
  const ans = mulMat(a, b);
  return {
    type: 'matMul',
    matA: a,
    matB: b,
    question: `${matToTex(a)} \\cdot ${matToTex(b)}`,
    answer: ans,
    answerTex: matToTex(ans),
    steps: [
      `(AB)_{ij} = \\sum_k A_{ik} B_{kj}`,
      `(1,1): ${a[0][0]}\\times${b[0][0]} + ${a[0][1]}\\times${b[1][0]} = ${ans[0][0]}`,
      `(1,2): ${a[0][0]}\\times${b[0][1]} + ${a[0][1]}\\times${b[1][1]} = ${ans[0][1]}`,
      `(2,1): ${a[1][0]}\\times${b[0][0]} + ${a[1][1]}\\times${b[1][0]} = ${ans[1][0]}`,
      `(2,2): ${a[1][0]}\\times${b[0][1]} + ${a[1][1]}\\times${b[1][1]} = ${ans[1][1]}`,
    ],
    hint: '行と列の内積を計算します。',
  };
}

export function generateDeterminantProblem(): MatrixProblem {
  const m = randMat();
  const d = det2(m);
  return {
    type: 'determinant',
    matA: m,
    question: `\\det ${matToTex(m)}`,
    answer: d,
    answerTex: String(d),
    steps: [
      `\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc`,
      `= ${m[0][0]} \\times ${m[1][1]} - ${m[0][1]} \\times ${m[1][0]}`,
      `= ${m[0][0] * m[1][1]} - ${m[0][1] * m[1][0]}`,
      `= ${d}`,
    ],
    hint: 'ad - bc の公式を使います。',
  };
}

export function generateInverseProblem(): MatrixProblem {
  const m = randInvertibleMat();
  const d = det2(m);
  const invM = inv2(m);
  // 整数解になるよう調整: det が ±1 の行列を生成
  const niceMat = (): number[][] => {
    let mat = randInvertibleMat();
    while (Math.abs(det2(mat)) !== 1) {
      mat = randInvertibleMat();
    }
    return mat;
  };
  const mat = niceMat();
  const detVal = det2(mat);
  const invMat = inv2(mat);
  return {
    type: 'inverse',
    matA: mat,
    question: `${matToTex(mat)}^{-1}`,
    answer: invMat,
    answerTex: matToTex(invMat),
    steps: [
      `\\det A = ${mat[0][0]} \\times ${mat[1][1]} - ${mat[0][1]} \\times ${mat[1][0]} = ${detVal}`,
      `A^{-1} = \\frac{1}{${detVal}} ${matToTex([[mat[1][1], -mat[0][1]], [-mat[1][0], mat[0][0]]])}`,
      `= ${matToTex(invMat)}`,
    ],
    hint: '逆行列の公式: A^{-1} = (1/det A) [[d,-b],[-c,a]]',
  };
}

export function generateSystemProblem(): MatrixProblem {
  // Ax = b で整数解になるよう生成
  // まず解 x を決めてから A, b を逆算
  const x1 = randInt(-3, 3);
  const x2 = randInt(-3, 3);
  const mat = (): number[][] => {
    let m = randInvertibleMat();
    while (Math.abs(det2(m)) > 5) {
      m = randInvertibleMat();
    }
    return m;
  };
  const A = mat();
  const b1 = A[0][0] * x1 + A[0][1] * x2;
  const b2 = A[1][0] * x1 + A[1][1] * x2;

  return {
    type: 'system',
    matA: A,
    question: `\\begin{cases} ${A[0][0]}x + ${A[0][1]}y = ${b1} \\\\ ${A[1][0]}x + ${A[1][1]}y = ${b2} \\end{cases}`,
    answer: [[x1], [x2]],
    answerTex: `x = ${x1},\\; y = ${x2}`,
    steps: [
      `行列表現: ${matToTex(A)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`,
      `\\det A = ${det2(A)}`,
      `逆行列を用いて解く`,
      `x = ${x1},\\; y = ${x2}`,
    ],
    hint: '係数行列の逆行列を両辺にかけます。',
  };
}
