export interface TacticsQuestion {
  generalForm: string;
  standardForm?: string; // e.g. "y = 2(x - 5)^2 - 6"
  answer: string;        // e.g. "(5, -6)"
  vertex?: [number, number];
  a?: number;            // Added: coefficient a
  instruction: string;
  options: string[];
  hint?: string;
  explanation?: string[]; // Step-by-step breakdown
}

export const generateVertexFormProblem = (): TacticsQuestion => {
  // 1. Generate integer vertex (p, q)
  // Range: -5 to 5
  const p = Math.floor(Math.random() * 11) - 5; 
  const q = Math.floor(Math.random() * 11) - 5;

  // 2. Generate integer coefficient a (1, -1, 2, -2, maybe 3)
  const aCandidates = [1, -1, 2, -2];
  const a = aCandidates[Math.floor(Math.random() * aCandidates.length)];

  // 3. Expand to General Form: y = a(x-p)^2 + q
  // y = a(x^2 - 2px + p^2) + q
  // y = ax^2 - 2apx + (ap^2 + q)
  
  const b = -2 * a * p;
  const c = a * p * p + q;

  // 4. Format Terms
  const xSq = a === 1 ? "x^2" : a === -1 ? "-x^2" : `${a}x^2`;
  const xTerm = b === 0 ? "" : b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
  const cTerm = c === 0 ? "" : c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  
  const generalForm = `y = ${xSq} ${xTerm} ${cTerm}`;
  
  // 5. Standard Form String (Answer)
  const aStr = a === 1 ? "" : a === -1 ? "-" : `${a}`;
  const pSign = p > 0 ? `- ${p}` : `+ ${Math.abs(p)}`;
  const qSign = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
  const standardForm = `y = ${aStr}(x ${p === 0 ? '' : pSign})^2 ${q === 0 ? '' : qSign}`;

  // 6. Generate Options (Distractors)
  // Correct: (p, q)
  // Trap 1: (-p, q)  -> Sign error on x
  // Trap 2: (p, -q)  -> Sign error on y
  // Trap 3: (q, p)   -> Swap x/y
  
  const correct = `(${p}, ${q})`;
  const traps = [
    `(${-p}, ${q})`,
    `(${p}, ${-q})`,
    `(${q}, ${p})`,
    `(${-p}, ${-q})`
  ];
  
  // Shuffle and pick 3 unique traps
  const uniqueTraps = Array.from(new Set(traps.filter(t => t !== correct))).slice(0, 3);
  while(uniqueTraps.length < 3) {
    // Fallback if p=0 or q=0 reduces uniqueness
    const rX = Math.floor(Math.random() * 10) - 5;
    const rY = Math.floor(Math.random() * 10) - 5;
    const rnd = `(${rX}, ${rY})`;
    if(rnd !== correct && !uniqueTraps.includes(rnd)) uniqueTraps.push(rnd);
  }

  const options = [correct, ...uniqueTraps].sort(() => Math.random() - 0.5);

  // 7. Explanation Steps
  const explanation = [
    `1. $x^2$ の係数 ${a} でくくる: $y = ${a}(x^2 ${b/a >= 0 ? '+' : ''}${b/a}x) ${c >= 0 ? '+' : ''}${c}$`,
    `2. ()の中を平方完成: $y = ${a}\\{(x - ${p})^2 - ${p*p}\\} ${c >= 0 ? '+' : ''}${c}$`,
    `3. 展開して整理: $y = ${a}(x - ${p})^2 - ${a*p*p} ${c >= 0 ? '+' : ''}${c}$`,
    `4. 計算: $y = ${a === 1 ? '' : a === -1 ? '-' : a}(x - ${p})^2 ${q >= 0 ? '+' : ''}${q}$`,
    `5. 頂点は $(${p}, ${q})$`
  ];

  return {
    generalForm,
    standardForm,
    answer: correct,
    vertex: [p, q],
    a,
    instruction: "次の2次関数を標準形に変形し、頂点を求めよ。",
    options,
    hint: "平方完成を利用します。",
    explanation
  };
};
