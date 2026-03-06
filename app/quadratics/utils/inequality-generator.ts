// import { generateQuadratic } from './vertex-form-generator';

export interface InequalityProblem {
  a: number;
  b: number;
  c: number;
  sign: '>' | '<' | '>=' | '<=';
  roots: [number, number]; // alpha <= beta
  solutionText: string;
  graphProps: {
    a: number;
    p: number; // vertex x
    q: number; // vertex y
    inequality: {
      roots: [number, number];
      solutionType: 'between' | 'outside' | 'all' | 'none' | 'point';
      sign: '>' | '<' | '>=' | '<=';
    };
  };
}

export function generateInequalityProblem(): InequalityProblem {
  // Strategy: Pick roots alpha, beta first to ensure integer solutions.
  // Roots between -6 and 6.
  const alpha = Math.floor(Math.random() * 9) - 4; // -4 to 4
  const beta = alpha + Math.floor(Math.random() * 5) + 1; // alpha + 1 to alpha + 5 (distinct roots for now)
  
  // Pick 'a' (scale factor). Usually 1 or -1 for simplicity, maybe 2 sometimes.
  const aBase = Math.random() < 0.7 ? 1 : (Math.random() < 0.5 ? 2 : -1);
  const a = aBase;

  // Form: a(x - alpha)(x - beta)
  // = a(x^2 - (alpha+beta)x + alpha*beta)
  // = a*x^2 - a(alpha+beta)x + a*alpha*beta
  const b = -a * (alpha + beta);
  const c = a * alpha * beta;

  // Vertex
  const p = (alpha + beta) / 2;
  const q = a * (p - alpha) * (p - beta); // q = f(p)

  // Pick inequality sign
  const signs: ('<' | '>' | '<=' | '>=')[] = ['<', '>', '<=', '>='];
  const sign = signs[Math.floor(Math.random() * signs.length)];

  // Determine solution type
  // If a > 0 (opening up):
  //   > 0: outside roots (x < alpha, x > beta)
  //   < 0: between roots (alpha < x < beta)
  // If a < 0 (opening down):
  //   > 0: between roots
  //   < 0: outside roots

  let solutionType: 'between' | 'outside' | 'all' | 'none' | 'point';
  
  if (a > 0) {
    if (sign.includes('>')) solutionType = 'outside';
    else solutionType = 'between';
  } else {
    // a < 0
    if (sign.includes('>')) solutionType = 'between';
    else solutionType = 'outside';
  }

  // Generate Solution Text (Japanese)
  let text = '';
  if (solutionType === 'between') {
    if (sign.includes('=')) text = `${alpha} \\leqq x \\leqq ${beta}`;
    else text = `${alpha} < x < ${beta}`;
  } else {
    // outside
    if (sign.includes('=')) text = `x \\leqq ${alpha}, \\quad ${beta} \\leqq x`;
    else text = `x < ${alpha}, \\quad ${beta} < x`;
  }

  return {
    a, b, c,
    sign,
    roots: [alpha, beta],
    solutionText: text,
    graphProps: {
      a, p, q,
      inequality: {
        roots: [alpha, beta],
        solutionType,
        sign
      }
    }
  };
}
