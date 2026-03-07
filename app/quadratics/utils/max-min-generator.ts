
// Define interface locally if not exported, or just match the structure expected by page.tsx
export interface TacticsQuestion {
  generalForm: string; // Used for display or internal ID
  standardForm?: string;
  answer: string;
  vertex?: [number, number]; // Optional, but useful for graph centering
  instruction: string;
  options: string[];
  hint?: string;
  explanation?: string[];
  // New fields for Max/Min visualization
  type?: 'max-min';
  domain?: [number, number];
  target?: 'max' | 'min';
}

export const generateMaxMinProblem = (): TacticsQuestion => {
  // 1. Randomize parameters for y = a(x-p)^2 + q
  const a = Math.random() < 0.5 ? 1 : -1;
  const p = Math.floor(Math.random() * 5) - 2; // -2 to 2
  const q = Math.floor(Math.random() * 5) - 2; // -2 to 2

  // 2. Define Domain [dMin, dMax]
  const domainStart = Math.floor(Math.random() * 6) - 3; // -3 to 2
  const domainLength = Math.floor(Math.random() * 3) + 2; // Length 2 to 4
  const domainEnd = domainStart + domainLength;

  // 3. Calculate Max/Min
  const f = (x: number) => a * Math.pow(x - p, 2) + q;
  const valStart = f(domainStart);
  const valEnd = f(domainEnd);
  const valVertex = q;
  const isVertexInDomain = (p >= domainStart && p <= domainEnd);

  let maxVal, minVal;
  if (a > 0) { // Convex (Opening Up)
    minVal = isVertexInDomain ? valVertex : Math.min(valStart, valEnd);
    maxVal = Math.max(valStart, valEnd);
  } else { // Concave (Opening Down)
    maxVal = isVertexInDomain ? valVertex : Math.max(valStart, valEnd);
    minVal = Math.min(valStart, valEnd);
  }

  // 4. Formulate Question
  const type = Math.random() < 0.5 ? 'max' : 'min';
  const targetVal = type === 'max' ? maxVal : minVal;
  const typeStr = type === 'max' ? '最大値' : '最小値';

  // Equation string
  const sign = a === 1 ? '' : '-';
  const pStr = p === 0 ? 'x^2' : `(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2`; 
  const qStr = q === 0 ? '' : ` ${q > 0 ? '+' : '-'} ${Math.abs(q)}`;
  const equation = `y = ${sign}${pStr}${qStr}`;

  // Generate wrong options
  const wrongOptions = new Set<string>();
  // Common mistakes: 
  // - Vertex value when not in domain
  // - Wrong boundary
  // - Min instead of Max
  wrongOptions.add((type === 'max' ? minVal : maxVal).toString());
  wrongOptions.add(f(domainStart).toString());
  wrongOptions.add(f(domainEnd).toString());
  if (!isVertexInDomain) wrongOptions.add(q.toString());
  wrongOptions.add((targetVal + 1).toString());
  wrongOptions.add((targetVal - 1).toString());

  // Convert to array and filter correct answer
  const options = Array.from(wrongOptions)
    .filter(opt => opt !== targetVal.toString())
    .slice(0, 3);
  options.push(targetVal.toString());
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    generalForm: equation, // Used for display in some components
    standardForm: equation, // Already in vertex form
    answer: targetVal.toString(),
    vertex: [p, q],
    instruction: `次の関数の定義域 $$${domainStart} \\leqq x \\leqq ${domainEnd}$$ における${typeStr}を求めよ。\n$$${equation}$$`,
    options: options,
    hint: `グラフの概形を描き、定義域 [${domainStart}, ${domainEnd}] の範囲を確認しましょう。`,
    type: 'max-min',
    domain: [domainStart, domainEnd],
    target: type
  };
};
