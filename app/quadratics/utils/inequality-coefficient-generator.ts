export function generateInequalityCoefficientProblem() {
  const isInside = Math.random() > 0.5;
  const alpha = Math.floor(Math.random() * 5) - 3; // -3 to +1
  const beta = alpha + Math.floor(Math.random() * 3) + 1; // > alpha

  let aValue = 1;
  // If > 0 and inside: a < 0
  // If > 0 and outside: a > 0
  // Let's stick to " > 0 "
  if (isInside) {
    aValue = - (Math.floor(Math.random() * 2) + 1); // -1 or -2
  } else {
    aValue = Math.floor(Math.random() * 2) + 1; // 1 or 2
  }

  const bValue = -aValue * (alpha + beta);
  const cValue = aValue * alpha * beta;
  
  const sign = ">";
  const solutionText = isInside ? `${alpha} < x < ${beta}` : `x < ${alpha}, ${beta} < x`;

  return {
    equation: `ax^2 + bx + c > 0`,
    solutionText,
    alpha,
    beta,
    a: aValue,
    b: bValue,
    c: cValue,
    isInside
  };
}
