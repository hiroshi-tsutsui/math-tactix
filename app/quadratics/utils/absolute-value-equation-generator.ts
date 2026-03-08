import { Problem } from '../types';

interface AbsoluteValueEquationProblem extends Problem {
  type: 'absolute_value_equation';
  params: {
    a: number;
    k: number | null;
    mode: 'count' | 'range';
  };
}

export const generateAbsoluteValueEquationProblem = (): AbsoluteValueEquationProblem => {
  // Pattern: |x^2 - a^2| = k
  
  const a = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
  const a2 = a * a;
  
  // Decide question type: Count Solutions for specific k, or Range of k for 4 solutions
  const questionType = Math.random() < 0.6 ? 'count' : 'range';
  
  if (questionType === 'count') {
    // Generate k to cover different scenarios
    // 0: k < 0 (0 sols)
    // 1: k = 0 (2 sols)
    // 2: 0 < k < a^2 (4 sols)
    // 3: k = a^2 (3 sols)
    // 4: k > a^2 (2 sols)
    
    const scenario = Math.floor(Math.random() * 5);
    let k_val = 0;
    let answer = 0;
    let explanation = '';
    
    switch(scenario) {
      case 0:
        k_val = -1; 
        answer = 0;
        explanation = `右辺が負の数（$k < 0$）なので、絶対値（必ず0以上）と等しくなることはありません。よって解は0個です。`;
        break;
      case 1:
        k_val = 0;
        answer = 2;
        explanation = `右辺が0（$k = 0$）なので、グラフがx軸と接する（または交わる）点の数を見ます。$|x^2 - ${a2}| = 0 \\iff x^2 = ${a2}$ より $x = \\pm ${a}$ の2個です。`;
        break;
      case 2:
        k_val = Math.floor(Math.random() * (a2 - 1)) + 1;
        answer = 4;
        explanation = `右辺 $k$ が $0 < k < ${a2}$ の範囲にあるとき、直線 $y=k$ は $W$型のグラフの山（高さ${a2}）の下を通るため、4点で交わります。`;
        break;
      case 3:
        k_val = a2;
        answer = 3;
        explanation = `右辺 $k$ がちょうど山の頂点の高さ（$k = ${a2}$）と等しいとき、真ん中で接するため、交点は3個になります。`;
        break;
      case 4:
        k_val = a2 + Math.floor(Math.random() * 3) + 1;
        answer = 2;
        explanation = `右辺 $k$ が山の高さより大きい（$k > ${a2}$）とき、グラフの外側の2本の腕とだけ交わるため、交点は2個になります。`;
        break;
    }

    return {
      id: `abs-eq-${Date.now()}`,
      type: 'absolute_value_equation',
      question: `方程式 $|x^2 - ${a2}| = ${k_val}$ の実数解の個数を求めよ。`,
      equation: `|x^2 - ${a2}| = ${k_val}`,
      params: { a, k: k_val, mode: 'count' },
      answer: answer.toString(),
      explanation: [
        `$y = |x^2 - ${a2}|$ のグラフと直線 $y = ${k_val}$ の共有点の個数を考えます。`,
        explanation
      ]
    };
  } else {
    // Range for 4 solutions
    return {
      id: `abs-eq-${Date.now()}`,
      type: 'absolute_value_equation',
      question: `方程式 $|x^2 - ${a2}| = k$ が異なる4つの実数解を持つとき、定数 $k$ の値の範囲を求めよ。`,
      equation: `|x^2 - ${a2}| = k`,
      params: { a, k: null, mode: 'range' },
      answer: `0 < k < ${a2}`,
      explanation: [
        `$y = |x^2 - ${a2}|$ のグラフを描きます。`,
        `1. $y = x^2 - ${a2}$ (頂点 $(0, -${a2})$) の $x$軸より下の部分を折り返します。`,
        `2. 折り返された山の頂点は $(0, ${a2})$ です。`,
        `3. 直線 $y=k$ がこのグラフと4点で交わるのは、$x$軸 ($y=0$) と山の頂点 ($y=${a2}$) の間にあるときです。`,
        `よって、求める範囲は $0 < k < ${a2}$ です。`
      ]
    };
  }
};
