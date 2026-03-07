
function getRandomInt(min: number, max: number, exclude: number[] = []): number {
  let val;
  do {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (exclude.includes(val));
  return val;
}

export type DeterminationType = 'vertex-point' | 'three-points' | 'intercept-point' | 'factor-form';

export interface DeterminationProblem {
  type: DeterminationType;
  given: {
    label: string;
    points?: { x: number; y: number }[];
    vertex?: { x: number; y: number };
    intercepts?: { x1: number; x2: number };
    axis?: number; // x = axis
    minMax?: { type: 'min' | 'max'; value: number; at: number };
  };
  answer: {
    a: number;
    b: number;
    c: number;
    text: string; // e.g., "y = 2(x-1)^2 + 3" or "y = 2x^2 - 4x + 5"
  };
}

// Helper: Format number with sign (e.g., -3 => "-3", 3 => "+3")
const fmt = (n: number) => (n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`);

export function generateDeterminationProblem(): DeterminationProblem {
  const typeRoll = Math.random();
  
  // 60% Vertex, 40% Factor Form
  if (typeRoll < 0.6) {
    return generateVertexPointProblem();
  } else {
    return generateFactorFormProblem();
  }
}

function generateVertexPointProblem(): DeterminationProblem {
  // Target: y = a(x - p)^2 + q
  // We pick a, p, q integers.
  const a = getRandomInt(-3, 3, [0]); // -3, -2, -1, 1, 2, 3
  const p = getRandomInt(-4, 4);
  const q = getRandomInt(-4, 4);

  // We need "another point" (x1, y1) that lies on this graph.
  // Let x1 = p + delta (delta != 0)
  const delta = getRandomInt(-2, 2, [0]);
  const x1 = p + delta;
  const y1 = a * (x1 - p) ** 2 + q; // a * delta^2 + q

  // Question Text
  // "頂点が (p, q) で、点 (x1, y1) を通る二次関数"
  const givenLabel = `頂点が (${p}, ${q}) で、\n点 (${x1}, ${y1}) を通る`;

  // Answer Text (Vertex Form)
  const pStr = p === 0 ? '' : (p > 0 ? `- ${p}` : `+ ${Math.abs(p)}`);
  const qStr = q === 0 ? '' : (q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`);
  
  let answerText = `y = ${a === 1 ? '' : (a === -1 ? '-' : a)}(x ${pStr})^2 ${qStr}`;
  if (p === 0) {
      answerText = `y = ${a === 1 ? '' : (a === -1 ? '-' : a)}x^2 ${qStr}`;
  }

  // Calculate b, c for expansion if needed
  const b = -2 * a * p;
  const c = a * p * p + q;

  return {
    type: 'vertex-point',
    given: {
      label: givenLabel,
      vertex: { x: p, y: q },
      points: [{ x: x1, y: y1 }]
    },
    answer: {
      a, b, c,
      text: answerText
    }
  };
}

function generateFactorFormProblem(): DeterminationProblem {
  // Target: y = a(x - alpha)(x - beta)
  // Given: x-intercepts (alpha, 0), (beta, 0) and a point (x1, y1)
  
  const a = getRandomInt(-2, 2, [0]); // -2, -1, 1, 2
  // Ensure alpha != beta usually, but equal is fine (touching axis)
  const alpha = getRandomInt(-3, 3);
  let beta = getRandomInt(-3, 3);
  
  // Pick a point NOT on the x-axis to determine 'a'
  // Let x1 be something simple like 0 (y-intercept) if alpha, beta != 0
  // Or just random integer near roots.
  let x1 = getRandomInt(-4, 4);
  while (x1 === alpha || x1 === beta) {
      x1 = getRandomInt(-4, 4);
  }

  const y1 = a * (x1 - alpha) * (x1 - beta);

  // Question Text
  const givenLabel = `x軸と2点 (${alpha}, 0), (${beta}, 0) で交わり、\n点 (${x1}, ${y1}) を通る`;

  // Answer Text: y = a(x-alpha)(x-beta)
  const alphaStr = alpha === 0 ? 'x' : `(x ${alpha > 0 ? '-' : '+'} ${Math.abs(alpha)})`;
  const betaStr = beta === 0 ? 'x' : `(x ${beta > 0 ? '-' : '+'} ${Math.abs(beta)})`;
  
  // If alpha == beta, it's a(x-alpha)^2
  let factorText = `y = ${a === 1 ? '' : (a === -1 ? '-' : a)}${alphaStr}${betaStr}`;
  if (alpha === beta) {
      factorText = `y = ${a === 1 ? '' : (a === -1 ? '-' : a)}${alphaStr}^2`;
  }

  // Calculate standard form coefficients
  // y = a(x^2 - (alpha+beta)x + alpha*beta)
  const b = -a * (alpha + beta);
  const c = a * alpha * beta;

  return {
    type: 'factor-form',
    given: {
      label: givenLabel,
      intercepts: { x1: alpha, x2: beta },
      points: [{ x: x1, y: y1 }]
    },
    answer: {
      a, b, c,
      text: factorText
    }
  };
}
