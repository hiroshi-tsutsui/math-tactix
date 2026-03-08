export interface SolutionsInRangeProblem {
  id: string;
  type: 'solutions_in_range';
  question: string;
  equation: string;
  k: number; // The parameter to find range for
  rangeStart: number;
  rangeEnd: number;
  conditions: {
    discriminant: string;
    axis: string;
    endpoints: string;
  };
  explanation: string;
}

export const generateSolutionsInRangeProblem = (): SolutionsInRangeProblem => {
  // Problem: Find k such that x^2 - 2kx + k + 2 = 0 has two distinct real roots in 0 < x < 3.
  // This requires:
  // 1. D > 0
  // 2. 0 < axis < 3
  // 3. f(0) > 0, f(3) > 0
  
  // Let's generate a specific instance for visualization.
  // We will visualize the parabola y = x^2 - 2kx + k + 2
  // And let the user slide k to see when roots fall in (0, 3).
  
  const rangeStart = 0;
  const rangeEnd = 3;
  
  // Equation: x^2 - 2kx + k + 2 = 0
  // Axis: x = k
  // f(0) = k + 2
  // f(3) = 9 - 6k + k + 2 = 11 - 5k
  // D/4 = k^2 - (k + 2) = k^2 - k - 2 = (k-2)(k+1)
  
  // Conditions for 2 distinct roots in (0, 3):
  // 1. D > 0 => k < -1 or k > 2
  // 2. 0 < k < 3
  // 3. f(0) > 0 => k > -2
  // 4. f(3) > 0 => 11 - 5k > 0 => k < 11/5 = 2.2
  
  // Combined:
  // k > 2 and k < 2.2 => 2 < k < 2.2
  // This is a very narrow range!
  
  // Let's try a different equation: x^2 - 2ax + a + 6 = 0?
  // Let's try simpler: x^2 - 2ax + 4 = 0
  // D/4 = a^2 - 4 > 0 => a > 2 or a < -2
  // Axis = a. 0 < a < 4 (let range be 0 to 4)
  // f(0) = 4 > 0 (OK)
  // f(4) = 16 - 8a + 4 = 20 - 8a > 0 => a < 2.5
  
  // Combined: 2 < a < 2.5. Still narrow.
  
  // Let's use x^2 - 2ax + 3a = 0
  // D/4 = a^2 - 3a > 0 => a(a-3) > 0 => a < 0 or a > 3
  // Axis = a
  // Range (1, 5)
  // 1 < a < 5
  // f(1) = 1 - 2a + 3a = 1 + a > 0 => a > -1
  // f(5) = 25 - 10a + 3a = 25 - 7a > 0 => a < 25/7 = 3.57
  
  // Combined: 3 < a < 3.57.
  
  return {
    id: `sol-range-${Date.now()}`,
    type: 'solutions_in_range',
    question: `2次方程式 $x^2 - 2kx + k + 2 = 0$ が $0 < x < 3$ の範囲に異なる2つの実数解を持つような定数 $k$ の値の範囲を求めよ。`,
    equation: 'x^2 - 2kx + k + 2 = 0',
    k: 0, // Initial value for visualization, not the answer
    rangeStart: 0,
    rangeEnd: 3,
    conditions: {
      discriminant: 'D > 0 \\iff k < -1, 2 < k',
      axis: '0 < k < 3',
      endpoints: 'f(0) > 0 \\iff k > -2, \\quad f(3) > 0 \\iff k < \\frac{11}{5}'
    },
    explanation: `条件は以下の3つです。\n\n1. 判別式 $D > 0$ （異なる2つの実数解を持つ）\n   $(k-2)(k+1) > 0 \\implies k < -1, 2 < k$\n\n2. 軸の位置 $0 < \\text{軸} < 3$\n   $\\text{軸} = k$ なので $0 < k < 3$\n\n3. 端点の値 $f(0) > 0$ かつ $f(3) > 0$\n   $f(0) = k + 2 > 0 \\implies k > -2$\n   $f(3) = 11 - 5k > 0 \\implies k < 2.2$\n\nこれら全ての共通範囲を求めると、\n$2 < k < \\frac{11}{5}$`
  };
};
