export const generateCompletingSquareProblem = () => {
  // Simple generator for Completing the Square
  const a = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const b = (Math.floor(Math.random() * 5) + 1) * 2; // Even number 2 to 10 for simplicity
  const c = Math.floor(Math.random() * 10) - 5; // -5 to 4

  const equation = `y = ${a === 1 ? '' : a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`;
  const p = -b / (2 * a);
  const q = c - (b * b) / (4 * a);
  const vertexForm = `y = ${a}(x ${p >= 0 ? '-' : '+'}${Math.abs(p)})^2 ${q >= 0 ? '+' : ''}${q}`;

  return {
    id: `cs-${Date.now()}`,
    type: 'completing_square',
    question: '次の2次関数を平方完成しなさい。',
    equation: equation,
    explanation: [
      `まずは $x^2$ の係数 ${a} でくくります。`,
      `次に $(x + \\alpha)^2$ の形を作ります。`,
      `最後に定数項を整理すると、頂点は (${p}, ${q}) とわかります。`,
      `答え: ${vertexForm}`
    ]
  };
};
