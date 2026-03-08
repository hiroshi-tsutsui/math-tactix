export interface IntersectionProblem {
  id: string;
  type: 'intersection';
  question: string;
  parabola: string; // e.g. "y = x^2"
  line: string;     // e.g. "y = 2x + k"
  variable: string; // 'k' or 'm'
  explanation: string[];
}

export const generateIntersectionProblem = (): IntersectionProblem => {
  // Scenario 1: Line with variable intercept (k)
  // y = x^2 and y = 2x + k
  // x^2 - 2x - k = 0
  // D/4 = (-1)^2 - 1(-k) = 1 + k
  
  return {
    id: `intersection-${Date.now()}`,
    type: 'intersection',
    question: '放物線 y = x² と 直線 y = 2x + k の共有点の個数を調べよ。',
    parabola: 'y = x^2',
    line: 'y = 2x + k',
    variable: 'k',
    explanation: [
      '共有点のx座標は、2つの式を連立した方程式の実数解と同じです。',
      'x² = 2x + k 整理すると x² - 2x - k = 0',
      '判別式 D/4 = (-1)² - 1(-k) = 1 + k',
      'D > 0 すなわち k > -1 のとき、共有点は2個',
      'D = 0 すなわち k = -1 のとき、共有点は1個 (接する)',
      'D < 0 すなわち k < -1 のとき、共有点は0個',
    ]
  };
};
