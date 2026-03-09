export interface AbsoluteInequalityProblem {
  aParam: number; // For the x^2 term
  bParamCoeff: number; // e.g. k in kx
  cParamVar: number; // e.g. k in k+3
  cParamConst: number; // e.g. 3 in k+3
  solutionKRange: [number, number];
}

export function generateAbsoluteInequalityProblem(): AbsoluteInequalityProblem {
  // Let's fix to simple problem: x^2 + kx + (k+3) > 0 -> D = k^2 - 4k - 12 = (k-6)(k+2) < 0 -> -2 < k < 6
  return {
    aParam: 1,
    bParamCoeff: 1,
    cParamVar: 1,
    cParamConst: 3,
    solutionKRange: [-2, 6]
  };
}
