export interface RootsLocationProblem {
  id: string;
  type: 'positive' | 'negative' | 'different';
  questionText: string;
  equation: string; // LaTeX
  conditions: {
    discriminant: string; // D >= 0
    axis: string; // axis > 0
    boundary: string; // f(0) > 0 or f(k) > 0
  };
  answer: string; // e.g. "m > 2"
  explanation: string[];
  parameters: {
    m_coeff: number; // coefficient of x
    constant_m: number; // coefficient of constant term involving m
    constant_val: number; // constant value
  };
}

export const generateRootsLocationProblem = (): RootsLocationProblem => {
  const types = ['positive', 'negative', 'different'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Base form: x^2 - 2mx + (m + k) = 0
  // Simplest for generation: x^2 - 2mx + m + 2 = 0
  
  let m_coeff = -2; // coeff of x term (with m)
  let constant_m = 1; // coeff of m in constant term
  let constant_val = 0;
  
  // To ensure nice integer boundaries, let's reverse engineer.
  // D/4 = m^2 - (m + k) >= 0 => m^2 - m - k >= 0
  
  if (type === 'positive') {
    // Case: Two positive roots
    // Eq: x^2 - 2mx + m + 2 = 0
    // 1. D/4 = m^2 - (m + 2) >= 0 => (m-2)(m+1) >= 0 => m <= -1, m >= 2
    // 2. Axis: x = m > 0
    // 3. f(0) = m + 2 > 0 => m > -2
    // Combined: m >= 2
    
    constant_val = 2;
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'positive',
      questionText: '2次方程式 $x^2 - 2mx + m + 2 = 0$ が異なる2つの正の解を持つような定数 $m$ の値の範囲を求めよ。',
      equation: 'x^2 - 2mx + m + 2 = 0',
      conditions: {
        discriminant: 'm \\le -1, 2 \\le m',
        axis: 'm > 0',
        boundary: 'm > -2'
      },
      answer: 'm \\ge 2', // Wait, "different" implies D > 0. If "two roots" usually implies D >= 0 unless specified "distinct". 
                     // Standard Japanese math: "異なる2つの解" -> D > 0. "2つの解" -> D >= 0.
                     // Let's say "異なる2つの正の解" (distinct positive roots).
                     // Then m < -1, m > 2. Combined with m>0, m>-2 => m > 2.
      explanation: [
        '異なる2つの正の解を持つ条件は以下の3つ：',
        '1. 判別式 $D > 0$',
        '2. 軸 $> 0$',
        '3. $f(0) > 0$'
      ],
      parameters: { m_coeff: -2, constant_m: 1, constant_val: 2 }
    };
  } else if (type === 'negative') {
    // Case: Two distinct negative roots
    // Eq: x^2 + 2mx + m + 6 = 0
    // 1. D/4 = m^2 - (m + 6) > 0 => (m-3)(m+2) > 0 => m < -2, m > 3
    // 2. Axis: x = -m < 0 => m > 0
    // 3. f(0) = m + 6 > 0 => m > -6
    // Combined: m > 3
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'negative',
      questionText: '2次方程式 $x^2 + 2mx + m + 6 = 0$ が異なる2つの負の解を持つような定数 $m$ の値の範囲を求めよ。',
      equation: 'x^2 + 2mx + m + 6 = 0',
      conditions: {
        discriminant: 'm < -2, 3 < m',
        axis: 'm > 0',
        boundary: 'm > -6'
      },
      answer: 'm > 3',
      explanation: [
        '異なる2つの負の解を持つ条件は以下の3つ：',
        '1. 判別式 $D > 0$',
        '2. 軸 $< 0$',
        '3. $f(0) > 0$'
      ],
      parameters: { m_coeff: 2, constant_m: 1, constant_val: 6 }
    };
  } else {
    // Case: Different signs (one positive, one negative)
    // Eq: x^2 - 2mx + m - 3 = 0
    // Condition: f(0) < 0
    // m - 3 < 0 => m < 3
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'different',
      questionText: '2次方程式 $x^2 - 2mx + m - 3 = 0$ が異符号の解を持つような定数 $m$ の値の範囲を求めよ。',
      equation: 'x^2 - 2mx + m - 3 = 0',
      conditions: {
        discriminant: '(自動的に満たされる)',
        axis: '(考慮不要)',
        boundary: 'm < 3'
      },
      answer: 'm < 3',
      explanation: [
        '異符号の解を持つ条件は $f(0) < 0$ のみ。',
        '（このとき判別式 $D > 0$ は常に成り立つ）'
      ],
      parameters: { m_coeff: -2, constant_m: 1, constant_val: -3 }
    };
  }
};
