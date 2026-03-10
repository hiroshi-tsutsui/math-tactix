export const generateMovingRightEdgeProblem = () => {
    return {
        id: Date.now(),
        title: "定義域の一端が動く最大・最小",
        type: "moving_right_edge",
        question: "関数 y = x^2 - 4x (0 ≤ x ≤ a) について、最大値と最小値を求める場合分けを確認してください。",
        equation: "y = x^2 - 4x",
        target: "最大値・最小値",
        formula: "",
        hint: "最小値は「頂点が定義域に入るか」、最大値は「定義域の中央が軸を越えるか」に注目します。",
        expected: [],
        options: []
    };
};
