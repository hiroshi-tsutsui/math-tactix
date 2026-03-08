export const generateQuadraticInequalityProblem = (): any => {
  // Pattern 1: (x-a)(x-b) > 0 or < 0
  // Pattern 2: (x-a)^2 > 0 or < 0 (Touching axis)
  // Pattern 3: D < 0 (Floating)

  const pattern = Math.random();
  let a, b, c;
  let inequalitySign: '>' | '<' | '>=' | '<=';
  let answer = "";
  let explanation = "";

  if (pattern < 0.6) {
    // Standard two roots
    const root1 = Math.floor(Math.random() * 5) - 2; // -2 to 2
    const dist = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const root2 = root1 + dist;
    
    // Expand (x-r1)(x-r2) = x^2 - (r1+r2)x + r1*r2
    a = 1;
    b = -(root1 + root2);
    c = root1 * root2;
    
    inequalitySign = Math.random() > 0.5 ? '>' : '<';
    
    if (inequalitySign === '>') {
      answer = `x < ${root1}, ${root2} < x`;
      explanation = `グラフが x軸より上にある範囲を求めます。\n(x-${root1})(x-${root2}) > 0\nよって、x < ${root1}, ${root2} < x`;
    } else {
      answer = `${root1} < x < ${root2}`;
      explanation = `グラフが x軸より下にある範囲を求めます。\n(x-${root1})(x-${root2}) < 0\nよって、${root1} < x < ${root2}`;
    }
  } else if (pattern < 0.8) {
    // Touching axis (Perfect Square)
    const root = Math.floor(Math.random() * 5) - 2;
    a = 1;
    b = -2 * root;
    c = root * root;
    
    // (x-r)^2
    inequalitySign = Math.random() > 0.5 ? '>' : '<';
    if (Math.random() > 0.5) inequalitySign += '=';

    if (inequalitySign === '>') {
      answer = `${root} 以外のすべての実数`;
      explanation = `(x-${root})^2 > 0\n頂点で0になる以外は常に正です。`;
    } else if (inequalitySign === '>=') {
        answer = `すべての実数`;
        explanation = `(x-${root})^2 >= 0\n2乗は常に0以上です。`;
    } else if (inequalitySign === '<') {
        answer = `なし`;
        explanation = `(x-${root})^2 < 0\n2乗が負になることはありません。`;
    } else { // <=
        answer = `x = ${root}`;
        explanation = `(x-${root})^2 <= 0\n0になるのは x=${root} のみです。`;
    }
  } else {
    // Floating (D < 0)
    a = 1;
    b = (Math.floor(Math.random() * 3) + 1) * 2; // Even number 2, 4, 6
    // b^2 - 4ac < 0 => 4ac > b^2 => c > b^2/4
    c = (b*b)/4 + Math.floor(Math.random() * 3) + 1;
    
    inequalitySign = Math.random() > 0.5 ? '>' : '<';
    
    if (inequalitySign === '>') {
        answer = `すべての実数`;
        explanation = `平方完成すると (x+${b/2})^2 + ${c - (b*b)/4} > 0\n頂点のy座標が正なので、常に成り立ちます。`;
    } else {
        answer = `なし`;
        explanation = `グラフは常にx軸より上にあります。\nよって解なし。`;
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'quadratic_inequality',
    question: `次の2次不等式を解け。`,
    equation: `x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} ${inequalitySign} 0`,
    params: { a, b, c, inequalitySign },
    answer,
    explanation
  };
};
