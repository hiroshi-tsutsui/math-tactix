export interface SignOfRootsProblem {
  type: 'sign_of_roots';
  equation: string;
  description: string;
  correctAnswer: string;
}

export function generateSignOfRootsProblem(): SignOfRootsProblem {
  return {
    type: 'sign_of_roots',
    equation: 'x^2 + mx + m + 3 = 0',
    description: '2つの異なる正の実数解をもつような定数mの値の範囲を求めよ。',
    correctAnswer: '-3 < m < -2'
  };
}
