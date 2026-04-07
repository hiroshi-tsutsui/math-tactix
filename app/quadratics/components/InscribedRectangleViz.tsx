'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot, Scatter } from 'recharts';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

const InscribedRectangleViz: React.FC = () => {
  const [t, setT] = useState(1); // The x-coordinate of the right vertex of the rectangle

  // The parabola is y = 4 - x^2
  // Domain for t is 0 < t < 2
  // The vertices of the rectangle are (t, 0), (t, 4-t^2), (-t, 4-t^2), (-t, 0)
  // Width = 2t, Height = 4-t^2
  // Area = 2t * (4 - t^2) = 8t - 2t^3 (Wait, cubic function is Math II!)

  return (
    <div>
      <HintButton hints={[
        { step: 1, text: "放物線 y = 4 - x² に内接する長方形の面積は S = 2t(4 - t²) です。" },
        { step: 2, text: "対称性を利用して、右半分の幅 t と高さ 4 - t² から面積を表します。" },
        { step: 3, text: "微分または平方完成で最大値を求めます。定義域 0 < t < 2 に注意しましょう。" },
      ]} />
    </div>
  );
};
export default InscribedRectangleViz;
