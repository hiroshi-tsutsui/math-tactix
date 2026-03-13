import React, { useState } from 'react';

export const ChordLengthViz: React.FC = () => {
  const [m, setM] = useState(1);
  return (
    <div className="p-4 bg-white text-black border rounded shadow">
      <h3 className="text-xl font-bold mb-2">放物線の弦の長さ (Chord Length of Parabola)</h3>
      <p>直線 y = {m}x + 2 と放物線 y = x^2 の交点間の距離を視覚化します。</p>
      <input type="range" min="-3" max="3" step="0.5" value={m} onChange={e => setM(parseFloat(e.target.value))} />
      <div className="mt-4 p-4 bg-gray-100 rounded">
        グラフと弦の長さの計算がここに表示されます。
      </div>
    </div>
  );
};
