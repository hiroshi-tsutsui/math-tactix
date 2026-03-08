import { Problem } from '../types';

export const generateDeterminationProblem = (): Problem => {
  const types = ['vertex_point', 'three_points', 'axis_points', 'intercepts_point'];
  const selectedType = types[Math.floor(Math.random() * types.length)];

  let question = '';
  let equation = '';
  let explanation: string | string[] = '';
  let params = {};

  switch (selectedType) {
    case 'vertex_point':
      // Vertex (p, q), Point (x1, y1)
      // y = a(x-p)^2 + q
      const p = Math.floor(Math.random() * 5) - 2; // -2 to 2
      const q = Math.floor(Math.random() * 5) - 2; // -2 to 2
      let a = Math.floor(Math.random() * 3) + 1; // 1 to 3
      if (Math.random() > 0.5) a = -a;
      
      const x1 = p + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1); // x1 != p
      const y1 = a * (x1 - p) * (x1 - p) + q;

      question = `頂点が点 (${p}, ${q}) で、点 (${x1}, ${y1}) を通る二次関数を求めよ。`;
      equation = `y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2 ${q > 0 ? '+' : '-'} ${Math.abs(q)}`;
      
      explanation = [
        `頂点が (${p}, ${q}) なので、求める二次関数は`,
        `$y = a(x - ${p})^2 + ${q}$ とおける。`,
        `点 (${x1}, ${y1}) を通るから、`,
        `$${y1} = a(${x1} - ${p})^2 + ${q}$`,
        `$${y1} = a(${x1 - p})^2 + ${q}$`,
        `$${y1} = ${Math.pow(x1-p, 2)}a + ${q}$`,
        `$${Math.pow(x1-p, 2)}a = ${y1 - q}$`,
        `$a = ${a}$`,
        `よって、$y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2 ${q >= 0 ? '+' : '-'} ${Math.abs(q)}$`
      ];
      params = { type: 'vertex_point', p, q, x1, y1, a };
      break;

    case 'axis_points':
      // Axis x = p, Points (x1, y1), (x2, y2)
      // y = a(x-p)^2 + q
      const axis = Math.floor(Math.random() * 5) - 2;
      let a2 = Math.floor(Math.random() * 3) + 1;
      if (Math.random() > 0.5) a2 = -a2;
      const q2 = Math.floor(Math.random() * 5) - 2;

      // Generate two points symmetric or not? No, just random x
      const xA = axis + 1;
      const yA = a2 * (xA - axis)**2 + q2;
      
      const xB = axis - 2;
      const yB = a2 * (xB - axis)**2 + q2;

      question = `軸が直線 x = ${axis} で、2点 (${xA}, ${yA}), (${xB}, ${yB}) を通る二次関数を求めよ。`;
      equation = `y = ${a2 === 1 ? '' : a2 === -1 ? '-' : a2}(x ${axis > 0 ? '-' : '+'} ${Math.abs(axis)})^2 ${q2 > 0 ? '+' : '-'} ${Math.abs(q2)}`;
      
      explanation = [
        `軸が $x = ${axis}$ なので、$y = a(x - ${axis})^2 + q$ とおける。`,
        `2点を通るから、代入して連立方程式を解く。`,
        `$(${xA}, ${yA})$ より: $${yA} = a(${xA} - ${axis})^2 + q \\Rightarrow ${yA} = a + q$ ...①`,
        `$(${xB}, ${yB})$ より: $${yB} = a(${xB} - ${axis})^2 + q \\Rightarrow ${yB} = 4a + q$ ...②`,
        `② - ① より: $${yB - yA} = 3a \\Rightarrow a = ${a2}$`,
        `① に代入: $${yA} = ${a2} + q \\Rightarrow q = ${q2}$`,
        `よって、$y = ${a2 === 1 ? '' : a2 === -1 ? '-' : a2}(x ${axis > 0 ? '-' : '+'} ${Math.abs(axis)})^2 ${q2 >= 0 ? '+' : '-'} ${Math.abs(q2)}$`
      ];
      params = { type: 'axis_points', axis, p1: {x: xA, y: yA}, p2: {x: xB, y: yB}, a: a2, q: q2 };
      break;

    case 'intercepts_point':
      // x-intercepts (alpha, 0), (beta, 0), Point (x1, y1)
      // y = a(x - alpha)(x - beta)
      const alpha = Math.floor(Math.random() * 3) - 3; // -3 to -1
      const beta = Math.floor(Math.random() * 3) + 1;  // 1 to 3
      let a3 = Math.floor(Math.random() * 2) + 1;
      if (Math.random() > 0.5) a3 = -a3;
      
      const xC = 0; // y-intercept usually easiest
      const yC = a3 * (xC - alpha) * (xC - beta);

      question = `x軸と2点 (${alpha}, 0), (${beta}, 0) で交わり、点 (${xC}, ${yC}) を通る二次関数を求めよ。`;
      equation = `y = ${a3 === 1 ? '' : a3 === -1 ? '-' : a3}(x ${alpha > 0 ? '-' : '+'} ${Math.abs(alpha)})(x ${beta > 0 ? '-' : '+'} ${Math.abs(beta)})`;
      
      explanation = [
        `x軸との交点が $(${alpha}, 0), (${beta}, 0)$ なので、`,
        `求める関数は $y = a(x - (${alpha}))(x - ${beta})$ とおける。`,
        `つまり $y = a(x ${alpha < 0 ? '+' : '-'} ${Math.abs(alpha)})(x ${beta < 0 ? '+' : '-'} ${Math.abs(beta)})$`,
        `点 $(${xC}, ${yC})$ を通るから、`,
        `$${yC} = a(${xC} ${alpha < 0 ? '+' : '-'} ${Math.abs(alpha)})(${xC} ${beta < 0 ? '+' : '-'} ${Math.abs(beta)})$`,
        `$${yC} = a(${xC - alpha})(${xC - beta})$`,
        `$${yC} = ${ (xC - alpha)*(xC - beta) }a$`,
        `$a = ${a3}$`,
        `よって、$y = ${a3 === 1 ? '' : a3 === -1 ? '-' : a3}(x ${alpha > 0 ? '-' : '+'} ${Math.abs(alpha)})(x ${beta > 0 ? '-' : '+'} ${Math.abs(beta)})$`
      ];
      params = { type: 'intercepts_point', alpha, beta, p1: {x: xC, y: yC}, a: a3 };
      break;

    case 'three_points':
      // General form y = ax^2 + bx + c
      // Use small integers to keep math simple
      // (0, c), (1, a+b+c), (-1, a-b+c) is easiest pattern
      let a4 = Math.floor(Math.random() * 3) + 1;
      if (Math.random() > 0.5) a4 = -a4;
      let b4 = Math.floor(Math.random() * 5) - 2;
      let c4 = Math.floor(Math.random() * 5) - 2;
      
      const pA = { x: 0, y: c4 };
      const pB = { x: 1, y: a4 + b4 + c4 };
      const pC = { x: -1, y: a4 - b4 + c4 };

      question = `3点 (${pA.x}, ${pA.y}), (${pB.x}, ${pB.y}), (${pC.x}, ${pC.y}) を通る二次関数を求めよ。`;
      equation = `y = ${a4 === 1 ? '' : a4 === -1 ? '-' : a4}x^2 ${b4 === 0 ? '' : (b4 > 0 ? '+' : '-') + (Math.abs(b4) === 1 ? '' : Math.abs(b4)) + 'x'} ${c4 === 0 ? '' : (c4 > 0 ? '+' : '-') + Math.abs(c4)}`;
      
      explanation = [
        `一般形 $y = ax^2 + bx + c$ とおく。`,
        `点 $(0, ${c4})$ を通るから、$c = ${c4}$`,
        `点 $(1, ${pB.y})$ を通るから、$${pB.y} = a + b + c$ ...①`,
        `点 $(-1, ${pC.y})$ を通るから、$${pC.y} = a - b + c$ ...②`,
        `$c = ${c4}$ を①②に代入して整理すると、`,
        `$a + b = ${pB.y - c4}$`,
        `$a - b = ${pC.y - c4}$`,
        `辺々足すと $2a = ${ (pB.y - c4) + (pC.y - c4) } \\Rightarrow a = ${a4}$`,
        `辺々引くと $2b = ${ (pB.y - c4) - (pC.y - c4) } \\Rightarrow b = ${b4}$`,
        `よって、$y = ${a4 === 1 ? 'x^2' : (a4 === -1 ? '-x^2' : `${a4}x^2`)} ${b4 === 0 ? '' : (b4 > 0 ? `+${b4 === 1 ? '' : b4}x` : `${b4 === -1 ? '-' : b4}x`)} ${c4 === 0 ? '' : (c4 > 0 ? `+${c4}` : c4)}$`
      ];
      params = { type: 'three_points', p1: pA, p2: pB, p3: pC, a: a4, b: b4, c: c4 };
      break;
  }

  return {
    id: `determination-${Date.now()}`,
    type: 'determination',
    question,
    equation,
    explanation,
    params
  };
};
