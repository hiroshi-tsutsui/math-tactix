export interface DifferentSignsProblem {
  type: 'different_signs';
  equation: string;
  description: string;
  correctAnswer: string;
}

export function generateDifferentSignsProblem(): DifferentSignsProblem {
  return {
    type: 'different_signs',
    equation: 'x^2 + mx + (m - 2) = 0',
    description: '方程式が異符号の解（1つの正の解と1つの負の解）をもつような定数mの値の範囲を求めよ。',
    correctAnswer: 'm < 2'
  };
}
