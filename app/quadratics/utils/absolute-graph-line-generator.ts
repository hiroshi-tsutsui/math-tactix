export interface AbsoluteGraphLineProblem {
  description: string;
  explanation: string;
  a: number;
  b: number;
  c: number;
}

export function generateAbsoluteGraphLineProblem(): AbsoluteGraphLineProblem {
  return {
    description: '関数 y = |x² - 4| のグラフと直線 y = x + k の共有点の個数を調べよ。',
    explanation: '絶対値の中身の正負で場合分けし、グラフを描きます。その後、直線 y = x + k を上下に動かして共有点の個数を視覚的に確認します。',
    a: 1,
    b: 0,
    c: -4
  };
}
