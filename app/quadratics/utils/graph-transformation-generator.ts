
export interface GraphTransformationProblem {
  id: string;
  type: 'graph_transformation';
  question: string;
  equation: string;
  original: { a: number; p: number; q: number };
  transformation: {
    type: 'translation' | 'symmetry_x' | 'symmetry_y' | 'symmetry_origin';
    dx?: number;
    dy?: number;
  };
  answer: { a: number; p: number; q: number };
  explanation: string[];
}

export function generateGraphTransformationProblem(): GraphTransformationProblem {
  const typeRoll = Math.random();
  let type: 'translation' | 'symmetry_x' | 'symmetry_y' | 'symmetry_origin';

  if (typeRoll < 0.5) {
    type = 'translation';
  } else if (typeRoll < 0.7) {
    type = 'symmetry_x';
  } else if (typeRoll < 0.9) {
    type = 'symmetry_y';
  } else {
    type = 'symmetry_origin';
  }

  // Base parameters for y = a(x-p)^2 + q
  // Keep numbers small for mental math
  const a = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1); // 1, 2, -1, -2
  const p = Math.floor(Math.random() * 7) - 3; // -3 to 3
  const q = Math.floor(Math.random() * 7) - 3; // -3 to 3

  let question = "";
  let answer = { a, p, q };
  let explanation: string[] = [];

  const originalEq = formatVertexForm(a, p, q);

  if (type === 'translation') {
    const dx = (Math.floor(Math.random() * 5) - 2) || 1; // avoid 0
    const dy = (Math.floor(Math.random() * 5) - 2) || 1; // avoid 0
    
    question = `放物線 $${originalEq}$ を $x$軸方向に $${dx}$、 $y$軸方向に $${dy}$ だけ平行移動した放物線の方程式を求めよ。`;
    
    answer.p = p + dx;
    answer.q = q + dy;
    answer.a = a;

    explanation = [
      `平行移動の基本ルールを確認しましょう。`,
      `x軸方向に +${dx} $\\to$ x を $(x - (${dx}))$ に置き換え`,
      `y軸方向に +${dy} $\\to$ y を $(y - (${dy}))$ に置き換え`,
      `頂点の移動で考えると簡単です。`,
      `元の頂点: $(${p}, ${q})$`,
      `移動後の頂点: $(${p} + ${dx}, ${q} + ${dy}) = (${answer.p}, ${answer.q})$`,
      `よって、求める式は $${formatVertexForm(answer.a, answer.p, answer.q)}$ です。`
    ];

  } else if (type === 'symmetry_x') {
    question = `放物線 $${originalEq}$ を $x$軸に関して対称移動した放物線の方程式を求めよ。`;
    // y -> -y
    // -y = a(x-p)^2 + q  =>  y = -a(x-p)^2 - q
    answer.a = -a;
    answer.p = p;
    answer.q = -q;

    explanation = [
      `x軸対称 $\\to$ y の符号が変わります ($y \\to -y$)。`,
      `$-y = ${formatVertexForm(a, p, q).substring(4)}$`, // remove "y = "
      `両辺に -1 を掛けて、$y = ${formatVertexForm(answer.a, answer.p, answer.q)}$ となります。`,
      `頂点で考えると: $(${p}, ${q}) \\to (${p}, ${-q})$`
    ];

  } else if (type === 'symmetry_y') {
    question = `放物線 $${originalEq}$ を $y$軸に関して対称移動した放物線の方程式を求めよ。`;
    // x -> -x
    // y = a(-x-p)^2 + q = a(-(x+p))^2 + q = a(x+p)^2 + q
    answer.a = a;
    answer.p = -p;
    answer.q = q;

    explanation = [
      `y軸対称 $\\to$ x の符号が変わります ($x \\to -x$)。`,
      `$x$ の部分を $(-x)$ に置き換えます。`,
      `$(-x - ${p})^2 = (-(x + ${p}))^2 = (x + ${p})^2$`,
      `よって、$y = ${formatVertexForm(answer.a, answer.p, answer.q)}$ となります。`,
      `頂点で考えると: $(${p}, ${q}) \\to (${-p}, ${q})$`
    ];

  } else if (type === 'symmetry_origin') {
    question = `放物線 $${originalEq}$ を 原点に関して対称移動した放物線の方程式を求めよ。`;
    // x -> -x, y -> -y
    // -y = a(-x-p)^2 + q => y = -a(x+p)^2 - q
    answer.a = -a;
    answer.p = -p;
    answer.q = -q;

    explanation = [
      `原点対称 $\\to$ x と y 両方の符号が変わります。`,
      `頂点で考えると一番早いです。`,
      `元の頂点: $(${p}, ${q})$`,
      `原点対称後の頂点: $(${p} \\times -1, ${q} \\times -1) = (${-p}, ${-q})$`,
      `グラフの開き具合 ($a$) も符号が逆になります ($${a} \\to ${-a}$)。`,
      `よって、$y = ${formatVertexForm(answer.a, answer.p, answer.q)}$ です。`
    ];
  }

  return {
    id: `gt-${Date.now()}`,
    type: 'graph_transformation',
    question,
    equation: originalEq,
    original: { a, p, q },
    transformation: type === 'translation' ? { type, dx: 0, dy: 0 } : { type }, // simplify for now
    answer,
    explanation
  };
}

function formatVertexForm(a: number, p: number, q: number): string {
  // y = a(x-p)^2 + q
  let str = "y = ";
  
  if (a === -1) str += "-";
  else if (a !== 1) str += a;

  if (p === 0) {
    str += "x^2";
  } else {
    str += `(x ${p > 0 ? '-' : '+'} ${Math.abs(p)})^2`;
  }

  if (q !== 0) {
    str += ` ${q > 0 ? '+' : '-'} ${Math.abs(q)}`;
  }

  return str;
}
