import HintButton from '../../components/HintButton';

export default function AbsoluteValueViz() {
  return (
    <div>
      Viz
      <HintButton hints={[
        { step: 1, text: "y = |f(x)| のグラフは、y = f(x) のグラフで x 軸より下の部分を x 軸に関して折り返したものです。" },
        { step: 2, text: "|f(x)| >= 0 なので、絶対値のグラフは必ず x 軸の上側（または上）に来ます。" },
      ]} />
    </div>
  );
}
