export const generateSimultaneousInequalityProblem = () => {
  // Generate two inequalities with nice integer roots
  // Range: -6 to 6 to fit well within the -8 to 8 viz
  const generateRoots = () => {
    const r1 = Math.floor(Math.random() * 12) - 6; 
    const r2 = Math.floor(Math.random() * 12) - 6;
    // Ensure distinct roots for simplicity
    if (r1 === r2) return [r1, r1 + 2];
    return [Math.min(r1, r2), Math.max(r1, r2)];
  };

  const [a, b] = generateRoots();
  const [c, d] = generateRoots();

  // Randomly choose < 0 or > 0 for each
  const op1 = Math.random() > 0.5 ? '>' : '<';
  const op2 = Math.random() > 0.5 ? '>' : '<';

  // Construct question string: (x-r1)(x-r2) => x^2 - (r1+r2)x + r1*r2
  const formatInequality = (r1: number, r2: number, op: string) => {
    const sum = r1 + r2;
    const prod = r1 * r2;
    
    let midTerm = '';
    if (sum > 0) midTerm = ` - ${sum}x`;
    else if (sum < 0) midTerm = ` + ${-sum}x`;
    else midTerm = ''; // 0x
    
    let constTerm = '';
    if (prod > 0) constTerm = ` + ${prod}`;
    else if (prod < 0) constTerm = ` - ${-prod}`;
    // if 0, omit
    
    // Handle pure x^2 case
    if (!midTerm && !constTerm) return `x^2 ${op} 0`;

    return `x^2${midTerm}${constTerm} ${op} 0`;
  };

  const eq1 = formatInequality(a, b, op1);
  const eq2 = formatInequality(c, d, op2);

  // Calculate solutions
  // inside: r1 < x < r2 (if op is <)
  // outside: x < r1, x > r2 (if op is >)
  const getRange = (r1: number, r2: number, op: string) => {
    if (op === '>') return { type: 'outside', min: r1, max: r2 };
    return { type: 'inside', min: r1, max: r2 };
  };

  const range1 = getRange(a, b, op1);
  const range2 = getRange(c, d, op2);

  return {
    id: `simul-${Date.now()}`,
    type: 'simultaneous_inequality',
    question: '次の連立不等式を解け。',
    equations: [eq1, eq2],
    ranges: [range1, range2],
    explanation: [
      `1つ目の不等式: ${eq1}`,
      range1.type === 'inside' ? `  解: ${range1.min} < x < ${range1.max}` : `  解: x < ${range1.min}, ${range1.max} < x`,
      `2つ目の不等式: ${eq2}`,
      range2.type === 'inside' ? `  解: ${range2.min} < x < ${range2.max}` : `  解: x < ${range2.min}, ${range2.max} < x`,
      '--------------------------------',
      'ヒント: ',
      '1. 数直線をステップごとに描いてみよう（下のボタンを使ってね！）',
      '2. 青と赤が重なっている部分が答えです。',
      '3. もし重なる部分がなければ「解なし」です。'
    ]
  };
};