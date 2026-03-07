export interface ParametricInequalityProblem {
  type: 'parametric_inequality';
  param: string; // usually 'a'
  fixedRoot: number; // e.g., 1
  variableRootExpr: string; // e.g., 'a'
  inequalitySign: '<' | '>'; 
  questionText: string;
  cases: {
    condition: string; // e.g., "a < 1"
    solution: string;  // e.g., "a < x < 1"
  }[];
}

export function generateParametricInequalityProblem(): ParametricInequalityProblem {
  // Pattern: (x - alpha)(x - a) < 0
  // Fixed root alpha = 1, 2, or -1 (keep it simple integers)
  const alpha = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
  const param = 'a';
  
  // Decide inequality direction: < 0 (between) or > 0 (outside)
  const isLessThan = Math.random() < 0.5;
  const sign = isLessThan ? '<' : '>';

  // Question: Solve x^2 - (alpha + a)x + alpha*a [sign] 0
  // Display as: x^2 - (a + ${alpha})x + ${alpha}a ${sign} 0
  const termB = `(a + ${alpha})`;
  const termC = `${alpha}a`;
  
  const questionText = `x^2 - ${termB}x + ${termC} ${sign} 0`;

  let cases = [];

  if (isLessThan) {
    // (x-alpha)(x-a) < 0
    // Case 1: a < alpha -> a < x < alpha
    cases.push({ condition: `a < ${alpha}`, solution: `a < x < ${alpha}` });
    // Case 2: a = alpha -> (x-alpha)^2 < 0 -> No solution
    cases.push({ condition: `a = ${alpha}`, solution: `解なし` });
    // Case 3: a > alpha -> alpha < x < a
    cases.push({ condition: `a > ${alpha}`, solution: `${alpha} < x < a` });
  } else {
    // (x-alpha)(x-a) > 0
    // Case 1: a < alpha -> x < a, alpha < x
    cases.push({ condition: `a < ${alpha}`, solution: `x < a, \\quad ${alpha} < x` });
    // Case 2: a = alpha -> (x-alpha)^2 > 0 -> x != alpha
    cases.push({ condition: `a = ${alpha}`, solution: `x \\neq ${alpha}` });
    // Case 3: a > alpha -> x < alpha, a < x
    cases.push({ condition: `a > ${alpha}`, solution: `x < ${alpha}, \\quad a < x` });
  }

  return {
    type: 'parametric_inequality',
    param,
    fixedRoot: alpha,
    variableRootExpr: 'a',
    inequalitySign: sign,
    questionText,
    cases
  };
}
