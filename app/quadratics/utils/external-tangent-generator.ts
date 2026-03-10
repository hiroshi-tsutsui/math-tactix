import { Problem } from '../types';

export const generateExternalTangentProblem = (): Problem => {
  return {
    id: `ext-tangent-${Date.now()}`,
    type: 'external_tangent',
    level: 35,
    question: '点 P(1, -3) から放物線 y = x² に引いた接線の方程式を求めよ。',
    answer: 'y = 6x - 9, y = -2x - 1',
    options: [
      'y = 6x - 9, y = -2x - 1',
      'y = 5x - 8, y = -x - 2',
      'y = 4x - 7, y = -3x',
      'y = 2x - 5, y = x - 4'
    ],
    explanation: '点Pを通る直線の式を y = m(x-1)-3 とおき、放物線の式 y = x^2 と連立させます。接するということは交点が1つ（重解）であるため、判別式 D = m^2 - 4m - 12 = 0 となります。これを解くと m = 6, -2 となります。'
  };
};
