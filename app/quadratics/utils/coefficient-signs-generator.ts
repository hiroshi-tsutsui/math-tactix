export function generateCoefficientSignsProblem() {
  // Randomly generate a, b, c with constraints to make a nice graph
  const a = Math.random() > 0.5 ? 1 : -1;
  // Axis p = -b/2a. Let's make p non-zero, e.g., ±1 or ±2
  const p = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
  const b = -2 * a * p;
  // Vertex y = q. Let's make q non-zero and such that we have 2 roots, 1 root, or 0 roots.
  // Actually, standard problems always show 2 roots (D > 0)
  const q = a > 0 ? -1 - Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 3);
  const c = a * p * p + q;

  const D = b * b - 4 * a * c;
  const f_1 = a + b + c; // f(1)
  const f_minus_1 = a - b + c; // f(-1)

  // Target values to determine signs for
  const targets = ['a', 'b', 'c', 'b^2 - 4ac', 'a + b + c'];
  
  const expectedSigns = targets.map(t => {
    let val = 0;
    if (t === 'a') val = a;
    if (t === 'b') val = b;
    if (t === 'c') val = c;
    if (t === 'b^2 - 4ac') val = D;
    if (t === 'a + b + c') val = f_1;
    
    if (val > 0) return '+';
    if (val < 0) return '-';
    return '0';
  });

  return {
    id: Date.now(),
    title: "係数の符号判定",
    target: "与えられたグラフから、a, b, c, b²-4ac, a+b+c の符号を判定せよ。",
    type: "coefficient_signs",
    params: { a, b, c, p, q, D, f_1, f_minus_1 },
    expected: expectedSigns,
    options: ['+', '0', '-'],
    targets: targets,
    hint: "上に凸か下に凸か？ 軸の位置は？ y切片は？ x軸との交点は？ x=1のときのy座標は？"
  };
}
