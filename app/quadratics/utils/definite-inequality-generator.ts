export interface DefiniteInequalityProblem {
  id: string;
  type: 'always_positive' | 'always_negative' | 'exist_positive' | 'no_solution';
  question: string;
  inequality: string; // e.g. "x^2 + 2x + k > 0"
  condition: string;  // e.g. "D < 0"
  answer: string;     // e.g. "k > 1"
  k_val: number;      // initial k value for visualization
  vertex_x: number;
}

export const generateDefiniteInequalityProblem = (): DefiniteInequalityProblem => {
  // We focus on "Always Positive" (x^2 + 2x + k > 0)
  // Vertex is fixed at x = -1.
  // y = (x+1)^2 + (k-1)
  // Condition for > 0 is vertex y > 0 => k-1 > 0 => k > 1.
  
  return {
    id: 'def-ineq-1',
    type: 'always_positive',
    question: "すべての実数 x について、不等式 x^2 + 2x + k > 0 が成り立つような定数 k の値の範囲を求めよ。",
    inequality: "x^2 + 2x + k > 0",
    condition: "D < 0 (判別式が負)",
    answer: "k > 1",
    k_val: 0,
    vertex_x: -1
  };
};
