
export interface MovingAxisProblem {
  id: string;
  type: 'moving_axis';
  question: string;
  equation: string;
  domain: { start: number; end: number };
  paramLabel: string;
  answer: string;
  explanation: string[];
  problemType?: 'min' | 'max';
}

export function generateMovingAxisProblem(): MovingAxisProblem {
  // Fixed domain for simplicity: 0 <= x <= 2
  const domainStart = 0;
  const domainEnd = 2;
  const mid = (domainStart + domainEnd) / 2;

  // y = (x - a)^2 + q
  const q = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const equation = `y = (x - a)^2 + ${q}`;
  
  // Randomly choose Min or Max
  const problemType = Math.random() < 0.5 ? 'min' : 'max';

  let question = "";
  let explanation: string[] = [];

  if (problemType === 'min') {
    question = `関数 $y = (x - a)^2 + ${q}$ ($${domainStart} \\leqq x \\leqq ${domainEnd}$) について、最小値を求めよ。`;
    explanation = [
      `軸 $x = a$ の位置と定義域 ($${domainStart} \\leqq x \\leqq ${domainEnd}$) の関係で場合分けをします。`,
      `下に凸の放物線なので、最小値は「軸が定義域に近い」ほど小さくなります。`,
      ``,
      `1. 軸が定義域の左外 ($a < ${domainStart}$) のとき:`,
      `   グラフは定義域内で右上がり（単調増加）。よって左端 ($x=${domainStart}$) で最小。`,
      `2. 軸が定義域内 ($${domainStart} \\leqq a \\leqq ${domainEnd}$) のとき:`,
      `   頂点が含まれるので、頂点 ($x=a$) で最小。`,
      `3. 軸が定義域の右外 ($a > ${domainEnd}$) のとき:`,
      `   グラフは定義域内で右下がり（単調減少）。よって右端 ($x=${domainEnd}$) で最小。`
    ];
  } else {
    // Maximum
    question = `関数 $y = (x - a)^2 + ${q}$ ($${domainStart} \\leqq x \\leqq ${domainEnd}$) について、最大値を求めよ。`;
    explanation = [
      `軸 $x = a$ の位置と「定義域の中央」($x = ${mid}$) との関係で場合分けをします。`,
      `下に凸の放物線なので、最大値は「軸から遠い方の端点」になります。`,
      ``,
      `1. 軸が中央より左 ($a < ${mid}$) のとき:`,
      `   軸は定義域の左側に寄っているため、遠いのは右端です。よって $x=${domainEnd}$ で最大。`,
      `2. 軸が中央と一致 ($a = ${mid}$) のとき:`,
      `   左右対称となるため、両端 ($x=${domainStart}, ${domainEnd}$) で最大。`,
      `3. 軸が中央より右 ($a > ${mid}$) のとき:`,
      `   軸は定義域の右側に寄っているため、遠いのは左端です。よって $x=${domainStart}$ で最大。`
    ];
  }

  return {
    id: `ma-${Date.now()}`,
    type: 'moving_axis',
    question,
    equation,
    domain: { start: domainStart, end: domainEnd },
    paramLabel: 'a',
    answer: "場合分けによる（解説参照）",
    explanation,
    problemType
  };
}
